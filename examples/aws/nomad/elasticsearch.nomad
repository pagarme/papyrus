job "elasticsearch" {

  datacenters = ["b"]
  type = "service"
  update {
    stagger = "10s"
    max_parallel = 1
  }

  constraint {
    attribute = "${node.class}"
    value     = "elasticsearch"
  }

  group "elasticsearch" {
    count = 3

    restart {
      attempts = 10
      interval = "5m"
      delay = "25s"
      mode = "delay"
    }

    task "elasticsearch" {
      driver = "docker"
      config {
        image = "drrzmr/elastic-stack:elasticsearch-5.5.0"
        force_pull = true
        port_map {
          http = 9200
        }
        port_map {
          tcp = 9300
        }
      }

      resources {
        cpu    = 2000 # GHz
        memory = 4000 # GB
        network {
          port "http" {
            static = 9200
          }
          port "tcp" {
            static = 9300
          }
        }
      }
      env {
        "ES_JAVA_OPTS" = "-Xmx512m -Xms512m"
        "ES_CLUSTER_NAME" = "elk"
        "ES_NETWORK_PUBLISH_HOST" = "${attr.unique.network.ip-address}"
        "ES_DISCOVERY_ZEN_PING_UNICAST_HOST" = "elasticsearch.service.consul"
        "ES_DISCOVERY_ZEN_MINIMUM_MASTER_NODES" = "2"
      }
      service {
        name = "elasticsearch"
        port = "http"
      }

    }
  }

}
