RushKnight.HUD = (function() {
  var instance;

  function createInstance() {
    return {
      initialize: function(game, fadeDuration) {
        this.game = game;

        // HUD elements
        this.elements = game.add.group();
        this.elements.fixedToCamera = true;

        // Add fading tweens to HUD
        this.fadeOutTween = game.add.tween(this.elements).to({alpha: 0}, fadeDuration);
        this.fadeInTween = game.add.tween(this.elements).to({alpha: 1}, fadeDuration);

        // Wild elements are not fixed to camera nor affected by actions on HUD (such as fading), but are controlled somewhere else
        this.wildElements = game.add.group();
      },
      add: function(child) {
        this.elements.add(child);
        return child;
      },
      addWild: function(child) {
        this.wildElements.add(child);
        return child;
      },
      addText: function(x, y, text, anchor, name) {
        var text = this.game.add.bitmapText(x, y, 'ps2p', text, 8);
        if (anchor) {
          text.anchor.setTo(anchor.x ? anchor.x : 0, anchor.y ? anchor.y : 0);
        }
        if (name) text.name = name;
        this.add(text);
        return text;
      },
      remove: function(child) {
        var childToRemove;
        childToRemove = typeof child === 'string' ? this.getChild(child) : child;
        this.elements.remove(childToRemove);
      },
      removeWild: function(child) {
        this.wildElements.remove(child);
      },
      getChild: function(child) {
        return this.elements.getByName(child);
      },
      hide: function() {
        this.elements.alpha = 0;
      },
      show: function() {
        this.elements.alpha = 1;
      },
      fadeOut: function() {
        this.fadeOutTween.start();
      },
      fadeIn: function() {
        this.fadeInTween.start();
      },
      bringToTop: function() {
        this.game.world.bringToTop(this.elements);
        this.game.world.bringToTop(this.wildElements);
      }
    };
  }

  return {
    getInstance: function() {
      if (!instance) instance = createInstance();
      return instance;
    }
  };
})();
