command=$1
source .env

if [[ -n "$REMOTE" ]]; then
  if [[ ! -f "key.pem" ]]; then
    echo "🔑 missing key.pem"
    exit 1;
  fi

  ssh -i key.pem node@$HOST "cd $APP_DIRECTORY && pm2 $command index.js --name $APP_NAME"
else
  cd $APP_DIRECTORY && pm2 $command index.js --name $APP_NAME
fi



