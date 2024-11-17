const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const app = express();
const port = 3000;
const path = require('path');


app.use(bodyParser.json());


let products = require('../data/products.json');

function saveProducts() {
    fs.writeFileSync('../data/products.json', JSON.stringify(products, null, 2));
}


// GET: Hämta alla produkter
app.get('/api/products', (req, res) => {
    res.json(products);
});

// POST: Skapa ny produkt
app.post('/api/products', (req, res) => {
    const newProduct = req.body;
    products.sort((a, b) => a.id - b.id);
    const maxId = products.length ? products[products.length - 1].id : 0;
    newProduct.id = maxId + 1;

    // Kontrollera att id är unikt
    const exists = products.some(product => product.id === newProduct.id);
    if (exists) {
        return res.status(500).json({ message: 'Duplicate product ID detected.' });
    }

    products.push(newProduct);
    saveProducts();
    res.status(201).json(newProduct);
});


// PUT: Uppdatera en produkt
app.put('/api/products/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const updatedProduct = req.body;
    const index = products.findIndex(product => product.id === id);
    if (index !== -1) {
        products[index] = { ...products[index], ...updatedProduct };
        saveProducts();
        res.json(products[index]);
    } else {
        res.status(404).json({ message: 'Product not found' });
    }
});




// DELETE: Radera produkt
app.delete('/api/products/:id', (req, res) => {
    const id = parseInt(req.params.id);
    products = products.filter(product => product.id !== id);
    saveProducts();
    res.status(204).end();
});


// Exportera produkter till CSV
app.get('/api/products/export/csv', (req, res) => {
    const csvData = products.map(p => `${p.id},${p.name},${p.price},${p.image}`).join('\n');
    res.header('Content-Type', 'text/csv');
    res.attachment('products.csv');
    res.send(`id,name,price,image\n${csvData}`);
});


app.use(express.static(path.join(__dirname, '../public')));



// Starta servern
app.listen(port, () => {
    console.log(`Servern körs på http://localhost:${port}`);
});
