export enum CommandType {
  Version = '--version',
  Help = '--help',
  Import = '--import',
  Generate = '--generate'
}

export const COMMANDS_INFO = `
        Программа для подготовки данных для REST API сервера.
        Пример:
            cli.js --<command> [--arguments]
        Команды:
            --version:                   # выводит номер версии
            --help:                      # печатает этот текст
            --import <path>:             # импортирует данные из TSV
            --generate <n> <path> <url>: # генерирует произвольное количество тестовых данных
`;
