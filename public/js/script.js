



const apiUrl = 'https://vercelcrud-mercedesemiliea-mercedesemilieas-projects.vercel.app/';
document.addEventListener('DOMContentLoaded', () => {
    fetchProducts();

    // Hantera Create-knappen
    const createButton = document.getElementById('create-button');
    if (createButton) {
        createButton.addEventListener('click', handleCreate);
    }

    // Event delegation för dynamiskt skapade knappar
    document.getElementById('product-list').addEventListener('click', (event) => {
        const target = event.target;

        if (target.classList.contains('delete')) {
            deleteProduct(event);
        }

        if (target.classList.contains('edit')) {
            showEditForm(event);
        }

        if (target.classList.contains('save')) {
            saveProduct(event);
        }

        if (target.classList.contains('cancel')) {
            hideEditForm(event);
        }
    });
});

// Funktion för att hämta och visa produkter
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
    const productList = document.getElementById('product-list');
    productList.innerHTML = ''; // Rensa listan

    products.forEach(product => {
        const li = document.createElement('li');
        li.className = 'product-item';
        li.setAttribute('data-id', product.id);
        li.innerHTML = `
                <div class="product-info">
                    <strong class="product-name">${product.name}</strong>
                    <span class="product-price">${product.price} kr</span>
                    <p class="product-description">${product.description}</p>
                      </div>     
                          
                <button type="button" class="edit" data-id="${product.id}">Edit</button>
                <button type="button" class="delete" data-id="${product.id}">Delete</button>
               
                <form class="edit-form" style="display:none;">                   
                    <input type="text" name="name" value="${product.name}" placeholder="Namn" required>                   
                    <input type="number" name="price" value="${product.price}" placeholder="Pris" required>
                    <input type="text" name="description" value="${product.description}" placeholder="Beskrivning">
                    <button type="button" class="save" data-id="${product.id}">Save</button>
                    <button type="button" class="cancel" data-id="${product.id}">Cancel</button>
                    </form>
            `;
        productList.appendChild(li);
    });
}

// Funktion för att hantera skapandet av en ny produkt
async function handleCreate(event) {
    event.preventDefault();
    const form = document.getElementById('create-form');
    const formData = new FormData(form);

    try {
        const response = await fetch('index.php', {
            method: 'POST',
            body: formData
        });
        const data = await response.json();

        if (data.success) {
            fetchProducts(); // Hämta om produkter
            form.reset();
            showAlert('Product created successfully!', 'success');
        } else {
            showAlert('Failed to create product.', 'error');
        }
    } catch (error) {
        console.error('Error:', error);
        showAlert('An error occurred.', 'error');
    }
}

// Funktion för att visa redigeringsformuläret
function showEditForm(event) {
    const productId = event.target.getAttribute('data-id');
    const productItem = document.querySelector(`.product-item[data-id="${productId}"]`);
    const editForm = productItem.querySelector('.edit-form');

    editForm.style.display = 'block';
    productItem.querySelector('.product-info').style.display = 'none';
    productItem.querySelector('.edit').style.display = 'none';
}

// Funktion för att dölja redigeringsformuläret
function hideEditForm(event) {
    const productId = event.target.getAttribute('data-id');
    const productItem = document.querySelector(`.product-item[data-id="${productId}"]`);
    const editForm = productItem.querySelector('.edit-form');

    editForm.style.display = 'none';
    productItem.querySelector('.product-info').style.display = 'block';
    productItem.querySelector('.edit').style.display = 'inline';
}

// Funktion för att spara ändringar
async function saveProduct(event) {
    const productId = event.target.getAttribute('data-id');
    const productItem = document.querySelector(`.product-item[data-id="${productId}"]`);
    const editForm = productItem.querySelector('.edit-form');
    const formData = new FormData(editForm);

    formData.append('action', 'update');
    formData.append('id', productId);

    try {
        const response = await fetch('index.php', {
            method: 'POST',
            body: formData
        });
        const data = await response.json();

        if (data.success) {
            fetchProducts(); // Hämta om produkter
            showAlert('Product updated successfully!', 'success');
        } else {
            showAlert('Failed to update product.', 'error');
        }
    } catch (error) {
        console.error('Error:', error);
        showAlert('An error occurred.', 'error');
    }
}

// Funktion för att radera en produkt
async function deleteProduct(event) {
    const productId = event.target.getAttribute('data-id');
    const formData = new FormData();
    formData.append('action', 'delete');
    formData.append('id', productId);

    try {
        const response = await fetch('index.php', {
            method: 'POST',
            body: formData
        });
        const data = await response.json();

        if (data.success) {
            fetchProducts(); // Hämta om produkter
            showAlert('Product deleted successfully!', 'success');
        } else {
            showAlert('Failed to delete product.', 'error');
        }
    } catch (error) {
        console.error('Error:', error);
        showAlert('An error occurred.', 'error');
    }
}

// Funktion för att visa meddelanden
function showAlert(message, type) {
    const messageContainer = document.getElementById('message-container');
    messageContainer.innerHTML = ''; // Rensa tidigare meddelanden

    const messageDiv = document.createElement('div');
    messageDiv.className = `alert ${type === 'success' ? 'alert-success' : 'alert-error'}`;
    messageDiv.textContent = message;
    messageContainer.appendChild(messageDiv);

    setTimeout(() => {
        messageDiv.style.opacity = '0';
        setTimeout(() => {
            messageDiv.remove();
        }, 500);
    }, 3000);
}