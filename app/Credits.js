RushKnight.Credits = function(game) {
  this.game = game;
  this.stateDuration = 2500;
  this.fadeInDuration = 250;
  this.fadeOutDuration = 500;
};

RushKnight.Credits.prototype = {
  init: function(fadeInColor) {
    // If the game has been finished, this state will fade in from white color
    this.fadeInColor = fadeInColor || null;
  },
  create: function() {
    // Credit text
    var text = this.game.add.bitmapText(this.game.camera.width / 2, this.game.camera.height * 0.25, 'ps2p', 'A GAME BY\nJOONAS PILLI', 8);
    text.anchor.setTo(0.5, 0.5);
    text.align = 'center';

    // Logo
    var logo = this.game.add.sprite(this.game.camera.width / 2, this.game.camera.height * 0.65, 'devious_logo');
    logo.anchor.setTo(0.5, 0.5);

    // Flash the camera
    this.game.camera.flash(this.fadeInColor, this.fadeInDuration, true);

    // Set timer which will start the next state
    this.timer = this.game.time.now + this.stateDuration;

    // And time event to start next state
    this.game.time.events.add(this.stateDuration, function() {
      RushKnight.Scripts.changeState(this, null, this.fadeOutDuration, 'Menu');
    }, this);
  }
};
