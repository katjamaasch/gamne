const canvas = document.querySelector("canvas");
const context = canvas.getContext("2d");

class Bear {
  constructor() {
    this.xPosition = 50;
    this.yPosition = 50;
    this.width = 50;
    this.height = 70;
    this.score = 0;
    this.speed = 0.3;
    this.bearImage = new Image();
    this.bearImage.src = "images/Grumpy_bear.png";
    this.keyBindings();
  }

  //if i am erasing the keybindings function the bear is not getting rendered..??? why?
  keyBindings() {
    document.addEventListener("keydown", (event) => {
      //console.log("What is the keycode?" + event.keyCode);
      switch (event.keyCode) {
        case 38:
          this.moveUp();
          this.drawBear();
          break;
        case 40:
          this.moveDown();
          this.drawBear();
          break;
        case 37:
          this.moveLeft();
          this.drawBear();
          break;
        case 39:
          this.moveRight();
          this.drawBear();
          break;
      }
    });
  }

  runLogic() {
    this.draggingDown();
  }
  //executes the method by which y gets incremented

  drawBear() {
    context.drawImage(
      this.bearImage,
      this.xPosition,
      this.yPosition,
      this.width,
      this.height
    );
  }

  moveUp() {
    if (this.yPosition > 15) {
      this.yPosition = this.yPosition - 15;
    }
  }
  moveDown() {
    this.yPosition = this.yPosition + 15;
  }

  moveLeft() {
    if (this.xPosition > 15) {
      this.xPosition = this.xPosition - 15;
    }
  }
  moveRight() {
    if (this.xPosition < canvas.width - 15) {
      this.xPosition = this.xPosition + 15;
    }
  }

  draggingDown() {
    this.yPosition += this.speed;
    /*
    if (this.score === 0) {
      this.yPosition += 0.1;
    }
    else if (this.score === -10) {
      this.yPosition += 0.2;
    }
    else if (this.score === -20) {
      this.yPosition += 0.6;
    }
    else if (this.score === -30) {
      this.yPosition += 1.1;
      */
  }

  isColliding(obstacle) {
    //collision with bear heart
    let bearhitline = this.xPosition + this.width;
    return (
      bearhitline >= obstacle.x &&
      this.yPosition < obstacle.y + obstacle.height &&
      this.yPosition + this.height > obstacle.y
    );
  }
}

///////////////////////////////////////////////////////////////

class Obstacle {
  constructor(speed) {
    this.x = canvas.width;
    this.y = Math.random() * canvas.height;
    this.speed = speed;
  }

  runLogic() {
    this.x -= this.speed;
  }
  isOutofBounds() {
    return this.x + this.width < 0;
  }
}

class Heart extends Obstacle {
  constructor(speed) {
    super(speed);
    this.heartImage = new Image();
    this.heartImage.src = "images/customHeart.png";
    this.width = 30;
    this.height = 30;
  }

  draw() {
    //console.log(this.x + "this is y:" + this.y);
    context.drawImage(this.heartImage, this.x, this.y, this.width, this.height);
  }
}
/////////////////////////////////////////////////////////////

class Cloud extends Obstacle {
  constructor(speed) {
    super(speed);
    this.cloudImage = new Image();
    this.cloudImage.src = "images/cloud3.png";
    this.width = 50;
    this.height = 50;
  }

  draw() {
    //console.log(this.x + "this is y:" + this.y);
    context.drawImage(this.cloudImage, this.x, this.y, this.width, this.height);
  }
}

//////////////////////////////////////////////////////
class Game {
  constructor() {
    this.newBear = new Bear();
    //this.clouds = [];
    //this.hearts = [];
    this.obstacles = [];
  }

  drawScore() {
    context.fillStyle = "#d4f2fe";
    context.font = "24px sans-serif";
    context.fillText("Score 100 points to get to Cloud #7", 150, 120);
    context.fillText("Beware of the clouds!", 150, 150);
    context.fillText(this.newBear.score, 150, 180);
  }

  loop() {
    if (this.newBear.yPosition > canvas.height) {
      alert("Game over");
      //break;
    } else if (this.newBear.score === 100) {
      alert("You won!");
    }

    if (Math.random() < 0.03) {
      //the whole thing runs only for 3% of the loops
      if (Math.random() < 0.2) {
        //only 40% of the time there is a heart
        this.obstacles.push(new Heart(Math.ceil(Math.random() * 6) + 2));
        //initialises new object with random speed that is pushed into obstacles array
      } else {
        this.obstacles.push(new Cloud(9));
        //always high speed
      }
    }
    //eliminating obstacles that are out of the screen from the list
    for (let value of this.obstacles) {
      //console.log(this.obstacles.length + " " + value.isOutofBounds())
      if (value.isOutofBounds()) {
        const obstindex = this.obstacles.indexOf(value);
        //console.log('delete index %d', obstindex);
        this.obstacles.splice(obstindex, 1);
      }
    }

    for (let o of this.obstacles) {
      if (this.newBear.isColliding(o)) {
        const obstindex = this.obstacles.indexOf(o);
        //when there is a collision, I want the score to change +
        //eliminating every object that is intersecting with the bear
        if (o instanceof Heart) {
          //console.log(o instanceof Hearts);
          this.newBear.score += 10;
          if (this.newBear.speed > 0.3) {
            this.newBear.speed -= 0.2;
          }
          this.obstacles.splice(obstindex, 1);
          console.log(this.newBear.score);
        } else if (o instanceof Cloud) {
          //console.log("Is this a cloud?" + o instanceof Clouds);
          this.newBear.score -= 10;
          this.newBear.speed += 0.3;
          this.obstacles.splice(obstindex, 1);
          console.log(this.newBear.score);
        }
      }
    }

    this.draw();
    //executes the method by which the canvas gets cleared and then the player drawn

    setTimeout(() => {
      this.loop();
    }, 1000 / 30);
    //the mehod this.loop gets called again after every 1000/30
  }

  draw() {
    context.clearRect(0, 0, canvas.width, canvas.height);
    // Call draw method for every "element" in game
    this.drawScore();
    this.newBear.drawBear();
    this.newBear.runLogic();
    for (let o of this.obstacles) {
      //iterating through every object in the list obstacles
      o.runLogic();
      //calling the runLogic for every object
      o.draw();
      //drawing every object in the list
    }
  }
}

/////////////////////////////////////////////////////

/* 

setTimeout erwartet eine Funktion. Die kann auf verschiedene Weisen übergeben werden:

function initBear() {
  newBear.drawBear()
};
//setTimeout(initBear, 500);

const initialiseBear = initBear;
//setTimeout(initialiseBear, 500);


//setTimeout(() => { newBear.drawBear() }, 500);
// >> () => { } denotes a function
//drawBear is a method, not a function, it needs to be encapsulated like this 

*/
/////////////////////////////////////////////////////

const game = new Game();
game.loop();
