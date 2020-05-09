#!/bin/sh

#/var/rtorrent/downloaded/Wild.Venice.2015.2160p.WEB.x264-PFa[rarbg]
#/var/rtorrent/downloaded/Swiss.Army.Man.2016.BLURAY.1080p.X265.HEVC.MULTi.VFI.DTS-HD.MA.5.1-JACKT.mkv

#/usr/bin/npm run webhook --prefix /var/app "/var/rtorrent/downloaded/Wild.Venice.2015.2160p.WEB.x264-PFa[rarbg]"
#/usr/bin/npm run webhook --prefix /var/app "/var/rtorrent/downloaded/Swiss.Army.Man.2016.BLURAY.1080p.X265.HEVC.MULTi.VFI.DTS-HD.MA.5.1-JACKT.mkv"
/usr/bin/npm run webhook --prefix /var/app "$1" >> /var/rtorrent/logs/webhooks.log

exit 0