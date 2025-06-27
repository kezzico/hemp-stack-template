source .env

if [[ ! -f "key.pem" ]]; then
  echo "🔑 missing key.pem -- follow steps to create key.pem https://rootserver.kezzi.co/docs/key"
  exit 1;
fi


ssh -i key.pem node@$HOST "cd $APP_DIRECTORY && pm2 stop $APP_NAME"
ssh -i key.pem node@$HOST "cd $APP_DIRECTORY && pm2 start index.js --name $APP_NAME"


