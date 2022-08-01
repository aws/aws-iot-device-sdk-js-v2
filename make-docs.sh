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
# typedoc need source to be compiled to generate the docs. Pull and install the crt dependency to make sure the lib compiled.
git submodule update --init --recursive
npm install .
popd

# build docs
npx typedoc --options documents/typedoc-node.json
npx typedoc --options documents/typedoc-browser.json
cp documents/index.html docs/index.html
