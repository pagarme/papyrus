## Example:

```sh
cat << EOF > terraform.tfvars
profile = "my.awscli.profile"
region = "us-east-1"
security_group_id = "sg-abcdefgh"
subnet_id = "subnet-abcdefgh"
key_name = "my.key"
EOF
$ terraform plan
$ terraform apply
```
