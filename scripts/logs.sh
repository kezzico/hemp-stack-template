source "$1"

if [[ -n "$REMOTE" ]]; then
  if [[ ! -f "key.pem" ]]; then
    echo "🔑 missing key.pem"
    exit 1;
  fi

  ssh -i key.pem node@$HOST "tail -f ~/.pm2/logs/$APP_NAME-error.log ~/.pm2/logs/$APP_NAME-out.log"
else

  tail -f ~/.pm2/logs/$APP_NAME-error.log ~/.pm2/logs/$APP_NAME-out.log
fi


