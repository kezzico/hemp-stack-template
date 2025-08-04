# expected to be run from the root of the project
echo "<?php" > ./www/env.php
while IFS='=' read -r key value; do
    # Skip empty lines and comments
    [[ -z "$key" || "$key" =~ ^# ]] && continue
    # Escape double quotes in value
    value="${value//\"/\\\"}"
    echo "\$_ENV['${key}'] = \"${value}\";" >> ./www/env.php
done < .env
echo "?>" >> ./www/env.php

