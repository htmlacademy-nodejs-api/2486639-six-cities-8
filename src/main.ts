

/*
Вопросы
  1. краткий вызов getRandomItems(...) работает зачем дополнтильно указывать тип string?  getRandomItems<string>(...)
  1. а почему OFFER_TYPES не string[] и приходиться [...OFFER_TYPES]
    т.к. export const OFFER_TYPES = ['apartment', 'house', 'room', 'hotel'] as const;  и это не string[], а readonly ['..','..']

Сделать
  + 1. из TSVFileReader выделить OfferParser

*/
