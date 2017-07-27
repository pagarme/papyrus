variable "profile" {
  type = "string"
}

variable "region" {
  type = "string"
}

variable "instance_type" {
  type    = "string"
  default = "t2.micro"
}

variable "security_group_id" {
  type = "string"
}

variable "iam_instance_profile" {
  type    = "string"
  default = "ClusterNode"
}

variable "key_name" {
  type = "string"
}

variable "subnet_id" {
  type = "string"
}

variable "bootstrap_expect" {
  type    = "string"
  default = "3"
}
