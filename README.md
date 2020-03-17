# Rtorrent Daemon

Rtorrent in docker with nginx for interface.

rTorrent can download torrent and nginx is an interface for get state aboute torrents.

rTorrent can give you informations with XMLRPC protocol.

Many librairies implement XMLRPC as client.

#### Feature

- Get downloaded file with `http://host/downloaded/[mydownloadedFile]`
- Get content of torrent file with `http://host/torrents/[torrentName]`
- Get data with XML RPC `http://host/RPC2`
- Stream file with `http://localhost/ws/stream/:hash?file=:filePath`

## Usage

### Build container

```bash
docker build -t namespace/container:latest .
```

### Run container

```bash
docker run -d
  -p 8080:80
  -v "/home/my/files:/var/rtorrent/downloaded"
  -v "/home/my/torrent:/var/rtorrent/torrents"
  -v "/home/my/logs:/var/rtorrent/logs"
  namespace/container:latest
```

And put your .torrent file into `/home/my/torrent` and it's done !


### Docker compose

```yaml
version: '3'
services:
  rtorrent:
    image: namespace/container:latest
    restart: always
    ports:
      - 8080:80
    volumes:
      - /home/my/files:/var/rtorrent/downloaded
      - /home/my/torrent:/var/rtorrent/torrents
      - /home/my/logs:/var/rtorrent/logs
```


### Transcoding

Transcode .avi to .mp4 with `libx264`

```bash
docker run --rm 
    -u torrent
    -v /home/my/torrents:/var/rtorrent/torrents 
    -v /home/my/files:/var/rtorrent/downloaded
    -v /home/my/stream:/var/rtorrent/stream 
    rtorrent-daemon_app 
    transcode-all
```