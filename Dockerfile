FROM debian:buster

ARG USER=torrent
ARG UUID=1000
ARG GGID=1000

RUN apt-get update && \
    apt-get install -y rtorrent \
    supervisor \
    nginx \
    curl

RUN curl -sL https://deb.nodesource.com/setup_10.x | bash -
RUN apt-get install -y nodejs

RUN mkdir -p /home/$USER /home/$USER/app && \
    addgroup --system --gid $GGID $USER && \
    useradd -l --system --home-dir /home/$USER --uid $UUID --gid $GGID $USER && \
    mkdir -p /var/rtorrent/session /var/rtorrent/torrents /var/rtorrent/downloaded /var/rtorrent/logs /var/log/supervisor && \
    chown -R $USER. /var/rtorrent && \
    chown -R $USER. /home/$USER

COPY --chown=$USER:$USER ./webservice /home/$USER/app

ADD Docker/supervisor /etc/supervisor
ADD Docker/nginx/sites-enabled/default.conf /etc/nginx/sites-enabled/default
ADD Docker/rtorrent /home/$USER

RUN chown -R $USER:$USER /home/$USER && chmod -R 755 /home/torrent

VOLUME /var/rtorrent/downloaded
VOLUME /var/rtorrent/torrents
VOLUME /var/rtorrent/logs

EXPOSE 80

CMD ["/usr/bin/supervisord"]