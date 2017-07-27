module "permission" {
  source  = "permissions"
  profile = "${var.profile}"
  region  = "${var.region}"
}

module "server" {
  source               = "server"
  profile              = "${var.profile}"
  region               = "${var.region}"
  security_group_id    = "${var.security_group_id}"
  subnet_id            = "${var.subnet_id}"
  iam_instance_profile = "${module.permission.iam_instance_profile}"
  key_name             = "${var.key_name}"
}
