
// Lấy trang hiện tại từ query params
const params = new URLSearchParams(window.location.search)
const page = params.get('page') || 1

/////// Cập nhật item film tại product list

// Lấy  các phim hoạt hình
const filmAnime = FILM.filter((film) => {
    return film.type_film === 'Phim hoạt hình'
})

// Khởi tạo cột, hàng và class mặc định cho item
let pageCol = 4
let pageRow = 3
let classCol = 'l-'+ (12/pageCol).toString().replace(".", "-")

// Tải lại trang nếu kích thước thay đổi
let lastWidth = window.innerWidth;

window.addEventListener('resize',  () => {
    if (window.innerWidth !== lastWidth) {
        if(window.innerWidth < 740 && classCol !==  'c-'+ (12/pageCol).toString().replace(".", "-")){
            window.location.reload()
        }
        if(window.innerWidth < 1024 && classCol !== 'm-'+ (12/pageCol).toString().replace(".", "-")){
            window.location.reload()
        }
        if(window.innerWidth >= 1024 && classCol !== 'l-'+ (12/pageCol).toString().replace(".", "-")){
            window.location.reload()
        }
        lastWidth = window.innerWidth;
    }
})

// Các cột, hàng và class sẽ thay đổi theo kích thước màn hình
if(window.innerWidth < 740){
    pageCol = 2
    pageRow = 5
    classCol = 'c-'+ (12/pageCol).toString().replace(".", "-")
} else if(window.innerWidth >= 740 && window.innerWidth  < 1024){
    pageCol = 3
    pageRow = 4
    classCol = 'm-'+ (12/pageCol).toString().replace(".", "-")
} else if(window.innerWidth >= 1024) {
    pageCol = 4
    pageRow = 3
    classCol = 'l-'+ (12/pageCol).toString().replace(".", "-")
}

// Tính số lượng item sẽ xuất hiện tại product list
const numberItem = pageCol*pageRow
const pageSize = Math.ceil(filmAnime.length/numberItem) 
let startId = (page - 1)*numberItem + 1
let endId = startId + numberItem
const element__product_item_box = document.querySelector('.product-item-box')

// Lấy item trong local Storage
const itemInStorage = JSON.parse(localStorage.getItem('cart')) || []

// Hiển thị film ra màn hình
let all_product = ''
filmAnime.slice(startId-1,endId-1).forEach(element => {
        let name_film = element['name']
        let year_film = element['year']
        let time_film = element['time']
        let rate_film = element['rating']
        let id_film = element['id']
        let src_film = '../public/assets/img/cartoon/'+element['pic']
    
        let classIcon = 'fa-plus item__icon--add'
        const index = itemInStorage.findIndex((e) => e.id === element.id);
        if( index !== -1){
            classIcon = 'fa-minus item__icon--remove'
        }
    
        all_product += 
        `<a href="product_detail.html?id=${id_film}" class="col ${classCol} product-item-box">
            <div class="product-item">
                <i data-id="${id_film}" class="fa-solid item__icon ${classIcon}"></i>
                <img src="${src_film}" alt="" class="product-item-pic">
                <div class="product-item-name">
                    <span class="name_film">${name_film}</span>
                    <span class="year_film ">${year_film}</span>
                </div>
                <div class="product-item-info ">
                    <span class="quanlity-film">HD</span>
                    <span class="longtime-film--star-film">
                            <span class="material-symbols-outlined material-symbols-outlined--clock_loader_20 hidden-on-mobile-tablet">clock_loader_20</span>
                            <span class="longtime-film hidden-on-mobile-tablet">${time_film}</span>
                            <span class="material-symbols-outlined material-symbols-outlined--star">star</span>
                            <span class="star-film">${rate_film}</span>
                    </span>
                </div>
            </div>
        </a>`

})

element__product_item_box.outerHTML = all_product


////////////// 

const iconActions = document.querySelectorAll(".item__icon")


iconActions.forEach((item) =>{
    item.addEventListener('click',(element)=>{
        element.preventDefault()
        const addClass = 'item__icon--add';
        const isAdd = element.target.classList.contains(addClass);
        if(isAdd){
            loadingItemToStorage(element)
        } else {
            removeItemFromStorage(element)
        }
        renderToCart() // Render lại trong  giỏ hàng
    })
})


function loadingItemToStorage(element) {
    const  item = FILM[element.target.dataset.id - 1]
    let cartItems = []
    element.target.classList.remove('item__icon--add', 'fa-plus')
    element.target.classList.add('item__icon--remove', 'fa-minus')

    if(JSON.parse(localStorage.getItem('cart')) === null){
        cartItems.push(item)
        localStorage.setItem('cart', JSON.stringify(cartItems))
    } else {
        cartItems = JSON.parse(localStorage.getItem('cart'))
        cartItems.unshift(item)
        localStorage.setItem('cart',JSON.stringify(cartItems))
    }
}

function removeItemFromStorage(element) {
    const  item = FILM[element.target.dataset.id - 1]
    let cartItems = []
    element.target.classList.remove('item__icon--remove', 'fa-minus')
    element.target.classList.add('item__icon--add', 'fa-plus')

    cartItems = JSON.parse(localStorage.getItem('cart'))
    const index = cartItems.findIndex((e) => e.id === item.id);
    cartItems.splice(index,1)
    localStorage.setItem('cart',JSON.stringify(cartItems))
}

//////////// Xuất item trong local storage ra giỏ hàng
renderToCart()

function renderToCart(){
    const itemInCarts = JSON.parse(localStorage.getItem('cart')) || []
    const contentCart = document.querySelector('.content__cart')
    contentCart.innerHTML =  ''
    // Nếu như không có phim trong giỏ hàng
    if(itemInCarts.length === 0) {
        const divNoCart = document.createElement('div')
        divNoCart.classList.add('no-item')
        
        const imgNoCart = document.createElement('img')
        imgNoCart.classList.add('no-item-img')
        imgNoCart.setAttribute('src', '../public/assets/navbar/no_cart.png')

        divNoCart.appendChild(imgNoCart)
        contentCart.appendChild(divNoCart)
    } else { // Có phim trong giỏ hàng
        itemInCarts.forEach(item => {
            let name_film = item['name']
            let id_film = item['id']
            let src_film
          
            if (item['type_film'] == 'chiếu rạp') {
              src_film = '../public/assets/img/movie/' + item['pic']
            } else {
              src_film = '../public/assets/img/cartoon/' + item['pic']
            }
          
            const cartItem = document.createElement('a')
            cartItem.setAttribute('data-id', id_film)
            cartItem.style.backgroundImage = `url(${src_film})`
            cartItem.classList.add('cart__item')
            cartItem.setAttribute('href', `pages/product_detail.html?id=${id_film}`)
          
            const img = document.createElement('img')
            img.setAttribute('src', src_film)
            img.setAttribute('alt', '')
            img.classList.add('cart__item-img')
          
            const title = document.createElement('div')
            title.classList.add('cart__item-title')
            const titleText = document.createElement('span')
            titleText.classList.add('cart__item-title-text')
            titleText.innerText = name_film
            title.appendChild(titleText)
          
            const remove = document.createElement('i')
            remove.classList.add('cart__item-remove', 'fa-solid', 'fa-trash')
            remove.setAttribute('data-id', id_film)

            // Thêm sự kiện click vào nút xóa
            remove.addEventListener('click',  (element) => {
                element.preventDefault();
                removeCart(element)
            })
          
            cartItem.appendChild(img)
            cartItem.appendChild(title)
            cartItem.appendChild(remove)
          
            contentCart.appendChild(cartItem)
          })
    }
}

// Hàm xóa phim từ giỏ hàng và render lại
function removeCart(element){
    removeItemFromCart(element)
    renderToCart()
}

// Hàm xóa item phim từ giỏ hàng
function removeItemFromCart(element){
    const  item = FILM[element.target.dataset.id - 1]
    let cartItems = JSON.parse(localStorage.getItem('cart')) || []
    const index = cartItems.findIndex((e) => e.id === item.id);
    cartItems.splice(index,1)
    localStorage.setItem('cart',JSON.stringify(cartItems))


    const productRemoveds = document.querySelectorAll('.item__icon--remove')
    productRemoveds.forEach((item)=>{
        if(item.dataset.id === element.target.dataset.id){
            item.classList.remove('item__icon--remove', 'fa-minus')
            item.classList.add('item__icon--add', 'fa-plus')
        }
    })
}

//////////////// Chức năng tìm kiếm
if(window.innerWidth >= 740){
    const input = document.querySelector(".navbar__main-searchbar")
    input.addEventListener("keydown", (evt) => {
        if(evt.key === "Enter"){
            evt.preventDefault()
        }
    })
    input.addEventListener("keyup", (evt) => {
        if(evt.key === "Enter"){
            const valueInput = evt.target.value
            if(valueInput !== ""){
                const newUrl = 'search.html' + '?' + `search=${valueInput}`
                window.location.href = newUrl
            } else{
                evt.preventDefault()
            }
        }
    })

    const btnSearch = document.querySelector(".loopicon_box")

    btnSearch.addEventListener('click', (evt) => {
        const input = document.querySelector(".navbar__main-searchbar")
        const valueInput = input.value
        if(valueInput !== ""){
            const newUrl = 'search.html' + '?' + `search=${valueInput}`
            window.location.href = newUrl
        } else{
            evt.preventDefault()
        }
    })

} else if (window.innerWidth < 740){
    const input = document.querySelector(".menu__search-input")
    input.addEventListener("keydown", (evt) => {
        if(evt.key === "Enter"){
            evt.preventDefault()
        }
    })
    input.addEventListener("keyup", (evt) => {
        if(evt.key === "Enter"){
            const valueInput = evt.target.value
            if(valueInput !== ""){
                const newUrl = 'search.html' + '?' + `search=${valueInput}`
                window.location.href = newUrl
            } else{
                evt.preventDefault()
            }
        }
    })

    const btnSearch = document.querySelector(".menu__search-icon")
    
    btnSearch.addEventListener('click', (evt) => {
        const input = document.querySelector(".menu__search-input")
        const valueInput = input.value
        if(valueInput !== ""){
            const newUrl = 'search.html' + '?' + `search=${valueInput}`
            window.location.href = newUrl
        } else{
            evt.preventDefault()
        }
    })
}

// Hàm tìm kiếm bằng tên Phim
function searchFilmByName(name) {
    const result = FILM.filter(film => film.name.toLowerCase().includes(name.toLowerCase()));
    return result;
  }


window.addEventListener('storage', function(event) {
    if (event.key === null) {
        window.location.reload();
    }
  });
  