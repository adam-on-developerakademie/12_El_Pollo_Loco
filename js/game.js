let canvas;
let ctx;
//let world;
let character = new Image();

function init() {
  canvas = document.getElementById("canvas");
  ctx=canvas.getContext("2d");
  character.src = "../img/2_character_pepe/2_walk/W-21.png";
  // world = new World(canvas);

  ctx.drawImage(character, 100, 100, 100, 150);

  setTimeout(() => {
      ctx.drawImage(character, 100, 100, 100, 150);
}, 1000);

  console.log(`My character is:`, character);
}
