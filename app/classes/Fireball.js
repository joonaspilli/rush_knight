RushKnight.Fireball = function(game, x, y) {
  Phaser.Sprite.call(this, game, x, y, 'fireball');
  this.game = game;

  // Get movement speed
  this.speed = RushKnight.Settings.FIREBALL_SPEED;

  // Init explosion sprite
  this.explosion = new RushKnight.Explosion(this.game, 0, 0);

  // Init physics and adjust body size
  this.game.physics.arcade.enable(this);
  this.body.setSize(9, 6, 3, 8);

  // Set anchor to center
  this.anchor.setTo(0.5, 0.5);

  // Add and play the flame animation
  this.animations.add('flame', [0,1,2,3,4,5], RushKnight.Settings.FIREBALL_ANIM_SPEED, true);
  this.animations.play('flame');

  // Add the scaling tween
  this.fadeTween = this.game.add.tween(this.scale).to({x: 1, y: 1}, RushKnight.Settings.FIREBALL_SCALE_SPEED);

  this.game.add.existing(this);
};

RushKnight.Fireball.prototype = Object.create(Phaser.Sprite.prototype);
RushKnight.Fireball.prototype.constructor = RushKnight.Fireball;

RushKnight.Fireball.prototype.shoot = function() {
  this.scale.setTo(0, 0);
  this.fadeTween.start();
};

RushKnight.Fireball.prototype.explode = function(x, y) {
  this.explosion.explode(x, y);
};

RushKnight.Fireball.prototype.update = function() {
  if (this.alive) {
    this.y += this.speed;

    if (this.body.top > this.game.camera.y + this.game.camera.height) {
      this.kill();
    }
  }
};
