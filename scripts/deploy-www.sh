source .env

if [[ -n "$REMOTE" ]]; then
    if [[ ! -f "key.pem" ]]; then
        echo "🔑 missing key.pem"
        exit 1;
    fi

    ./scripts/make-php-env.sh

    rsync -e "ssh -i key.pem" \
        -avz ./www/* node@$HOST:$WEB_ROOT \
        --exclude='.DS_Store'
else
    if [ ! -d "node_modules" ]; then
        echo "node_modules not found. Running npm install"
        npm install
    fi

    ./scripts/make-php-env.sh
    
    rsync -avz ./www/* $WEB_ROOT
fi
