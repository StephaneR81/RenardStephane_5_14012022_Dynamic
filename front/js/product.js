// KANAP PRODUCT PAGE SCRIPT

//|||||||||||
//|VARIABLES|
//|||||||||||

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
function fetchSofaDetails() {

    fetch(getProductURL())

        .then(
            (response) => {
                return response.json();
            })

        .then(
            (sofa) => {
                createSofaCard(sofa);
                quantitySelector.value = 1;
            })

        .catch(
            (error) => {
                alert("Le produit n'a pu être affiché.\nVeuillez retenter ultérieurement. ");
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
    const productURL = `http://localhost:3000/api/products/${getProductID()}`;
    return productURL;
}

//FORMULAR RELATED FUNCTIONS
//Checks if the selected quantity is a number between 1 and 100. Returns boolean.
function isValidQuantity() {
    const value = quantitySelector.value;
    return (isNaN(value) || value === "" || value < 1 || value > 100) ? false : true;
}

//Checks if a color has been selected. Returns boolean.
function isValidColor() {
    const value = colorSelector.options[colorSelector.selectedIndex].value;
    return value === "" || value === null ? false : true;
}

//BASKET RELATED FUNCTIONS
//Adds basket to local storage.
function storeBasket(item) {
    localStorage.setItem("basket", JSON.stringify(item));
}

//Gets basket from local storage.
function getBasket() {
    let basket = localStorage.getItem("basket");
    return (basket !== null) ? JSON.parse(basket) : new Array(); //Creates basket if not.
}

//Adds items to basket
function addToBasket(item) {
    let basket = getBasket();
    storeBasket(item);
}

//|||||||||||
//|LISTENERS|
//|||||||||||

//Adds a "CLICK" listener to the "ADD TO CART" button.
submitSelector.addEventListener("click", () => {
    if (isValidColor() && isValidQuantity()) {
        const color = colorSelector.options[colorSelector.selectedIndex].value;
        const quantity = quantitySelector.value;

        const item = {
            id: productId,
            color: color,
            quantity: quantity
        };

        addToBasket(item);
        window.location.href = "./cart.html?id=" + productId;
    } else {
        alert("Vérifiez votre saisie");
    }
})

//Function call, to fetch product informations.
fetchSofaDetails();