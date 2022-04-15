
  let currentUser = localStorage.getItem('currentUser');
currentUser = JSON.parse(currentUser);// ep chuoi ve doi tuong
  function showNameUser(){
      let nameUser = "";
      nameUser = `<p class="d-block" href="#" style="color: white">Chào ${currentUser.username}</p>`
      $('#name-admin').html(nameUser);
  }
  $(document).ready(function () {
      showNameUser();
  })

function getAllCategory() {
    $.ajax({
        Type: 'GET',
        url: `http://localhost:8080/shops/viewByIdUser/${currentUser.id}`,
        headers: {
            'Authorization': 'Bearer ' + currentUser.token
        },
        success: function (categories) {
            let content = '';
            for (let i = 0; i < categories.length; i++) {
                content += `<tr>
        <td>${i + 1}</td>
        <td> <u onclick="showDetail(${categories[i].id})">${categories[i].name}</u></td>
    <td><button class="btn btn-primary" data-target="#create-category" data-toggle="modal"
                                        type="button" onclick="showEditCategory(${categories[i].id})"><i class="fa fa-edit"></i></button></td>
        <td><button class="btn btn-danger" data-target="#delete-category" data-toggle="modal"
                                        type="button" onclick="showDeleteCategory(${categories[i].id})"><i class="fa fa-trash"></i></button></td>
    </tr>`
            }
            $('#category-list-content').html(content);
        }
    })
}

function showDetail(id) {
    let button = ` <a href="category.html">Quay lại</a>`;
    $('#add-new-event').html(button);
    let head = ` <tr>
                                        <th>#</th>
                                        <th>Tên sản phẩm</th>
                                        <th>Giá sản phẩm</th>
                                        <th>Mô tả sản phẩm</th>
                                        <th>Ảnh sản phẩm</th>
                                    </tr>`;
    $('#category-head').html(head);
    $.ajax({
        type: 'GET',
        url: `http://localhost:8080/categories/view/${id}`,
        headers: {
            'Authorization': 'Bearer ' + currentUser.token
        },
        success: function (data) {
            let content = '';
            let products = data.content;
            for (let i = 0; i < products.length; i++) {
                content += `<tr>
        <td>${i + 1}</td>
        <td>${products[i].name}</td>
        <td>${products[i].price}</td>
        <td>${products[i].description}</td>
        <td><img src="http://localhost:8080/image/${products[i].image}" height="100"></td>
    </tr>`
            }
            $('#category-list-content').html(content);
        }
    })
    event.preventDefault();
}

function createNewCategory() {
    let name = $('#name').val();
    let category = {
        name: name
    }
    $.ajax({
        type: 'POST',
        url: 'http://localhost:8080/categories',
        data: JSON.stringify(category),
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + currentUser.token,
        },
        success: function () {
            getAllCategory();
            showSuccessMessage('Tạo thành công');
        },
        error: function () {
            showErrorMessage('Tạo lỗi');
        }
    })
}

function showSuccessMessage(message) {
    $(function () {
        var Toast = Swal.mixin({
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: 3000
        });

        Toast.fire({
            icon: 'success',
            title: message
        })
    });
}

function showErrorMessage(message) {
    $(function () {
        var Toast = Swal.mixin({
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: 3000
        });

        Toast.fire({
            icon: 'error',
            title: message
        })
    });
}

function showDeleteCategory(id) {
    let content = `<button class="btn btn-secondary" data-dismiss="modal" type="button">Đóng</button>
                    <button class="btn btn-danger" onclick="deleteCategory(${id})" type="button" aria-label="Close" class="close" data-dismiss="modal">Xóa</button>`;
    $('#footer-delete').html(content);
}


function showEditCategory(id) {
    let title = 'Chỉnh sửa thông tin danh mục';
    let footer = `<button class="btn btn-secondary" data-dismiss="modal" type="button">Đóng</button>
                    <button class="btn btn-primary" onclick="editCategory(${id})" type="button" aria-label="Close" class="close" data-dismiss="modal">Cập nhật</button>`;
    $('#create-category-title').html(title);
    $('#create-category-footer').html(footer);
    $.ajax({
        type: 'GET',
        url: `http://localhost:8080/categories/${id}`,
        headers: {
            'Authorization': 'Bearer ' + currentUser.token
        },
        success: function (category) {
            $('#name').val(category.name);
        }
    })
}

function showCreateCategory() {
    let title = 'Nhập thông tin sản phẩm';
    let footer = `   <button class="btn btn-secondary" data-dismiss="modal" type="button">Đóng</button>
                    <button class="btn btn-primary" onclick="createNewCategory()" type="button" aria-label="Close" class="close" data-dismiss="modal">Tạo mới</button>`;
    $('#create-category-title').html(title);
    $('#create-category-footer').html(footer);
    $(`#name`).val(null);
}


function editCategory(id) {
    let name = $('#name').val();
    let category = {
        name: name
    }
    $.ajax({
        type: 'PUT',
        url: `http://localhost:8080/categories/${id}`,
        data: JSON.stringify(category),
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + currentUser.token
        },
        success: function () {
            getAllCategory();
            showSuccessMessage('Sửa thành công!');
        },
        error: function () {
            showErrorMessage('Sửa lỗi!');
        }
    })
}

function deleteCategory(id) {
    $.ajax({
        type: 'DELETE',
        url: `http://localhost:8080/categories/${id}`,
        headers: {
            'Authorization': 'Bearer ' + currentUser.token
        },
        success: function () {
            getAllCategory();
            showSuccessMessage('Xóa thành công!');
            // $('#delete-product').hide();
        },
        error: function () {
            showErrorMessage('Xóa lỗi');
        }
    })
}

$(document).ready(function () {
    getAllCategory();
})