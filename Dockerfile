FROM debian:buster

ARG UUID=1000
ARG GGID=1000

ENV USER=torrent
ENV UUID=${UUID}
ENV GGID=${GGID}

RUN apt-get update && \
    apt-get install -y rtorrent \
    supervisor \
    nginx \
    curl

RUN curl -sL https://deb.nodesource.com/setup_10.x | bash -
RUN apt-get install -y nodejs

RUN mkdir -p /home/$USER/rtorrent /var/app /var/rtorrent/session /var/rtorrent/torrents /var/rtorrent/downloaded /var/rtorrent/logs /var/log/supervisor && \
    addgroup --system --gid $GGID $USER && \
    useradd -l --system --home-dir /home/$USER --uid $UUID --gid $GGID $USER && \
    chown -R $USER:$USER /var/rtorrent /home/$USER /var/app

COPY --chown=$USER:$USER ./webservice /var/app
COPY --chown=$USER:$USER Docker/rtorrent /home/$USER/rtorrent

COPY --chown=root:root Docker/supervisor /etc/supervisor
COPY --chown=root:root Docker/nginx/conf.d /etc/nginx/conf.d
COPY --chown=root:root Docker/nginx/nginx.conf /etc/nginx/nginx.conf
COPY --chown=root:root entrypoint.sh /usr/local/bin/

USER root
RUN chmod +x /usr/local/bin/entrypoint.sh
RUN chmod -R +x /home/$USER/rtorrent/events

VOLUME /var/rtorrent/downloaded
VOLUME /var/rtorrent/torrents
VOLUME /var/rtorrent/logs

USER root

EXPOSE 80

ENTRYPOINT ["/usr/local/bin/entrypoint.sh"]
CMD ["/usr/bin/supervisord"]