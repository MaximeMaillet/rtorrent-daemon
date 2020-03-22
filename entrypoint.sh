#!/usr/bin/env bash

if [[ "$1" == "transcode-all" ]]; then
    /usr/bin/npm run transcode-all --prefix /var/app
    exit
fi

exec "$@"
