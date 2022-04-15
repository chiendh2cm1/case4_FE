let currentUser = localStorage.getItem('currentUser');
currentUser = JSON.parse(currentUser);// ep chuoi ve doi tuong

function showNameUser() {
    let nameUser = "";
    if (currentUser.username != null) {
        nameUser = `<p style="color: black">Hello ${currentUser.username} /<a onclick="doLogout()">Sign out</a></p>`
    } else {
        nameUser = `<a href="#signin-modal" data-toggle="modal">Sign in / Sign up</a>`
    }
    $('#name-user').html(nameUser);
}

$(document).ready(function () {
    showNameUser();
})

function getProductByPage(page) {
    $.ajax({
        type: 'GET',
        url: `http://localhost:8080/products?page=${page}`,
        success: function (data) {
            let content = '';
            let products = data.content;
            content += showLishProduct(products);
            $('#product-body').html(content);
            let page = `<button class="btn btn-primary" id="backup" onclick="getProductByPage(${data.pageable.pageNumber}-1)">Previous</button>
    <span>${data.pageable.pageNumber + 1} | ${data.totalPages}</span>
    <button class="btn btn-primary" id="next" onclick="getProductByPage(${data.pageable.pageNumber}+1)">Next</button>`
            $('#product-list-page').html(page);
            if (data.pageable.pageNumber === 0) {
                document.getElementById("backup").hidden = true
            }
            if (data.pageable.pageNumber + 1 === data.totalPages) {
                document.getElementById("next").hidden = true
            }
        }
    })
    event.preventDefault();
}

function findProductByName(page) {
    let q = $('#q').val();
    $.ajax({
        type: 'GET',
        url: `http://localhost:8080/products?q=${q}&page=${page}`,
        success: function (data) {
            let content = '';
            let products = data.content;
            content += showLishProduct(products);
            $('#product-body').html(content);
            let page = `<button class="btn btn-primary" id="backup" onclick="getProductByPage(${data.pageable.pageNumber}-1)">Previous</button>
    <span>${data.pageable.pageNumber + 1} | ${data.totalPages}</span>
    <button class="btn btn-primary" id="next" onclick="getProductByPage(${data.pageable.pageNumber}+1)">Next</button>`
            $('#product-list-page').html(page);
            if (data.pageable.pageNumber === 0) {
                document.getElementById("backup").hidden = true
            }
            if (data.pageable.pageNumber + 1 === data.totalPages) {
                document.getElementById("next").hidden = true
            }
        }
    })
    event.preventDefault();
}
