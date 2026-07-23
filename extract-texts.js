const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'src');
const allTexts = new Set();

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
  // Match <Translate>Text</Translate>
  const tagsMatch = content.matchAll(/<Translate>(.*?)<\/Translate>/g);
  for (const match of tagsMatch) {
    if (match[1] && !match[1].startsWith('{')) {
      allTexts.add(match[1]);
    }
  }

  // Match useTranslateText("Text")
  const hookMatch = content.matchAll(/useTranslateText\("([^"]+)"\)/g);
  for (const match of hookMatch) {
    if (match[1]) {
      allTexts.add(match[1]);
    }
  }
});

const textsArray = Array.from(allTexts);
console.log(JSON.stringify(textsArray, null, 2));
