// KANAP PRODUCT PAGE SCRIPT

/////////////
//VARIABLES/
///////////

// GETTING CURRENT PRODUCT ID FROM URL
let params = new URLSearchParams(window.location.search);
const productId = params.has("id") ? params.get("id") : null;
const productURL = `http://localhost:3000/api/products/${productId}`;

//ELEMENTS SELECTORS
const productImgSelector = document.querySelector(".item__img");
const productNameSelector = document.querySelector("#title");
const priceSelector = document.querySelector("#price");
const descriptionSelector = document.querySelector("#description");
const colorSelector = document.querySelector("#colors");
const quantitySelector = document.querySelector("#quantity");
const submitButtonSelector = document.querySelector("#addToCart");

//INITIALIZING PRODUCT QUANTITY TO 1
quantitySelector.value = 1;



/////////////
//FUNCTIONS/
///////////

function getProduct() {

    fetch(productURL)

        .then(
            function (response) {
                return response.json();
            })

        .then(
            function (productArray) {
                getItemCard(productArray);
            })

        .catch(
            function (error) {
                alert("Le produit n'a pu être affiché.\nVeuillez revenir ultérieurement. ");
                console.error(error);
            });
}

//CREATES AND APPENDS SELECTED PRODUCT INFORMATIONS (IMAGE, DESCRIPTION, PRICE ETC.)
function getItemCard(productArray) {

    const imgElement = document.createElement("img");
    imgElement.src = productArray.imageUrl;
    imgElement.setAttribute("alt", productArray.altTxt);
    productImgSelector.append(imgElement);

    productNameSelector.textContent = productArray.name;

    priceSelector.textContent = productArray.price;

    descriptionSelector.textContent = productArray.description;

    for (const color of productArray.colors) {
        const colorElement = document.createElement("option");
        colorElement.setAttribute("value", color);
        colorElement.textContent = color;
        colorSelector.append(colorElement);
    }
}

//RETURNS TRUE IF ENTERED QUANTITY IS VALID, OR FALSE IF NOT.
function isValidQuantity() {
    let value = quantitySelector.value;
    return (isNaN(value) || value == "" || value < 1 || value > 100) ? false : true;
}

//RETURNS TRUE IF A COLOR IS SELECTED, OR FALSE IF NOT.
function isValidColor() {
    const value = colorSelector.options[colorSelector.selectedIndex].value;
    return value === "" || value === null ? false : true;
}

//ADDS BASKET TO LOCAL STORAGE
function storeBasket(item) {
    localStorage.setItem("basket", JSON.stringify(item));
}

//GET BASKET FROM LOCAL STORAGE
function getBasket() {
    let basket = localStorage.getItem("basket");
    return (basket !== null) ? JSON.parse(basket) : new Array(); //CREATES BASKET IF NOT
}

//ADDS ITEM TO BASKET
function addToBasket(item) {
    let basket = getBasket();

    storeBasket(item);
}



//EVENT LISTENERS

submitButtonSelector.addEventListener("click", function () {
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
        //ALERT CUSTOMER IF DATA ARE WRONG
        alert("Vérifiez votre saisie");
    }
})

getProduct();