```
-i is input name
-c:v is video codec
-c:a is audio codec
-b:v is bitrate video
-crf is video quality (constant rate factor, 0 is lossless, 23 is default, and 51 is worst possible)
-vf is video filter
-af is audio filter
-speed is to increase the speed of encoding, higher is faster
last argument is output name
```

##VP8 recommended settings

```
bitrate: 1MB (recommended 1MB to 8MB. Higher values mean better quality)
video quality: 10 (value can be from 4–63, and 10 is a good starting point. Lower values mean better quality)
resolution: scale=720:-1 (720p, while keeping the same aspect ratio with -1)
video codec: libvpx
audio codec: libvorbis

ffmpeg -i input.mp4 -c:v libvpx -crf 10 -b:v 1M -c:a libvorbis -vf scale=720:-1 output.webm
```
##VP8 preview settings

```
ffmpeg -i input.mp4 -c:v libvpx -crf 10 -b:v 1M -c:a libvorbis -vf scale=720:-1 -ss 10 -t 10 -speed 16 output.webm

```
