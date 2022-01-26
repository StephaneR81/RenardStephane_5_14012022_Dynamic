//CART SCRIPT PAGE

//VARIABLES

const errorMsgColor = "red";
const inputErrorMsg = "Veuillez vérifier la saisie du champ ci-dessus";
const orderIdSelector = document.querySelector("#orderId");

// GETTING CURRENT PRODUCT ID FROM URL
let params = new URLSearchParams(window.location.search);
const productId = params.has("id") ? params.get("id") : null;
const productURL = `http://localhost:3000/api/products/${productId}`;
const orderUrl = "http://localhost:3000/api/products/order"

//ELEMENTS SELECTORS
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

//FUNCTIONS

//GET BASKET FROM LOCAL STORAGE
function getBasket() {
  let basket = localStorage.getItem("basket");
  return basket !== null ? JSON.parse(basket) : false; //Returns basket or false if it is not created.
}

//CREATES PRODUCT CARD
function createItemCard(productArray) {
  const basket = getBasket();

  //CREATING ELEMENTS
  const itemElement = document.createElement("article");
  itemElement.setAttribute("class", "cart__item");
  itemElement.setAttribute("data-id", productId);
  itemElement.setAttribute("data-color", basket.color);

  const itemImgElement = document.createElement("div");
  itemImgElement.setAttribute("class", "cart__item__img");

  const imgElement = document.createElement("img");
  imgElement.src = productArray.imageUrl;
  imgElement.setAttribute(
    "alt",
    productArray.altTxt + ", " + productArray.name
  );

  const itemContentElement = document.createElement("div");
  itemContentElement.setAttribute("class", "cart__item__content");

  const contentDescriptionElement = document.createElement("div");
  contentDescriptionElement.setAttribute(
    "class",
    "cart__item__content__description"
  );

  const nameElement = document.createElement("h2");
  nameElement.textContent = productArray.name;

  const colorElement = document.createElement("p");
  colorElement.textContent = basket.color;

  const priceElement = document.createElement("p");
  priceElement.textContent = productArray.price + " €";

  const settingsElement = document.createElement("div");
  settingsElement.setAttribute("class", "cart__item__content__settings");

  const quantityElement = document.createElement("div");
  quantityElement.setAttribute(
    "class",
    "cart__item__content__settings__quantity"
  );

  const quantityValueElement = document.createElement("p");
  quantityValueElement.textContent = "Qté : " + basket.quantity;

  const inputQuantity = document.createElement("input");
  inputQuantity.setAttribute("type", "number");
  inputQuantity.setAttribute("class", "itemQuantity");
  inputQuantity.setAttribute("name", "itemQuantity");
  inputQuantity.setAttribute("min", "1");
  inputQuantity.setAttribute("max", "100");
  inputQuantity.setAttribute("value", basket.quantity);

  const deleteElement = document.createElement("div");
  deleteElement.setAttribute("class", "cart__item__content__settings__delete");

  const deleteItemElement = document.createElement("p");
  deleteItemElement.textContent = "Supprimer";

  //APPEND CREATED ELEMENTS
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

//FORM CONTROLS
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

function getProduct() {
  fetch(productURL)
    .then(function (response) {
      return response.json();
    })

    .then(function (productArray) {

      const basket = getBasket();

      const unitPrice = Number(productArray.price);
      const quantity = Number(basket.quantity);
      const total = unitPrice * quantity;

      totalQuantitySelector.textContent = quantity;
      totalPriceSelector.textContent = total;

      createItemCard(productArray);
    })

    .catch(function (error) {
      alert("Le produit n'a pu être affiché.\nVeuillez revenir ultérieurement. ");
      console.error(error);
    });
}

//EVENT LISTENERS
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
    //ANNULER L ENVOI ETC
  }
});

//FUNCTION CALLS
getProduct();