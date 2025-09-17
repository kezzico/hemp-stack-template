source "$1"

if [[ -n "$REMOTE" ]]; then
    if [[ ! -f "key.pem" ]]; then
        echo "🔑 missing key.pem"
        exit 1;
    fi

    if [ ! -d "node_modules" ]; then
        echo "node_modules not found. Running npm install"
        npm install
    fi

    ./scripts/make-php-env.sh "$1"

    rsync -e "ssh -i key.pem" \
        -avz ./www/* node@$HOST:$WEB_ROOT \
            --exclude='Thumbs.db' \
            --exclude='.DS_Store'

    # build step
    if ! npx tsup; then
        echo "❌ Build failed, aborting deploy."
        exit 1
    fi

    did_stop_app=0
    if ! ssh -i key.pem node@$HOST "cmp -s $APP_DIRECTORY/.env -" < "$1"; then
        echo ".env has changed. Uploading to server and stopping application."
        ssh -i key.pem node@$HOST "cd $APP_DIRECTORY && pm2 stop $APP_NAME"
        scp -i key.pem "$1" node@$HOST:$APP_DIRECTORY/.env
        did_stop_app=1
    else
        echo ".env is unchanged. Skipping upload."
    fi

    if ! ssh -i key.pem node@$HOST "cmp -s $APP_DIRECTORY/package.json -" < package.json; then
        echo "package.json has changed. Uploading and running npm install on server."

        ssh -i key.pem node@$HOST "cd $APP_DIRECTORY && pm2 stop $APP_NAME"
        scp -i key.pem package.json node@$HOST:$APP_DIRECTORY/package.json
        ssh -i key.pem node@$HOST "cd $APP_DIRECTORY && npm install --production"
        did_stop_app=1
    else
        echo "package.json is unchanged. Skipping npm install on server."
    fi

    if ! ssh -i key.pem node@$HOST "cmp -s $APP_DIRECTORY/index.js -" < ./.dist/index.js; then
        rsync -e "ssh -i key.pem" \
            -avzc ./.dist/ node@$HOST:$APP_DIRECTORY \
            --exclude='.DS_Store' \
            --exclude='Thumbs.db'
    else
        echo "index.js is unchanged. Skipping upload."
    fi

    if [ $did_stop_app -eq 1 ]; then
        echo "Application was stopped. Restarting..."
        # restart is causing the watch to stop
        ssh -i key.pem node@$HOST "cd $APP_DIRECTORY && pm2 delete $APP_NAME || pm2 start pm2.config.js"
    fi

else
    if [ ! -d "node_modules" ]; then
        echo "node_modules not found. Running npm install"
        npm install
    fi

    ./scripts/make-php-env.sh "$1"

    rsync -avz ./www/* "$WEB_ROOT" \
        --exclude='Thumbs.db' \
        --exclude='.DS_Store'

    # build step
    if ! npx tsup; then
        echo "❌ Build failed, aborting deploy."
        exit 1
    fi

    did_stop_app=0
    if ! cmp -s "$APP_DIRECTORY/.env" "$1"; then
        echo ".env has changed. Copying and stopping application."
        cp "$1" "$APP_DIRECTORY/.env"
        pm2 stop "$APP_NAME"
        did_stop_app=1
    else
        echo ".env is unchanged. Skipping copy."
    fi

    if ! cmp -s "$APP_DIRECTORY/package.json" package.json; then
        echo "package.json has changed. Copying and running npm install."
        cp package.json "$APP_DIRECTORY/package.json"
        (cd "$APP_DIRECTORY" && npm install --production)
        pm2 stop "$APP_NAME"
        did_stop_app=1
    else
        echo "package.json is unchanged. Skipping npm install."
    fi

    if ! cmp -s "$APP_DIRECTORY/index.js" ./.dist/index.js; then
        rsync -avzc ./.dist/ "$APP_DIRECTORY" \
            --exclude='.DS_Store' \
            --exclude='Thumbs.db'
    else
        echo "index.js is unchanged. Skipping copy."
    fi

    if [ $did_stop_app -eq 1 ]; then
        echo "Application was stopped. Restarting..."
        cd "$APP_DIRECTORY" \
            && pm2 delete "$APP_NAME" || echo "delete failed, continuing" \
            && pm2 start pm2.config.js

    fi
fi
