#!/bin/bash

set -e
set -o pipefail

env

pushd $CODEBUILD_SRC_DIR/samples/node/custom_authorizer_connect

ENDPOINT=$(aws secretsmanager get-secret-value --secret-id "ci/endpoint" --query "SecretString" | cut -f2 -d":" | sed -e 's/[\\\"\}]//g')
AUTH_NAME=$(aws secretsmanager get-secret-value --secret-id "ci/CustomAuthorizer/name" --query "SecretString" | cut -f2 -d":" | sed -e 's/[\\\"\}]//g')
AUTH_PASSWORD=$(aws secretsmanager get-secret-value --secret-id "ci/CustomAuthorizer/password" --query "SecretString" | cut -f2 -d":" | sed -e 's/[\\\"\}]//g')

npm install --unsafe-perm

echo "Mqtt Connect with Custom Authorizer test"
node dist/index.js --endpoint $ENDPOINT --custom_auth_authorizer_name $AUTH_NAME --custom_auth_password $AUTH_PASSWORD --is_ci true

popd
