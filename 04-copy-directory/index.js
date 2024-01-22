const { readdir, copyFile, mkdir, rm, stat } = require('fs/promises');
const path = require('path');

const copyFromPath = path.join(__dirname, 'files');
const copyToPath = path.join(__dirname, 'files-copy');

async function copyDir(from, to) {
  const dirContents = await readdir(from);

  for (const dirItem of dirContents) {
    const itemStat = await stat(path.join(from, dirItem));
    const source = path.join(from, dirItem);
    const target = path.join(to, dirItem);
    if (itemStat.isDirectory()) {
      await copyDir(source, target);
    }
    if (itemStat.isFile()) {
      await mkdir(path.dirname(target), { recursive: true });
      await copyFile(source, target);
    }
  }
}

async function resetDir(from, to) {
  let files;
  try {
    files = await readdir(to);
  } catch (err) {
    await mkdir(to);
  }

  if (files) {
    for (const fileName of files) {
      const removePath = path.join(to, fileName);
      await rm(removePath, { recursive: true });
    }
  }

  await copyDir(from, to);
}

resetDir(copyFromPath, copyToPath);
