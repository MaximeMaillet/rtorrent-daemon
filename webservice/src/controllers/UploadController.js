const fs = require('fs');
const torrentsPath = '/var/rtorrent/torrents';

module.exports.upload = async(req, res, next) => {
  try {
    const {torrents} = req.files;
    const errors = [];

    for(let i=0; i<torrents.length; i++) {
      const newPath = `${torrentsPath}/${torrents[i].originalname}`;

      if(torrents[i].mimetype !== 'application/x-bittorrent') {
        errors.push({
          filename: torrents[i].originalname,
          mimetype: torrents[i].mimetype,
          message: 'Mime Type not authorized',
        });
        continue;
      }

      if(fs.existsSync(newPath)) {
        errors.push({
          filename: torrents[i].originalname,
          message: 'This file already exists',
        });
        continue;
      }

      fs.copyFileSync(torrents[i].path, newPath);
      fs.unlinkSync(torrents[i].path);
    }

    if(errors.length > 0) {
      res
        .type('json')
        .send({
          errors,
        })
      ;
    } else {
      res
        .type('json')
        .send({
          message: 'success'
        })
      ;
    }
  } catch (e) {
    next(e);
  }
};