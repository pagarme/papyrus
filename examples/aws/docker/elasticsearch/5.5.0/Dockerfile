FROM docker.elastic.co/elasticsearch/elasticsearch:5.5.0
MAINTAINER Eder Ruiz Maria <drrzmr@gmail.com>

ENV ES_CLUSTER_NAME="docker-cluster"
ENV ES_NETWORK_PUBLISH_HOST="127.0.0.1"
ENV ES_DISCOVERY_ZEN_PING_UNICAST_HOST="127.0.0.1"
ENV ES_DISCOVERY_ZEN_MINIMUM_MASTER_NODES="1"

COPY config/elasticsearch.yml /usr/share/elasticsearch/config/elasticsearch.yml
