localStorage.clear();
$("#login-button").click(function (event) {
  event.preventDefault();
  $("#in-user").addClass("d-none");
  $("#in-pass").addClass("d-none");
  $("#verify").addClass("d-none");
  document.getElementById("login-button").innerHTML =
    ' <div class="spinner-dot"><div class="dot1"></div><div class="dot2"></div></div>';
  document.getElementById("login-button").disabled = true;
  var email = document.getElementById("user-log").value;
  var pass = document.getElementById("pass-log").value;
  $.ajax({
    type: "POST",
    url: "http://127.0.0.1:5000/login",
    datatype: "html",
    data: {
      email: email,
      pass: pass,
    },
    success: function (response) {
      if (response == "false") {
        document.getElementById("in-user").classList.remove("d-none");
        document.getElementById("login-button").innerHTML = "LOGIN";
        document.getElementById("login-button").disabled = false;
      } else {
        if (response == "failed") {
          document.getElementById("in-pass").classList.remove("d-none");
          document.getElementById("login-button").innerHTML = "LOGIN";
          document.getElementById("login-button").disabled = false;
        } else {
          localStorage.setItem("email", email);
          localStorage.setItem("auth_token", response);
          $("#form-login").fadeOut(500);
          $(".wrapper").addClass("form-success");
          setTimeout(() => {
            window.location.pathname = "/frontend/index.html";
          }, 5000);
        }
      }
    },
    error: function (error) {},
  });
});
$("#signup-button").click(function (event) {
  event.preventDefault();
  $("#field-check").addClass("d-none");
  $("#sign-unav").addClass("d-none");
  document.getElementById("signup-button").innerHTML =
    ' <div class="spinner-dot"><div class="dot1"></div><div class="dot2"></div></div>';
  document.getElementById("signup-button").disabled = true;
  if ($("#form-signup")[0].checkValidity()) {
    var name = document.getElementById("user-name").value;
    console.log(name);
    var email = document.getElementById("user-email").value;
    var ph_no = document.getElementById("user-phone").value;
    var pass = document.getElementById("pass-sign").value;
    var re_pass = document.getElementById("re-pass").value;

    if (pass === re_pass && pass.length >= 8) {
      $.ajax({
        type: "POST",
        url: "http://127.0.0.1:5000/signup",
        datatype: "html",
        data: {
          name: name,
          email: email,
          ph_no: ph_no,
          pass: pass,
        },
        success: function (response) {
          if (response != "failed") {
            localStorage.setItem("email", email);
            localStorage.setItem("auth_token", response);
            $("#form-signup").fadeOut(500);
            setTimeout(() => {
              document.getElementById("form-login").style.display = "block";
            }, 600);
          } else {
            document.getElementById("sign-unav").classList.remove("d-none");
            document.getElementById("signup-button").innerHTML = "SIGNUP";
            document.getElementById("signup-button").disabled = false;
          }
        },
        error: function (error) {},
      });
    } else {
      document.getElementById("signup-button").innerHTML = "SIGNUP";
      document.getElementById("signup-button").disabled = false;
      $("#pass-fail").removeClass("d-none");
    }
  } else {
    $("#field-check").removeClass("d-none");
    document.getElementById("signup-button").innerHTML = "SIGNUP";
    document.getElementById("signup-button").disabled = false;
  }
});

$("#signup-link").click(function (event) {
  event.preventDefault();
  $("#form-login").fadeOut(500);
  setTimeout(() => {
    document.getElementById("form-signup").style.display = "block";
  }, 600);
});
$("#login-link").click(function (event) {
  event.preventDefault();
  $("#form-signup").fadeOut(500);
  setTimeout(() => {
    document.getElementById("form-login").style.display = "block";
  }, 600);
});
