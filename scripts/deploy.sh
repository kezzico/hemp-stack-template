source .env

if [[ -n "$REMOTE" ]]; then
    if [[ ! -f "key.pem" ]]; then
        echo "🔑 missing key.pem"
        exit 1;
    fi

    if [ ! -d "node_modules" ]; then
        echo "node_modules not found. Running npm install"
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
else
    if [ ! -d "node_modules" ]; then
        echo "node_modules not found. Running npm install"
        npm install
    fi

    npx tsup

    rsync -avz ./.dist/ package.json $APP_DIRECTORY
    rsync -avz ./www/* $WEB_ROOT

    cd $APP_DIRECTORY && npm install
    cp .env $APP_DIRECTORY/.env
fi
