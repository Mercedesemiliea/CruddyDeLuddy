document.addEventListener('DOMContentLoaded', () => {
    const productList = document.getElementById('product-list');
    const createProductForm = document.getElementById('create-product-form');
    const messageContainer = document.getElementById('message-container');

    const apiUrl = 'https://vercelcrud-qfiify56s-mercedesemilieas-projects.vercel.app/api/products';
    // Funktion för att hämta produkter från API:et
    async function fetchProducts() {
        try {
            const response = await fetch('/api/products');
            const products = await response.json();
            displayProducts(products);
        } catch (error) {
            console.error('Error fetching products:', error);
        }
    }

    // Funktion för att visa produkter på sidan
    function displayProducts(products) {
        productList.innerHTML = '';
        products.forEach(product => {
            const li = document.createElement('li');
            li.className = 'product-item';
            li.innerHTML = `
                <div class="product-info">
                    <strong>${product.name}</strong>
                    <span class="product-price">${product.price} kr</span>
                </div>
                <p>${product.description}</p>
                <button type="submit" class="delete" data-id="${product.id}">Delete</button>
            `;
            productList.appendChild(li);
        });

        const deleteButtons = document.querySelectorAll('.delete');
        deleteButtons.forEach(button => {
            button.addEventListener('click', deleteProduct);
        });
    }

    async function deleteProduct(event) {
        const productId = event.target.getAttribute('data-id');

        try {
            await fetch(`${apiUrl}/${productId}`, {
                method: 'DELETE'
            });
            fetchProducts(); // Uppdatera produktlistan
            showSuccessMessage('Product deleted successfully!');
        } catch (error) {
            console.error('Error deleting product:', error);
        }
    }

    // Funktion för att skapa en ny produkt
    async function createProduct(event) {
        event.preventDefault();
        const formData = new FormData(createProductForm);
        const newProduct = {
            name: formData.get('name'),
            price: formData.get('price'),
            description: formData.get('description')
        };

        try {
            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(newProduct)
            });
            const product = await response.json();
            fetchProducts(); // Uppdatera produktlistan
            createProductForm.reset();
            showSuccessMessage('Product created successfully!');
        } catch (error) {
            console.error('Error creating product:', error);
        }
    }

    // Funktion för att visa ett meddelande
    function showSuccessMessage(message) {
        messageContainer.innerHTML = '';
        const messageDiv = document.createElement('div');
        messageDiv.className = 'success-message';
        messageDiv.textContent = message;
        messageContainer.appendChild(messageDiv);
        setTimeout(() => {
            messageDiv.remove();
        }, 3000); // Ta bort meddelandet efter 3 sekunder
    }


    function showEditForm(productId) {
        document.getElementById('edit-form-' + productId).style.display = 'inline';
        document.querySelector('.edit-button[onclick="showEditForm(' + productId + ')"]').style.display = 'none';
    }

    function hideEditForm(productId) {
        document.getElementById('edit-form-' + productId).style.display = 'none';
        document.querySelector('.edit-button[onclick="showEditForm(' + productId + ')"]').style.display = 'inline';
    }


    // Lägg till event listener för att skapa produktformuläret
    createProductForm.addEventListener('submit', createProduct);

    // Hämta och visa produkter när sidan laddas
    fetchProducts();
});