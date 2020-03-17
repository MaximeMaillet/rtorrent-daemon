const path = require('path');
const fs = require('fs');
const config = require('../config');
const transcodeService = require('../libraries/transcode');

module.exports.stream = async(req, res, next) => {
  try {
    const {file} = req.query;
    let filePath = `${config.stream_path}/${file.replace(path.extname(file), '')}.mp4`;
    if(!fs.existsSync(filePath)) {
      filePath = `${config.media_path}/${file}`;
      console.log(filePath)

      if(!fs.existsSync(filePath)) {
        return res.status(404).send();
      }
    }

    const da = await transcodeService.getMetaData(filePath);
    fs.writeFileSync(`${filePath.replace(path.extname(filePath), '')}.json`, JSON.stringify(da),{encoding:'utf8',flag:'w'}, (err, e) => {
      if(err) {
        console.log(err);
      }
    });

    const stat = fs.statSync(filePath);
    const fileSize = stat.size;
    const range = req.headers.range;
    console.log(`Start stream ${fileSize}`);
    if (range) {
      const parts = range.replace(/bytes=/, "").split("-");
      const start = parseInt(parts[0], 10);
      const end = parts[1] ? parseInt(parts[1], 10) : fileSize-1;
      const chunksize = (end-start)+1;
      const file = fs.createReadStream(filePath, {start, end});
      const head = {
        'Content-Range': `bytes ${start}-${end}/${fileSize}`,
        'Accept-Ranges': 'bytes',
        'Content-Length': chunksize,
        'Content-Type': 'video/mp4',
      };
      res.writeHead(206, head);
      file.pipe(res);
    } else {
      const head = {
        'Content-Length': fileSize,
        'Content-Type': 'video/mp4',
      };
      res.writeHead(200, head)
      fs.createReadStream(filePath).pipe(res)
    }
  } catch(e) {
    next(e);
  }
};