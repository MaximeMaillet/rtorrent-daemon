require('dotenv').config();
const fs = require('fs');
const axios = require('axios');
const webHooks = (process.env.WEBHOOK_URLS || '').split(',');

function writeLog(logs) {
  fs.appendFile('/var/rtorrent/logs/webhooks.log', `${logs}\n`, function (err) {
    if (err) {
      console.log(err);
    } else {
      console.log('Saved!');
    }
  });
}

for(let i=0; i<webHooks.length; i++) {
  axios.get(`${webHooks[i]}?file=${encodeURIComponent(process.argv[2].replace('/var/rtorrent/downloaded', ''))}`)
    .then(() => {
      writeLog(`[${webHooks[i]}] - Web hook sended`);
    })
    .catch(function (error) {
      writeLog(`[${webHooks[i]}] - ${error.message}`);
    });
}