import { readFileSync, readdirSync } from 'fs';
import path from 'path';
import { ValidationError } from '../errors/validation.error.util';

export function readJsonFile(jsonPath: string) {
  const data = readFileSync(jsonPath, 'utf8');
  return JSON.parse(data);
}

export function readJsonFilesInFolder(folderPath: string) {
  try {
    const files = readdirSync(folderPath);
    if (files.length === 1) {
      const file = files[0];
      // Check if the file has a .json extension
      if (path.extname(file) === '.json') {
        // Read the JSON file content
        const filePath = path.join(folderPath, file);
        return readJsonFile(filePath);
      } else {
        new ValidationError(`There is no JSON file in folder: ${folderPath}`);
      }
    }
  } catch (error) {
    console.error(`Error reading JSON files in folder: ${folderPath}`);
    return {};
  }
}
