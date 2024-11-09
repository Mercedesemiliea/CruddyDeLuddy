<?php
// Hämta produkter från API
$url = 'http://localhost:3000/api/products';
$products_json = file_get_contents($url);
$products = json_decode($products_json, true);


header('Content-Type: application/xml');
header('Content-Disposition: attachment;filename=products.xml');


$xml = new SimpleXMLElement('<products/>');

foreach ($products as $product) {
    $product_xml = $xml->addChild('product');
    $product_xml->addChild('id', $product['id']);
    $product_xml->addChild('name', htmlspecialchars($product['name']));
    $product_xml->addChild('price', $product['price']);
    $product_xml->addChild('description', htmlspecialchars($product['description']));
}


echo $xml->asXML();
exit;
