job "beats" {
	datacenters = ["a", "b", "c"]
	type = "system"
	update {
		stagger = "10s"
		max_parallel = 1
	}

	group "beats" {
		count = 1
		restart {
			attempts = 10
			interval = "5m"
			delay = "25s"
			mode = "delay"
		}

		task "metricbeat" {
			driver = "docker"

			config {
				image = "drrzmr/elastic-stack:metricbeat-5.5.0"
				force_pull = true
				network_mode = "host"
				volumes = [
					"/proc:/hostfs/proc:ro",
					"/sys/fs/cgroup:/hostfs/sys/fs/cgroup:ro",
					"/:/hostfs:ro",
				]
				command = "metricbeat"
				args = [
					"-e",
					"-system.hostfs=/hostfs",
				]

			}

			resources {
				cpu		= 256
				memory = 512
			}

		 env {
			 "LS_HOST" = "logstash.service.consul"
			 "LS_BEATS_PORT" = "5044"
		 }

		 service {
			 name = "metricbeat"
		 }

		}
	}
}
