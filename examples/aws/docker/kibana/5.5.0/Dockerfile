FROM docker.elastic.co/kibana/kibana:5.5.0
MAINTAINER Eder Ruiz Maria <drrzmr@gmail.com>

ENV SERVER_NAME="kibana"
ENV ELASTICSEARCH_URL="http://127.0.0.1:9200"
ENV ELASTICSEARCH_USERNAME="elastic"
ENV ELASTICSEARCH_PASSWORD="changeme"

COPY config/kibana.yml /usr/share/kibana/config/kibana.yml
