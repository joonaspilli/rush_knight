RushKnight.Bat = function(game, x, y, player) {
  Phaser.Sprite.call(this, game, x, y, 'bat');

  // Get the player sprite so it can be followed
  this.player = player;

  // Get and set move speed variables
  this.xSpeed = RushKnight.Settings.BATS_XSPEED;
  this.ySpeed = RushKnight.Settings.BATS_YSPEED;

  // Init flying sound fx
  this.flapping = this.game.add.audio('flap', 1, true);
  this.flapping.allowMultiple = false;

  // Set anchor point to center
  this.anchor.setTo(0.5, 0.5);

  // Enable physics
  this.game.physics.arcade.enable(this);
  // Adjust body size
  this.body.setSize(16, 11, 0, 0);

  // Add flying animation
  this.animations.add('fly', [0,1,2], RushKnight.Settings.BATS_ANIM_SPEED, true);
  // Start flying animation
  this.animations.play('fly');

  // Init arrow indicator
  var HUD = RushKnight.HUD.getInstance();
  this.arrow = HUD.addWild(this.game.add.image(0, 0, 'arrow'));
  this.arrow.anchor.setTo(3, 0.5);
  this.arrow.alpha = 0;

  // Init arrow indicator tween
  this.arrowTween = this.game.add.tween(this.arrow).to({alpha: 1}, RushKnight.Settings.BATS_INDICATOR_BLINK_SPEED);
  this.arrowTween.loop(true);
  this.arrowTween.yoyo(true);

  // Sound fx and arrow tween will be stopped if bat is killed
  this.events.onKilled.addOnce(function() {
    this.flapping.stop();
    this.arrowTween.stop();
    this.arrow.alpha = 0;
  }, this);

  // Add this sprite to the current game
  this.game.add.existing(this);
};

RushKnight.Bat.prototype = Object.create(Phaser.Sprite.prototype);
RushKnight.Bat.prototype.constructor = RushKnight.Bat;

RushKnight.Bat.prototype.update = function() {
  if (this.alive) {
    // Make bat follow the player on x axis
    if (this.y > this.player.y) this.x += (this.player.x - this.x) * this.xSpeed;

    // If bat is in view:
    if (this.top < this.game.camera.y + this.game.camera.height) {
      // Move on y-axis
      this.y -= this.ySpeed;
      // Play sound effect if not already playing
      if (!this.flapping.isPlaying) this.flapping.play();

      // Update the arrow indicator
      this.arrow.x = this.player.x;
      this.arrow.y = this.player.y;
      this.arrow.rotation = Phaser.Math.angleBetween(this.x, this.y, this.player.x, this.player.y);
      // Start arrow indicator tween if not already running
      if (!this.arrowTween.isRunning) this.arrowTween.start();
    }

    // If the bat has passed the view, kill it
    if (this.bottom < this.game.camera.y) {
      this.kill();
    }
  }
};
