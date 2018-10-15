RushKnight.Menu = function(game) {
  this.game = game;
  this.stateFadeInDuration = 500;
  this.stateFadeOutDuration = 250;
  this.textChangeDelay = 10000;
}

RushKnight.Menu.prototype = {
  create: function() {
    // Init variable that will tell if we are already moving to the next state
    this.starting = false;

    // Add background image
    this.game.add.image(0, 0, 'titleScreen');

    // Add background music
    this.music = this.game.add.audio('theme', 1, true);

    // Init player sprite
    var player = this.game.add.sprite(this.camera.width / 2 - 1, 48, 'player');
    player.anchor.setTo(0.5, 0.05);
    player.scale.setTo(0, 0);
    player.animations.add('run', [0,1,2,3,4,5], RushKnight.Settings.PLAYER_ANIM_SPEED, true);
    player.animations.play('run');

    // Init coin particles
    this.emitter = this.game.add.emitter(this.game.world.centerX, -32, 10);
    this.emitter.width = this.game.world.width;
    this.emitter.makeParticles('hudCoin');
    this.emitter.setYSpeed(50, 100);
    this.emitter.setXSpeed(-15, 15);
    this.emitter.minParticleScale = 2;
    this.emitter.maxParticleScale = 2;
    this.emitter.minRotation = 0;
    this.emitter.maxRotation = 0;

    // Game title text
    var logoText = this.game.add.bitmapText(this.camera.width / 2, this.game.camera.height * 0.1, 'alagard', 'RUSH KNIGHT', 16);
    logoText.anchor.setTo(0.5, 0.5);
    logoText.alpha = 0;

    // The "insert coin" text
    var startText = this.game.add.bitmapText(this.camera.width / 2, this.game.camera.height * 0.9, 'ps2p', 'INSERT COIN', 8);
    startText.anchor.setTo(0.5, 0.5);
    startText.alpha = 0;
    startText.align = 'center';

    // Add scale tween to "insert coin" text
    var scaleTween = this.game.add.tween(startText.scale).to({x: 1.1, y: 1.1}, 225, null, true);
    scaleTween.loop(true);
    scaleTween.yoyo(true);

    // Add running tween to the player (scaling)
    this.runTween = this.game.add.tween(player.scale).to({x: 2, y: 2}, this.stateFadeInDuration, null, true);

    // After running tween is complete, start music and reveal texts
    this.runTween.onComplete.addOnce(function() {
      this.game.camera.flash(0xffffff, 250, true);
      this.music.play();
      this.emitter.start(false, 2000, 250);
      logoText.alpha = 1;
      startText.alpha = 1;
      this.game.time.events.add(this.textChangeDelay, function() {
        startText.text = RushKnight.TouchInput.enabled ? 'TAP THE SCREEN' : 'PRESS SPACE';
      }, this);
    }, this);

    // Init keyboard input
    this.keySpace = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);

    // Fade in the state
    this.game.camera.flash('#000000', this.stateFadeInDuration, true);
  },
  update: function() {
    if ((this.keySpace.isDown ||
      this.game.input.pointer1.isDown ||
      this.game.input.activePointer.isDown) &&
      !this.starting && !this.runTween.isRunning) {

      this.starting = true;

      this.game.sound.play('coin');

      RushKnight.Scripts.changeState(this, null, this.stateFadeOutDuration, 'Game', this.music);
    }
  }
};
