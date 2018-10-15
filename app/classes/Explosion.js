RushKnight.Explosion = function(game, x, y) {
  Phaser.Sprite.call(this, game, x, y, 'explosion');
  this.game = game;

  // Set anchor point
  this.anchor.setTo(0.5, 0.5);

  // Add scaling tween
  var explodeTween = this.game.add.tween(this.scale).to({x: 2, y: 2}, RushKnight.Settings.EXPLOSION_SCALE_SPEED);

  // Once the scaling tween has played, reset scale back to 1
  explodeTween.onComplete.add(function() {
    this.scale.setTo(1, 1);
  }, this);

  // Add animation
  var explodeAnim = this.animations.add('explode', [0,1,2,3], RushKnight.Settings.EXPLOSION_ANIM_SPEED);

  // Automatically start scale tween when animation is played
  explodeAnim.onStart.add(function() {
    explodeTween.start();
  });

  // Kill the sprite when animation is complete
  explodeAnim.killOnComplete = true;

  // Kill this when created
  this.kill();

  // Add this to the current game
  this.game.add.existing(this);
};

RushKnight.Explosion.prototype = Object.create(Phaser.Sprite.prototype);
RushKnight.Explosion.prototype.constructor = RushKnight.Explosion;

RushKnight.Explosion.prototype.explode = function(x, y) {
  this.reset(x, y);
  this.animations.play('explode');
  this.game.sound.play('explosion');
};
