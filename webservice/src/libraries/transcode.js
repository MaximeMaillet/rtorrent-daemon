const fs = require('fs');
const path = require('path');
const config = require('../config/');
const ffmpeg = require('fluent-ffmpeg');

const containersReachedAvailable = ['mp4', 'avi', 'mkv'];
const videoCodecToTranscode = ['mpeg4'];
const audioCodecToTranscode = [''];

const videoCodecNotTranscodable = ['h264'];
const audioCodecNotTranscodable = ['aac','mp3'];


const getMetaData = (filePath) => {
  return new Promise((resolve, reject) => {
    ffmpeg.ffprobe(filePath, (err, metadata) => {
      if(err) {
        reject(err);
      } else {
        resolve(metadata);
      }
    });
  });
};

const transcode = async(data) => {
  return new Promise((resolve, reject) => {
    const ffmpegTranscoder = ffmpeg(data.source);

    ffmpegTranscoder
      .on("start", commandLine => {
        console.log(`Spawned Ffmpeg with command: ${commandLine}`);
      })
      .on('end', function() {
        resolve(data.target);
      })
      .on('error', function(err) {
        reject(err);
      });

    if(!data.video.copy) {
      ffmpegTranscoder
        .videoCodec('libx264');
    }

    if(!data.video.audio) {
      ffmpegTranscoder
        .audioCodec('aac')
        .outputOptions('-ac 2');
    }

    ffmpegTranscoder.saveToFile(data.target);
  });
};

module.exports = {
  containersReachedAvailable,
  videoCodecNotTranscodable,
  audioCodecNotTranscodable,
  videoCodecToTranscode,
  audioCodecToTranscode,
  transcode,
  getMetaData,
};