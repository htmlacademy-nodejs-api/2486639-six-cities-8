import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

export function getRootDirectoryPath() {
  const filepath = fileURLToPath(import.meta.url);
  return resolve(dirname(filepath), '../../../');
}
