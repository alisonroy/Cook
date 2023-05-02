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
console.log("tes");
$("body").on("click", ".tts", function () {
  let speech = new SpeechSynthesisUtterance();
  speech.lang = "en";
  speech.text = $(this).val();
  window.speechSynthesis.speak(speech);
});
$("body").on("click", ".pause", function () {
  window.speechSynthesis.pause();
});
$("body").on("click", ".resume", function () {
  window.speechSynthesis.resume();
});
$("body").on("click", ".cancel", function () {
  window.speechSynthesis.cancel();
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
        var b1 = document.createElement("button");
        b1.type = "button";
        b1.classList.add("tts");
        b1.value =
          "Cuisine:" +
          response[i][2] +
          "Ingredients:" +
          response[i][3] +
          "Cook Time:" +
          response[i][1] +
          "Recipe: " +
          response[i][4];
        b1txt = document.createTextNode("Read it Out!!!");
        b1.append(b1txt);
        var b2 = document.createElement("button");
        b2.type = "button";
        b2.classList.add("ttsb", "resume");
        b2txt = document.createTextNode("Resume");
        b2.append(b2txt);
        var b3 = document.createElement("button");
        b3.type = "button";
        b3.classList.add("ttsb", "pause");
        b3txt = document.createTextNode("Pause");
        b3.append(b3txt);
        var b4 = document.createElement("button");
        b4.type = "button";
        b4.classList.add("ttsb", "cancel");
        b4txt = document.createTextNode("Cancel");
        b4.append(b4txt);

        h1.appendChild(h1txt);
        divin.appendChild(h1);
        divin.appendChild(p);
        divin.appendChild(b1);
        divin.appendChild(b2);
        divin.appendChild(b3);
        divin.appendChild(b4);
        div.appendChild(divin);
        area.appendChild(div);
      }
    },
    error: function (error) {},
  });
});
