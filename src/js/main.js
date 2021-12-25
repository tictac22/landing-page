import Swiper, { Navigation, Pagination,Autoplay  } from 'swiper';
import { mobileIs } from './isMobile.js';
import lightGallery from 'lightgallery';

const burger = document.querySelector(".header__burger")
const headerMenu = document.querySelector(".header__menu")

burger.addEventListener("click", ()=> {
    burger.classList.toggle("header__burger--active")
    headerMenu.classList.toggle("header__menu--active")
})

new Swiper('.productivity', {
    modules: [Autoplay, Pagination],
    pagination: {
        el: '.swiper-pagination',
        type: 'bullets',
        clickable:true
    },
    autoplay: {
        delay:2500,
        disableOnInteraction:false,
    },
    loop:true,
});
new Swiper('.blog__swiper', {
    modules: [Navigation,Autoplay],
    navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
    },
    
    loop:true,
    autoplay: {
        delay:2500,
        disableOnInteraction:false
    }
})
if (mobileIs) document.querySelector("body").classList.add("body__mobile");
document.querySelectorAll('.lightgallery').forEach(item => {
    lightGallery(item,{
        getCaptionFromTitleOrAlt: false
    });
    
})
