// Create a FileRead class to read a file asynchronously

import * as fs from 'fs';
import * as path from 'path';

export class FileReader {
  public static async read(filePath: string): Promise<string[] | undefined> {
    try {
      console.log(`Reading file: ${path.resolve(filePath)}`);
      const fileData = await fs.readFileSync(path.resolve(filePath), 'utf-8');
      const variables = fileData.split('\n').map((line) => line.replace('\r', '')).filter((line) => line.length > 0);
      console.log(`Variables (${variables.length}):`);
      variables.forEach((variable, index) => { console.log(`${index+1}]: ${variable}`);});
      return variables;  
    } catch (error) {
      console.error(`Error reading file: ${path.resolve(filePath)}`);
      console.log(error);
    }
    return undefined
  }
}


