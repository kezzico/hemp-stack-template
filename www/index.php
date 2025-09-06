<?php
INI_SET('display_errors', 1);
error_reporting(E_ALL);

require_once __DIR__ . '/transform_xml.php';
require_once __DIR__ . '/env.php';

$port=$_ENV['PORT'];
$product_json = file_get_contents("http://127.0.0.1:$port/product/details/ct_planning_session");
$product = json_decode($product_json, true);

$testimonials_json = file_get_contents("http://127.0.0.1:$port/testimonial/list");
$testimonials = json_decode($testimonials_json, true);
$testimonial = $testimonials[array_rand($testimonials)];

$products_xml = '';
$testimonial_xml = '';


transform_xml('style.xslt', <<<XML
<?xml version="1.0" encoding="UTF-8"?>
<document title="Planning &amp; Consulting Services" 
           description="Expert guidance to help you build and scale your mobile software with confidence.">
    <header>
        <h1>Welcome to Code Therapy</h1>
    </header>

    <section>        
        <h2> What is Code Therapy? </h2>
        <p> Code Therapy is a unique approach to mobile software development, combining expert guidance with hands-on workshops. </p>
        <p> Providing expert guidance to help you build and scale your mobile software with confidence. </p>
        <p> Whether you're a solo developer or part of a larger team, our services are designed to meet you where you are and help you achieve your goals. </p>
    </section>

    <section>
        <h2>Developers aren't struggling with coding.</h2>
        <p>That's the easy part.</p>

        <h3>They're struggling with...</h3>
        <ul class="column">
            <li>
                <img src="/octo-overwhelm.svg" alt="feeling overwhelmed as an octopus" />
                <div>imposter syndrome</div>
            </li>
            <li>
                <img src="/octo-scattered.svg" alt="feeling scattered" />
                <div>scattered requirements</div>
            </li>
            <li>
                <img src="/octo-indecisive.svg" alt="feeling indecisive" />
                <div>constant distractions</div>
            </li>
        </ul>
        <hr />

        <p>But the solution is right there in front of them. Just out of reach. Someone to listen and understand</p>
        <p>Code Therapy gives developers a structured way to clear the fog, ship faster, and feel good about their work again.</p>
    </section>    


    <section>
        <h3>{$product['name']}</h3>
        <div class="service-price">{$product['price']}</div>
        <p>{$product['description']}</p>

        <p><strong>You'll come away with:</strong></p>

        <ul>
            <li>{$product['deliverables'][0]}</li>
            <li>{$product['deliverables'][1]}</li>
            <li>{$product['deliverables'][2]}</li>
        </ul>

        <a href="/signup.php?product={$product['id']}" class="btn-primary">Schedule Here →</a>

        <div class="testimonial">
            "{$testimonial['quote']}"
            <div class="testimonial-author">— {$testimonial['author']}</div>
        </div>
    </section>

    <footer>
    </footer>
</document>

XML);

?>