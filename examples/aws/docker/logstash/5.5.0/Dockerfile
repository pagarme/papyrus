FROM docker.elastic.co/logstash/logstash:5.5.0
MAINTAINER Eder Ruiz Maria <drrzmr@gmail.com>

ENV LS_ELASTICSEARCH_HOST="elasticsearch:9200"

RUN rm -f /usr/share/logstash/pipeline/logstash.conf
COPY pipeline/ /usr/share/logstash/pipeline/
COPY config/ /usr/share/logstash/config/
