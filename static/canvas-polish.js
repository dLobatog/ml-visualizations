/**
 * Canvas Visual Polish — Global Rendering Upgrade
 *
 * Include this script BEFORE any canvas drawing code.
 * It patches getContext('2d') to set round line caps/joins,
 * and patches stroke() to add a subtle glow on colored data lines.
 *
 * Effect: all canvas visualizations get softer, more luminous lines
 * on the dark background — closing the visual gap with Distill/3B1B.
 */
(function() {
  'use strict';

  // 1. Patch getContext to auto-set lineCap and lineJoin
  var origGetContext = HTMLCanvasElement.prototype.getContext;
  HTMLCanvasElement.prototype.getContext = function(type, attrs) {
    var ctx = origGetContext.call(this, type, attrs);
    if (type === '2d' && ctx && !ctx._polished) {
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx._polished = true;
    }
    return ctx;
  };

  // 2. Patch stroke() to add conditional glow
  var origStroke = CanvasRenderingContext2D.prototype.stroke;
  CanvasRenderingContext2D.prototype.stroke = function(path) {
    // Only glow thicker lines (data curves, not thin axes/gridlines)
    if (this.lineWidth >= 2 && this.shadowBlur === 0) {
      var style = this.strokeStyle;
      // Skip if strokeStyle is already a complex pattern or gradient
      if (typeof style === 'string') {
        this.shadowColor = style;
        this.shadowBlur = 6;
        if (path) {
          origStroke.call(this, path);
        } else {
          origStroke.call(this);
        }
        this.shadowBlur = 0;
        this.shadowColor = 'transparent';
        return;
      }
    }
    // Default: stroke without glow
    if (path) {
      origStroke.call(this, path);
    } else {
      origStroke.call(this);
    }
  };

  // 3. Patch fill() to add subtle glow on colored fills for circles/nodes
  var origFill = CanvasRenderingContext2D.prototype.fill;
  CanvasRenderingContext2D.prototype.fill = function(pathOrRule, rule) {
    // Only glow if explicitly opted in via _glowFill flag
    // (we don't want to glow every rectangle background)
    if (this._glowFill && this.shadowBlur === 0) {
      var style = this.fillStyle;
      if (typeof style === 'string' && style.charAt(0) === '#') {
        this.shadowColor = style;
        this.shadowBlur = 10;
        if (rule !== undefined) {
          origFill.call(this, pathOrRule, rule);
        } else if (pathOrRule !== undefined) {
          origFill.call(this, pathOrRule);
        } else {
          origFill.call(this);
        }
        this.shadowBlur = 0;
        this.shadowColor = 'transparent';
        this._glowFill = false;
        return;
      }
    }
    // Default: fill without glow
    if (rule !== undefined) {
      origFill.call(this, pathOrRule, rule);
    } else if (pathOrRule !== undefined) {
      origFill.call(this, pathOrRule);
    } else {
      origFill.call(this);
    }
  };

})();
