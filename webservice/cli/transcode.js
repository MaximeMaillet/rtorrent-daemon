const fs = require('fs');
const path = require('path');
const transcodeService = require('../src/libraries/transcode');
const filesService = require('../src/libraries/files');
const config = require('../src/config');
const mkdirp = require('mkdirp');

const queuedForAll = async() => {
  const filesDownloaded = filesService.fetchFiles(config.media_path, '/', transcodeService.containersReachedAvailable);
  return (await handleAllFiles(filesDownloaded));
};

const queuedForOne = async(basePath) => {
  const filesDownloaded = filesService.fetchFiles(config.media_path, basePath.replace(config.media_path, ''));
  return (await handleAllFiles(filesDownloaded));
};

const handleAllFiles = async(files) => {
  const queue = [];
  for(let k=0; k<files.length; k++) {
    const transcodingData = await handleOneFile(files[k]);

    if(!transcodingData) {
      continue;
    }

    if(transcodingData.video.copy && transcodingData.audio.copy) {
      console.log(`Transcoding ready : ${transcodingData.target}`);
      continue;
    }

    if(!fs.existsSync(transcodingData.target)) {
      queue.push(transcodingData);
    } else {
      console.log(`Transcoding already done : ${transcodingData.target}`);
    }
  }

  return queue;
};

const handleOneFile = async(file) => {
  try {
    const transcodingData = {
      source: file.absolute_path,
      target: `${config.stream_path}${file.parent}/${file.file.replace(path.extname(file.file), '.mp4')}`,
      parent: file.parent,
      video: {copy: true},
      audio: {copy: true},
    };
    const metaData = await transcodeService.getMetaData(file.absolute_path);
    for(let i=0; i<metaData.streams.length; i++) {
      const stream = metaData.streams[i];
      if(stream.codec_type === 'video') {
        if(transcodeService.videoCodecToTranscode.indexOf(stream.codec_name) !== -1) {
          transcodingData.video = {
            copy: false,
            metaData: stream,
          };
        } else {
          console.log(`Codec video not transcodable : ${stream.codec_name}`);
        }
      } else if(stream.codec_type === 'audio') {
        if(transcodeService.audioCodecToTranscode.indexOf(stream.codec_name) !== -1) {
          transcodingData.audio = {
            copy: false,
            metaData: stream,
          };
        } else {
          console.log(`Codec audio not transcodable : ${stream.codec_name}`);
        }
      }
    }

    return transcodingData;
  } catch(e) {
    // console.log(e.message)
    return null;
  }
};

const transcodeQueue = async(queue) => {
  if(!queue) {
    return;
  }
  for(let i=0; i<queue.length; i++) {
    try {
      console.log(`Start transcode ${queue[i].source} to ${queue[i].target}`);
      mkdirp(`${config.stream_path}${queue[i].parent}`);
      await transcodeService.transcode(queue[i]);
    } catch(e) {
      console.log(e);
    }
  }
};

if(process.argv) {
  if(process.argv[2] === 'all') {
    console.log('-- TRANSCODE ALL --')
    queuedForAll()
      .then((queue) => {
        return transcodeQueue(queue);
      })
      .then(() => {
        console.log('Transcode all done !');
      })
      .catch((e) => {
        console.log(`Transcode all fail : ${e.message}`);
        console.log(e);
      })
  } else if(process.argv[2] === 'one') {
    queuedForOne(process.argv[3])
      .then((queue) => {
        return transcodeQueue(queue);
      })
      .then(() => {
        console.log('Transcode one done !');
      })
      .catch((e) => {
        console.log(`Transcode one fail : ${e.message}`);
        console.log(e);
      })
  }
}