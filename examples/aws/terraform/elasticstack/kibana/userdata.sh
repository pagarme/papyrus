#!/bin/bash -eux

mkdir -p /run/nosce
metadata > /run/nosce/metadata

cat << EOF > /run/nosce/consul
CONSUL_OPTIONS=""
CONSUL_EC2_KEY="CONSUL_ROLE"
CONSUL_EC2_VALUE="server"
EOF

cat << EOF > /run/nosce/nomad
NOMAD_OPTIONS="-client -node-class=${nomad_node_class}"
EOF

# http://dustymabe.com/2015/08/03/installingstarting-systemd-services-using-cloud-init/
systemctl enable --now --no-block consul
systemctl enable --now --no-block nomad
