resource "aws_iam_policy" "ec2-describe-instances" {
  name        = "EC2DescribeInstances"
  description = "EC2 Describe Instances Policy"

  policy = <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Action": "ec2:DescribeInstances",
      "Effect": "Allow",
      "Resource": "*"
    }
  ]
}
EOF
}

resource "aws_iam_role" "cluster" {
  name        = "ClusterNode"
  description = "Add Cluster Node required permissions"

  assume_role_policy = <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Action": "sts:AssumeRole",
      "Principal": {
        "Service": "ec2.amazonaws.com"
      },
      "Effect": "Allow",
      "Sid": ""
    }
  ]
}
EOF
}

resource "aws_iam_instance_profile" "cluster" {
  name = "ClusterNode"
  role = "${aws_iam_role.cluster.name}"
}

resource "aws_iam_role_policy_attachment" "attach" {
  role       = "${aws_iam_role.cluster.name}"
  policy_arn = "${aws_iam_policy.ec2-describe-instances.arn}"
}
