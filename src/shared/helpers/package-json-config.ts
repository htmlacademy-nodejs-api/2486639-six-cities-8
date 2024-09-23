import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

type PackageJSONConfig = {
  version: string;
}

function isPackageJSONConfig(value: unknown): value is PackageJSONConfig {
  return (
    typeof value === 'object'
    && value !== null
    && !Array.isArray(value)
    && Object.hasOwn(value, 'version')
  );
}

function readVersion(filePath: string): string {
  const jsonContent = readFileSync(resolve(filePath), 'utf-8');
  const importedContent: unknown = JSON.parse(jsonContent);

  if (!isPackageJSONConfig(importedContent)) {
    throw new Error('Failed to parse json content.');
  }

  return importedContent.version;
}

export function getPackageVersion(filePath: string = 'package.json'): string {
  let version = '';

  try {
    version = readVersion(filePath);
  } catch (error: unknown) {
    throw new Error(`Failed to read version from ${filePath}`);
  }

  return version;
}
