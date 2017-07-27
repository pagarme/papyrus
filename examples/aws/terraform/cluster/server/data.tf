data "aws_ami" "cluster" {
  most_recent = true
  owners      = ["self"]

  filter {
    name   = "virtualization-type"
    values = ["hvm"]
  }

  filter {
    name   = "name"
    values = ["*ubuntu-16.04-cluster*"]
  }
}

data "template_file" "userdata" {
  template = "${file("${path.module}/userdata.sh")}"

  vars {
    bootstrap_expect = "${var.bootstrap_expect}"
  }
}
