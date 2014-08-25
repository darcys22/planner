// Copyright © 2014 Demircan Celebi
// Licensed under the terms of the MIT License

var GameState = function(game) {};

GameState.prototype.preload = function() {
  game.load.image('clear','assets/clear.png');
  game.load.image('previous','assets/previous.png');
};

var clear;
var previous;
var rlrbdr;

GameState.prototype.create = function() {
  this.setup();
};

GameState.prototype.update = function() {
};

// Setup game
var game = new Phaser.Game(1136, 640, Phaser.AUTO);
game.state.add('game', GameState, true);

GameState.prototype.setup = function()  {
  this.game.stage.backgroundColor = 0x333333;

  var date = "February 1st 2014"
  var style = { font: "40px Arial", fill: "#9CA2B8" };
  var tdate = game.add.text(10, 10, date, style);

  previus = game.add.button(10, 65, 'previous');
  clear = game.add.button(10, 110, 'clear');

  this.ruler();

}

GameState.prototype.ruler = function() {
  bmd = game.make.bitmapData(game.width, game.height);
  bmd.ctx.strokeStyle = '#ffffff';
  rlr = game.add.sprite(0, game.height - 30, bmd);
  bmd.ctx.beginPath();
  bmd.ctx.moveTo(0, game.height - 30 );
  bmd.ctx.lineTo(game.width, game.height - 30);
  bmd.ctx.lineWidth = 4;
  bmd.ctx.stroke();
  bmd.ctx.closePath();
  bmd.render();
}
