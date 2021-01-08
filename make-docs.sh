#!/usr/bin/env bash

set -ex

if [ ! -d build/docs/aws-crt-nodejs ]; then
    mkdir -p build/docs
    git clone --single-branch https://github.com/awslabs/aws-crt-nodejs.git build/docs/aws-crt-nodejs
fi
npx typedoc \
    --includeDeclarations \
    --excludeExternals \
    --excludeNotExported \
    --excludePrivate \
    --stripInternal \
    --includeVersion \
    --disableSources \
    --mode modules \
    --tsconfig tdconfig.json \
    --out docs

