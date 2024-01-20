const fsPromises = require('fs/promises');
const fs = require('fs');
const path = require('path');

const sourceDir = path.join(__dirname, 'styles');
const bundle = path.join(__dirname, 'project-dist', 'bundle.css');

function filterFileType(fileNames, ext) {
  return fileNames.filter((fileName) => path.extname(fileName) === ext);
}

async function bundleStyles() {
  const files = await fsPromises.readdir(sourceDir);
  const cssFiles = filterFileType(files, '.css');

  for (let i = 0; i < cssFiles.length; i++) {
    const fileName = cssFiles[i];
    const flags = i === 0 ? 'w' : 'a';
    const source = path.join(sourceDir, fileName);
    const readableStream = fs.createReadStream(source);
    const writableStream = fs.createWriteStream(bundle, { flags });
    readableStream.pipe(writableStream);
  }
}

bundleStyles();
