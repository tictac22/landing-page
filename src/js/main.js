
import Swiper, { Navigation, Pagination,Autoplay  } from 'swiper';
import { mobileIs } from './isMobile.js';
import lightGallery from 'lightgallery';

window.addEventListener("load",()=>{

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

    new Swiper('.slider-review__swiper', {
        modules: [Pagination],
        slidesPerView:1,
        loop:true,
        pagination: {
            el: '.slider-review__pagination',
            type: 'bullets',
            clickable:true,
        },
        breakpoints: {
            576: {
                slidesPerView: "auto",
                spaceBetween: 32,
            },
        }
    })
    
    const accordionItems = document.querySelectorAll(".accordion__item-content");
    const heights = [...accordionItems].map(item=>item.offsetHeight);
    [...accordionItems].forEach(item=>item.style.maxHeight = "0px");
    console.log(heights)

    const triggers = document.querySelectorAll(".accordion__item-trigger")
    triggers.forEach((item,index)=>{
        item.addEventListener("click",e=>{
            const accordionParent = e.target.closest(".accordion");
            if(accordionItems[index].classList.contains("accordion__item-content-active")) {
                accordionItems[index].style.maxHeight =`${0}px`;
                accordionItems[index].classList.remove("accordion__item-content-active")
                item.classList.remove("accordion__item-trigger-active")
            } else {
                accordionParent.querySelectorAll(".accordion__item-content-active").forEach(item=>{
                    item.classList.remove("accordion__item-content-active")
                    item.style.maxHeight =`${0}px`;
                })
                accordionParent.querySelectorAll(".accordion__item-trigger").forEach(item=>item.classList.remove("accordion__item-trigger-active"))
                accordionItems[index].style.maxHeight =`${heights[index]}px`;
                accordionItems[index].classList.add("accordion__item-content-active")
                item.classList.add("accordion__item-trigger-active")
            }
        })
    })
})