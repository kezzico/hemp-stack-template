source .env

if [[ ! -f "key.pem" ]]; then
  echo "🔑 missing key.pem -- follow steps to create key.pem https://rootserver.kezzi.co/docs/key"
  exit 1;
fi


ssh -i key.pem -t node@$HOST "mysql -u $DB_USER --password=$DB_PASSWORD -D $DB_SCHEMA"



