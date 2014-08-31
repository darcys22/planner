// Copyright © 2014 Demircan Celebi
// Licensed under the terms of the MIT License

var GameState = function(game) {};

GameState.prototype.preload = function() {
  game.load.image('clear','assets/clear.png');
  game.load.image('previous','assets/previous.png');
};

var clear;
var previous;

GameState.prototype.create = function() {
  this.setup();
};

GameState.prototype.update = function() {
  game.physics.arcade.collide(this.box,this.floor);
};

// Setup game
var game = new Phaser.Game(1136, 640, Phaser.AUTO);
game.state.add('game', GameState, true);

GameState.prototype.setup = function()  {
  this.game.stage.backgroundColor = 0x333333;
  this.game.physics.startSystem(Phaser.Physics.ARCADE);
  this.game.physics.arcade.gravity.y = 200;

  var date = "February 1st 2014"
  var style = { font: "40px Arial", fill: "#9CA2B8" };
  var tdate = game.add.text(10, 10, date, style);

  previus = game.add.button(10, 65, 'previous');
  clear = game.add.button(10, 110, 'clear');

  this.box(71, 300, 4);
  this.ruler();

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
  game.physics.enable(this.floor, Phaser.Physics.ARCADE);
  this.floor.body.immovable = true;
  this.floor.body.moves = false;


}

GameState.prototype.box = function(x, y, size) {
  var bmd = this.game.add.bitmapData(71*size, 40);
  bmd.context.fillStyle = 'rgba(255, 0, 0, 0.3)';
  roundRect(bmd.ctx, 0, 0, bmd.width, bmd.height, 5, true);
  //bmd.context.fillRect(0,0, bmd.width,bmd.height);
  this.box = this.game.add.sprite(x,y,bmd);

  game.physics.arcade.enable(this.box);
  this.box.inputEnabled = true;
  this.box.input.enableDrag();
}

GameState.prototype.render = function() {
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
