const express = require('express');
const router = require('express-imp-router');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const upload = multer({
  dest: '/tmp/uploads/'
});

const app = express();
router(app);
router.enableDebug();
router.route([
  {
    controllers: `${path.resolve('.')}/src/controllers`,
    middlewares: `${path.resolve('.')}/src/middlewares`,
    routes: {
      '/upload':{
        [router.IMP.MIDDLEWARE]: [
          {
            controllers: [upload.fields([
              { name: 'torrents'},
            ])]
          }
        ],
        post: (req, res, next) => {
          const {torrents} = req.files;
          const errors = [];

          for(let i=0; i<torrents.length; i++) {
            const newPath = `/var/rtorrent/torrents/${torrents[i].originalname}`;

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
        }
      },
    },
  }
]);

app.listen(8080);