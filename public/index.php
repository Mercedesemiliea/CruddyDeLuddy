<?php
session_start();


// Funktion för att göra API-anrop
function callAPI($method, $url, $data = false)
{
    $curl = curl_init();

    switch ($method) {
        case "POST":
            curl_setopt($curl, CURLOPT_POST, 1);
            if ($data)
                curl_setopt($curl, CURLOPT_POSTFIELDS, json_encode($data));
            break;
        case "PUT":
            curl_setopt($curl, CURLOPT_CUSTOMREQUEST, "PUT");
            if ($data)
                curl_setopt($curl, CURLOPT_POSTFIELDS, json_encode($data));
            break;
        case "DELETE":
            curl_setopt($curl, CURLOPT_CUSTOMREQUEST, "DELETE");
            break;
        default:
            if ($data)
                $url = sprintf("%s?%s", $url, http_build_query($data));
    }
    // Options:
    curl_setopt($curl, CURLOPT_URL, $url);
    curl_setopt($curl, CURLOPT_HTTPHEADER, array(
        'Content-Type: application/json',
    ));
    curl_setopt($curl, CURLOPT_RETURNTRANSFER, 1);

    $result = curl_exec($curl);
    curl_close($curl);

    return json_decode($result, true);
}

$url = 'http://localhost:3000/api/products';
$products_json = file_get_contents($url);
$products = json_decode($products_json, true);
$products = callAPI('GET', $url);

usort($products, function ($a, $b) {
    return $b['id'] - $a['id'];
});
// Hantera POST-förfrågningar för att skapa, uppdatera och radera produkter
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (isset($_POST['action'])) {
        if ($_POST['action'] === 'create') {
            // Skapa ny produkt
            $new_product = [
                'id' => uniqid(),
                'name' => $_POST['name'],
                'price' => $_POST['price'],
                'description' => $_POST['description']
            ];
            callAPI('POST', $url, $new_product);

            $_SESSION['create_message'] = 'New product created';
            header("Location: index.php");
            exit;

        } elseif ($_POST['action'] === 'update') {
            // Uppdatera befintlig produkt
            $updated_product = [
                'name' => $_POST['name'],
                'price' => $_POST['price'],
                'description' => $_POST['description']
            ];
            callAPI('PUT', $url . '/' . $_POST['id'], $updated_product);
            $_SESSION['update_message'] = 'Product updated';


            header("Location: index.php");
            exit;
        } elseif ($_POST['action'] === 'delete') {
            // Radera produkt
            callAPI('DELETE', $url . '/' . $_POST['id']);
            $_SESSION['delete_message'] = 'Product deleted';


            header("Location: index.php");
            exit;
        }
    }

}


?>

<!DOCTYPE html>
<html lang="sv">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Crud</title>
    <link rel="stylesheet" href="style.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css">
    <link type="image/png" sizes="16x16" rel="icon" href="icons\icons8-moon-16.png">
    <script src="js/productHandler.js" defer></script>
</head>

<body>
    <div class="product-list-container">
        <ul id="product-list">
            <h2> Product List</h2>
            <div class="export-buttons">
                <button type="button" onclick="window.location.href='export_csv.php'" class="export-button">Export to
                    CSV</button>
                <button type="button" onclick="window.location.href='export_xml.php'" class="export-button">Export to
                    XML</button>
            </div>
            <div class="messages">
                <?php
                if (isset($_SESSION['update_message'])) {
                    echo '<div class="alert alert-success">' . htmlspecialchars($_SESSION['update_message']) . '</div>';
                    unset($_SESSION['update_message']);
                }
                if (isset($_SESSION['delete_message'])) {
                    echo '<div class="alert alert-success">' . htmlspecialchars($_SESSION['delete_message']) . '</div>';
                    unset($_SESSION['delete_message']);
                }
                ?>
            </div>
            <?php foreach ($products as $product): ?>
                <li class="product-item" data-id="<?= htmlspecialchars($product['id']) ?>">
                    <span class="product-name"><?= htmlspecialchars($product['name']) ?></span>
                    <input type="text" class="edit-name" value="<?= htmlspecialchars($product['name']) ?>"
                        style="display:none;">
                    <span class="product-price"><?= htmlspecialchars($product['price']) ?> kr</span>
                    <input type="text" class="edit-price" value="<?= htmlspecialchars($product['price']) ?>"
                        style="display:none;">
                    <span class="product-description"><?= htmlspecialchars($product['description']) ?></span>
                    <input type="text" class="edit-description" value="<?= htmlspecialchars($product['description']) ?>"
                        style="display:none;">
                    <!-- Form för att uppdatera produkt -->
                    <form action="index.php" method="post" class="edit-form" style="display:none;">
                        <input type="hidden" name="action" value="update">
                        <input type="hidden" name="id" value="<?= $product['id'] ?>">
                        <input type="text" name="name" value="<?= $product['name'] ?>">
                        <input type="number" name="price" value="<?= $product['price'] ?>">
                        <input type="text" name="description" value="<?= $product['description'] ?>">
                        <button type="submit" class="save-button" onclick="saveProduct(this)">Save</button>
                        <button type="button" class="cancel-button">Cancel</button>
                    </form>
                    <button type="button" class="edit-button" onclick="editProduct(this)">Edit</button>
                    <form action="index.php" method="post" style="display: inline;">
                        <input type="hidden" name="action" value="delete">
                        <input type="hidden" name="id" value="<?= $product['id'] ?>">
                        <button type="submit" class="delete">Delete</button>
                    </form>
                </li>
            <?php endforeach; ?>
        </ul>
    </div>
    </div>
    <div class="container_create_products">
        <h2>Create new product</h2>
        <form action="index.php" method="post">
            <input type="hidden" name="action" value="create">
            <input type="text" name="name" id="name" placeholder="Name" required>
            <input type="number" name="price" id="price" placeholder="Price" required>
            <input type="text" name="description" id="description" placeholder="Description">
            <button type="submit">Create product</button>
            <?php
            if (isset($_SESSION['create_message'])) {
                echo '<div class="alert alert-success">' . htmlspecialchars($_SESSION['create_message']) . '</div>';
                unset($_SESSION['create_message']);
            }
            ?>
        </form>
    </div>
</body>

</html>