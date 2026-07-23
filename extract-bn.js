const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'src');
const bnTexts = new Set();

function walkSync(dir, filelist = []) {
  fs.readdirSync(dir).forEach(file => {
    const dirFile = path.join(dir, file);
    if (fs.statSync(dirFile).isDirectory()) {
      filelist = walkSync(dirFile, filelist);
    } else if (dirFile.endsWith('.tsx') || dirFile.endsWith('.ts')) {
      filelist.push(dirFile);
    }
  });
  return filelist;
}

const files = walkSync(srcDir);
files.forEach(file => {
  const content = fs.readFileSync(file, 'utf8');
  // Match string literals that contain Bengali characters
  // Using a regex to find content between single or double quotes or backticks that have Bengali chars
  const regex = /(['"`])(.*?[\u0980-\u09FF]+.*?)\1/g;
  let match;
  while ((match = regex.exec(content)) !== null) {
    let str = match[2].trim();
    if (str) bnTexts.add(str);
  }
  
  // Also match <Translate> text nodes that might have been missed
  const tagsMatch = content.matchAll(/<Translate>(.*?)<\/Translate>/g);
  for (const match of tagsMatch) {
    if (match[1] && !match[1].startsWith('{')) {
      bnTexts.add(match[1].trim());
    }
  }
});

const textsArray = Array.from(bnTexts);
console.log(JSON.stringify(textsArray, null, 2));
