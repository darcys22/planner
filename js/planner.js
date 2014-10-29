var GameState = function(game) {};
var SHIFT_SIZE = 71;
var SHIFT_HEIGHT = 40;

GameState.prototype.preload = function() {
  game.load.image('clear','assets/clear.png');
  game.load.image('previous','assets/previous.png');
  this.fallingShift = null;
  this.shiftGrid = [];
  this.idCount = 1;
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
  this.shifts = this.game.add.group();
  this.input.justReleasedRate = 25;

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

GameState.prototype.box = function(shift) {
  var bmd = this.game.add.bitmapData(shift.position/2 * SHIFT_SIZE, SHIFT_HEIGHT);
  bmd.context.fillStyle = 'rgba(255, 0, 0, 0.3)';
  roundRect(bmd.ctx, 0, 0, bmd.width, bmd.height, 5, true);
  var box = this.game.add.sprite(1,1,bmd);
  box.id = shift.id;

  box.inputEnabled = true;
  box.input.enableDrag();
  box.input.enableSnap(SHIFT_SIZE/2, SHIFT_HEIGHT,true,false);


  box.events.onDragStart.add(this.startDrag, this);
  box.events.onDragStop.add(this.stopDrag, this);

  function fallin() {
    this.shifts.add(this.fallingShift);
    this.fallingShift = null;
  }

  var speed = (this.game.height - 90 - box.y)*2;

  this.boxTween = this.game.add.tween(box).to({ y: (shift.height * SHIFT_HEIGHT + 90)}, speed, Phaser.Easing.Linear.None, true)
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

//takes a shift, adds it to the shiftgrid
GameState.prototype.addShiftGrid = function(shift) {
  position = this.checkGrid(shift);
  if (position == -1) {
    this.concatArr(this.shiftGrid, shift);
    return this.shiftGrid.length;
  }
  else {
    this.ShiftGrid[position] = this.addShiftArray(this.ShiftGrid[position], shift)
  }
  return position;
}

//Goes through the shift grid and returns the vertical array index the shift should be in (-1 if it cant fit)
GameState.prototype.checkGrid = function(shift) {
  if (this.shiftGrid.length == 0) return -1;
  return this.shiftGrid.findIndex(function(x) {
    x.slice(shift.position, shift.position + shift.length).every(function(i) { i == 0 })
  }.first);
}

//creates a new empty single dimension array, then puts the shifts into it
GameState.prototype.concatArr = function(arr, shift) {
  var empty = Array.apply(null, new Array(64)).map(Number.prototype.valueOf,0);
  this.addShiftArray(empty, shift)
  arr.push(empty);
}

// Given a single dimension array, go through it and add the shifts id to the hours time position
GameState.prototype.addShiftArray = function(arr, shift) {
  for (var i = shift.position; i < shift.position + shift.length; i++)
  {
    arr[i] = shift.id;
  }
  return arr;
}

//Shift object
Shift = function(hour) {
  this.position = hour*2;
  this.length = 8;
  this.id = this.idCount;
  this.height = null;
  this.idCount++;
}


////////////////////////////////////////////////
//
////////// Probably dont need to touch again
//
//
//

GameState.prototype.shiftAdd = function(sprite, pointer) {
  var hour = Math.floor(this.game.input.x/71);
  var shift = new Shift(hour);
  shift.height = this.addShiftGrid(shift);
  var xpos = hour * 71
  this.box(shift);
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
  clear = this.game.add.button(10, 110, 'clear', this.clearBut);
}
GameState.prototype.clearBut = function() {
  this.shifts.removeAll()
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
