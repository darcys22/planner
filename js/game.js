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

  this.box();
  this.ruler();

}

GameState.prototype.ruler = function() {

  var rlrbdr = this.game.add.graphics(0,0);
  rlrbdr.lineStyle(5, 0x9CA2B8);
  rlrbdr.moveTo(0,0);
  rlrbdr.lineTo(game.width,0);

  this.floor = this.game.add.sprite(0,this.game.height-50);
  this.floor.addChild(rlrbdr);
  game.physics.enable(this.floor, Phaser.Physics.ARCADE);
  this.floor.body.immovable = true;
  this.floor.body.moves = false;


}

GameState.prototype.box = function() {
  var bmd = this.game.add.bitmapData(this.game.width, this.game.height);
  bmd.context.fillStyle = 'rgba(255, 0, 0, 0.3)';
  bmd.context.fillRect(71,300, 71*4,40);
  this.box = this.game.add.sprite(0,0,bmd);

  game.physics.arcade.enable(this.box);
  this.box.inputEnabled = true;
  this.box.input.enableDrag();
}

GameState.prototype.render = function() {
  this.game.debug.body(this.box);
  this.game.debug.body(this.floor);
}
