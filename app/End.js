RushKnight.End = function(game) {
  this.game = game;
  this.stateFadeInDuration = 10000;
  this.stateFadeOutDuration = 5000;
  this.textFadeInDuration = 2000;
  this.textFadeOutDuration = 1000;
  this.textFadeDelay = 2000;
  this.texts = [
    "You have saved the kingdom",
    "We are forever in your debt",
    "Thanks for playing!"
  ];
};

RushKnight.End.prototype = {
  init: function(music) {
    // Get the background music started in Game -state so it can be faded out when state changes
    this.music = music;
  },
  create: function() {
    // Init index of current displayed text
    var textIndex = 0;

    // Add background image
    this.game.add.image(0, 0, 'endScreen');

    // Add text background
    var textBG = this.game.add.image(this.camera.width / 2, this.game.camera.height / 2, 'textBG');
    textBG.anchor.setTo(0.5, 0.5);
    textBG.alpha = 0;

    // Add text
    var text = this.game.add.bitmapText(this.camera.width / 2, this.game.camera.height / 2, 'alagard', this.texts[textIndex], 16);
    text.fixedToCamera = true;
    text.maxWidth = this.game.width;
    text.anchor.setTo(0.5, 0.5);
    text.align = 'center';
    text.alpha = 0;

    // Text fade in tween
    var textFadeIn = this.game.add.tween(text).to({alpha: 1}, this.textFadeInDuration);
    textFadeIn.onComplete.add(function() {
      this.game.time.events.add(this.textFadeDelay, function() {
        // Increment this.texts array index if possible and fade out current text
        if (textIndex < this.texts.length - 1) {
          ++textIndex;
          textFadeOut.start();
        } else {
          // End state and go back to credits if no more text exists in the this.texts array
          RushKnight.Scripts.changeState(this, 0xffffff, this.stateFadeOutDuration, 'Credits', this.music, 0xffffff);
        }
      }, this);
    }, this);

    // Text fade out tween
    var textFadeOut = this.game.add.tween(text).to({alpha: 0}, this.textFadeOutDuration);
    textFadeOut.onComplete.add(function() {
      text.text = this.texts[textIndex];
      textFadeIn.start();
    }, this);

    // Camera flash/fade in tween
    this.game.camera.flash(0xffffff, this.stateFadeInDuration, true);
    this.game.camera.onFlashComplete.addOnce(function() {
      // Fade in the text background
      this.game.add.tween(textBG).to({alpha: 1}, this.textFadeInDuration, null, true);
      // Fade in the first text
      textFadeIn.start();
    }, this);
  },
  shutdown: function() {
    // Reset global game variables
    RushKnight.level = 1;
    RushKnight.score = 0;
    // Save game to localstorage
    RushKnight.Scripts.saveGame();
  }
};
