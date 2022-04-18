let currentUser = localStorage.getItem('currentUser');
currentUser = JSON.parse(currentUser);// ep chuoi ve doi tuong

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

function showLishProduct(data) {
    let contentHTML = '';
    for (let i = 0; i < data.length; i++) {
        contentHTML += `<div class="col-6 col-md-4 col-lg-4 col-xl-3">
                                    <div class="product product-11 text-center">
                                        <figure class="product-media">
                                            <a href="product.html" onclick="showViewProductDetail(${data[i].id})">
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

let keyLocolstorateItemGioHang = 'danhSachItemGioHang';

function taoDoiTuongItemGioHang(idSanPham, image, nameSanPham, soLuong, giaSanPham) {
    let itemGioHang = new Object();
    itemGioHang.idSanPham = idSanPham;
    itemGioHang.image = image;
    itemGioHang.nameSanPham = nameSanPham;
    itemGioHang.soLuong = soLuong;
    itemGioHang.giaSanPham = giaSanPham;
    return itemGioHang;
}

function layDanhSachItemGioHang() {
    let danhSachItemGioHang = [];
    var jsonDanhSachItemGioHang = localStorage.getItem(keyLocolstorateItemGioHang);
    if (jsonDanhSachItemGioHang != null)
        danhSachItemGioHang = JSON.parse(jsonDanhSachItemGioHang);
    return danhSachItemGioHang;
}

function luuVaoLocaStorate(danhSachItemGioHang) {
    let jsonDanhSachItemGioHang = JSON.stringify(danhSachItemGioHang);
    localStorage.setItem(keyLocolstorateItemGioHang, jsonDanhSachItemGioHang)
}

function addCartDetail(id) {
    $.ajax({
        type: 'GET',
        url: `http://localhost:8080/products/${id}`,
        success: function (data) {
            let danhSachItemGioHang = layDanhSachItemGioHang();
            let coTonTaiTrongDanhSachItemGioHang = false;
            for (let i = 0; i < danhSachItemGioHang.length; i++) {
                let itemGioHangHienTai = danhSachItemGioHang[i];
                if (itemGioHangHienTai.idSanPham === data.id) {
                    danhSachItemGioHang[i].soLuong++;
                    coTonTaiTrongDanhSachItemGioHang = true;
                }
            }
            if (coTonTaiTrongDanhSachItemGioHang === false) {
                let itemGioHang = taoDoiTuongItemGioHang(data.id, data.image, data.name, 1, data.price);
                danhSachItemGioHang.push(itemGioHang);
            }
            luuVaoLocaStorate(danhSachItemGioHang);
            let countItem = layDanhSachItemGioHang().length;
            $('#countItem').html(countItem)
        }
    })
}

function showViewProductDetail(id) {
    $.ajax({
        type: 'GET',
        url: `http://localhost:8080/products/${id}`,
        success: function (data) {
            let content = '';
            content = `<html lang="en">


<!-- molla/product.html  22 Nov 2019 09:54:50 GMT -->
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
    <title>Molla - Bootstrap eCommerce Template</title>
    <meta name="keywords" content="HTML5 Template">
    <meta name="description" content="Molla - Bootstrap eCommerce Template">
    <meta name="author" content="p-themes">
    <!-- Favicon -->
    <link rel="apple-touch-icon" sizes="180x180" href="assets/images/icons/apple-touch-icon.png">
    <link rel="icon" type="image/png" sizes="32x32" href="assets/images/icons/favicon-32x32.png">
    <link rel="icon" type="image/png" sizes="16x16" href="assets/images/icons/favicon-16x16.png">
    <link rel="manifest" href="assets/images/icons/site.html">
    <link rel="mask-icon" href="assets/images/icons/safari-pinned-tab.svg" color="#666666">
    <link rel="shortcut icon" href="assets/images/icons/favicon.ico">
    <meta name= "apple-mobile-web-app-title" content="Molla">
    <meta name="application-name" content="Molla">
    <meta name="msapplication-TileColor" content="#cc9966">
    <meta name="msapplication-config" content="assets/images/icons/browserconfig.xml">
    <meta name="theme-color" content="#ffffff">
    <!-- Plugins CSS File -->
    <link rel="stylesheet" href="assets/css/bootstrap.min.css">
    <link rel="stylesheet" href="assets/css/plugins/owl-carousel/owl.carousel.css">
    <link rel="stylesheet" href="assets/css/plugins/magnific-popup/magnific-popup.css">
    <!-- Main CSS File -->
    <link rel="stylesheet" href="assets/css/style.css">
    <link rel="stylesheet" href="assets/css/plugins/nouislider/nouislider.css">
</head>

<body>
    <div class="page-wrapper">
        <header class="header">
            <div class="header-middle sticky-header">
                <div class="container">
                    <div class="header-left">
                        <button class="mobile-menu-toggler">
                            <span class="sr-only">Toggle mobile menu</span>
                            <i class="icon-bars"></i>
                        </button>

                        <a href="/case4_FE/indexmau.html" class="logo">
                            <img src="assets/images/logo.png" alt="Molla Logo" width="105" height="25">
                        </a>

                        <nav class="main-nav">
                            <ul class="menu sf-arrows">
                                <li class="megamenu-container active">
                                    <a href="/case4_FE/indexmau.html" class="sf-with-ul">Home</a>
                                </li>
                            </ul><!-- End .menu -->
                        </nav><!-- End .main-nav -->
                    </div><!-- End .header-left -->
                </div><!-- End .container -->
            </div><!-- End .header-middle -->
        </header><!-- End .header -->
        <main class="main">
            <div class="page-content">
                <div class="container">
                    <div class="product-details-top" id="product_detail">
                        <div class="row">
                            <div class="col-md-6">
                                <div class="product-gallery product-gallery-vertical">
                                    <div class="row">
                                        <figure class="product-main-image">
                                            <img id="product-zoom" src="http://localhost:8080/image/${data.image}" data-zoom-image="assets/images/products/single/1-big.jpg" alt="product image">

                                            <a href="#" id="btn-product-gallery" class="btn-product-gallery">
                                                <i class="icon-arrows"></i>
                                            </a>
                                        </figure><!-- End .product-main-image -->
                                    </div><!-- End .row -->
                                </div><!-- End .product-gallery -->
                            </div><!-- End .col-md-6 -->

                            <div class="col-md-6">
                                <div class="product-details">
                                    <h1 class="product-title">${data.name}</h1><!-- End .product-title -->

                                    <div class="ratings-container">
                                        <div class="ratings">
                                            <div class="ratings-val" style="width: 80%;"></div><!-- End .ratings-val -->
                                        </div><!-- End .ratings -->
                                        <a class="ratings-text" href="#product-review-link" id="review-link">( 2 Reviews )</a>
                                    </div><!-- End .rating-container -->

                                    <div class="product-price">
                                        ${data.price} VND
                                    </div><!-- End .product-price -->

                                    <div class="product-content">
                                        <p>${data.description}</p>
                                    </div><!-- End .product-content -->
                                    
                                    <div class="product-content">
                                        <p>${data.quantity}</p>
                                    </div><!-- End .product-content -->
                                    

                                    <div class="product-details-action">
                                        <a  onclick="addCartDetail(${data.id})" class="btn-product btn-cart"><span>add to cart</span></a>
                                    </div><!-- End .product-details-action -->

                                    <div class="product-details-footer">
                                        <div class="social-icons social-icons-sm">
                                            <span class="social-label">Share:</span>
                                            <a href="#" class="social-icon" title="Facebook" target="_blank"><i class="icon-facebook-f"></i></a>
                                            <a href="#" class="social-icon" title="Twitter" target="_blank"><i class="icon-twitter"></i></a>
                                            <a href="#" class="social-icon" title="Instagram" target="_blank"><i class="icon-instagram"></i></a>
                                            <a href="#" class="social-icon" title="Pinterest" target="_blank"><i class="icon-pinterest"></i></a>
                                        </div>
                                    </div><!-- End .product-details-footer -->
                                </div><!-- End .product-details -->
                            </div><!-- End .col-md-6 -->
                        </div><!-- End .row -->
                    </div><!-- End .product-details-top -->
                    <h2 class="title text-center mb-4">You LIKE IT</h2><!-- End .title text-center -->
                </div><!-- End .container -->
            </div><!-- End .page-content -->
        </main><!-- End .main -->

        <footer class="footer">
        \t<div class="footer-middle">
\t            <div class="container">
\t            \t<div class="row">
\t            \t\t<div class="col-sm-6 col-lg-3">
\t            \t\t\t<div class="widget widget-about">
\t            \t\t\t\t<img src="assets/images/logo.png" class="footer-logo" alt="Footer Logo" width="105" height="25">
\t            \t\t\t\t<p>Praesent dapibus, neque id cursus ucibus, tortor neque egestas augue, eu vulputate magna eros eu erat. </p>

\t            \t\t\t\t<div class="social-icons">
\t            \t\t\t\t\t<a href="#" class="social-icon" target="_blank" title="Facebook"><i class="icon-facebook-f"></i></a>
\t            \t\t\t\t\t<a href="#" class="social-icon" target="_blank" title="Twitter"><i class="icon-twitter"></i></a>
\t            \t\t\t\t\t<a href="#" class="social-icon" target="_blank" title="Instagram"><i class="icon-instagram"></i></a>
\t            \t\t\t\t\t<a href="#" class="social-icon" target="_blank" title="Youtube"><i class="icon-youtube"></i></a>
\t            \t\t\t\t\t<a href="#" class="social-icon" target="_blank" title="Pinterest"><i class="icon-pinterest"></i></a>
\t            \t\t\t\t</div><!-- End .soial-icons -->
\t            \t\t\t</div><!-- End .widget about-widget -->
\t            \t\t</div><!-- End .col-sm-6 col-lg-3 -->

\t            \t\t<div class="col-sm-6 col-lg-3">
\t            \t\t\t<div class="widget">
\t            \t\t\t\t<h4 class="widget-title">Useful Links</h4><!-- End .widget-title -->

\t            \t\t\t\t<ul class="widget-list">
\t            \t\t\t\t\t<li><a href="about.html">About Molla</a></li>
\t            \t\t\t\t\t<li><a href="#">How to shop on Molla</a></li>
\t            \t\t\t\t\t<li><a href="#">FAQ</a></li>
\t            \t\t\t\t\t<li><a href="contact.html">Contact us</a></li>
\t            \t\t\t\t\t<li><a href="login.html">Log in</a></li>
\t            \t\t\t\t</ul><!-- End .widget-list -->
\t            \t\t\t</div><!-- End .widget -->
\t            \t\t</div><!-- End .col-sm-6 col-lg-3 -->

\t            \t\t<div class="col-sm-6 col-lg-3">
\t            \t\t\t<div class="widget">
\t            \t\t\t\t<h4 class="widget-title">Customer Service</h4><!-- End .widget-title -->

\t            \t\t\t\t<ul class="widget-list">
\t            \t\t\t\t\t<li><a href="#">Payment Methods</a></li>
\t            \t\t\t\t\t<li><a href="#">Money-back guarantee!</a></li>
\t            \t\t\t\t\t<li><a href="#">Returns</a></li>
\t            \t\t\t\t\t<li><a href="#">Shipping</a></li>
\t            \t\t\t\t\t<li><a href="#">Terms and conditions</a></li>
\t            \t\t\t\t\t<li><a href="#">Privacy Policy</a></li>
\t            \t\t\t\t</ul><!-- End .widget-list -->
\t            \t\t\t</div><!-- End .widget -->
\t            \t\t</div><!-- End .col-sm-6 col-lg-3 -->

\t            \t\t<div class="col-sm-6 col-lg-3">
\t            \t\t\t<div class="widget">
\t            \t\t\t\t<h4 class="widget-title">My Account</h4><!-- End .widget-title -->

\t            \t\t\t\t<ul class="widget-list">
\t            \t\t\t\t\t<li><a href="#">Sign In</a></li>
\t            \t\t\t\t\t<li><a href="cart.html">View Cart</a></li>
\t            \t\t\t\t\t<li><a href="#">My Wishlist</a></li>
\t            \t\t\t\t\t<li><a href="#">Track My Order</a></li>
\t            \t\t\t\t\t<li><a href="#">Help</a></li>
\t            \t\t\t\t</ul><!-- End .widget-list -->
\t            \t\t\t</div><!-- End .widget -->
\t            \t\t</div><!-- End .col-sm-6 col-lg-3 -->
\t            \t</div><!-- End .row -->
\t            </div><!-- End .container -->
\t        </div><!-- End .footer-middle -->

\t        <div class="footer-bottom">
\t        \t<div class="container">
\t        \t\t<p class="footer-copyright">Copyright © 2019 Molla Store. All Rights Reserved.</p><!-- End .footer-copyright -->
\t        \t\t<figure class="footer-payments">
\t        \t\t\t<img src="assets/images/payments.png" alt="Payment methods" width="272" height="20">
\t        \t\t</figure><!-- End .footer-payments -->
\t        \t</div><!-- End .container -->
\t        </div><!-- End .footer-bottom -->
        </footer><!-- End .footer -->
    </div><!-- End .page-wrapper -->
    <button id="scroll-top" title="Back to Top"><i class="icon-arrow-up"></i></button>
    <div class="mobile-menu-overlay"></div><!-- End .mobil-menu-overlay -->

    <div class="mobile-menu-container">
        <div class="mobile-menu-wrapper">
            <span class="mobile-menu-close"><i class="icon-close"></i></span>

            <form action="#" method="get" class="mobile-search">
                <label for="mobile-search" class="sr-only">Search</label>
                <input type="search" class="form-control" name="mobile-search" id="mobile-search" placeholder="Search in..." required>
                <button class="btn btn-primary" type="submit"><i class="icon-search"></i></button>
            </form>

            <nav class="mobile-nav">
                <ul class="mobile-menu">
                    <li class="active">
                        <a href="index.html">Home</a>

                        <ul>
                            <li><a href="index-1.html">01 - furniture store</a></li>
                            <li><a href="index-2.html">02 - furniture store</a></li>
                            <li><a href="index-3.html">03 - electronic store</a></li>
                            <li><a href="index-4.html">04 - electronic store</a></li>
                            <li><a href="index-5.html">05 - fashion store</a></li>
                            <li><a href="index-6.html">06 - fashion store</a></li>
                            <li><a href="index-7.html">07 - fashion store</a></li>
                            <li><a href="index-8.html">08 - fashion store</a></li>
                            <li><a href="index-9.html">09 - fashion store</a></li>
                            <li><a href="index-10.html">10 - shoes store</a></li>
                            <li><a href="index-11.html">11 - furniture simple store</a></li>
                            <li><a href="index-12.html">12 - fashion simple store</a></li>
                            <li><a href="index-13.html">13 - market</a></li>
                            <li><a href="index-14.html">14 - market fullwidth</a></li>
                            <li><a href="index-15.html">15 - lookbook 1</a></li>
                            <li><a href="index-16.html">16 - lookbook 2</a></li>
                            <li><a href="index-17.html">17 - fashion store</a></li>
                            <li><a href="index-18.html">18 - fashion store (with sidebar)</a></li>
                            <li><a href="index-19.html">19 - games store</a></li>
                            <li><a href="index-20.html">20 - book store</a></li>
                            <li><a href="index-21.html">21 - sport store</a></li>
                            <li><a href="index-22.html">22 - tools store</a></li>
                            <li><a href="index-23.html">23 - fashion left navigation store</a></li>
                            <li><a href="index-24.html">24 - extreme sport store</a></li>
                        </ul>
                    </li>
                    <li>
                        <a href="category.html">Shop</a>
                        <ul>
                            <li><a href="category-list.html">Shop List</a></li>
                            <li><a href="category-2cols.html">Shop Grid 2 Columns</a></li>
                            <li><a href="category.html">Shop Grid 3 Columns</a></li>
                            <li><a href="category-4cols.html">Shop Grid 4 Columns</a></li>
                            <li><a href="category-boxed.html"><span>Shop Boxed No Sidebar<span class="tip tip-hot">Hot</span></span></a></li>
                            <li><a href="category-fullwidth.html">Shop Fullwidth No Sidebar</a></li>
                            <li><a href="product-category-boxed.html">Product Category Boxed</a></li>
                            <li><a href="product-category-fullwidth.html"><span>Product Category Fullwidth<span class="tip tip-new">New</span></span></a></li>
                            <li><a href="cart.html">Cart</a></li>
                            <li><a href="checkout.html">Checkout</a></li>
                            <li><a href="wishlist.html">Wishlist</a></li>
                            <li><a href="#">Lookbook</a></li>
                        </ul>
                    </li>
                    <li>
                        <a href="product.html" class="sf-with-ul">Product</a>
                        <ul>
                            <li><a href="product.html">Default</a></li>
                            <li><a href="product-centered.html">Centered</a></li>
                            <li><a href="product-extended.html"><span>Extended Info<span class="tip tip-new">New</span></span></a></li>
                            <li><a href="product-gallery.html">Gallery</a></li>
                            <li><a href="product-sticky.html">Sticky Info</a></li>
                            <li><a href="product-sidebar.html">Boxed With Sidebar</a></li>
                            <li><a href="product-fullwidth.html">Full Width</a></li>
                            <li><a href="product-masonry.html">Masonry Sticky Info</a></li>
                        </ul>
                    </li>
                    <li>
                        <a href="#">Pages</a>
                        <ul>
                            <li>
                                <a href="about.html">About</a>

                                <ul>
                                    <li><a href="about.html">About 01</a></li>
                                    <li><a href="about-2.html">About 02</a></li>
                                </ul>
                            </li>
                            <li>
                                <a href="contact.html">Contact</a>

                                <ul>
                                    <li><a href="contact.html">Contact 01</a></li>
                                    <li><a href="contact-2.html">Contact 02</a></li>
                                </ul>
                            </li>
                            <li><a href="login.html">Login</a></li>
                            <li><a href="faq.html">FAQs</a></li>
                            <li><a href="404.html">Error 404</a></li>
                            <li><a href="coming-soon.html">Coming Soon</a></li>
                        </ul>
                    </li>
                    <li>
                        <a href="blog.html">Blog</a>

                        <ul>
                            <li><a href="blog.html">Classic</a></li>
                            <li><a href="blog-listing.html">Listing</a></li>
                            <li>
                                <a href="#">Grid</a>
                                <ul>
                                    <li><a href="blog-grid-2cols.html">Grid 2 columns</a></li>
                                    <li><a href="blog-grid-3cols.html">Grid 3 columns</a></li>
                                    <li><a href="blog-grid-4cols.html">Grid 4 columns</a></li>
                                    <li><a href="blog-grid-sidebar.html">Grid sidebar</a></li>
                                </ul>
                            </li>
                            <li>
                                <a href="#">Masonry</a>
                                <ul>
                                    <li><a href="blog-masonry-2cols.html">Masonry 2 columns</a></li>
                                    <li><a href="blog-masonry-3cols.html">Masonry 3 columns</a></li>
                                    <li><a href="blog-masonry-4cols.html">Masonry 4 columns</a></li>
                                    <li><a href="blog-masonry-sidebar.html">Masonry sidebar</a></li>
                                </ul>
                            </li>
                            <li>
                                <a href="#">Mask</a>
                                <ul>
                                    <li><a href="blog-mask-grid.html">Blog mask grid</a></li>
                                    <li><a href="blog-mask-masonry.html">Blog mask masonry</a></li>
                                </ul>
                            </li>
                            <li>
                                <a href="#">Single Post</a>
                                <ul>
                                    <li><a href="single.html">Default with sidebar</a></li>
                                    <li><a href="single-fullwidth.html">Fullwidth no sidebar</a></li>
                                    <li><a href="single-fullwidth-sidebar.html">Fullwidth with sidebar</a></li>
                                </ul>
                            </li>
                        </ul>
                    </li>
                    <li>
                        <a href="elements-list.html">Elements</a>
                        <ul>
                            <li><a href="elements-products.html">Products</a></li>
                            <li><a href="elements-typography.html">Typography</a></li>
                            <li><a href="elements-titles.html">Titles</a></li>
                            <li><a href="elements-banners.html">Banners</a></li>
                            <li><a href="elements-product-category.html">Product Category</a></li>
                            <li><a href="elements-video-banners.html">Video Banners</a></li>
                            <li><a href="elements-buttons.html">Buttons</a></li>
                            <li><a href="elements-accordions.html">Accordions</a></li>
                            <li><a href="elements-tabs.html">Tabs</a></li>
                            <li><a href="elements-testimonials.html">Testimonials</a></li>
                            <li><a href="elements-blog-posts.html">Blog Posts</a></li>
                            <li><a href="elements-portfolio.html">Portfolio</a></li>
                            <li><a href="elements-cta.html">Call to Action</a></li>
                            <li><a href="elements-icon-boxes.html">Icon Boxes</a></li>
                        </ul>
                    </li>
                </ul>
            </nav><!-- End .mobile-nav -->

            <div class="social-icons">
                <a href="#" class="social-icon" target="_blank" title="Facebook"><i class="icon-facebook-f"></i></a>
                <a href="#" class="social-icon" target="_blank" title="Twitter"><i class="icon-twitter"></i></a>
                <a href="#" class="social-icon" target="_blank" title="Instagram"><i class="icon-instagram"></i></a>
                <a href="#" class="social-icon" target="_blank" title="Youtube"><i class="icon-youtube"></i></a>
            </div><!-- End .social-icons -->
        </div><!-- End .mobile-menu-wrapper -->
    </div><!-- End .mobile-menu-container -->

    <!-- Sign in / Register Modal -->
    <div class="modal fade" id="signin-modal" tabindex="-1" role="dialog" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered" role="document">
            <div class="modal-content">
                <div class="modal-body">
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true"><i class="icon-close"></i></span>
                    </button>

                    <div class="form-box">
                        <div class="form-tab">
                            <ul class="nav nav-pills nav-fill" role="tablist">
                                <li class="nav-item">
                                    <a class="nav-link active" id="signin-tab" data-toggle="tab" href="#signin" role="tab" aria-controls="signin" aria-selected="true">Sign In</a>
                                </li>
                                <li class="nav-item">
                                    <a class="nav-link" id="register-tab" data-toggle="tab" href="#register" role="tab" aria-controls="register" aria-selected="false">Register</a>
                                </li>
                            </ul>
                            <div class="tab-content" id="tab-content-5">
                                <div class="tab-pane fade show active" id="signin" role="tabpanel" aria-labelledby="signin-tab">
                                    <form action="#">
                                        <div class="form-group">
                                            <label for="singin-email">Username or email address *</label>
                                            <input type="text" class="form-control" id="singin-email" name="singin-email" required>
                                        </div><!-- End .form-group -->

                                        <div class="form-group">
                                            <label for="singin-password">Password *</label>
                                            <input type="password" class="form-control" id="singin-password" name="singin-password" required>
                                        </div><!-- End .form-group -->

                                        <div class="form-footer">
                                            <button type="submit" class="btn btn-outline-primary-2">
                                                <span>LOG IN</span>
                                                <i class="icon-long-arrow-right"></i>
                                            </button>

                                            <div class="custom-control custom-checkbox">
                                                <input type="checkbox" class="custom-control-input" id="signin-remember">
                                                <label class="custom-control-label" for="signin-remember">Remember Me</label>
                                            </div><!-- End .custom-checkbox -->

                                            <a href="#" class="forgot-link">Forgot Your Password?</a>
                                        </div><!-- End .form-footer -->
                                    </form>
                                    <div class="form-choice">
                                        <p class="text-center">or sign in with</p>
                                        <div class="row">
                                            <div class="col-sm-6">
                                                <a href="#" class="btn btn-login btn-g">
                                                    <i class="icon-google"></i>
                                                    Login With Google
                                                </a>
                                            </div><!-- End .col-6 -->
                                            <div class="col-sm-6">
                                                <a href="#" class="btn btn-login btn-f">
                                                    <i class="icon-facebook-f"></i>
                                                    Login With Facebook
                                                </a>
                                            </div><!-- End .col-6 -->
                                        </div><!-- End .row -->
                                    </div><!-- End .form-choice -->
                                </div><!-- .End .tab-pane -->
                                <div class="tab-pane fade" id="register" role="tabpanel" aria-labelledby="register-tab">
                                    <form action="#">
                                        <div class="form-group">
                                            <label for="register-email">Your email address *</label>
                                            <input type="email" class="form-control" id="register-email" name="register-email" required>
                                        </div><!-- End .form-group -->

                                        <div class="form-group">
                                            <label for="register-password">Password *</label>
                                            <input type="password" class="form-control" id="register-password" name="register-password" required>
                                        </div><!-- End .form-group -->

                                        <div class="form-footer">
                                            <button type="submit" class="btn btn-outline-primary-2">
                                                <span>SIGN UP</span>
                                                <i class="icon-long-arrow-right"></i>
                                            </button>

                                            <div class="custom-control custom-checkbox">
                                                <input type="checkbox" class="custom-control-input" id="register-policy" required>
                                                <label class="custom-control-label" for="register-policy">I agree to the <a href="#">privacy policy</a> *</label>
                                            </div><!-- End .custom-checkbox -->
                                        </div><!-- End .form-footer -->
                                    </form>
                                    <div class="form-choice">
                                        <p class="text-center">or sign in with</p>
                                        <div class="row">
                                            <div class="col-sm-6">
                                                <a href="#" class="btn btn-login btn-g">
                                                    <i class="icon-google"></i>
                                                    Login With Google
                                                </a>
                                            </div><!-- End .col-6 -->
                                            <div class="col-sm-6">
                                                <a href="#" class="btn btn-login  btn-f">
                                                    <i class="icon-facebook-f"></i>
                                                    Login With Facebook
                                                </a>
                                            </div><!-- End .col-6 -->
                                        </div><!-- End .row -->
                                    </div><!-- End .form-choice -->
                                </div><!-- .End .tab-pane -->
                            </div><!-- End .tab-content -->
                        </div><!-- End .form-tab -->
                    </div><!-- End .form-box -->
                </div><!-- End .modal-body -->
            </div><!-- End .modal-content -->
        </div><!-- End .modal-dialog -->
    </div><!-- End .modal -->

    <!-- Plugins JS File -->
    <script src="assets/js/jquery.min.js"></script>
    <script src="assets/js/bootstrap.bundle.min.js"></script>
    <script src="assets/js/jquery.hoverIntent.min.js"></script>
    <script src="assets/js/jquery.waypoints.min.js"></script>
    <script src="assets/js/superfish.min.js"></script>
    <script src="assets/js/owl.carousel.min.js"></script>
    <script src="assets/js/bootstrap-input-spinner.js"></script>
    <script src="assets/js/jquery.elevateZoom.min.js"></script>
    <script src="assets/js/bootstrap-input-spinner.js"></script>
    <script src="assets/js/jquery.magnific-popup.min.js"></script>
    <!-- Main JS File -->
    <script src="assets/js/main.js"></script>
</body>


<!-- molla/product.html  22 Nov 2019 09:55:05 GMT -->
</html>`
            $('#drawHTML').html(content);
        }
    })
    event.preventDefault();
}

// $(document).ready(function () {
//     showViewProductDetail();
// })

function viewCart() {

    let danhSachItem = layDanhSachItemGioHang();
    total = 0;
    for (let i = 0; i < danhSachItem.length; i++) {
        let price = danhSachItem[i].giaSanPham;
        let quantity = danhSachItem[i].soLuong;
        let amount = price * quantity;
        total += amount;
    }
    let content = `${total} VNĐ`
    $('#total-1').html(content)

    let conten = '';
    for (let i = 0; i < danhSachItem.length; i++) {
        let price = danhSachItem[i].giaSanPham;
        let quantity = danhSachItem[i].soLuong;
        let amount = price * quantity;
        conten += `\t<tr>
\t\t\t\t\t\t\t\t\t\t\t<td class="product-col">
\t\t\t\t\t\t\t\t\t\t\t\t<div class="product">
\t\t\t\t\t\t\t\t\t\t\t\t\t<figure class="product-media">
\t\t\t\t\t\t\t\t\t\t\t\t\t\t<a href="#">
\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t<img src="http://localhost:8080/image/${danhSachItem[i].image}" alt="Product image">
\t\t\t\t\t\t\t\t\t\t\t\t\t\t</a>
\t\t\t\t\t\t\t\t\t\t\t\t\t</figure>

\t\t\t\t\t\t\t\t\t\t\t\t\t<h3 class="product-title">
\t\t\t\t\t\t\t\t\t\t\t\t\t\t<a href="#">${danhSachItem[i].nameSanPham}</a>
\t\t\t\t\t\t\t\t\t\t\t\t\t</h3><!-- End .product-title -->
\t\t\t\t\t\t\t\t\t\t\t\t</div><!-- End .product -->
\t\t\t\t\t\t\t\t\t\t\t</td>
\t\t\t\t\t\t\t\t\t\t\t<td class="price-col">${danhSachItem[i].giaSanPham}đ</td>
\t\t\t\t\t\t\t\t\t\t\t<td class="quantity-col">
                                                <div class="cart-product-quantity">
                                                    <p>${danhSachItem[i].soLuong}</p>
                                                </div><!-- End .cart-product-quantity -->
                                            </td>
\t\t\t\t\t\t\t\t\t\t\t<td class="total-col">${amount}đ</td>
<!--\t\t\t\t\t\t\t\t\t\t\t<td class="remove-col"><button class="btn-remove" type="button" onclick="removeItemlocoStorate()"><i class="icon-close"></i></button></td>-->
\t\t\t\t\t\t\t\t\t\t</tr>`
    }
    $('#itemDetail').html(conten);
}

$(document).ready(function () {
    viewCart();
})

function xoacart() {
    localStorage.removeItem(keyLocolstorateItemGioHang);
}

function checkout() {
    let danhSachItem = layDanhSachItemGioHang();
    total = 0;
    for (let i = 0; i < danhSachItem.length; i++) {
        let price = danhSachItem[i].giaSanPham;
        let quantity = danhSachItem[i].soLuong;
        let amount = price * quantity;
        total += amount;
    }
    let content = `${total} VND`
    $('#total-2').html(content)

    let conten = '';
    for (let i = 0; i < danhSachItem.length; i++) {
        let price = danhSachItem[i].giaSanPham;
        let quantity = danhSachItem[i].soLuong;
        let amount = price * quantity;
        conten += `<tr><td><a href="#">${danhSachItem[i].nameSanPham}</a></td><td>${amount} VND</td></tr>`
    }
    $('#itemOnCheck').html(conten);
}

$(document).ready(function () {
    checkout();
})

function onclickCheckOut() {
    let danhSachItem = layDanhSachItemGioHang();
    if (currentUser == null) {
        let content = `Please login first!!!`
        $('#thongbaomuahang').html(content);
    } else {
        let date = new Date();
        let code = `DH${date.getMilliseconds()}`
        let receiver = $('#receiverKH').val();
        let address = $('#addressKH').val();
        let email = $('#emailKH').val();
        let phoneNumber = $('#phoneNumberKH').val();
        let bill = {
            code: code,
            receiver: receiver,
            address: address,
            email: email,
            phoneNumber: phoneNumber,
            user: {
                id: currentUser.id
            }
        }
        $.ajax({
            type: 'POST',
            url: 'http://localhost:8080/bills',
            data: JSON.stringify(bill),
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + currentUser.token,
            },
        });
        for (let i = 0; i < danhSachItem.length; i++) {
            let name = danhSachItem[i].nameSanPham;
            let price = danhSachItem[i].giaSanPham;
            let quantity = danhSachItem[i].soLuong;
            let bill_detail = {
                code: code,
                name: name,
                quantity: quantity,
                price: price
            }
            $.ajax({
                type: 'POST',
                url: 'http://localhost:8080/bill_details',
                data: JSON.stringify(bill_detail),
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + currentUser.token,
                },
            });
        }
        location.href = "/case4_FE/indexmau.html";
        localStorage.removeItem(keyLocolstorateItemGioHang);

        let commentProduct = $('#commentProduct').val();
        let comment = {
            name: currentUser.username,
            comment: commentProduct
        }
        $.ajax({
            type: 'POST',
            url: 'http://localhost:8080/comments',
            data: JSON.stringify(comment),
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + currentUser.token,
            },
        })
    }
}

function showAllComment() {
    $.ajax({
        type: 'GET',
        url: `http://localhost:8080/comments`,
        headers: {
            'Authorization': 'Bearer ' + currentUser.token
        },
        success: function (data) {
            let content = '';
            for (let i = 0; i < data.length; i++) {
                content += `    <div class="review">
                                <div class="row no-gutters">
                                    <div class="col-auto">
                                        <h4><a href="#">${data[i].name}</a></h4>
                                        <div class="ratings-container">
                                            <div class="ratings">
                                                <div class="ratings-val" style="width: 80%;"></div>
                                                <!-- End .ratings-val -->
                                            </div><!-- End .ratings -->
                                        </div><!-- End .rating-container -->
                                    </div><!-- End .col -->
                                    <div class="col">
                                        <div class="review-content">
                                            <p>${data[i].comment}</p>
                                        </div><!-- End .review-content -->
                                    </div><!-- End .col-auto -->
                                </div><!-- End .row -->
                            </div><!-- End .review -->`
            }
            $('#commentAll').html(content);
        }
    })
}

$(document).ready(function () {
    showAllComment();
})








