#!/bin/bash

set -e

env

pushd $CODEBUILD_SRC_DIR/samples/node/custom_authorizer_connect

ENDPOINT=$(aws secretsmanager get-secret-value --secret-id "unit-test/endpoint" --query "SecretString" | cut -f2 -d":" | sed -e 's/[\\\"\}]//g')
AUTH_NAME=$(aws secretsmanager get-secret-value --secret-id "unit-test/authorizer-name" --query "SecretString" | cut -f2 -d":" | sed -e 's/[\\\"\}]//g')
AUTH_PASSWORD=$(aws secretsmanager get-secret-value --secret-id "unit-test/authorizer-password" --query "SecretString" | cut -f2 -d":" | sed -e 's/[\\\"\}]//g')

npm install --unsafe-perm

echo "Custom Authorizer Connect test"
node dist/index.js --endpoint $ENDPOINT --custom_auth_authorizer_name $AUTH_NAME --custom_auth_password $AUTH_PASSWORD

popd
