const fsPromises = require('fs/promises');
const path = require('path');

const sourceDir = path.join(__dirname, 'styles');
const bundle = path.join(__dirname, 'project-dist', 'bundle.css');

function filterFileType(fileNames, ext) {
  return fileNames.filter((fileName) => path.extname(fileName) === ext);
}

async function bundleStyles() {
  await fsPromises.writeFile(bundle, '');
  const files = await fsPromises.readdir(sourceDir);
  const cssFiles = filterFileType(files, '.css');

  for (let i = 0; i < cssFiles.length; i++) {
    const fileName = cssFiles[i];
    const source = path.join(sourceDir, fileName);

    const data = await fsPromises.readFile(source, 'utf-8');
    await fsPromises.appendFile(bundle, data);
  }
}

bundleStyles();
