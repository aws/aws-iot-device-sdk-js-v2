#!/usr/bin/env bash
set -ex

VERSION_FILE_PATH=$1
if [ ! readlink -e "$VERSION_FILE_PATH" ]; then
    echo "No VERSION file found! Cannot make release!"
    exit 1
else
    echo "VERSION file found..."
fi
VERSION=$(cat $VERSION_FILE_PATH)

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

PUBLISHED_TAG_VERSION=`npm show aws-iot-device-sdk-v2 version`
if [ "$PUBLISHED_TAG_VERSION" == "$VERSION" ]; then
    echo "$VERSION found in npm. Testing release..."

    # install the Typescript and the SDK
    npm install -g typescript
    npm install

    # Move to the sample folder and get the endpoint
    cd samples/node/pub_sub
    ENDPOINT=$(aws secretsmanager get-secret-value --secret-id "ci/endpoint" --region us-east-1 --query "SecretString" | cut -f2 -d":" | sed -e 's/[\\\"\}]//g')

    # Run the sample!
    npm install
    node dist/index.js --endpoint $ENDPOINT --ca_file /tmp/AmazonRootCA1.pem --cert /tmp/certificate.pem --key /tmp/privatekey.pem

    exit 0

else
    echo "$VERSION was not found in npm. Release failed!"
fi

exit 1
