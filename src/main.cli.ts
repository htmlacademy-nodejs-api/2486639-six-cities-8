#!/usr/bin/env node

import 'reflect-metadata'; // временно
import { resolve } from 'node:path';
import { CLIApplication, GenerateCommand, HelpCommand, ImportCommand, VersionCommand } from './cli/index.js';
import { PinoLogger } from './shared/libs/logger/pino.logger.js';
import { getSrcDirectoryPath } from './shared/helpers/index.js';
import { LOG_PATH } from './const.js';

function bootstrap() {
  const cliApplication = new CLIApplication();
  cliApplication.registerCommands([
    new HelpCommand(),
    new VersionCommand(),
    new ImportCommand(),
    new GenerateCommand()
  ]);

  new PinoLogger(resolve(getSrcDirectoryPath(), LOG_PATH));

  cliApplication.processCommand(process.argv);
}

bootstrap();
