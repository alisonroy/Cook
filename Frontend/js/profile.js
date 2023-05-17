$(document).ready(function () {
  $.ajax({
    type: "POST",
    url: "https://cook-5vyv.onrender.com/gethistory",
    datatype: "html",
    data: {
      email: localStorage.getItem("email"),
    },
    success: function (response) {
      console.log(response);
      var area = document.getElementById("history");
      area.innerHTML = "";
      var div = document.createElement("div");
      div.classList.add("columns", "w-row", "bg-card-clr");
      var divin = document.createElement("div");
      divin.classList.add("w-col", "w-col-12");
      var h1 = document.createElement("h1");
      h1.classList.add("heading-8", "txtclr");
      h1txt = document.createTextNode("History");
      var p = document.createElement("p");
      p.classList.add("paragraph-4", "txtclr");
      p.innerHTML =
        "Email:" +
        response[0][0] +
        "<br/>Name:" +
        response[0][1] +
        "<br/>Phone Number:" +
        response[0][2] +
        "<br> Searched Dishes: " +
        response[0][3];

      h1.appendChild(h1txt);
      divin.appendChild(h1);
      divin.appendChild(p);
      div.appendChild(divin);
      area.appendChild(div);
    },
    error: function (error) {},
  });
});
