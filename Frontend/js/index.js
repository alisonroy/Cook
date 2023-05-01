let canvas = document.querySelector("#canvas");
let context = canvas.getContext("2d");
let video = document.querySelector("#video");
if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
  navigator.mediaDevices.getUserMedia({ video: true }).then((stream) => {
    video.srcObject = stream;
    video.play();
  });
}
document.getElementById("snap").addEventListener("click", () => {
  context.drawImage(video, 0, 0, 250, 200);
});

document.getElementById("getrec").addEventListener("click", (event) => {
  event.preventDefault();
  var ref = canvas.toDataURL("image/jpg");
  $.ajax({
    type: "POST",
    url: "https://cook-5vyv.onrender.com/getrecipe",
    datatype: "html",
    data: {
      img: ref,
    },
    success: function (response) {
      var area = document.getElementById("recipes");
      area.innerHTML = "";
      for (var i = 0; i < response.length; i++) {
        var div = document.createElement("div");
        div.classList.add("columns", "w-row");
        var divin = document.createElement("div");
        divin.classList.add("w-col", "w-col-12");
        var h1 = document.createElement("h1");
        h1.classList.add("heading-8");
        h1txt = document.createTextNode(response[i][0]);
        var p = document.createElement("p");
        p.classList.add("paragraph-4");
        p.innerHTML =
          "Cuisine:" +
          response[i][2] +
          "<br/>Ingredients:" +
          response[i][3] +
          "<br/>Cook Time:" +
          response[i][1] +
          "<br> Recipe: " +
          response[i][4];

        h1.appendChild(h1txt);
        divin.appendChild(h1);
        divin.appendChild(p);
        div.appendChild(divin);
        area.appendChild(div);
      }
    },
    error: function (error) {},
  });
});
