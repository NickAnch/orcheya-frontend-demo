#!/usr/bin/env bash

export SERVER_IP="46.254.19.100"
export SERVER_PORT="42777"
export USERNAME="deploy"
export BRANCH_NAME="master"

ssh -A $USERNAME@$SERVER_IP -p $SERVER_PORT '
  cd /srv/orcheya-client;
  export NVM_DIR="/home/deploy/.nvm";
  [ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh";
  nvm use 9.3.0;
  git fetch;
  git checkout $BRANCH_NAME --force;
  git pull origin master --force;
  mv dist dist_timeless;
  yarn install;
  yarn build;
  if [ -d "./dist" ]
  then
    rm -rf dist_timeless;
  else
    mv dist_timeless dist;
  fi
'
