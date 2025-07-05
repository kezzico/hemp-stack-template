source .env

if [[ -n "$REMOTE" ]]; then
  if [[ ! -f "key.pem" ]]; then
    echo "🔑 missing key.pem"
    exit 1;
  fi

  ssh -i key.pem -t node@$HOST "mysql -u $DB_USER --password=$DB_PASSWORD -D $DB_SCHEMA"
else
  mysql -u $DB_USER --password=$DB_PASSWORD -D $DB_SCHEMA  
fi
