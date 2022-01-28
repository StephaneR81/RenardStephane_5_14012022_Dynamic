// KANAP HOME PAGE

//VARIABLES
const ProductsURL = "http://localhost:3000/api/products";
const itemsSection = document.querySelector("#items");


//FUNCTIONS

//CREATES A PRODUCT CARD
function createProductCard(productsArray) {
    for (const key in productsArray) { //FOR EACH SOFA IN THE PRODUCTS LIST

        //CREATES HTML ELEMENTS
        const linkTag = document.createElement("a");
        linkTag.setAttribute("href", `./product.html?id=${productsArray[key]._id}`);

        const articleTag = document.createElement("article");

        const imgTag = document.createElement("img");
        imgTag.src = productsArray[key].imageUrl;
        imgTag.setAttribute("alt", `${productsArray[key].altTxt}, ${productsArray[key].name}`);

        const productName = document.createElement("h3");
        productName.setAttribute("class", "productName");
        productName.textContent = productsArray[key].name;

        const productDescription = document.createElement("p");
        productDescription.setAttribute("class", "productDescription");
        productDescription.textContent = productsArray[key].description;

        //APPENDS CREATED HTML ELEMENTS IN HOME PAGE
        itemsSection.append(linkTag);
        linkTag.append(articleTag);
        articleTag.append(imgTag);
        articleTag.append(productName);
        articleTag.append(productDescription);
    }
}


//GETTING PRODUCTS LIST AND CALLING createProductCard()
fetch(ProductsURL)

    .then(
        function (response) {
            return response.json();
        }
    )

    .then(
        function (productsArray) {
            createProductCard(productsArray);
        })

    .catch(
        function (error) {
            alert("La liste des produits n'a pu être affichée.\nVeuillez revenir ultérieurement. ");
            console.error(error);
        });