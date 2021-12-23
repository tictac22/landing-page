import Swiper, { Pagination } from 'swiper';

const burger = document.querySelector(".header__burger")
const headerMenu = document.querySelector(".header__menu")
burger.addEventListener("click", ()=> {
    burger.classList.toggle("header__burger--active")
    headerMenu.classList.toggle("header__menu--active")
})

new Swiper('.productivity', {
    // pass modules here
    modules: [Pagination],
    pagination: {
        el: '.swiper-pagination',
        clickable: true,
    },
    loop:true,
    autoplay: {
        delay: 2000,
    },
});
