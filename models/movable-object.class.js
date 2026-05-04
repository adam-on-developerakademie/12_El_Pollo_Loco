/** Base class for all objects that move within the game world. Extends DrawableObject. */
class MovableObject extends DrawableObject {
  /** Prevents overlapping animation calls; 0 = free, >0 = busy. */
  animationBusy = 0;
  /** Current animation state, e.g. "jump", "dead", or false when idle. */
  action = false;
  /** Whether the current action sound has already been triggered this frame. */
  playSound = false;
  /** Timestamp of the last jump start, used to time jump animation frames. */
  jumpTime = 0;
  /** Timestamp controlling when the next sequence animation frame advances. */
  frameTime = 0;
  /** Current frame index within a sequence animation. */
  currentFrame = 0;
  /** DOM element reference (unused in most subclasses). */
  element;
  /** Random value (0–1) assigned at construction, used for spawn variation. */
  random = Math.random();
  /** Horizontal movement speed in units per dt tick. */
  speed = 4;
  /** True when the object faces left (mirrored rendering). */
  otherDirection = false;
  /** Vertical velocity; positive = upward, negative = falling. */
  speedY = 0;
  /** Gravity deceleration applied each physics tick. */
  acceleration = 2;
  /** Hit points; 0 = dead. */
  energy = 100;
  /** Timestamp set when the object dies, used to time death animation cleanup. */
  dethTime = 0;
  /** Number of salsa bottles the object is carrying. */
  bottlesNumber = 0;
  /** Number of coins the object is carrying. */
  coinsNumber = 0;
  /** True once the object has been hit by a thrown bottle. */
  isDamaged = false;
  /** Slow-motion accumulator for playAnimationSlower(); incremented each frame. */
  slowMotion = 0;
}
