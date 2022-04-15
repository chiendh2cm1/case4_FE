function showShopList() {
    $.ajax({
        type: 'GET',
        url: 'http://localhost:8080/shops',
        success: function (shops) {
            let content = '';
            for (let i = 0; i < shops.length; i++) {
                content += `<li class="item-lead"><a onclick="showShop(${shops[i].id})">${shops[i].name}</a></li>`
            }

            $('#shop_list_index').html(content);
        }
    })
}

$(document).ready(function () {
    showShopList();
})


$(document).ready(function () {
    getProductByPage();
})

function showLishProduct(data) {
    let contentHTML = '';
    for (let i = 0; i < data.length; i++) {
        contentHTML += `<div class="col-6 col-md-4 col-lg-4 col-xl-3">
                                    <div class="product product-11 text-center">
                                        <figure class="product-media">
                                            <a href="product.html">
                                                <img src="http://localhost:8080/image/${data[i].image}" alt="Product image" class="product-image">   
                                            </a>

                                            <div class="product-action-vertical">
                                                <a href="#" class="btn-product-icon btn-wishlist "><span>add to wishlist</span></a>
                                            </div><!-- End .product-action-vertical -->
                                        </figure><!-- End .product-media -->

                                        <div class="product-body">
                                            <div class="product-cat">
                                                <a href="#">Decor</a>
                                            </div><!-- End .product-cat -->
                                            <h3 class="product-title"><a href="product.html">${data[i].name}</a></h3><!-- End .product-title -->
                                            <div class="product-price">
                                                ${data[i].price} đ
                                            </div><!-- End .product-price -->
                                        </div><!-- End .product-body -->
                                        <div class="product-action">
                                            <a onclick="addCartDetail(${data[i].id})" class="btn-product btn-cart"><span>add to cart</span></a>
                                        </div><!-- End .product-action -->
                                    </div><!-- End .product -->
                             </div><!-- End .col-sm-6 col-md-4 col-lg-3 -->`
    }
    return contentHTML;
}
function showShop(id, page) {
    $('#showCategoryByShop').val(null);
    $.ajax({
        type: 'GET',
        url: `http://localhost:8080/products/viewProductByShop/${id}?page=${page}`,
        success: function (data) {
            let content = ''
            let products = data.content;
            content += showLishProduct(products);
            $('#product-body').html(content);
            let page = `<button class="btn btn-primary" id="backup" onclick="showShop(${id},${data.pageable.pageNumber}-1)">Previous</button>
    <span>${data.pageable.pageNumber + 1} | ${data.totalPages}</span>
    <button class="btn btn-primary" id="next" onclick="showShop(${id}, ${data.pageable.pageNumber}+1)">Next</button>`
            $('#product-list-page').html(page);
            if (data.pageable.pageNumber === 0) {
                document.getElementById("backup").hidden = true
            }
            if (data.pageable.pageNumber + 1 === data.totalPages) {
                document.getElementById("next").hidden = true
            }
        }
    });
    $.ajax({
        type: 'GET',
        url: `http://localhost:8080/shops/view/${id}`,
        success: function (data) {
            let content = '';
            let categories = data.content;
            for (let i = 0; i < categories.length; i++) {
                content += `<li><a onclick="showProductByCategory(${categories[i].id})">${categories[i].name}</a></li>`
            }
            $('#showCategoryByShop').html(content);
        }
    })
    event.preventDefault();
}

function showProductByCategory(id) {
    $.ajax({
        type: 'GET',
        url: `http://localhost:8080/categories/view/${id}`,
        success: function (data) {
            let content = '';
            let categories = data.content;
            content += showLishProduct(categories);
            $('#product-body').html(content);
        }
    })
    let page = "";
    $('#product-list-page').html(page);
}

// function addCartDetail(id){
// $.ajax({
//     type: 'GET',
//     url: `http://localhost:8080/products/${id}`,
//     success:function (data){
//         let nameBill_detail = data.name;
//         let quantity = 1;
//         let price = data.price;
//         let bill_detail = {
//              name = nameBill_detail;
//         }
//         $.ajax({
//             type:'POST',
//             url:'http://localhost:8080/bill_details',
//
//         })
//     }
// })
// }