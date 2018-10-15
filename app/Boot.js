RushKnight = {
  // Global game variables
  // Get level and score from localstorage if they exist, otherwise set them to default values
  level: JSON.parse(localStorage.getItem('level')) || 1,
  score: JSON.parse(localStorage.getItem('score')) || 0
};

RushKnight.Boot = function(game) {
  this.game = game;
};

RushKnight.Boot.prototype = {
  preload: function() {
    // Load font to display progress in loading screen
    this.game.load.bitmapFont('ps2p', 'assets/fnt/PressStart2P_0.png', 'assets/fnt/PressStart2P.fnt');
  },
  create: function() {
    this.game.state.start('Load');
  }
};
