job "kibana" {

  datacenters = ["b"]
  type = "service"
  update {
    stagger = "10s"
    max_parallel = 1
  }

  constraint {
    attribute = "${node.class}"
    value     = "kibana"
  }

  group "kibana" {
    count = 1

    restart {
      attempts = 10
      interval = "5m"
      delay = "25s"
      mode = "delay"
    }

    task "kibana" {
      driver = "docker"
      config {
        image = "drrzmr/elastic-stack:kibana-5.5.0"
        force_pull = true
        port_map {
          http = 5601
        }
      }

      resources {
        cpu    = 2000 # GHz
        memory = 2000 # GB
        network {
          port "http" {
            static = 5601
          }
        }
      }
      env {
        "SERVER_NAME" = "kibana"
        "XPACK_MONITORING_ENABLED" = "false"
        "ELASTICSEARCH_URL" = "http://elasticsearch.service.consul:9200"
      }
      service {
        name = "kibana"
        port = "http"
      }

    }
  }

}
