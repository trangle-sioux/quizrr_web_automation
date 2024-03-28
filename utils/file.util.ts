import * as fs from 'node:fs';
import path, { resolve } from 'path';

export function createFolderIfNotExists(folderPath: string) {
  const dir = resolve(folderPath);
  if (!fs.existsSync(dir)) {
    try {
      fs.mkdirSync(dir);
    } catch (e) {
      fs.mkdirSync(path.dirname(dir));
      fs.mkdirSync(dir);
    }
  }
}

export function removeFileIfExists(folderPath: string, fileName: string) {
  const filePath = `${folderPath}/${fileName}`;
  if (fs.existsSync(filePath)) {
    // Delete the file
    fs.unlinkSync(filePath);
  }
}

export function removeAllFilesWithExtension(
  folderPath: string,
  extension: string,
) {
  // Read the contents of the folder
  const files = fs.readdirSync(folderPath);

  for (const file of files) {
    // Check if the file has the .xlsx extension
    if (file.endsWith(extension)) {
      const filePath = `${folderPath}/${file}`;
      // Delete the file
      fs.unlinkSync(filePath);
    }
  }
}
