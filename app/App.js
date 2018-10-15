window.addEventListener('load', function() {
  // Create the game
  var game = new Phaser.Game(RushKnight.Settings.CANVAS_SIZE, RushKnight.Settings.CANVAS_SIZE, Phaser.CANVAS, 'game', null, false, false);

  // Create states
  game.state.add('Boot', RushKnight.Boot);
  game.state.add('Load', RushKnight.Load);
  game.state.add('InputConfirm', RushKnight.InputConfirm);
  game.state.add('Credits', RushKnight.Credits);
  game.state.add('Menu', RushKnight.Menu);
  game.state.add('Game', RushKnight.Game);
  game.state.add('End', RushKnight.End);

  // Start load state
  game.state.start('Boot');
});
