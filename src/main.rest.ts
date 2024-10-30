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
  1. как задать для pino - console codepage - вместо вывода спец.символов (»,...) всякие артефакты, может это проблемма отображения PS?
          в лог файл пишет нормально.
  2. если использовать один экзепляр new ValidateObjectIdMiddleware('offerId')] для всех методах в контроллере?
  3. class-validator не срабатывает
        @IsObject location
  4. ParseTokenMiddleware
         подключено на все запросы. то необходимо ошибку отдать next(err) ?
  5. что еще придумать! getRandomStringEnumValue и убрать "as UserType" и "as CityName" хотябы в tsv.offer-generator.ts

Сделать:

Замечания по клиентской части:
  1. После удаления предложения нет обновления списка предложений и списка избранных предложений с сервера
      или удаления из полученных списков предложений и из списка избранных предложений
  2. После добавления коментария нет обновления рейтинга предложения,
      нужно либо запросить детальное предложение, либо в добавленном отзыве добавить обновленный рейтинг предложения
  3. После попытки сохранить предложение в форме добавления/редактирования, ошибки валидации не отображаються под полями ввода
       или во вспывающем сообщением добавить информацию
*/
