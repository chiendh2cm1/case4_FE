

function login() {
    $('#phonenumber').val(null);
    let username = $('#singin-email').val();
    let password = $('#singin-password').val();
    let user = {
        username: username,
        password: password
    }
    $.ajax({
        type: 'POST',
        url: 'http://localhost:8080/login',
        data: JSON.stringify(user),
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        success: function (data) {
            localStorage.setItem('currentUser', JSON.stringify(data));
            if (data.roles[0].authority === "ROLE_ADMIN") {
                location.href = "/case4_FE/product-category/pages/admin/admin.html"
            } else if (data.roles[0].authority === "ROLE_USER") {
                location.href = "/case4_FE/indexmau.html"
            } else if (data.roles[0].authority === "ROLE_SELLER") {
                location.href = "/case4_FE/product-category/index.html"
            }
        }
    });
}

function doLogout() {
    localStorage.removeItem('currentUser');
    location.href = "/case4_FE/indexmau.html";
}