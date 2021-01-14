#!/usr/bin/env bash

# DEMO or PROD
ENV=$1
SSH=muden@s17.wservices.ch

NODE_VERSION=$(node -v)

cd ../rtg

echo "Preparing NPM..."
/home/mloeks/.nvm/versions/node/${NODE_VERSION}/bin/npm run clean
#/home/mloeks/.nvm/versions/node/${NODE_VERSION}/bin/npm i
#/home/mloeks/.nvm/versions/node/${NODE_VERSION}/bin/npm rebuild node-sass --force

echo "Building ${ENV} assets..."
NPM_SCRIPT=$([ "$ENV" == "PROD" ] && echo "build" || echo "build:demo")
/home/mloeks/.nvm/versions/node/${NODE_VERSION}/bin/npm run ${NPM_SCRIPT}

echo "Uploading new assets..."
TARGET_APP=$([ "$ENV" == "PROD" ] && echo "rtg" || echo "rtg_demo")
ssh ${SSH} rm -rf /home/muden/${TARGET_APP}/rtg_frontend
ssh ${SSH} mkdir /home/muden/${TARGET_APP}/rtg_frontend
scp -r build/* ${SSH}:/home/muden/${TARGET_APP}/rtg_frontend






