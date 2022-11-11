#!/usr/bin/env bash
set -ex

if [ ! -f VERSION ]; then
    echo "No VERSION file found! Cannot make release!"
    exit 1
else
    echo "VERSION file found..."
fi
VERSION=$(cat VERSION)

# Make sure the version variable is populated
if [ -z "${VERSION}" ]; then
    echo "VERSION file is empty!"
    exit 1
else
    echo "VERSION file contains: ${VERSION}"
fi

# Make sure the version follows the correct format: major.minor.patch
LENGTH_CHECK="${VERSION//[^.]}"
if [ ${#LENGTH_CHECK} != 2 ]; then
    echo "VERSION file contains invalid version (not in format major.minor.patch)"
    exit 1
fi
# Use RegX to ensure it only contains numbers and periods
REGX_CHECK='^([0-9]+\.){0,2}(\*|[0-9]+)$'
if [[ $VERSION =~ $REGX_CHECK ]]; then
    echo "VERSION file contains valid version"
else
    echo "VERSION file contains invalid version (RegX validator failed)"
    exit 1
fi

# FOR TESTING ONLY - hard code version to latest release
VERSION="1.8.9"

PUBLISHED_TAG_VERSION=`npm show aws-iot-device-sdk-v2 version`
if [ "$PUBLISHED_TAG_VERSION" == "$VERSION" ]; then
    echo "$VERSION found in npm. Testing release..."

    curl https://www.amazontrust.com/repository/AmazonRootCA1.pem --output /tmp/AmazonRootCA1.pem
    cert=$(aws secretsmanager get-secret-value --secret-id "ci/PubSub/cert" --query "SecretString" | cut -f2 -d":" | cut -f2 -d\") && echo "$cert" > /tmp/certificate.pem
    key=$(aws secretsmanager get-secret-value --secret-id "ci/PubSub/key" --query "SecretString" | cut -f2 -d":" | cut -f2 -d\") && echo "$key" > /tmp/privatekey.pem
    ENDPOINT=$(aws secretsmanager get-secret-value --secret-id "ci/endpoint" --query "SecretString" | cut -f2 -d":" | sed -e 's/[\\\"\}]//g')

    cd samples/node/pub_sub
    npm install
    npm install -g typescript
    npm run tsc
    node dist/index.js --ca_file /tmp/AmazonRootCA1.pem --cert /tmp/certificate.pem --key /tmp/privatekey.pem --endpoint $ENDPOINT --verbosity info

    exit 0

else
    echo "$VERSION was not found in npm. Release failed!"
fi

exit 1
