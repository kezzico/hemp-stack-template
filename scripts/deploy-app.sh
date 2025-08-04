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

    ssh -i key.pem node@$HOST "cd $APP_DIRECTORY && npm install"
    scp -i key.pem .env node@$HOST:$APP_DIRECTORY/.env
else
    if [ ! -d "node_modules" ]; then
        echo "node_modules not found. Running npm install"
        npm install
    fi

    npx tsup

    rsync -avz ./.dist/ package.json $APP_DIRECTORY

    cp .env $APP_DIRECTORY/.env
    pushd $APP_DIRECTORY && npm install && popd
fi
