module "elasticsearch" {
  source = "elasticsearch"

  profile              = "${var.profile}"
  region               = "${var.region}"
  security_group_id    = "${var.security_group_id}"
  iam_instance_profile = "${var.iam_instance_profile}"
  key_name             = "${var.key_name}"
  subnet_id            = "${var.subnet_id}"
}

module "logstash" {
  source = "logstash"

  profile              = "${var.profile}"
  region               = "${var.region}"
  security_group_id    = "${var.security_group_id}"
  iam_instance_profile = "${var.iam_instance_profile}"
  key_name             = "${var.key_name}"
  subnet_id            = "${var.subnet_id}"
}

module "kibana" {
  source = "kibana"

  profile              = "${var.profile}"
  region               = "${var.region}"
  security_group_id    = "${var.security_group_id}"
  iam_instance_profile = "${var.iam_instance_profile}"
  key_name             = "${var.key_name}"
  subnet_id            = "${var.subnet_id}"
}
