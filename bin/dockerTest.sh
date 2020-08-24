#!/bin/bash

VERSION=$1
DIR=$2

TAG="${DIR}:${VERSION}"

yarn config set registry https://registry.npm.taobao.org && yarn
yarn builddev

docker build -t ${TAG} .
docker login https://dockers.homay.com -u lixingming@homay.com -p midi123456
docker push ${TAG}
