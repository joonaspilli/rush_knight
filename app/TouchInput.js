RushKnight.TouchInput = (function() {
  var input = {
    enabled: false,
    left: false,
    right: false,
    jump: false,
    sword: false,
    shield: false
  };

  function initControl(element, controls, button) {
    document.getElementById(element).addEventListener('touchstart', function() { controls[button] = true; });
    document.getElementById(element).addEventListener('touchend', function() { controls[button] = false; });
  }

  initControl('button-left', input, 'left');
  initControl('button-right', input, 'right');
  initControl('button-jump', input, 'jump');
  initControl('button-sword', input, 'sword');
  initControl('button-shield', input, 'shield');

  return input;
})();
