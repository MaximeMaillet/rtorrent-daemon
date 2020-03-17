#!/usr/bin/env bash

chown -R $UUID:$GGID /var/rtorrent

echo $1

if [[ "$1" == "transcode-all" ]]; then
    /usr/bin/npm run transcode-all --prefix /var/app
    exit
fi

exec "$@"
