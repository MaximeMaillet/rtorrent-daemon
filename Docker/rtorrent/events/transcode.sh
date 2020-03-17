#!/bin/sh

echo "$1" >> /var/rtorrent/logs/test.log

/usr/bin/npm run transcode-one --prefix /var/app "$1" >> /var/rtorrent/logs/transcode.log

exit 0