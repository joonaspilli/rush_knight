RushKnight.LevelManager = function(game) {
  this.game = game;

  // Generation variables
  this.cameraTop = 0;
  this.cameraBottom = 0;
  this.currentRow = RushKnight.Settings.SAFE_ZONE;
  this.createMargin = 1; // How many tiles ahead we're going to reset objects
  this.endMargin = 1; // How many tiles we'll leave empty at the end of level (so it looks better)
  this.crackSpawned = 0;
  this.obstacleSpawned = 0;
  this.coinSpawned = 0;

  // Pool configs
  var cracksPoolSize = 5;
  var coinsPoolSize = 5;
  var obstaclesPoolSize = 16;

  // Init possible possible positions
  this.positions = [];
  for (var i = 0; i < RushKnight.Settings.MAP_WIDTH; ++i) {
    this.positions.push(i);
  }

  // Spritesheet config
  this.coinFrameCount = 5;
  this.obstacleFrameCount = 5;

  // Additional variables
  this.levelLength = RushKnight.Settings.MAP_HEIGHT * RushKnight.Settings.TILE_SIZE;

  // Create spawn image
  this.game.add.image(0, 0, 'spawn').anchor.setTo(0, 1);

  // Create the background ground tilesprite
  this.ground = this.game.add.tileSprite(0, 0, 128, 128, 'ground');

  // Init cracks
  this.cracks = this.game.add.group();
  this.cracks.enableBody = true;
  for (var i = 0; i < cracksPoolSize; ++i) {
    var crack = this.cracks.create(0, 0, 'crack');
    crack.body.setSize(128, 8, 0, 4);
    crack.kill();
  }

  // Init coins
  this.coins = this.game.add.group();
  this.coins.enableBody = true;
  for (var i = 0; i < coinsPoolSize; ++i) {
    var coin = this.coins.create(0, 0, 'coin');
    coin.animations.add('spin', [0,1,2,3,4], RushKnight.Settings.COIN_ANIM_SPEED, true);
    coin.animations.play('spin').frame = RushKnight.Scripts.getRandomInt(0, this.coinFrameCount - 1);
    coin.body.setSize(8, 8, 4, 4);
    coin.kill();
  }

  // Init obstacles
  this.obstacles = this.game.add.group();
  this.obstacles.enableBody = true;
  for (var i = 0; i < obstaclesPoolSize; ++i) {
    var obstacle = this.obstacles.create(0, 0, 'obstacles');
    obstacle.body.setSize(8, 8, 4, 7);
    obstacle.kill();
  }
};


RushKnight.LevelManager.prototype = {
  updateGround: function(player) {
    // Make the background follow the camera within gameplay area
    this.ground.y = this.game.camera.y;
    this.ground.y = RushKnight.Scripts.clamp(this.ground.y, 0, this.levelLength - RushKnight.Settings.CANVAS_SIZE);

    // Scroll the tile when needed
    if (player.alive && this.game.camera.y > 0 && this.cameraBottom <= this.levelLength) {
      this.ground.tilePosition.y -= player.ySpeed;
    }
  },
  killCollidables: function(player) {
    this.cracks.forEachAlive(function(crack) {
      if (crack.bottom <= this.cameraTop) crack.kill();
    }, this);

    this.coins.forEachAlive(function(coin) {
      if (coin.bottom <= this.cameraTop) coin.kill();
    }, this);

    this.obstacles.forEachAlive(function(obstacle) {
      // As the player is added to this group for depth sorting, lets make sure we don't kill him
      if (obstacle !== player && obstacle.bottom <= this.cameraTop) obstacle.kill();
    }, this);
  },
  resetCollidables: function(player) {
    // If we don't need to reset anything yet, return
    if (this.cameraBottom / RushKnight.Settings.TILE_SIZE < this.currentRow) return;

    // If we are outside of the spawning area, do nothing and return
    if (this.currentRow > RushKnight.Settings.MAP_HEIGHT - 1 - this.createMargin - this.endMargin) return;

    // This is used to store the possible coordinates
    var possiblePositions = this.positions.slice();

    // Get the y-axis reset coordinate
    var yPos = (this.currentRow + this.createMargin) * RushKnight.Settings.TILE_SIZE;

    // If the odds win and no crack has been resetted on the last round, we'll reset a crack on this row
    if (RushKnight.Scripts.odds(RushKnight.Settings.CRACK_ODDS * RushKnight.level) && !this.crackSpawned) {
      // Reset a crack
      this.cracks.getFirstDead(false, 0, yPos);

      // This makes sure we won't have two cracks right after each other (value will become 1 at the end of this method, making it equal to 'true' on the next round)
      this.crackSpawned = 2;

    // If a crack didn't get reset, if odds win and there's enough tiles between the last time we resetted obstacles, reset obstacles
    } else if (RushKnight.Scripts.odds(RushKnight.Settings.OBSTACLE_ODDS * RushKnight.level) && !this.obstacleSpawned) {
      // If odds win, we'll reset a random amount of multiple obstacles on this row
      var amount = RushKnight.Scripts.odds(RushKnight.Settings.MULTIPLE_OBSTACLES_ODDS * RushKnight.level) ? RushKnight.Scripts.getRandomInt(2, RushKnight.Settings.MAX_OBSTACLES_LINE) : 1;

      for (var i = 0; i < amount; ++i) {
        // Get an x-axis coordinate
        var xPos = possiblePositions.splice(RushKnight.Scripts.getRandomInt(0, possiblePositions.length - 1), 1)[0] * RushKnight.Settings.TILE_SIZE;

        // Get an obstacle. As the player is added to the obstacles group for depth sorting, we make sure we don't get him
        for (var j = 0; j < this.obstacles.length; ++j) {
          var obstacle = this.obstacles.getAt(j);
          if (obstacle !== player && !obstacle.alive) break;
        }
        // Reset the obstacle with a random frame
        obstacle.reset(xPos, yPos).frame = RushKnight.Scripts.getRandomInt(0, this.obstacleFrameCount - 1);
      }

      // This makes sure we have the desired amount of tiles between obstacles (if space between is 1, this value will become 1 at the end of this method, making it evaluate to 'true' on the next round)
      this.obstacleSpawned = RushKnight.Settings.OBSTACLE_SPACE_BETWEEN + 1;
    }
    // Create a coin if we have enough tiles since the last coin
    if (!this.coinSpawned) {
      // Get a random x-axis coordinate if the current one is occupied
      var xPos = possiblePositions.splice(RushKnight.Scripts.getRandomInt(0, possiblePositions.length - 1), 1)[0] * RushKnight.Settings.TILE_SIZE;

      // Reset a coin
      this.coins.getFirstDead(false, xPos, yPos);

      // This makes sure we have the desired amount of tiles between coins (if space between is 1, this value will become 1 at the end of this method, making it evaluate to 'true' on the next round)
      this.coinSpawned = RushKnight.Settings.COIN_SPACE_BETWEEN + 1;
    }

    ++this.currentRow; // Update when we'll want to reset stuff next time

    // And we update all these values
    if (this.crackSpawned > 0) --this.crackSpawned;
    if (this.obstacleSpawned > 0) --this.obstacleSpawned;
    if (this.coinSpawned > 0) --this.coinSpawned;
  },
  update: function(player) {
    // Update camera variables
    this.cameraBottom = this.game.camera.y + this.game.camera.height;
    this.cameraTop = this.game.camera.y;

    this.updateGround(player);
    this.killCollidables(player);
    this.resetCollidables(player);
  }
};
