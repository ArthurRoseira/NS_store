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





document.addEventListener("DOMContentLoaded", () => {
 const products = new Products;
 //metodo getProducts retorna products array
 products.getProduct().then(products => console.log(products))
})