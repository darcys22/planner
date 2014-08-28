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
  var rlrbdr = game.add.graphics(0, 0);

  rlrbdr.lineStyle(5, 0x9CA2B8);
  rlrbdr.moveTo(0,game.height - 50);
  rlrbdr.lineTo(game.width,game.height - 50);

  rlrbdr.drawRect(71,400, 71,40);
  rlrbdr.drawRect(71,300, 71*4,40);
}
