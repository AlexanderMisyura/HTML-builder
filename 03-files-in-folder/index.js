const { readdir, stat } = require('fs/promises');
const path = require('path');

const dirPath = path.join(__dirname, './secret-folder');

async function readFiles() {
  const files = await readdir(dirPath);

  for (const fileName of files) {
    const filePath = path.join(dirPath, fileName);
    const fileStat = await stat(filePath);

    if (fileStat.isFile()) {
      const ext = path.extname(fileName);
      const name = path.basename(fileName, ext);
      const size = fileStat.size;
      console.log(`${name} - ${ext.slice(1)} - ${size}B`);
    }
  }
}

readFiles();
