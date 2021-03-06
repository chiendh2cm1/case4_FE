let currentUser = localStorage.getItem('currentUser');
currentUser = JSON.parse(currentUser);

function showNameUser() {
    let nameUser = "";
    nameUser = `<p class="d-block" href="#" style="color: white">Chào ${currentUser.username}</p>`
    $('#name-admin').html(nameUser);
}

$(document).ready(function () {
    showNameUser();
})

function getAllBill() {
    $.ajax({
        url: `http://localhost:8080/bills`,
        type: 'GET',
        headers: {
            'Authorization': 'Bearer ' + currentUser.token
        },
        success: function (bills) {
            let content = '';
            for (let i = 0; i < bills.length; i++) {
                content += `<tr>
        <td>${i + 1}</td>
        <td>${bills[i].code}</td>
        <td>${bills[i].receiver}</td>
        <td>${bills[i].address}</td>
        <td>${bills[i].email}</td>
        <td>${bills[i].phoneNumber}</td>
         <td><button class="btn btn-primary" 
                                      type="button" onclick="showDetailBill(${bills[i].id})"><i class="fa fa-street-view"></i></button></td>
        <td><button class="btn btn-danger" data-target="#delete-bill" data-toggle="modal"
                                        type="button" onclick="showDeleteBill(${bills[i].id})"><i class="fa fa-trash"></i></button></td>
    </tr>`
            }
            $('#bill-list-content').html(content);
        }
    })
}

function showDetailBill(id) {
    $.ajax({
        type: 'GET',
        url: `http://localhost:8080/bills/${id}`,
        success: function (data) {
            let button = ` <a href="/case4_FE/product-category/pages/bill/bill.html">Quay lại</a>`;
            $('#add-new-event').html(button);
            let head = ` <tr>
                                        <th>#</th>
                                        <th>Tên sản phẩm</th>
                                        <th>Số lương</th>
                                        <th>Giá sản phẩm</th>

                                    </tr>`;
            $('#bill-head').html(head);
            $.ajax({
                type: 'GET',
                url: `http://localhost:8080/bill_details/detail/${data.code}`,
                success: function (data) {
                    let content = '';
                    let total = 0;
                    for (let i = 0; i < data.length; i++) {
                        let price = data[i].price;
                        let quantity = data[i].quantity;
                        let amount = price * quantity;
                        total += amount;
                    }
                    let conten = `_____________________Tổng tiền đơn hàng: ${total} VND__________________`
                    $('#totalbill').html(conten);
                    for (let i = 0; i < data.length; i++) {
                        content += `<tr>
        <td>${i}</td>
        <td>${data[i].name}</td>
        <td>${data[i].quantity}</td>
        <td>${data[i].price} đ</td>
        
    </tr>`
                    }
                    $('#bill-list-content').html(content);
                }
            })
        }
    })
    event.preventDefault();
}


function showDeleteBill(id) {
    let content = `<button class="btn btn-secondary" data-dismiss="modal" type="button">Đóng</button>
                    <button class="btn btn-danger" onclick="deleteBill(${id})" type="button" aria-label="Close" class="close" data-dismiss="modal">Xóa</button>`;
    $('#footer-delete').html(content);
}

function deleteBill(id) {
    $.ajax({
        type: 'GET',
        url: `http://localhost:8080/bills/${id}`,
        success: function (data) {
            $.ajax({
                type: 'DELETE',
                url: `http://localhost:8080/bill_details/${data.code}`,
            })
        }
    })
    $.ajax({
        type: 'DELETE',
        url: `http://localhost:8080/bills/${id}`,
        headers: {
            'Authorization': 'Bearer ' + currentUser.token
        },
        success: function () {

            getAllBill();
            showSuccessMessage('Xóa thành công!');
        },
        error: function () {
            showErrorMessage('Xóa lỗi');
        }
    })
}

$(document).ready(function () {
    getAllBill();
})

function exitAdmin() {
    localStorage.removeItem('currentUser');
    location.href = "/case4_FE/indexmau.html";
}
