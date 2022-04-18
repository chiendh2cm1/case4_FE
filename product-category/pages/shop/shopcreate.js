let currentUser = localStorage.getItem('currentUser');
currentUser = JSON.parse(currentUser);// ep chuoi ve doi tuong
function showNameUser() {
    let nameUser = "";
    nameUser = `<p class="d-block" href="#" style="color: white">Chào ${currentUser.username}</p>`
    $('#name-admin').html(nameUser);
}

$(document).ready(function () {
    showNameUser();
})

function showbuttoncreate(){
        content = "";
        $('#adddd-new-event').html(content);
}

function showShop() {
    $.ajax({
            Type: 'GET',
            url: `http://localhost:8080/shops/findShopByUser/${currentUser.id}`,
            headers: {
                'Authorization': 'Bearer ' + currentUser.token
            },
            success: function (data) {
                let content = '';
                content += `<tr>
        <td>#</td>
        <td>${data.name}</td>
        <td>${data.description}</td>
    </tr>`
                $('#shop-list-content').html(content);
            }
        }
    )
}

function showCreateShop() {
    let title = 'Nhập thông tin Shop';
    let footer = `   <button class="btn btn-secondary" data-dismiss="modal" type="button">Đóng</button>
                    <button class="btn btn-primary" onclick="createNewShop()" type="button" aria-label="Close" class="close" data-dismiss="modal">Tạo mới</button>`;
    $('#create-shop-title').html(title);
    $('#create-shop-footer').html(footer);
    $(`#name`).val(null);
}

function createNewShop() {
    showbuttoncreate()
    let nameshop = $('#nameshop').val();
    let descriptionshop = $('#descriptionshop').val();
    let shop = {
        name: nameshop,
        description: descriptionshop,
        user: {
            id: `${currentUser.id}`
        }
    }
    $.ajax({
        type: 'POST',
        url: 'http://localhost:8080/shops',
        data: JSON.stringify(shop),
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + currentUser.token,
        },
        success: function () {
            showShop();
            showSuccessMessage('Tạo thành công!');
        },
        error: function () {
            showErrorMessage('Tạo lỗi!');
        }
    })
}

$(document).ready(function () {
    showShop()();
})




