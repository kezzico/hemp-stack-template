source .env

if [[ -n "$REMOTE" ]]; then
  if [[ ! -f "key.pem" ]]; then
    echo "🔑 missing key.pem"
    exit 1;
  fi

  ssh -i key.pem node@$HOST "fuser -k $PORT/tcp || true"
  ssh -i key.pem node@$HOST "cd $APP_DIRECTORY && npx nodemon index.js"
else

  fuser -k $PORT/tcp || true
  cd $APP_DIRECTORY && npx nodemon index.js
fi


