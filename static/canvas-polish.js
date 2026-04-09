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

  function parseFontSize(font) {
    var match = /(\d+(?:\.\d+)?)px/.exec(font || '');
    return match ? parseFloat(match[1]) : null;
  }

  function replaceFontSize(font, nextSize) {
    if (!font) return font;
    return font.replace(/(\d+(?:\.\d+)?)px/, String(Math.max(10, Math.round(nextSize * 10) / 10)).replace(/\.0$/, '') + 'px');
  }

  // 1. Patch getContext to auto-set lineCap and lineJoin
  var origGetContext = HTMLCanvasElement.prototype.getContext;
  HTMLCanvasElement.prototype.getContext = function(type, attrs) {
    var ctx = origGetContext.call(this, type, attrs);
    if (type === '2d' && ctx && !ctx._polished) {
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.imageSmoothingEnabled = true;
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

  // 4. Patch fillText/strokeText to soften dense annotation copy.
  // Long explanatory sentences inside canvases should read as secondary
  // support text, not compete with the main visual structure.
  var origFillText = CanvasRenderingContext2D.prototype.fillText;
  CanvasRenderingContext2D.prototype.fillText = function(text, x, y, maxWidth) {
    var savedFont = this.font;
    var savedAlpha = this.globalAlpha;
    var modified = false;

    if (typeof text === 'string') {
      var fontSize = parseFontSize(savedFont);
      var isDenseAnnotation = (text.length >= 48 || (text.length >= 36 && /[:|]/.test(text))) && fontSize && fontSize <= 15;
      var isVeryDenseAnnotation = text.length >= 82 && fontSize && fontSize <= 14;

      if (isDenseAnnotation) {
        this.globalAlpha = savedAlpha * 0.84;
        modified = true;
      }

      if (isVeryDenseAnnotation) {
        this.font = replaceFontSize(savedFont, fontSize * 0.92);
        modified = true;
      }
    }

    if (maxWidth !== undefined) {
      origFillText.call(this, text, x, y, maxWidth);
    } else {
      origFillText.call(this, text, x, y);
    }

    if (modified) {
      this.font = savedFont;
      this.globalAlpha = savedAlpha;
    }
  };

  var origStrokeText = CanvasRenderingContext2D.prototype.strokeText;
  CanvasRenderingContext2D.prototype.strokeText = function(text, x, y, maxWidth) {
    var savedFont = this.font;
    var modified = false;

    if (typeof text === 'string') {
      var fontSize = parseFontSize(savedFont);
      if (text.length >= 82 && fontSize && fontSize <= 14) {
        this.font = replaceFontSize(savedFont, fontSize * 0.92);
        modified = true;
      }
    }

    if (maxWidth !== undefined) {
      origStrokeText.call(this, text, x, y, maxWidth);
    } else {
      origStrokeText.call(this, text, x, y);
    }

    if (modified) {
      this.font = savedFont;
    }
  };

})();
