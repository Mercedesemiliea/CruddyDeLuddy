<?php
// Hämta produkter från API
$url = 'http://localhost:3000/api/products';
$products_json = file_get_contents($url);
$products = json_decode($products_json, true);


header('Content-Type: text/csv');
header('Content-Disposition: attachment;filename=products.csv');


$output = fopen('php://output', 'w');
fputcsv($output, ['ID', 'Namn', 'Pris', 'Beskrivning']); // CSV-header

foreach ($products as $product) {
    fputcsv($output, [$product['id'], $product['name'], $product['price'], $product['description']]);
}

fclose($output);
exit;
