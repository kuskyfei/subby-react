var MP4Box = require('mp4box').MP4Box; // Or whatever import method you prefer.
var mp4box = new MP4Box();
mp4box.onError = function(e) {};
mp4box.onReady = function(info) {};
mp4box.appendBuffer(data);
mp4box.appendBuffer(data);
mp4box.appendBuffer(data);


mp4box.flush();