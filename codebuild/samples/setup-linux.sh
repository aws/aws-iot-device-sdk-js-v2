#!/bin/bash

set -e
set -o pipefail

env

# build package
cd $CODEBUILD_SRC_DIR

ulimit -c unlimited
npm install --unsafe-perm

cert=$(aws secretsmanager get-secret-value --secret-id "ci/CodeBuild/cert" --query "SecretString" | cut -f2 -d":" | cut -f2 -d\") && echo -e "$cert" > /tmp/certificate.pem
key=$(aws secretsmanager get-secret-value --secret-id "ci/CodeBuild/key" --query "SecretString" | cut -f2 -d":" | cut -f2 -d\") && echo -e "$key" > /tmp/privatekey.pem
