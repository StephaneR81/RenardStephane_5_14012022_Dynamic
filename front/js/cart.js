//CART SCRIPT PAGE

//|||||||||||
//|VARIABLES|
//|||||||||||

const errorMsgColor = "red";
const inputErrorMsg = "Veuillez vérifier la saisie du champ ci-dessus";

//Element selectors
const cartItemsSelector = document.querySelector("#cart__items");

const totalQuantitySelector = document.querySelector("#totalQuantity");
const totalPriceSelector = document.querySelector("#totalPrice");

const firstNameSelector = document.querySelector("#firstName");
const firstNameErrorMsgSelector = document.querySelector("#firstNameErrorMsg");
firstNameErrorMsgSelector.style.color = errorMsgColor;

const lastNameSelector = document.querySelector("#lastName");
const lastNameErrorMsgSelector = document.querySelector("#lastNameErrorMsg");
lastNameErrorMsgSelector.style.color = errorMsgColor;

const addressSelector = document.querySelector("#address");
const addressErrorMsgSelector = document.querySelector("#addressErrorMsg");
addressErrorMsgSelector.style.color = errorMsgColor;

const citySelector = document.querySelector("#city");
const cityErrorMsgSelector = document.querySelector("#cityErrorMsg");
cityErrorMsgSelector.style.color = errorMsgColor;

const emailSelector = document.querySelector("#email");
const emailErrorMsgSelector = document.querySelector("#emailErrorMsg");
emailErrorMsgSelector.style.color = errorMsgColor;

const submitSelector = document.querySelector("#order");



//|||||||||||
//|FUNCTIONS|
//|||||||||||


//Returns pricesObj associating an item ID with its unit price fetched from API.
async function getPrices() {
  const pricesObj = new Map();
  const prices = await fetchPrices();

  for (const iterator of prices) {
    pricesObj.set(iterator._id, iterator.price);
  }
  return pricesObj;
}

//Fetches all products informations from API.
async function fetchPrices() {
  return fetch("http://localhost:3000/api/products")

    .then((response) => {
      return response.json();
    })

    .then((prices) => {
      return prices;
    })

    .catch((error) => {
      console.error(error);
    });
}

createSofaCard();

//Creates and prints the sofa card from basket element.
async function createSofaCard() {
  const pricesObj = await getPrices();
  let basket = getBasket();

  for (const key in basket) {
    //Creating card HTML elements.
    const itemElement = document.createElement("article");
    itemElement.classList = "cart__item";
    itemElement.setAttribute("data-id", basket[key].id);
    itemElement.setAttribute("data-color", basket[key].color);

    const itemImgElement = document.createElement("div");
    itemImgElement.classList = "cart__item__img";

    const imgElement = document.createElement("img");
    imgElement.src = basket[key].imageUrl;
    imgElement.alt = basket[key].altTxt + ", " + basket[key].name;

    const itemContentElement = document.createElement("div");
    itemContentElement.classList = "cart__item__content";

    const contentDescriptionElement = document.createElement("div");
    contentDescriptionElement.classList = "cart__item__content__description";

    const nameElement = document.createElement("h2");
    nameElement.textContent = basket[key].name;

    const colorElement = document.createElement("p");
    colorElement.textContent = basket[key].color;

    const priceElement = document.createElement("p");
    // priceElement.textContent = basket[key].price + " €";
    priceElement.textContent = pricesObj.get(basket[key].id) + " €";

    const settingsElement = document.createElement("div");
    settingsElement.classList = "cart__item__content__settings";

    const quantityElement = document.createElement("div");
    quantityElement.classList = "cart__item__content__settings__quantity";

    const quantityValueElement = document.createElement("p");
    quantityValueElement.textContent = "Qté : " + basket[key].quantity;


    const inputQuantity = document.createElement("input");
    inputQuantity.type = "number";
    inputQuantity.setAttribute("class", "itemQuantity");
    inputQuantity.name = "itemQuantity";
    inputQuantity.min = "1";
    inputQuantity.max = "100";
    inputQuantity.value = basket[key].quantity;
    inputQuantity.addEventListener("change", () => { //Dynamically updates price/quantity on change.
      if (checkQuantityInput(inputQuantity.value)) {
        addToBasket(basket[key], inputQuantity.value);
        quantityValueElement.textContent = "Qté : " + basket[key].quantity;
        printTotalQuantity();
        printTotalPrice();
      };
    });

    const deleteElement = document.createElement("div");
    deleteElement.classList = "cart__item__content__settings__delete";

    const deleteItemElement = document.createElement("p");
    deleteItemElement.textContent = "Supprimer";
    deleteElement.addEventListener("click", () => { // Removes the deleted product from the page.
      const closestArticle = deleteElement.closest("article"); //Getting the the first article parent element.
      const itemToDeleteId = closestArticle.getAttribute("data-id"); //Getting the item ID from attribute "data-id" of the parent article element.
      const itemToDeleteColor = closestArticle.childNodes[1].childNodes[0].childNodes[1].textContent; //Getting the color of the item to delete
      removeFromBasket(itemToDeleteId, itemToDeleteColor);
      closestArticle.remove();
      printTotalQuantity();
      printTotalPrice();
    });

    //Appends HTML previously created elements.
    cartItemsSelector.append(itemElement);
    itemElement.append(itemImgElement);
    itemImgElement.append(imgElement);
    itemElement.append(itemContentElement);
    itemContentElement.append(contentDescriptionElement);
    contentDescriptionElement.append(nameElement);
    contentDescriptionElement.append(colorElement);
    contentDescriptionElement.append(priceElement);
    itemContentElement.append(settingsElement);
    settingsElement.append(quantityElement);
    quantityElement.append(quantityValueElement);
    quantityElement.append(inputQuantity);
    settingsElement.append(deleteElement);
    deleteElement.append(deleteItemElement);
  }
  totalQuantitySelector.textContent = basketTotalItems();
  printTotalPrice();
}

//FORMULAR RELATED FUNCTIONS

//Checks quantity input. Returns boolean.
function checkQuantityInput(inputValue) {
  const value = Number(inputValue);
  if (value < 1 || value > 100 || isNaN(value) || value === "" || value === null || !Number.isInteger(value)) {
    return false;
  }
  return true;
}

//Checks firstName formular field. Returns boolean.
function checkFirstName() {
  const firstNameRegEx = new RegExp("^[A-Za-zéèëêàçüû\-]{1,30}$");
  if (!firstNameRegEx.test(firstNameSelector.value)) {
    return false;
  }
  firstNameErrorMsgSelector.textContent = "";
  return true;
}

//Checks lastName formular field. Returns boolean.
function checkLastname() {
  const lastNameRegEx = new RegExp("^[A-Za-zéèëêàçüû\-]{1,30}$");
  if (!lastNameRegEx.test(lastNameSelector.value)) {
    return false;
  }
  lastNameErrorMsgSelector.textContent = "";
  return true;
}

//Checks address formular field. Returns boolean.
function checkAddress() {
  const addressRegEx = new RegExp("^[A-Za-z0-9]{1,}[A-Za-z0-9éèëêàçüû\ \-\.\,]{1,}$");
  if ((!addressRegEx.test(addressSelector.value)) ||
    (addressSelector.value === "") ||
    (addressSelector.value === null)) {
    return false;
  }
  addressErrorMsgSelector.textContent = "";
  return true;
}

//Checks city formular field. Returns boolean.
function checkCity() {
  const cityRegEx = new RegExp("^[A-Za-z0-9éèëêàçüû\-]{1,30}$");
  if (!cityRegEx.test(citySelector.value)) {
    return false;
  }
  cityErrorMsgSelector.textContent = "";
  return true;
}

//Checks email formular field. Returns boolean.
function checkEmail() {
  const mailRegEx = new RegExp("^[A-Za-z0-9._-]+[@]{1}[a-zA-Z0-9._-]+[.]{1}[a-zA-Z]{2,10}$");
  if (!mailRegEx.test(emailSelector.value)) {
    return false;
  }
  emailErrorMsgSelector.textContent = "";
  return true;
}

//Checks if the whole formular fields are valid. Returns boolean.
function isValidFormular() {
  const isFormValid = checkFirstName() && checkLastname() && checkAddress() && checkCity() && checkEmail();
  if (!isFormValid) {
    !checkFirstName() ? firstNameErrorMsgSelector.textContent = inputErrorMsg : null;
    !checkLastname() ? lastNameErrorMsgSelector.textContent = inputErrorMsg : null;
    !checkAddress() ? addressErrorMsgSelector.textContent = inputErrorMsg : null;
    !checkCity() ? cityErrorMsgSelector.textContent = inputErrorMsg : null;
    !checkEmail() ? emailErrorMsgSelector.textContent = inputErrorMsg : null;
  }
  return true;
}

//Returns basket from local storage, or false.
function getBasket() {
  let basket = localStorage.getItem("basket");
  return basket !== null ? JSON.parse(basket) : false;
}

//Adds item to basket
function addToBasket(item, newQuantity) {
  let basket = getBasket();
  let itemIndexFound = basket.findIndex(itemObj => itemObj.id === item.id && itemObj.color === item.color); // Returns the found item index in basket, or -1 if not found.

  if (itemIndexFound !== -1) { // If an existing item has been found, sets the current item new quantity, removes the old item object from basket and adds the new one.
    item.quantity = Number(newQuantity);
    basket.splice(itemIndexFound, 1, item);
  } else {
    basket.push(item);
  }
  storeBasket(basket);
}

//Removes an item from basket.
function removeFromBasket(itemId, itemColor) {
  let basket = getBasket();
  const itemIdToRemove = basket.findIndex((element) => element.id === itemId && element.color === itemColor);
  if (itemIdToRemove !== -1) {

    basket.splice(itemIdToRemove, 1);
  }
  storeBasket(basket);
}

//Adds basket to local storage.
function storeBasket(basket) {
  localStorage.setItem("basket", JSON.stringify(basket));
}


//Prints total price.
async function printTotalPrice() {
  totalPriceSelector.textContent = await basketTotalPrice();
}

//Prints total items quantity
function printTotalQuantity() {
  totalQuantitySelector.textContent = basketTotalItems();
}

//Returns the total of all items in basket. (Number)
function basketTotalItems() {
  let basket = getBasket();
  let totalQuantity = 0;
  for (const key in basket) {
    totalQuantity += Number(basket[key].quantity);
  }
  return totalQuantity;
}

//Returns the total price of the order. (Number)
async function basketTotalPrice() {
  let pricesObj = await getPrices();
  let basket = getBasket();
  let totalPrice = 0;

  for (const key in basket) {
    const itemId = basket[key].id;
    let itemUnitPrice = pricesObj.get(itemId);
    itemUnitPrice = Number(itemUnitPrice);
    totalPrice += (Number(basket[key].quantity) * itemUnitPrice);
  }
  return totalPrice;
}

//Returns a "contact" object.
function createContact() {
  const contact = {
    "firstName": firstNameSelector.value,
    "lastName": lastNameSelector.value,
    "address": addressSelector.value,
    "city": citySelector.value,
    "email": emailSelector.value
  }
  return contact;
}

//Returns an "order" array representing items to purchase or false if empty.
function createOrder() {
  const basket = getBasket();
  let products = [];

  for (const key in basket) {
    products.push(basket[key].id);
  }
  return products.length > 0 ? products : false;
}


//Returns a stringified "body" (contact + order) for sending to API, or false if "products" is empty.
function getBody() {
  const contact = createContact();
  const products = createOrder();

  let body = {
    contact,
    products
  };

  return products !== false ? JSON.stringify(body) : false;
}

//Redirects the customer on confirmation page
function redirectConfirmation(orderId) {
  window.location = "./confirmation.html?orderId=" + orderId;
}

//Sends the order to API
function sendOrder() {
  const orderUrl = "http://localhost:3000/api/products/order";

  if (!getBody()) {
    alert("Votre panier est vide, veuillez d'abord ajouter un article");
    return;
  }
  const headers = {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: getBody()
  }

  fetch(orderUrl, headers)

    .then((response) => {
      return response.json();
    })

    .then((data) => {
      console.table(data);
      redirectConfirmation(data.orderId);

    })
    .catch((error) => {
      console.error("sendOrder() function error " + error);
    });
}



//|||||||||||
//|LISTENERS|
//|||||||||||

submitSelector.addEventListener("click", (e) => {
  e.preventDefault();
  if (isValidFormular()) {
    sendOrder();
  }
});


// FUNCTION CALL