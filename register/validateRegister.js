function checkFullName() {
    let fullName = $("#fullname").val();
    if (fullName === "") {
        $("#checked-fullName").html("*Name is not valid")
    } else {
        $("#checked-fullName").html("")
    }
}

function checkEmail() {
    let email = $("#email").val();
    let regex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
    let res = email.match(regex)
    if (res == null) {
        $("#checked-email").html("*Email is not valid")
    } else {
        $("#checked-email").html("")
    }
    if (phone === "") {
        $("#checked-email").html("*Name is not valid")
    }
}

function checkPhone() {
    let phone = $("#phonenumber").val();
    let regex = /^[0-9]{10,11}$/;
    let res = regex.exec(phone)
    if (res == null) {
        $("#checked-phone").html("*Phone is not valid")
    } else {
        $("#checked-phone").html("")
    }
    if (phone === "") {
        $("#checked-phone").html("*Name is not valid")
    }
}

function checkUserName() {
    let username = $("#username").val();
    const res = /^[a-z0-9_\.]{6,18}$/.exec(username);
    if (res == null) {
        $("#checked-username").html("*User name is not valid")
    } else {
        $("#checked-username").html("")
    }
    if (username === "") {
        $("#checked-username").html("*Name is not valid")
    }
    let user = {
        username: username
    }
    $.ajax({
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        url: 'http://localhost:8080/users/validated/username',
        data: JSON.stringify(user),
        type: "POST",
        success: function (data) {
            if (data.username != null) {
                $("#checked-username").html("Username is used")
            }
        }
    })
}

function checkPassWord() {
    let password = $("#register-password").val();
    if (password.length < 6 || password.length > 16) {
        $("#checked-password").html("*Password is too short or long. Password is between 6 - 16 characters");
    } else {
        $("#checked-password").html("")
    }
    if (password === "*Name is not valid") {
    }
}