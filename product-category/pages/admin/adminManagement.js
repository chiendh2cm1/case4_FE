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
            for (let i = 1 ; i < users.length; i++) {
                content += `<tr>
        <td>${i + 1}</td>
        <td>${users[i].username}</td>
        <td>${users[i].fullName}</td>
        <td>${users[i].email}</td>
        <td>${users[i].phoneNumber}</td>
   <td>${users[i].role != null ? users[i].role : "-"}</td>
        <td><button class="btn btn-danger" data-target="#delete-product" data-toggle="modal"
                                        type="button" onclick="showDeleteUser(${users[i].id})"><i class="fa fa-trash"></i></button></td>
    </tr>`
            }
            $('#user-list-content').html(content);
            let page = `<button class="btn btn-primary" id="backup" onclick="getProductByPage(${data.pageable.pageNumber}-1)">Previous</button>
    <span>${data.pageable.pageNumber + 1} | ${data.totalPages}</span>
    <button class="btn btn-primary" id="next" onclick="getProductByPage(${data.pageable.pageNumber}+1)">Next</button>`
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
