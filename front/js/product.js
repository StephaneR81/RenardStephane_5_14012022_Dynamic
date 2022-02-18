// KANAP PRODUCT PAGE SCRIPT

//|||||||||||
//|VARIABLES|
//|||||||||||

const productId = getProductID();

//Element selectors
const imgSelector = document.querySelector(".item__img");
const nameSelector = document.querySelector("#title");
const priceSelector = document.querySelector("#price");
const descriptionSelector = document.querySelector("#description");
const colorSelector = document.querySelector("#colors");
const quantitySelector = document.querySelector("#quantity");
const submitSelector = document.querySelector("#addToCart");


//|||||||||||
//|FUNCTIONS|
//|||||||||||

//Fetches all informations from API for one product.
async function fetchSofaDetails() {

    await fetch(getProductURL())

        .then(
            (response) => {
                return response.json();
            })

        .then(
            (sofa) => {
                createSofaCard(sofa);
                quantitySelector.value = 1;
                document.title = sofa.name;
            })

        .catch(
            (error) => {
                alert("Le produit n'a pu être affiché.\nMerci de réessayer ultérieurement. ");
                console.error(error);
            });
}

//Creates and appends HTML elements for printing the product card.
function createSofaCard(sofa) {
    const imgElement = document.createElement("img");
    imgElement.src = sofa.imageUrl;
    imgElement.alt = sofa.altTxt;
    imgSelector.append(imgElement);

    nameSelector.textContent = sofa.name;
    priceSelector.textContent = sofa.price;
    descriptionSelector.textContent = sofa.description;

    for (const color of sofa.colors) {
        const colorElement = document.createElement("option");
        colorElement.value = color;
        colorElement.textContent = color;
        colorSelector.append(colorElement);
    }
}

//Returns the current product ID from URL (String), or null.
function getProductID() {
    let params = new URLSearchParams(window.location.search);
    return params.has("id") ? params.get("id") : null;
}

//Returns the API URL for the current product (String).
function getProductURL() {
    const productURL = `http://localhost:3000/api/products/${productId}`;
    return productURL;
}

//FORMULAR RELATED FUNCTIONS
//Checks if the selected quantity is a number between 1 and 100. Returns boolean.
function isValidQuantity() {
    const value = Number(quantitySelector.value);
    return (isNaN(value) || !Number.isInteger(value) || value === "" || value < 1 || value > 100) ? false : true;
}

//Checks if a color has been selected. Returns boolean.
function isValidColor() {
    const value = colorSelector.options[colorSelector.selectedIndex].value;
    return value === "" || value === null ? false : true;
}

//BASKET RELATED FUNCTIONS
//Gets basket from local storage.
function getBasket() {
    let basket = localStorage.getItem("basket");
    return (basket !== null) ? JSON.parse(basket) : []; //Creates basket if not.
}

//Adds item to basket
function addToBasket(item) {
    let basket = getBasket();
    let itemIndexFound = basket.findIndex(itemObj => itemObj.id === item.id && itemObj.color === item.color); // Returns the found item index in basket, or -1 if not found.

    if (itemIndexFound !== -1) { // If an existing item has been found, sets the current item new quantity, removes the old item object from basket and adds the new one.
        const newQuantity = Number(basket[itemIndexFound].quantity) + Number(item.quantity);
        item.quantity = Number(newQuantity);
        basket.splice(itemIndexFound, 1, item);
    } else {
        basket.push(item);
    }
    storeBasket(basket);
}

//Adds basket to local storage.
function storeBasket(basket) {
    localStorage.setItem("basket", JSON.stringify(basket));
}

//Adds a "CLICK" listener to the "ADD TO CART" button.
function addToCartListener() {
    submitSelector.addEventListener("click", () => {

        if (isValidColor() && isValidQuantity()) {
            const color = colorSelector.options[colorSelector.selectedIndex].value;
            const quantity = Number(quantitySelector.value);
            const name = nameSelector.textContent;
            const url = document.querySelector(".item__img img").src;
            const altTxt = document.querySelector(".item__img img").alt;

            const item = {
                id: productId,
                color: color,
                quantity: quantity,
                name: name,
                imageUrl: url,
                altTxt: altTxt
            };

            addToBasket(item);
            window.location.href = "./cart.html";
        } else {
            if (!isValidColor()) {
                alert("Merci de sélectionner une couleur");
            } else if (!isValidQuantity()) {
                const message = `Veuillez saisir une quantité comprise entre 1 et 100.\n
            - La valeur doit être un nombre entier (sans point ou virgule)
            - Pas de caractères alphabétiques
            - Pas de caractères spéciaux`;
                alert(message);
            }

        }
    });
}

//FIRST FUNCTION TO BE EXECUTED ON SCRIPT LOAD
async function initialize() {
    await fetchSofaDetails();
    addToCartListener();
}

initialize();