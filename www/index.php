<?php
// INI_SET('display_errors', 1);
// error_reporting(E_ALL);

require_once __DIR__ . './_backend.php';

$health = backend_get('/health');
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Backend Health Check</title>
</head>
<body>
    <h1>Backend Health Check</h1>
    <?php if ($health && backend_response_code() === 200): ?>
        <p style="color: green;">Backend is healthy!</p>
        <pre><?php echo json_encode($health, JSON_PRETTY_PRINT); ?></pre>
    <?php else: ?>
        <p style="color: red;">Backend is not reachable or unhealthy.</p>
        <?php if (backend_response_code() !== null): ?>
            <p>HTTP Response Code: <?php echo backend_response_code(); ?></p>
        <?php endif; ?>
    <?php endif; ?>
</body>
</html>

