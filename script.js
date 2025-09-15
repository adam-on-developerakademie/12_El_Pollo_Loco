function startButton(){
  document.getElementById("header").classList.add("displayNone");
  document.getElementById("gameOver").classList.add("displayNone");
  document.getElementById("startScreen").classList.add("displayNone");
  document.getElementById("footer").classList.add("displayNone");
  document.getElementById("canvas").classList.remove("displayNone");
  document.getElementById("overlay").classList.remove("displayNone");
  //document.getElementById("mobileButtons").classList.add("center");
  //document.getElementById("sideButtons").classList.add("displayNone");

 run();
}

function overlayOff() {
  document.getElementById("overlay").style.display = "none";
}

function overlayOn() {
  document.getElementById("overlay").style.display = "block";
}
let isFullscreen = false;

function fullscreen() {
  if (!isFullscreen) {
    openFullscreen();
  } else {
    closeFullscreen();
  }
}

function openFullscreen() {
  if (document.getElementById("canvas").requestFullscreen) {
    document.getElementById("canvas").requestFullscreen();
  } else if (document.getElementById("canvas").webkitRequestFullscreen) { /* Safari */
    document.getElementById("canvas").webkitRequestFullscreen();
  } else if (document.getElementById("canvas").msRequestFullscreen) { /* IE11 */
    document.getElementById("canvas").msRequestFullscreen();
  }
}

function closeFullscreen() {
  if (document.getElementById("canvas").exitFullscreen) {
    document.getElementById("canvas").exitFullscreen();
  } else if (document.getElementById("canvas").webkitExitFullscreen) { /* Safari */
    document.getElementById("canvas").webkitExitFullscreen();
  } else if (document.getElementById("canvas").msExitFullscreen) { /* IE11 */
    document.getElementById("canvas").msExitFullscreen();
  }


}