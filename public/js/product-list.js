// Lấy trang hiện tại từ query params
const params = new URLSearchParams(window.location.search)
const page = params.get('page') || 1

/////// Cập nhật item film tại product list
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
    pageRow = 3
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

// Khai báo câc biến tính số lượng item sẽ xuất hiện tại product list
const numberItem = pageCol*pageRow
const pageSize = Math.ceil(FILM.length/numberItem) 
let startId = (page - 1)*numberItem + 1
let endId = startId + numberItem
const element__product_item_box = document.querySelector('.product-item-box')

const itemInStorage = JSON.parse(localStorage.getItem('cart')) || []

// Hiển thị phim ra màn hình
let all_product = ''
FILM.slice(startId-1,endId-1).forEach(element => {
    let name_film = element['name']
    let year_film = element['year']
    let time_film = element['time']
    let rate_film = element['rating']
    let id_film = element['id']
    let src_film

    if (element['type_film']=='chiếu rạp'){
        src_film = './public/assets/img/movie/'+element['pic']
    } else {
        src_film = './public/assets/img/cartoon/'+element['pic']
    }

    let classIcon = 'fa-plus item__icon--add'
    const index = itemInStorage.findIndex((e) => e.id === element.id);
    if( index !== -1){
        classIcon = 'fa-minus item__icon--remove'
    }

    all_product += 
    `<a href="pages/product_detail.html?id=${id_film}" class="col ${classCol} product-item-box">
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


////////////// Các thao tác thêm xóa 

// Lấy các nút thêm xóa
const iconActions = document.querySelectorAll(".item__icon")

// Xử lý khi nhấn vào nút
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

// Tải item vào localStorage
function loadingItemToStorage(element) {
    const  item = FILM[element.target.dataset.id - 1]
    let cartItems = []
    // Cập nhật lại class cho item film
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


// Xóa item khỏi localStorage
function removeItemFromStorage(element) {
    const  item = FILM[element.target.dataset.id - 1]
    let cartItems = []
    // Cập nhật lại class cho item film
    element.target.classList.remove('item__icon--remove', 'fa-minus')
    element.target.classList.add('item__icon--add', 'fa-plus')

    cartItems = JSON.parse(localStorage.getItem('cart'))
    const index = cartItems.findIndex((e) => e.id === item.id);
    cartItems.splice(index,1)
    localStorage.setItem('cart',JSON.stringify(cartItems))
}

// Tải lại trang nếu xóa localStorage 
window.addEventListener('storage', function(event) {
    if (event.key === null) {
        window.location.reload();
    }
  });



