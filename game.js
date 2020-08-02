//Grab the canvas ID
const cvs = document.getElementById("snake");
//We use getContext here to use its methods and properties
//For drawing
const ctx = cvs.getContext("2d");

// Our map has boxes of 32px.
// So we'll create the unit box right here.
const box = 32;

// We create a new image object here.
// Along with its source
const ground = new Image();
ground.src = "img/ground.png";

const foodImg = new Image();
foodImg.src = "img/food.png";

// We create a new Audio object here.
// Along with its source

let dead = new Audio();
let eat = new Audio();
let up = new Audio();
let right = new Audio();
let left = new Audio();
let down = new Audio();

dead.src = "audio/dead.mp3";
eat.src = "audio/eat.mp3";
up.src = "audio/up.mp3";
right.src = "audio/right.mp3";
left.src = "audio/left.mp3";
down.src = "audio/down.mp3";

// The snake will be an array in this game.
// The first cell will be its head.
// The numbers defined are where the user will start

let snake = [];

snake[0] = {
  x: 9 * box,
  y: 10 * box,
};

// We create the food that spawns randomly here.
// Using math.random, we spawn in random pieces of food for the user to find.

// The map begins 1 unit to the right so we add one
// The map begins 3 units up so we add 3.
// The map is 17 x 15 units long so we multiply it by a random number
// For a position.
// We then round it with math.floor.
let food = {
  x: Math.floor(Math.random() * 17 + 1) * box,
  y: Math.floor(Math.random() * 15 + 3) * box,
};

// We create the highscore var here

let score = 0;

// Snake Controls
//First we initialize the keyboard variable we'll be using.

let d;

// We add an event lisenter to the document.
// this event listener calls the function direction.
document.addEventListener("keydown", direction);
//This function has the event parameter which has the .keyCode
//It'll allow us to compare our keycodes.
function direction(event) {
  let key = event.keyCode;
  if (key == 37 && d != "RIGHT") {
    left.play();
    d = "LEFT";
  } else if (key == 38 && d != "DOWN") {
    d = "UP";
    up.play();
  } else if (key == 39 && d != "LEFT") {
    d = "RIGHT";
    right.play();
  } else if (key == 40 && d != "UP") {
    d = "DOWN";
    down.play();
  }
}

// cheack collision function
function collision(head, array) {
  for (let i = 0; i < array.length; i++) {
    if (head.x == array[i].x && head.y == array[i].y) {
      return true;
    }
  }
  return false;
}

// This function will draw everything on our canvas.

function draw() {
  // We use .drawImage(imageName,X,y,Width,Height) to
  // draw the ground object on the canvas.
  ctx.drawImage(ground, 0, 0);

  //If i equals 0, aka the first loop, we can determine that this will be the head.
  //Once its not the head, it'll draw white boxes afterwards because i increments.
  for (let i = 0; i < snake.length; i++) {
    //To draw a rectangle, we'll have to define a fill-color for it.
    //In this case if I equals to 0, we'll set it to green, if not, then white.

    //Once the fill-color has been defined, we can proceed to use
    //fillRect to actually draw the rectangle fillRect(x,y,width,height)

    ctx.fillStyle = i == 0 ? "green" : "white";
    ctx.fillRect(snake[i].x, snake[i].y, box, box);

    //We want the user to know this is the box selected.
    //So strokeStyle adds a border to it. We define the colour for it here.
    //We then draw in the stroke with strokeRect.
    ctx.strokeStyle = "red";
    ctx.strokeRect(snake[i].x, snake[i].y, box, box);
  }

  ctx.drawImage(foodImg, food.x, food.y);

  // old head position
  let snakeX = snake[0].x;
  let snakeY = snake[0].y;

  // which direction
  if (d == "LEFT") snakeX -= box;
  if (d == "UP") snakeY -= box;
  if (d == "RIGHT") snakeX += box;
  if (d == "DOWN") snakeY += box;

  // if the snake eats the food
  if (snakeX == food.x && snakeY == food.y) {
    score++;
    eat.play();
    food = {
      x: Math.floor(Math.random() * 17 + 1) * box,
      y: Math.floor(Math.random() * 15 + 3) * box,
    };
    // we don't remove the tail
  } else {
    // .pop removes last entry of our snake array aka the tail.
    snake.pop();
  }

  // add new Head

  let newHead = {
    x: snakeX,
    y: snakeY,
  };

  // game over

  if (
    snakeX < box ||
    snakeX > 17 * box ||
    snakeY < 3 * box ||
    snakeY > 17 * box ||
    collision(newHead, snake)
  ) {
    clearInterval(game);
    dead.play();
  }
  //Adds to the beginning of the array
  //Unshift and pop helps us move the tail.
  snake.unshift(newHead);
  // We draw the highscore here!
  ctx.fillStyle = "white";
  ctx.font = "45px Changa one";
  ctx.fillText(score, 2 * box, 1.6 * box);
}

// To play the game, we'll have to continously draw the game.
// setInterval(function,ms)

let game = setInterval(draw, 100);
