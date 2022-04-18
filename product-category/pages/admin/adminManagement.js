let currentUser = localStorage.getItem('currentUser');
currentUser = JSON.parse(currentUser);

function showNameUser(){
    let nameUser = "";
    nameUser = `<p class="d-block" href="#" style="color: white">Chào ${currentUser.username}</p>`
    $('#name-admin').html(nameUser);
}
$(document).ready(function () {
    showNameUser();
})

function getUserByPage(page) {
    $.ajax({
        type: 'GET',
        url: `http://localhost:8080/users/?page=${page}`,
        headers: {
            'Authorization': 'Bearer ' + currentUser.token
        },
        success: function (data) {
            let content = '';
            let users = data.content;
            for (let i = 0 ; i < users.length; i++) {
                content += `<tr>
        <td>${i}</td>
        <td>${users[i].username}</td>
        <td>${users[i].fullName}</td>
        <td>${users[i].email}</td>
        <td>${users[i].phoneNumber}</td>
   <td>${users[i].role != null ? users[i].role : "-"}</td>
           <td><button class="btn btn-primary" data-target="#create-product" data-toggle="modal"
                                        type="button" onclick="showEditUser(${users[i].id})"><i class="fa fa-edit"></i></button></td>
        <td><button class="btn btn-danger" data-target="#delete-product" data-toggle="modal"
                                        type="button" onclick="showDeleteUser(${users[i].id})"><i class="fa fa-trash"></i></button></td>
    </tr>`
            }
            $('#user-list-content').html(content);
            let page = `<button class="btn btn-primary" id="backup" onclick=" getUserByPage(${data.pageable.pageNumber}-1)">Previous</button>
    <span>${data.pageable.pageNumber + 1} | ${data.totalPages}</span>
    <button class="btn btn-primary" id="next" onclick=" getUserByPage(${data.pageable.pageNumber}+1)">Next</button>`
            $('#user-list-page').html(page);
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

function findUserByName() {
    let q = $('#q').val();
    $.ajax({
        type: 'GET',
        url: `http://localhost:8080/users/viewUserByName/?q=${q}`,
        headers: {
            'Authorization': 'Bearer ' + currentUser.token
        },
        success: function (users) {
            let content = '';
                content += `<tr>
       <td>#</td>
        <td>${users.username}</td>
        <td>${users.fullName}</td>
        <td>${users.email}</td>
        <td>${users.phoneNumber}</td>
   <td>${users.role != null ? users.role : "-"}</td>
   <td><button class="btn btn-primary" data-target="#create-product" data-toggle="modal"
                                        type="button" onclick="showEditUser(${users.id})"><i class="fa fa-edit"></i></button></td>
        <td><button class="btn btn-danger" data-target="#delete-product" data-toggle="modal"
                                        type="button" onclick="showDeleteUser(${users.id})"><i class="fa fa-trash"></i></button></td>
    </tr>`
            $('#user-list-content').html(content);
        }
    })
    event.preventDefault();
}

function deleteUser(id) {
    $.ajax({
        type: 'DELETE',
        url: `http://localhost:8080/users/${id}`,
        headers: {
            'Authorization': 'Bearer ' + currentUser.token
        },
        success: function () {
            getUserByPage();
            showSuccessMessage('Xóa thành công!');
        },
        error: function () {
            showErrorMessage('Xóa lỗi');
        }
    })
}

function showDeleteUser(id) {
    let content = `<button class="btn btn-secondary" data-dismiss="modal" type="button">Đóng</button>
                    <button class="btn btn-danger" onclick="deleteUser(${id})" type="button" aria-label="Close" class="close" data-dismiss="modal">Xóa</button>`;
    $('#footer-delete').html(content);
}

$(document).ready(function () {
    getUserByPage();
})

function showEditUser(id) {
    let title = 'Khóa tài khoản';
    let footer = `<button class="btn btn-secondary" data-dismiss="modal" type="button">Đóng</button>
                    <button class="btn btn-primary" onclick="editUser(${id})" type="button" aria-label="Close" class="close" data-dismiss="modal">Cập nhật</button>`;
    $('#create-user-title').html(title);
    $('#create-user-footer').html(footer);
    $.ajax({
        type: 'GET',
        url: `http://localhost:8080/users/${id}`,
        headers: {
            'Authorization': 'Bearer ' + currentUser.token
        },
        success: function (user) {
            $('#roleuser').val(user.role);
        }
    })
}

function editUser(id) {
    let role = $('#roleuser').val();
    let user = {
        role: role
    }
    $.ajax({
        type: 'PUT',
        url: `http://localhost:8080/users/${id}`,
        data: JSON.stringify(user),
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + currentUser.token
        },
        success: function () {
            getUserByPage();
            showSuccessMessage('Sửa thành công!');
        },
        error: function () {
            showErrorMessage('Sửa lỗi!');
        }
    })
}

function exitAdmin() {
    localStorage.removeItem('currentUser');
    location.href = "/case4_FE/indexmau.html";
}