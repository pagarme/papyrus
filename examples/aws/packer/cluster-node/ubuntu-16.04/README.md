## Example:

```sh
$ cat << EOF > variables.json
{
  "region": "us-east-1",
  "profile": "tests"
}
EOF
$ packer build -var-file=variables.json ami.json
```
