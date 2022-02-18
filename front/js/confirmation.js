//KANAP CONFIRMATION PAGE SCRIPT

//|||||||||||
//|FUNCTIONS|
//|||||||||||

//Returns the order ID from URL (String), or a string information.
function getOrderID() {
    let params = new URLSearchParams(window.location.search);
    return params.has("orderId") ? params.get("orderId") : "Numéro de commande indisponible";
}

//Gets the corresponding DOM element and prints the order ID in it
function printOrderId() {
    const orderIdSelector = document.querySelector("#orderId");
    orderIdSelector.textContent = getOrderID();
}

//Clears the basket in localStorage.
function clearBasket() {
    localStorage.clear();
}

//Function that runs on script load
function initialize() {
    printOrderId();
    clearBasket();
}

//Calls initialise() function
initialize();