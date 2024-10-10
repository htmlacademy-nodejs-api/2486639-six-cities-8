import 'reflect-metadata';
import { Container } from 'inversify';
import { Logger, PinoLogger } from './shared/libs/logger/index.js';
import { RestApplication } from './rest/index.js';
import { Config, RestConfig, RestSchema } from './shared/libs/config/index.js';
import { Component } from './shared/types/index.js';

async function bootstrap() {
  const container = new Container();
  container.bind<RestApplication>(Component.RestApplication).to(RestApplication).inSingletonScope();
  container.bind<Logger>(Component.Logger).to(PinoLogger).inSingletonScope();
  container.bind<Config<RestSchema>>(Component.Config).to(RestConfig).inSingletonScope();

  const application = container.get<RestApplication>(Component.RestApplication);

  await application.init();
}

bootstrap();

/*
Вопросы
  +1. краткий вызов getRandomItems(...) работает зачем дополнтильно указывать тип string?  getRandomItems<string>(...)
  2. а почему OFFER_TYPES не string[] и приходиться [...OFFER_TYPES]
    т.к. export const OFFER_TYPES = ['apartment', 'house', 'room', 'hotel'] as const;  и это не string[], а readonly ['..','..']
  3. а как передать параметр для конструктора? если понадобится
    container.bind<Logger>(Component.Logger).to(PinoLogger).inSingletonScope();
  4. название component.enum.ts в types? но там фактически перечисление, для enum нельзя исмользовать Symbol...
  5. установли @typegoose/typegoose в основные зависимости, но там же TS, а значит в зависимости разработки
  6. почему "пропадает" контекст this в ImportCommand.execute, после смены async для await подключения к БД
      this.onImportedOffer = this.onImportedOffer.bind(this);
      this.onCompleteImport = this.onCompleteImport.bind(this);


  10. tsconfig добавил алиасы / vscode распознает пути, а копилятор нет
    node:internal/modules/run_main:129
      triggerUncaughtException(
    Error: Cannot find package '@shared/types' imported from src\shared\libs\offer-generator\tsv-offer-generator.ts
    пути сделал в коментариях...

  11. скрипты запуска js из dist
    package.json
      start:cli
        добавил --no-warnings=ExperimentalWarning --experimental-specifier-resolution=node --loader ts-node/esm ./dist/src/main.cli.js",
        без --experimental-specifier-resolution=node  и  --loader ts-node/esm
          ошибка ERR_UNSUPPORTED_DIR_IMPORT, как и в ts
    есть еще
      --es-module-specifier-resolution=node
      "experimentalResolver": true
    без расширения ошибка!
    Error [ERR_MODULE_NOT_FOUND]: Cannot find module 'six-cities-api\dist\src\cli\index' imported from six-cities-api\dist\src\main.cli.js
    алиасы в проде не работают

    "ts-node": {
      "experimentalSpecifierResolution": "node",
      "experimentalResolver": true
    },
    "compilerOptions": {
      "module": "ESNext",
      "moduleResolution": "Node",

    .eslintrc.yaml
      rules:
        #  node/file-extension-in-import: warn
        node/file-extension-in-import: off

Сделать
  + 1. из TSVFileReader выделить OfferParser

*/
