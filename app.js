

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