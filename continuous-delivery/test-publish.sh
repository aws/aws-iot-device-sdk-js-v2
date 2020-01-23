#!/usr/bin/env bash
set -ex

# force a failure if there's no tag
git describe --tags
# now get the tag
CURRENT_TAG=$(git describe --tags | cut -f2 -dv)
# convert v0.2.12-2-g50254a9 to 0.2.12
CURRENT_TAG_VERSION=$(git describe --tags | cut -f1 -d'-' | cut -f2 -dv)
# if there's a hash on the tag, then this is not a release tagged commit
if [ "$CURRENT_TAG" != "$CURRENT_TAG_VERSION" ]; then
    echo "Current tag version is not a release tag, cut a new release if you want to publish."
    exit 1
fi

PUBLISHED_TAG_VERSION=`npm show aws-iot-device-sdk-v2 version`
if [ "$PUBLISHED_TAG_VERSION" == "$CURRENT_TAG_VERSION" ]; then
    echo "$CURRENT_TAG_VERSION is already in npm, cut a new tag if you want to upload another version."

    curl https://www.amazontrust.com/repository/AmazonRootCA1.pem --output /tmp/AmazonRootCA1.pem
    cert=$(aws secretsmanager get-secret-value --secret-id "unit-test/certificate" --query "SecretString" | cut -f2 -d":" | cut -f2 -d\") && echo "$cert" > /tmp/certificate.pem
    key=$(aws secretsmanager get-secret-value --secret-id "unit-test/privatekey" --query "SecretString" | cut -f2 -d":" | cut -f2 -d\") && echo "$key" > /tmp/privatekey.pem
    endpoint=$(aws secretsmanager get-secret-value --secret-id "unit-test/endpoint" --query "SecretString" | cut -f2 -d":" | sed -e 's/[\\\"\}]//g')

    cd samples/node/pub_sub
    npm install
    npm run tsc
    node dist/index.js --ca_file /tmp/AmazonRootCA1.pem --cert /tmp/certificate.pem --key /tmp/privatekey.pem --endpoint $endpoint --verbosity info

    exit 0
fi

exit 1
