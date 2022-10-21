#!/bin/bash

set -e

env

pushd $CODEBUILD_SRC_DIR/samples/node/pub_sub

ENDPOINT=$(aws secretsmanager get-secret-value --secret-id "unit-test/endpoint" --query "SecretString" | cut -f2 -d":" | sed -e 's/[\\\"\}]//g')

npm install --unsafe-perm

echo "PubSub test"
node dist/index.js --endpoint $ENDPOINT --key /tmp/privatekey.pem --cert /tmp/certificate.pem

popd

pushd $CODEBUILD_SRC_DIR/samples/node/pub_sub_js

npm install --unsafe-perm

echo "PubSub JS test"
node dist/index.js --endpoint $ENDPOINT --key /tmp/privatekey.pem --cert /tmp/certificate.pem

popd
