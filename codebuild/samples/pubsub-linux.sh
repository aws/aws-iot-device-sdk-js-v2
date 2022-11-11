#!/bin/bash

set -e
set -o pipefail

env

pushd $CODEBUILD_SRC_DIR/samples/node/pub_sub

ENDPOINT=$(aws secretsmanager get-secret-value --secret-id "ci/endpoint" --query "SecretString" | cut -f2 -d":" | sed -e 's/[\\\"\}]//g')

npm install --unsafe-perm

echo "PubSub test"
node dist/index.js --endpoint $ENDPOINT --key /tmp/privatekey.pem --cert /tmp/certificate.pem --is_ci true

popd

pushd $CODEBUILD_SRC_DIR/samples/node/pub_sub_js

npm install --unsafe-perm

echo "PubSub JS test"
node index.js --endpoint $ENDPOINT --key /tmp/privatekey.pem --cert /tmp/certificate.pem --is_ci true

popd
