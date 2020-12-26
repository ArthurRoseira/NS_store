

const menuBtn = document.querySelector('#menu-btn')




menuBtn.addEventListener('click', () => {
 document.body.classList.toggle('menu-open');
 document.body.classList.toggle('open');
})