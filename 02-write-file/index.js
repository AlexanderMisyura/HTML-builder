const fs = require('fs');
const path = require('path');

const writableStream = fs.createWriteStream(path.join(__dirname, 'text.txt'));
console.log('hello, write your text');

function exitProgram() {
  console.log('good bye');
  process.exit();
}

process.stdin.on('data', (data) => {
  if (data.toString().trim() === 'exit') {
    return exitProgram();
  }
  writableStream.write(data);
});

process.on('SIGINT', exitProgram);
