FROM debian:jessie

ARG USER=torrent
ARG UUID=1000
ARG GGID=1000

RUN apt-get update && \
    apt-get install -y rtorrent \
    supervisor \
    nginx

RUN mkdir -p /home/$USER && \
    addgroup --system --gid $GGID $USER && \
    useradd -l --system --home-dir /home/$USER --uid $UUID --gid $GGID $USER && \
    mkdir -p /var/rtorrent/session /var/rtorrent/torrents /var/rtorrent/downloaded /var/rtorrent/logs && \
    mkdir -p /var/log/supervisor && \
    chown -R $USER. /var/rtorrent && \
    chown -R $USER. /home/$USER

ADD Docker/supervisor /etc/supervisor
ADD Docker/nginx/sites-enabled/default.conf /etc/nginx/sites-enabled/default
ADD Docker/rtorrent /home/$USER

VOLUME /var/rtorrent/downloaded
VOLUME /var/rtorrent/torrents
VOLUME /var/rtorrent/logs

EXPOSE 80

CMD ["/usr/bin/supervisord"]