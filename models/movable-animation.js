/** Animation methods for MovableObject. */

/**
 * Plays the next frame from the given image array and optionally plays a sound.
 * Marks the object as no longer alive once the death animation completes.
 * @param {string[]} images - Array of image paths for the animation.
 * @param {HTMLAudioElement|null} sound - Sound to play each frame, or null.
 * @param {number} soundVolume - Volume level for the sound (0–1).
 */
MovableObject.prototype.playAnimation = function (images, sound, soundVolume) {
  const i = this.curentImage % images.length;
  const path = images[i];
  this.img = this.imageCache[path];
  this.curentImage++;

  if (this.alive && this.action != "dead") {
    if (sound) {
      sound.play();
      sound.volume = soundVolume;
    }
  } else if (this.alive && this.action == "dead") {
    if (sound) {
      sound.play();
      sound.volume = soundVolume;
    }
    this.alive = false;
  }
};

/**
 * Plays the animation at a reduced frame rate controlled by the `slower` divisor.
 * @param {string[]} images - Array of image paths for the animation.
 * @param {HTMLAudioElement|null} sound - Sound to play on each real frame advance.
 * @param {number} slower - Number of ticks to wait before advancing one frame.
 * @param {number} soundVolume - Volume level for the sound (0–1).
 */
MovableObject.prototype.playAnimationSlower = function (images, sound, slower, soundVolume) {
  const i = this.curentImage % images.length;
  const path = images[i];
  this.img = this.imageCache[path];
  this.slowMotion++;

  if (this.slowMotion >= slower) {
    if (sound) {
      sound.play();
      sound.volume = soundVolume;
    }
    this.slowMotion -= slower;
    this.curentImage++;
  }
};

/**
 * Starts a timed sequence animation, switching to a damage animation when hit.
 * @param {string[]} IMAGES - Normal animation image array.
 * @param {number} animationSpeed - Milliseconds between frames.
 * @param {number} repeatAnimation - Number of loops to play.
 * @param {string[]} isDamagedIMAGES - Damage animation image array.
 * @param {number} isDamagedAnimationSpeed - Frame speed for damage animation.
 * @param {number} isDamagedRepeatAnimation - Loop count for damage animation.
 * @returns {string} Path of the initial image.
 */
MovableObject.prototype.animatedImage = function (
  IMAGES,
  animationSpeed,
  repeatAnimation,
  isDamagedIMAGES,
  isDamagedAnimationSpeed,
  isDamagedRepeatAnimation
) {
  const condition = this.isDamaged;
  const n = IMAGES.length;
  let currentImage = IMAGES[0];

  for (let j = 0; j < repeatAnimation; j++) {
    let i = 0;
    setTimeout(() => {
      this.currentImage(
        IMAGES,
        animationSpeed,
        i,
        n,
        currentImage,
        condition,
        isDamagedIMAGES,
        isDamagedAnimationSpeed,
        isDamagedRepeatAnimation
      );
    }, (j * 1000) / IMAGES.length);
  }

  return currentImage;
};

/**
 * Internal interval-based loop that advances frames and switches to the damage animation on hit.
 * @param {string[]} IMAGES - Image array for the current animation.
 * @param {number} animationSpeed - Milliseconds per frame.
 * @param {number} i - Starting frame index (by reference via closure).
 * @param {number} n - Total number of frames.
 * @param {string} currentImage - Current image path (by reference via closure).
 * @param {boolean} condition - Damage state captured at animation start.
 * @param {string[]} isDamagedIMAGES - Image array for the damage animation.
 * @param {number} isDamagedAnimationSpeed - Frame speed for damage animation.
 * @param {number} isDamagedRepeatAnimation - Loop count for damage animation.
 * @returns {void}
 */
MovableObject.prototype.currentImage = function (
  IMAGES,
  animationSpeed,
  i,
  n,
  currentImage,
  condition,
  isDamagedIMAGES,
  isDamagedAnimationSpeed,
  isDamagedRepeatAnimation
) {
  const intervalId = setInterval(() => {
    if (i < n) {
      currentImage = this.loadImage(IMAGES[i]);
      if (condition != this.isDamaged) {
        clearInterval(intervalId);
        this.animatedImage(
          isDamagedIMAGES,
          isDamagedAnimationSpeed,
          isDamagedRepeatAnimation
        );
      }
      i++;
    } else {
      clearInterval(intervalId);
    }
  }, animationSpeed);

  return (i, currentImage);
};

/**
 * Plays the jump animation frame that matches the current elapsed time since jump start.
 * @param {string[]} images - Jump animation image paths.
 * @param {HTMLAudioElement|null} sound - Jump sound.
 * @param {number} soundVolume - Volume for the jump sound.
 */
MovableObject.prototype.playAnimationJump = function (images, sound, soundVolume) {
  if (this.action == "jump") {
    this.playJumpSoundOnce(sound, soundVolume);
    const frameIndex = this.getJumpFrameIndex();
    this.updateJumpFrame(images, frameIndex);
  }
};

/**
 * Plays the jump sound exactly once per jump by checking and setting `playSound`.
 * @param {HTMLAudioElement|null} sound - The sound to play.
 * @param {number} soundVolume - Volume level.
 */
MovableObject.prototype.playJumpSoundOnce = function (sound, soundVolume) {
  if (this.playSound == false) {
    if (sound) {
      sound.play();
      sound.volume = soundVolume;
    }
    this.playSound = true;
  }
};

/**
 * Returns the frame index for the jump animation based on time elapsed since jump start.
 * Returns -1 when the jump animation should stop.
 * @returns {number} Frame index (0–5) or -1.
 */
MovableObject.prototype.getJumpFrameIndex = function () {
  const elapsed = new Date().getTime() - this.jumpTime;
  const timings = [300, 500, 800, 900, 1000, 1100];
  for (let i = 0; i < timings.length; i++) {
    if (elapsed < timings[i]) {
      return i;
    }
  }
  return -1;
};

/**
 * Applies the correct jump frame image and ends the jump action when the last frame is reached.
 * @param {string[]} images - Jump animation image paths.
 * @param {number} frameIndex - Frame index returned by getJumpFrameIndex.
 */
MovableObject.prototype.updateJumpFrame = function (images, frameIndex) {
  if (frameIndex >= 0 && frameIndex < images.length) {
    this.img = this.imageCache[images[frameIndex]];
  }
  if (frameIndex >= 5) {
    this.action = false;
    this.playSound = false;
  }
};

/**
 * Plays a sequence animation over a fixed duration, advancing one frame at a time.
 * @param {string[]} images - Ordered image paths for the sequence.
 * @param {number} duration - Total duration of one sequence play-through in seconds.
 * @param {HTMLAudioElement|null} sound - Optional sound (unused — kept for API compatibility).
 */
MovableObject.prototype.playSequenceAnimation = function (images, duration, sound) {
  let nowTime = new Date().getTime();
  if (this.jumpTime < nowTime) {
    this.jumpTime = nowTime + duration * 1000;
    this.currentFrame = 0;
  }

  if (this.jumpTime > nowTime) {
    if (this.frameTime < nowTime) {
      this.frameTime = nowTime + (duration / images.length) * 1000;
      if (images[this.currentFrame]) {
        this.img = this.imageCache[images[this.currentFrame]];
      } else {
        this.img = this.imageCache["./img/2-character-pepe/3-jump/j-31.png"];
      }
      this.currentFrame++;
    }
  }
};
