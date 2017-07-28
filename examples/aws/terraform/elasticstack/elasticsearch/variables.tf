variable "profile" {
  type = "string"
}

variable "region" {
  type = "string"
}

variable "security_group_id" {
  type = "string"
}

variable "iam_instance_profile" {
  type = "string"
}

variable "key_name" {
  type = "string"
}

variable "subnet_id" {
  type = "string"
}

variable "instance_type" {
  type    = "string"
  default = "t2.large"
}

variable "nomad_node_class" {
  type    = "string"
  default = "elasticsearch"
}
