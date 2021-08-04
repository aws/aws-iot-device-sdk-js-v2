#!/bin/bash

set -e

env

pushd $CODEBUILD_SRC_DIR/samples/node/pub_sub

ENDPOINT=$(aws secretsmanager get-secret-value --secret-id "unit-test/endpoint" --query "SecretString" | cut -f2 -d":" | sed -e 's/[\\\"\}]//g')

npm install --unsafe-perm

echo "Mqtt Direct test"
node dist/index.js --endpoint $ENDPOINT --key /tmp/privatekey.pem --cert /tmp/certificate.pem

echo "Websocket test"
node dist/index.js --endpoint $ENDPOINT --use_websocket --signing_region us-east-1

popd
