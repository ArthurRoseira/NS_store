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
const finishOrderBtn = document.querySelector('#end-request');

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
        const { title, price, description } = item.fields;
        const id = item.sys.id;
        const image = item.fields.photo.fields.file.url
        return { title, price, description, id, image };
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
          <div class="card-image">
          <img src='${test}' class="product-image" alt="">
          </div>
          <div class="title-div-item"><h3 class='item-title'>${product.title}</h3></div>
          <h4>R$${product.price.toFixed(2)}</h4>
          <button class="btn-item" data-id = '${product.id}'>Saiba mais</button>
        </div>
      </article>
  `});
    // very important!! set data-id equals to product id - connect button with each product
    productDOM.innerHTML = result;
  }
  getItemsBtn() {
    const buttons = [...document.querySelectorAll('.btn-item')];
    buttonsDOM = buttons;
    buttons.forEach(button => {
      let id = button.dataset.id;
      button.addEventListener('click', () => {
        let product = Storage.getProduct(id);
        cartOverlay.classList.add('transparentBcg');
        let div = document.querySelector('.popup_item')
        div.classList.add('visible')
        div.innerHTML = `
          <div class="img_popup">
          <img src='${product.image}' alt="" srcset="" class='popup_item_image'>
          </div>
          <div class="popup_item_desc">
          <div class="close-popup">
          <i class="fas fa-window-close"></i>
          </div>
          <h3 class="pop_item_title">${product.title}</h3>
          <textarea cols="50" rows="11" class='description_text'>${product.description}</textarea>
          <h4 class='popup-price'>R$${product.price.toFixed(2)}</h4>
          <button class='banner-btn-popup' data-id = '${product.id}' id='addItem'><i class='fas fa-cart-plus'></i>Adicionar</button>
          </div>
          </div>
        `
        let inCart = cart.find(item => item.id === id);
        if (inCart) {
          document.querySelector('#addItem').innerText = "No Carrinho";
          document.querySelector('#addItem').disabled = true;
        }

        document.querySelector('.close-popup').addEventListener('click', () => {
          document.querySelector('.popup_item').classList.remove('visible')
          cartOverlay.classList.remove('transparentBcg');
        })
        document.querySelector('#addItem').addEventListener('click', (event) => {
          document.querySelector('.popup_item').classList.remove('visible')
          event.target.innerText = 'No Carrinho';
          event.target.disable = true;
          let cartItem = { ...Storage.getProduct(id), amount: 1 };
          // destructuring and adding another field and value
          cart = [...cart, cartItem];//kind of append
          Storage.saveCart(cart);
          this.setCartValues(cart);
          this.addCartItem(cartItem);
          this.showCart()
        })
      })
    })
  }
  addCartItem(item) {
    const div = document.createElement('div');
    div.classList.add('cart-item');
    div.innerHTML = `
      <img src='${item.image}' alt="product">
      <div>
         <h4>${item.title}</h4>
         <h5>$${item.price}</h5>
         <span class="remove-item" data-id=${item.id}>remover</span>
      </div>
      <div>
         <i class="fas fa-chevron-up" data-id=${item.id}></i>
         <p class="item-amount">${item.amount}</p>
         <i class="fas fa-chevron-down" data-id=${item.id}></i>
      </div>
      `
    cartContent.appendChild(div);//carContent is the actual div related to UI 
  }
  setupAPP() {
    cart = Storage.getCart();
    cartBtn.addEventListener('click', this.showCart);
    closeCartBtn.addEventListener('click', this.hideCart);
    this.populateCart(cart);
    finishOrderBtn.addEventListener('click', this.finishOrder);
  }
  populateCart(cart) {
    cart.forEach(item => this.addCartItem(item));
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
      cartContent.removeChild(cartContent.children[0]);
    }
  }
  removeItem(id) {
    cart = cart.filter(item => item.id !== id); //filter function creates a new array without the filtered element
    this.setCartValues(cart);
    Storage.saveCart(cart);

  }
  getSingleButton(id) {
    return buttonsDOM.find(button => button.dataset.id === id);
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
    clearCartBtn.addEventListener('click', () => {
      this.clearCart();
    })
    cartContent.addEventListener(`click`, event => {
      if (event.target.classList.contains(`remove-item`)) {
        let removeItem = event.target;
        let id = removeItem.dataset.id;
        cartContent.removeChild(removeItem.parentElement.parentElement);
        this.removeItem(id);
      }
      else if (event.target.classList.contains(`fa-chevron-up`)) {
        let addAmount = event.target;
        let id = addAmount.dataset.id;
        let tempItem = cart.find(item => item.id === id);
        tempItem.amount = tempItem.amount + 1;
        Storage.saveCart(cart);
        this.setCartValues(cart);
        addAmount.nextElementSibling.innerText = tempItem.amount;
      }
      else if (event.target.classList.contains(`fa-chevron-down`)) {
        let lowerAmount = event.target;
        let id = lowerAmount.dataset.id;
        let tempItem = cart.find(item => item.id === id);
        tempItem.amount = tempItem.amount - 1;
        if (tempItem.amount > 0) {
          Storage.saveCart(cart);
          this.setCartValues(cart);
          lowerAmount.previousElementSibling.innerTest = tempItem.amount;
        }
        else {
          cartContent.removeChild(lowerAmount.parentElement.parentElement);
          this.removeItem(id);
        }

      }
    })
  }
  finishOrder() {
    console.log(cart);
    let payment = document.querySelector('.payment').value
    let orderMessage = 'Olá!!%20Gostaria%20de%20Realizar%20o%20Pedido%20dos%20Seguintes%20items:'
    cart.forEach(item => {
      orderMessage = orderMessage + `%0a${item.title} x${item.amount}`
    })
    orderMessage = orderMessage + `%0aValor Total:R$${cartTotal.innerText}%0aPagamento: ${payment}`
    window.open(
      `https://api.whatsapp.com/send?phone=5541996880868&text=${orderMessage}`, "_blank");
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
    ui.getItemsBtn();
  })
})