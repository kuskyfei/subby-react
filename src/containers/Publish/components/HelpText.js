import React from 'react'

const HelpText = () =>
  <div>
    <p>
      Drop files: JPG, JPEG, PNG, GIF, TORRENT (e.g. example.jpg)
    </p>
    <p>
      Media links: JPG, JPEG, PNG, GIF, WebM, MP4, Ogg, WAV, MP3, FLAC (e.g. https://example.com/something.mp4)
    </p>
    <p>
      Social links: Youtube, Vimeo, Reddit, Twitter, Facebook, Instagram (e.g. https://www.youtube.com/watch?v=dQw4w9WgXcQ)
    </p>
    <p>
      IPFS hashes: (e.g. QmeeogFMkaWi3n1hurdMXLuAHjG2tSaYfFXvXqP6SPd1zo) embed supported for images and fMP4 videos
    </p>
    <p>
      Torrent magnets: (e.g. magnet:?xt=urn:btih:08ada5a7a6183aae1e09d831df67...) must include WebSocket (wss://) tracker for embed
    </p>
  </div>

export default HelpText
