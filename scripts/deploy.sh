source .env

if [[ ! -f "key.pem" ]]; then
  echo "🔑 missing key.pem -- follow steps to create key.pem https://rootserver.kezzi.co/docs/key"
  exit 1;
fi


if [ ! -d "node_modules" ]; then
    echo "node_modules not found. Running npm install locally..."
    npm install
fi

npx tsup

rsync -e "ssh -i key.pem" \
    -avz ./.dist/ package.json node@$HOST:$APP_DIRECTORY \
    --exclude='.DS_Store'

rsync -e "ssh -i key.pem" \
    -avz ./www/* node@$HOST:$WEB_ROOT \
    --exclude='.DS_Store'

ssh -i key.pem node@$HOST "cd $APP_DIRECTORY && npm install"
scp -i key.pem .env node@$HOST:$APP_DIRECTORY/.env


