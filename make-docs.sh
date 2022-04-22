#!/usr/bin/env bash

set -ex

# clean
rm -rf docs/

# grab local copy of aws-crt-nodejs so we can build its docs into our own
if [ ! -d build/docs/aws-crt-nodejs ]; then
    mkdir -p build/docs
    git clone --single-branch https://github.com/awslabs/aws-crt-nodejs.git build/docs/aws-crt-nodejs
fi

CRT_VERSION=`npm view aws-crt version`
pushd build/docs/aws-crt-nodejs
git fetch
git checkout "v$CRT_VERSION"
popd

# build docs
npx typedoc --options typedoc.json
