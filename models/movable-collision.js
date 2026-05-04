/** Collision-related methods for MovableObject. */

/**
 * Checks whether this object is colliding with another movable object on all four sides.
 * @param {MovableObject} mo - The other object to check against.
 * @returns {boolean} True when a full overlap (AABB) is detected.
 */
MovableObject.prototype.isColliding = function (mo) {
  return (
    this.leftSideCollision(mo) &&
    this.topSideCollision(mo) &&
    this.rightSideCollision(mo) &&
    this.bottomSideCollision(mo)
  );
};

/**
 * Returns true when the right edge of this object exceeds the left edge of mo.
 * @param {MovableObject} mo - The other object.
 * @returns {boolean}
 */
MovableObject.prototype.leftSideCollision = function (mo) {
  return (
    this.x +
      this.distanceLeft +
      this.width -
      this.distanceRight -
      this.distanceLeft >
    mo.x + mo.distanceLeft
  );
};

/**
 * Returns true when the bottom edge of this object exceeds the top edge of mo.
 * @param {MovableObject} mo - The other object.
 * @returns {boolean}
 */
MovableObject.prototype.topSideCollision = function (mo) {
  return (
    this.y +
      this.distanceTop +
      this.height -
      this.distanceBottom -
      this.distanceTop >
    mo.y + mo.distanceTop
  );
};

/**
 * Returns true when the left edge of this object is still to the left of mo's right edge.
 * @param {MovableObject} mo - The other object.
 * @returns {boolean}
 */
MovableObject.prototype.rightSideCollision = function (mo) {
  return (
    this.x + this.distanceLeft <
    mo.x + mo.distanceLeft + mo.width - mo.distanceRight - mo.distanceLeft
  );
};

/**
 * Returns true when the top edge of this object is still above mo's bottom edge.
 * @param {MovableObject} mo - The other object.
 * @returns {boolean}
 */
MovableObject.prototype.bottomSideCollision = function (mo) {
  return (
    this.y + this.distanceTop <
    mo.y + mo.distanceTop + mo.height - mo.distanceBottom - mo.distanceTop
  );
};
