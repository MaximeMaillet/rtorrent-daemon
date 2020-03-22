const express = require('express');
const router = require('express-imp-router');
const path = require('path');

const app = express();
app.use('/public', express.static('/var/rtorrent/downloaded'));
router(app);
router.enableDebug();
router.route([
  {
    controllers: `${path.resolve('.')}/src/controllers`,
    middlewares: `${path.resolve('.')}/src/middlewares`,
    routes: {
      [router.IMP.MIDDLEWARE]: [
        {
          controllers: ['cors#apply'],
          level: router.MIDDLEWARE.LEVEL.GLOBAL,
          inheritance: router.MIDDLEWARE.INHERITANCE.DESC,
        },
      ],
      '/upload':{
        [router.IMP.MIDDLEWARE]: [
          {
            controllers: ['upload#torrent']
          }
        ],
        post: 'UploadController#upload'
      },
      '/downloaded': {
        get: 'DownloadController#getDownloaded'
      },
      '/torrent': {
        get: 'DownloadController#getTorrent'
      }
    },
  }
]);

app.listen(8080);