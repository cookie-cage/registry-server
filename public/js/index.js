$(function () {
    $('#login-form-link').click(function (e) {
        $("#login-form").delay(100).fadeIn(100);
        $("#register-form").fadeOut(100);
        $('#register-form-link').removeClass('active');
        $(this).addClass('active');
        e.preventDefault();
    });

    $('#register-form-link').click(function (e) {
        $("#register-form").delay(100).fadeIn(100);
        $("#login-form").fadeOut(100);
        $('#login-form-link').removeClass('active');
        $(this).addClass('active');
        e.preventDefault();
    });

    $("#register-form").submit(function (e) {
        e.preventDefault();
        var thisForm = $(this);
        var endpoint = '/user/';
        var email = $('#register-email').val();
        var password = $('#register-password').val();
        var data = JSON.stringify({
            'username': $('#register-username').val(),
            'email': email,
            'password': password
        });

        fetch(endpoint, {
            method: 'POST',
            mode: 'cors',
            redirect: 'follow',
            body: data,
            headers: new Headers({
                'Content-Type': 'application/json; charset=utf-8'
            })
        })
        .then(function (response) {
            return response.json();
        })
        .then(function (json) {

            if (json.error) {
                alert(json.error.message);
            }

            if (json.message == 'success') {
                $("#login-email").val(email);
                $("#login-password").val(password);
                $("#login-form").submit();
            }
        });

    });


    $("#login-form").submit(function (e) {
        e.preventDefault();
        var thisForm = $(this);
        var endpoint = '/session/';
        var data = JSON.stringify({
            'email': $('#login-email').val(),
            'password': $('#login-password').val()
        });

        fetch(endpoint, {
            method: 'POST',
            mode: 'cors',
            redirect: 'follow',
            body: data,
            headers: new Headers({
                'Content-Type': 'application/json; charset=utf-8'
            })
        })
            .then(function (response) {
                return response.json();
            })
            .then(function (json) {
                if (json.error) {
                    alert(json.error.message);
                }

                if (json.session) {
                    document.cookie = "session=" + json.session;
                    document.cookie = "email=" + json.email;
                    document.cookie = "username=" + json.username;
                    location.href = "/editor.html"
                }
            });

    });





var getJSON = function(url) {
  return new Promise(function(resolve, reject) {
    var xhr = new XMLHttpRequest();
    xhr.open('get', url, true);
    xhr.responseType = 'json';
    xhr.onload = function() {
      var status = xhr.status;
      if (status == 200) {
        resolve(xhr.response);
      } else {
        reject(status);
      }
    };
    xhr.send();
  });
};

getJSON('/stats').then(function(data) {
    $("#user-counter").text(data.userCount)
    $("#resume-counter").text(data.resumeCount)
    $("#views-counter").text(data.views)
    result.innerText = data.result; //display the result in an HTML element
}, function(status) { //error detection....
  alert('Something went wrong.');
}); 





});



