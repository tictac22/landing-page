import Swiper, { Navigation, Pagination } from 'swiper';

const burger = document.querySelector(".header__burger")
const headerMenu = document.querySelector(".header__menu")
burger.addEventListener("click", ()=> {
    burger.classList.toggle("header__burger--active")
    headerMenu.classList.toggle("header__menu--active")
})

new Swiper('.productivity', {
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
new Swiper('.blog__swiper', {
    modules: [Navigation],
    loop:true,
    navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
    },
    autoplay: {
        delay:3000
    }
})
const isMobile = {
    Android: function() {
        return navigator.userAgent.match(/Android/i);
    },
    BlackBerry: function() {
        return navigator.userAgent.match(/BlackBerry/i);
    },
    iOS: function() {
        return navigator.userAgent.match(/iPhone|iPad|iPod/i);
    },
    Opera: function() {
        return navigator.userAgent.match(/Opera Mini/i);
    },
    Windows: function() {
        return navigator.userAgent.match(/IEMobile/i) || navigator.userAgent.match(/WPDesktop/i);
    },
    any: function() {
        return (isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Opera() || isMobile.Windows());
    }
};
if( isMobile.any() ) {
    document.querySelector("body").classList.add("body__mobile")
}