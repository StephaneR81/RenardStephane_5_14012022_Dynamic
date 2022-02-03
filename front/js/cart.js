//CART SCRIPT PAGE

//|||||||||||
//|VARIABLES|
//|||||||||||

let inputQuantitySelector;

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

//Fetches each product informations from API
function fetchItemPrice() {

  const basket = getBasket();

  for (const key in basket) {

    fetch(`http://localhost:3000/api/products/${basket[key].id}`)

      .then((response) => {
        return response.json();
      })

      .then((productDetails) => {
        createSofaCard(productDetails);
      })

      .catch((error) => {
        console.error(error);
      });
  }
}

//Creates and prints the sofa card from basket element.
function createSofaCard(productDetails) {
  let basket = getBasket();

  const basketProductDetails = basket.find((element) => element.id == productDetails._id);

  //Creating card HTML elements.
  const itemElement = document.createElement("article");
  itemElement.classList = "cart__item";
  itemElement.setAttribute("data-id", productDetails._id);
  itemElement.setAttribute("data-color", basketProductDetails.color);

  const itemImgElement = document.createElement("div");
  itemImgElement.classList = "cart__item__img";

  const imgElement = document.createElement("img");
  imgElement.src = productDetails.imageUrl;
  imgElement.alt = productDetails.altTxt + ", " + productDetails.name;

  const itemContentElement = document.createElement("div");
  itemContentElement.classList = "cart__item__content";

  const contentDescriptionElement = document.createElement("div");
  contentDescriptionElement.classList = "cart__item__content__description";

  const nameElement = document.createElement("h2");
  nameElement.textContent = productDetails.name;

  const colorElement = document.createElement("p");
  colorElement.textContent = basketProductDetails.color;

  const priceElement = document.createElement("p");
  priceElement.textContent = productDetails.price + " €";

  const settingsElement = document.createElement("div");
  settingsElement.classList = "cart__item__content__settings";

  const quantityElement = document.createElement("div");
  quantityElement.classList = "cart__item__content__settings__quantity";

  const quantityValueElement = document.createElement("p");
  quantityValueElement.textContent = "Qté : " + basketProductDetails.quantity;

  totalQuantitySelector.textContent = basketTotalItems();
  // printTotalPrice();

  const inputQuantity = document.createElement("input");
  inputQuantity.type = "number";
  inputQuantity.setAttribute("class", "itemQuantity");
  inputQuantity.name = "itemQuantity";
  inputQuantity.min = "1";
  inputQuantity.max = "100";
  inputQuantity.value = basketProductDetails.quantity;
  inputQuantity.onchange = () => { //Dynamically updates price/quantity on change.

    if (checkQuantityInput(inputQuantity.value)) {
      addToBasket(basketProductDetails, inputQuantity.value);
      quantityValueElement.textContent = "Qté : " + basketProductDetails.quantity;
      printTotalQuantity();
      printTotalPrice();
    }
  };

  const deleteElement = document.createElement("div");
  deleteElement.classList = "cart__item__content__settings__delete";

  const deleteItemElement = document.createElement("p");
  deleteItemElement.textContent = "Supprimer";
  deleteElement.addEventListener("click", () => { // Removes the deleted product from the page.
    //  deleteElement.closest("article").remove(); 
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
    firstNameErrorMsgSelector.textContent = inputErrorMsg;
    return false;
  }
  firstNameErrorMsgSelector.textContent = "";
  return true;
}

//Checks lastName formular field. Returns boolean.
function checkLastname() {
  const lastNameRegEx = new RegExp("^[A-Za-zéèëêàçüû\ \-]{1,30}$");
  if (!lastNameRegEx.test(lastNameSelector.value)) {
    lastNameErrorMsgSelector.textContent = inputErrorMsg;
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
    addressErrorMsgSelector.textContent = inputErrorMsg;
    return false;
  }
  addressErrorMsgSelector.textContent = "";
  return true;
}

//Checks city formular field. Returns boolean.
function checkCity() {
  const cityRegEx = new RegExp("^[A-Za-z0-9éèëêàçüû\-]{1,30}$");
  if (!cityRegEx.test(citySelector.value)) {
    cityErrorMsgSelector.textContent = inputErrorMsg;
    return false;
  }
  cityErrorMsgSelector.textContent = "";
  return true;
}

//Checks email formular field. Returns boolean.
function checkEmail() {
  const mailRegEx = new RegExp("^[A-Za-z0-9._-]+[@]{1}[a-zA-Z0-9._-]+[.]{1}[a-zA-Z]{2,10}$");
  if (!mailRegEx.test(emailSelector.value)) {
    emailErrorMsgSelector.textContent = inputErrorMsg;
    return false;
  }
  emailErrorMsgSelector.textContent = "";
  return true;
}

//Checks if the whole formular fields are valid. Returns boolean.
function isValidFormular() {
  if (checkFirstName() &&
    checkLastname() &&
    checkAddress() &&
    checkCity() &&
    checkEmail()) {
    return true;
  }
  return false;
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

//Adds basket to local storage.
function storeBasket(basket) {
  localStorage.setItem("basket", JSON.stringify(basket));
}


//Prints total price.
function printTotalPrice() {
  // totalPriceSelector.textContent = basketTotalPrice(itemUnitPrice);
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
function basketTotalPrice() {

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

//Returns an "order" array representing items to purchase.
function createOrder() {
  const basket = getBasket();
  let products = [];
  for (const key in basket) {
    if ((key == "id") && (typeof basket.id === "string")) {
      products.push(basket.id);
    }
  }
  return products;
}

//Returns a stringified "body" (contact + order) for sending to API
function getBody() {
  const contact = createContact();
  const products = createOrder();

  let body = {
    contact,
    products
  };
  return JSON.stringify(body);
}

//Redirects the customer on confirmation page
function redirectConfirmation(orderId) {
  window.location = "./confirmation.html?orderId=" + orderId;
}

//Sends the order to API
function sendOrder() {
  const orderUrl = "http://localhost:3000/api/products/order";

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
fetchItemPrice();