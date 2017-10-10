var Player;
var Rocks = [];
var BUllets = [];
var k = 50;

var scorecard = document.getElementById('score');


function setup() {
  // img=loadImage("1.png");
  createCanvas(windowWidth, windowHeight);
  Player = new Player();
  for (var i = 0; i < 8; i++) {
    Rocks.push(new Rock());
  }
}
// **********************************************************************************************
function draw() {
  background(40);

  for (var i = 0; i < Rocks.length; i++) {
    if (Player.hits(Rocks[i])) {
      console.log('oops');
      Player.score=Player.score-20;
      if (Player.lives < 1) {
        if (confirm("GAME OVER\nWant To Play Again?????") == true) {
          location.reload();
        } else {
          window.close();
        }
      } else {
        // Player.pos.x = 100;
        // Player.pos.y = height / 2;
        do{
          var a=random(width);
          var b=random(height);
        }while(a==Rocks[i].pos.x&&b==Rocks[i].pos.y);

        Player.pos = createVector(a,b);
      }
    }
    Rocks[i].render();
    Rocks[i].update();
    Rocks[i].edges();
  }
  textSize(40);
  fill(35, 134, 244);
  text("LIVES", 10, 45)
  text(Player.lives, 50, 90)
  text("SCORE", 1150, 45)
  text(Player.score, 1199, 90)
  // scorecard.innerHTML(Player.lives);

  for (var i = BUllets.length - 1; i >= 0; i--) {
    BUllets[i].render();
    BUllets[i].update();
    if (BUllets[i].offScreen()) {
      BUllets.splice(i, 1);
    } else {
      for (var j = Rocks.length - 1; j >= 0; j--) {
        if (BUllets[i].hits(Rocks[j])) {
          Player.score=Player.score+10;
          if (Rocks[j].r > 15) {
            var newRocks = Rocks[j].destroy();
            Rocks = Rocks.concat(newRocks);

          }
          Rocks.splice(j, 1);
          BUllets.splice(i, 1);
          break;
        }
      }
    }
  }
  Player.render();
  Player.turn();
  Player.update();
  Player.edges();

}

function keyReleased() {
  Player.setRotation(0);
  Player.accelerating(false);
}

function keyPressed() {
  if (keyIsDown(32)) {
    BUllets.push(new BUllet(Player.pos, Player.heading));
    k++;
  }
  if (keyIsDown(RIGHT_ARROW) || keyIsDown(68)) {
    Player.setRotation(0.1);
  } else if (keyIsDown(LEFT_ARROW) || keyIsDown(65)) {
    Player.setRotation(-0.1);
  } else if (keyIsDown(UP_ARROW) || keyIsDown(87)) {
    Player.accelerating(true);
  } else if (keyIsDown(DOWN_ARROW) || keyIsDown(83)) {
    Player.accelerating(false);
  }
}
// ***********************************************************************************************************
function Player() {
  this.pos = createVector(width / 2, height / 2);
  this.lives = 5;
  this.score=0;
  this.r = 25;
  this.heading = 0;
  this.rotation = 0;
  this.vel = createVector(0, 0);
  this.update = function() {
    if (this.isaccelerating) {
      this.thrust();
    }
    this.pos.add(this.vel);
    this.vel.mult(0.98);
  }
  this.hits = function(Rock) {
    var d = dist(this.pos.x, this.pos.y, Rock.pos.x, Rock.pos.y);
    if (d < this.r + Rock.r) {
      this.lives = this.lives - 1;
      console.log(this.lives);
      return true;
    } else {
      return false;
    }
  }

  this.thrust = function() {
    var force = p5.Vector.fromAngle(this.heading);
    force.mult(0.3);
    this.vel.add(force);
  }
  this.isaccelerating = false;
  this.accelerating = function(b) {
    this.isaccelerating = b;
  }
  this.render = function() {
    push();
    translate(this.pos.x, this.pos.y);
    fill('magenta');
    stroke(255);
    rotate(this.heading + PI / 2);
    triangle(-this.r, this.r, this.r, this.r, 0, -this.r);
    pop();
  }
  this.edges = function() {
    if (this.pos.x > width + this.r) {
      this.pos.x = -this.r;
    } else if (this.pos.x < -this.r) {
      this.pos.x = width + this.r;
    }
    if (this.pos.y > height + this.r) {
      this.pos.y = -this.r;
    } else if (this.pos.y < -this.r) {
      this.pos.y = height + this.r;
    }
  }
  this.setRotation = function(a) {
    this.rotation = a;
  }
  this.turn = function(angle) {
    this.heading += this.rotation;
  }
}

// ***************************************************************************************************
function Rock(pos, r) {
  if (pos) {
    this.pos = pos.copy();
  } else {
    this.pos = createVector(random(width), random(height));
  }
  if (r) {
    this.r = r * 0.5;
  } else {
    this.r = random(25, 60);
  }
  this.vel = p5.Vector.random2D();
  this.render = function() {
    push();
    stroke(89, 38, 4);
    fill(214, 139, 89);
    translate(this.pos.x, this.pos.y);
    ellipse(0, 0, this.r * 2);
    // image(img,0,0,this,r*2);
    pop();
  }
  this.update = function() {
    this.pos.add(this.vel);
  }
  this.destroy = function() {
    var newA = [];
    newA[0] = new Rock(this.pos, random(20,50));
    newA[1] = new Rock(this.pos, this.r);
    return newA;
  }
  this.edges = function() {
    if (this.pos.x > width + this.r) {
      this.pos.x = -this.r;
    } else if (this.pos.x < -this.r) {
      this.pos.x = width + this.r;
    }
    if (this.pos.y > height + this.r) {
      this.pos.y = -this.r;
    } else if (this.pos.y < -this.r) {
      this.pos.y = height + this.r;
    }
  }
}
// ************************************************************************************************

function BUllet(spos, angle) {

  this.pos = createVector(spos.x, spos.y);
  this.vel = p5.Vector.fromAngle(angle);
  this.vel.mult(10);
  this.update = function() {
    this.pos.add(this.vel);
  }

  this.render = function() {
    push();
    if (k < 230) {
      fill(k);

      console.log(k);
    } else {
      k = 0;
      fill(k);
    }
    stroke(random() * k * 10, random() * k * 10, random() * k * 10);
    strokeWeight(13);

    point(this.pos.x, this.pos.y);
    pop();
  }
  this.offScreen = function() {
    if (this.pos.x > width) {
      return true;
    } else if (this.pos.x < 0) {
      return true;
    }
    if (this.pos.y > height) {
      return true;
    } else if (this.pos.y < 0) {
      return true;
    }
    return false;
  }

  this.hits = function(Rock) {
    // console.log(Rock.pos);
    var d = dist(this.pos.x, this.pos.y, Rock.pos.x, Rock.pos.y);
    if (d < Rock.r) {
      return true;
    } else {
      return false;
    }
  }
}
