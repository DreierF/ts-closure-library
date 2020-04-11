import * as googcolor from './../color/color.js';
import * as goog_events from './../events/eventhandler.js';
import {EventHandler} from './../events/eventhandler.js';
import * as google from './../google.js';
import * as bidi from './../style/bidi.js';
import * as style from './../style/style.js';
import {Animation} from './animation.js';
import {Transition} from './transition.js';
import {EventType} from './transition.js';
// Copyright 2005 The Closure Library Authors. All Rights Reserved.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS-IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

/**
 * @fileoverview Predefined DHTML animations such as slide, resize and fade.
 *
 * @see ../demos/effects.html
 */

/**
 * Abstract class that provides reusable functionality for predefined animations
 * that manipulate a single DOM element
 *
 * @extends {Animation}
 * @class
 */
class PredefinedEffect extends Animation {

  /**
   * Abstract class that provides reusable functionality for predefined animations
   * that manipulate a single DOM element
   *
   * @param {Element} element Dom Node to be used in the animation.
   * @param {Array<number>} start Array for start coordinates.
   * @param {Array<number>} end Array for end coordinates.
   * @param {number} time Length of animation in milliseconds.
   * @param {Function=} opt_acc Acceleration function, returns 0-1 for inputs 0-1.
   */
  constructor(element, start, end, time, opt_acc) {
    super(start, end, time, opt_acc);
  
    /**
     * DOM Node that will be used in the animation
     * @type {Element}
     */
    this.element = element;
  
    /**
     * Whether the element is rendered right-to-left. We cache this here for
     * efficiency.
     * @private {boolean|undefined}
     */
    this.rightToLeft_;
  }

  /**
   * Called to update the style of the element.
   * @protected
   */
  updateStyle() {}

  /**
   * Whether the DOM element being manipulated is rendered right-to-left.
   * @return {boolean} True if the DOM element is rendered right-to-left, false
   *     otherwise.
   */
  isRightToLeft() {
    if (this.rightToLeft_ === undefined) {
      this.rightToLeft_ = style.isRightToLeft(this.element);
    }
    return this.rightToLeft_;
  };

  /** @override */
  onAnimate() {
    this.updateStyle();
    super.onAnimate();
  };

  /** @override */
  onEnd() {
    this.updateStyle();
    super.onEnd();
  };

  /** @override */
  onBegin() {
    this.updateStyle();
    super.onBegin();
  };
}

/**
 * Creates an animation object that will slide an element from A to B.  (This
 * in effect automatically sets up the onanimate event for an Animation object)
 *
 * Start and End should be 2 dimensional arrays
 *
 * @extends {PredefinedEffect}
 * @class
 */
class Slide extends PredefinedEffect {

  /**
   * Creates an animation object that will slide an element from A to B.  (This
   * in effect automatically sets up the onanimate event for an Animation object)
   *
   * Start and End should be 2 dimensional arrays
   *
   * @param {Element} element Dom Node to be used in the animation.
   * @param {Array<number>} start 2D array for start coordinates (X, Y).
   * @param {Array<number>} end 2D array for end coordinates (X, Y).
   * @param {number} time Length of animation in milliseconds.
   * @param {Function=} opt_acc Acceleration function, returns 0-1 for inputs 0-1.
   */
  constructor(element, start, end, time, opt_acc) {
    if (start.length != 2 || end.length != 2) {
      throw new Error('Start and end points must be 2D');
    }
    super(element, start, end, time, opt_acc);
  }

  /** @override */
  updateStyle() {
    var pos = (this.isRightPositioningForRtlEnabled() && this.isRightToLeft()) ?
        'right' :
        'left';
    this.element.style[pos] = Math.round(this.coords[0]) + 'px';
    this.element.style.top = Math.round(this.coords[1]) + 'px';
  };
}

/**
 * Slides an element from its current position.
 *
 * @extends {Slide}
 * @class
 */
class SlideFrom extends Slide {

  /**
   * Slides an element from its current position.
   *
   * @param {Element} element DOM node to be used in the animation.
   * @param {Array<number>} end 2D array for end coordinates (X, Y).
   * @param {number} time Length of animation in milliseconds.
   * @param {Function=} opt_acc Acceleration function, returns 0-1 for inputs 0-1.
   */
  constructor(element, end, time, opt_acc) {
    var offsetLeft = /** @type {!HTMLElement} */ (element).offsetLeft;
    var start = [offsetLeft, /** @type {!HTMLElement} */ (element).offsetTop];
    super(element, start, end, time, opt_acc);
    /** @type {?Array<number>} */
    this.startPoint;
  }

  /** @override */
  onBegin() {
    var offsetLeft = this.isRightPositioningForRtlEnabled() ?
        bidi.getOffsetStart(this.element) :
        /** @type {!HTMLElement} */ (this.element).offsetLeft;
    this.startPoint = [
      offsetLeft,
      /** @type {!HTMLElement} */ (this.element).offsetTop
    ];
    super.onBegin();
  };
}

/**
 * Creates an animation object that will slide an element into its final size.
 * Requires that the element is absolutely positioned.
 *
 * @extends {PredefinedEffect}
 * @class
 */
class Swipe extends PredefinedEffect {

  /**
   * Creates an animation object that will slide an element into its final size.
   * Requires that the element is absolutely positioned.
   *
   * @param {Element} element Dom Node to be used in the animation.
   * @param {Array<number>} start 2D array for start size (W, H).
   * @param {Array<number>} end 2D array for end size (W, H).
   * @param {number} time Length of animation in milliseconds.
   * @param {Function=} opt_acc Acceleration function, returns 0-1 for inputs 0-1.
   */
  constructor(element, start, end, time, opt_acc) {
    if (start.length != 2 || end.length != 2) {
      throw new Error('Start and end points must be 2D');
    }
    super(element, start, end, time, opt_acc);
  
    /**
     * Maximum width for element.
     * @type {number}
     * @private
     */
    this.maxWidth_ = Math.max(this.endPoint[0], this.startPoint[0]);
  
    /**
     * Maximum height for element.
     * @type {number}
     * @private
     */
    this.maxHeight_ = Math.max(this.endPoint[1], this.startPoint[1]);
  }

  /**
   * Animation event handler that will resize an element by setting its width,
   * height and clipping.
   * @protected
   * @override
   */
  updateStyle() {
    var x = this.coords[0];
    var y = this.coords[1];
    this.clip_(Math.round(x), Math.round(y), this.maxWidth_, this.maxHeight_);
    this.element.style.width = Math.round(x) + 'px';
    var marginX =
        (this.isRightPositioningForRtlEnabled() && this.isRightToLeft()) ?
        'marginRight' :
        'marginLeft';
  
    this.element.style[marginX] = Math.round(x) - this.maxWidth_ + 'px';
    this.element.style.marginTop = Math.round(y) - this.maxHeight_ + 'px';
  };

  /**
   * Helper function for setting element clipping.
   * @param {number} x Current element width.
   * @param {number} y Current element height.
   * @param {number} w Maximum element width.
   * @param {number} h Maximum element height.
   * @private
   */
  clip_(x, y, w, h) {
    this.element.style.clip =
        'rect(' + (h - y) + 'px ' + w + 'px ' + h + 'px ' + (w - x) + 'px)';
  };
}

/**
 * Creates an animation object that will scroll an element from A to B.
 *
 * Start and End should be 2 dimensional arrays
 *
 * @extends {PredefinedEffect}
 * @class
 */
class Scroll extends PredefinedEffect {

  /**
   * Creates an animation object that will scroll an element from A to B.
   *
   * Start and End should be 2 dimensional arrays
   *
   * @param {Element} element Dom Node to be used in the animation.
   * @param {Array<number>} start 2D array for start scroll left and top.
   * @param {Array<number>} end 2D array for end scroll left and top.
   * @param {number} time Length of animation in milliseconds.
   * @param {Function=} opt_acc Acceleration function, returns 0-1 for inputs 0-1.
   */
  constructor(element, start, end, time, opt_acc) {
    if (start.length != 2 || end.length != 2) {
      throw new Error('Start and end points must be 2D');
    }
    super(element, start, end, time, opt_acc);
  }

  /**
   * Animation event handler that will set the scroll position of an element.
   * @protected
   * @override
   */
  updateStyle() {
    if (this.isRightPositioningForRtlEnabled()) {
      bidi.setScrollOffset(this.element, Math.round(this.coords[0]));
    } else {
      this.element.scrollLeft = Math.round(this.coords[0]);
    }
    this.element.scrollTop = Math.round(this.coords[1]);
  };
}

/**
 * Creates an animation object that will resize an element between two widths
 * and heights.
 *
 * Start and End should be 2 dimensional arrays
 *
 * @extends {PredefinedEffect}
 * @class
 */
class Resize extends PredefinedEffect {

  /**
   * Creates an animation object that will resize an element between two widths
   * and heights.
   *
   * Start and End should be 2 dimensional arrays
   *
   * @param {Element} element Dom Node to be used in the animation.
   * @param {Array<number>} start 2D array for start width and height.
   * @param {Array<number>} end 2D array for end width and height.
   * @param {number} time Length of animation in milliseconds.
   * @param {Function=} opt_acc Acceleration function, returns 0-1 for inputs 0-1.
   */
  constructor(element, start, end, time, opt_acc) {
    if (start.length != 2 || end.length != 2) {
      throw new Error('Start and end points must be 2D');
    }
    super(element, start, end, time, opt_acc);
  }

  /**
   * Animation event handler that will resize an element by setting its width and
   * height.
   * @protected
   * @override
   */
  updateStyle() {
    this.element.style.width = Math.round(this.coords[0]) + 'px';
    this.element.style.height = Math.round(this.coords[1]) + 'px';
  };
}

/**
 * Creates an animation object that will resize an element between two widths
 *
 * Start and End should be numbers
 *
 * @extends {PredefinedEffect}
 * @class
 */
class ResizeWidth extends PredefinedEffect {

  /**
   * Creates an animation object that will resize an element between two widths
   *
   * Start and End should be numbers
   *
   * @param {Element} element Dom Node to be used in the animation.
   * @param {number} start Start width.
   * @param {number} end End width.
   * @param {number} time Length of animation in milliseconds.
   * @param {Function=} opt_acc Acceleration function, returns 0-1 for inputs 0-1.
   */
  constructor(element, start, end, time, opt_acc) {
    super(element, [start], [end], time, opt_acc);
  }

  /**
   * Animation event handler that will resize an element by setting its width.
   * @protected
   * @override
   */
  updateStyle() {
    this.element.style.width = Math.round(this.coords[0]) + 'px';
  };
}

/**
 * Creates an animation object that will resize an element between two heights
 *
 * Start and End should be numbers
 *
 * @extends {PredefinedEffect}
 * @class
 */
class ResizeHeight extends PredefinedEffect {

  /**
   * Creates an animation object that will resize an element between two heights
   *
   * Start and End should be numbers
   *
   * @param {Element} element Dom Node to be used in the animation.
   * @param {number} start Start height.
   * @param {number} end End height.
   * @param {number} time Length of animation in milliseconds.
   * @param {Function=} opt_acc Acceleration function, returns 0-1 for inputs 0-1.
   */
  constructor(element, start, end, time, opt_acc) {
    super(element, [start], [end], time, opt_acc);
  }

  /**
   * Animation event handler that will resize an element by setting its height.
   * @protected
   * @override
   */
  updateStyle() {
    this.element.style.height = Math.round(this.coords[0]) + 'px';
  };
}

/**
 * Creates an animation object that fades the opacity of an element between two
 * limits.
 *
 * Start and End should be floats between 0 and 1
 *
 * @extends {PredefinedEffect}
 * @class
 */
class Fade extends PredefinedEffect {

  /**
   * Creates an animation object that fades the opacity of an element between two
   * limits.
   *
   * Start and End should be floats between 0 and 1
   *
   * @param {Element} element Dom Node to be used in the animation.
   * @param {Array<number>|number} start 1D Array or Number with start opacity.
   * @param {Array<number>|number} end 1D Array or Number for end opacity.
   * @param {number} time Length of animation in milliseconds.
   * @param {Function=} opt_acc Acceleration function, returns 0-1 for inputs 0-1.
   */
  constructor(element, start, end, time, opt_acc) {
    if (typeof start === 'number') start = [start];
    if (typeof end === 'number') end = [end];
  
    super(element, start, end, time, opt_acc);
  
    if (start.length != 1 || end.length != 1) {
      throw new Error('Start and end points must be 1D');
    }
  
    /**
     * The last opacity we set, or -1 for not set.
     * @private {number}
     */
    this.lastOpacityUpdate_ = Fade.OPACITY_UNSET_;
  }

  /**
   * Animation event handler that will set the opacity of an element.
   * @protected
   * @override
   */
  updateStyle() {
    var opacity = this.coords[0];
    var delta = Math.abs(opacity - this.lastOpacityUpdate_);
    // In order to keep eager browsers from over-rendering, only update
    // on a potentially visible change in opacity.
    if (delta >= Fade.TOLERANCE_) {
      style.setOpacity(this.element, opacity);
      this.lastOpacityUpdate_ = opacity;
    }
  };

  /** @override */
  onBegin() {
    this.lastOpacityUpdate_ = Fade.OPACITY_UNSET_;
    super.onBegin();
  };

  /** @override */
  onEnd() {
    this.lastOpacityUpdate_ = Fade.OPACITY_UNSET_;
    super.onEnd();
  };

  /**
   * Animation event handler that will show the element.
   */
  show() {
    this.element.style.display = '';
  };

  /**
   * Animation event handler that will hide the element
   */
  hide() {
    this.element.style.display = 'none';
  };
}

/**
 * The quantization of opacity values to use.
 * @private {number}
 */
Fade.TOLERANCE_ = 1.0 / 0x400;  // 10-bit color

/**
 * Value indicating that the opacity must be set on next update.
 * @private {number}
 */
Fade.OPACITY_UNSET_ = -1;

/**
 * Fades an element out from full opacity to completely transparent.
 *
 * @extends {Fade}
 * @class
 */
class FadeOut extends Fade {

  /**
   * Fades an element out from full opacity to completely transparent.
   *
   * @param {Element} element Dom Node to be used in the animation.
   * @param {number} time Length of animation in milliseconds.
   * @param {Function=} opt_acc Acceleration function, returns 0-1 for inputs 0-1.
   */
  constructor(element, time, opt_acc) {
    super(element, 1, 0, time, opt_acc);
  }
}

/**
 * Fades an element in from completely transparent to fully opacity.
 *
 * @extends {Fade}
 * @class
 */
class FadeIn extends Fade {

  /**
   * Fades an element in from completely transparent to fully opacity.
   *
   * @param {Element} element Dom Node to be used in the animation.
   * @param {number} time Length of animation in milliseconds.
   * @param {Function=} opt_acc Acceleration function, returns 0-1 for inputs 0-1.
   */
  constructor(element, time, opt_acc) {
    super(element, 0, 1, time, opt_acc);
  }
}

/**
 * Fades an element out from full opacity to completely transparent and then
 * sets the display to 'none'
 *
 * @extends {Fade}
 * @class
 */
class FadeOutAndHide extends Fade {

  /**
   * Fades an element out from full opacity to completely transparent and then
   * sets the display to 'none'
   *
   * @param {Element} element Dom Node to be used in the animation.
   * @param {number} time Length of animation in milliseconds.
   * @param {Function=} opt_acc Acceleration function, returns 0-1 for inputs 0-1.
   */
  constructor(element, time, opt_acc) {
    super(element, 1, 0, time, opt_acc);
  }

  /** @override */
  onBegin() {
    this.show();
    super.onBegin();
  };

  /** @override */
  onEnd() {
    this.hide();
    super.onEnd();
  };
}

/**
 * Sets an element's display to be visible and then fades an element in from
 * completely transparent to fully opaque.
 *
 * @extends {Fade}
 * @class
 */
class FadeInAndShow extends Fade {

  /**
   * Sets an element's display to be visible and then fades an element in from
   * completely transparent to fully opaque.
   *
   * @param {Element} element Dom Node to be used in the animation.
   * @param {number} time Length of animation in milliseconds.
   * @param {Function=} opt_acc Acceleration function, returns 0-1 for inputs 0-1.
   */
  constructor(element, time, opt_acc) {
    super(element, 0, 1, time, opt_acc);
  }

  /** @override */
  onBegin() {
    this.show();
    super.onBegin();
  };
}

/**
 * Provides a transformation of an elements background-color.
 *
 * Start and End should be 3D arrays representing R,G,B
 *
 * @extends {PredefinedEffect}
 * @class
 */
class BgColorTransform extends PredefinedEffect {

  /**
   * Provides a transformation of an elements background-color.
   *
   * Start and End should be 3D arrays representing R,G,B
   *
   * @param {Element} element Dom Node to be used in the animation.
   * @param {Array<number>} start 3D Array for RGB of start color.
   * @param {Array<number>} end 3D Array for RGB of end color.
   * @param {number} time Length of animation in milliseconds.
   * @param {Function=} opt_acc Acceleration function, returns 0-1 for inputs 0-1.
   */
  constructor(element, start, end, time, opt_acc) {
    if (start.length != 3 || end.length != 3) {
      throw new Error('Start and end points must be 3D');
    }
    super(element, start, end, time, opt_acc);
  }

  /**
   * Animation event handler that will set the background-color of an element
   */
  setColor() {
    var coordsAsInts = [];
    for (var i = 0; i < this.coords.length; i++) {
      coordsAsInts[i] = Math.round(this.coords[i]);
    }
    var color = 'rgb(' + coordsAsInts.join(',') + ')';
    this.element.style.backgroundColor = color;
  };

  /** @override */
  updateStyle() {
    this.setColor();
  };
}

/**
 * Fade elements background color from start color to the element's current
 * background color.
 *
 * Start should be a 3D array representing R,G,B
 *
 * @param {Element} element Dom Node to be used in the animation.
 * @param {Array<number>} start 3D Array for RGB of start color.
 * @param {number} time Length of animation in milliseconds.
 * @param {EventHandler=} opt_eventHandler Optional event handler
 *     to use when listening for events.
 */
function bgColorFadeIn(element, start, time, opt_eventHandler) {
  var initialBgColor = element.style.backgroundColor || '';
  var computedBgColor = style.getBackgroundColor(element);
  var end;

  if (computedBgColor && computedBgColor != 'transparent' &&
      computedBgColor != 'rgba(0, 0, 0, 0)') {
    end = googcolor.hexToRgb(googcolor.parse(computedBgColor).hex);
  } else {
    end = [255, 255, 255];
  }

  var anim = new BgColorTransform(element, start, end, time);

  function setBgColor() { element.style.backgroundColor = initialBgColor; }

  if (opt_eventHandler) {
    opt_eventHandler.listen(anim, EventType.END, setBgColor);
  } else {
    goog_events.listen(anim, EventType.END, setBgColor);
  }

  anim.play();
};

/**
 * Provides a transformation of an elements color.
 *
 * @class
 * @extends {PredefinedEffect}
 */
class ColorTransform extends PredefinedEffect {

  /**
   * Provides a transformation of an elements color.
   *
   * @param {Element} element Dom Node to be used in the animation.
   * @param {Array<number>} start 3D Array representing R,G,B.
   * @param {Array<number>} end 3D Array representing R,G,B.
   * @param {number} time Length of animation in milliseconds.
   * @param {Function=} opt_acc Acceleration function, returns 0-1 for inputs 0-1.
   */
  constructor(element, start, end, time, opt_acc) {
    if (start.length != 3 || end.length != 3) {
      throw new Error('Start and end points must be 3D');
    }
    super(element, start, end, time, opt_acc);
  }

  /**
   * Animation event handler that will set the color of an element.
   * @protected
   * @override
   */
  updateStyle() {
    var coordsAsInts = [];
    for (var i = 0; i < this.coords.length; i++) {
      coordsAsInts[i] = Math.round(this.coords[i]);
    }
    var color = 'rgb(' + coordsAsInts.join(',') + ')';
    this.element.style.color = color;
  };
}

export {BgColorTransform, ColorTransform, Fade, FadeIn, FadeInAndShow, FadeOut, FadeOutAndHide, PredefinedEffect, Resize, ResizeHeight, ResizeWidth, Scroll, Slide, SlideFrom, Swipe, bgColorFadeIn};