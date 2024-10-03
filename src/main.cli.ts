#!/usr/bin/env node

import 'reflect-metadata'; // временно
import { resolve } from 'path';
import { CLIApplication, GenerateCommand, HelpCommand, ImportCommand, VersionCommand } from './cli/index.js';
import { PinoLogger } from './shared/libs/logger/pino.logger.js';
import { getCurrentModuleDirectoryPath } from './shared/helpers/index.js';
import { LOG_PATH } from './const.js';

function bootstrap() {
  const cliApplication = new CLIApplication();
  cliApplication.registerCommands([
    new HelpCommand(),
    new VersionCommand(),
    new ImportCommand(),
    new GenerateCommand()
  ]);

  const modulePath = getCurrentModuleDirectoryPath();
  const srcPath = '../../../';
  const logPath = resolve(modulePath, srcPath, LOG_PATH);

  new PinoLogger(logPath);
  /*
  const modulePath = getCurrentModuleDirectoryPath();
  const srcPath = '../../../';
  const destination = resolve(modulePath, srcPath, LOG_PATH);
  console.log('11111111', destination);
  */

  cliApplication.processCommand(process.argv);
}

bootstrap();
