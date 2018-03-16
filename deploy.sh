#!/usr/bin/env bash

export SERVER_IP="46.254.19.100"
export SERVER_PORT="42777"
export USERNAME="deploy"

ssh -A $USERNAME@$SERVER_IP -p $SERVER_PORT '
  cd /srv/orcheya-client;
  export NVM_DIR="/home/deploy/.nvm";
  [ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh";
  nvm use 9.3.0;
  git pull origin master --force;
  yarn install;
  yarn build
'
