import 'reflect-metadata';
import { Container } from 'inversify';
import { Component } from './shared/types/index.js';
import { createRestApplicationContainer, RestApplication } from './rest/index.js';
import { createUserContainer } from './shared/modules/user/index.js';
import { createOfferContainer } from './shared/modules/offer/offer.container.js';

async function bootstrap() {
  const appContainer = Container.merge(
    createRestApplicationContainer(),
    createUserContainer(),
    createOfferContainer()
  );

  const application = appContainer.get<RestApplication>(Component.RestApplication);
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
  7. обязательно ли .exec()? для .findById(id).exec() и .findOne({...}).exec()
  8. Для описания пропа "type: UserType" обязательно ли указывать все? без указания все отрабоатывает
    @prop({
      required: true,
      type: () => String,
      enum: UserType
    })
    public type: UserType;
  9. а можно проще при запуске события EventEmitter.emit ?
      await new Promise((resolve) => {
        this.emit('line', parsedOffer, resolve);
      });
  10. всем полям UserEntity добавить трим?
  11. Координаты городов буду в константах, а в типе только название города. можно и БД закинуть.
      CityLocation[name]; // если появится 7й и т.д. город, то тут будет ошибка компиляции, т.к. необходимо заполнить координаты нового города
  12. Можно сделать для массива избранных у пользователя
      @prop({
        ref: CategoryEntity,
        required: true,
        default: [],
        _id: false
      })
    public categories!: Ref<CategoryEntity>[];
  13. без "implements Offer" у "export class OfferEntity extends defaultClasses.TimeStamps {"
      в следующих лекциях глянуть почему
  14. rating в CreateOfferDto и UpdateOfferDto, не вычисляемый? как количество комментариев?
  15. выборка OfferEntity: hostId -> host и пользователь без пароля
      может разные таблицы сделать?
  16. isFavorite у предложения в ДБ нет, появляется поле когда учтены избранные конкретного пользователя
  17. implements Offer и Review у Entity будет позднее?


  20. tsconfig добавил алиасы / vscode распознает пути, а копилятор нет
    node:internal/modules/run_main:129
      triggerUncaughtException(
    Error: Cannot find package '@shared/types' imported from src\shared\libs\offer-generator\tsv-offer-generator.ts
    пути сделал в коментариях...

  21. скрипты запуска js из dist
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

    ! Рабочий вариант для алиасов
      \src\cli\commands\generate-command.ts
        //import { TSVOfferGenerator } from '../../shared/libs/offer-generator/index.js';
        import { TSVOfferGenerator } from '#shared/libs/offer-generator/index.js';
        //import { TSVFileWriter } from '../../shared/libs/file-writer/index.js';
        import { TSVFileWriter } from '#shared/libs/file-writer/index.js';
        //import { getErrorMessage } from '../../shared/helpers/index.js';
        import { getErrorMessage } from '#shared/helpers/index.js';
        //import { MockServerData } from '../../shared/types/index.js';
        import { MockServerData } from '#shared/types/index.js';

      package.json
        "imports": {
          "#*": [
            "./dist/*"
          ]
        }
      ! так как после компиляции нет src, все в dist и для prod и для dev, ели указанj "rootDir": "./src" в tsconfig.json

      tsconfig.json
        "outDir": "./dist",
        "rootDir": "./src",
        "baseUrl": "./",
        "paths": {
          "#*": [
            "./src/*"
          ]
        },
       ! "paths": { "#*": ["./src/*"]} т.к. под linux VS Code ссылаеться на dist ! перепроверить! но под windows все ок без параметра

       ! Если в обоих поменять # на @, то VS Code начинает подставлять @ после указания в tsconfig.json, но при запуске не работает ни где!

Сделать
  + 1. из TSVFileReader выделить OfferParser

*/
