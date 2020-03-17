const cors = require('cors');

module.exports.apply = cors({
  optionsSuccessStatus: 200,
  credentials: true,
  origin: function(origin, callback) {
    const whitelist = ['http://localhost:3000'];
    console.log(origin);
    if (origin && whitelist.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  allowedHeaders: ['*'],
});