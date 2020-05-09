# Docker rTorrent

Rtorrent in docker with RPC2 interface and web services.

## Features

- Download downloaded file

```bash
curl -X GET http://localhost:8080/download?file=myDownloadedFile
```


- Download torrent file

```bash
curl -X GET http://localhost:8080/torrent?file=myDownloadedFile
```


- Upload torrent file


```bash
curl -X POST --F "torrents=@/tmp/file.torrent;type=application/x-bittorrent" http://localhost:8080/upload
```


- Watch directory
 
 Put torrent file in `/var/rtorrent/torrents` and rTorrent download it automatically
 

- XMLRP protocol

You can get data with XML RPC `http://host:8080/RPC2`


- Webhook 

Web hook emit when download is finished with file name in `file` parameter.

*`file` can be a name of directory or name of file*

## Install

```bash
git clone https://github.com/MaximeMaillet/rtorrent-docker
docker-compose -f docker-compose.dev.yml up -d
```

## Example

```yaml
version: '3.1'
services:
  rtorrent:
    restart: always
    image: deuxmax/rtorrent:latest
    ports:
      - 8080:80
    environment:
      CORS_DOMAIN: http://localhost:3000
      WEBHOOK_URLS: http://localhost:5000,http://localhost:5001
    volumes:
      - ${STORAGE_PATH}/dtorrent/downloaded:/var/rtorrent/downloaded
      - ${STORAGE_PATH}/dtorrent/torrent:/var/rtorrent/torrents
      - ${STORAGE_PATH}/dtorrent/session:/var/rtorrent/session
      - ${STORAGE_PATH}/dtorrent/logs:/var/rtorrent/logs
```

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