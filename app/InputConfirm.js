// As some mobile browsers enable sound only after the canvas has been tapped, this state is used to make sure sound gets enabled before any sounds are played

RushKnight.InputConfirm = function(game) {
  this.game = game;
  this.fadeOutDuration = 250;
};

RushKnight.InputConfirm.prototype = {
  create: function() {
    // Init variable that will tell if we are already moving to the next state
    this.starting = false;

    // The text
    var text = this.game.add.bitmapText(this.camera.width / 2, this.game.camera.height / 2, 'ps2p', 'TAP THE SCREEN OR PRESS SPACE', 8);
    text.anchor.setTo(0.5, 0.5);
    text.align = 'center';
    text.maxWidth = this.game.width;

    // Init keyboard input
    this.keySpace = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
  },
  update: function() {
    if (!this.starting &&
      (this.keySpace.isDown ||
      this.game.input.pointer1.isDown ||
      this.game.input.activePointer.isDown)) {
      this.starting = true;

      // If game is clicked with touch input, reveal the touch controls
      if (this.game.input.pointer1.isDown) {
        document.getElementById('buttons').style.display = "inline";
        RushKnight.TouchInput.enabled = true;
      }

      RushKnight.Scripts.changeState(this, null, this.fadeOutDuration, 'Credits');
    }
  }
};
