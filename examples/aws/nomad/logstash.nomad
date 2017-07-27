job "logstash" {
  datacenters = ["b"]
  type = "service"
  update {
    stagger = "10s"
    max_parallel = 1
  }

  constraint {
    attribute = "${node.class}"
    value     = "logstash"
  }

  group "logstash" {
    count = 1
    restart {
      attempts = 10
      interval = "5m"
      delay = "25s"
      mode = "delay"
    }

    task "logstash" {
      driver = "docker"

      config {
        image = "drrzmr/elastic-stack:logstash-5.5.0"
        force_pull = true
        port_map {
         beats = 5044
        }
      }
      env {
        "LS_ELASTICSEARCH_URL" = "elasticsearch.service.consul:9200"
      }

      resources {
        cpu    = 1000 # 1GHz
        memory = 2048 # 2GB
        network {
          port "beats" {
            static = 5044
          }
        }
      }

     service {
       name = "logstash"
       port = "beats"
     }

    }
  }
}
