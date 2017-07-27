resource "aws_launch_configuration" "lc" {
  name              = "Cluster Server"
  image_id          = "${data.aws_ami.cluster.id}"
  instance_type     = "${var.instance_type}"
  enable_monitoring = false
  user_data         = "${data.template_file.userdata.rendered}"

  security_groups             = ["${var.security_group_id}"]
  key_name                    = "${var.key_name}"
  associate_public_ip_address = true

  iam_instance_profile = "${var.iam_instance_profile}"
  placement_tenancy    = "default"

  lifecycle {
    create_before_destroy = true
  }

  root_block_device {
    volume_type           = "gp2"
    volume_size           = 8
    delete_on_termination = true
  }
}

resource "aws_autoscaling_group" "asg" {
  name                 = "Cluster Server"
  launch_configuration = "${aws_launch_configuration.lc.name}"
  min_size             = 3
  max_size             = 3
  desired_capacity     = 3

  vpc_zone_identifier       = ["${var.subnet_id}"]
  health_check_grace_period = 300
  health_check_type         = "EC2"

  tags = [
    {
      key                 = "Name"
      value               = "cluster-server"
      propagate_at_launch = true
    },
    {
      key                 = "CONSUL_ROLE"
      value               = "server"
      propagate_at_launch = true
    },
  ]
}
