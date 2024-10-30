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
  10. implements Offer и Review у Entity будет позднее?
  11. как задать для pino - console codepage - вместо вывода спец.символов (»,...) всякие артефакты, может это проблемма отображения PS?
          в лог файл пишет нормально.
  12. GET http://localhost:5000/offers?count=absd если не число, то ошибка или count === undefined ?
  13. если использовать один экзепляр new ValidateObjectIdMiddleware('offerId')] для всех методах в контроллере?
  14. class-validator не срабатывает
        @IsObject location
  15. ParseTokenMiddleware
         подключено на все запросы. то необходимо ошибку отдать next(err) ?
  16. city: this.getCity(dto.city)
        возможно другим способом заполнить данные или как будут приходить с клиента
  17. обязательно ли в ДТО все поля для передачи сервису БД, можно чать передать параметрами?
    CreateOfferDto, CreateReviewDto
  18. что еще придумать! getRandomStringEnumValue и убрать "as UserType" и "as CityName" хотябы в tsv.offer-generator.ts
  19. await где async нужен?
  20. При удалении предложения, удалить из избранных и удалить коментарии
  21. при удалении предложения
          1. удалить избранное по его id - или оставить так
          2. удалить все отзывы
        может пометить удаленным дополнительным ключем и не зачищать БД?


Сделать:


Замечания по клиентской части:
  1. После удаления предложения нет обновления списка предложений и списка избранных предложений с сервера
      или удаления из полученных списков предложений и из списка избранных предложений
  2. После добавления коментария нет обновления рейтинга предложения,
      нужно либо запросить детальное предложение, либо в добавленном отзыве добавить обновленный рейтинг предложения
  3. После попытки сохранить предложение в форме добавления/редактирования, ошибки валидации не отображаються под полями ввода
       или во вспывающем сообщением добавить информацию
*/
