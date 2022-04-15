function register() {
    let username = $('#username').val();
    let password = $('#password').val();
    let confirmPassword = $('#confirm-password').val();
    let user = {
        username: username,
        password: password,
        confirmPassword: confirmPassword
    }
    $.ajax({
        type: 'POST',
        url: 'http://localhost:8080/register',
        data: JSON.stringify(user),
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        success: function () {
            location.href = '/btvv--ajax/pages/auth/login.html';
        },
        error: function () {
            showErrorMessage('Xảy ra lỗi!')
        }
    })
}
function checkUserName(){
    let username = $("#username").val();
    const res = /^[a-z0-9_\.]{6,18}$/.exec(username);
    if(res == null) {
        $("#checked-username").text("*User name is not valid")
    }else {
        $("#checked-username").text("")
    }
    if(username === "") {
        $("#checked-username").text("")
    }

    let user = {
        username : username
    }
    $.ajax({
        headers: {
            'Accept' : 'application/json',
            'Content-Type' : 'application/json'
        },
        url: 'http://localhost:8080//validated/username',
        data : JSON.stringify(user),
        type : "POST",
        success: function (data) {
            if(data.username != null) {
                $("#checked-username").text("Username is used")
            }
        }
    })
}

function checkPassword(){
    let password = $("#password").val();
    if (password.length < 6 || password.length > 16) {
        $("#checked-password").text("*Password is between 6 - 16 characters") ;
    }else {
        $("#checked-password").text("")
    }
}
function  checkConfirmPassword(){
    let confirmPassword = $("#confirm-password").val();
    let password = $("#password").val();
    if (confirmPassword !== password){
        $("#checked-confirm-password").text("not true")
    }else {
        $("#checked-confirm-password").text("")
    }
}