# Rtorrent Daemon

Rtorrent in docker with nginx.

rTorrent can download torrent and nginx is an interface for get state aboute torrents.

rTorrent can give you informations with XMLRPC protocol.

Many librairies implement XMLRPC as client.

You can call `http://host/downloaded/[mydownloadedFile]` for download file downloaded by rTorrent.

## Usage

### Run container

```bash
docker run -d
  -p 8080:80
  -v "/home/my/files:/var/rtorrent/downloaded"
  -v "/home/my/torrent:/var/rtorrent/torrents"
  -v "/home/my/logs:/var/rtorrent/logs"
  torrent/rtorrent-daemon:latest
```

And put your .torrent file into `/home/my/torrent` and it's done !


### Docker compose

```yaml
version: '3'
services:
  rtorrent:
    image: torrent/rtorrent-daemon:latest
    restart: always
    ports:
      - 8080:80
    volumes:
      - /home/my/files:/var/rtorrent/downloaded
      - /home/my/torrent:/var/rtorrent/torrents
      - /home/my/logs:/var/rtorrent/logs
```

## Seedbox

Because it's more simply to send torrent file via UI or API, this is an API which use rtorrent-deamon for seedbox : [https://github.com/MaximeMaillet/seedbox](https://github.com/MaximeMaillet/seedbox)

And this is graphic interface for previous API : [https://github.com/MaximeMaillet/tor-ui](https://github.com/MaximeMaillet/tor-ui)

Contributing are welcome !

