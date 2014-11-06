var GameState = function(game) {};
var SHIFT_SIZE = 71;
var SHIFT_HEIGHT = 40;

GameState.prototype.preload = function() {
  game.load.image('clear','assets/clear.png');
  game.load.image('previous','assets/previous.png');
  this.fallingShift = null;
  this.shiftGrid = [];
  this.idCount = 1;
  this.scrollStart = 0;
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
