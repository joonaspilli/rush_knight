RushKnight.Player = function(game, x, y) {
  Phaser.Sprite.call(this, game, x, y, 'player');

  this.game = game;
  this.xSpeed = RushKnight.Settings.PLAYER_XSPEED;
  this.ySpeed = RushKnight.Settings.PLAYER_YSPEED;

  // Init timers
  this.jumpTime = 0;
  this.swordTime = 0;
  this.shootTime = 0;

  // Horizontal movement clamping margin variables (based on sprite dimensions)
  this.LEFT_CLAMP = 7;
  this.RIGHT_CLAMP = 8;

  /* FIREBALLS */
  this.ammo = RushKnight.level * RushKnight.Settings.FIREBALL_AMMO_INCREMENT;
  this.fireballs = this.game.add.group();
  for (var i = 0; i < RushKnight.Settings.FIREBALL_POOL_SIZE; ++i) {
    var fireball = new RushKnight.Fireball(this.game, 0, 0);
    fireball.kill();
    this.fireballs.add(fireball);
  }

  /* HUD */
  var HUD = RushKnight.HUD.getInstance();

  // HUD fireball
  var hudFireball = this.game.add.sprite(this.game.camera.width, 0, 'hudFireball');
  hudFireball.anchor.x = 1;
  hudFireball.animations.add('flame', [0,1,2,3,4,5], RushKnight.Settings.FIREBALL_ANIM_SPEED, true);
  hudFireball.animations.play('flame');
  HUD.add(hudFireball);

  // Ammo text
  this.ammoText = HUD.addText(game.camera.width - 16, 4, this.ammo + 'x', {x: 1});

  // Fireball reset offset in relation to player coords
  this.fireballOffsetX = 4;
  this.fireballOffsetY = 5;

  /* PHYSICS */
  // Init physics
  this.game.physics.arcade.enable(this);
  // Adjust bounding box size
  this.body.setSize(14, 10, 4, 14);

  /* SPRITE */
  // Center player sprite anchor point
  this.anchor.setTo(0.5, 0.5);

  // Inactivate the player
  this.alive = false;

  /* ANIMATIONS */
  // Add run animation
  this.animations.add('run', [0,1,2,3,4,5], RushKnight.Settings.PLAYER_ANIM_SPEED, true);

  // Add falling animation and signal it to go to death state upon completion
  this.animations.add('fall', [12,13,14,15,16,17], RushKnight.Settings.PLAYER_ANIM_SPEED * 4);

  // Add knockout animation and signal it to go to death state upon completion
  this.animations.add('dead', [18], 0);

  // Add jump animation and signal it to start run animation on complete
  this.animations.add('jump', [8,9,10,11], RushKnight.Settings.PLAYER_ANIM_SPEED).onComplete.add(function() {
    this.animations.play('run');
  }, this);

  // Add sword attack animation and signal it to start run animation on complete
  this.animations.add('sword', [6,7], RushKnight.Settings.PLAYER_ANIM_SPEED).onComplete.add(function() {
    this.animations.play('run');
  }, this);

  /* SOUND EFFECTS */
  this.SFX = {
    jump: this.game.add.audio('jump'),
    sword: this.game.add.audio('sword'),
    shoot: this.game.add.audio('shoot'),
    hit: this.game.add.audio('hit')
  };

  /* INPUT */
  // Init keyboard input variables
  this.keyLeft = this.game.input.keyboard.addKey(Phaser.Keyboard.LEFT);
  this.keyRight = this.game.input.keyboard.addKey(Phaser.Keyboard.RIGHT);
  this.keySpace = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
  this.keySword = this.game.input.keyboard.addKey(Phaser.KeyCode.S);
  this.keyShield = this.game.input.keyboard.addKey(Phaser.KeyCode.D);

  // Add this sprite to the game
  this.game.add.existing(this);
};

RushKnight.Player.prototype = Object.create(Phaser.Sprite.prototype);
RushKnight.Player.prototype.constructor = RushKnight.Player;

RushKnight.Player.prototype.jump = function() {
  if (this.game.time.now > this.jumpTime && this.animations.currentAnim.name === 'run') {
    this.SFX.jump.play();
    this.animations.play('jump');
    this.jumpTime = this.game.time.now + RushKnight.Settings.PLAYER_JUMPTIME;
  }
};

RushKnight.Player.prototype.sword = function() {
  if (this.game.time.now > this.swordTime && this.animations.currentAnim.name === 'run') {
    this.SFX.sword.play();
    this.animations.play('sword');
    this.swordTime = this.game.time.now + RushKnight.Settings.PLAYER_SWORDTIME;
  }
};

RushKnight.Player.prototype.shield = function() {
  if (this.game.time.now > this.shootTime && this.ammo > 0) {
    // Play sound effect
    this.SFX.shoot.play();
    // Get a fireball and reset it
    var fireball = this.fireballs.getFirstDead(false, this.x + this.fireballOffsetX, this.y + this.fireballOffsetY);
    // Start fireball's tween
    fireball.shoot();
    // Decrease ammo
    --this.ammo;
    // Update ammo text
    this.ammoText.text = this.ammo + 'x';
    // Reset shoot timer
    this.shootTime = this.game.time.now + RushKnight.Settings.PLAYER_SHOOTTIME;
  }
};

RushKnight.Player.prototype.knockOut = function() {
  var blowBackDistance = 12; // Distance the player will blowback
  var flyDuration = 100; // Duration of blowback tween

  // Play sound effect
  this.SFX.hit.play();

  // Freeze animation
  this.animations.stop();
  // Get new y coord where we'll tween the player
  var newY = this.y - blowBackDistance;
  // Add and play knockback tween
  this.game.add.tween(this).to({y: newY}, flyDuration, null, true).onComplete.addOnce(function() {
    // Play death animation
    this.animations.play('dead');
  }, this);
};

RushKnight.Player.prototype.update = function() {
  if (this.alive) {
    // Attack with sword if pressed
    if (this.keySword.isDown || RushKnight.TouchInput.sword) this.sword();

    // Attack with shield (shoot) if pressed
    if (this.keyShield.isDown || RushKnight.TouchInput.shield) this.shield();

    // Jump if space or jump button is pressed
    if (this.keySpace.isDown || RushKnight.TouchInput.jump) this.jump();

    // Get movement on y axis
    this.y += this.ySpeed;

    // Get movement on x axis
    var xMove = (this.keyRight.isDown || RushKnight.TouchInput.right) - (this.keyLeft.isDown || RushKnight.TouchInput.left);

    // Move player on x axis
    this.x += xMove * this.xSpeed;

    // Clamp x coordinate
    this.x = this.game.math.clamp(this.x, this.LEFT_CLAMP, RushKnight.Settings.CANVAS_SIZE - this.RIGHT_CLAMP);
  }
};
