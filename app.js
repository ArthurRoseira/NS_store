

const menuBtn = document.querySelector('#menu-btn')
const btnWhats = document.querySelector('#whatsIcon')

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




document.addEventListener("DOMContentLoaded", () => {
  const products = new Products;
  products.getProduct().then(products => console.log(products))
})