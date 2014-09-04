var GameState = function(game) {};

GameState.prototype.preload = function() {
  game.load.image('clear','assets/clear.png');
  game.load.image('previous','assets/previous.png');
  this.fallingShift = null;
};

var clear;
var previous;

GameState.prototype.create = function() {
  this.setup();
};

GameState.prototype.update = function() {
  if (this.checkOverlap())
    {
      this.boxTween.stop();
      this.shifts.add(this.fallingShift);
      this.fallingShift = null;
    }


  if (game.input.mousePointer.justReleased()) 
    {
      if (this.fallingShift === null)
        {
          this.shiftAdd(null,null);
        }
    }
    
  
};

GameState.prototype.render = function() {
}


/////////////////////////// Setup game
////////////////////////////////////////////////
//
//
//


var game = new Phaser.Game(1136, 640, Phaser.AUTO);
game.state.add('game', GameState, true);

GameState.prototype.setup = function()  {
  this.game.stage.backgroundColor = 0x333333;
  //this.game.physics.startSystem(Phaser.Physics.ARCADE);
  //this.game.physics.arcade.gravity.y = 200;
  this.shifts = this.game.add.group();
  //this.game.input.onDown.add(this.shiftAdd, this);

  this.box(71, 300, 4);
  this.ruler();
  this.buttons();

}

GameState.prototype.ruler = function() {

  var rlrbdr = this.game.add.bitmapData(this.game.width, 50);
  //rlrbdr context is a html5 canvas context so what you draw with that yeah
  rlrbdr.ctx.strokeStyle = "#9CA2B8";
  rlrbdr.ctx.lineWidth=5;
  rlrbdr.ctx.beginPath();
  rlrbdr.ctx.moveTo(0,0);
  rlrbdr.ctx.lineTo(game.width,0);
  rlrbdr.ctx.stroke();

  this.floor = this.game.add.sprite(0,this.game.height-50,rlrbdr);

}

GameState.prototype.box = function(x, y, size) {
  var bmd = this.game.add.bitmapData(71*size, 40);
  bmd.context.fillStyle = 'rgba(255, 0, 0, 0.3)';
  roundRect(bmd.ctx, 0, 0, bmd.width, bmd.height, 5, true);
  var box = this.game.add.sprite(x,y,bmd);

  box.inputEnabled = true;
  box.input.enableDrag();
  box.input.enableSnap(71/2,40,true,false);


  box.events.onDragStart.add(this.startDrag, this);
  box.events.onDragStop.add(this.stopDrag, this);

  function fallin() {
    this.shifts.add(this.fallingShift);
    this.fallingShift = null;
  }

  var speed = (this.game.height - 90 - box.y)*2;

  this.boxTween = this.game.add.tween(box).to({ y: this.game.height - 90}, speed, Phaser.Easing.Linear.None, true)
  this.boxTween.onComplete.add(fallin, this);

  this.fallingShift = box;
}

GameState.prototype.checkOverlap = function() {

    if (!this.fallingShift) {
      return false
    }
    var boundsA = this.fallingShift.getBounds();
    boundsA.inflate(-10, 4);
    var boundsB;
    var ol = false;
    
    function isOverlap(element) {
        boundsB = element.getBounds();
        ol = ol || Phaser.Rectangle.intersects(boundsA, boundsB);
    }

    this.shifts.forEach(isOverlap, this);

    return ol;
}


////////////////////////////////////////////////
//
////////// Probably dont need to touch again
//
//
//

GameState.prototype.shiftAdd = function(sprite, pointer) {
  var hour = Math.floor(this.game.input.x/71);
  var xpos = hour * 71
  this.box(xpos, this.game.input.y, 4);
}
GameState.prototype.startDrag = function(sprite, pointer) {
}
GameState.prototype.stopDrag = function(sprite, pointer) {
  this.shiftAdd(sprite,pointer);
  sprite.destroy(true);
}
GameState.prototype.buttons = function() {
  var date = "February 1st 2014"
  var style = { font: "40px Arial", fill: "#9CA2B8" };
  var tdate = game.add.text(10, 10, date, style);

  previus = this.game.add.button(10, 65, 'previous');
  clear = this.game.add.button(10, 110, 'clear');
}


/**
 * Draws a rounded rectangle using the current state of the canvas. 
 * If you omit the last three params, it will draw a rectangle 
 * outline with a 5 pixel border radius 
 * @param {CanvasRenderingContext2D} ctx
 * @param {Number} x The top left x coordinate
 * @param {Number} y The top left y coordinate 
 * @param {Number} width The width of the rectangle 
 * @param {Number} height The height of the rectangle
 * @param {Number} radius The corner radius. Defaults to 5;
 * @param {Boolean} fill Whether to fill the rectangle. Defaults to false.
 * @param {Boolean} stroke Whether to stroke the rectangle. Defaults to true.
 */
function roundRect(ctx, x, y, width, height, radius, fill, stroke) {
  if (typeof stroke == "undefined" ) {
    stroke = true;
  }
  if (typeof radius === "undefined") {
    radius = 5;
  }
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + width - radius, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
  ctx.lineTo(x + width, y + height - radius);
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  ctx.lineTo(x + radius, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();
  if (stroke) {
    ctx.stroke();
  }
  if (fill) {
    ctx.fill();
  }        
}
