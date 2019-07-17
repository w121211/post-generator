// import { readdirSync, statSync, readdir } from 'fs';
// import * as path from 'path';

// function _scan(
//   dir: string,
//   extensions: string[] = [],
//   filePaths: string[] = []
// ): string[] {
//   const subFolders = [];
//   for (const f of readdirSync(dir)) {
//     const _stat = statSync(path.join(dir, f));
//     if (_stat.isDirectory()) subFolders.push(f);
//     else {

//     }
//   }

//   const folders = readdirSync(dir).filter(file =>
//     statSync(path.join(dir, file)).isDirectory()
//   );
//   folders.forEach(folder => {
//     filePaths.push(path.join(baseFolder, folder));
//     _scan(path.join(baseFolder, folder), folderList);
//   });
//   return filePaths;
// }

// export function scanDir(dir: string, extensions?: string[]): string[] {
//   const paths: string[] = [];

//   return paths;
// }
