RushKnight.Settings = {
  /* INFO:
   * All "odds" values defined here are initial values, which are multiplied
   * by level count during gameplay.
   */

  // Canvas
  CANVAS_SIZE: 128, // Game canvas initial size
  CANVAS_MAX_SIZE: 512, // Max size when scaled

  // Common game
  TILE_SIZE: 16, // Pixels
  SPAWN_HEIGHT: 5, // * Tile size
  MAP_WIDTH: 8, // * Tile size
  MAP_HEIGHT: 192, // * Tile size
  COIN_GOAL: 300, // Amount of coins player needs to collect to finish the game
  RESET_TIME: 2000, // How long reset button needs to be held down before resetting

  // Camera
  CAMERA_START: 256, // Y-position of camera and is used to set world bounds
  CAMERA_START_SPEED: 3000, // Time (ms) of how long it takes for the camera to move to the player at the start
  CAMERA_OFFSET: 16, // Y-axis offset to player in pixels

  // HUD
  HUD_FADE_DURATION: 100, // Duration of hud fade in/out (ms)

  // Player
  PLAYER_XSPEED: 2, // Horizontal moving speed
  PLAYER_YSPEED: 1, // Vertical moving speed
  PLAYER_JUMPTIME: 500, // Time (ms) between jumps
  PLAYER_SWORDTIME: 500, // Time (ms) between sword attacks
  PLAYER_SHOOTTIME: 500, // Time (ms) between shoot attacks
  PLAYER_ANIM_SPEED: 11, // Player animation speed

  // Fireballs
  FIREBALL_POOL_SIZE: 3, // Amount of fireballs initiated
  FIREBALL_SPEED: 3, // Fireball movement speed on y axis
  FIREBALL_AMMO_INCREMENT: 2, // How many fireballs player receives at the start of each level
  FIREBALL_ANIM_SPEED: 10, // Fireball animation speed
  FIREBALL_SCALE_SPEED: 200, // Speed of fireball enlargening

  // Explosion
  EXPLOSION_ANIM_SPEED: 20, // Explosion animation speed
  EXPLOSION_SCALE_SPEED: 250, // Speed of explosion enlargening

  // Level
  SAFE_ZONE: 1, // Number of tiles before generation starts
  CRACK_ODDS: 5, // Odds (%) of a crack getting created
  OBSTACLE_ODDS: 20, // Odds (%) of obstacles spawning on tile line
  MULTIPLE_OBSTACLES_ODDS: 20, // Odds (%) of multiple obstacles spawning per line
  MAX_OBSTACLES_LINE: 2, // Max amount of obstacles per line (minimum of 2)
  OBSTACLE_SPACE_BETWEEN: 1, // The min amount of LINES between obstacles
  COIN_SPACE_BETWEEN: 1, // Number of tiles between coins
  COIN_ANIM_SPEED: 10, // Coin animation speed

  // BATS
  BATS_START_MARGIN: 10, // Number of tiles before any bats can appear
  BATS_MIN: 0, // Min amount of bats (increased by level)
  BATS_MAX: 2, // Max amount of bats (increased by level)
  BATS_XSPEED: 0.075, // Movement speed on x axis
  BATS_YSPEED: 0.8, // Movement speed on y axis
  BATS_ANIM_SPEED: 15, // Animation speed of bats
  BATS_MIN_DISTANCE: 64, // Minimum distance (px) between bats when spawned
  BATS_INDICATOR_BLINK_SPEED: 100 // How fast the arrow indicator blinks
};
