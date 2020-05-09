# Docker rTorrent

Rtorrent in docker with RPC2 interface.

[deuxmax/rtorrent](https://hub.docker.com/r/deuxmax/rtorrent)

## Features

- Watch directory : place torrent file in `/var/rtorrent/torrents` and rTorrent download it automatically
- Download downloaded file with `http://host/download?file=myDownloadedFile`
- Download content of torrent file with `http://host/torrent?file=myTorrentFile`
- Upload torrent file `POST http://host/upload`
- Get data with XML RPC `http://host/RPC2`
- Webhook emit when download is finished with base path file in `file` parameter.
(*Can be a name of directory or name of file*)

## Usage

#### Build & Run

##### Build

```bash
docker build -t namespace/container:latest .
```

##### Run

```bash
docker run -d
  -p 8080:80
  -v "/home/my/data/files:/var/rtorrent/downloaded"
  -v "/home/my/data/torrent:/var/rtorrent/torrents"
  -v "/home/my/data/logs:/var/rtorrent/logs"
  namespace/container:latest
```

##### Docker compose

```yaml
version: '3'
services:
  rtorrent:
    image: namespace/container:latest
    restart: always
    ports:
      - 8080:80
    volumes:
      - /home/my/data/files:/var/rtorrent/downloaded
      - /home/my/data/torrent:/var/rtorrent/torrents
      - /home/my/data/logs:/var/rtorrent/logs
```

Now you can put your .torrent file into `/home/my/data/torrent` and it's done (load) !

#### Upload

Send `POST` http request to `/upload` with `torrents={FILE}` as parameter.

## File system

rTorrent is launching with user `torrent` (1000:1000), so your volumes mounted should be accessible by 1000.

```bash
sudo chown -R 1000:1000 /home/my/data
```

## Volumes

- `/var/rtorrent/torrents` : directory of torrent files
- `/var/rtorrent/downloaded` : directory of torrent downloaded
- `/var/rtorrent/session` : (optional, useful for know historical for up/down rate)
- `/var/rtorrent/logs` : logs

## Web hook

For add a hook you should put urls in environment variable `WEBHOOK_URLS` separated with coma.

```yaml
version: '3'
services:
  rtorrent:
    image: namespace/container:latest
    restart: always
    environment:
      WEBHOOK_URLS: http://localhost,http://localhost:9090/hook
    ports:
      - 8080:80
    volumes:
      - /home/my/data/files:/var/rtorrent/downloaded
      - /home/my/data/torrent:/var/rtorrent/torrents
      - /home/my/data/logs:/var/rtorrent/logs
```