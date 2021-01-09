const menuBtn = document.querySelector('#menu-btn')
const btnWhats = document.querySelector('#whatsIcon')
const cartBtn = document.querySelector('.cart-btn');
const cartDOM = document.querySelector('.cart');
const cartOverlay = document.querySelector('.cart-overlay');
const closeCartBtn = document.querySelector('.close-cart');
const clearCartBtn = document.querySelector('#clear-cart');
const cartItems = document.querySelector('.cart-items');
const cartTotal = document.querySelector('.cart-total');
const cartContent = document.querySelector('.cart-content');
const productDOM = document.querySelector('.products-center');


let cart = [];
let buttonsDOM = [];


function NewTab(message) {
 window.open(
  `https://api.whatsapp.com/send?phone=5541996880868&text=${message}`, "_blank");
}


menuBtn.addEventListener('click', () => {
 document.body.classList.toggle('menu-open');
 document.body.classList.toggle('open');
})

btnWhats.addEventListener('click', () => {
 NewTab(`Olá!!`)
})



//// Products

const client = contentful.createClient({
 // This is the space ID. A space is like a project folder in Contentful terms
 space: "7byyz5pa6697",
 // This is the access token for this space. Normally you get both ID and the token in the Contentful web app
 accessToken: "A_ADa7Ul5AtDjRUkaXHxkMrDf_7zT7L0lIA4i3fq5H4"
});

class Products {
 async getProduct() {
  try {
   let contentful = await client.getEntries({
    content_type: "nsstore"
   });

   let products = contentful.items;
   products = products.map(item => {
    const { title, price } = item.fields;
    const id = item.sys.id;
    const image = item.fields.photo.fields.file.url
    return { title, price, id, image };
   })
   return products
  }
  catch (error) {
   console.log(error);
  }
 }
}

class Storage {

 static saveProducts(products) {
  localStorage.setItem("products", JSON.stringify(products))
 }
 static getProduct(id) {
  let products = JSON.parse(localStorage.getItem('products'));
  return products.find(product => product.id === id)
 }
 static saveCart(cart) {
  localStorage.setItem('cart', JSON.stringify(cart))
 }
 static getCart() {
  return localStorage.getItem('cart') ? JSON.parse(localStorage.getItem('cart')) : []
 }
}


class UI {

 displayProducts(products) {
  let result = '';
  let test = '';
  products.forEach(product => {
   test = product.image;
   result += `
      <article class="product">
        <div class="card-item">
          <img src='${test}' class="product-image" alt="">
          <div class="title-div-item"><h3 class='item-title'>${product.title}</h3></div>
          <h4>R$${product.price.toFixed(2)}</h4>
          <button class="btn-item">Saiba mais</button>
        </div>
      </article>
  `});
  // very important!! set data-id equals to product id - connect button with each product
  productDOM.innerHTML = result;
 }
 setupAPP() {
  cartBtn.addEventListener('click', this.showCart);
  closeCartBtn.addEventListener('click', this.hideCart);
 }
 showCart() {
  cartOverlay.classList.add('transparentBcg');
  cartDOM.classList.add('showCart');
 }
 hideCart() {
  cartOverlay.classList.remove('transparentBcg');
  cartDOM.classList.remove('showCart');
 }
 clearCart() {//map is an array method
  let cartItems = cart.map(item => item.id);
  cartItems.forEach(id => this.removeItem(id));
  while (cartContent.children.length > 0) {
   console.log(cartContent.children);
   cartContent.removeChild(cartContent.children[0]);
  }
 }
 setCartValues(cart) {
  let tempTotal = 0;
  let itemsTotal = 0;
  cart.map(item => {
   tempTotal += item.price * item.amount;
   itemsTotal += item.amount;
  })
  cartTotal.innerText = parseFloat(tempTotal).toFixed(2);
  cartItems.innerText = itemsTotal;
 }
 cartLogic() {
  clearCartBtn.addEventListener('click', () => { this.clearCart(); })
 }

}




document.addEventListener("DOMContentLoaded", () => {
 const ui = new UI;
 const products = new Products;
 ui.setupAPP();
 //metodo getProducts retorna products array
 products.getProduct().then(products => {
  ui.displayProducts(products);
  Storage.saveProducts(products);
 }).then(() => {
  ui.cartLogic();
 })
})