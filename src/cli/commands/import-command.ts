import { Command } from './command.interface.js';
import { ConsoleLogger, Logger } from '../../shared/libs/logger/index.js';
import { DatabaseClient, MongoDatabaseClient } from '../../shared/libs/database-client/index.js';
import { DefaultUserService, UserModel, UserService } from '../../shared/modules/user/index.js';
import { TSVFileReader } from '../../shared/libs/file-reader/index.js';
import { getMongoURI } from '../../shared/helpers/index.js';
import { Offer } from '../../shared/types/index.js';
import { CommandType } from './const.js';

export class ImportCommand implements Command {
  private logger: Logger;
  private salt: string;
  private databaseClient: DatabaseClient;
  private userService: UserService;

  private async onImportedOffer(offer: Offer): Promise<void> {
    //this.logger.info('ImportedOffer: ', offer);
    //! временно
    const a = await this.userService.findOrCreate({ ...offer.host, password: '12345' }, this.salt);
    this.logger.info('result db ->', a);
  }

  private onCompleteImport(count: number) {
    this.logger.info(`${count} rows imported.`);
  }

  constructor() {
    this.onImportedOffer = this.onImportedOffer.bind(this);
    this.onCompleteImport = this.onCompleteImport.bind(this);

    this.logger = new ConsoleLogger();
    this.databaseClient = new MongoDatabaseClient(this.logger);
    this.userService = new DefaultUserService(this.logger, UserModel);
  }

  public getName(): string {
    return CommandType.Import;
  }

  public async execute(...parameters: string[]): Promise<void> {
    const [filename, databaseLogin, databasePassword, databaseHost, databasePort, databaseName, salt] = parameters;

    const uri = getMongoURI(databaseLogin, databasePassword, databaseHost, databasePort, databaseName);
    this.salt = salt;
    //! временно
    this.logger.info(this.salt);

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
