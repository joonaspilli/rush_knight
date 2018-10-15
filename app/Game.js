RushKnight.Game = function(game) {
  this.game = game;
  this.levelTextFadeOutDuration = 1000;
}

RushKnight.Game.prototype = {
  create: function() {
    // Used to check if the level has been finished
    this.levelFinished = false;

    // Init HUD
    this.HUD = RushKnight.HUD.getInstance();
    this.HUD.initialize(this.game, RushKnight.Settings.HUD_FADE_DURATION);

    // This is used to store the current round score
    this.temporaryScore = RushKnight.score;

    // Start physics
    this.game.physics.startSystem(Phaser.Physics.ARCADE);

    // Init music
    this.music = this.game.add.audio(RushKnight.Scripts.choose(['rush_one', 'rush_two', 'theme', 'hall_of_bats']), 1, true);

    // Init level manager (handles level generation)
    this.levelManager = new RushKnight.LevelManager(this.game);

    // Create player
    this.player = new RushKnight.Player(this.game, this.game.world.centerX, -16);
    // Add player to the level manager's obstacle group for depth sorting
    this.levelManager.obstacles.add(this.player);

    // Create bats
    this.initBats();

    // Create vignette
    this.game.add.image(0, 0, 'vignette').fixedToCamera = true;

    // HUD coin
    var hudCoin = this.game.add.sprite(0, 0, 'hudCoin');
    hudCoin.animations.add('spin', [0,1,2,3,4], RushKnight.Settings.COIN_ANIM_SPEED, true);
    hudCoin.animations.play('spin');
    this.HUD.add(hudCoin);

    // Score text
    this.scoreText = this.HUD.addText(16, 4, 'x' + this.temporaryScore);

    // Bring HUD to front
    this.HUD.bringToTop();
    // Hide HUD
    this.HUD.hide();

    // Initialize the big text (will show level info when level starts)
    this.bigText = this.game.add.bitmapText(this.camera.width / 2, this.game.camera.height / 2, 'alagard', 'Corridor ' + RushKnight.level, 16);
    this.bigText.fixedToCamera = true;
    this.bigText.maxWidth = this.game.width;
    this.bigText.anchor.setTo(0.5, 0.5);
    this.bigText.align = 'center';
    this.game.time.events.add(1000, function() {
      this.game.add.tween(this.bigText).to({alpha: 0}, this.levelTextFadeOutDuration, null, true);
    }, this);

    // Set world bounds (a bit over the gameplay area in height)
    this.game.world.setBounds(0, -RushKnight.Settings.CAMERA_START, RushKnight.Settings.MAP_WIDTH * RushKnight.Settings.TILE_SIZE, RushKnight.Settings.CAMERA_START + (RushKnight.Settings.MAP_HEIGHT * RushKnight.Settings.TILE_SIZE) + RushKnight.Settings.CANVAS_SIZE);

    // Init camera
    this.game.camera.y = -RushKnight.Settings.CAMERA_START;

    // Create transition camera tween and start it
    var camStart = this.game.add.tween(this.game.camera).to({y: this.player.y + RushKnight.Settings.CAMERA_OFFSET - this.game.camera.height / 2}, RushKnight.Settings.CAMERA_START_SPEED, null, true);
    // Set camera to follow the player once the tween is complete, activate the player and start background music
    camStart.onComplete.addOnce(function() {
      // Start the actual gameplay once camera tween has finished
      this.player.alive = true;
      this.player.animations.play('run');
      this.music.play();
      this.HUD.show();
    }, this);

    // Start door close sound effect
    this.game.sound.play('door');

    // Set keyboard reset key
    this.keyReset = this.game.input.keyboard.addKey(Phaser.KeyCode.R);
  },
  update: function() {
    // Detect reset
    if (this.game.input.pointer1.duration >= RushKnight.Settings.RESET_TIME || this.keyReset.duration >= RushKnight.Settings.RESET_TIME) {
      this.resetGame();
    }

    // Make camera follow the player with an offset
    if (this.player.alive) this.camera.focusOnXY(this.player.x, this.player.y + RushKnight.Settings.CAMERA_OFFSET);

    // Update level manager (needs to be after adjusting the camera and before collision checks so the background will scroll correctly)
    this.levelManager.update(this.player);

    // Player collision with coins
    this.game.physics.arcade.overlap(this.player, this.levelManager.coins, this.collectCoin, null, this);

    // Player collision with cracks
    this.game.physics.arcade.overlap(this.player, this.levelManager.cracks, this.fall, null, this);

    // Fireball collision with obstacles
    this.game.physics.arcade.overlap(this.player.fireballs, this.levelManager.obstacles, this.fireballDestroy, null, this);

    // Fireball collision with bats
    this.game.physics.arcade.overlap(this.player.fireballs, this.bats, this.fireballDestroy, null, this);

    // Player collision with obstacles
    this.game.physics.arcade.overlap(this.player, this.levelManager.obstacles, this.hitObstacle, null, this);

    // Player collision with bats
    this.game.physics.arcade.overlap(this.player, this.bats, this.batCollision, null, this);

    // Once player reaches the end of the level, end the level
    if (this.player.y > RushKnight.Settings.MAP_HEIGHT * RushKnight.Settings.TILE_SIZE) {
      this.finishLevel();
    }

    // Depth sorting happens here
    this.levelManager.obstacles.sort('y', Phaser.Group.SORT_ASCENDING);

  },
  shutdown: function() {
    // Lets make sure no bat sounds continue playing
    this.bats.forEach(function(bat) { bat.kill(); });
  },
  render: function() {
    /*
    this.game.debug.body(this.player);

    this.levelManager.cracks.forEach(function(e) {
      this.game.debug.body(e);
    }, this);

    this.levelManager.obstacles.forEach(function(e) {
      this.game.debug.body(e);
    }, this);

    this.levelManager.coins.forEach(function(e) {
      this.game.debug.body(e);
    }, this);

    this.bats.forEach(function(e) {
      this.game.debug.body(e);
    }, this);
    */
  },
  initBats: function() {
    // Group for bats
    this.bats = this.game.add.group();

    // If we've set bat max to zero, just return
    if (RushKnight.Settings.BATS_MAX === 0) return;

    // Get the amount of bats we're going to spawn, decreased by one because of how settings are set up (just ignore the -1's)
    var amount = RushKnight.Scripts.getRandomInt(RushKnight.Settings.BATS_MIN - 1, RushKnight.Settings.BATS_MAX - 1);
    amount += RushKnight.level;

    // Here's the loop for creating bats
    for (var i = 0; i < amount; ++i) {
      var failSafe = 4; // How many times we're going to try again to get a new y-axis position before moving on

      // Here we get a y-axis coordinate for the bat and check if it's enough far away from other bats
      while (true) {
        var enoughDistance = 0; // Increased if distance to a bat is enough, then checked against the amount of bats at the end of loop

        // Get random coordinates
        var yCoord = RushKnight.Scripts.getRandomInt(RushKnight.Settings.BATS_START_MARGIN, RushKnight.Settings.MAP_HEIGHT - 1);
        yCoord *= RushKnight.Settings.TILE_SIZE;

        // If no other bats exist yet, this one is good to go
        if (this.bats.length === 0) break;

        // Check the y-axis distance to all other bats and if its not great enough, we're going to get a new coordinate
        this.bats.forEach(function(bat) {
          if (Phaser.Math.distance(0, yCoord, 0, bat.y) >= RushKnight.Settings.BATS_MIN_DISTANCE) {
            ++enoughDistance;
          }
        });

        --failSafe; // Decrease the number of tries

        // If distance to all other bats was enough or we've already tried enough times, move on and spawn the bat
        if (enoughDistance === this.bats.length || failSafe === 0) break;
      }

      // Create a bat
      var bat = new RushKnight.Bat(this.game, 0, yCoord, this.player);

      // Add the bat to the group
      this.bats.add(bat);
    }
  },
  collectCoin: function(player, coin) {
    if (player.alive) {
      this.game.sound.play('coin');
      coin.kill();
      ++this.temporaryScore;
      this.scoreText.text = 'x' + this.temporaryScore;
      if (this.temporaryScore >= RushKnight.Settings.COIN_GOAL) this.endGame();
    }
  },
  fall: function(player, crack) {
    if (player.alive &&
        player.animations.currentAnim.name != 'jump' &&
        player.body.bottom < crack.body.bottom) {
      player.y = crack.y;
      player.animations.play('fall');
      this.death();
    }
  },
  hitObstacle: function(player, obstacle) {
    if (player.alive && player.body.bottom < obstacle.body.bottom) {
      player.knockOut();
      this.death();
    }
  },
  fireballDestroy: function(fireball, other) {
    // As player is in the same group with obstacles, we don't want to kill him
    if (fireball.alive && other !== this.player) {
      fireball.explode(other.body.center.x, other.body.center.y);
      fireball.kill();
      other.kill();
    }
  },
  batCollision: function(player, bat) {
    if (player.alive) {
      if (player.animations.currentAnim.name === 'sword') {
        bat.kill();
        this.game.sound.play('stab');
      } else {
        player.knockOut();
        this.death();
      }
    }
  },
  death: function() {
    var musicFadeDuration = 250;
    var musicVolume = 0.20;
    var hudFadeDuration = 100;
    var fadeDelay = 500;
    var textFadeInDuration = 1000;
    var fadeOutDuration = 1500;

    this.player.alive = false;
    this.music.fadeTo(musicFadeDuration, musicVolume);
    this.HUD.fadeOut();
    this.bigText.text = 'YOU DIED';
    this.game.time.events.add(fadeDelay, function() {
      this.game.sound.play('gameOver');
      var textFade = this.game.add.tween(this.bigText).to({alpha: 1}, textFadeInDuration, null, true);
      textFade.onComplete.addOnce(function() {
        RushKnight.Scripts.changeState(this, null, fadeOutDuration, 'Game', this.music);
      }, this);
    }, this);
  },
  finishLevel: function() {
    if (!this.levelFinished) {
    this.levelFinished = true;

      var hudFadeDuration = 100;
      var textFadeDuration = 500;
      var fadeDelay = 2500;
      var fadeDuration = 500;
      var continueText = RushKnight.Scripts.choose([
        'With great perseverance, the knight continued...',
        'Overwhelmed by the amount of junk, the knight endured...',
        'The next corridor awaited the exhausted knight...'
      ]);

      RushKnight.score = this.temporaryScore;
      ++RushKnight.level;
      RushKnight.Scripts.saveGame();

      this.HUD.fadeOut();
      this.bigText.text = continueText;
      this.game.add.tween(this.bigText).to({alpha: 1}, textFadeDuration, null, true);
      this.game.time.events.add(fadeDelay, function() {
        RushKnight.Scripts.changeState(this, null, fadeDuration, 'Game', this.music);
      }, this);
    }
  },
  endGame: function() {
    var flashDuration = 1000;
    var fadeDelay = 4000;
    var fadeDuration = 5000;

    this.HUD.fadeOut();
    this.player.alive = false;
    this.player.animations.stop();
    this.bats.forEach(function(e) { e.kill(); });
    this.game.sound.stopAll();
    this.game.sound.play('last_coin');
    this.game.camera.flash(0xffffff, flashDuration, true);
    this.game.time.events.add(fadeDelay, function() {
      var music = this.game.sound.play('the_end', 1, true);
      RushKnight.Scripts.changeState(this, 0xffffff, fadeDuration, 'End', null, music);
    }, this);
  },
  resetGame: function() {
    this.game.sound.stopAll();
    RushKnight.score = 0;
    RushKnight.level = 1;
    RushKnight.Scripts.saveGame();
    this.game.state.start('Game');
  }
};
