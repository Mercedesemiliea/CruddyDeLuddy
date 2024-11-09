const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const app = express();
const port = process.env.PORT || 3000;



// Använd body-parser för att läsa JSON-data från request body
app.use(bodyParser.json());

// Lagra produkter i en JSON-fil
let products = require('../data/products.json');

// Funktion för att spara produkter till filen
function saveProducts() {
    fs.writeFileSync(path.join(__dirname, '../data/products.json'), JSON.stringify(products, null, 2));
}

// GET: Hämta alla produkter
app.get('/api/products', (req, res) => {
    res.json(products);
});

// POST: Skapa ny produkt
app.post('/api/products', (req, res) => {
    const newProduct = req.body;
    newProduct.id = products.length ? products[products.length - 1].id + 1 : 1;
    products.push(newProduct);
    saveProducts();
    res.status(201).json(newProduct);
});

// DELETE: Radera produkt
app.delete('/api/products/:id', (req, res) => {
    const id = parseInt(req.params.id);
    products = products.filter(product => product.id !== id);
    saveProducts();
    res.status(204).end();
});

// PUT: Uppdatera produkt
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

// Starta servern
app.listen(port, () => {
    console.log(`Servern körs på http://localhost:${port}`);
});

module.exports = app;