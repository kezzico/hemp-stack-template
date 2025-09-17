# Hemp Stack – Workspace Template

The **Hemp Stack** combines the strengths of **PHP** and **Node.js (Express)** into a lightweight, flexible development stack.

Instead of choosing between “old school” PHP or “modern” Node, Hemp Stack embraces both:

* **PHP** handles templating and server-side rendering for HTML.
* **Express** handles APIs, state management, JSON responses, and async workflows.

Think of PHP as your **chef** preparing HTML, and Express as your **delivery driver** making sure data gets where it needs to go quickly.

---

## Why Hemp? 🌱

Humans don’t always like what they don’t understand, so let’s make it clear:

* **Separation of concerns** – PHP takes care of views, Node focuses on data and state.
* **Simple + modern** – Keep the speed of server-side rendering while unlocking JSON APIs, async workflows, and modern backend patterns.
* **Flexibility** – Works with plain HTML forms, JSON APIs, and frontend frameworks if you want to scale up.
* **Grassroots feel** – Lightweight, practical, and accessible to both new and experienced developers.

---

## How It Works

* **State** can be stored in cookies, forms, or query params.
* **PHP** is great for HTML templating and quick server-side rendering.
* **Express** powers REST endpoints, JSON responses, and async logic.
* **Forms** can post directly to Express; Express can respond with JSON or set cookies for downstream navigation.

This makes Hemp Stack a bridge between the simplicity of classic web development and the flexibility of modern stacks.

---

## Nginx Configuration Example

Here’s an example **Nginx configuration** for running a Hemp Stack app in production.

* **PHP-FPM** handles `.php` files.
* **Node/Express** runs on port `3050` and serves API routes.
* **Nginx** routes requests: static files & PHP go to PHP-FPM, everything else can fall back to Node.

```nginx
server {
    listen 80;
    listen [::]:80;

    listen 443 ssl;
    listen [::]:443 ssl;

    ssl_certificate_key /etc/letsencrypt/live/example.com/privkey.pem;
    ssl_certificate     /etc/letsencrypt/live/example.com/fullchain.pem;

    server_name example.com;

    root /var/www/example.com;
    index index.html index.xml index.php;

    error_page 404 /errors/404.html;
    error_page 500 502 503 504 /errors/500.html;

    access_log /home/node/logs/example.com/access.log www;
    error_log  /home/node/logs/example.com/error.log error;

    location / {
        try_files $uri $uri/ @nodejs;
    }

    location ~ \.php$ {
        fastcgi_pass unix:/run/php/php-fpm.sock;
        fastcgi_index index.php;
        include fastcgi_params;
        fastcgi_param SCRIPT_FILENAME $document_root$fastcgi_script_name;
    }

    location @nodejs {
        proxy_pass http://127.0.0.1:3050;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
}
```

## Getting Started

Clone the repo:

```bash
git clone https://github.com/kezzico/workspace-template.git
cd workspace-template
```

Install dependencies:

```bash
# Node dependencies
npm install

# (Optional) PHP dependencies via composer
composer install
```

Run the stack:

```bash
# Start Express API
npm start

# Serve PHP via your local server (e.g., php -S localhost:8000)
php -S localhost:8000
```

Open in your browser:

```
http://localhost:8000
```

---

## When to Use Hemp Stack

* You want **fast, simple HTML rendering** without a heavy frontend framework.
* You need **modern APIs** for JSON, state management, or mobile apps.
* You want to keep things **small, accessible, and fun** while still being future-proof.

---

## Contributing

Feedback is welcome! If you’ve got ideas, issues, or improvements, open an issue or PR.

---

## License

MIT

---

👉 Repo link: [workspace-template](https://github.com/kezzico/workspace-template)
