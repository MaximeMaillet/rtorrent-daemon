const fs = require('fs');
const path = require('path');
const config = require('../config');

const fetchFiles = (container, parentDirectory, filters) => {
  let files = [];
  const absoluteDirectory = path.join(container,parentDirectory);
  const items = fs.readdirSync(absoluteDirectory);

  for(let i=0; i<items.length; i++) {
    const fileStat = fs.statSync(path.join(absoluteDirectory, items[i]));
    if(fileStat.isDirectory()) {
      files = files.concat(fetchFiles(container, path.join(parentDirectory, items[i]), filters));
    } else {
      if(filters && filters.indexOf(path.extname(items[i]).substring(1)) === -1) {
        continue;
      }

      files.push({
        absolute_path: path.join(absoluteDirectory, items[i]),
        parent: parentDirectory,
        file: items[i],
      });
    }
  }

  return files;
};

module.exports = {
  fetchFiles,
};