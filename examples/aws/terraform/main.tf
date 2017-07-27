module "cluster" {
  source            = "cluster"
  profile           = "${var.profile}"
  region            = "${var.region}"
  security_group_id = "${var.security_group_id}"
  key_name          = "${var.key_name}"
  subnet_id         = "${var.subnet_id}"
}

module "elasticstack" {
  source               = "elasticstack"
  profile              = "${var.profile}"
  region               = "${var.region}"
  security_group_id    = "${var.security_group_id}"
  key_name             = "${var.key_name}"
  subnet_id            = "${var.subnet_id}"
  iam_instance_profile = "${module.cluster.iam_instance_profile}"
}
