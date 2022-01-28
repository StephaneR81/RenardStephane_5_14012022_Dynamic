//CART SCRIPT PAGE

//|||||||||||
//|VARIABLES|
//|||||||||||

const orderUrl = "http://localhost:3000/api/products/order"
const productId = getProductID();

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

//Returns basket from local storage, or false.
function getBasket() {
  let basket = localStorage.getItem("basket");
  return basket !== null ? JSON.parse(basket) : false;
}

//Creates and prints the sofa card from basket element.
function createSofaCard(productArray) {
  const basket = getBasket();

  //Creating card HTML elements.
  const itemElement = document.createElement("article");
  itemElement.classList = "cart__item";
  itemElement.setAttribute("data-id", productId);
  itemElement.setAttribute("data-color", basket.color);

  const itemImgElement = document.createElement("div");
  itemImgElement.classList = "cart__item__img";

  const imgElement = document.createElement("img");
  imgElement.src = productArray.imageUrl;
  imgElement.alt = productArray.altTxt + ", " + productArray.name;

  const itemContentElement = document.createElement("div");
  itemContentElement.classList = "cart__item__content";

  const contentDescriptionElement = document.createElement("div");
  contentDescriptionElement.classList = "cart__item__content__description";

  const nameElement = document.createElement("h2");
  nameElement.textContent = productArray.name;

  const colorElement = document.createElement("p");
  colorElement.textContent = basket.color;

  const priceElement = document.createElement("p");
  priceElement.textContent = productArray.price + " €";

  const settingsElement = document.createElement("div");
  settingsElement.classList = "cart__item__content__settings";

  const quantityElement = document.createElement("div");
  quantityElement.classList = "cart__item__content__settings__quantity";

  const quantityValueElement = document.createElement("p");
  quantityValueElement.textContent = "Qté : " + basket.quantity;

  const inputQuantity = document.createElement("input");
  inputQuantity.type = "number";
  inputQuantity.classList = "itemQuantity";
  inputQuantity.name = "itemQuantity";
  inputQuantity.min = "1";
  inputQuantity.max = "100";
  inputQuantity.value = basket.quantity;

  const deleteElement = document.createElement("div");
  deleteElement.classList = "cart__item__content__settings__delete";

  const deleteItemElement = document.createElement("p");
  deleteItemElement.textContent = "Supprimer";

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

function checkFirstName() {
  const firstNameRegEx = new RegExp("^[A-Za-zéèëêàçüû\-]{1,30}$");
  if (!firstNameRegEx.test(firstNameSelector.value)) {
    firstNameErrorMsgSelector.textContent = inputErrorMsg;
    return false;
  }
  firstNameErrorMsgSelector.textContent = "";
  return true;
}

function checkLastname() {
  const lastNameRegEx = new RegExp("^[A-Za-zéèëêàçüû\ \-]{1,30}$");
  if (!lastNameRegEx.test(lastNameSelector.value)) {
    lastNameErrorMsgSelector.textContent = inputErrorMsg;
    return false;
  }
  lastNameErrorMsgSelector.textContent = "";
  return true;
}

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

function checkCity() {
  const cityRegEx = new RegExp("^[A-Za-z0-9éèëêàçüû\-]{1,30}$");
  if (!cityRegEx.test(citySelector.value)) {
    cityErrorMsgSelector.textContent = inputErrorMsg;
    return false;
  }
  cityErrorMsgSelector.textContent = "";
  return true;
}

function checkEmail() {
  const mailRegEx = new RegExp("^[A-Za-z0-9._-]+[@]{1}[a-zA-Z0-9._-]+[.]{1}[a-zA-Z]{2,10}$");
  if (!mailRegEx.test(emailSelector.value)) {
    emailErrorMsgSelector.textContent = inputErrorMsg;
    return false;
  }
  emailErrorMsgSelector.textContent = "";
  return true;
}

//Fetches informations from API for one product.
function fetchSofaDetails() {
  fetch(getProductURL())

    .then((response) => {
      return response.json();
    })

    .then((productArray) => {

      const basket = getBasket();

      const unitPrice = Number(productArray.price);
      const quantity = Number(basket.quantity);
      const total = unitPrice * quantity;

      totalQuantitySelector.textContent = quantity;
      totalPriceSelector.textContent = total;

      createSofaCard(productArray);
    })

    .catch((error) => {
      alert("Le produit n'a pu être affiché.\nVeuillez revenir ultérieurement. ");
      console.error(error);
    });
}

//|||||||||||
//|LISTENERS|
//|||||||||||

submitSelector.addEventListener("click", (e) => {
  e.preventDefault();

  const basket = getBasket();

  if (checkFirstName() &&
    checkLastname() &&
    checkAddress() &&
    checkCity() &&
    checkEmail()) {

    let toSend = {
      contact: {
        "firstName": firstNameSelector.value,
        "lastName": lastNameSelector.value,
        "address": addressSelector.value,
        "city": citySelector.value,
        "email": emailSelector.value
      },
      products: []
    };


    for (const key in basket) {
      if ((key == "id") && (typeof basket.id === "string")) {
        toSend.products.push(basket.id);
      }
    }

    fetch(orderUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(toSend)

      }).then(function (response) {
        console.log("RESPONSE POST ", response);
        return response.json();
      })
      .then(function (data) {
        console.table(data);

        const orderId = data.orderId;
        const url = "./confirmation.html?orderId=" + orderId;
        window.location = url;

      })
      .catch(function (error) {
        console.error("CATCH ERROR POST " + error);
      });


  } else {
    //ANNULER L ENVOI 
  }
});

//FUNCTION CALLS
fetchSofaDetails();