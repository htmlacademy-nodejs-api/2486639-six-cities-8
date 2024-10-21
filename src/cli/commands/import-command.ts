import { Command } from './command.interface.js';
import { ConsoleLogger, Logger } from '../../shared/libs/logger/index.js';
import { DatabaseClient, MongoDatabaseClient } from '../../shared/libs/database-client/index.js';
import { DefaultUserService, UserModel, UserService } from '../../shared/modules/user/index.js';
import { DefaultOfferService, OfferModel, OfferService, UpdateOfferDto } from '../../shared/modules/offer/index.js';
import { DefaultReviewService, ReviewModel, ReviewService, CreateReviewDto } from '../../shared/modules/review/index.js';
import { TSVFileReader } from '../../shared/libs/file-reader/index.js';
import { getMongoURI } from '../../shared/helpers/index.js';
import { Offer } from '../../shared/types/index.js';
import { CommandType } from './const.js';

const DEFAULT_USER_PASSWORD = '12345';

export class ImportCommand implements Command {
  private logger: Logger;
  private salt: string;
  private databaseClient: DatabaseClient;
  private userService: UserService;
  private offerService: OfferService;
  private reviewService: ReviewService;

  private async saveOffer(offer: Offer) {
    const {
      title,
      description,
      publishDate,
      cityName,
      previewImage,
      images,
      isPremium,
      rating,
      type,
      rooms,
      maxAdults,
      price,
      goods,
      host,
      location
    } = offer;

    const hostEntity = await this.userService.findOrCreate({
      ...host,
      password: DEFAULT_USER_PASSWORD
    }, this.salt);

    //! временно выключил для проверки сервисов
    /**/
    this.logger.info('New offer:', {
      title,
      description,
      publishDate,
      cityName,
      previewImage,
      images,
      isPremium,
      rating,
      type,
      rooms,
      maxAdults,
      price,
      goods,
      hostId: hostEntity.id,
      location
    });
    /**/
    /*
    await this.offerService.create({
      title,
      description,
      publishDate,
      cityName,
      previewImage,
      images,
      isPremium,
      rating,
      type,
      rooms,
      maxAdults,
      price,
      goods,
      hostId: hostEntity.id,
      location
    });
    */
  }

  private async onImportedOffer(offer: Offer, resolve: () => void): Promise<void> {
    await this.saveOffer(offer);

    resolve();
  }

  private async onCompleteImport(count: number) {
    this.logger.info(`${count} rows imported.`);

    //! проверка сервисов
    const offerId = '6715d930924dfbd3e73a0fd1';
    const offer = await this.offerService.findById(offerId);
    this.logger.info('Finded offer:', offer);

    const updatedOfferDto = new UpdateOfferDto();
    updatedOfferDto.title = offer?.title;
    updatedOfferDto.title += ' update';
    const updatedOffer = await this.offerService.updateById(offerId, updatedOfferDto);
    this.logger.info('Updated offer:', updatedOffer);

    //const deletedOffer = await this.offerService.deleteById(offerId);
    //this.logger.info('Deleted offer:', deletedOffer);
    //this.logger.info('Finded offer:', await this.offerService.findById(offerId));

    const offers = await this.offerService.find();
    this.logger.info('Finded offers count:', offers.length);
    //this.logger.info('Finded offers:', offers);

    const fiveOffers = await this.offerService.find(5);
    this.logger.info('Finded offers count:', fiveOffers.length);
    //this.logger.info('Finded offers:', fiveOffers);

    const premiumOffers = await this.offerService.findPremium();
    this.logger.info('Finded offers count:', premiumOffers.length);
    //this.logger.info('Finded offers:', premiumOffers);

    this.logger.info('Inc review count:', await this.offerService.incReviewCount(offerId));
    this.logger.info('Inc review count:', await this.offerService.findById(offerId));

    const reviews = await this.reviewService.findByOfferId(offerId);
    if (reviews) {
      this.logger.info('Finded reviews count:', reviews.length);
      this.logger.info('Finded reviews:', reviews);
    } else {
      this.logger.info('Finded reviews count: 0');
    }

    const createdReviewDto = new CreateReviewDto();
    createdReviewDto.comment = 'comment comment comment comment';
    createdReviewDto.rating = 4;
    createdReviewDto.offerId = offerId;
    createdReviewDto.userId = '6715d930924dfbd3e73a0fcf';
    createdReviewDto.publishDate = new Date();

    const createdReview = await this.reviewService.create(createdReviewDto);
    this.logger.info('Created review:', createdReview);

    this.logger.info('Offer rating reviews:', await this.reviewService.getRatingOfferId(offerId));

    //!

    await this.databaseClient.disconnect();
  }

  constructor() {
    this.onImportedOffer = this.onImportedOffer.bind(this);
    this.onCompleteImport = this.onCompleteImport.bind(this);

    this.logger = new ConsoleLogger();
    this.databaseClient = new MongoDatabaseClient(this.logger);
    this.userService = new DefaultUserService(this.logger, UserModel);
    this.offerService = new DefaultOfferService(this.logger, OfferModel);
    this.reviewService = new DefaultReviewService(this.logger, ReviewModel);
  }

  public getName(): string {
    return CommandType.Import;
  }

  public async execute(...parameters: string[]): Promise<void> {
    const [filename, databaseLogin, databasePassword, databaseHost, databasePort, databaseName, salt] = parameters;

    const uri = getMongoURI(databaseLogin, databasePassword, databaseHost, databasePort, databaseName);
    this.salt = salt;

    await this.databaseClient.connect(uri);

    const fileReader = new TSVFileReader(filename.trim());

    fileReader.on('line', this.onImportedOffer);
    fileReader.on('end', this.onCompleteImport);

    try {
      fileReader.read();
    } catch (error: unknown) {
      this.logger.error(`Can't import data from file: ${filename}!`, error);
    }
  }
}
