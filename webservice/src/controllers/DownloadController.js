const fs = require('fs');
const downloadedPath = '/var/rtorrent/downloaded';

module.exports.download = async(req, res, next) => {
  try {
    const {file} = req.query;
    let filePath = `${downloadedPath}/${file}`;

    if(!fs.existsSync(filePath)) {
      return res.type('json').status(404).send(filePath);
    }

    res.download(filePath);
  } catch(e) {
    next(e);
  }
};

module.exports.getTorrent = async(req, res, next) => {
  try {

  } catch(e) {
    next(e);
  }
};