const { readdir, copyFile, mkdir, unlink } = require('fs/promises');
const path = require('path');

const copyFromPath = path.join(__dirname, 'files');
const copyToPath = path.join(__dirname, 'files-copy');

async function copyDir(from, to) {
  const files = await readdir(from);
  await Promise.all(
    files.map((fileName) => {
      const fromFile = path.join(from, fileName);
      const toFile = path.join(to, fileName);
      return copyFile(fromFile, toFile);
    }),
  );
}

async function resetDir(from, to) {
  let files;
  try {
    files = await readdir(to);
  } catch (err) {
    await mkdir(to);
  }

  if (files) {
    await Promise.all(
      files.map((fileName) => {
        const removeFile = path.join(to, fileName);
        return unlink(removeFile);
      }),
    );
  }

  await copyDir(from, to);
}

resetDir(copyFromPath, copyToPath);
