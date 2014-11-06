//Shift object
Shift = function(hour) {
  this.position = hour*2;
  this.length = 8;
  this.id = idCount;
  this.height = null;
  idCount++;
} 
Shift.prototype.ypos = function() {
  return game.height - GameState.prototype.floor.height - (GameState.prototype.SHIFT_HEIGHT * this.height)
}

Shift.prototype.xpos = function() {
  return (this.position - GameState.prototype.scrollStart) * (GameState.prototype.SHIFT_SIZE / 2)
}

GameState.prototype.box = function(shift, originPointer) {
  var bmd = this.game.add.bitmapData(shift.position/2 * SHIFT_SIZE, SHIFT_HEIGHT);
  bmd.context.fillStyle = 'rgba(255, 0, 0, 0.3)';
  roundRect(bmd.ctx, 0, 0, bmd.width, bmd.height, 5, true);
  var box = this.game.add.sprite(originPointer.x,originPointer.y,bmd);
  //box.id = shift.id;

  //box.inputEnabled = true;
  //box.input.enableDrag();
  //box.input.enableSnap(SHIFT_SIZE/2, SHIFT_HEIGHT,true,false);


  //box.events.onDragStart.add(this.startDrag, this);
  //box.events.onDragStop.add(this.stopDrag, this);

  function fallin() {
    this.shifts.add(this.fallingShift);
    this.fallingShift = null;
  }

  var speed = (this.game.height - 90 - box.y)*2;
  debugger;

  this.boxTween = this.game.add.tween(box).to({ y: shift.ypos }, speed, Phaser.Easing.Linear.None, true)
  this.boxTween.onComplete.add(fallin, this);

  this.fallingShift = box;
}

//takes a shift, adds it to the shiftgrid
GameState.prototype.addShiftGrid = function(shift) {
  var position = this.checkGrid(shift);
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


GameState.prototype.shiftAdd = function(sprite, pointer) {
  var hour = Math.floor(this.game.input.x/71);
  var shift = new Shift(hour);
  shift.height = this.addShiftGrid(shift);
  var xpos = hour * 71;
  this.box(shift, this.game.input);
}
GameState.prototype.startDrag = function(sprite, pointer) {
}
GameState.prototype.stopDrag = function(sprite, pointer) {
  this.shiftAdd(sprite,pointer);
  sprite.destroy(true);
}
