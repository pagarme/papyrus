#!/bin/bash -eux

mkdir -p /run/nosce
metadata > /run/nosce/metadata

cat << EOF > /run/nosce/consul
CONSUL_OPTIONS="-server -bootstrap-expect=${bootstrap_expect}"
CONSUL_EC2_KEY="CONSUL_ROLE"
CONSUL_EC2_VALUE="server"
EOF

cat << EOF > /run/nosce/nomad
NOMAD_OPTIONS="-server -bootstrap-expect=${bootstrap_expect}"
EOF

# http://dustymabe.com/2015/08/03/installingstarting-systemd-services-using-cloud-init/
systemctl enable --now --no-block consul
systemctl enable --now --no-block nomad
