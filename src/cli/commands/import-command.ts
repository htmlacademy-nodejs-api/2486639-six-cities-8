import { Command } from './command.interface.js';
import { ConsoleLogger, Logger } from '../../shared/libs/logger/index.js';
import { DatabaseClient, MongoDatabaseClient } from '../../shared/libs/database-client/index.js';
import { DefaultUserService, UserModel, UserService } from '../../shared/modules/user/index.js';
import { DefaultOfferService, OfferModel, OfferService } from '../../shared/modules/offer/index.js';
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

  private async saveOffer(offer: Offer) {
    const {
      title,
      description,
      publishDate,
      cityName,
      previewImage,
      images,
      isPremium,
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

    await this.offerService.create({
      title,
      description,
      publishDate,
      cityName,
      previewImage,
      images,
      isPremium,
      type,
      rooms,
      maxAdults,
      price,
      goods,
      hostId: hostEntity.id,
      location
    });
  }

  private async onImportedOffer(offer: Offer, resolve: () => void): Promise<void> {
    await this.saveOffer(offer);

    resolve();
  }

  private async onCompleteImport(count: number) {
    this.logger.info(`${count} rows imported.`);

    await this.databaseClient.disconnect();
  }

  constructor() {
    this.onImportedOffer = this.onImportedOffer.bind(this);
    this.onCompleteImport = this.onCompleteImport.bind(this);

    this.logger = new ConsoleLogger();
    this.databaseClient = new MongoDatabaseClient(this.logger);
    this.userService = new DefaultUserService(this.logger, UserModel);
    this.offerService = new DefaultOfferService(this.logger, OfferModel);
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
