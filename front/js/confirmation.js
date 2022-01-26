//VARIABLES


// GETTING ORDER ID FROM URL
let params = new URLSearchParams(window.location.search);
const orderId = params.has("orderId") ? params.get("orderId") : null;

const orderIdSelector = document.querySelector("#orderId");

if (orderId !== null) {
    orderIdSelector.textContent = orderId;
}