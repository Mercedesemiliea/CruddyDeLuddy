

// Funktion för att starta redigering
function editProduct(button) {
    const productItem = button.closest('.product-item');
    const editForm = productItem.querySelector('.edit-form');
    const productName = productItem.querySelector('.product-name');
    const productPrice = productItem.querySelector('.product-price');
    const productDescription = productItem.querySelector('.product-description');
    const editButton = productItem.querySelector('.edit-button');
    const saveButton = productItem.querySelector('.save-button');
    const cancelButton = productItem.querySelector('.cancel-button');

    // Dölj visningselement och visa redigeringsfält
    productName.style.display = 'none';
    productPrice.style.display = 'none';
    productDescription.style.display = 'none';
    editForm.style.display = "block";
    editButton.style.display = "none";
    saveButton.style.display = "inline";
    cancelButton.style.display = "inline";
}

// Funktion för att spara ändringar
function saveProduct(button) {
    const editForm = button.closest('.edit-form');
    editForm.submit();
}

// Funktion för att avbryta redigering
function cancelEdit(event) {
    const button = event.target;
    const productItem = button.closest('.product-item');
    const editForm = productItem.querySelector('.edit-form');
    const productName = productItem.querySelector('.product-name');
    const productPrice = productItem.querySelector('.product-price');
    const productDescription = productItem.querySelector('.product-description');
    const editButton = productItem.querySelector('.edit-button');
    const saveButton = productItem.querySelector('.save-button');
    const cancelButton = productItem.querySelector('.cancel-button');
    // Återställ visning av produktinformation och dölj redigeringsfält
    productName.style.display = 'block';
    productPrice.style.display = 'block';
    productDescription.style.display = 'block';
    editForm.style.display = 'none';
    editButton.style.display = "inline";
    saveButton.style.display = "none";
    cancelButton.style.display = "none";
}

setTimeout(() => {
    document.querySelectorAll('.alert').forEach(alert => {
        alert.style.display = 'none';
    });
}, 6000);