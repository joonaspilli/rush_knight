RushKnight.Scripts = {
  changeState: function(game, fadeColor, fadeDuration, newState, sound, parameters) {
    if (sound) sound.fadeOut(fadeDuration);
    game.camera.fade(fadeColor, fadeDuration, true);
    game.camera.onFadeComplete.addOnce(function() {
      if (sound) sound.stop();
      game.state.start(newState, true, false, parameters);
    }, game);
  },
  saveGame: function() {
    // This is used to save progress to the local storage
    localStorage.setItem('score', RushKnight.score);
    localStorage.setItem('level', RushKnight.level);
  },
  getRandomInt: function(min, max) {
    // Returns random integer between given range
    return Math.floor(Math.random() * (max - min + 1)) + min;
  },
  choose: function(options) {
    // Returns random value from array
    return options[this.getRandomInt(0, options.length - 1)];
  },
  odds: function(odds) {
    return this.getRandomInt(1, 100) <= odds;
  },
  clamp: function(value, min, max) {
    if (value < min) return min;
    else if (value > max) return max;
    else return value;
  }
};
