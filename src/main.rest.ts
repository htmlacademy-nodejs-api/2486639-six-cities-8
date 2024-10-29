import 'reflect-metadata';
import { Container } from 'inversify';
import { Component } from './shared/types/index.js';
import { createRestApplicationContainer, RestApplication } from './rest/index.js';
import { createAuthContainer } from './shared/modules/auth/index.js';
import { createUserContainer } from './shared/modules/user/index.js';
import { createOfferContainer } from './shared/modules/offer/index.js';
import { createReviewContainer } from './shared/modules/review/index.js';
import { createFavoriteContainer } from './shared/modules/favorite/index.js';

async function bootstrap() {
  const appContainer = Container.merge(
    createRestApplicationContainer(),
    createAuthContainer(),
    createUserContainer(),
    createOfferContainer(),
    createReviewContainer(),
    createFavoriteContainer()
  );

  const application = appContainer.get<RestApplication>(Component.RestApplication);
  await application.init();
}

bootstrap();

/*
Вопросы:
  1. а почему OFFER_TYPES не string[] и приходиться [...OFFER_TYPES]
    т.к. export const OFFER_TYPES = ['apartment', 'house', 'room', 'hotel'] as const;  и это не string[], а readonly ['..','..']
  2. а как передать параметр для конструктора? если понадобится
    container.bind<Logger>(Component.Logger).to(PinoLogger).inSingletonScope();
    как модель? toConstantValue? userContainer.bind<types.ModelType<UserEntity>>(Component.UserModel).toConstantValue(UserModel);
  3. название component.enum.ts в types? но там фактически перечисление, для enum нельзя исмользовать Symbol...
  4. установли @typegoose/typegoose в основные зависимости, но там же TS, а значит в зависимости разработки
  5. почему "пропадает" контекст this в ImportCommand.execute, после смены async для await подключения к БД
      this.onImportedOffer = this.onImportedOffer.bind(this);
      this.onCompleteImport = this.onCompleteImport.bind(this);
  6. обязательно ли .exec()? для .findById(id).exec() и .findOne({...}).exec()
  7. Для описания пропа "type: UserType" обязательно ли указывать все? без указания все отрабоатывает
    @prop({
      required: true,
      type: () => String,
      enum: UserType
    })
    public type: UserType;
  8. а можно проще при запуске события EventEmitter.emit ?
      await new Promise((resolve) => {
        this.emit('line', parsedOffer, resolve);
      });
  9. всем полям UserEntity добавить трим?
  10. Координаты городов буду в константах, а в типе только название города. можно и БД закинуть.
      CityLocation[name]; // если появится 7й и т.д. город, то тут будет ошибка компиляции, т.к. необходимо заполнить координаты нового города
  11. Можно сделать для массива избранных у пользователя
      @prop({
        ref: CategoryEntity,
        required: true,
        default: [],
        _id: false
      })
    public categories!: Ref<CategoryEntity>[];
  12. без "implements Offer" у "export class OfferEntity extends defaultClasses.TimeStamps {"
      в следующих лекциях глянуть почему
  13. rating в CreateOfferDto и UpdateOfferDto, не вычисляемый? как количество комментариев?
  14. выборка OfferEntity: hostId -> host и пользователь без пароля
      может разные таблицы сделать?
  15. isFavorite у предложения в ДБ нет, появляется поле когда учтены избранные конкретного пользователя
  16. implements Offer и Review у Entity будет позднее?
  17. последовательность регистрации пользователя, нужна ли updateAvatarPathById
  18. как задать для pino - console codepage - вместо вывода спец.символов (»,...) всякие артефакты, может это проблемма отображения PS?
          в лог файл пишет нормально.
  19. возможно стоит пароли у пользователя вынести в отдельную коллекцию, что бо контроллер не видел эти данные при выборке данных, или RDO делать на стороне сервиса...
  20. глянуть ТЗ, как передаеться город с клиента объектом с координатами или строкой?
  21. fillDTO(OfferRdo, result) от UserEntity оставляет только _id почему?
  22. GET http://localhost:5000/offers?count=absd если не число, то ошибка или count === undefined ?
  23. CreateOfferDto используеться для создания элемента в БД, но и как CreateOfferRequest = Request<RequestParams, RequestBody, CreateOfferDto>
        но hostId в CreateOfferRequest нету, может нужен отдельный тип?
      так же CreateReviewDto с userId и offerId
  24. перепроверить все запросы, особенно коментарии
  25. если использовать один экзепляр new ValidateObjectIdMiddleware('offerId')] для всех методах в контроллере?
  26. class-validator не сработало
        @IsObject location, @IsUrl images и previewImage
  27. ParseTokenMiddleware
         подключено на все запросы. то необходимо ошибку отдать next(err) ?
  28. city: this.getCity(dto.city)
        возможно другим способом заполнить данные или как будут приходить с клиента
  29. обязательно ли в ДТО все поля для передачи сервису БД, можно чать передать параметрами?
    CreateOfferDto, CreateReviewDto
  30. Еще не сделана обработка маршрутов для избранного и вывод!
  31. При удалении предложения, удалить из избранных и удалить коментарии
  32. Поставить ограничения на свое
  33. Загрузка аватара, убрать приватный, т.к. нет авторизации...
        может добавить, что пользователь недавно создан,
        если на фронте нет редактора профиля, но там будет авторизация и можно проверить что пользователь меняет свой аватар
        возможно сразу оба правила
        или param.userId === payload.id, но это снова авторизация...
        а откуда клиент знает id пользователя, если еще не авторизован...
        глянуть какие на клиенте будут запросы...
  34. Перепроверить описание ответов об ошибках 400 401 403... поменять описание, проверить использование ".notAllow" .notFound .noContent\
  35. PathTransformer проверить обработку массива строк Offer.images
  36. Проверить создание папки upload при первой загрузке изображения!
  37. что еще придумать! getRandomStringEnumValue и убрать "as UserType" и "as CityName" хотябы в tsv.offer-generator.ts
  38. await где async нужен?
  39. проверить пересчет рейтинга от коментариев


  50. tsconfig добавил алиасы / vscode распознает пути, а копилятор нет
    node:internal/modules/run_main:129
      triggerUncaughtException(
    Error: Cannot find package '@shared/types' imported from src\shared\libs\offer-generator\tsv-offer-generator.ts
    пути сделал в коментариях...

  51. скрипты запуска js из dist
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
      ! при запуске ts возможно есть проблемма импортов не из той папки! т.е. nodemon видит исправления, но после перезапуска берет скрипт из dist!
      ! при проверке запуска dev необходимо удалять папку dist!!!

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

Сделать:

*/
