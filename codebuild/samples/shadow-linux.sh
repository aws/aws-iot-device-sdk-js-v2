#!/bin/bash

set -e
set -o pipefail

env

pushd $CODEBUILD_SRC_DIR/samples/node/shadow

ENDPOINT=$(aws secretsmanager get-secret-value --secret-id "ci/endpoint" --query "SecretString" | cut -f2 -d":" | sed -e 's/[\\\"\}]//g')

npm install --unsafe-perm

echo "Shadow test - MQTT 311"
node dist/index.js --endpoint $ENDPOINT --key /tmp/privatekey.pem --cert /tmp/certificate.pem --thing_name CI_CodeBuild_Thing --is_ci true

echo "Shadow test - MQTT 5"
node dist/index.js --endpoint $ENDPOINT --key /tmp/privatekey.pem --cert /tmp/certificate.pem --thing_name CI_CodeBuild_Thing --is_ci true --mqtt5 true

popd
