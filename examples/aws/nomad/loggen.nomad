job "loggen" {

  datacenters = ["b"]
  type = "service"
  update {
    stagger = "10s"
    max_parallel = 1
  }

  constraint {
    attribute = "S{node.class}"
    value     = "kibana"
  }

  group "loggen" {
    count = 1

    restart {
      attempts = 10
      interval = "5m"
      delay = "25s"
      mode = "delay"
    }

    task "loggen" {
      driver = "docker"
      config {
        image = "drrzmr/loggen:latest"
        force_pull = true
      }

      resources {
        cpu = 256
        memory = 512
      }
      env {
        "ESCRIBA_TIMEOUT" = "3000"
      }

    }
  }
}
