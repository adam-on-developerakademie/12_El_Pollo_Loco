/** On-screen button input bindings for Character. */

/**
 * Registers touch and pointer listeners on all on-screen control buttons.
 */
Character.prototype.buttonPressEvent = function () {
  this.bindControlButton("left", "LEFT");
  this.bindControlButton("right", "RIGHT");
  this.bindControlButton("jump", "UP");
  this.bindControlButton("throw", "SPACE");
};

/**
 * Creates an event handler that sets a keyboard key to a given value.
 * @param {string} key - The keyboard key name (e.g. 'LEFT', 'RIGHT').
 * @param {boolean} value - True to press, false to release.
 * @returns {Function} Event handler function.
 */
Character.prototype.createKeyHandler = function (key, value) {
  return (event) => {
    if (event.cancelable) {
      event.preventDefault();
    }
    if (!this.world || !this.world.keyboard) {
      return;
    }
    this.world.keyboard[key] = value;
  };
};

/**
 * Attaches press/release handlers for all relevant pointer and touch events to a button element.
 * @param {string} buttonId - The DOM id of the button to bind.
 * @param {string} key - The keyboard key name to toggle when the button is pressed.
 */
Character.prototype.bindControlButton = function (buttonId, key) {
  const button = document.getElementById(buttonId);
  if (!button) {
    return;
  }

  const press = this.createKeyHandler(key, true);
  const release = this.createKeyHandler(key, false);

  button.ontouchstart = press;
  button.ontouchend = release;
  button.ontouchcancel = release;
  button.onpointerdown = press;
  button.onpointerup = release;
  button.onpointercancel = release;
  button.onpointerleave = release;
  button.onmousedown = press;
  button.onmouseup = release;
  button.onmouseleave = release;
};
