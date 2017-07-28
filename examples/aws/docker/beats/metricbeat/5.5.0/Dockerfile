FROM docker.elastic.co/beats/metricbeat:5.5.0
MAINTAINER Eder Ruiz Maria <drrzmr@gmail.com>

ENV LS_HOST="logstash.service.consul"
ENV LS_BEATS_PORT="5044"

COPY metricbeat.yml /usr/share/metricbeat/metricbeat.yml
USER root
RUN chown metricbeat /usr/share/metricbeat/metricbeat.yml
USER metricbeat
