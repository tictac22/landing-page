const burger = document.querySelector(".header__burger")
const headerMenu = document.querySelector(".header__menu")
burger.addEventListener("click", ()=> {
    burger.classList.toggle("header__burger--active")
    headerMenu.classList.toggle("header__menu--active")
})