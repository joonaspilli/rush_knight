RushKnight.Load = function(game) {
  this.game = game;
}

RushKnight.Load.prototype = {
  init: function() {
    /* SCALING THE GAME */
    this.game.scale.maxWidth = RushKnight.Settings.CANVAS_MAX_SIZE;
    this.game.scale.maxHeight = RushKnight.Settings.CANVAS_MAX_SIZE;
    this.game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
    this.game.renderer.renderSession.roundPixels = true; // This fixes ugly pixel distortions, especially on small screens
  },
  preload: function() {
    /* CREATE LOAD PROGRESS TEXT */
    this.progress = this.game.add.bitmapText(this.camera.width / 2, this.game.camera.height / 2, 'ps2p', 'Loading 0%', 8);
    this.progress.anchor.setTo(0.5, 0.5);
    this.progress.align = 'center';

    /* MUSIC */
    this.game.load.audio('theme', ['assets/snd/rush_knight_theme.mp3', 'assets/snd/rush_knight_theme.ogg']);
    this.game.load.audio('rush_one', ['assets/snd/rush_one.mp3', 'assets/snd/rush_one.ogg']);
    this.game.load.audio('rush_two', ['assets/snd/rush_two.mp3', 'assets/snd/rush_two.ogg']);
    this.game.load.audio('the_end', ['assets/snd/the_end.mp3', 'assets/snd/the_end.ogg']);
    this.game.load.audio('hall_of_bats', ['assets/snd/hall_of_bats.mp3', 'assets/snd/hall_of_bats.ogg']);

    /* SOUND EFFECTS */
    this.game.load.audio('door', ['assets/snd/door.mp3', 'assets/snd/door.ogg']);
    this.game.load.audio('coin', ['assets/snd/coin.mp3', 'assets/snd/coin.ogg']);
    this.game.load.audio('last_coin', ['assets/snd/last_coin.mp3', 'assets/snd/last_coin.ogg']);
    this.game.load.audio('jump', ['assets/snd/jump.mp3', 'assets/snd/jump.ogg']);
    this.game.load.audio('sword', ['assets/snd/sword_swing.mp3', 'assets/snd/sword_swing.ogg']);
    this.game.load.audio('hit', ['assets/snd/hit.mp3', 'assets/snd/hit.ogg']);
    this.game.load.audio('stab', ['assets/snd/stab.mp3', 'assets/snd/stab.ogg']);
    this.game.load.audio('shoot', ['assets/snd/shoot.mp3', 'assets/snd/shoot.ogg']);
    this.game.load.audio('explosion', ['assets/snd/explosion.mp3', 'assets/snd/explosion.ogg']);
    this.game.load.audio('flap', ['assets/snd/bat_wings.mp3', 'assets/snd/bat_wings.ogg']);
    this.game.load.audio('gameOver', ['assets/snd/gameover.mp3', 'assets/snd/gameover.ogg']);

    /* FONTS */
    this.game.load.bitmapFont('alagard', 'assets/fnt/alagard_0.png', 'assets/fnt/alagard.fnt');

    /* UI AND EXTRA STUFF */
    this.game.load.spritesheet('hudCoin', 'assets/img/hud_coin.png', 16, 16);
    this.game.load.image('vignette', 'assets/img/vignette.png');
    this.game.load.image('titleScreen', 'assets/img/titlescreen.png');
    this.game.load.image('devious_logo', 'assets/img/devious.png');
    this.game.load.image('endScreen', 'assets/img/endscreen.png');
    this.game.load.image('textBG', 'assets/img/text_bg.png');
    this.game.load.image('arrow', 'assets/img/arrow.png');

    /* ACTUAL GAME WORLD */
    this.game.load.image('spawn', 'assets/img/spawn.png');
    this.game.load.image('ground', 'assets/img/ground.png');
    this.game.load.image('crack', 'assets/img/crack.png');
    this.game.load.spritesheet('obstacles', 'assets/img/obstacles.png', 16, 16);
    this.game.load.spritesheet('coin', 'assets/img/coin.png', 16, 16);
    this.game.load.spritesheet('bat', 'assets/img/bat.png', 16, 32);
    this.game.load.spritesheet('player', 'assets/img/player.png', 22, 27);
    this.game.load.spritesheet('hudFireball', 'assets/img/hud_fireball.png', 16, 16);
    this.game.load.spritesheet('fireball', 'assets/img/fireball.png', 16, 24);
    this.game.load.spritesheet('explosion', 'assets/img/explosion.png', 32, 32);
  },
  loadUpdate: function() {
    // Update progress text
    this.progress.text = 'Loading ' + this.load.progress + '%';
  },
  create: function() {
    // Once loading assets is complete but decoding essential music files is still in progress, this text will show
    this.progress.text = 'Decoding\nmusic...';
  },
  update: function() {
    // Make sure the bigger sound assets have finished decoding before moving on
    if (this.cache.isSoundDecoded('theme') &&
        this.cache.isSoundDecoded('door') &&
        this.cache.isSoundDecoded('rush_one') &&
        this.cache.isSoundDecoded('rush_two') &&
        this.cache.isSoundDecoded('the_end') &&
        this.cache.isSoundDecoded('hall_of_bats')) {
      this.game.state.start('InputConfirm');
    }
  }
};
