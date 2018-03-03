# Rtorrent Daemon

Rtorrent in docker with nginx.

Supervisord launch Rtorrent + nginx with RPC2 and communicate with XML RPC protocol.

Rtorrent launch events with bash files :
* When torrent is erased : Docker/rtorrent/event_erased.sh
* When torrent is added : Docker/rtorrent/event_new.sh
* When torrent is paused : Docker/rtorrent/event_paused.sh
* When torrent is resumed : Docker/rtorrent/event_resumed.sh

## Run container

```bash
docker run -d
  -p 8080:80
  -v "/home/my/files:/var/rtorrent/downloaded"
  -v "/home/my/torrent:/var/rtorrent/torrents"
  -v "/home/my/logs:/var/rtorrent/logs"
  torrent/rtorrent-daemon:latest
```

## Docker compose

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