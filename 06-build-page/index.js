const fsPromises = require('fs/promises');
const path = require('path');

const dist = path.join(__dirname, 'project-dist');
const template = path.join(__dirname, 'template.html');
const components = path.join(__dirname, 'components');
const styles = path.join(__dirname, 'styles');
const assets = path.join(__dirname, 'assets');

async function resetDir(dir) {
  let files;

  try {
    files = await fsPromises.readdir(dir);
  } catch {
    await fsPromises.mkdir(dir);
  }

  if (files) {
    for (const fileName of files) {
      const removePath = path.join(dir, fileName);
      await fsPromises.rm(removePath, { recursive: true });
    }
  }
}

async function fillTemplate(templatePath, componentsPath, targetPath) {
  let template = await fsPromises.readFile(templatePath, 'utf-8');
  const componentsFiles = await fsPromises.readdir(componentsPath);

  for (const component of componentsFiles) {
    if (path.extname(component) === '.html') {
      const componentContent = await fsPromises.readFile(
        path.join(componentsPath, component),
        'utf-8',
      );
      const componentName = path.basename(component, path.extname(component));
      template = template.replaceAll(`{{${componentName}}}`, componentContent);
    }
  }

  await fsPromises.writeFile(targetPath, template);
}

async function bundleStyles(sourceDir, targetPath) {
  const styleFiles = (await fsPromises.readdir(sourceDir)).filter(
    (fileName) => path.extname(fileName) === '.css',
  );
  await fsPromises.writeFile(targetPath, '');

  for (const styleName of styleFiles) {
    const stylePath = path.join(sourceDir, styleName);
    const styleContent = (await fsPromises.readFile(stylePath, 'utf-8')) + '\n';
    await fsPromises.appendFile(targetPath, styleContent);
  }
}

async function copyFiles(sourceDir, targetPath) {
  const dirContents = await fsPromises.readdir(sourceDir);
  for (const dirItem of dirContents) {
    const itemStat = await fsPromises.stat(path.join(sourceDir, dirItem));
    const source = path.join(sourceDir, dirItem);
    const target = path.join(targetPath, dirItem);
    if (itemStat.isDirectory()) {
      await fsPromises.mkdir(target, { recursive: true });
      await copyFiles(source, target);
    }
    if (itemStat.isFile()) {
      await fsPromises.copyFile(source, target);
    }
  }
}

async function build() {
  await resetDir(dist);
  await fillTemplate(template, components, path.join(dist, 'index.html'));
  await bundleStyles(styles, path.join(dist, 'style.css'));
  await copyFiles(assets, path.join(dist, 'assets'));
}

build();
