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

# Does NPM have the version? If so, do not allow it!
PUBLISHED_TAG_VERSION=`npm show aws-iot-device-sdk-v2 version`
if [ "$PUBLISHED_TAG_VERSION" == "$VERSION" ]; then
    echo "$VERSION is already in npm, cut a new tag if you want to upload another version."
    exit 1
fi

echo "$VERSION currently does not exist in npm, allowing pipeline to continue."
exit 0