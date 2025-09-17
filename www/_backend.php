<?php
require_once __DIR__ . '/env.php';

$base_url = "http://127.0.0.1:{$_ENV['PORT']}";
$last_http_response_code = null;

function backend_get($route) {
    global $base_url;
    $json = file_get_contents("$base_url$route");

    global $last_http_response_code;
    if (isset($http_response_header) && preg_match('#HTTP/\d+\.\d+\s+(\d+)#', $http_response_header[0], $matches)) {
      $last_http_response_code = (int)$matches[1];
    } else {
      $last_http_response_code = null;
    }

    return json_decode($json);
}

function backend_post($route, $data) {
    global $base_url;
    $json = json_encode($data);
    $url = "$base_url$route";

    $opts = array(
      'http' => array(
        'method'  => 'POST',
        'header'  => 'Content-Type: application/json',
        'content' => $json
      )
    );

    $context  = stream_context_create($opts);

    $json = file_get_contents($url, false, $context);

    global $last_http_response_code;
    if (isset($http_response_header) && preg_match('#HTTP/\d+\.\d+\s+(\d+)#', $http_response_header[0], $matches)) {
      $last_http_response_code = (int)$matches[1];
    } else {
      $last_http_response_code = null;
    }

    return json_decode($json);
}

function backend_response_code() {
    global $last_http_response_code;
    return $last_http_response_code;
}

