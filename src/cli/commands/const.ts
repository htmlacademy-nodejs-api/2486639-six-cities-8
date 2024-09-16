export const COMMAND_PREFIX = '--';

export enum CommandType {
  Version = '--version',
  Help = '--help',
  Import = '--import',
  Generate = '--generate'
}

export const CommandTypeParams = {
  [CommandType.Version]: '',
  [CommandType.Help]: '',
  [CommandType.Import]: '<path>',
  [CommandType.Generate]: '<n> <path> <url>',
} as const;

export const CommandTypeInfo = {
  [CommandType.Version]: 'выводит номер версии',
  [CommandType.Help]: 'печатает этот текст',
  [CommandType.Import]: 'импортирует данные из TSV',
  [CommandType.Generate]: 'генерирует произвольное количество тестовых данных',
} as const;

export const HELP_TEXT = {
  Info: 'Программа для подготовки данных для REST API сервера.',
  Example: 'Пример',
  Commands: 'Команды'
} as const;

export const EXAMPLE = 'cli.js --<command> [--arguments]';

export const MAX_SPACE_COUNT = 30;
