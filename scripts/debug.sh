source .env

if [[ ! -f "key.pem" ]]; then
  echo "🔑 missing key.pem -- follow steps to create key.pem https://rootserver.kezzi.co/docs/key"
  exit 1;
fi

ssh -i key.pem node@$HOST "fuser -k $PORT/tcp || true"
ssh -i key.pem node@$HOST "cd $APP_DIRECTORY && npx nodemon index.js"

