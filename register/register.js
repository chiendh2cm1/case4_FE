function register() {
    let fullname = $('#fullname').val();
    let username = $('#username').val();
    let password = $('#register-password').val();
    let email = $('#email').val();
    let phonenumber = $('#phonenumber').val();
    let role = $('#role').val();
    let user = {
        username: username,
        fullName:fullname,
        password: password,
        email:email,
        phoneNumber: phonenumber,
        role: role
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
            let inner = `<span class="form_icon">
                              Created Account !!! 
                         </span>`
            $("#register-success").html(inner);
        },
    })
    $('#fullname').val(null);
    $('#username').val(null);
    $('#register-password').val(null);
    $('#email').val(null);
    $('#phonenumber').val(null);
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
