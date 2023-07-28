#!/bin/bash
echo "Begin NestJS configuration"

echo "Install required depedencies"
cd home

yarn cache clean
yarn install --check-files

#Start dev env
echo "Starting dev frontend environment"
yarn run start:dev:backend
