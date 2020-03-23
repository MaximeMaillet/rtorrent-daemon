const multer = require('multer');

const upload = multer({
  dest: '/tmp/uploads/'
});

module.exports.torrent = upload.fields([
  { name: 'torrents', maxCount: 5},
]);