#!/bin/bash

set -e
set -o pipefail

env

pushd $CODEBUILD_SRC_DIR/samples/node/basic_connect

ENDPOINT=$(aws secretsmanager get-secret-value --secret-id "ci/endpoint" --query "SecretString" | cut -f2 -d":" | sed -e 's/[\\\"\}]//g')

npm install --unsafe-perm

echo "Connect Basic (Direct) test"
node dist/index.js --endpoint $ENDPOINT --key /tmp/privatekey.pem --cert /tmp/certificate.pem --is_ci true

popd

pushd $CODEBUILD_SRC_DIR/samples/node/websocket_connect

npm install --unsafe-perm

echo "Connect Websocket test"
node dist/index.js --endpoint $ENDPOINT --signing_region us-east-1 --is_ci true

popd
