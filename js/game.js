let canvas;
let world;
let keyboard = new Keyboard();

function init() {
  canvas = document.getElementById("canvas");
  world = new World(canvas);

  console.log(`My character is:`, world);
}

window.addEventListener("keydown", (e) => {
e.code=="Space" && keyboard.SPACE==false ? keyboard.SPACE=true : null;
e.code=="ArrowUp" && keyboard.UP==false ? keyboard.UP=true : null;
e.code=="ArrowDown" && keyboard.DOWN==false ? keyboard.DOWN=true : null;
e.code=="ArrowLeft" && keyboard.LEFT==false ? keyboard.LEFT=true : null;
e.code=="ArrowRight" && keyboard.RIGHT==false ? keyboard.RIGHT=true : null;
//console.log(`Button is listen:`,e, keyboard)
});

window.addEventListener("keyup", (e) => {
e.code=="Space" && keyboard.SPACE==true ? keyboard.SPACE=false : null;
e.code=="ArrowUp" && keyboard.UP==true ? keyboard.UP=false : null;
e.code=="ArrowDown" && keyboard.DOWN==true ? keyboard.DOWN=false : null;
e.code=="ArrowLeft" && keyboard.LEFT==true ? keyboard.LEFT=false : null;
e.code=="ArrowRight" && keyboard.RIGHT==true ? keyboard.RIGHT=false : null;
//console.log(`Button is listen:`,e, keyboard);
});
