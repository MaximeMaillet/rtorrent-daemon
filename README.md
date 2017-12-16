
## Run container

```bash
docker run -d
  -p 8080:80
  -v "/home/my/files:/var/rtorrent/downloaded"
  -v "/home/my/torrent:/var/rtorrent/torrents"
  -v "/home/my/logs:/var/rtorrent/logs"
  gitlab.deuxmax.fr:4444/torrent/rtorrent-deamon:latest
```

## Docker compose

```yaml
version: '3'
services:
  rtorrent:
    image: gitlab.deuxmax.fr:4444/torrent/rtorrent-deamon:latest
    restart: always
    ports:
      - 8080:80
    volumes:
      - /home/my/files:/var/rtorrent/downloaded
      - /home/my/torrent:/var/rtorrent/torrents
      - /home/my/logs:/var/rtorrent/logs
```