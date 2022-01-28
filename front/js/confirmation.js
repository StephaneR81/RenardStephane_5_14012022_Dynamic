//KANAP CONFIRMATION PAGE SCRIPT

//|||||||||||
//|VARIABLES|
//|||||||||||
const orderIdSelector = document.querySelector("#orderId");

//|||||||||||
//|FUNCTIONS|
//|||||||||||

//Returns the order ID from URL (String), or a string information.
function getOrderID() {
    let params = new URLSearchParams(window.location.search);
    return params.has("orderId") ? params.get("orderId") : "Numéro de commande indisponible";
}

//Prints the order ID 
orderIdSelector.textContent = getOrderID();

//Clears the local storage.
// localStorage.clear();