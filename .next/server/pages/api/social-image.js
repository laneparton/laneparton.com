(self["webpackChunk_N_E"] = self["webpackChunk_N_E"] || []).push([[727],{

/***/ 741:
/***/ ((module) => {

"use strict";


module.exports = function (obj) {
	if (typeof obj === 'string') { return camelCase(obj); }
	return walk(obj);
};

function walk(obj) {
	if (!obj || typeof obj !== 'object') { return obj; }
	if (isDate(obj) || isRegex(obj)) { return obj; }
	if (isArray(obj)) { return map(obj, walk); }
	return reduce(objectKeys(obj), function (acc, key) {
		var camel = camelCase(key);
		acc[camel] = walk(obj[key]);
		return acc;
	}, {});
}

function camelCase(str) {
	return str.replace(/[_.-](\w|$)/g, function (_, x) {
		return x.toUpperCase();
	});
}

var isArray = Array.isArray || function (obj) {
	return Object.prototype.toString.call(obj) === '[object Array]';
};

var isDate = function (obj) {
	return Object.prototype.toString.call(obj) === '[object Date]';
};

var isRegex = function (obj) {
	return Object.prototype.toString.call(obj) === '[object RegExp]';
};

var has = Object.prototype.hasOwnProperty;
var objectKeys = Object.keys || function (obj) {
	var keys = [];
	for (var key in obj) {
		if (has.call(obj, key)) { keys.push(key); }
	}
	return keys;
};

function map(xs, f) {
	if (xs.map) { return xs.map(f); }
	var res = [];
	for (var i = 0; i < xs.length; i++) {
		res.push(f(xs[i], i));
	}
	return res;
}

function reduce(xs, f, acc) {
	if (xs.reduce) { return xs.reduce(f, acc); }
	for (var i = 0; i < xs.length; i++) {
		acc = f(acc, xs[i], i);
	}
	return acc;
}


/***/ }),

/***/ 969:
/***/ (function(module) {

/*!
 * https://github.com/gilmoreorless/css-background-parser
 * Copyright © 2015 Gilmore Davidson under the MIT license: http://gilmoreorless.mit-license.org/
 */
(function (exports) {

    function BackgroundList(backgrounds) {
        if (!(this instanceof BackgroundList)) {
            return new BackgroundList();
        }
        this.backgrounds = backgrounds || [];
    }

    BackgroundList.prototype.toString = function () {
        return this.backgrounds.join(', ');
    };


    function Background(props) {
        if (!(this instanceof Background)) {
            return new Background(props);
        }
        props = props || {};
        var bg = this;

        function defprop(name, defaultValue) {
            bg[name] = (name in props) ? props[name] : defaultValue;
        }

        // http://www.w3.org/TR/css3-background/#backgrounds
        defprop('color', '');
        defprop('image', 'none');
        defprop('attachment', 'scroll');
        defprop('clip', 'border-box');
        defprop('origin', 'padding-box');
        defprop('position', '0% 0%');
        defprop('repeat', 'repeat');
        defprop('size', 'auto');
    }

    Background.prototype.toString = function () {
        var list = [
            this.image,
            this.repeat,
            this.attachment,
            this.position + ' / ' + this.size,
            this.origin,
            this.clip
        ];
        if (this.color) {
            list.unshift(this.color);
        }
        return list.join(' ');
    };

    exports.BackgroundList = BackgroundList;
    exports.Background = Background;


    function parseImages(cssText) {
        var images = [];
        var tokens = /[,\(\)]/;
        var parens = 0;
        var buffer = '';

        if (cssText == null) {
            return images;
        }

        while (cssText.length) {
            var match = tokens.exec(cssText);
            if (!match) {
                break;
            }
            var char = match[0];
            var ignoreChar = false;
            switch (char) {
                case ',':
                    if (!parens) {
                        images.push(buffer.trim());
                        buffer = '';
                        ignoreChar = true;
                    }
                    break;
                case '(':
                    parens++;
                    break;
                case ')':
                    parens--;
                    break;
            }

            var index = match.index + 1;
            buffer += cssText.slice(0, ignoreChar ? index - 1 : index);
            cssText = cssText.slice(index);
        }

        if (buffer.length || cssText.length) {
            images.push((buffer + cssText).trim());
        }

        return images;
    }

    // Helper for .map()
    function trim(str) {
        return str.trim();
    }

    function parseSimpleList(cssText) {
        return (cssText || '').split(',').map(trim);
    }

    exports.parseElementStyle = function (styleObject) {
        var list = new BackgroundList();
        if (styleObject == null) {
            return list;
        }

        var bgImage = parseImages(styleObject.backgroundImage);
        var bgColor = styleObject.backgroundColor;
        var bgAttachment = parseSimpleList(styleObject.backgroundAttachment);
        var bgClip       = parseSimpleList(styleObject.backgroundClip);
        var bgOrigin     = parseSimpleList(styleObject.backgroundOrigin);
        var bgPosition   = parseSimpleList(styleObject.backgroundPosition);
        var bgRepeat     = parseSimpleList(styleObject.backgroundRepeat);
        var bgSize       = parseSimpleList(styleObject.backgroundSize);
        var background;

        for (var i = 0, ii = bgImage.length; i < ii; i++) {
            background = new Background({
                image:      bgImage[i],
                attachment: bgAttachment[i % bgAttachment.length],
                clip:       bgClip[i % bgClip.length],
                origin:     bgOrigin[i % bgOrigin.length],
                position:   bgPosition[i % bgPosition.length],
                repeat:     bgRepeat[i % bgRepeat.length],
                size:       bgSize[i % bgSize.length]
            });
            if (i === ii - 1) {
                background.color = bgColor;
            }
            list.backgrounds.push(background);
        }

        return list;
    };

    // exports.parseCssString = function (cssString) {
    //     return new Background();
    // };

    // exports.parseBackgroundValue = function (cssString) {
    //     return new Background();
    // };

})((function (root) {
    // CommonJS
    if ( true && module.exports !== undefined) return module.exports;
    // Global `cssBgParser`
    return (root.cssBgParser = {});
})(this));


/***/ }),

/***/ 631:
/***/ ((module) => {

const VALUES_REG = /,(?![^\(]*\))/
const PARTS_REG = /\s(?![^(]*\))/
const LENGTH_REG = /^[0-9]+[a-zA-Z%]+?$/

const parseValue = str => {
  const parts = str.split(PARTS_REG)
  const inset = parts.includes('inset')
  const last = parts.slice(-1)[0]
  const color = !isLength(last) ? last : undefined

  const nums = parts
    .filter(n => n !== 'inset')
    .filter(n => n !== color)
    .map(toNum)
  const [ offsetX, offsetY, blurRadius, spreadRadius ] = nums

  return {
    inset,
    offsetX,
    offsetY,
    blurRadius,
    spreadRadius,
    color
  }
}

const stringifyValue = obj => {
  const {
    inset,
    offsetX = 0,
    offsetY = 0,
    blurRadius = 0,
    spreadRadius,
    color
  } = obj || {}

  return [
    (inset ? 'inset' : null),
    offsetX,
    offsetY,
    blurRadius ,
    spreadRadius,
    color
  ].filter(v => v !== null && v !== undefined)
    .map(toPx)
    .map(s => ('' + s).trim())
    .join(' ')
}

const isLength = v => v === '0' || LENGTH_REG.test(v)
const toNum = v => {
  if (!/px$/.test(v) && v !== '0') return v
  const n = parseFloat(v)
  return !isNaN(n) ? n : v
}
const toPx = n => typeof n === 'number' && n !== 0 ? (n + 'px') : n

const parse = str => str.split(VALUES_REG).map(s => s.trim()).map(parseValue)
const stringify = arr => arr.map(stringifyValue).join(', ')

module.exports = {
  parse,
  stringify
}


/***/ }),

/***/ 600:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


module.exports = __webpack_require__(814)


/***/ }),

/***/ 915:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";
var __webpack_unused_export__;


__webpack_unused_export__ = ({
  value: true
});

function _interopDefault(ex) {
  return ex && typeof ex === 'object' && 'default' in ex ? ex['default'] : ex;
}

var parse = __webpack_require__(627);

var parse__default = _interopDefault(parse);

var camelizeStyleName = _interopDefault(__webpack_require__(741));

var cssColorKeywords = _interopDefault(__webpack_require__(600));

var matchString = function matchString(node) {
  if (node.type !== 'string') return null;
  return node.value.replace(/\\([0-9a-f]{1,6})(?:\s|$)/gi, function (match, charCode) {
    return String.fromCharCode(parseInt(charCode, 16));
  }).replace(/\\/g, '');
};

var hexColorRe = /^(#(?:[0-9a-f]{3,4}){1,2})$/i;
var cssFunctionNameRe = /^(rgba?|hsla?|hwb|lab|lch|gray|color)$/;

var matchColor = function matchColor(node) {
  if (node.type === 'word' && (hexColorRe.test(node.value) || node.value in cssColorKeywords || node.value === 'transparent')) {
    return node.value;
  } else if (node.type === 'function' && cssFunctionNameRe.test(node.value)) {
    return parse.stringify(node);
  }

  return null;
};

var noneRe = /^(none)$/i;
var autoRe = /^(auto)$/i;
var identRe = /(^-?[_a-z][_a-z0-9-]*$)/i; // Note if these are wrong, you'll need to change index.js too

var numberRe = /^([+-]?(?:\d*\.)?\d+(?:e[+-]?\d+)?)$/i; // Note lengthRe is sneaky: you can omit units for 0

var lengthRe = /^(0$|(?:[+-]?(?:\d*\.)?\d+(?:e[+-]?\d+)?)(?=px$))/i;
var unsupportedUnitRe = /^([+-]?(?:\d*\.)?\d+(?:e[+-]?\d+)?(ch|em|ex|rem|vh|vw|vmin|vmax|cm|mm|in|pc|pt))$/i;
var angleRe = /^([+-]?(?:\d*\.)?\d+(?:e[+-]?\d+)?(?:deg|rad))$/i;
var percentRe = /^([+-]?(?:\d*\.)?\d+(?:e[+-]?\d+)?%)$/i;

var noopToken = function noopToken(predicate) {
  return function (node) {
    return predicate(node) ? '<token>' : null;
  };
};

var valueForTypeToken = function valueForTypeToken(type) {
  return function (node) {
    return node.type === type ? node.value : null;
  };
};

var regExpToken = function regExpToken(regExp, transform) {
  if (transform === void 0) {
    transform = String;
  }

  return function (node) {
    if (node.type !== 'word') return null;
    var match = node.value.match(regExp);
    if (match === null) return null;
    var value = transform(match[1]);
    return value;
  };
};

var SPACE = noopToken(function (node) {
  return node.type === 'space';
});
var SLASH = noopToken(function (node) {
  return node.type === 'div' && node.value === '/';
});
var COMMA = noopToken(function (node) {
  return node.type === 'div' && node.value === ',';
});
var WORD = valueForTypeToken('word');
var NONE = regExpToken(noneRe);
var AUTO = regExpToken(autoRe);
var NUMBER = regExpToken(numberRe, Number);
var LENGTH = regExpToken(lengthRe, Number);
var UNSUPPORTED_LENGTH_UNIT = regExpToken(unsupportedUnitRe);
var ANGLE = regExpToken(angleRe, function (angle) {
  return angle.toLowerCase();
});
var PERCENT = regExpToken(percentRe);
var IDENT = regExpToken(identRe);
var STRING = matchString;
var COLOR = matchColor;
var LINE = regExpToken(/^(none|underline|line-through)$/i);

var aspectRatio = function aspectRatio(tokenStream) {
  var aspectRatio = tokenStream.expect(NUMBER);

  if (tokenStream.hasTokens()) {
    tokenStream.expect(SLASH);
    aspectRatio /= tokenStream.expect(NUMBER);
  }

  return {
    aspectRatio: aspectRatio
  };
};

var BORDER_STYLE = regExpToken(/^(solid|dashed|dotted)$/);
var defaultBorderWidth = 1;
var defaultBorderColor = 'black';
var defaultBorderStyle = 'solid';

var border = function border(tokenStream) {
  var borderWidth;
  var borderColor;
  var borderStyle;

  if (tokenStream.matches(NONE)) {
    tokenStream.expectEmpty();
    return {
      borderWidth: 0,
      borderColor: 'black',
      borderStyle: 'solid'
    };
  }

  var partsParsed = 0;

  while (partsParsed < 3 && tokenStream.hasTokens()) {
    if (partsParsed !== 0) tokenStream.expect(SPACE);

    if (borderWidth === undefined && tokenStream.matches(LENGTH, UNSUPPORTED_LENGTH_UNIT)) {
      borderWidth = tokenStream.lastValue;
    } else if (borderColor === undefined && tokenStream.matches(COLOR)) {
      borderColor = tokenStream.lastValue;
    } else if (borderStyle === undefined && tokenStream.matches(BORDER_STYLE)) {
      borderStyle = tokenStream.lastValue;
    } else {
      tokenStream["throw"]();
    }

    partsParsed += 1;
  }

  tokenStream.expectEmpty();
  if (borderWidth === undefined) borderWidth = defaultBorderWidth;
  if (borderColor === undefined) borderColor = defaultBorderColor;
  if (borderStyle === undefined) borderStyle = defaultBorderStyle;
  return {
    borderWidth: borderWidth,
    borderColor: borderColor,
    borderStyle: borderStyle
  };
};

var directionFactory = function directionFactory(_ref) {
  var _ref$types = _ref.types,
      types = _ref$types === void 0 ? [LENGTH, UNSUPPORTED_LENGTH_UNIT, PERCENT] : _ref$types,
      _ref$directions = _ref.directions,
      directions = _ref$directions === void 0 ? ['Top', 'Right', 'Bottom', 'Left'] : _ref$directions,
      _ref$prefix = _ref.prefix,
      prefix = _ref$prefix === void 0 ? '' : _ref$prefix,
      _ref$suffix = _ref.suffix,
      suffix = _ref$suffix === void 0 ? '' : _ref$suffix;
  return function (tokenStream) {
    var _ref2;

    var values = []; // borderWidth doesn't currently allow a percent value, but may do in the future

    values.push(tokenStream.expect.apply(tokenStream, types));

    while (values.length < 4 && tokenStream.hasTokens()) {
      tokenStream.expect(SPACE);
      values.push(tokenStream.expect.apply(tokenStream, types));
    }

    tokenStream.expectEmpty();
    var top = values[0],
        _values$ = values[1],
        right = _values$ === void 0 ? top : _values$,
        _values$2 = values[2],
        bottom = _values$2 === void 0 ? top : _values$2,
        _values$3 = values[3],
        left = _values$3 === void 0 ? right : _values$3;

    var keyFor = function keyFor(n) {
      return "" + prefix + directions[n] + suffix;
    };

    return _ref2 = {}, _ref2[keyFor(0)] = top, _ref2[keyFor(1)] = right, _ref2[keyFor(2)] = bottom, _ref2[keyFor(3)] = left, _ref2;
  };
};

var parseShadowOffset = function parseShadowOffset(tokenStream) {
  var width = tokenStream.expect(LENGTH);
  var height = tokenStream.matches(SPACE) ? tokenStream.expect(LENGTH) : width;
  tokenStream.expectEmpty();
  return {
    width: width,
    height: height
  };
};

var parseShadow = function parseShadow(tokenStream) {
  var offsetX;
  var offsetY;
  var radius;
  var color;

  if (tokenStream.matches(NONE)) {
    tokenStream.expectEmpty();
    return {
      offset: {
        width: 0,
        height: 0
      },
      radius: 0,
      color: 'black'
    };
  }

  var didParseFirst = false;

  while (tokenStream.hasTokens()) {
    if (didParseFirst) tokenStream.expect(SPACE);

    if (offsetX === undefined && tokenStream.matches(LENGTH, UNSUPPORTED_LENGTH_UNIT)) {
      offsetX = tokenStream.lastValue;
      tokenStream.expect(SPACE);
      offsetY = tokenStream.expect(LENGTH, UNSUPPORTED_LENGTH_UNIT);
      tokenStream.saveRewindPoint();

      if (tokenStream.matches(SPACE) && tokenStream.matches(LENGTH, UNSUPPORTED_LENGTH_UNIT)) {
        radius = tokenStream.lastValue;
      } else {
        tokenStream.rewind();
      }
    } else if (color === undefined && tokenStream.matches(COLOR)) {
      color = tokenStream.lastValue;
    } else {
      tokenStream["throw"]();
    }

    didParseFirst = true;
  }

  if (offsetX === undefined) tokenStream["throw"]();
  return {
    offset: {
      width: offsetX,
      height: offsetY
    },
    radius: radius !== undefined ? radius : 0,
    color: color !== undefined ? color : 'black'
  };
};

var boxShadow = function boxShadow(tokenStream) {
  var _parseShadow = parseShadow(tokenStream),
      offset = _parseShadow.offset,
      radius = _parseShadow.radius,
      color = _parseShadow.color;

  return {
    shadowOffset: offset,
    shadowRadius: radius,
    shadowColor: color,
    shadowOpacity: 1
  };
};

var defaultFlexGrow = 1;
var defaultFlexShrink = 1;
var defaultFlexBasis = 0;

var flex = function flex(tokenStream) {
  var flexGrow;
  var flexShrink;
  var flexBasis;

  if (tokenStream.matches(NONE)) {
    tokenStream.expectEmpty();
    return {
      flexGrow: 0,
      flexShrink: 0,
      flexBasis: 'auto'
    };
  }

  tokenStream.saveRewindPoint();

  if (tokenStream.matches(AUTO) && !tokenStream.hasTokens()) {
    return {
      flexGrow: 1,
      flexShrink: 1,
      flexBasis: 'auto'
    };
  }

  tokenStream.rewind();
  var partsParsed = 0;

  while (partsParsed < 2 && tokenStream.hasTokens()) {
    if (partsParsed !== 0) tokenStream.expect(SPACE);

    if (flexGrow === undefined && tokenStream.matches(NUMBER)) {
      flexGrow = tokenStream.lastValue;
      tokenStream.saveRewindPoint();

      if (tokenStream.matches(SPACE) && tokenStream.matches(NUMBER)) {
        flexShrink = tokenStream.lastValue;
      } else {
        tokenStream.rewind();
      }
    } else if (flexBasis === undefined && tokenStream.matches(LENGTH, UNSUPPORTED_LENGTH_UNIT, PERCENT)) {
      flexBasis = tokenStream.lastValue;
    } else if (flexBasis === undefined && tokenStream.matches(AUTO)) {
      flexBasis = 'auto';
    } else {
      tokenStream["throw"]();
    }

    partsParsed += 1;
  }

  tokenStream.expectEmpty();
  if (flexGrow === undefined) flexGrow = defaultFlexGrow;
  if (flexShrink === undefined) flexShrink = defaultFlexShrink;
  if (flexBasis === undefined) flexBasis = defaultFlexBasis;
  return {
    flexGrow: flexGrow,
    flexShrink: flexShrink,
    flexBasis: flexBasis
  };
};

var FLEX_WRAP = regExpToken(/(nowrap|wrap|wrap-reverse)/);
var FLEX_DIRECTION = regExpToken(/(row|row-reverse|column|column-reverse)/);
var defaultFlexWrap = 'nowrap';
var defaultFlexDirection = 'row';

var flexFlow = function flexFlow(tokenStream) {
  var flexWrap;
  var flexDirection;
  var partsParsed = 0;

  while (partsParsed < 2 && tokenStream.hasTokens()) {
    if (partsParsed !== 0) tokenStream.expect(SPACE);

    if (flexWrap === undefined && tokenStream.matches(FLEX_WRAP)) {
      flexWrap = tokenStream.lastValue;
    } else if (flexDirection === undefined && tokenStream.matches(FLEX_DIRECTION)) {
      flexDirection = tokenStream.lastValue;
    } else {
      tokenStream["throw"]();
    }

    partsParsed += 1;
  }

  tokenStream.expectEmpty();
  if (flexWrap === undefined) flexWrap = defaultFlexWrap;
  if (flexDirection === undefined) flexDirection = defaultFlexDirection;
  return {
    flexWrap: flexWrap,
    flexDirection: flexDirection
  };
};

var fontFamily = function fontFamily(tokenStream) {
  var fontFamily;

  if (tokenStream.matches(STRING)) {
    fontFamily = tokenStream.lastValue;
  } else {
    fontFamily = tokenStream.expect(IDENT);

    while (tokenStream.hasTokens()) {
      tokenStream.expect(SPACE);
      var nextIdent = tokenStream.expect(IDENT);
      fontFamily += " " + nextIdent;
    }
  }

  tokenStream.expectEmpty();
  return {
    fontFamily: fontFamily
  };
};

var NORMAL = regExpToken(/^(normal)$/);
var STYLE = regExpToken(/^(italic)$/);
var WEIGHT = regExpToken(/^([1-9]00|bold)$/);
var VARIANT = regExpToken(/^(small-caps)$/);
var defaultFontStyle = 'normal';
var defaultFontWeight = 'normal';
var defaultFontVariant = [];

var font = function font(tokenStream) {
  var fontStyle;
  var fontWeight;
  var fontVariant; // let fontSize;

  var lineHeight; // let fontFamily;

  var numStyleWeightVariantMatched = 0;

  while (numStyleWeightVariantMatched < 3 && tokenStream.hasTokens()) {
    if (tokenStream.matches(NORMAL)) ;else if (fontStyle === undefined && tokenStream.matches(STYLE)) {
      fontStyle = tokenStream.lastValue;
    } else if (fontWeight === undefined && tokenStream.matches(WEIGHT)) {
      fontWeight = tokenStream.lastValue;
    } else if (fontVariant === undefined && tokenStream.matches(VARIANT)) {
      fontVariant = [tokenStream.lastValue];
    } else {
      break;
    }
    tokenStream.expect(SPACE);
    numStyleWeightVariantMatched += 1;
  }

  var fontSize = tokenStream.expect(LENGTH, UNSUPPORTED_LENGTH_UNIT);

  if (tokenStream.matches(SLASH)) {
    lineHeight = tokenStream.expect(LENGTH, UNSUPPORTED_LENGTH_UNIT);
  }

  tokenStream.expect(SPACE);

  var _fontFamily = fontFamily(tokenStream),
      fontFamily$1 = _fontFamily.fontFamily;

  if (fontStyle === undefined) fontStyle = defaultFontStyle;
  if (fontWeight === undefined) fontWeight = defaultFontWeight;
  if (fontVariant === undefined) fontVariant = defaultFontVariant;
  var out = {
    fontStyle: fontStyle,
    fontWeight: fontWeight,
    fontVariant: fontVariant,
    fontSize: fontSize,
    fontFamily: fontFamily$1
  };
  if (lineHeight !== undefined) out.lineHeight = lineHeight;
  return out;
};

var fontVariant = function fontVariant(tokenStream) {
  var values = [tokenStream.expect(IDENT)];

  while (tokenStream.hasTokens()) {
    tokenStream.expect(SPACE);
    values.push(tokenStream.expect(IDENT));
  }

  return {
    fontVariant: values
  };
};

var ALIGN_CONTENT = regExpToken(/(flex-(?:start|end)|center|stretch|space-(?:between|around))/);
var JUSTIFY_CONTENT = regExpToken(/(flex-(?:start|end)|center|space-(?:between|around|evenly))/);

var placeContent = function placeContent(tokenStream) {
  var alignContent = tokenStream.expect(ALIGN_CONTENT);
  var justifyContent;

  if (tokenStream.hasTokens()) {
    tokenStream.expect(SPACE);
    justifyContent = tokenStream.expect(JUSTIFY_CONTENT);
  } else {
    justifyContent = 'stretch';
  }

  tokenStream.expectEmpty();
  return {
    alignContent: alignContent,
    justifyContent: justifyContent
  };
};

var STYLE$1 = regExpToken(/^(solid|double|dotted|dashed)$/);
var defaultTextDecorationLine = 'none';
var defaultTextDecorationStyle = 'solid';
var defaultTextDecorationColor = 'black';

var textDecoration = function textDecoration(tokenStream) {
  var line;
  var style;
  var color;
  var didParseFirst = false;

  while (tokenStream.hasTokens()) {
    if (didParseFirst) tokenStream.expect(SPACE);

    if (line === undefined && tokenStream.matches(LINE)) {
      var lines = [tokenStream.lastValue.toLowerCase()];
      tokenStream.saveRewindPoint();

      if (lines[0] !== 'none' && tokenStream.matches(SPACE) && tokenStream.matches(LINE)) {
        lines.push(tokenStream.lastValue.toLowerCase()); // Underline comes before line-through

        lines.sort().reverse();
      } else {
        tokenStream.rewind();
      }

      line = lines.join(' ');
    } else if (style === undefined && tokenStream.matches(STYLE$1)) {
      style = tokenStream.lastValue;
    } else if (color === undefined && tokenStream.matches(COLOR)) {
      color = tokenStream.lastValue;
    } else {
      tokenStream["throw"]();
    }

    didParseFirst = true;
  }

  return {
    textDecorationLine: line !== undefined ? line : defaultTextDecorationLine,
    textDecorationColor: color !== undefined ? color : defaultTextDecorationColor,
    textDecorationStyle: style !== undefined ? style : defaultTextDecorationStyle
  };
};

var textDecorationLine = function textDecorationLine(tokenStream) {
  var lines = [];
  var didParseFirst = false;

  while (tokenStream.hasTokens()) {
    if (didParseFirst) tokenStream.expect(SPACE);
    lines.push(tokenStream.expect(LINE).toLowerCase());
    didParseFirst = true;
  }

  lines.sort().reverse();
  return {
    textDecorationLine: lines.join(' ')
  };
};

var textShadow = function textShadow(tokenStream) {
  var _parseShadow2 = parseShadow(tokenStream),
      offset = _parseShadow2.offset,
      radius = _parseShadow2.radius,
      color = _parseShadow2.color;

  return {
    textShadowOffset: offset,
    textShadowRadius: radius,
    textShadowColor: color
  };
};

var oneOfType = function oneOfType(tokenType) {
  return function (functionStream) {
    var value = functionStream.expect(tokenType);
    functionStream.expectEmpty();
    return value;
  };
};

var singleNumber = oneOfType(NUMBER);
var singleLength = oneOfType(LENGTH);
var singleAngle = oneOfType(ANGLE);

var xyTransformFactory = function xyTransformFactory(tokenType) {
  return function (key, valueIfOmitted) {
    return function (functionStream) {
      var _ref3, _ref4;

      var x = functionStream.expect(tokenType);
      var y;

      if (functionStream.hasTokens()) {
        functionStream.expect(COMMA);
        y = functionStream.expect(tokenType);
      } else if (valueIfOmitted !== undefined) {
        y = valueIfOmitted;
      } else {
        // Assumption, if x === y, then we can omit XY
        // I.e. scale(5) => [{ scale: 5 }] rather than [{ scaleX: 5 }, { scaleY: 5 }]
        return x;
      }

      functionStream.expectEmpty();
      return [(_ref3 = {}, _ref3[key + "Y"] = y, _ref3), (_ref4 = {}, _ref4[key + "X"] = x, _ref4)];
    };
  };
};

var xyNumber = xyTransformFactory(NUMBER);
var xyLength = xyTransformFactory(LENGTH);
var xyAngle = xyTransformFactory(ANGLE);
var partTransforms = {
  perspective: singleNumber,
  scale: xyNumber('scale'),
  scaleX: singleNumber,
  scaleY: singleNumber,
  translate: xyLength('translate', 0),
  translateX: singleLength,
  translateY: singleLength,
  rotate: singleAngle,
  rotateX: singleAngle,
  rotateY: singleAngle,
  rotateZ: singleAngle,
  skewX: singleAngle,
  skewY: singleAngle,
  skew: xyAngle('skew', '0deg')
};

var transform = function transform(tokenStream) {
  var transforms = [];
  var didParseFirst = false;

  while (tokenStream.hasTokens()) {
    if (didParseFirst) tokenStream.expect(SPACE);
    var functionStream = tokenStream.expectFunction();
    var functionName = functionStream.functionName;
    var transformedValues = partTransforms[functionName](functionStream);

    if (!Array.isArray(transformedValues)) {
      var _ref5;

      transformedValues = [(_ref5 = {}, _ref5[functionName] = transformedValues, _ref5)];
    }

    transforms = transformedValues.concat(transforms);
    didParseFirst = true;
  }

  return {
    transform: transforms
  };
};

var background = function background(tokenStream) {
  return {
    backgroundColor: tokenStream.expect(COLOR)
  };
};

var borderColor = directionFactory({
  types: [COLOR],
  prefix: 'border',
  suffix: 'Color'
});
var borderRadius = directionFactory({
  directions: ['TopLeft', 'TopRight', 'BottomRight', 'BottomLeft'],
  prefix: 'border',
  suffix: 'Radius'
});
var borderWidth = directionFactory({
  prefix: 'border',
  suffix: 'Width'
});
var margin = directionFactory({
  types: [LENGTH, UNSUPPORTED_LENGTH_UNIT, PERCENT, AUTO],
  prefix: 'margin'
});
var padding = directionFactory({
  prefix: 'padding'
});

var fontWeight = function fontWeight(tokenStream) {
  return {
    fontWeight: tokenStream.expect(WORD) // Also match numbers as strings

  };
};

var shadowOffset = function shadowOffset(tokenStream) {
  return {
    shadowOffset: parseShadowOffset(tokenStream)
  };
};

var textShadowOffset = function textShadowOffset(tokenStream) {
  return {
    textShadowOffset: parseShadowOffset(tokenStream)
  };
};

var transforms = {
  aspectRatio: aspectRatio,
  background: background,
  border: border,
  borderColor: borderColor,
  borderRadius: borderRadius,
  borderWidth: borderWidth,
  boxShadow: boxShadow,
  flex: flex,
  flexFlow: flexFlow,
  font: font,
  fontFamily: fontFamily,
  fontVariant: fontVariant,
  fontWeight: fontWeight,
  margin: margin,
  padding: padding,
  placeContent: placeContent,
  shadowOffset: shadowOffset,
  textShadow: textShadow,
  textShadowOffset: textShadowOffset,
  textDecoration: textDecoration,
  textDecorationLine: textDecorationLine,
  transform: transform
};
var propertiesWithoutUnits;

if (false) {}

var devPropertiesWithUnitsRegExp = propertiesWithoutUnits != null ? new RegExp(propertiesWithoutUnits.join('|')) : null;
var SYMBOL_MATCH = 'SYMBOL_MATCH';

var TokenStream =
/*#__PURE__*/
function () {
  function TokenStream(nodes, parent) {
    this.index = 0;
    this.nodes = nodes;
    this.functionName = parent != null ? parent.value : null;
    this.lastValue = null;
    this.rewindIndex = -1;
  }

  var _proto = TokenStream.prototype;

  _proto.hasTokens = function hasTokens() {
    return this.index <= this.nodes.length - 1;
  };

  _proto[SYMBOL_MATCH] = function () {
    if (!this.hasTokens()) return null;
    var node = this.nodes[this.index];

    for (var i = 0; i < arguments.length; i += 1) {
      var tokenDescriptor = i < 0 || arguments.length <= i ? undefined : arguments[i];
      var value = tokenDescriptor(node);

      if (value !== null) {
        this.index += 1;
        this.lastValue = value;
        return value;
      }
    }

    return null;
  };

  _proto.matches = function matches() {
    return this[SYMBOL_MATCH].apply(this, arguments) !== null;
  };

  _proto.expect = function expect() {
    var value = this[SYMBOL_MATCH].apply(this, arguments);
    return value !== null ? value : this["throw"]();
  };

  _proto.matchesFunction = function matchesFunction() {
    var node = this.nodes[this.index];
    if (node.type !== 'function') return null;
    var value = new TokenStream(node.nodes, node);
    this.index += 1;
    this.lastValue = null;
    return value;
  };

  _proto.expectFunction = function expectFunction() {
    var value = this.matchesFunction();
    return value !== null ? value : this["throw"]();
  };

  _proto.expectEmpty = function expectEmpty() {
    if (this.hasTokens()) this["throw"]();
  };

  _proto["throw"] = function _throw() {
    throw new Error("Unexpected token type: " + this.nodes[this.index].type);
  };

  _proto.saveRewindPoint = function saveRewindPoint() {
    this.rewindIndex = this.index;
  };

  _proto.rewind = function rewind() {
    if (this.rewindIndex === -1) throw new Error('Internal error');
    this.index = this.rewindIndex;
    this.lastValue = null;
  };

  return TokenStream;
}();
/* eslint-disable no-param-reassign */
// Note if this is wrong, you'll need to change tokenTypes.js too


var numberOrLengthRe = /^([+-]?(?:\d*\.)?\d+(?:e[+-]?\d+)?)(?:px)?$/i;
var numberOnlyRe = /^[+-]?(?:\d*\.\d*|[1-9]\d*)(?:e[+-]?\d+)?$/i;
var boolRe = /^true|false$/i;
var nullRe = /^null$/i;
var undefinedRe = /^undefined$/i; // Undocumented export

var transformRawValue = function transformRawValue(propName, value) {
  if (false) { var isNumberWithoutUnit, needsUnit; }

  var numberMatch = value.match(numberOrLengthRe);
  if (numberMatch !== null) return Number(numberMatch[1]);
  var boolMatch = value.match(boolRe);
  if (boolMatch !== null) return boolMatch[0].toLowerCase() === 'true';
  var nullMatch = value.match(nullRe);
  if (nullMatch !== null) return null;
  var undefinedMatch = value.match(undefinedRe);
  if (undefinedMatch !== null) return undefined;
  return value;
};

var baseTransformShorthandValue = function baseTransformShorthandValue(propName, value) {
  var ast = parse__default(value);
  var tokenStream = new TokenStream(ast.nodes);
  return transforms[propName](tokenStream);
};

var transformShorthandValue =  true ? baseTransformShorthandValue : 0;

var getStylesForProperty = function getStylesForProperty(propName, inputValue, allowShorthand) {
  var _ref6;

  var isRawValue = allowShorthand === false || !(propName in transforms);
  var value = inputValue.trim();
  var propValues = isRawValue ? (_ref6 = {}, _ref6[propName] = transformRawValue(propName, value), _ref6) : transformShorthandValue(propName, value);
  return propValues;
};

var getPropertyName = function getPropertyName(propName) {
  var isCustomProp = /^--\w+/.test(propName);

  if (isCustomProp) {
    return propName;
  }

  return camelizeStyleName(propName);
};

var index = function index(rules, shorthandBlacklist) {
  if (shorthandBlacklist === void 0) {
    shorthandBlacklist = [];
  }

  return rules.reduce(function (accum, rule) {
    var propertyName = getPropertyName(rule[0]);
    var value = rule[1];
    var allowShorthand = shorthandBlacklist.indexOf(propertyName) === -1;
    return Object.assign(accum, getStylesForProperty(propertyName, value, allowShorthand));
  }, {});
};

__webpack_unused_export__ = index;
exports.Hp = getPropertyName;
exports.HM = getStylesForProperty;
__webpack_unused_export__ = transformRawValue;


/***/ }),

/***/ 819:
/***/ ((module) => {

"use strict";


var has = Object.prototype.hasOwnProperty
  , prefix = '~';

/**
 * Constructor to create a storage for our `EE` objects.
 * An `Events` instance is a plain object whose properties are event names.
 *
 * @constructor
 * @private
 */
function Events() {}

//
// We try to not inherit from `Object.prototype`. In some engines creating an
// instance in this way is faster than calling `Object.create(null)` directly.
// If `Object.create(null)` is not supported we prefix the event names with a
// character to make sure that the built-in object properties are not
// overridden or used as an attack vector.
//
if (Object.create) {
  Events.prototype = Object.create(null);

  //
  // This hack is needed because the `__proto__` property is still inherited in
  // some old browsers like Android 4, iPhone 5.1, Opera 11 and Safari 5.
  //
  if (!new Events().__proto__) prefix = false;
}

/**
 * Representation of a single event listener.
 *
 * @param {Function} fn The listener function.
 * @param {*} context The context to invoke the listener with.
 * @param {Boolean} [once=false] Specify if the listener is a one-time listener.
 * @constructor
 * @private
 */
function EE(fn, context, once) {
  this.fn = fn;
  this.context = context;
  this.once = once || false;
}

/**
 * Add a listener for a given event.
 *
 * @param {EventEmitter} emitter Reference to the `EventEmitter` instance.
 * @param {(String|Symbol)} event The event name.
 * @param {Function} fn The listener function.
 * @param {*} context The context to invoke the listener with.
 * @param {Boolean} once Specify if the listener is a one-time listener.
 * @returns {EventEmitter}
 * @private
 */
function addListener(emitter, event, fn, context, once) {
  if (typeof fn !== 'function') {
    throw new TypeError('The listener must be a function');
  }

  var listener = new EE(fn, context || emitter, once)
    , evt = prefix ? prefix + event : event;

  if (!emitter._events[evt]) emitter._events[evt] = listener, emitter._eventsCount++;
  else if (!emitter._events[evt].fn) emitter._events[evt].push(listener);
  else emitter._events[evt] = [emitter._events[evt], listener];

  return emitter;
}

/**
 * Clear event by name.
 *
 * @param {EventEmitter} emitter Reference to the `EventEmitter` instance.
 * @param {(String|Symbol)} evt The Event name.
 * @private
 */
function clearEvent(emitter, evt) {
  if (--emitter._eventsCount === 0) emitter._events = new Events();
  else delete emitter._events[evt];
}

/**
 * Minimal `EventEmitter` interface that is molded against the Node.js
 * `EventEmitter` interface.
 *
 * @constructor
 * @public
 */
function EventEmitter() {
  this._events = new Events();
  this._eventsCount = 0;
}

/**
 * Return an array listing the events for which the emitter has registered
 * listeners.
 *
 * @returns {Array}
 * @public
 */
EventEmitter.prototype.eventNames = function eventNames() {
  var names = []
    , events
    , name;

  if (this._eventsCount === 0) return names;

  for (name in (events = this._events)) {
    if (has.call(events, name)) names.push(prefix ? name.slice(1) : name);
  }

  if (Object.getOwnPropertySymbols) {
    return names.concat(Object.getOwnPropertySymbols(events));
  }

  return names;
};

/**
 * Return the listeners registered for a given event.
 *
 * @param {(String|Symbol)} event The event name.
 * @returns {Array} The registered listeners.
 * @public
 */
EventEmitter.prototype.listeners = function listeners(event) {
  var evt = prefix ? prefix + event : event
    , handlers = this._events[evt];

  if (!handlers) return [];
  if (handlers.fn) return [handlers.fn];

  for (var i = 0, l = handlers.length, ee = new Array(l); i < l; i++) {
    ee[i] = handlers[i].fn;
  }

  return ee;
};

/**
 * Return the number of listeners listening to a given event.
 *
 * @param {(String|Symbol)} event The event name.
 * @returns {Number} The number of listeners.
 * @public
 */
EventEmitter.prototype.listenerCount = function listenerCount(event) {
  var evt = prefix ? prefix + event : event
    , listeners = this._events[evt];

  if (!listeners) return 0;
  if (listeners.fn) return 1;
  return listeners.length;
};

/**
 * Calls each of the listeners registered for a given event.
 *
 * @param {(String|Symbol)} event The event name.
 * @returns {Boolean} `true` if the event had listeners, else `false`.
 * @public
 */
EventEmitter.prototype.emit = function emit(event, a1, a2, a3, a4, a5) {
  var evt = prefix ? prefix + event : event;

  if (!this._events[evt]) return false;

  var listeners = this._events[evt]
    , len = arguments.length
    , args
    , i;

  if (listeners.fn) {
    if (listeners.once) this.removeListener(event, listeners.fn, undefined, true);

    switch (len) {
      case 1: return listeners.fn.call(listeners.context), true;
      case 2: return listeners.fn.call(listeners.context, a1), true;
      case 3: return listeners.fn.call(listeners.context, a1, a2), true;
      case 4: return listeners.fn.call(listeners.context, a1, a2, a3), true;
      case 5: return listeners.fn.call(listeners.context, a1, a2, a3, a4), true;
      case 6: return listeners.fn.call(listeners.context, a1, a2, a3, a4, a5), true;
    }

    for (i = 1, args = new Array(len -1); i < len; i++) {
      args[i - 1] = arguments[i];
    }

    listeners.fn.apply(listeners.context, args);
  } else {
    var length = listeners.length
      , j;

    for (i = 0; i < length; i++) {
      if (listeners[i].once) this.removeListener(event, listeners[i].fn, undefined, true);

      switch (len) {
        case 1: listeners[i].fn.call(listeners[i].context); break;
        case 2: listeners[i].fn.call(listeners[i].context, a1); break;
        case 3: listeners[i].fn.call(listeners[i].context, a1, a2); break;
        case 4: listeners[i].fn.call(listeners[i].context, a1, a2, a3); break;
        default:
          if (!args) for (j = 1, args = new Array(len -1); j < len; j++) {
            args[j - 1] = arguments[j];
          }

          listeners[i].fn.apply(listeners[i].context, args);
      }
    }
  }

  return true;
};

/**
 * Add a listener for a given event.
 *
 * @param {(String|Symbol)} event The event name.
 * @param {Function} fn The listener function.
 * @param {*} [context=this] The context to invoke the listener with.
 * @returns {EventEmitter} `this`.
 * @public
 */
EventEmitter.prototype.on = function on(event, fn, context) {
  return addListener(this, event, fn, context, false);
};

/**
 * Add a one-time listener for a given event.
 *
 * @param {(String|Symbol)} event The event name.
 * @param {Function} fn The listener function.
 * @param {*} [context=this] The context to invoke the listener with.
 * @returns {EventEmitter} `this`.
 * @public
 */
EventEmitter.prototype.once = function once(event, fn, context) {
  return addListener(this, event, fn, context, true);
};

/**
 * Remove the listeners of a given event.
 *
 * @param {(String|Symbol)} event The event name.
 * @param {Function} fn Only remove the listeners that match this function.
 * @param {*} context Only remove the listeners that have this context.
 * @param {Boolean} once Only remove one-time listeners.
 * @returns {EventEmitter} `this`.
 * @public
 */
EventEmitter.prototype.removeListener = function removeListener(event, fn, context, once) {
  var evt = prefix ? prefix + event : event;

  if (!this._events[evt]) return this;
  if (!fn) {
    clearEvent(this, evt);
    return this;
  }

  var listeners = this._events[evt];

  if (listeners.fn) {
    if (
      listeners.fn === fn &&
      (!once || listeners.once) &&
      (!context || listeners.context === context)
    ) {
      clearEvent(this, evt);
    }
  } else {
    for (var i = 0, events = [], length = listeners.length; i < length; i++) {
      if (
        listeners[i].fn !== fn ||
        (once && !listeners[i].once) ||
        (context && listeners[i].context !== context)
      ) {
        events.push(listeners[i]);
      }
    }

    //
    // Reset the array, or remove it completely if we have no more listeners.
    //
    if (events.length) this._events[evt] = events.length === 1 ? events[0] : events;
    else clearEvent(this, evt);
  }

  return this;
};

/**
 * Remove all listeners, or those of the specified event.
 *
 * @param {(String|Symbol)} [event] The event name.
 * @returns {EventEmitter} `this`.
 * @public
 */
EventEmitter.prototype.removeAllListeners = function removeAllListeners(event) {
  var evt;

  if (event) {
    evt = prefix ? prefix + event : event;
    if (this._events[evt]) clearEvent(this, evt);
  } else {
    this._events = new Events();
    this._eventsCount = 0;
  }

  return this;
};

//
// Alias methods names because people roll like that.
//
EventEmitter.prototype.off = EventEmitter.prototype.removeListener;
EventEmitter.prototype.addListener = EventEmitter.prototype.on;

//
// Expose the prefix.
//
EventEmitter.prefixed = prefix;

//
// Allow `EventEmitter` to be imported as module namespace.
//
EventEmitter.EventEmitter = EventEmitter;

//
// Expose the module.
//
if (true) {
  module.exports = EventEmitter;
}


/***/ }),

/***/ 606:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const p_defer_1 = __importDefault(__webpack_require__(972));
function mapAgeCleaner(map, property = 'maxAge') {
    let processingKey;
    let processingTimer;
    let processingDeferred;
    const cleanup = () => __awaiter(this, void 0, void 0, function* () {
        if (processingKey !== undefined) {
            // If we are already processing an item, we can safely exit
            return;
        }
        const setupTimer = (item) => __awaiter(this, void 0, void 0, function* () {
            processingDeferred = p_defer_1.default();
            const delay = item[1][property] - Date.now();
            if (delay <= 0) {
                // Remove the item immediately if the delay is equal to or below 0
                map.delete(item[0]);
                processingDeferred.resolve();
                return;
            }
            // Keep track of the current processed key
            processingKey = item[0];
            processingTimer = setTimeout(() => {
                // Remove the item when the timeout fires
                map.delete(item[0]);
                if (processingDeferred) {
                    processingDeferred.resolve();
                }
            }, delay);
            // tslint:disable-next-line:strict-type-predicates
            if (typeof processingTimer.unref === 'function') {
                // Don't hold up the process from exiting
                processingTimer.unref();
            }
            return processingDeferred.promise;
        });
        try {
            for (const entry of map) {
                yield setupTimer(entry);
            }
        }
        catch (_a) {
            // Do nothing if an error occurs, this means the timer was cleaned up and we should stop processing
        }
        processingKey = undefined;
    });
    const reset = () => {
        processingKey = undefined;
        if (processingTimer !== undefined) {
            clearTimeout(processingTimer);
            processingTimer = undefined;
        }
        if (processingDeferred !== undefined) { // tslint:disable-line:early-exit
            processingDeferred.reject(undefined);
            processingDeferred = undefined;
        }
    };
    const originalSet = map.set.bind(map);
    map.set = (key, value) => {
        if (map.has(key)) {
            // If the key already exist, remove it so we can add it back at the end of the map.
            map.delete(key);
        }
        // Call the original `map.set`
        const result = originalSet(key, value);
        // If we are already processing a key and the key added is the current processed key, stop processing it
        if (processingKey && processingKey === key) {
            reset();
        }
        // Always run the cleanup method in case it wasn't started yet
        cleanup(); // tslint:disable-line:no-floating-promises
        return result;
    };
    cleanup(); // tslint:disable-line:no-floating-promises
    return map;
}
exports["default"] = mapAgeCleaner;
// Add support for CJS
module.exports = mapAgeCleaner;
module.exports["default"] = mapAgeCleaner;


/***/ }),

/***/ 350:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* export default binding */ __WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var next_dist_server_web_adapter__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(384);

        

        (0,next_dist_server_web_adapter__WEBPACK_IMPORTED_MODULE_0__/* .enhanceGlobals */ .gL)()

        var mod = __webpack_require__(397)
        var handler = mod.middleware || mod.default;

        if (typeof handler !== 'function') {
          throw new Error('The Edge Function "pages/api/social-image" must export a `default` function');
        }

        /* harmony default export */ function __WEBPACK_DEFAULT_EXPORT__(opts) {
          return (0,next_dist_server_web_adapter__WEBPACK_IMPORTED_MODULE_0__/* .adapter */ .VL)({
              ...opts,
              page: "/api/social-image",
              handler,
          })
        }
    

/***/ }),

/***/ 742:
/***/ ((module) => {

module.exports = "blob:noto-sans-v27-latin-regular.5dda3fca77107598.ttf"

/***/ }),

/***/ 140:
/***/ ((module) => {

module.exports = "blob:Inter-Regular.8c0fe73bdbebb91d.ttf"

/***/ }),

/***/ 118:
/***/ ((module) => {

module.exports = "blob:Inter-SemiBold.48eaf57b160b007a.ttf"

/***/ }),

/***/ 966:
/***/ ((module) => {

module.exports = wasm_53adb396180a95eb122a0218c93e3d6474b1a27e;

/***/ }),

/***/ 744:
/***/ ((module) => {

module.exports = wasm_5b50c798761dc0131e9ebe945031077e8a02633b;

/***/ }),

/***/ 802:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({
    value: true
}));
exports.getHostname = getHostname;
function getHostname(parsed, headers) {
    var ref;
    return (ref = !Array.isArray(headers == null ? void 0 : headers.host) && (headers == null ? void 0 : headers.host) || parsed.hostname) == null ? void 0 : ref.split(":")[0].toLowerCase();
} //# sourceMappingURL=get-hostname.js.map


/***/ }),

/***/ 156:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({
    value: true
}));
exports.detectDomainLocale = detectDomainLocale;
function detectDomainLocale(domainItems, hostname, detectedLocale) {
    let domainItem;
    if (domainItems) {
        if (detectedLocale) {
            detectedLocale = detectedLocale.toLowerCase();
        }
        for (const item of domainItems){
            var ref, ref1;
            // remove port if present
            const domainHostname = (ref = item.domain) == null ? void 0 : ref.split(":")[0].toLowerCase();
            if (hostname === domainHostname || detectedLocale === item.defaultLocale.toLowerCase() || ((ref1 = item.locales) == null ? void 0 : ref1.some((locale)=>locale.toLowerCase() === detectedLocale))) {
                domainItem = item;
                break;
            }
        }
    }
    return domainItem;
} //# sourceMappingURL=detect-domain-locale.js.map


/***/ }),

/***/ 897:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({
    value: true
}));
exports.normalizeLocalePath = normalizeLocalePath;
function normalizeLocalePath(pathname, locales) {
    let detectedLocale;
    // first item will be empty string from splitting at first char
    const pathnameParts = pathname.split("/");
    (locales || []).some((locale)=>{
        if (pathnameParts[1] && pathnameParts[1].toLowerCase() === locale.toLowerCase()) {
            detectedLocale = locale;
            pathnameParts.splice(1, 1);
            pathname = pathnameParts.join("/") || "/";
            return true;
        }
        return false;
    });
    return {
        pathname,
        detectedLocale
    };
} //# sourceMappingURL=normalize-locale-path.js.map


/***/ }),

/***/ 864:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({
    value: true
}));
exports.addLocale = addLocale;
var _addPathPrefix = __webpack_require__(24);
var _pathHasPrefix = __webpack_require__(174);
function addLocale(path, locale, defaultLocale, ignorePrefix) {
    if (locale && locale !== defaultLocale && (ignorePrefix || !(0, _pathHasPrefix).pathHasPrefix(path.toLowerCase(), `/${locale.toLowerCase()}`) && !(0, _pathHasPrefix).pathHasPrefix(path.toLowerCase(), "/api"))) {
        return (0, _addPathPrefix).addPathPrefix(path, `/${locale}`);
    }
    return path;
} //# sourceMappingURL=add-locale.js.map


/***/ }),

/***/ 24:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({
    value: true
}));
exports.addPathPrefix = addPathPrefix;
var _parsePath = __webpack_require__(735);
function addPathPrefix(path, prefix) {
    if (!path.startsWith("/") || !prefix) {
        return path;
    }
    const { pathname , query , hash  } = (0, _parsePath).parsePath(path);
    return `${prefix}${pathname}${query}${hash}`;
} //# sourceMappingURL=add-path-prefix.js.map


/***/ }),

/***/ 614:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({
    value: true
}));
exports.addPathSuffix = addPathSuffix;
var _parsePath = __webpack_require__(735);
function addPathSuffix(path, suffix) {
    if (!path.startsWith("/") || !suffix) {
        return path;
    }
    const { pathname , query , hash  } = (0, _parsePath).parsePath(path);
    return `${pathname}${suffix}${query}${hash}`;
} //# sourceMappingURL=add-path-suffix.js.map


/***/ }),

/***/ 356:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({
    value: true
}));
exports.formatNextPathnameInfo = formatNextPathnameInfo;
var _removeTrailingSlash = __webpack_require__(331);
var _addPathPrefix = __webpack_require__(24);
var _addPathSuffix = __webpack_require__(614);
var _addLocale = __webpack_require__(864);
function formatNextPathnameInfo(info) {
    let pathname = (0, _addLocale).addLocale(info.pathname, info.locale, info.buildId ? undefined : info.defaultLocale, info.ignorePrefix);
    if (info.buildId) {
        pathname = (0, _addPathSuffix).addPathSuffix((0, _addPathPrefix).addPathPrefix(pathname, `/_next/data/${info.buildId}`), info.pathname === "/" ? "index.json" : ".json");
    }
    pathname = (0, _addPathPrefix).addPathPrefix(pathname, info.basePath);
    return info.trailingSlash ? !info.buildId && !pathname.endsWith("/") ? (0, _addPathSuffix).addPathSuffix(pathname, "/") : pathname : (0, _removeTrailingSlash).removeTrailingSlash(pathname);
} //# sourceMappingURL=format-next-pathname-info.js.map


/***/ }),

/***/ 764:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({
    value: true
}));
exports.getNextPathnameInfo = getNextPathnameInfo;
var _normalizeLocalePath = __webpack_require__(897);
var _removePathPrefix = __webpack_require__(917);
var _pathHasPrefix = __webpack_require__(174);
function getNextPathnameInfo(pathname, options) {
    var _nextConfig;
    const { basePath , i18n , trailingSlash  } = (_nextConfig = options.nextConfig) != null ? _nextConfig : {};
    const info = {
        pathname: pathname,
        trailingSlash: pathname !== "/" ? pathname.endsWith("/") : trailingSlash
    };
    if (basePath && (0, _pathHasPrefix).pathHasPrefix(info.pathname, basePath)) {
        info.pathname = (0, _removePathPrefix).removePathPrefix(info.pathname, basePath);
        info.basePath = basePath;
    }
    if (options.parseData === true && info.pathname.startsWith("/_next/data/") && info.pathname.endsWith(".json")) {
        const paths = info.pathname.replace(/^\/_next\/data\//, "").replace(/\.json$/, "").split("/");
        const buildId = paths[0];
        info.pathname = paths[1] !== "index" ? `/${paths.slice(1).join("/")}` : "/";
        info.buildId = buildId;
    }
    if (i18n) {
        const pathLocale = (0, _normalizeLocalePath).normalizeLocalePath(info.pathname, i18n.locales);
        info.locale = pathLocale == null ? void 0 : pathLocale.detectedLocale;
        info.pathname = (pathLocale == null ? void 0 : pathLocale.pathname) || info.pathname;
    }
    return info;
} //# sourceMappingURL=get-next-pathname-info.js.map


/***/ }),

/***/ 735:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({
    value: true
}));
exports.parsePath = parsePath;
function parsePath(path) {
    const hashIndex = path.indexOf("#");
    const queryIndex = path.indexOf("?");
    const hasQuery = queryIndex > -1 && (hashIndex < 0 || queryIndex < hashIndex);
    if (hasQuery || hashIndex > -1) {
        return {
            pathname: path.substring(0, hasQuery ? queryIndex : hashIndex),
            query: hasQuery ? path.substring(queryIndex, hashIndex > -1 ? hashIndex : undefined) : "",
            hash: hashIndex > -1 ? path.slice(hashIndex) : ""
        };
    }
    return {
        pathname: path,
        query: "",
        hash: ""
    };
} //# sourceMappingURL=parse-path.js.map


/***/ }),

/***/ 174:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({
    value: true
}));
exports.pathHasPrefix = pathHasPrefix;
var _parsePath = __webpack_require__(735);
function pathHasPrefix(path, prefix) {
    if (typeof path !== "string") {
        return false;
    }
    const { pathname  } = (0, _parsePath).parsePath(path);
    return pathname === prefix || pathname.startsWith(prefix + "/");
} //# sourceMappingURL=path-has-prefix.js.map


/***/ }),

/***/ 73:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({
    value: true
}));
exports.relativizeURL = relativizeURL;
function relativizeURL(url, base) {
    const baseURL = typeof base === "string" ? new URL(base) : base;
    const relative = new URL(url, base);
    const origin = `${baseURL.protocol}//${baseURL.host}`;
    return `${relative.protocol}//${relative.host}` === origin ? relative.toString().replace(origin, "") : relative.toString();
} //# sourceMappingURL=relativize-url.js.map


/***/ }),

/***/ 917:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({
    value: true
}));
exports.removePathPrefix = removePathPrefix;
var _pathHasPrefix = __webpack_require__(174);
function removePathPrefix(path, prefix) {
    if ((0, _pathHasPrefix).pathHasPrefix(path, prefix)) {
        const withoutPrefix = path.slice(prefix.length);
        return withoutPrefix.startsWith("/") ? withoutPrefix : `/${withoutPrefix}`;
    }
    return path;
} //# sourceMappingURL=remove-path-prefix.js.map


/***/ }),

/***/ 331:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({
    value: true
}));
exports.removeTrailingSlash = removeTrailingSlash;
function removeTrailingSlash(route) {
    return route.replace(/\/$/, "") || "/";
} //# sourceMappingURL=remove-trailing-slash.js.map


/***/ }),

/***/ 397:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  "config": () => (/* binding */ config),
  "default": () => (/* binding */ OGImage)
});

// EXTERNAL MODULE: ./node_modules/react/jsx-runtime.js
var jsx_runtime = __webpack_require__(425);
// EXTERNAL MODULE: ./node_modules/react/index.js
var react = __webpack_require__(618);
// EXTERNAL MODULE: ./node_modules/css-to-react-native/index.js
var css_to_react_native = __webpack_require__(915);
// EXTERNAL MODULE: ./node_modules/css-background-parser/index.js
var css_background_parser = __webpack_require__(969);
// EXTERNAL MODULE: ./node_modules/css-box-shadow/index.js
var css_box_shadow = __webpack_require__(631);
// EXTERNAL MODULE: ./node_modules/postcss-value-parser/lib/index.js
var lib = __webpack_require__(627);
;// CONCATENATED MODULE: ./node_modules/@shuding/opentype.js/dist/opentype.module.js
/**
 * https://opentype.js.org v1.3.5 | (c) Frederik De Bleser and other contributors | MIT License | Uses fflate by 101arrowz and string.prototype.codepointat polyfill by Mathias Bynens
 */

// DEFLATE is a complex format; to read this code, you should probably check the RFC first:

// aliases for shorter compressed code (most minifers don't do this)
var u8 = Uint8Array, u16 = Uint16Array, u32 = Uint32Array;
// fixed length extra bits
var fleb = new u8([0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 2, 2, 2, 2, 3, 3, 3, 3, 4, 4, 4, 4, 5, 5, 5, 5, 0, /* unused */ 0, 0, /* impossible */ 0]);
// fixed distance extra bits
// see fleb note
var fdeb = new u8([0, 0, 0, 0, 1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8, 9, 9, 10, 10, 11, 11, 12, 12, 13, 13, /* unused */ 0, 0]);
// code length index map
var clim = new u8([16, 17, 18, 0, 8, 7, 9, 6, 10, 5, 11, 4, 12, 3, 13, 2, 14, 1, 15]);
// get base, reverse index map from extra bits
var freb = function (eb, start) {
    var b = new u16(31);
    for (var i = 0; i < 31; ++i) {
        b[i] = start += 1 << eb[i - 1];
    }
    // numbers here are at max 18 bits
    var r = new u32(b[30]);
    for (var i = 1; i < 30; ++i) {
        for (var j = b[i]; j < b[i + 1]; ++j) {
            r[j] = ((j - b[i]) << 5) | i;
        }
    }
    return [b, r];
};
var _a = freb(fleb, 2), fl = _a[0], revfl = _a[1];
// we can ignore the fact that the other numbers are wrong; they never happen anyway
fl[28] = 258, revfl[258] = 28;
var _b = freb(fdeb, 0), fd = _b[0];
// map of value to reverse (assuming 16 bits)
var rev = new u16(32768);
for (var opentype_module_i = 0; opentype_module_i < 32768; ++opentype_module_i) {
    // reverse table algorithm from SO
    var x = ((opentype_module_i & 0xAAAA) >>> 1) | ((opentype_module_i & 0x5555) << 1);
    x = ((x & 0xCCCC) >>> 2) | ((x & 0x3333) << 2);
    x = ((x & 0xF0F0) >>> 4) | ((x & 0x0F0F) << 4);
    rev[opentype_module_i] = (((x & 0xFF00) >>> 8) | ((x & 0x00FF) << 8)) >>> 1;
}
// create huffman tree from u8 "map": index -> code length for code index
// mb (max bits) must be at most 15
// TODO: optimize/split up?
var hMap = (function (cd, mb, r) {
    var s = cd.length;
    // index
    var i = 0;
    // u16 "map": index -> # of codes with bit length = index
    var l = new u16(mb);
    // length of cd must be 288 (total # of codes)
    for (; i < s; ++i) {
        if (cd[i])
            { ++l[cd[i] - 1]; }
    }
    // u16 "map": index -> minimum code for bit length = index
    var le = new u16(mb);
    for (i = 0; i < mb; ++i) {
        le[i] = (le[i - 1] + l[i - 1]) << 1;
    }
    var co;
    if (r) {
        // u16 "map": index -> number of actual bits, symbol for code
        co = new u16(1 << mb);
        // bits to remove for reverser
        var rvb = 15 - mb;
        for (i = 0; i < s; ++i) {
            // ignore 0 lengths
            if (cd[i]) {
                // num encoding both symbol and bits read
                var sv = (i << 4) | cd[i];
                // free bits
                var r_1 = mb - cd[i];
                // start value
                var v = le[cd[i] - 1]++ << r_1;
                // m is end value
                for (var m = v | ((1 << r_1) - 1); v <= m; ++v) {
                    // every 16 bit value starting with the code yields the same result
                    co[rev[v] >>> rvb] = sv;
                }
            }
        }
    }
    else {
        co = new u16(s);
        for (i = 0; i < s; ++i) {
            if (cd[i]) {
                co[i] = rev[le[cd[i] - 1]++] >>> (15 - cd[i]);
            }
        }
    }
    return co;
});
// fixed length tree
var flt = new u8(288);
for (var opentype_module_i = 0; opentype_module_i < 144; ++opentype_module_i)
    { flt[opentype_module_i] = 8; }
for (var opentype_module_i = 144; opentype_module_i < 256; ++opentype_module_i)
    { flt[opentype_module_i] = 9; }
for (var opentype_module_i = 256; opentype_module_i < 280; ++opentype_module_i)
    { flt[opentype_module_i] = 7; }
for (var opentype_module_i = 280; opentype_module_i < 288; ++opentype_module_i)
    { flt[opentype_module_i] = 8; }
// fixed distance tree
var fdt = new u8(32);
for (var opentype_module_i = 0; opentype_module_i < 32; ++opentype_module_i)
    { fdt[opentype_module_i] = 5; }
// fixed length map
var flrm = /*#__PURE__*/ hMap(flt, 9, 1);
// fixed distance map
var fdrm = /*#__PURE__*/ hMap(fdt, 5, 1);
// find max of array
var max = function (a) {
    var m = a[0];
    for (var i = 1; i < a.length; ++i) {
        if (a[i] > m)
            { m = a[i]; }
    }
    return m;
};
// read d, starting at bit p and mask with m
var bits = function (d, p, m) {
    var o = (p / 8) | 0;
    return ((d[o] | (d[o + 1] << 8)) >> (p & 7)) & m;
};
// read d, starting at bit p continuing for at least 16 bits
var bits16 = function (d, p) {
    var o = (p / 8) | 0;
    return ((d[o] | (d[o + 1] << 8) | (d[o + 2] << 16)) >> (p & 7));
};
// get end of byte
var shft = function (p) { return ((p + 7) / 8) | 0; };
// typed array slice - allows garbage collector to free original reference,
// while being more compatible than .slice
var slc = function (v, s, e) {
    if (s == null || s < 0)
        { s = 0; }
    if (e == null || e > v.length)
        { e = v.length; }
    // can't use .constructor in case user-supplied
    var n = new (v.BYTES_PER_ELEMENT == 2 ? u16 : v.BYTES_PER_ELEMENT == 4 ? u32 : u8)(e - s);
    n.set(v.subarray(s, e));
    return n;
};
// error codes
var ec = [
    'unexpected EOF',
    'invalid block type',
    'invalid length/literal',
    'invalid distance',
    'stream finished',
    'no stream handler',
    ,
    'no callback',
    'invalid UTF-8 data',
    'extra field too long',
    'date not in range 1980-2099',
    'filename too long',
    'stream finishing',
    'invalid zip data'
    // determined by unknown compression method
];
var err = function (ind, msg, nt) {
    var e = new Error(msg || ec[ind]);
    e.code = ind;
    if (Error.captureStackTrace)
        { Error.captureStackTrace(e, err); }
    if (!nt)
        { throw e; }
    return e;
};
// expands raw DEFLATE data
var inflt = function (dat, buf, st) {
    // source length
    var sl = dat.length;
    if (!sl || (st && st.f && !st.l))
        { return buf || new u8(0); }
    // have to estimate size
    var noBuf = !buf || st;
    // no state
    var noSt = !st || st.i;
    if (!st)
        { st = {}; }
    // Assumes roughly 33% compression ratio average
    if (!buf)
        { buf = new u8(sl * 3); }
    // ensure buffer can fit at least l elements
    var cbuf = function (l) {
        var bl = buf.length;
        // need to increase size to fit
        if (l > bl) {
            // Double or set to necessary, whichever is greater
            var nbuf = new u8(Math.max(bl * 2, l));
            nbuf.set(buf);
            buf = nbuf;
        }
    };
    //  last chunk         bitpos           bytes
    var final = st.f || 0, pos = st.p || 0, bt = st.b || 0, lm = st.l, dm = st.d, lbt = st.m, dbt = st.n;
    // total bits
    var tbts = sl * 8;
    do {
        if (!lm) {
            // BFINAL - this is only 1 when last chunk is next
            final = bits(dat, pos, 1);
            // type: 0 = no compression, 1 = fixed huffman, 2 = dynamic huffman
            var type = bits(dat, pos + 1, 3);
            pos += 3;
            if (!type) {
                // go to end of byte boundary
                var s = shft(pos) + 4, l = dat[s - 4] | (dat[s - 3] << 8), t = s + l;
                if (t > sl) {
                    if (noSt)
                        { err(0); }
                    break;
                }
                // ensure size
                if (noBuf)
                    { cbuf(bt + l); }
                // Copy over uncompressed data
                buf.set(dat.subarray(s, t), bt);
                // Get new bitpos, update byte count
                st.b = bt += l, st.p = pos = t * 8, st.f = final;
                continue;
            }
            else if (type == 1)
                { lm = flrm, dm = fdrm, lbt = 9, dbt = 5; }
            else if (type == 2) {
                //  literal                            lengths
                var hLit = bits(dat, pos, 31) + 257, hcLen = bits(dat, pos + 10, 15) + 4;
                var tl = hLit + bits(dat, pos + 5, 31) + 1;
                pos += 14;
                // length+distance tree
                var ldt = new u8(tl);
                // code length tree
                var clt = new u8(19);
                for (var i = 0; i < hcLen; ++i) {
                    // use index map to get real code
                    clt[clim[i]] = bits(dat, pos + i * 3, 7);
                }
                pos += hcLen * 3;
                // code lengths bits
                var clb = max(clt), clbmsk = (1 << clb) - 1;
                // code lengths map
                var clm = hMap(clt, clb, 1);
                for (var i = 0; i < tl;) {
                    var r = clm[bits(dat, pos, clbmsk)];
                    // bits read
                    pos += r & 15;
                    // symbol
                    var s = r >>> 4;
                    // code length to copy
                    if (s < 16) {
                        ldt[i++] = s;
                    }
                    else {
                        //  copy   count
                        var c = 0, n = 0;
                        if (s == 16)
                            { n = 3 + bits(dat, pos, 3), pos += 2, c = ldt[i - 1]; }
                        else if (s == 17)
                            { n = 3 + bits(dat, pos, 7), pos += 3; }
                        else if (s == 18)
                            { n = 11 + bits(dat, pos, 127), pos += 7; }
                        while (n--)
                            { ldt[i++] = c; }
                    }
                }
                //    length tree                 distance tree
                var lt = ldt.subarray(0, hLit), dt = ldt.subarray(hLit);
                // max length bits
                lbt = max(lt);
                // max dist bits
                dbt = max(dt);
                lm = hMap(lt, lbt, 1);
                dm = hMap(dt, dbt, 1);
            }
            else
                { err(1); }
            if (pos > tbts) {
                if (noSt)
                    { err(0); }
                break;
            }
        }
        // Make sure the buffer can hold this + the largest possible addition
        // Maximum chunk size (practically, theoretically infinite) is 2^17;
        if (noBuf)
            { cbuf(bt + 131072); }
        var lms = (1 << lbt) - 1, dms = (1 << dbt) - 1;
        var lpos = pos;
        for (;; lpos = pos) {
            // bits read, code
            var c = lm[bits16(dat, pos) & lms], sym = c >>> 4;
            pos += c & 15;
            if (pos > tbts) {
                if (noSt)
                    { err(0); }
                break;
            }
            if (!c)
                { err(2); }
            if (sym < 256)
                { buf[bt++] = sym; }
            else if (sym == 256) {
                lpos = pos, lm = null;
                break;
            }
            else {
                var add = sym - 254;
                // no extra bits needed if less
                if (sym > 264) {
                    // index
                    var i = sym - 257, b = fleb[i];
                    add = bits(dat, pos, (1 << b) - 1) + fl[i];
                    pos += b;
                }
                // dist
                var d = dm[bits16(dat, pos) & dms], dsym = d >>> 4;
                if (!d)
                    { err(3); }
                pos += d & 15;
                var dt = fd[dsym];
                if (dsym > 3) {
                    var b = fdeb[dsym];
                    dt += bits16(dat, pos) & ((1 << b) - 1), pos += b;
                }
                if (pos > tbts) {
                    if (noSt)
                        { err(0); }
                    break;
                }
                if (noBuf)
                    { cbuf(bt + 131072); }
                var end = bt + add;
                for (; bt < end; bt += 4) {
                    buf[bt] = buf[bt - dt];
                    buf[bt + 1] = buf[bt + 1 - dt];
                    buf[bt + 2] = buf[bt + 2 - dt];
                    buf[bt + 3] = buf[bt + 3 - dt];
                }
                bt = end;
            }
        }
        st.l = lm, st.p = lpos, st.b = bt, st.f = final;
        if (lm)
            { final = 1, st.m = lbt, st.d = dm, st.n = dbt; }
    } while (!final);
    return bt == buf.length ? buf : slc(buf, 0, bt);
};
// empty
var et = /*#__PURE__*/ new u8(0);
/**
 * Expands DEFLATE data with no wrapper
 * @param data The data to decompress
 * @param out Where to write the data. Saves memory if you know the decompressed size and provide an output buffer of that length.
 * @returns The decompressed version of the data
 */
function inflateSync(data, out) {
    return inflt(data, out);
}
// text decoder
var td = typeof TextDecoder != 'undefined' && /*#__PURE__*/ new TextDecoder();
// text decoder stream
var tds = 0;
try {
    td.decode(et, { stream: true });
    tds = 1;
}
catch (e) { }

// Geometric objects

// import BoundingBox from './bbox';

/**
 * A bézier path containing a set of path commands similar to a SVG path.
 * Paths can be drawn on a context using `draw`.
 * @exports opentype.Path
 * @class
 * @constructor
 */
function Path() {
    this.commands = [];
    this.fill = 'black';
    this.stroke = null;
    this.strokeWidth = 1;
}

/**
 * @param  {number} x
 * @param  {number} y
 */
Path.prototype.moveTo = function (x, y) {
    this.commands.push({
        type: 'M',
        x: x,
        y: y,
    });
};

/**
 * @param  {number} x
 * @param  {number} y
 */
Path.prototype.lineTo = function (x, y) {
    this.commands.push({
        type: 'L',
        x: x,
        y: y,
    });
};

/**
 * Draws cubic curve
 * @function
 * curveTo
 * @memberof opentype.Path.prototype
 * @param  {number} x1 - x of control 1
 * @param  {number} y1 - y of control 1
 * @param  {number} x2 - x of control 2
 * @param  {number} y2 - y of control 2
 * @param  {number} x - x of path point
 * @param  {number} y - y of path point
 */

/**
 * Draws cubic curve
 * @function
 * bezierCurveTo
 * @memberof opentype.Path.prototype
 * @param  {number} x1 - x of control 1
 * @param  {number} y1 - y of control 1
 * @param  {number} x2 - x of control 2
 * @param  {number} y2 - y of control 2
 * @param  {number} x - x of path point
 * @param  {number} y - y of path point
 * @see curveTo
 */
Path.prototype.curveTo = Path.prototype.bezierCurveTo = function (
    x1,
    y1,
    x2,
    y2,
    x,
    y
) {
    this.commands.push({
        type: 'C',
        x1: x1,
        y1: y1,
        x2: x2,
        y2: y2,
        x: x,
        y: y,
    });
};

/**
 * Draws quadratic curve
 * @function
 * quadraticCurveTo
 * @memberof opentype.Path.prototype
 * @param  {number} x1 - x of control
 * @param  {number} y1 - y of control
 * @param  {number} x - x of path point
 * @param  {number} y - y of path point
 */

/**
 * Draws quadratic curve
 * @function
 * quadTo
 * @memberof opentype.Path.prototype
 * @param  {number} x1 - x of control
 * @param  {number} y1 - y of control
 * @param  {number} x - x of path point
 * @param  {number} y - y of path point
 */
Path.prototype.quadTo = Path.prototype.quadraticCurveTo = function (
    x1,
    y1,
    x,
    y
) {
    this.commands.push({
        type: 'Q',
        x1: x1,
        y1: y1,
        x: x,
        y: y,
    });
};

/**
 * Closes the path
 * @function closePath
 * @memberof opentype.Path.prototype
 */

/**
 * Close the path
 * @function close
 * @memberof opentype.Path.prototype
 */
Path.prototype.close = Path.prototype.closePath = function () {
    this.commands.push({
        type: 'Z',
    });
};

/**
 * Add the given path or list of commands to the commands of this path.
 * @param  {Array} pathOrCommands - another opentype.Path, an opentype.BoundingBox, or an array of commands.
 */
Path.prototype.extend = function (pathOrCommands) {
    if (pathOrCommands.commands) {
        pathOrCommands = pathOrCommands.commands;
    }
    // else if (pathOrCommands instanceof BoundingBox) {
    //     const box = pathOrCommands;
    //     this.moveTo(box.x1, box.y1);
    //     this.lineTo(box.x2, box.y1);
    //     this.lineTo(box.x2, box.y2);
    //     this.lineTo(box.x1, box.y2);
    //     this.close();
    //     return;
    // }

    Array.prototype.push.apply(this.commands, pathOrCommands);
};

/**
 * Convert the Path to a string of path data instructions
 * See http://www.w3.org/TR/SVG/paths.html#PathData
 * @param  {number} [decimalPlaces=2] - The amount of decimal places for floating-point values
 * @return {string}
 */
Path.prototype.toPathData = function (decimalPlaces) {
    decimalPlaces = decimalPlaces !== undefined ? decimalPlaces : 2;

    function floatToString(v) {
        if (Math.round(v) === v) {
            return '' + Math.round(v);
        } else {
            return v.toFixed(decimalPlaces);
        }
    }

    function packValues() {
        var arguments$1 = arguments;

        var s = '';
        for (var i = 0; i < arguments.length; i += 1) {
            var v = arguments$1[i];
            if (v >= 0 && i > 0) {
                s += ' ';
            }

            s += floatToString(v);
        }

        return s;
    }

    var d = '';
    for (var i = 0; i < this.commands.length; i += 1) {
        var cmd = this.commands[i];
        if (cmd.type === 'M') {
            d += 'M' + packValues(cmd.x, cmd.y);
        } else if (cmd.type === 'L') {
            d += 'L' + packValues(cmd.x, cmd.y);
        } else if (cmd.type === 'C') {
            d += 'C' + packValues(cmd.x1, cmd.y1, cmd.x2, cmd.y2, cmd.x, cmd.y);
        } else if (cmd.type === 'Q') {
            d += 'Q' + packValues(cmd.x1, cmd.y1, cmd.x, cmd.y);
        } else if (cmd.type === 'Z') {
            d += 'Z';
        }
    }

    return d;
};

// Glyph encoding

var cffStandardStrings = [
    '.notdef',
    'space',
    'exclam',
    'quotedbl',
    'numbersign',
    'dollar',
    'percent',
    'ampersand',
    'quoteright',
    'parenleft',
    'parenright',
    'asterisk',
    'plus',
    'comma',
    'hyphen',
    'period',
    'slash',
    'zero',
    'one',
    'two',
    'three',
    'four',
    'five',
    'six',
    'seven',
    'eight',
    'nine',
    'colon',
    'semicolon',
    'less',
    'equal',
    'greater',
    'question',
    'at',
    'A',
    'B',
    'C',
    'D',
    'E',
    'F',
    'G',
    'H',
    'I',
    'J',
    'K',
    'L',
    'M',
    'N',
    'O',
    'P',
    'Q',
    'R',
    'S',
    'T',
    'U',
    'V',
    'W',
    'X',
    'Y',
    'Z',
    'bracketleft',
    'backslash',
    'bracketright',
    'asciicircum',
    'underscore',
    'quoteleft',
    'a',
    'b',
    'c',
    'd',
    'e',
    'f',
    'g',
    'h',
    'i',
    'j',
    'k',
    'l',
    'm',
    'n',
    'o',
    'p',
    'q',
    'r',
    's',
    't',
    'u',
    'v',
    'w',
    'x',
    'y',
    'z',
    'braceleft',
    'bar',
    'braceright',
    'asciitilde',
    'exclamdown',
    'cent',
    'sterling',
    'fraction',
    'yen',
    'florin',
    'section',
    'currency',
    'quotesingle',
    'quotedblleft',
    'guillemotleft',
    'guilsinglleft',
    'guilsinglright',
    'fi',
    'fl',
    'endash',
    'dagger',
    'daggerdbl',
    'periodcentered',
    'paragraph',
    'bullet',
    'quotesinglbase',
    'quotedblbase',
    'quotedblright',
    'guillemotright',
    'ellipsis',
    'perthousand',
    'questiondown',
    'grave',
    'acute',
    'circumflex',
    'tilde',
    'macron',
    'breve',
    'dotaccent',
    'dieresis',
    'ring',
    'cedilla',
    'hungarumlaut',
    'ogonek',
    'caron',
    'emdash',
    'AE',
    'ordfeminine',
    'Lslash',
    'Oslash',
    'OE',
    'ordmasculine',
    'ae',
    'dotlessi',
    'lslash',
    'oslash',
    'oe',
    'germandbls',
    'onesuperior',
    'logicalnot',
    'mu',
    'trademark',
    'Eth',
    'onehalf',
    'plusminus',
    'Thorn',
    'onequarter',
    'divide',
    'brokenbar',
    'degree',
    'thorn',
    'threequarters',
    'twosuperior',
    'registered',
    'minus',
    'eth',
    'multiply',
    'threesuperior',
    'copyright',
    'Aacute',
    'Acircumflex',
    'Adieresis',
    'Agrave',
    'Aring',
    'Atilde',
    'Ccedilla',
    'Eacute',
    'Ecircumflex',
    'Edieresis',
    'Egrave',
    'Iacute',
    'Icircumflex',
    'Idieresis',
    'Igrave',
    'Ntilde',
    'Oacute',
    'Ocircumflex',
    'Odieresis',
    'Ograve',
    'Otilde',
    'Scaron',
    'Uacute',
    'Ucircumflex',
    'Udieresis',
    'Ugrave',
    'Yacute',
    'Ydieresis',
    'Zcaron',
    'aacute',
    'acircumflex',
    'adieresis',
    'agrave',
    'aring',
    'atilde',
    'ccedilla',
    'eacute',
    'ecircumflex',
    'edieresis',
    'egrave',
    'iacute',
    'icircumflex',
    'idieresis',
    'igrave',
    'ntilde',
    'oacute',
    'ocircumflex',
    'odieresis',
    'ograve',
    'otilde',
    'scaron',
    'uacute',
    'ucircumflex',
    'udieresis',
    'ugrave',
    'yacute',
    'ydieresis',
    'zcaron',
    'exclamsmall',
    'Hungarumlautsmall',
    'dollaroldstyle',
    'dollarsuperior',
    'ampersandsmall',
    'Acutesmall',
    'parenleftsuperior',
    'parenrightsuperior',
    '266 ff',
    'onedotenleader',
    'zerooldstyle',
    'oneoldstyle',
    'twooldstyle',
    'threeoldstyle',
    'fouroldstyle',
    'fiveoldstyle',
    'sixoldstyle',
    'sevenoldstyle',
    'eightoldstyle',
    'nineoldstyle',
    'commasuperior',
    'threequartersemdash',
    'periodsuperior',
    'questionsmall',
    'asuperior',
    'bsuperior',
    'centsuperior',
    'dsuperior',
    'esuperior',
    'isuperior',
    'lsuperior',
    'msuperior',
    'nsuperior',
    'osuperior',
    'rsuperior',
    'ssuperior',
    'tsuperior',
    'ff',
    'ffi',
    'ffl',
    'parenleftinferior',
    'parenrightinferior',
    'Circumflexsmall',
    'hyphensuperior',
    'Gravesmall',
    'Asmall',
    'Bsmall',
    'Csmall',
    'Dsmall',
    'Esmall',
    'Fsmall',
    'Gsmall',
    'Hsmall',
    'Ismall',
    'Jsmall',
    'Ksmall',
    'Lsmall',
    'Msmall',
    'Nsmall',
    'Osmall',
    'Psmall',
    'Qsmall',
    'Rsmall',
    'Ssmall',
    'Tsmall',
    'Usmall',
    'Vsmall',
    'Wsmall',
    'Xsmall',
    'Ysmall',
    'Zsmall',
    'colonmonetary',
    'onefitted',
    'rupiah',
    'Tildesmall',
    'exclamdownsmall',
    'centoldstyle',
    'Lslashsmall',
    'Scaronsmall',
    'Zcaronsmall',
    'Dieresissmall',
    'Brevesmall',
    'Caronsmall',
    'Dotaccentsmall',
    'Macronsmall',
    'figuredash',
    'hypheninferior',
    'Ogoneksmall',
    'Ringsmall',
    'Cedillasmall',
    'questiondownsmall',
    'oneeighth',
    'threeeighths',
    'fiveeighths',
    'seveneighths',
    'onethird',
    'twothirds',
    'zerosuperior',
    'foursuperior',
    'fivesuperior',
    'sixsuperior',
    'sevensuperior',
    'eightsuperior',
    'ninesuperior',
    'zeroinferior',
    'oneinferior',
    'twoinferior',
    'threeinferior',
    'fourinferior',
    'fiveinferior',
    'sixinferior',
    'seveninferior',
    'eightinferior',
    'nineinferior',
    'centinferior',
    'dollarinferior',
    'periodinferior',
    'commainferior',
    'Agravesmall',
    'Aacutesmall',
    'Acircumflexsmall',
    'Atildesmall',
    'Adieresissmall',
    'Aringsmall',
    'AEsmall',
    'Ccedillasmall',
    'Egravesmall',
    'Eacutesmall',
    'Ecircumflexsmall',
    'Edieresissmall',
    'Igravesmall',
    'Iacutesmall',
    'Icircumflexsmall',
    'Idieresissmall',
    'Ethsmall',
    'Ntildesmall',
    'Ogravesmall',
    'Oacutesmall',
    'Ocircumflexsmall',
    'Otildesmall',
    'Odieresissmall',
    'OEsmall',
    'Oslashsmall',
    'Ugravesmall',
    'Uacutesmall',
    'Ucircumflexsmall',
    'Udieresissmall',
    'Yacutesmall',
    'Thornsmall',
    'Ydieresissmall',
    '001.000',
    '001.001',
    '001.002',
    '001.003',
    'Black',
    'Bold',
    'Book',
    'Light',
    'Medium',
    'Regular',
    'Roman',
    'Semibold' ];

var cffStandardEncoding = [
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    'space',
    'exclam',
    'quotedbl',
    'numbersign',
    'dollar',
    'percent',
    'ampersand',
    'quoteright',
    'parenleft',
    'parenright',
    'asterisk',
    'plus',
    'comma',
    'hyphen',
    'period',
    'slash',
    'zero',
    'one',
    'two',
    'three',
    'four',
    'five',
    'six',
    'seven',
    'eight',
    'nine',
    'colon',
    'semicolon',
    'less',
    'equal',
    'greater',
    'question',
    'at',
    'A',
    'B',
    'C',
    'D',
    'E',
    'F',
    'G',
    'H',
    'I',
    'J',
    'K',
    'L',
    'M',
    'N',
    'O',
    'P',
    'Q',
    'R',
    'S',
    'T',
    'U',
    'V',
    'W',
    'X',
    'Y',
    'Z',
    'bracketleft',
    'backslash',
    'bracketright',
    'asciicircum',
    'underscore',
    'quoteleft',
    'a',
    'b',
    'c',
    'd',
    'e',
    'f',
    'g',
    'h',
    'i',
    'j',
    'k',
    'l',
    'm',
    'n',
    'o',
    'p',
    'q',
    'r',
    's',
    't',
    'u',
    'v',
    'w',
    'x',
    'y',
    'z',
    'braceleft',
    'bar',
    'braceright',
    'asciitilde',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    'exclamdown',
    'cent',
    'sterling',
    'fraction',
    'yen',
    'florin',
    'section',
    'currency',
    'quotesingle',
    'quotedblleft',
    'guillemotleft',
    'guilsinglleft',
    'guilsinglright',
    'fi',
    'fl',
    '',
    'endash',
    'dagger',
    'daggerdbl',
    'periodcentered',
    '',
    'paragraph',
    'bullet',
    'quotesinglbase',
    'quotedblbase',
    'quotedblright',
    'guillemotright',
    'ellipsis',
    'perthousand',
    '',
    'questiondown',
    '',
    'grave',
    'acute',
    'circumflex',
    'tilde',
    'macron',
    'breve',
    'dotaccent',
    'dieresis',
    '',
    'ring',
    'cedilla',
    '',
    'hungarumlaut',
    'ogonek',
    'caron',
    'emdash',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    'AE',
    '',
    'ordfeminine',
    '',
    '',
    '',
    '',
    'Lslash',
    'Oslash',
    'OE',
    'ordmasculine',
    '',
    '',
    '',
    '',
    '',
    'ae',
    '',
    '',
    '',
    'dotlessi',
    '',
    '',
    'lslash',
    'oslash',
    'oe',
    'germandbls' ];

var cffExpertEncoding = [
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    'space',
    'exclamsmall',
    'Hungarumlautsmall',
    '',
    'dollaroldstyle',
    'dollarsuperior',
    'ampersandsmall',
    'Acutesmall',
    'parenleftsuperior',
    'parenrightsuperior',
    'twodotenleader',
    'onedotenleader',
    'comma',
    'hyphen',
    'period',
    'fraction',
    'zerooldstyle',
    'oneoldstyle',
    'twooldstyle',
    'threeoldstyle',
    'fouroldstyle',
    'fiveoldstyle',
    'sixoldstyle',
    'sevenoldstyle',
    'eightoldstyle',
    'nineoldstyle',
    'colon',
    'semicolon',
    'commasuperior',
    'threequartersemdash',
    'periodsuperior',
    'questionsmall',
    '',
    'asuperior',
    'bsuperior',
    'centsuperior',
    'dsuperior',
    'esuperior',
    '',
    '',
    'isuperior',
    '',
    '',
    'lsuperior',
    'msuperior',
    'nsuperior',
    'osuperior',
    '',
    '',
    'rsuperior',
    'ssuperior',
    'tsuperior',
    '',
    'ff',
    'fi',
    'fl',
    'ffi',
    'ffl',
    'parenleftinferior',
    '',
    'parenrightinferior',
    'Circumflexsmall',
    'hyphensuperior',
    'Gravesmall',
    'Asmall',
    'Bsmall',
    'Csmall',
    'Dsmall',
    'Esmall',
    'Fsmall',
    'Gsmall',
    'Hsmall',
    'Ismall',
    'Jsmall',
    'Ksmall',
    'Lsmall',
    'Msmall',
    'Nsmall',
    'Osmall',
    'Psmall',
    'Qsmall',
    'Rsmall',
    'Ssmall',
    'Tsmall',
    'Usmall',
    'Vsmall',
    'Wsmall',
    'Xsmall',
    'Ysmall',
    'Zsmall',
    'colonmonetary',
    'onefitted',
    'rupiah',
    'Tildesmall',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    'exclamdownsmall',
    'centoldstyle',
    'Lslashsmall',
    '',
    '',
    'Scaronsmall',
    'Zcaronsmall',
    'Dieresissmall',
    'Brevesmall',
    'Caronsmall',
    '',
    'Dotaccentsmall',
    '',
    '',
    'Macronsmall',
    '',
    '',
    'figuredash',
    'hypheninferior',
    '',
    '',
    'Ogoneksmall',
    'Ringsmall',
    'Cedillasmall',
    '',
    '',
    '',
    'onequarter',
    'onehalf',
    'threequarters',
    'questiondownsmall',
    'oneeighth',
    'threeeighths',
    'fiveeighths',
    'seveneighths',
    'onethird',
    'twothirds',
    '',
    '',
    'zerosuperior',
    'onesuperior',
    'twosuperior',
    'threesuperior',
    'foursuperior',
    'fivesuperior',
    'sixsuperior',
    'sevensuperior',
    'eightsuperior',
    'ninesuperior',
    'zeroinferior',
    'oneinferior',
    'twoinferior',
    'threeinferior',
    'fourinferior',
    'fiveinferior',
    'sixinferior',
    'seveninferior',
    'eightinferior',
    'nineinferior',
    'centinferior',
    'dollarinferior',
    'periodinferior',
    'commainferior',
    'Agravesmall',
    'Aacutesmall',
    'Acircumflexsmall',
    'Atildesmall',
    'Adieresissmall',
    'Aringsmall',
    'AEsmall',
    'Ccedillasmall',
    'Egravesmall',
    'Eacutesmall',
    'Ecircumflexsmall',
    'Edieresissmall',
    'Igravesmall',
    'Iacutesmall',
    'Icircumflexsmall',
    'Idieresissmall',
    'Ethsmall',
    'Ntildesmall',
    'Ogravesmall',
    'Oacutesmall',
    'Ocircumflexsmall',
    'Otildesmall',
    'Odieresissmall',
    'OEsmall',
    'Oslashsmall',
    'Ugravesmall',
    'Uacutesmall',
    'Ucircumflexsmall',
    'Udieresissmall',
    'Yacutesmall',
    'Thornsmall',
    'Ydieresissmall' ];

/**
 * This is the encoding used for fonts created from scratch.
 * It loops through all glyphs and finds the appropriate unicode value.
 * Since it's linear time, other encodings will be faster.
 * @exports opentype.DefaultEncoding
 * @class
 * @constructor
 * @param {opentype.Font}
 */
function DefaultEncoding(font) {
    this.font = font;
}

DefaultEncoding.prototype.charToGlyphIndex = function (c) {
    var code = c.codePointAt(0);
    var glyphs = this.font.glyphs;
    if (glyphs) {
        for (var i = 0; i < glyphs.length; i += 1) {
            var glyph = glyphs.get(i);
            for (var j = 0; j < glyph.unicodes.length; j += 1) {
                if (glyph.unicodes[j] === code) {
                    return i;
                }
            }
        }
    }
    return null;
};

/**
 * @exports opentype.CmapEncoding
 * @class
 * @constructor
 * @param {Object} cmap - a object with the cmap encoded data
 */
function CmapEncoding(cmap) {
    this.cmap = cmap;
}

/**
 * @param  {string} c - the character
 * @return {number} The glyph index.
 */
CmapEncoding.prototype.charToGlyphIndex = function (c) {
    return this.cmap.glyphIndexMap[c.codePointAt(0)] || 0;
};

/**
 * @exports opentype.CffEncoding
 * @class
 * @constructor
 * @param {string} encoding - The encoding
 * @param {Array} charset - The character set.
 */
function CffEncoding(encoding, charset) {
    this.encoding = encoding;
    this.charset = charset;
}

/**
 * @param  {string} s - The character
 * @return {number} The index.
 */
CffEncoding.prototype.charToGlyphIndex = function (s) {
    var code = s.codePointAt(0);
    var charName = this.encoding[code];
    return this.charset.indexOf(charName);
};

function addGlyphNamesAll(font) {
    var glyph;
    var glyphIndexMap = font.tables.cmap.glyphIndexMap;
    var charCodes = Object.keys(glyphIndexMap);

    for (var i = 0; i < charCodes.length; i += 1) {
        var c = charCodes[i];
        var glyphIndex = glyphIndexMap[c];
        glyph = font.glyphs.get(glyphIndex);
        glyph.addUnicode(parseInt(c));
    }
}

function addGlyphNamesToUnicodeMap(font) {
    font._IndexToUnicodeMap = {};

    var glyphIndexMap = font.tables.cmap.glyphIndexMap;
    var charCodes = Object.keys(glyphIndexMap);

    for (var i = 0; i < charCodes.length; i += 1) {
        var c = charCodes[i];
        var glyphIndex = glyphIndexMap[c];
        if (font._IndexToUnicodeMap[glyphIndex] === undefined) {
            font._IndexToUnicodeMap[glyphIndex] = {
                unicodes: [parseInt(c)],
            };
        } else {
            font._IndexToUnicodeMap[glyphIndex].unicodes.push(parseInt(c));
        }
    }
}

/**
 * @alias opentype.addGlyphNames
 * @param {opentype.Font}
 * @param {Object}
 */
function addGlyphNames(font, opt) {
    if (opt.lowMemory) {
        addGlyphNamesToUnicodeMap(font);
    } else {
        addGlyphNamesAll(font);
    }
}

// Run-time checking of preconditions.

function fail(message) {
    throw new Error(message);
}

// Precondition function that checks if the given predicate is true.
// If not, it will throw an error.
function argument(predicate, message) {
    if (!predicate) {
        fail(message);
    }
}
var check = { fail: fail, argument: argument, assert: argument };

// The Glyph object
// import glyf from './tables/glyf' Can't be imported here, because it's a circular dependency

function getPathDefinition(glyph, path) {
    var _path = path || new Path();
    return {
        configurable: true,

        get: function () {
            if (typeof _path === 'function') {
                _path = _path();
            }

            return _path;
        },

        set: function (p) {
            _path = p;
        },
    };
}
/**
 * @typedef GlyphOptions
 * @type Object
 * @property {string} [name] - The glyph name
 * @property {number} [unicode]
 * @property {Array} [unicodes]
 * @property {number} [xMin]
 * @property {number} [yMin]
 * @property {number} [xMax]
 * @property {number} [yMax]
 * @property {number} [advanceWidth]
 */

// A Glyph is an individual mark that often corresponds to a character.
// Some glyphs, such as ligatures, are a combination of many characters.
// Glyphs are the basic building blocks of a font.
//
// The `Glyph` class contains utility methods for drawing the path and its points.
/**
 * @exports opentype.Glyph
 * @class
 * @param {GlyphOptions}
 * @constructor
 */
function Glyph(options) {
    // By putting all the code on a prototype function (which is only declared once)
    // we reduce the memory requirements for larger fonts by some 2%
    this.bindConstructorValues(options);
}

/**
 * @param  {GlyphOptions}
 */
Glyph.prototype.bindConstructorValues = function (options) {
    this.index = options.index || 0;

    // These three values cannot be deferred for memory optimization:
    this.name = options.name || null;
    this.unicode = options.unicode || undefined;
    this.unicodes =
        options.unicodes || options.unicode !== undefined
            ? [options.unicode]
            : [];

    // But by binding these values only when necessary, we reduce can
    // the memory requirements by almost 3% for larger fonts.
    if ('xMin' in options) {
        this.xMin = options.xMin;
    }

    if ('yMin' in options) {
        this.yMin = options.yMin;
    }

    if ('xMax' in options) {
        this.xMax = options.xMax;
    }

    if ('yMax' in options) {
        this.yMax = options.yMax;
    }

    if ('advanceWidth' in options) {
        this.advanceWidth = options.advanceWidth;
    }

    // The path for a glyph is the most memory intensive, and is bound as a value
    // with a getter/setter to ensure we actually do path parsing only once the
    // path is actually needed by anything.
    Object.defineProperty(this, 'path', getPathDefinition(this, options.path));
};

/**
 * @param {number}
 */
Glyph.prototype.addUnicode = function (unicode) {
    if (this.unicodes.length === 0) {
        this.unicode = unicode;
    }

    this.unicodes.push(unicode);
};

// /**
//  * Calculate the minimum bounding box for this glyph.
//  * @return {opentype.BoundingBox}
//  */
// Glyph.prototype.getBoundingBox = function() {
//     return this.path.getBoundingBox();
// };

/**
 * Convert the glyph to a Path we can draw on a drawing context.
 * @param  {number} [x=0] - Horizontal position of the beginning of the text.
 * @param  {number} [y=0] - Vertical position of the *baseline* of the text.
 * @param  {number} [fontSize=72] - Font size in pixels. We scale the glyph units by `1 / unitsPerEm * fontSize`.
 * @param  {Object=} options - xScale, yScale to stretch the glyph.
 * @param  {opentype.Font} if hinting is to be used, the font
 * @return {opentype.Path}
 */
Glyph.prototype.getPath = function (x, y, fontSize, options, font) {
    x = x !== undefined ? x : 0;
    y = y !== undefined ? y : 0;
    fontSize = fontSize !== undefined ? fontSize : 72;
    var commands;
    var hPoints;
    if (!options) { options = {}; }
    var xScale = options.xScale;
    var yScale = options.yScale;

    if (options.hinting && font && font.hinting) {
        // in case of hinting, the hinting engine takes care
        // of scaling the points (not the path) before hinting.
        hPoints = this.path && font.hinting.exec(this, fontSize);
        // in case the hinting engine failed hPoints is undefined
        // and thus reverts to plain rending
    }

    if (hPoints) {
        // Call font.hinting.getCommands instead of `glyf.getPath(hPoints).commands` to avoid a circular dependency
        commands = font.hinting.getCommands(hPoints);
        x = Math.round(x);
        y = Math.round(y);
        // TODO in case of hinting xyScaling is not yet supported
        xScale = yScale = 1;
    } else {
        commands = this.path.commands;
        var scale = (1 / (this.path.unitsPerEm || 1000)) * fontSize;
        if (xScale === undefined) { xScale = scale; }
        if (yScale === undefined) { yScale = scale; }
    }

    var p = new Path();
    for (var i = 0; i < commands.length; i += 1) {
        var cmd = commands[i];
        if (cmd.type === 'M') {
            p.moveTo(x + cmd.x * xScale, y + -cmd.y * yScale);
        } else if (cmd.type === 'L') {
            p.lineTo(x + cmd.x * xScale, y + -cmd.y * yScale);
        } else if (cmd.type === 'Q') {
            p.quadraticCurveTo(
                x + cmd.x1 * xScale,
                y + -cmd.y1 * yScale,
                x + cmd.x * xScale,
                y + -cmd.y * yScale
            );
        } else if (cmd.type === 'C') {
            p.curveTo(
                x + cmd.x1 * xScale,
                y + -cmd.y1 * yScale,
                x + cmd.x2 * xScale,
                y + -cmd.y2 * yScale,
                x + cmd.x * xScale,
                y + -cmd.y * yScale
            );
        } else if (cmd.type === 'Z') {
            p.closePath();
        }
    }

    return p;
};

/**
 * Split the glyph into contours.
 * This function is here for backwards compatibility, and to
 * provide raw access to the TrueType glyph outlines.
 * @return {Array}
 */
Glyph.prototype.getContours = function () {
    if (this.points === undefined) {
        return [];
    }

    var contours = [];
    var currentContour = [];
    for (var i = 0; i < this.points.length; i += 1) {
        var pt = this.points[i];
        currentContour.push(pt);
        if (pt.lastPointOfContour) {
            contours.push(currentContour);
            currentContour = [];
        }
    }

    check.argument(
        currentContour.length === 0,
        'There are still points left in the current contour.'
    );
    return contours;
};

/**
 * Calculate the xMin/yMin/xMax/yMax/lsb/rsb for a Glyph.
 * @return {Object}
 */
Glyph.prototype.getMetrics = function () {
    var commands = this.path.commands;
    var xCoords = [];
    var yCoords = [];
    for (var i = 0; i < commands.length; i += 1) {
        var cmd = commands[i];
        if (cmd.type !== 'Z') {
            xCoords.push(cmd.x);
            yCoords.push(cmd.y);
        }

        if (cmd.type === 'Q' || cmd.type === 'C') {
            xCoords.push(cmd.x1);
            yCoords.push(cmd.y1);
        }

        if (cmd.type === 'C') {
            xCoords.push(cmd.x2);
            yCoords.push(cmd.y2);
        }
    }

    var metrics = {
        xMin: Math.min.apply(null, xCoords),
        yMin: Math.min.apply(null, yCoords),
        xMax: Math.max.apply(null, xCoords),
        yMax: Math.max.apply(null, yCoords),
        leftSideBearing: this.leftSideBearing,
    };

    if (!isFinite(metrics.xMin)) {
        metrics.xMin = 0;
    }

    if (!isFinite(metrics.xMax)) {
        metrics.xMax = this.advanceWidth;
    }

    if (!isFinite(metrics.yMin)) {
        metrics.yMin = 0;
    }

    if (!isFinite(metrics.yMax)) {
        metrics.yMax = 0;
    }

    metrics.rightSideBearing =
        this.advanceWidth -
        metrics.leftSideBearing -
        (metrics.xMax - metrics.xMin);
    return metrics;
};

// The GlyphSet object

// Define a property on the glyph that depends on the path being loaded.
function defineDependentProperty(glyph, externalName, internalName) {
    Object.defineProperty(glyph, externalName, {
        get: function () {
            // Request the path property to make sure the path is loaded.
            glyph.path; // jshint ignore:line
            return glyph[internalName];
        },
        set: function (newValue) {
            glyph[internalName] = newValue;
        },
        enumerable: true,
        configurable: true,
    });
}

/**
 * A GlyphSet represents all glyphs available in the font, but modelled using
 * a deferred glyph loader, for retrieving glyphs only once they are absolutely
 * necessary, to keep the memory footprint down.
 * @exports opentype.GlyphSet
 * @class
 * @param {opentype.Font}
 * @param {Array}
 */
function GlyphSet(font, glyphs) {
    this.font = font;
    this.glyphs = {};
    if (Array.isArray(glyphs)) {
        for (var i = 0; i < glyphs.length; i++) {
            var glyph = glyphs[i];
            glyph.path.unitsPerEm = font.unitsPerEm;
            this.glyphs[i] = glyph;
        }
    }

    this.length = (glyphs && glyphs.length) || 0;
}

/**
 * @param  {number} index
 * @return {opentype.Glyph}
 */
GlyphSet.prototype.get = function (index) {
    // this.glyphs[index] is 'undefined' when low memory mode is on. glyph is pushed on request only.
    if (this.glyphs[index] === undefined) {
        this.font._push(index);
        if (typeof this.glyphs[index] === 'function') {
            this.glyphs[index] = this.glyphs[index]();
        }

        var glyph = this.glyphs[index];
        var unicodeObj = this.font._IndexToUnicodeMap[index];

        if (unicodeObj) {
            for (var j = 0; j < unicodeObj.unicodes.length; j++)
                { glyph.addUnicode(unicodeObj.unicodes[j]); }
        }

        this.glyphs[index].advanceWidth =
            this.font._hmtxTableData[index].advanceWidth;
        this.glyphs[index].leftSideBearing =
            this.font._hmtxTableData[index].leftSideBearing;
    } else {
        if (typeof this.glyphs[index] === 'function') {
            this.glyphs[index] = this.glyphs[index]();
        }
    }

    return this.glyphs[index];
};

/**
 * @param  {number} index
 * @param  {Object}
 */
GlyphSet.prototype.push = function (index, loader) {
    this.glyphs[index] = loader;
    this.length++;
};

/**
 * @alias opentype.glyphLoader
 * @param  {opentype.Font} font
 * @param  {number} index
 * @return {opentype.Glyph}
 */
function glyphLoader(font, index) {
    return new Glyph({ index: index, font: font });
}

/**
 * Generate a stub glyph that can be filled with all metadata *except*
 * the "points" and "path" properties, which must be loaded only once
 * the glyph's path is actually requested for text shaping.
 * @alias opentype.ttfGlyphLoader
 * @param  {opentype.Font} font
 * @param  {number} index
 * @param  {Function} parseGlyph
 * @param  {Object} data
 * @param  {number} position
 * @param  {Function} buildPath
 * @return {opentype.Glyph}
 */
function ttfGlyphLoader(font, index, parseGlyph, data, position, buildPath) {
    return function () {
        var glyph = new Glyph({ index: index, font: font });

        glyph.path = function () {
            parseGlyph(glyph, data, position);
            var path = buildPath(font.glyphs, glyph);
            path.unitsPerEm = font.unitsPerEm;
            return path;
        };

        defineDependentProperty(glyph, 'xMin', '_xMin');
        defineDependentProperty(glyph, 'xMax', '_xMax');
        defineDependentProperty(glyph, 'yMin', '_yMin');
        defineDependentProperty(glyph, 'yMax', '_yMax');

        return glyph;
    };
}
/**
 * @alias opentype.cffGlyphLoader
 * @param  {opentype.Font} font
 * @param  {number} index
 * @param  {Function} parseCFFCharstring
 * @param  {string} charstring
 * @return {opentype.Glyph}
 */
function cffGlyphLoader(font, index, parseCFFCharstring, charstring) {
    return function () {
        var glyph = new Glyph({ index: index, font: font });

        glyph.path = function () {
            var path = parseCFFCharstring(font, glyph, charstring);
            path.unitsPerEm = font.unitsPerEm;
            return path;
        };

        return glyph;
    };
}

var glyphset = { GlyphSet: GlyphSet, glyphLoader: glyphLoader, ttfGlyphLoader: ttfGlyphLoader, cffGlyphLoader: cffGlyphLoader };

// The Layout object is the prototype of Substitution objects, and provides

function searchTag(arr, tag) {
    /* jshint bitwise: false */
    var imin = 0;
    var imax = arr.length - 1;
    while (imin <= imax) {
        var imid = (imin + imax) >>> 1;
        var val = arr[imid].tag;
        if (val === tag) {
            return imid;
        } else if (val < tag) {
            imin = imid + 1;
        } else {
            imax = imid - 1;
        }
    }
    // Not found: return -1-insertion point
    return -imin - 1;
}

function binSearch(arr, value) {
    /* jshint bitwise: false */
    var imin = 0;
    var imax = arr.length - 1;
    while (imin <= imax) {
        var imid = (imin + imax) >>> 1;
        var val = arr[imid];
        if (val === value) {
            return imid;
        } else if (val < value) {
            imin = imid + 1;
        } else {
            imax = imid - 1;
        }
    }
    // Not found: return -1-insertion point
    return -imin - 1;
}

// binary search in a list of ranges (coverage, class definition)
function searchRange(ranges, value) {
    // jshint bitwise: false
    var range;
    var imin = 0;
    var imax = ranges.length - 1;
    while (imin <= imax) {
        var imid = (imin + imax) >>> 1;
        range = ranges[imid];
        var start = range.start;
        if (start === value) {
            return range;
        } else if (start < value) {
            imin = imid + 1;
        } else {
            imax = imid - 1;
        }
    }
    if (imin > 0) {
        range = ranges[imin - 1];
        if (value > range.end) { return 0; }
        return range;
    }
}

/**
 * @exports opentype.Layout
 * @class
 */
function Layout(font, tableName) {
    this.font = font;
    this.tableName = tableName;
}

Layout.prototype = {
    /**
     * Binary search an object by "tag" property
     * @instance
     * @function searchTag
     * @memberof opentype.Layout
     * @param  {Array} arr
     * @param  {string} tag
     * @return {number}
     */
    searchTag: searchTag,

    /**
     * Binary search in a list of numbers
     * @instance
     * @function binSearch
     * @memberof opentype.Layout
     * @param  {Array} arr
     * @param  {number} value
     * @return {number}
     */
    binSearch: binSearch,

    /**
     * Get or create the Layout table (GSUB, GPOS etc).
     * @param  {boolean} create - Whether to create a new one.
     * @return {Object} The GSUB or GPOS table.
     */
    getTable: function (create) {
        var layout = this.font.tables[this.tableName];
        if (!layout && create) {
            layout = this.font.tables[this.tableName] =
                this.createDefaultTable();
        }
        return layout;
    },

    /**
     * Returns the best bet for a script name.
     * Returns 'DFLT' if it exists.
     * If not, returns 'latn' if it exists.
     * If neither exist, returns undefined.
     */
    getDefaultScriptName: function () {
        var layout = this.getTable();
        if (!layout) {
            return;
        }
        var hasLatn = false;
        for (var i = 0; i < layout.scripts.length; i++) {
            var name = layout.scripts[i].tag;
            if (name === 'DFLT') { return name; }
            if (name === 'latn') { hasLatn = true; }
        }
        if (hasLatn) { return 'latn'; }
    },

    /**
     * Returns all LangSysRecords in the given script.
     * @instance
     * @param {string} [script='DFLT']
     * @param {boolean} create - forces the creation of this script table if it doesn't exist.
     * @return {Object} An object with tag and script properties.
     */
    getScriptTable: function (script, create) {
        var layout = this.getTable(create);
        if (layout) {
            script = script || 'DFLT';
            var scripts = layout.scripts;
            var pos = searchTag(layout.scripts, script);
            if (pos >= 0) {
                return scripts[pos].script;
            } else if (create) {
                var scr = {
                    tag: script,
                    script: {
                        defaultLangSys: {
                            reserved: 0,
                            reqFeatureIndex: 0xffff,
                            featureIndexes: [],
                        },
                        langSysRecords: [],
                    },
                };
                scripts.splice(-1 - pos, 0, scr);
                return scr.script;
            }
        }
    },

    /**
     * Returns a language system table
     * @instance
     * @param {string} [script='DFLT']
     * @param {string} [language='dlft']
     * @param {boolean} create - forces the creation of this langSysTable if it doesn't exist.
     * @return {Object}
     */
    getLangSysTable: function (script, language, create) {
        var scriptTable = this.getScriptTable(script, create);
        if (scriptTable) {
            if (!language || language === 'dflt' || language === 'DFLT') {
                return scriptTable.defaultLangSys;
            }
            var pos = searchTag(scriptTable.langSysRecords, language);
            if (pos >= 0) {
                return scriptTable.langSysRecords[pos].langSys;
            } else if (create) {
                var langSysRecord = {
                    tag: language,
                    langSys: {
                        reserved: 0,
                        reqFeatureIndex: 0xffff,
                        featureIndexes: [],
                    },
                };
                scriptTable.langSysRecords.splice(-1 - pos, 0, langSysRecord);
                return langSysRecord.langSys;
            }
        }
    },

    /**
     * Get a specific feature table.
     * @instance
     * @param {string} [script='DFLT']
     * @param {string} [language='dlft']
     * @param {string} feature - One of the codes listed at https://www.microsoft.com/typography/OTSPEC/featurelist.htm
     * @param {boolean} create - forces the creation of the feature table if it doesn't exist.
     * @return {Object}
     */
    getFeatureTable: function (script, language, feature, create) {
        var langSysTable = this.getLangSysTable(script, language, create);
        if (langSysTable) {
            var featureRecord;
            var featIndexes = langSysTable.featureIndexes;
            var allFeatures = this.font.tables[this.tableName].features;
            // The FeatureIndex array of indices is in arbitrary order,
            // even if allFeatures is sorted alphabetically by feature tag.
            for (var i = 0; i < featIndexes.length; i++) {
                featureRecord = allFeatures[featIndexes[i]];
                if (featureRecord.tag === feature) {
                    return featureRecord.feature;
                }
            }
            if (create) {
                var index = allFeatures.length;
                // Automatic ordering of features would require to shift feature indexes in the script list.
                check.assert(
                    index === 0 || feature >= allFeatures[index - 1].tag,
                    'Features must be added in alphabetical order.'
                );
                featureRecord = {
                    tag: feature,
                    feature: { params: 0, lookupListIndexes: [] },
                };
                allFeatures.push(featureRecord);
                featIndexes.push(index);
                return featureRecord.feature;
            }
        }
    },

    /**
     * Get the lookup tables of a given type for a script/language/feature.
     * @instance
     * @param {string} [script='DFLT']
     * @param {string} [language='dlft']
     * @param {string} feature - 4-letter feature code
     * @param {number} lookupType - 1 to 9
     * @param {boolean} create - forces the creation of the lookup table if it doesn't exist, with no subtables.
     * @return {Object[]}
     */
    getLookupTables: function (script, language, feature, lookupType, create) {
        var featureTable = this.getFeatureTable(
            script,
            language,
            feature,
            create
        );
        var tables = [];
        if (featureTable) {
            var lookupTable;
            var lookupListIndexes = featureTable.lookupListIndexes;
            var allLookups = this.font.tables[this.tableName].lookups;
            // lookupListIndexes are in no particular order, so use naive search.
            for (var i = 0; i < lookupListIndexes.length; i++) {
                lookupTable = allLookups[lookupListIndexes[i]];
                if (lookupTable.lookupType === lookupType) {
                    tables.push(lookupTable);
                }
            }
            if (tables.length === 0 && create) {
                lookupTable = {
                    lookupType: lookupType,
                    lookupFlag: 0,
                    subtables: [],
                    markFilteringSet: undefined,
                };
                var index = allLookups.length;
                allLookups.push(lookupTable);
                lookupListIndexes.push(index);
                return [lookupTable];
            }
        }
        return tables;
    },

    /**
     * Find a glyph in a class definition table
     * https://docs.microsoft.com/en-us/typography/opentype/spec/chapter2#class-definition-table
     * @param {object} classDefTable - an OpenType Layout class definition table
     * @param {number} glyphIndex - the index of the glyph to find
     * @returns {number} -1 if not found
     */
    getGlyphClass: function (classDefTable, glyphIndex) {
        switch (classDefTable.format) {
            case 1:
                if (
                    classDefTable.startGlyph <= glyphIndex &&
                    glyphIndex <
                        classDefTable.startGlyph + classDefTable.classes.length
                ) {
                    return classDefTable.classes[
                        glyphIndex - classDefTable.startGlyph
                    ];
                }
                return 0;
            case 2:
                var range = searchRange(classDefTable.ranges, glyphIndex);
                return range ? range.classId : 0;
        }
    },

    /**
     * Find a glyph in a coverage table
     * https://docs.microsoft.com/en-us/typography/opentype/spec/chapter2#coverage-table
     * @param {object} coverageTable - an OpenType Layout coverage table
     * @param {number} glyphIndex - the index of the glyph to find
     * @returns {number} -1 if not found
     */
    getCoverageIndex: function (coverageTable, glyphIndex) {
        switch (coverageTable.format) {
            case 1:
                var index = binSearch(coverageTable.glyphs, glyphIndex);
                return index >= 0 ? index : -1;
            case 2:
                var range = searchRange(coverageTable.ranges, glyphIndex);
                return range ? range.index + glyphIndex - range.start : -1;
        }
    },

    /**
     * Returns the list of glyph indexes of a coverage table.
     * Format 1: the list is stored raw
     * Format 2: compact list as range records.
     * @instance
     * @param  {Object} coverageTable
     * @return {Array}
     */
    expandCoverage: function (coverageTable) {
        if (coverageTable.format === 1) {
            return coverageTable.glyphs;
        } else {
            var glyphs = [];
            var ranges = coverageTable.ranges;
            for (var i = 0; i < ranges.length; i++) {
                var range = ranges[i];
                var start = range.start;
                var end = range.end;
                for (var j = start; j <= end; j++) {
                    glyphs.push(j);
                }
            }
            return glyphs;
        }
    },
};

// The Position object provides utility methods to manipulate

/**
 * @exports opentype.Position
 * @class
 * @extends opentype.Layout
 * @param {opentype.Font}
 * @constructor
 */
function Position(font) {
    Layout.call(this, font, 'gpos');
}

Position.prototype = Layout.prototype;

/**
 * Init some data for faster and easier access later.
 */
Position.prototype.init = function() {
    var script = this.getDefaultScriptName();
    this.defaultKerningTables = this.getKerningTables(script);
};

/**
 * Find a glyph pair in a list of lookup tables of type 2 and retrieve the xAdvance kerning value.
 *
 * @param {integer} leftIndex - left glyph index
 * @param {integer} rightIndex - right glyph index
 * @returns {integer}
 */
Position.prototype.getKerningValue = function(kerningLookups, leftIndex, rightIndex) {
    for (var i = 0; i < kerningLookups.length; i++) {
        var subtables = kerningLookups[i].subtables;
        for (var j = 0; j < subtables.length; j++) {
            var subtable = subtables[j];
            var covIndex = this.getCoverageIndex(subtable.coverage, leftIndex);
            if (covIndex < 0) { continue; }
            switch (subtable.posFormat) {
                case 1:
                    // Search Pair Adjustment Positioning Format 1
                    var pairSet = subtable.pairSets[covIndex];
                    for (var k = 0; k < pairSet.length; k++) {
                        var pair = pairSet[k];
                        if (pair.secondGlyph === rightIndex) {
                            return pair.value1 && pair.value1.xAdvance || 0;
                        }
                    }
                    break;      // left glyph found, not right glyph - try next subtable
                case 2:
                    // Search Pair Adjustment Positioning Format 2
                    var class1 = this.getGlyphClass(subtable.classDef1, leftIndex);
                    var class2 = this.getGlyphClass(subtable.classDef2, rightIndex);
                    var pair$1 = subtable.classRecords[class1][class2];
                    return pair$1.value1 && pair$1.value1.xAdvance || 0;
            }
        }
    }
    return 0;
};

/**
 * List all kerning lookup tables.
 *
 * @param {string} [script='DFLT'] - use font.position.getDefaultScriptName() for a better default value
 * @param {string} [language='dflt']
 * @return {object[]} The list of kerning lookup tables (may be empty), or undefined if there is no GPOS table (and we should use the kern table)
 */
Position.prototype.getKerningTables = function(script, language) {
    if (this.font.tables.gpos) {
        return this.getLookupTables(script, language, 'kern', 2);
    }
};

// The Substitution object provides utility methods to manipulate

/**
 * @exports opentype.Substitution
 * @class
 * @extends opentype.Layout
 * @param {opentype.Font}
 * @constructor
 */
function Substitution(font) {
    Layout.call(this, font, 'gsub');
}

// Check if 2 arrays of primitives are equal.
function arraysEqual(ar1, ar2) {
    var n = ar1.length;
    if (n !== ar2.length) {
        return false;
    }
    for (var i = 0; i < n; i++) {
        if (ar1[i] !== ar2[i]) {
            return false;
        }
    }
    return true;
}

// Find the first subtable of a lookup table in a particular format.
function getSubstFormat(lookupTable, format, defaultSubtable) {
    var subtables = lookupTable.subtables;
    for (var i = 0; i < subtables.length; i++) {
        var subtable = subtables[i];
        if (subtable.substFormat === format) {
            return subtable;
        }
    }
    if (defaultSubtable) {
        subtables.push(defaultSubtable);
        return defaultSubtable;
    }
    return undefined;
}

Substitution.prototype = Layout.prototype;

/**
 * Create a default GSUB table.
 * @return {Object} gsub - The GSUB table.
 */
Substitution.prototype.createDefaultTable = function () {
    // Generate a default empty GSUB table with just a DFLT script and dflt lang sys.
    return {
        version: 1,
        scripts: [
            {
                tag: 'DFLT',
                script: {
                    defaultLangSys: {
                        reserved: 0,
                        reqFeatureIndex: 0xffff,
                        featureIndexes: [],
                    },
                    langSysRecords: [],
                },
            } ],
        features: [],
        lookups: [],
    };
};

/**
 * List all single substitutions (lookup type 1) for a given script, language, and feature.
 * @param {string} [script='DFLT']
 * @param {string} [language='dflt']
 * @param {string} feature - 4-character feature name ('aalt', 'salt', 'ss01'...)
 * @return {Array} substitutions - The list of substitutions.
 */
Substitution.prototype.getSingle = function (feature, script, language) {
    var substitutions = [];
    var lookupTables = this.getLookupTables(script, language, feature, 1);
    for (var idx = 0; idx < lookupTables.length; idx++) {
        var subtables = lookupTables[idx].subtables;
        for (var i = 0; i < subtables.length; i++) {
            var subtable = subtables[i];
            var glyphs = this.expandCoverage(subtable.coverage);
            var j = (void 0);
            if (subtable.substFormat === 1) {
                var delta = subtable.deltaGlyphId;
                for (j = 0; j < glyphs.length; j++) {
                    var glyph = glyphs[j];
                    substitutions.push({ sub: glyph, by: glyph + delta });
                }
            } else {
                var substitute = subtable.substitute;
                for (j = 0; j < glyphs.length; j++) {
                    substitutions.push({ sub: glyphs[j], by: substitute[j] });
                }
            }
        }
    }
    return substitutions;
};

/**
 * List all multiple substitutions (lookup type 2) for a given script, language, and feature.
 * @param {string} [script='DFLT']
 * @param {string} [language='dflt']
 * @param {string} feature - 4-character feature name ('ccmp', 'stch')
 * @return {Array} substitutions - The list of substitutions.
 */
Substitution.prototype.getMultiple = function (feature, script, language) {
    var substitutions = [];
    var lookupTables = this.getLookupTables(script, language, feature, 2);
    for (var idx = 0; idx < lookupTables.length; idx++) {
        var subtables = lookupTables[idx].subtables;
        for (var i = 0; i < subtables.length; i++) {
            var subtable = subtables[i];
            var glyphs = this.expandCoverage(subtable.coverage);
            var j = (void 0);

            for (j = 0; j < glyphs.length; j++) {
                var glyph = glyphs[j];
                var replacements = subtable.sequences[j];
                substitutions.push({ sub: glyph, by: replacements });
            }
        }
    }
    return substitutions;
};

/**
 * List all alternates (lookup type 3) for a given script, language, and feature.
 * @param {string} [script='DFLT']
 * @param {string} [language='dflt']
 * @param {string} feature - 4-character feature name ('aalt', 'salt'...)
 * @return {Array} alternates - The list of alternates
 */
Substitution.prototype.getAlternates = function (feature, script, language) {
    var alternates = [];
    var lookupTables = this.getLookupTables(script, language, feature, 3);
    for (var idx = 0; idx < lookupTables.length; idx++) {
        var subtables = lookupTables[idx].subtables;
        for (var i = 0; i < subtables.length; i++) {
            var subtable = subtables[i];
            var glyphs = this.expandCoverage(subtable.coverage);
            var alternateSets = subtable.alternateSets;
            for (var j = 0; j < glyphs.length; j++) {
                alternates.push({ sub: glyphs[j], by: alternateSets[j] });
            }
        }
    }
    return alternates;
};

/**
 * List all ligatures (lookup type 4) for a given script, language, and feature.
 * The result is an array of ligature objects like { sub: [ids], by: id }
 * @param {string} feature - 4-letter feature name ('liga', 'rlig', 'dlig'...)
 * @param {string} [script='DFLT']
 * @param {string} [language='dflt']
 * @return {Array} ligatures - The list of ligatures.
 */
Substitution.prototype.getLigatures = function (feature, script, language) {
    var ligatures = [];
    var lookupTables = this.getLookupTables(script, language, feature, 4);
    for (var idx = 0; idx < lookupTables.length; idx++) {
        var subtables = lookupTables[idx].subtables;
        for (var i = 0; i < subtables.length; i++) {
            var subtable = subtables[i];
            var glyphs = this.expandCoverage(subtable.coverage);
            var ligatureSets = subtable.ligatureSets;
            for (var j = 0; j < glyphs.length; j++) {
                var startGlyph = glyphs[j];
                var ligSet = ligatureSets[j];
                for (var k = 0; k < ligSet.length; k++) {
                    var lig = ligSet[k];
                    ligatures.push({
                        sub: [startGlyph].concat(lig.components),
                        by: lig.ligGlyph,
                    });
                }
            }
        }
    }
    return ligatures;
};

/**
 * Add or modify a single substitution (lookup type 1)
 * Format 2, more flexible, is always used.
 * @param {string} feature - 4-letter feature name ('liga', 'rlig', 'dlig'...)
 * @param {Object} substitution - { sub: id, by: id } (format 1 is not supported)
 * @param {string} [script='DFLT']
 * @param {string} [language='dflt']
 */
Substitution.prototype.addSingle = function (
    feature,
    substitution,
    script,
    language
) {
    var lookupTable = this.getLookupTables(
        script,
        language,
        feature,
        1,
        true
    )[0];
    var subtable = getSubstFormat(lookupTable, 2, {
        // lookup type 1 subtable, format 2, coverage format 1
        substFormat: 2,
        coverage: { format: 1, glyphs: [] },
        substitute: [],
    });
    check.assert(
        subtable.coverage.format === 1,
        'Single: unable to modify coverage table format ' +
            subtable.coverage.format
    );
    var coverageGlyph = substitution.sub;
    var pos = this.binSearch(subtable.coverage.glyphs, coverageGlyph);
    if (pos < 0) {
        pos = -1 - pos;
        subtable.coverage.glyphs.splice(pos, 0, coverageGlyph);
        subtable.substitute.splice(pos, 0, 0);
    }
    subtable.substitute[pos] = substitution.by;
};

/**
 * Add or modify a multiple substitution (lookup type 2)
 * @param {string} feature - 4-letter feature name ('ccmp', 'stch')
 * @param {Object} substitution - { sub: id, by: [id] } for format 2.
 * @param {string} [script='DFLT']
 * @param {string} [language='dflt']
 */
Substitution.prototype.addMultiple = function (
    feature,
    substitution,
    script,
    language
) {
    check.assert(
        substitution.by instanceof Array && substitution.by.length > 1,
        'Multiple: "by" must be an array of two or more ids'
    );
    var lookupTable = this.getLookupTables(
        script,
        language,
        feature,
        2,
        true
    )[0];
    var subtable = getSubstFormat(lookupTable, 1, {
        // lookup type 2 subtable, format 1, coverage format 1
        substFormat: 1,
        coverage: { format: 1, glyphs: [] },
        sequences: [],
    });
    check.assert(
        subtable.coverage.format === 1,
        'Multiple: unable to modify coverage table format ' +
            subtable.coverage.format
    );
    var coverageGlyph = substitution.sub;
    var pos = this.binSearch(subtable.coverage.glyphs, coverageGlyph);
    if (pos < 0) {
        pos = -1 - pos;
        subtable.coverage.glyphs.splice(pos, 0, coverageGlyph);
        subtable.sequences.splice(pos, 0, 0);
    }
    subtable.sequences[pos] = substitution.by;
};

/**
 * Add or modify an alternate substitution (lookup type 3)
 * @param {string} feature - 4-letter feature name ('liga', 'rlig', 'dlig'...)
 * @param {Object} substitution - { sub: id, by: [ids] }
 * @param {string} [script='DFLT']
 * @param {string} [language='dflt']
 */
Substitution.prototype.addAlternate = function (
    feature,
    substitution,
    script,
    language
) {
    var lookupTable = this.getLookupTables(
        script,
        language,
        feature,
        3,
        true
    )[0];
    var subtable = getSubstFormat(lookupTable, 1, {
        // lookup type 3 subtable, format 1, coverage format 1
        substFormat: 1,
        coverage: { format: 1, glyphs: [] },
        alternateSets: [],
    });
    check.assert(
        subtable.coverage.format === 1,
        'Alternate: unable to modify coverage table format ' +
            subtable.coverage.format
    );
    var coverageGlyph = substitution.sub;
    var pos = this.binSearch(subtable.coverage.glyphs, coverageGlyph);
    if (pos < 0) {
        pos = -1 - pos;
        subtable.coverage.glyphs.splice(pos, 0, coverageGlyph);
        subtable.alternateSets.splice(pos, 0, 0);
    }
    subtable.alternateSets[pos] = substitution.by;
};

/**
 * Add a ligature (lookup type 4)
 * Ligatures with more components must be stored ahead of those with fewer components in order to be found
 * @param {string} feature - 4-letter feature name ('liga', 'rlig', 'dlig'...)
 * @param {Object} ligature - { sub: [ids], by: id }
 * @param {string} [script='DFLT']
 * @param {string} [language='dflt']
 */
Substitution.prototype.addLigature = function (
    feature,
    ligature,
    script,
    language
) {
    var lookupTable = this.getLookupTables(
        script,
        language,
        feature,
        4,
        true
    )[0];
    var subtable = lookupTable.subtables[0];
    if (!subtable) {
        subtable = {
            // lookup type 4 subtable, format 1, coverage format 1
            substFormat: 1,
            coverage: { format: 1, glyphs: [] },
            ligatureSets: [],
        };
        lookupTable.subtables[0] = subtable;
    }
    check.assert(
        subtable.coverage.format === 1,
        'Ligature: unable to modify coverage table format ' +
            subtable.coverage.format
    );
    var coverageGlyph = ligature.sub[0];
    var ligComponents = ligature.sub.slice(1);
    var ligatureTable = {
        ligGlyph: ligature.by,
        components: ligComponents,
    };
    var pos = this.binSearch(subtable.coverage.glyphs, coverageGlyph);
    if (pos >= 0) {
        // ligatureSet already exists
        var ligatureSet = subtable.ligatureSets[pos];
        for (var i = 0; i < ligatureSet.length; i++) {
            // If ligature already exists, return.
            if (arraysEqual(ligatureSet[i].components, ligComponents)) {
                return;
            }
        }
        // ligature does not exist: add it.
        ligatureSet.push(ligatureTable);
    } else {
        // Create a new ligatureSet and add coverage for the first glyph.
        pos = -1 - pos;
        subtable.coverage.glyphs.splice(pos, 0, coverageGlyph);
        subtable.ligatureSets.splice(pos, 0, [ligatureTable]);
    }
};

/**
 * List all feature data for a given script and language.
 * @param {string} feature - 4-letter feature name
 * @param {string} [script='DFLT']
 * @param {string} [language='dflt']
 * @return {Array} substitutions - The list of substitutions.
 */
Substitution.prototype.getFeature = function (feature, script, language) {
    if (/ss\d\d/.test(feature)) {
        // ss01 - ss20
        return this.getSingle(feature, script, language);
    }
    switch (feature) {
        case 'aalt':
        case 'salt':
            return this.getSingle(feature, script, language).concat(
                this.getAlternates(feature, script, language)
            );
        case 'dlig':
        case 'liga':
        case 'rlig':
            return this.getLigatures(feature, script, language);
        case 'ccmp':
            return this.getMultiple(feature, script, language).concat(
                this.getLigatures(feature, script, language)
            );
        case 'stch':
            return this.getMultiple(feature, script, language);
    }
    return undefined;
};

/**
 * Add a substitution to a feature for a given script and language.
 * @param {string} feature - 4-letter feature name
 * @param {Object} sub - the substitution to add (an object like { sub: id or [ids], by: id or [ids] })
 * @param {string} [script='DFLT']
 * @param {string} [language='dflt']
 */
Substitution.prototype.add = function (feature, sub, script, language) {
    if (/ss\d\d/.test(feature)) {
        // ss01 - ss20
        return this.addSingle(feature, sub, script, language);
    }
    switch (feature) {
        case 'aalt':
        case 'salt':
            if (typeof sub.by === 'number') {
                return this.addSingle(feature, sub, script, language);
            }
            return this.addAlternate(feature, sub, script, language);
        case 'dlig':
        case 'liga':
        case 'rlig':
            return this.addLigature(feature, sub, script, language);
        case 'ccmp':
            if (sub.by instanceof Array) {
                return this.addMultiple(feature, sub, script, language);
            }
            return this.addLigature(feature, sub, script, language);
    }
    return undefined;
};

function checkArgument(expression, message) {
    if (!expression) {
        throw message;
    }
}

// Parsing utility functions

// Retrieve an unsigned byte from the DataView.
function getByte(dataView, offset) {
    return dataView.getUint8(offset);
}

// Retrieve an unsigned 16-bit short from the DataView.
// The value is stored in big endian.
function getUShort(dataView, offset) {
    return dataView.getUint16(offset, false);
}

// Retrieve a signed 16-bit short from the DataView.
// The value is stored in big endian.
function getShort(dataView, offset) {
    return dataView.getInt16(offset, false);
}

// Retrieve an unsigned 32-bit long from the DataView.
// The value is stored in big endian.
function getULong(dataView, offset) {
    return dataView.getUint32(offset, false);
}

// Retrieve a 32-bit signed fixed-point number (16.16) from the DataView.
// The value is stored in big endian.
function getFixed(dataView, offset) {
    var decimal = dataView.getInt16(offset, false);
    var fraction = dataView.getUint16(offset + 2, false);
    return decimal + fraction / 65535;
}

// Retrieve a 4-character tag from the DataView.
// Tags are used to identify tables.
function getTag(dataView, offset) {
    var tag = '';
    for (var i = offset; i < offset + 4; i += 1) {
        tag += String.fromCharCode(dataView.getInt8(i));
    }

    return tag;
}

// Retrieve an offset from the DataView.
// Offsets are 1 to 4 bytes in length, depending on the offSize argument.
function getOffset(dataView, offset, offSize) {
    var v = 0;
    for (var i = 0; i < offSize; i += 1) {
        v <<= 8;
        v += dataView.getUint8(offset + i);
    }

    return v;
}

// Retrieve a number of bytes from start offset to the end offset from the DataView.
function getBytes(dataView, startOffset, endOffset) {
    var bytes = [];
    for (var i = startOffset; i < endOffset; i += 1) {
        bytes.push(dataView.getUint8(i));
    }

    return bytes;
}

// Convert the list of bytes to a string.
function bytesToString(bytes) {
    var s = '';
    for (var i = 0; i < bytes.length; i += 1) {
        s += String.fromCharCode(bytes[i]);
    }

    return s;
}

var typeOffsets = {
    byte: 1,
    uShort: 2,
    short: 2,
    uLong: 4,
    fixed: 4,
    longDateTime: 8,
    tag: 4
};

// A stateful parser that changes the offset whenever a value is retrieved.
// The data is a DataView.
function Parser(data, offset) {
    this.data = data;
    this.offset = offset;
    this.relativeOffset = 0;
}

Parser.prototype.parseByte = function() {
    var v = this.data.getUint8(this.offset + this.relativeOffset);
    this.relativeOffset += 1;
    return v;
};

Parser.prototype.parseChar = function() {
    var v = this.data.getInt8(this.offset + this.relativeOffset);
    this.relativeOffset += 1;
    return v;
};

Parser.prototype.parseCard8 = Parser.prototype.parseByte;

Parser.prototype.parseUShort = function() {
    var v = this.data.getUint16(this.offset + this.relativeOffset);
    this.relativeOffset += 2;
    return v;
};

Parser.prototype.parseCard16 = Parser.prototype.parseUShort;
Parser.prototype.parseSID = Parser.prototype.parseUShort;
Parser.prototype.parseOffset16 = Parser.prototype.parseUShort;

Parser.prototype.parseShort = function() {
    var v = this.data.getInt16(this.offset + this.relativeOffset);
    this.relativeOffset += 2;
    return v;
};

Parser.prototype.parseF2Dot14 = function() {
    var v = this.data.getInt16(this.offset + this.relativeOffset) / 16384;
    this.relativeOffset += 2;
    return v;
};

Parser.prototype.parseULong = function() {
    var v = getULong(this.data, this.offset + this.relativeOffset);
    this.relativeOffset += 4;
    return v;
};

Parser.prototype.parseOffset32 = Parser.prototype.parseULong;

Parser.prototype.parseFixed = function() {
    var v = getFixed(this.data, this.offset + this.relativeOffset);
    this.relativeOffset += 4;
    return v;
};

Parser.prototype.parseString = function(length) {
    var dataView = this.data;
    var offset = this.offset + this.relativeOffset;
    var string = '';
    this.relativeOffset += length;
    for (var i = 0; i < length; i++) {
        string += String.fromCharCode(dataView.getUint8(offset + i));
    }

    return string;
};

Parser.prototype.parseTag = function() {
    return this.parseString(4);
};

// LONGDATETIME is a 64-bit integer.
// JavaScript and unix timestamps traditionally use 32 bits, so we
// only take the last 32 bits.
// + Since until 2038 those bits will be filled by zeros we can ignore them.
Parser.prototype.parseLongDateTime = function() {
    var v = getULong(this.data, this.offset + this.relativeOffset + 4);
    // Subtract seconds between 01/01/1904 and 01/01/1970
    // to convert Apple Mac timestamp to Standard Unix timestamp
    v -= 2082844800;
    this.relativeOffset += 8;
    return v;
};

Parser.prototype.parseVersion = function(minorBase) {
    var major = getUShort(this.data, this.offset + this.relativeOffset);

    // How to interpret the minor version is very vague in the spec. 0x5000 is 5, 0x1000 is 1
    // Default returns the correct number if minor = 0xN000 where N is 0-9
    // Set minorBase to 1 for tables that use minor = N where N is 0-9
    var minor = getUShort(this.data, this.offset + this.relativeOffset + 2);
    this.relativeOffset += 4;
    if (minorBase === undefined) { minorBase = 0x1000; }
    return major + minor / minorBase / 10;
};

Parser.prototype.skip = function(type, amount) {
    if (amount === undefined) {
        amount = 1;
    }

    this.relativeOffset += typeOffsets[type] * amount;
};

///// Parsing lists and records ///////////////////////////////

// Parse a list of 32 bit unsigned integers.
Parser.prototype.parseULongList = function(count) {
    if (count === undefined) { count = this.parseULong(); }
    var offsets = new Array(count);
    var dataView = this.data;
    var offset = this.offset + this.relativeOffset;
    for (var i = 0; i < count; i++) {
        offsets[i] = dataView.getUint32(offset);
        offset += 4;
    }

    this.relativeOffset += count * 4;
    return offsets;
};

// Parse a list of 16 bit unsigned integers. The length of the list can be read on the stream
// or provided as an argument.
Parser.prototype.parseOffset16List =
Parser.prototype.parseUShortList = function(count) {
    if (count === undefined) { count = this.parseUShort(); }
    var offsets = new Array(count);
    var dataView = this.data;
    var offset = this.offset + this.relativeOffset;
    for (var i = 0; i < count; i++) {
        offsets[i] = dataView.getUint16(offset);
        offset += 2;
    }

    this.relativeOffset += count * 2;
    return offsets;
};

// Parses a list of 16 bit signed integers.
Parser.prototype.parseShortList = function(count) {
    var list = new Array(count);
    var dataView = this.data;
    var offset = this.offset + this.relativeOffset;
    for (var i = 0; i < count; i++) {
        list[i] = dataView.getInt16(offset);
        offset += 2;
    }

    this.relativeOffset += count * 2;
    return list;
};

// Parses a list of bytes.
Parser.prototype.parseByteList = function(count) {
    var list = new Array(count);
    var dataView = this.data;
    var offset = this.offset + this.relativeOffset;
    for (var i = 0; i < count; i++) {
        list[i] = dataView.getUint8(offset++);
    }

    this.relativeOffset += count;
    return list;
};

/**
 * Parse a list of items.
 * Record count is optional, if omitted it is read from the stream.
 * itemCallback is one of the Parser methods.
 */
Parser.prototype.parseList = function(count, itemCallback) {
    if (!itemCallback) {
        itemCallback = count;
        count = this.parseUShort();
    }
    var list = new Array(count);
    for (var i = 0; i < count; i++) {
        list[i] = itemCallback.call(this);
    }
    return list;
};

Parser.prototype.parseList32 = function(count, itemCallback) {
    if (!itemCallback) {
        itemCallback = count;
        count = this.parseULong();
    }
    var list = new Array(count);
    for (var i = 0; i < count; i++) {
        list[i] = itemCallback.call(this);
    }
    return list;
};

/**
 * Parse a list of records.
 * Record count is optional, if omitted it is read from the stream.
 * Example of recordDescription: { sequenceIndex: Parser.uShort, lookupListIndex: Parser.uShort }
 */
Parser.prototype.parseRecordList = function(count, recordDescription) {
    // If the count argument is absent, read it in the stream.
    if (!recordDescription) {
        recordDescription = count;
        count = this.parseUShort();
    }
    var records = new Array(count);
    var fields = Object.keys(recordDescription);
    for (var i = 0; i < count; i++) {
        var rec = {};
        for (var j = 0; j < fields.length; j++) {
            var fieldName = fields[j];
            var fieldType = recordDescription[fieldName];
            rec[fieldName] = fieldType.call(this);
        }
        records[i] = rec;
    }
    return records;
};

Parser.prototype.parseRecordList32 = function(count, recordDescription) {
    // If the count argument is absent, read it in the stream.
    if (!recordDescription) {
        recordDescription = count;
        count = this.parseULong();
    }
    var records = new Array(count);
    var fields = Object.keys(recordDescription);
    for (var i = 0; i < count; i++) {
        var rec = {};
        for (var j = 0; j < fields.length; j++) {
            var fieldName = fields[j];
            var fieldType = recordDescription[fieldName];
            rec[fieldName] = fieldType.call(this);
        }
        records[i] = rec;
    }
    return records;
};

// Parse a data structure into an object
// Example of description: { sequenceIndex: Parser.uShort, lookupListIndex: Parser.uShort }
Parser.prototype.parseStruct = function(description) {
    if (typeof description === 'function') {
        return description.call(this);
    } else {
        var fields = Object.keys(description);
        var struct = {};
        for (var j = 0; j < fields.length; j++) {
            var fieldName = fields[j];
            var fieldType = description[fieldName];
            struct[fieldName] = fieldType.call(this);
        }
        return struct;
    }
};

/**
 * Parse a GPOS valueRecord
 * https://docs.microsoft.com/en-us/typography/opentype/spec/gpos#value-record
 * valueFormat is optional, if omitted it is read from the stream.
 */
Parser.prototype.parseValueRecord = function(valueFormat) {
    if (valueFormat === undefined) {
        valueFormat = this.parseUShort();
    }
    if (valueFormat === 0) {
        // valueFormat2 in kerning pairs is most often 0
        // in this case return undefined instead of an empty object, to save space
        return;
    }
    var valueRecord = {};

    if (valueFormat & 0x0001) { valueRecord.xPlacement = this.parseShort(); }
    if (valueFormat & 0x0002) { valueRecord.yPlacement = this.parseShort(); }
    if (valueFormat & 0x0004) { valueRecord.xAdvance = this.parseShort(); }
    if (valueFormat & 0x0008) { valueRecord.yAdvance = this.parseShort(); }

    // Device table (non-variable font) / VariationIndex table (variable font) not supported
    // https://docs.microsoft.com/fr-fr/typography/opentype/spec/chapter2#devVarIdxTbls
    if (valueFormat & 0x0010) { valueRecord.xPlaDevice = undefined; this.parseShort(); }
    if (valueFormat & 0x0020) { valueRecord.yPlaDevice = undefined; this.parseShort(); }
    if (valueFormat & 0x0040) { valueRecord.xAdvDevice = undefined; this.parseShort(); }
    if (valueFormat & 0x0080) { valueRecord.yAdvDevice = undefined; this.parseShort(); }

    return valueRecord;
};

/**
 * Parse a list of GPOS valueRecords
 * https://docs.microsoft.com/en-us/typography/opentype/spec/gpos#value-record
 * valueFormat and valueCount are read from the stream.
 */
Parser.prototype.parseValueRecordList = function() {
    var valueFormat = this.parseUShort();
    var valueCount = this.parseUShort();
    var values = new Array(valueCount);
    for (var i = 0; i < valueCount; i++) {
        values[i] = this.parseValueRecord(valueFormat);
    }
    return values;
};

Parser.prototype.parsePointer = function(description) {
    var structOffset = this.parseOffset16();
    if (structOffset > 0) {
        // NULL offset => return undefined
        return new Parser(this.data, this.offset + structOffset).parseStruct(description);
    }
    return undefined;
};

Parser.prototype.parsePointer32 = function(description) {
    var structOffset = this.parseOffset32();
    if (structOffset > 0) {
        // NULL offset => return undefined
        return new Parser(this.data, this.offset + structOffset).parseStruct(description);
    }
    return undefined;
};

/**
 * Parse a list of offsets to lists of 16-bit integers,
 * or a list of offsets to lists of offsets to any kind of items.
 * If itemCallback is not provided, a list of list of UShort is assumed.
 * If provided, itemCallback is called on each item and must parse the item.
 * See examples in tables/gsub.js
 */
Parser.prototype.parseListOfLists = function(itemCallback) {
    var offsets = this.parseOffset16List();
    var count = offsets.length;
    var relativeOffset = this.relativeOffset;
    var list = new Array(count);
    for (var i = 0; i < count; i++) {
        var start = offsets[i];
        if (start === 0) {
            // NULL offset
            // Add i as owned property to list. Convenient with assert.
            list[i] = undefined;
            continue;
        }
        this.relativeOffset = start;
        if (itemCallback) {
            var subOffsets = this.parseOffset16List();
            var subList = new Array(subOffsets.length);
            for (var j = 0; j < subOffsets.length; j++) {
                this.relativeOffset = start + subOffsets[j];
                subList[j] = itemCallback.call(this);
            }
            list[i] = subList;
        } else {
            list[i] = this.parseUShortList();
        }
    }
    this.relativeOffset = relativeOffset;
    return list;
};

///// Complex tables parsing //////////////////////////////////

// Parse a coverage table in a GSUB, GPOS or GDEF table.
// https://www.microsoft.com/typography/OTSPEC/chapter2.htm
// parser.offset must point to the start of the table containing the coverage.
Parser.prototype.parseCoverage = function() {
    var startOffset = this.offset + this.relativeOffset;
    var format = this.parseUShort();
    var count = this.parseUShort();
    if (format === 1) {
        return {
            format: 1,
            glyphs: this.parseUShortList(count)
        };
    } else if (format === 2) {
        var ranges = new Array(count);
        for (var i = 0; i < count; i++) {
            ranges[i] = {
                start: this.parseUShort(),
                end: this.parseUShort(),
                index: this.parseUShort()
            };
        }
        return {
            format: 2,
            ranges: ranges
        };
    }
    throw new Error('0x' + startOffset.toString(16) + ': Coverage format must be 1 or 2.');
};

// Parse a Class Definition Table in a GSUB, GPOS or GDEF table.
// https://www.microsoft.com/typography/OTSPEC/chapter2.htm
Parser.prototype.parseClassDef = function() {
    var startOffset = this.offset + this.relativeOffset;
    var format = this.parseUShort();
    if (format === 1) {
        return {
            format: 1,
            startGlyph: this.parseUShort(),
            classes: this.parseUShortList()
        };
    } else if (format === 2) {
        return {
            format: 2,
            ranges: this.parseRecordList({
                start: Parser.uShort,
                end: Parser.uShort,
                classId: Parser.uShort
            })
        };
    }
    throw new Error('0x' + startOffset.toString(16) + ': ClassDef format must be 1 or 2.');
};

///// Static methods ///////////////////////////////////
// These convenience methods can be used as callbacks and should be called with "this" context set to a Parser instance.

Parser.list = function(count, itemCallback) {
    return function() {
        return this.parseList(count, itemCallback);
    };
};

Parser.list32 = function(count, itemCallback) {
    return function() {
        return this.parseList32(count, itemCallback);
    };
};

Parser.recordList = function(count, recordDescription) {
    return function() {
        return this.parseRecordList(count, recordDescription);
    };
};

Parser.recordList32 = function(count, recordDescription) {
    return function() {
        return this.parseRecordList32(count, recordDescription);
    };
};

Parser.pointer = function(description) {
    return function() {
        return this.parsePointer(description);
    };
};

Parser.pointer32 = function(description) {
    return function() {
        return this.parsePointer32(description);
    };
};

Parser.tag = Parser.prototype.parseTag;
Parser.byte = Parser.prototype.parseByte;
Parser.uShort = Parser.offset16 = Parser.prototype.parseUShort;
Parser.uShortList = Parser.prototype.parseUShortList;
Parser.uLong = Parser.offset32 = Parser.prototype.parseULong;
Parser.uLongList = Parser.prototype.parseULongList;
Parser.struct = Parser.prototype.parseStruct;
Parser.coverage = Parser.prototype.parseCoverage;
Parser.classDef = Parser.prototype.parseClassDef;

///// Script, Feature, Lookup lists ///////////////////////////////////////////////
// https://www.microsoft.com/typography/OTSPEC/chapter2.htm

var langSysTable = {
    reserved: Parser.uShort,
    reqFeatureIndex: Parser.uShort,
    featureIndexes: Parser.uShortList
};

Parser.prototype.parseScriptList = function() {
    return this.parsePointer(Parser.recordList({
        tag: Parser.tag,
        script: Parser.pointer({
            defaultLangSys: Parser.pointer(langSysTable),
            langSysRecords: Parser.recordList({
                tag: Parser.tag,
                langSys: Parser.pointer(langSysTable)
            })
        })
    })) || [];
};

Parser.prototype.parseFeatureList = function() {
    return this.parsePointer(Parser.recordList({
        tag: Parser.tag,
        feature: Parser.pointer({
            featureParams: Parser.offset16,
            lookupListIndexes: Parser.uShortList
        })
    })) || [];
};

Parser.prototype.parseLookupList = function(lookupTableParsers) {
    return this.parsePointer(Parser.list(Parser.pointer(function() {
        var lookupType = this.parseUShort();
        check.argument(1 <= lookupType && lookupType <= 9, 'GPOS/GSUB lookup type ' + lookupType + ' unknown.');
        var lookupFlag = this.parseUShort();
        var useMarkFilteringSet = lookupFlag & 0x10;
        return {
            lookupType: lookupType,
            lookupFlag: lookupFlag,
            subtables: this.parseList(Parser.pointer(lookupTableParsers[lookupType])),
            markFilteringSet: useMarkFilteringSet ? this.parseUShort() : undefined
        };
    }))) || [];
};

Parser.prototype.parseFeatureVariationsList = function() {
    return this.parsePointer32(function() {
        var majorVersion = this.parseUShort();
        var minorVersion = this.parseUShort();
        check.argument(majorVersion === 1 && minorVersion < 1, 'GPOS/GSUB feature variations table unknown.');
        var featureVariations = this.parseRecordList32({
            conditionSetOffset: Parser.offset32,
            featureTableSubstitutionOffset: Parser.offset32
        });
        return featureVariations;
    }) || [];
};

var parse = {
    getByte: getByte,
    getCard8: getByte,
    getUShort: getUShort,
    getCard16: getUShort,
    getShort: getShort,
    getULong: getULong,
    getFixed: getFixed,
    getTag: getTag,
    getOffset: getOffset,
    getBytes: getBytes,
    bytesToString: bytesToString,
    Parser: Parser,
};

// The `glyf` table describes the glyphs in TrueType outline format.

// Parse the coordinate data for a glyph.
function parseGlyphCoordinate(p, flag, previousValue, shortVectorBitMask, sameBitMask) {
    var v;
    if ((flag & shortVectorBitMask) > 0) {
        // The coordinate is 1 byte long.
        v = p.parseByte();
        // The `same` bit is re-used for short values to signify the sign of the value.
        if ((flag & sameBitMask) === 0) {
            v = -v;
        }

        v = previousValue + v;
    } else {
        //  The coordinate is 2 bytes long.
        // If the `same` bit is set, the coordinate is the same as the previous coordinate.
        if ((flag & sameBitMask) > 0) {
            v = previousValue;
        } else {
            // Parse the coordinate as a signed 16-bit delta value.
            v = previousValue + p.parseShort();
        }
    }

    return v;
}

// Parse a TrueType glyph.
function parseGlyph(glyph, data, start) {
    var p = new parse.Parser(data, start);
    glyph.numberOfContours = p.parseShort();
    glyph._xMin = p.parseShort();
    glyph._yMin = p.parseShort();
    glyph._xMax = p.parseShort();
    glyph._yMax = p.parseShort();
    var flags;
    var flag;

    if (glyph.numberOfContours > 0) {
        // This glyph is not a composite.
        var endPointIndices = glyph.endPointIndices = [];
        for (var i = 0; i < glyph.numberOfContours; i += 1) {
            endPointIndices.push(p.parseUShort());
        }

        glyph.instructionLength = p.parseUShort();
        glyph.instructions = [];
        for (var i$1 = 0; i$1 < glyph.instructionLength; i$1 += 1) {
            glyph.instructions.push(p.parseByte());
        }

        var numberOfCoordinates = endPointIndices[endPointIndices.length - 1] + 1;
        flags = [];
        for (var i$2 = 0; i$2 < numberOfCoordinates; i$2 += 1) {
            flag = p.parseByte();
            flags.push(flag);
            // If bit 3 is set, we repeat this flag n times, where n is the next byte.
            if ((flag & 8) > 0) {
                var repeatCount = p.parseByte();
                for (var j = 0; j < repeatCount; j += 1) {
                    flags.push(flag);
                    i$2 += 1;
                }
            }
        }

        check.argument(flags.length === numberOfCoordinates, 'Bad flags.');

        if (endPointIndices.length > 0) {
            var points = [];
            var point;
            // X/Y coordinates are relative to the previous point, except for the first point which is relative to 0,0.
            if (numberOfCoordinates > 0) {
                for (var i$3 = 0; i$3 < numberOfCoordinates; i$3 += 1) {
                    flag = flags[i$3];
                    point = {};
                    point.onCurve = !!(flag & 1);
                    point.lastPointOfContour = endPointIndices.indexOf(i$3) >= 0;
                    points.push(point);
                }

                var px = 0;
                for (var i$4 = 0; i$4 < numberOfCoordinates; i$4 += 1) {
                    flag = flags[i$4];
                    point = points[i$4];
                    point.x = parseGlyphCoordinate(p, flag, px, 2, 16);
                    px = point.x;
                }

                var py = 0;
                for (var i$5 = 0; i$5 < numberOfCoordinates; i$5 += 1) {
                    flag = flags[i$5];
                    point = points[i$5];
                    point.y = parseGlyphCoordinate(p, flag, py, 4, 32);
                    py = point.y;
                }
            }

            glyph.points = points;
        } else {
            glyph.points = [];
        }
    } else if (glyph.numberOfContours === 0) {
        glyph.points = [];
    } else {
        glyph.isComposite = true;
        glyph.points = [];
        glyph.components = [];
        var moreComponents = true;
        while (moreComponents) {
            flags = p.parseUShort();
            var component = {
                glyphIndex: p.parseUShort(),
                xScale: 1,
                scale01: 0,
                scale10: 0,
                yScale: 1,
                dx: 0,
                dy: 0
            };
            if ((flags & 1) > 0) {
                // The arguments are words
                if ((flags & 2) > 0) {
                    // values are offset
                    component.dx = p.parseShort();
                    component.dy = p.parseShort();
                } else {
                    // values are matched points
                    component.matchedPoints = [p.parseUShort(), p.parseUShort()];
                }

            } else {
                // The arguments are bytes
                if ((flags & 2) > 0) {
                    // values are offset
                    component.dx = p.parseChar();
                    component.dy = p.parseChar();
                } else {
                    // values are matched points
                    component.matchedPoints = [p.parseByte(), p.parseByte()];
                }
            }

            if ((flags & 8) > 0) {
                // We have a scale
                component.xScale = component.yScale = p.parseF2Dot14();
            } else if ((flags & 64) > 0) {
                // We have an X / Y scale
                component.xScale = p.parseF2Dot14();
                component.yScale = p.parseF2Dot14();
            } else if ((flags & 128) > 0) {
                // We have a 2x2 transformation
                component.xScale = p.parseF2Dot14();
                component.scale01 = p.parseF2Dot14();
                component.scale10 = p.parseF2Dot14();
                component.yScale = p.parseF2Dot14();
            }

            glyph.components.push(component);
            moreComponents = !!(flags & 32);
        }
        if (flags & 0x100) {
            // We have instructions
            glyph.instructionLength = p.parseUShort();
            glyph.instructions = [];
            for (var i$6 = 0; i$6 < glyph.instructionLength; i$6 += 1) {
                glyph.instructions.push(p.parseByte());
            }
        }
    }
}

// Transform an array of points and return a new array.
function transformPoints(points, transform) {
    var newPoints = [];
    for (var i = 0; i < points.length; i += 1) {
        var pt = points[i];
        var newPt = {
            x: transform.xScale * pt.x + transform.scale01 * pt.y + transform.dx,
            y: transform.scale10 * pt.x + transform.yScale * pt.y + transform.dy,
            onCurve: pt.onCurve,
            lastPointOfContour: pt.lastPointOfContour
        };
        newPoints.push(newPt);
    }

    return newPoints;
}

function getContours(points) {
    var contours = [];
    var currentContour = [];
    for (var i = 0; i < points.length; i += 1) {
        var pt = points[i];
        currentContour.push(pt);
        if (pt.lastPointOfContour) {
            contours.push(currentContour);
            currentContour = [];
        }
    }

    check.argument(currentContour.length === 0, 'There are still points left in the current contour.');
    return contours;
}

// Convert the TrueType glyph outline to a Path.
function getPath(points) {
    var p = new Path();
    if (!points) {
        return p;
    }

    var contours = getContours(points);

    for (var contourIndex = 0; contourIndex < contours.length; ++contourIndex) {
        var contour = contours[contourIndex];

        var prev = null;
        var curr = contour[contour.length - 1];
        var next = contour[0];

        if (curr.onCurve) {
            p.moveTo(curr.x, curr.y);
        } else {
            if (next.onCurve) {
                p.moveTo(next.x, next.y);
            } else {
                // If both first and last points are off-curve, start at their middle.
                var start = {x: (curr.x + next.x) * 0.5, y: (curr.y + next.y) * 0.5};
                p.moveTo(start.x, start.y);
            }
        }

        for (var i = 0; i < contour.length; ++i) {
            prev = curr;
            curr = next;
            next = contour[(i + 1) % contour.length];

            if (curr.onCurve) {
                // This is a straight line.
                p.lineTo(curr.x, curr.y);
            } else {
                var prev2 = prev;
                var next2 = next;

                if (!prev.onCurve) {
                    prev2 = { x: (curr.x + prev.x) * 0.5, y: (curr.y + prev.y) * 0.5 };
                }

                if (!next.onCurve) {
                    next2 = { x: (curr.x + next.x) * 0.5, y: (curr.y + next.y) * 0.5 };
                }

                p.quadraticCurveTo(curr.x, curr.y, next2.x, next2.y);
            }
        }

        p.closePath();
    }
    return p;
}

function buildPath(glyphs, glyph) {
    if (glyph.isComposite) {
        for (var j = 0; j < glyph.components.length; j += 1) {
            var component = glyph.components[j];
            var componentGlyph = glyphs.get(component.glyphIndex);
            // Force the ttfGlyphLoader to parse the glyph.
            componentGlyph.getPath();
            if (componentGlyph.points) {
                var transformedPoints = (void 0);
                if (component.matchedPoints === undefined) {
                    // component positioned by offset
                    transformedPoints = transformPoints(componentGlyph.points, component);
                } else {
                    // component positioned by matched points
                    if ((component.matchedPoints[0] > glyph.points.length - 1) ||
                        (component.matchedPoints[1] > componentGlyph.points.length - 1)) {
                        throw Error('Matched points out of range in ' + glyph.name);
                    }
                    var firstPt = glyph.points[component.matchedPoints[0]];
                    var secondPt = componentGlyph.points[component.matchedPoints[1]];
                    var transform = {
                        xScale: component.xScale, scale01: component.scale01,
                        scale10: component.scale10, yScale: component.yScale,
                        dx: 0, dy: 0
                    };
                    secondPt = transformPoints([secondPt], transform)[0];
                    transform.dx = firstPt.x - secondPt.x;
                    transform.dy = firstPt.y - secondPt.y;
                    transformedPoints = transformPoints(componentGlyph.points, transform);
                }
                glyph.points = glyph.points.concat(transformedPoints);
            }
        }
    }

    return getPath(glyph.points);
}

function parseGlyfTableAll(data, start, loca, font) {
    var glyphs = new glyphset.GlyphSet(font);

    // The last element of the loca table is invalid.
    for (var i = 0; i < loca.length - 1; i += 1) {
        var offset = loca[i];
        var nextOffset = loca[i + 1];
        if (offset !== nextOffset) {
            glyphs.push(i, glyphset.ttfGlyphLoader(font, i, parseGlyph, data, start + offset, buildPath));
        } else {
            glyphs.push(i, glyphset.glyphLoader(font, i));
        }
    }

    return glyphs;
}

function parseGlyfTableOnLowMemory(data, start, loca, font) {
    var glyphs = new glyphset.GlyphSet(font);

    font._push = function(i) {
        var offset = loca[i];
        var nextOffset = loca[i + 1];
        if (offset !== nextOffset) {
            glyphs.push(i, glyphset.ttfGlyphLoader(font, i, parseGlyph, data, start + offset, buildPath));
        } else {
            glyphs.push(i, glyphset.glyphLoader(font, i));
        }
    };

    return glyphs;
}

// Parse all the glyphs according to the offsets from the `loca` table.
function parseGlyfTable(data, start, loca, font, opt) {
    if (opt.lowMemory)
        { return parseGlyfTableOnLowMemory(data, start, loca, font); }
    else
        { return parseGlyfTableAll(data, start, loca, font); }
}

var glyf = { getPath: getPath, parse: parseGlyfTable};

/* A TrueType font hinting interpreter.
*
* (c) 2017 Axel Kittenberger
*
* This interpreter has been implemented according to this documentation:
* https://developer.apple.com/fonts/TrueType-Reference-Manual/RM05/Chap5.html
*
* According to the documentation F24DOT6 values are used for pixels.
* That means calculation is 1/64 pixel accurate and uses integer operations.
* However, Javascript has floating point operations by default and only
* those are available. One could make a case to simulate the 1/64 accuracy
* exactly by truncating after every division operation
* (for example with << 0) to get pixel exactly results as other TrueType
* implementations. It may make sense since some fonts are pixel optimized
* by hand using DELTAP instructions. The current implementation doesn't
* and rather uses full floating point precision.
*
* xScale, yScale and rotation is currently ignored.
*
* A few non-trivial instructions are missing as I didn't encounter yet
* a font that used them to test a possible implementation.
*
* Some fonts seem to use undocumented features regarding the twilight zone.
* Only some of them are implemented as they were encountered.
*
* The exports.DEBUG statements are removed on the minified distribution file.
*/

var instructionTable;
var exec;
var execGlyph;
var execComponent;

/*
* Creates a hinting object.
*
* There ought to be exactly one
* for each truetype font that is used for hinting.
*/
function Hinting(font) {
    // the font this hinting object is for
    this.font = font;

    this.getCommands = function (hPoints) {
        return glyf.getPath(hPoints).commands;
    };

    // cached states
    this._fpgmState  =
    this._prepState  =
        undefined;

    // errorState
    // 0 ... all okay
    // 1 ... had an error in a glyf,
    //       continue working but stop spamming
    //       the console
    // 2 ... error at prep, stop hinting at this ppem
    // 3 ... error at fpeg, stop hinting for this font at all
    this._errorState = 0;
}

/*
* Not rounding.
*/
function roundOff(v) {
    return v;
}

/*
* Rounding to grid.
*/
function roundToGrid(v) {
    //Rounding in TT is supposed to "symmetrical around zero"
    return Math.sign(v) * Math.round(Math.abs(v));
}

/*
* Rounding to double grid.
*/
function roundToDoubleGrid(v) {
    return Math.sign(v) * Math.round(Math.abs(v * 2)) / 2;
}

/*
* Rounding to half grid.
*/
function roundToHalfGrid(v) {
    return Math.sign(v) * (Math.round(Math.abs(v) + 0.5) - 0.5);
}

/*
* Rounding to up to grid.
*/
function roundUpToGrid(v) {
    return Math.sign(v) * Math.ceil(Math.abs(v));
}

/*
* Rounding to down to grid.
*/
function roundDownToGrid(v) {
    return Math.sign(v) * Math.floor(Math.abs(v));
}

/*
* Super rounding.
*/
var roundSuper = function (v) {
    var period = this.srPeriod;
    var phase = this.srPhase;
    var threshold = this.srThreshold;
    var sign = 1;

    if (v < 0) {
        v = -v;
        sign = -1;
    }

    v += threshold - phase;

    v = Math.trunc(v / period) * period;

    v += phase;

    // according to http://xgridfit.sourceforge.net/round.html
    if (v < 0) { return phase * sign; }

    return v * sign;
};

/*
* Unit vector of x-axis.
*/
var xUnitVector = {
    x: 1,

    y: 0,

    axis: 'x',

    // Gets the projected distance between two points.
    // o1/o2 ... if true, respective original position is used.
    distance: function (p1, p2, o1, o2) {
        return (o1 ? p1.xo : p1.x) - (o2 ? p2.xo : p2.x);
    },

    // Moves point p so the moved position has the same relative
    // position to the moved positions of rp1 and rp2 than the
    // original positions had.
    //
    // See APPENDIX on INTERPOLATE at the bottom of this file.
    interpolate: function (p, rp1, rp2, pv) {
        var do1;
        var do2;
        var doa1;
        var doa2;
        var dm1;
        var dm2;
        var dt;

        if (!pv || pv === this) {
            do1 = p.xo - rp1.xo;
            do2 = p.xo - rp2.xo;
            dm1 = rp1.x - rp1.xo;
            dm2 = rp2.x - rp2.xo;
            doa1 = Math.abs(do1);
            doa2 = Math.abs(do2);
            dt = doa1 + doa2;

            if (dt === 0) {
                p.x = p.xo + (dm1 + dm2) / 2;
                return;
            }

            p.x = p.xo + (dm1 * doa2 + dm2 * doa1) / dt;
            return;
        }

        do1 = pv.distance(p, rp1, true, true);
        do2 = pv.distance(p, rp2, true, true);
        dm1 = pv.distance(rp1, rp1, false, true);
        dm2 = pv.distance(rp2, rp2, false, true);
        doa1 = Math.abs(do1);
        doa2 = Math.abs(do2);
        dt = doa1 + doa2;

        if (dt === 0) {
            xUnitVector.setRelative(p, p, (dm1 + dm2) / 2, pv, true);
            return;
        }

        xUnitVector.setRelative(p, p, (dm1 * doa2 + dm2 * doa1) / dt, pv, true);
    },

    // Slope of line normal to this
    normalSlope: Number.NEGATIVE_INFINITY,

    // Sets the point 'p' relative to point 'rp'
    // by the distance 'd'.
    //
    // See APPENDIX on SETRELATIVE at the bottom of this file.
    //
    // p   ... point to set
    // rp  ... reference point
    // d   ... distance on projection vector
    // pv  ... projection vector (undefined = this)
    // org ... if true, uses the original position of rp as reference.
    setRelative: function (p, rp, d, pv, org) {
        if (!pv || pv === this) {
            p.x = (org ? rp.xo : rp.x) + d;
            return;
        }

        var rpx = org ? rp.xo : rp.x;
        var rpy = org ? rp.yo : rp.y;
        var rpdx = rpx + d * pv.x;
        var rpdy = rpy + d * pv.y;

        p.x = rpdx + (p.y - rpdy) / pv.normalSlope;
    },

    // Slope of vector line.
    slope: 0,

    // Touches the point p.
    touch: function (p) {
        p.xTouched = true;
    },

    // Tests if a point p is touched.
    touched: function (p) {
        return p.xTouched;
    },

    // Untouches the point p.
    untouch: function (p) {
        p.xTouched = false;
    }
};

/*
* Unit vector of y-axis.
*/
var yUnitVector = {
    x: 0,

    y: 1,

    axis: 'y',

    // Gets the projected distance between two points.
    // o1/o2 ... if true, respective original position is used.
    distance: function (p1, p2, o1, o2) {
        return (o1 ? p1.yo : p1.y) - (o2 ? p2.yo : p2.y);
    },

    // Moves point p so the moved position has the same relative
    // position to the moved positions of rp1 and rp2 than the
    // original positions had.
    //
    // See APPENDIX on INTERPOLATE at the bottom of this file.
    interpolate: function (p, rp1, rp2, pv) {
        var do1;
        var do2;
        var doa1;
        var doa2;
        var dm1;
        var dm2;
        var dt;

        if (!pv || pv === this) {
            do1 = p.yo - rp1.yo;
            do2 = p.yo - rp2.yo;
            dm1 = rp1.y - rp1.yo;
            dm2 = rp2.y - rp2.yo;
            doa1 = Math.abs(do1);
            doa2 = Math.abs(do2);
            dt = doa1 + doa2;

            if (dt === 0) {
                p.y = p.yo + (dm1 + dm2) / 2;
                return;
            }

            p.y = p.yo + (dm1 * doa2 + dm2 * doa1) / dt;
            return;
        }

        do1 = pv.distance(p, rp1, true, true);
        do2 = pv.distance(p, rp2, true, true);
        dm1 = pv.distance(rp1, rp1, false, true);
        dm2 = pv.distance(rp2, rp2, false, true);
        doa1 = Math.abs(do1);
        doa2 = Math.abs(do2);
        dt = doa1 + doa2;

        if (dt === 0) {
            yUnitVector.setRelative(p, p, (dm1 + dm2) / 2, pv, true);
            return;
        }

        yUnitVector.setRelative(p, p, (dm1 * doa2 + dm2 * doa1) / dt, pv, true);
    },

    // Slope of line normal to this.
    normalSlope: 0,

    // Sets the point 'p' relative to point 'rp'
    // by the distance 'd'
    //
    // See APPENDIX on SETRELATIVE at the bottom of this file.
    //
    // p   ... point to set
    // rp  ... reference point
    // d   ... distance on projection vector
    // pv  ... projection vector (undefined = this)
    // org ... if true, uses the original position of rp as reference.
    setRelative: function (p, rp, d, pv, org) {
        if (!pv || pv === this) {
            p.y = (org ? rp.yo : rp.y) + d;
            return;
        }

        var rpx = org ? rp.xo : rp.x;
        var rpy = org ? rp.yo : rp.y;
        var rpdx = rpx + d * pv.x;
        var rpdy = rpy + d * pv.y;

        p.y = rpdy + pv.normalSlope * (p.x - rpdx);
    },

    // Slope of vector line.
    slope: Number.POSITIVE_INFINITY,

    // Touches the point p.
    touch: function (p) {
        p.yTouched = true;
    },

    // Tests if a point p is touched.
    touched: function (p) {
        return p.yTouched;
    },

    // Untouches the point p.
    untouch: function (p) {
        p.yTouched = false;
    }
};

Object.freeze(xUnitVector);
Object.freeze(yUnitVector);

/*
* Creates a unit vector that is not x- or y-axis.
*/
function UnitVector(x, y) {
    this.x = x;
    this.y = y;
    this.axis = undefined;
    this.slope = y / x;
    this.normalSlope = -x / y;
    Object.freeze(this);
}

/*
* Gets the projected distance between two points.
* o1/o2 ... if true, respective original position is used.
*/
UnitVector.prototype.distance = function(p1, p2, o1, o2) {
    return (
        this.x * xUnitVector.distance(p1, p2, o1, o2) +
        this.y * yUnitVector.distance(p1, p2, o1, o2)
    );
};

/*
* Moves point p so the moved position has the same relative
* position to the moved positions of rp1 and rp2 than the
* original positions had.
*
* See APPENDIX on INTERPOLATE at the bottom of this file.
*/
UnitVector.prototype.interpolate = function(p, rp1, rp2, pv) {
    var dm1;
    var dm2;
    var do1;
    var do2;
    var doa1;
    var doa2;
    var dt;

    do1 = pv.distance(p, rp1, true, true);
    do2 = pv.distance(p, rp2, true, true);
    dm1 = pv.distance(rp1, rp1, false, true);
    dm2 = pv.distance(rp2, rp2, false, true);
    doa1 = Math.abs(do1);
    doa2 = Math.abs(do2);
    dt = doa1 + doa2;

    if (dt === 0) {
        this.setRelative(p, p, (dm1 + dm2) / 2, pv, true);
        return;
    }

    this.setRelative(p, p, (dm1 * doa2 + dm2 * doa1) / dt, pv, true);
};

/*
* Sets the point 'p' relative to point 'rp'
* by the distance 'd'
*
* See APPENDIX on SETRELATIVE at the bottom of this file.
*
* p   ...  point to set
* rp  ... reference point
* d   ... distance on projection vector
* pv  ... projection vector (undefined = this)
* org ... if true, uses the original position of rp as reference.
*/
UnitVector.prototype.setRelative = function(p, rp, d, pv, org) {
    pv = pv || this;

    var rpx = org ? rp.xo : rp.x;
    var rpy = org ? rp.yo : rp.y;
    var rpdx = rpx + d * pv.x;
    var rpdy = rpy + d * pv.y;

    var pvns = pv.normalSlope;
    var fvs = this.slope;

    var px = p.x;
    var py = p.y;

    p.x = (fvs * px - pvns * rpdx + rpdy - py) / (fvs - pvns);
    p.y = fvs * (p.x - px) + py;
};

/*
* Touches the point p.
*/
UnitVector.prototype.touch = function(p) {
    p.xTouched = true;
    p.yTouched = true;
};

/*
* Returns a unit vector with x/y coordinates.
*/
function getUnitVector(x, y) {
    var d = Math.sqrt(x * x + y * y);

    x /= d;
    y /= d;

    if (x === 1 && y === 0) { return xUnitVector; }
    else if (x === 0 && y === 1) { return yUnitVector; }
    else { return new UnitVector(x, y); }
}

/*
* Creates a point in the hinting engine.
*/
function HPoint(
    x,
    y,
    lastPointOfContour,
    onCurve
) {
    this.x = this.xo = Math.round(x * 64) / 64; // hinted x value and original x-value
    this.y = this.yo = Math.round(y * 64) / 64; // hinted y value and original y-value

    this.lastPointOfContour = lastPointOfContour;
    this.onCurve = onCurve;
    this.prevPointOnContour = undefined;
    this.nextPointOnContour = undefined;
    this.xTouched = false;
    this.yTouched = false;

    Object.preventExtensions(this);
}

/*
* Returns the next touched point on the contour.
*
* v  ... unit vector to test touch axis.
*/
HPoint.prototype.nextTouched = function(v) {
    var p = this.nextPointOnContour;

    while (!v.touched(p) && p !== this) { p = p.nextPointOnContour; }

    return p;
};

/*
* Returns the previous touched point on the contour
*
* v  ... unit vector to test touch axis.
*/
HPoint.prototype.prevTouched = function(v) {
    var p = this.prevPointOnContour;

    while (!v.touched(p) && p !== this) { p = p.prevPointOnContour; }

    return p;
};

/*
* The zero point.
*/
var HPZero = Object.freeze(new HPoint(0, 0));

/*
* The default state of the interpreter.
*
* Note: Freezing the defaultState and then deriving from it
* makes the V8 Javascript engine going awkward,
* so this is avoided, albeit the defaultState shouldn't
* ever change.
*/
var defaultState = {
    cvCutIn: 17 / 16,    // control value cut in
    deltaBase: 9,
    deltaShift: 0.125,
    loop: 1,             // loops some instructions
    minDis: 1,           // minimum distance
    autoFlip: true
};

/*
* The current state of the interpreter.
*
* env  ... 'fpgm' or 'prep' or 'glyf'
* prog ... the program
*/
function State(env, prog) {
    this.env = env;
    this.stack = [];
    this.prog = prog;

    switch (env) {
        case 'glyf' :
            this.zp0 = this.zp1 = this.zp2 = 1;
            this.rp0 = this.rp1 = this.rp2 = 0;
            /* fall through */
        case 'prep' :
            this.fv = this.pv = this.dpv = xUnitVector;
            this.round = roundToGrid;
    }
}

/*
* Executes a glyph program.
*
* This does the hinting for each glyph.
*
* Returns an array of moved points.
*
* glyph: the glyph to hint
* ppem: the size the glyph is rendered for
*/
Hinting.prototype.exec = function(glyph, ppem) {
    if (typeof ppem !== 'number') {
        throw new Error('Point size is not a number!');
    }

    // Received a fatal error, don't do any hinting anymore.
    if (this._errorState > 2) { return; }

    var font = this.font;
    var prepState = this._prepState;

    if (!prepState || prepState.ppem !== ppem) {
        var fpgmState = this._fpgmState;

        if (!fpgmState) {
            // Executes the fpgm state.
            // This is used by fonts to define functions.
            State.prototype = defaultState;

            fpgmState =
            this._fpgmState =
                new State('fpgm', font.tables.fpgm);

            fpgmState.funcs = [ ];
            fpgmState.font = font;

            if (exports.DEBUG) {
                console.log('---EXEC FPGM---');
                fpgmState.step = -1;
            }

            try {
                exec(fpgmState);
            } catch (e) {
                console.log('Hinting error in FPGM:' + e);
                this._errorState = 3;
                return;
            }
        }

        // Executes the prep program for this ppem setting.
        // This is used by fonts to set cvt values
        // depending on to be rendered font size.

        State.prototype = fpgmState;
        prepState =
        this._prepState =
            new State('prep', font.tables.prep);

        prepState.ppem = ppem;

        // Creates a copy of the cvt table
        // and scales it to the current ppem setting.
        var oCvt = font.tables.cvt;
        if (oCvt) {
            var cvt = prepState.cvt = new Array(oCvt.length);
            var scale = ppem / font.unitsPerEm;
            for (var c = 0; c < oCvt.length; c++) {
                cvt[c] = oCvt[c] * scale;
            }
        } else {
            prepState.cvt = [];
        }

        if (exports.DEBUG) {
            console.log('---EXEC PREP---');
            prepState.step = -1;
        }

        try {
            exec(prepState);
        } catch (e) {
            if (this._errorState < 2) {
                console.log('Hinting error in PREP:' + e);
            }
            this._errorState = 2;
        }
    }

    if (this._errorState > 1) { return; }

    try {
        return execGlyph(glyph, prepState);
    } catch (e) {
        if (this._errorState < 1) {
            console.log('Hinting error:' + e);
            console.log('Note: further hinting errors are silenced');
        }
        this._errorState = 1;
        return undefined;
    }
};

/*
* Executes the hinting program for a glyph.
*/
execGlyph = function(glyph, prepState) {
    // original point positions
    var xScale = prepState.ppem / prepState.font.unitsPerEm;
    var yScale = xScale;
    var components = glyph.components;
    var contours;
    var gZone;
    var state;

    State.prototype = prepState;
    if (!components) {
        state = new State('glyf', glyph.instructions);
        if (exports.DEBUG) {
            console.log('---EXEC GLYPH---');
            state.step = -1;
        }
        execComponent(glyph, state, xScale, yScale);
        gZone = state.gZone;
    } else {
        var font = prepState.font;
        gZone = [];
        contours = [];
        for (var i = 0; i < components.length; i++) {
            var c = components[i];
            var cg = font.glyphs.get(c.glyphIndex);

            state = new State('glyf', cg.instructions);

            if (exports.DEBUG) {
                console.log('---EXEC COMP ' + i + '---');
                state.step = -1;
            }

            execComponent(cg, state, xScale, yScale);
            // appends the computed points to the result array
            // post processes the component points
            var dx = Math.round(c.dx * xScale);
            var dy = Math.round(c.dy * yScale);
            var gz = state.gZone;
            var cc = state.contours;
            for (var pi = 0; pi < gz.length; pi++) {
                var p = gz[pi];
                p.xTouched = p.yTouched = false;
                p.xo = p.x = p.x + dx;
                p.yo = p.y = p.y + dy;
            }

            var gLen = gZone.length;
            gZone.push.apply(gZone, gz);
            for (var j = 0; j < cc.length; j++) {
                contours.push(cc[j] + gLen);
            }
        }

        if (glyph.instructions && !state.inhibitGridFit) {
            // the composite has instructions on its own
            state = new State('glyf', glyph.instructions);

            state.gZone = state.z0 = state.z1 = state.z2 = gZone;

            state.contours = contours;

            // note: HPZero cannot be used here, since
            //       the point might be modified
            gZone.push(
                new HPoint(0, 0),
                new HPoint(Math.round(glyph.advanceWidth * xScale), 0)
            );

            if (exports.DEBUG) {
                console.log('---EXEC COMPOSITE---');
                state.step = -1;
            }

            exec(state);

            gZone.length -= 2;
        }
    }

    return gZone;
};

/*
* Executes the hinting program for a component of a multi-component glyph
* or of the glyph itself for a non-component glyph.
*/
execComponent = function(glyph, state, xScale, yScale)
{
    var points = glyph.points || [];
    var pLen = points.length;
    var gZone = state.gZone = state.z0 = state.z1 = state.z2 = [];
    var contours = state.contours = [];

    // Scales the original points and
    // makes copies for the hinted points.
    var cp; // current point
    for (var i = 0; i < pLen; i++) {
        cp = points[i];

        gZone[i] = new HPoint(
            cp.x * xScale,
            cp.y * yScale,
            cp.lastPointOfContour,
            cp.onCurve
        );
    }

    // Chain links the contours.
    var sp; // start point
    var np; // next point

    for (var i$1 = 0; i$1 < pLen; i$1++) {
        cp = gZone[i$1];

        if (!sp) {
            sp = cp;
            contours.push(i$1);
        }

        if (cp.lastPointOfContour) {
            cp.nextPointOnContour = sp;
            sp.prevPointOnContour = cp;
            sp = undefined;
        } else {
            np = gZone[i$1 + 1];
            cp.nextPointOnContour = np;
            np.prevPointOnContour = cp;
        }
    }

    if (state.inhibitGridFit) { return; }

    if (exports.DEBUG) {
        console.log('PROCESSING GLYPH', state.stack);
        for (var i$2 = 0; i$2 < pLen; i$2++) {
            console.log(i$2, gZone[i$2].x, gZone[i$2].y);
        }
    }

    gZone.push(
        new HPoint(0, 0),
        new HPoint(Math.round(glyph.advanceWidth * xScale), 0)
    );

    exec(state);

    // Removes the extra points.
    gZone.length -= 2;

    if (exports.DEBUG) {
        console.log('FINISHED GLYPH', state.stack);
        for (var i$3 = 0; i$3 < pLen; i$3++) {
            console.log(i$3, gZone[i$3].x, gZone[i$3].y);
        }
    }
};

/*
* Executes the program loaded in state.
*/
exec = function(state) {
    var prog = state.prog;

    if (!prog) { return; }

    var pLen = prog.length;
    var ins;

    for (state.ip = 0; state.ip < pLen; state.ip++) {
        if (exports.DEBUG) { state.step++; }
        ins = instructionTable[prog[state.ip]];

        if (!ins) {
            throw new Error(
                'unknown instruction: 0x' +
                Number(prog[state.ip]).toString(16)
            );
        }

        ins(state);

        // very extensive debugging for each step
        /*
        if (exports.DEBUG) {
            var da;
            if (state.gZone) {
                da = [];
                for (let i = 0; i < state.gZone.length; i++)
                {
                    da.push(i + ' ' +
                        state.gZone[i].x * 64 + ' ' +
                        state.gZone[i].y * 64 + ' ' +
                        (state.gZone[i].xTouched ? 'x' : '') +
                        (state.gZone[i].yTouched ? 'y' : '')
                    );
                }
                console.log('GZ', da);
            }

            if (state.tZone) {
                da = [];
                for (let i = 0; i < state.tZone.length; i++) {
                    da.push(i + ' ' +
                        state.tZone[i].x * 64 + ' ' +
                        state.tZone[i].y * 64 + ' ' +
                        (state.tZone[i].xTouched ? 'x' : '') +
                        (state.tZone[i].yTouched ? 'y' : '')
                    );
                }
                console.log('TZ', da);
            }

            if (state.stack.length > 10) {
                console.log(
                    state.stack.length,
                    '...', state.stack.slice(state.stack.length - 10)
                );
            } else {
                console.log(state.stack.length, state.stack);
            }
        }
        */
    }
};

/*
* Initializes the twilight zone.
*
* This is only done if a SZPx instruction
* refers to the twilight zone.
*/
function initTZone(state)
{
    var tZone = state.tZone = new Array(state.gZone.length);

    // no idea if this is actually correct...
    for (var i = 0; i < tZone.length; i++)
    {
        tZone[i] = new HPoint(0, 0);
    }
}

/*
* Skips the instruction pointer ahead over an IF/ELSE block.
* handleElse .. if true breaks on matching ELSE
*/
function skip(state, handleElse)
{
    var prog = state.prog;
    var ip = state.ip;
    var nesting = 1;
    var ins;

    do {
        ins = prog[++ip];
        if (ins === 0x58) // IF
            { nesting++; }
        else if (ins === 0x59) // EIF
            { nesting--; }
        else if (ins === 0x40) // NPUSHB
            { ip += prog[ip + 1] + 1; }
        else if (ins === 0x41) // NPUSHW
            { ip += 2 * prog[ip + 1] + 1; }
        else if (ins >= 0xB0 && ins <= 0xB7) // PUSHB
            { ip += ins - 0xB0 + 1; }
        else if (ins >= 0xB8 && ins <= 0xBF) // PUSHW
            { ip += (ins - 0xB8 + 1) * 2; }
        else if (handleElse && nesting === 1 && ins === 0x1B) // ELSE
            { break; }
    } while (nesting > 0);

    state.ip = ip;
}

/*----------------------------------------------------------*
*          And then a lot of instructions...                *
*----------------------------------------------------------*/

// SVTCA[a] Set freedom and projection Vectors To Coordinate Axis
// 0x00-0x01
function SVTCA(v, state) {
    if (exports.DEBUG) { console.log(state.step, 'SVTCA[' + v.axis + ']'); }

    state.fv = state.pv = state.dpv = v;
}

// SPVTCA[a] Set Projection Vector to Coordinate Axis
// 0x02-0x03
function SPVTCA(v, state) {
    if (exports.DEBUG) { console.log(state.step, 'SPVTCA[' + v.axis + ']'); }

    state.pv = state.dpv = v;
}

// SFVTCA[a] Set Freedom Vector to Coordinate Axis
// 0x04-0x05
function SFVTCA(v, state) {
    if (exports.DEBUG) { console.log(state.step, 'SFVTCA[' + v.axis + ']'); }

    state.fv = v;
}

// SPVTL[a] Set Projection Vector To Line
// 0x06-0x07
function SPVTL(a, state) {
    var stack = state.stack;
    var p2i = stack.pop();
    var p1i = stack.pop();
    var p2 = state.z2[p2i];
    var p1 = state.z1[p1i];

    if (exports.DEBUG) { console.log('SPVTL[' + a + ']', p2i, p1i); }

    var dx;
    var dy;

    if (!a) {
        dx = p1.x - p2.x;
        dy = p1.y - p2.y;
    } else {
        dx = p2.y - p1.y;
        dy = p1.x - p2.x;
    }

    state.pv = state.dpv = getUnitVector(dx, dy);
}

// SFVTL[a] Set Freedom Vector To Line
// 0x08-0x09
function SFVTL(a, state) {
    var stack = state.stack;
    var p2i = stack.pop();
    var p1i = stack.pop();
    var p2 = state.z2[p2i];
    var p1 = state.z1[p1i];

    if (exports.DEBUG) { console.log('SFVTL[' + a + ']', p2i, p1i); }

    var dx;
    var dy;

    if (!a) {
        dx = p1.x - p2.x;
        dy = p1.y - p2.y;
    } else {
        dx = p2.y - p1.y;
        dy = p1.x - p2.x;
    }

    state.fv = getUnitVector(dx, dy);
}

// SPVFS[] Set Projection Vector From Stack
// 0x0A
function SPVFS(state) {
    var stack = state.stack;
    var y = stack.pop();
    var x = stack.pop();

    if (exports.DEBUG) { console.log(state.step, 'SPVFS[]', y, x); }

    state.pv = state.dpv = getUnitVector(x, y);
}

// SFVFS[] Set Freedom Vector From Stack
// 0x0B
function SFVFS(state) {
    var stack = state.stack;
    var y = stack.pop();
    var x = stack.pop();

    if (exports.DEBUG) { console.log(state.step, 'SPVFS[]', y, x); }

    state.fv = getUnitVector(x, y);
}

// GPV[] Get Projection Vector
// 0x0C
function GPV(state) {
    var stack = state.stack;
    var pv = state.pv;

    if (exports.DEBUG) { console.log(state.step, 'GPV[]'); }

    stack.push(pv.x * 0x4000);
    stack.push(pv.y * 0x4000);
}

// GFV[] Get Freedom Vector
// 0x0C
function GFV(state) {
    var stack = state.stack;
    var fv = state.fv;

    if (exports.DEBUG) { console.log(state.step, 'GFV[]'); }

    stack.push(fv.x * 0x4000);
    stack.push(fv.y * 0x4000);
}

// SFVTPV[] Set Freedom Vector To Projection Vector
// 0x0E
function SFVTPV(state) {
    state.fv = state.pv;

    if (exports.DEBUG) { console.log(state.step, 'SFVTPV[]'); }
}

// ISECT[] moves point p to the InterSECTion of two lines
// 0x0F
function ISECT(state)
{
    var stack = state.stack;
    var pa0i = stack.pop();
    var pa1i = stack.pop();
    var pb0i = stack.pop();
    var pb1i = stack.pop();
    var pi = stack.pop();
    var z0 = state.z0;
    var z1 = state.z1;
    var pa0 = z0[pa0i];
    var pa1 = z0[pa1i];
    var pb0 = z1[pb0i];
    var pb1 = z1[pb1i];
    var p = state.z2[pi];

    if (exports.DEBUG) { console.log('ISECT[], ', pa0i, pa1i, pb0i, pb1i, pi); }

    // math from
    // en.wikipedia.org/wiki/Line%E2%80%93line_intersection#Given_two_points_on_each_line

    var x1 = pa0.x;
    var y1 = pa0.y;
    var x2 = pa1.x;
    var y2 = pa1.y;
    var x3 = pb0.x;
    var y3 = pb0.y;
    var x4 = pb1.x;
    var y4 = pb1.y;

    var div = (x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4);
    var f1 = x1 * y2 - y1 * x2;
    var f2 = x3 * y4 - y3 * x4;

    p.x = (f1 * (x3 - x4) - f2 * (x1 - x2)) / div;
    p.y = (f1 * (y3 - y4) - f2 * (y1 - y2)) / div;
}

// SRP0[] Set Reference Point 0
// 0x10
function SRP0(state) {
    state.rp0 = state.stack.pop();

    if (exports.DEBUG) { console.log(state.step, 'SRP0[]', state.rp0); }
}

// SRP1[] Set Reference Point 1
// 0x11
function SRP1(state) {
    state.rp1 = state.stack.pop();

    if (exports.DEBUG) { console.log(state.step, 'SRP1[]', state.rp1); }
}

// SRP1[] Set Reference Point 2
// 0x12
function SRP2(state) {
    state.rp2 = state.stack.pop();

    if (exports.DEBUG) { console.log(state.step, 'SRP2[]', state.rp2); }
}

// SZP0[] Set Zone Pointer 0
// 0x13
function SZP0(state) {
    var n = state.stack.pop();

    if (exports.DEBUG) { console.log(state.step, 'SZP0[]', n); }

    state.zp0 = n;

    switch (n) {
        case 0:
            if (!state.tZone) { initTZone(state); }
            state.z0 = state.tZone;
            break;
        case 1 :
            state.z0 = state.gZone;
            break;
        default :
            throw new Error('Invalid zone pointer');
    }
}

// SZP1[] Set Zone Pointer 1
// 0x14
function SZP1(state) {
    var n = state.stack.pop();

    if (exports.DEBUG) { console.log(state.step, 'SZP1[]', n); }

    state.zp1 = n;

    switch (n) {
        case 0:
            if (!state.tZone) { initTZone(state); }
            state.z1 = state.tZone;
            break;
        case 1 :
            state.z1 = state.gZone;
            break;
        default :
            throw new Error('Invalid zone pointer');
    }
}

// SZP2[] Set Zone Pointer 2
// 0x15
function SZP2(state) {
    var n = state.stack.pop();

    if (exports.DEBUG) { console.log(state.step, 'SZP2[]', n); }

    state.zp2 = n;

    switch (n) {
        case 0:
            if (!state.tZone) { initTZone(state); }
            state.z2 = state.tZone;
            break;
        case 1 :
            state.z2 = state.gZone;
            break;
        default :
            throw new Error('Invalid zone pointer');
    }
}

// SZPS[] Set Zone PointerS
// 0x16
function SZPS(state) {
    var n = state.stack.pop();

    if (exports.DEBUG) { console.log(state.step, 'SZPS[]', n); }

    state.zp0 = state.zp1 = state.zp2 = n;

    switch (n) {
        case 0:
            if (!state.tZone) { initTZone(state); }
            state.z0 = state.z1 = state.z2 = state.tZone;
            break;
        case 1 :
            state.z0 = state.z1 = state.z2 = state.gZone;
            break;
        default :
            throw new Error('Invalid zone pointer');
    }
}

// SLOOP[] Set LOOP variable
// 0x17
function SLOOP(state) {
    state.loop = state.stack.pop();

    if (exports.DEBUG) { console.log(state.step, 'SLOOP[]', state.loop); }
}

// RTG[] Round To Grid
// 0x18
function RTG(state) {
    if (exports.DEBUG) { console.log(state.step, 'RTG[]'); }

    state.round = roundToGrid;
}

// RTHG[] Round To Half Grid
// 0x19
function RTHG(state) {
    if (exports.DEBUG) { console.log(state.step, 'RTHG[]'); }

    state.round = roundToHalfGrid;
}

// SMD[] Set Minimum Distance
// 0x1A
function SMD(state) {
    var d = state.stack.pop();

    if (exports.DEBUG) { console.log(state.step, 'SMD[]', d); }

    state.minDis = d / 0x40;
}

// ELSE[] ELSE clause
// 0x1B
function ELSE(state) {
    // This instruction has been reached by executing a then branch
    // so it just skips ahead until matching EIF.
    //
    // In case the IF was negative the IF[] instruction already
    // skipped forward over the ELSE[]

    if (exports.DEBUG) { console.log(state.step, 'ELSE[]'); }

    skip(state, false);
}

// JMPR[] JuMP Relative
// 0x1C
function JMPR(state) {
    var o = state.stack.pop();

    if (exports.DEBUG) { console.log(state.step, 'JMPR[]', o); }

    // A jump by 1 would do nothing.
    state.ip += o - 1;
}

// SCVTCI[] Set Control Value Table Cut-In
// 0x1D
function SCVTCI(state) {
    var n = state.stack.pop();

    if (exports.DEBUG) { console.log(state.step, 'SCVTCI[]', n); }

    state.cvCutIn = n / 0x40;
}

// DUP[] DUPlicate top stack element
// 0x20
function DUP(state) {
    var stack = state.stack;

    if (exports.DEBUG) { console.log(state.step, 'DUP[]'); }

    stack.push(stack[stack.length - 1]);
}

// POP[] POP top stack element
// 0x21
function POP(state) {
    if (exports.DEBUG) { console.log(state.step, 'POP[]'); }

    state.stack.pop();
}

// CLEAR[] CLEAR the stack
// 0x22
function CLEAR(state) {
    if (exports.DEBUG) { console.log(state.step, 'CLEAR[]'); }

    state.stack.length = 0;
}

// SWAP[] SWAP the top two elements on the stack
// 0x23
function SWAP(state) {
    var stack = state.stack;

    var a = stack.pop();
    var b = stack.pop();

    if (exports.DEBUG) { console.log(state.step, 'SWAP[]'); }

    stack.push(a);
    stack.push(b);
}

// DEPTH[] DEPTH of the stack
// 0x24
function DEPTH(state) {
    var stack = state.stack;

    if (exports.DEBUG) { console.log(state.step, 'DEPTH[]'); }

    stack.push(stack.length);
}

// LOOPCALL[] LOOPCALL function
// 0x2A
function LOOPCALL(state) {
    var stack = state.stack;
    var fn = stack.pop();
    var c = stack.pop();

    if (exports.DEBUG) { console.log(state.step, 'LOOPCALL[]', fn, c); }

    // saves callers program
    var cip = state.ip;
    var cprog = state.prog;

    state.prog = state.funcs[fn];

    // executes the function
    for (var i = 0; i < c; i++) {
        exec(state);

        if (exports.DEBUG) { console.log(
            ++state.step,
            i + 1 < c ? 'next loopcall' : 'done loopcall',
            i
        ); }
    }

    // restores the callers program
    state.ip = cip;
    state.prog = cprog;
}

// CALL[] CALL function
// 0x2B
function CALL(state) {
    var fn = state.stack.pop();

    if (exports.DEBUG) { console.log(state.step, 'CALL[]', fn); }

    // saves callers program
    var cip = state.ip;
    var cprog = state.prog;

    state.prog = state.funcs[fn];

    // executes the function
    exec(state);

    // restores the callers program
    state.ip = cip;
    state.prog = cprog;

    if (exports.DEBUG) { console.log(++state.step, 'returning from', fn); }
}

// CINDEX[] Copy the INDEXed element to the top of the stack
// 0x25
function CINDEX(state) {
    var stack = state.stack;
    var k = stack.pop();

    if (exports.DEBUG) { console.log(state.step, 'CINDEX[]', k); }

    // In case of k == 1, it copies the last element after popping
    // thus stack.length - k.
    stack.push(stack[stack.length - k]);
}

// MINDEX[] Move the INDEXed element to the top of the stack
// 0x26
function MINDEX(state) {
    var stack = state.stack;
    var k = stack.pop();

    if (exports.DEBUG) { console.log(state.step, 'MINDEX[]', k); }

    stack.push(stack.splice(stack.length - k, 1)[0]);
}

// FDEF[] Function DEFinition
// 0x2C
function FDEF(state) {
    if (state.env !== 'fpgm') { throw new Error('FDEF not allowed here'); }
    var stack = state.stack;
    var prog = state.prog;
    var ip = state.ip;

    var fn = stack.pop();
    var ipBegin = ip;

    if (exports.DEBUG) { console.log(state.step, 'FDEF[]', fn); }

    while (prog[++ip] !== 0x2D){ }

    state.ip = ip;
    state.funcs[fn] = prog.slice(ipBegin + 1, ip);
}

// MDAP[a] Move Direct Absolute Point
// 0x2E-0x2F
function MDAP(round, state) {
    var pi = state.stack.pop();
    var p = state.z0[pi];
    var fv = state.fv;
    var pv = state.pv;

    if (exports.DEBUG) { console.log(state.step, 'MDAP[' + round + ']', pi); }

    var d = pv.distance(p, HPZero);

    if (round) { d = state.round(d); }

    fv.setRelative(p, HPZero, d, pv);
    fv.touch(p);

    state.rp0 = state.rp1 = pi;
}

// IUP[a] Interpolate Untouched Points through the outline
// 0x30
function IUP(v, state) {
    var z2 = state.z2;
    var pLen = z2.length - 2;
    var cp;
    var pp;
    var np;

    if (exports.DEBUG) { console.log(state.step, 'IUP[' + v.axis + ']'); }

    for (var i = 0; i < pLen; i++) {
        cp = z2[i]; // current point

        // if this point has been touched go on
        if (v.touched(cp)) { continue; }

        pp = cp.prevTouched(v);

        // no point on the contour has been touched?
        if (pp === cp) { continue; }

        np = cp.nextTouched(v);

        if (pp === np) {
            // only one point on the contour has been touched
            // so simply moves the point like that

            v.setRelative(cp, cp, v.distance(pp, pp, false, true), v, true);
        }

        v.interpolate(cp, pp, np, v);
    }
}

// SHP[] SHift Point using reference point
// 0x32-0x33
function SHP(a, state) {
    var stack = state.stack;
    var rpi = a ? state.rp1 : state.rp2;
    var rp = (a ? state.z0 : state.z1)[rpi];
    var fv = state.fv;
    var pv = state.pv;
    var loop = state.loop;
    var z2 = state.z2;

    while (loop--)
    {
        var pi = stack.pop();
        var p = z2[pi];

        var d = pv.distance(rp, rp, false, true);
        fv.setRelative(p, p, d, pv);
        fv.touch(p);

        if (exports.DEBUG) {
            console.log(
                state.step,
                (state.loop > 1 ?
                   'loop ' + (state.loop - loop) + ': ' :
                   ''
                ) +
                'SHP[' + (a ? 'rp1' : 'rp2') + ']', pi
            );
        }
    }

    state.loop = 1;
}

// SHC[] SHift Contour using reference point
// 0x36-0x37
function SHC(a, state) {
    var stack = state.stack;
    var rpi = a ? state.rp1 : state.rp2;
    var rp = (a ? state.z0 : state.z1)[rpi];
    var fv = state.fv;
    var pv = state.pv;
    var ci = stack.pop();
    var sp = state.z2[state.contours[ci]];
    var p = sp;

    if (exports.DEBUG) { console.log(state.step, 'SHC[' + a + ']', ci); }

    var d = pv.distance(rp, rp, false, true);

    do {
        if (p !== rp) { fv.setRelative(p, p, d, pv); }
        p = p.nextPointOnContour;
    } while (p !== sp);
}

// SHZ[] SHift Zone using reference point
// 0x36-0x37
function SHZ(a, state) {
    var stack = state.stack;
    var rpi = a ? state.rp1 : state.rp2;
    var rp = (a ? state.z0 : state.z1)[rpi];
    var fv = state.fv;
    var pv = state.pv;

    var e = stack.pop();

    if (exports.DEBUG) { console.log(state.step, 'SHZ[' + a + ']', e); }

    var z;
    switch (e) {
        case 0 : z = state.tZone; break;
        case 1 : z = state.gZone; break;
        default : throw new Error('Invalid zone');
    }

    var p;
    var d = pv.distance(rp, rp, false, true);
    var pLen = z.length - 2;
    for (var i = 0; i < pLen; i++)
    {
        p = z[i];
        fv.setRelative(p, p, d, pv);
        //if (p !== rp) fv.setRelative(p, p, d, pv);
    }
}

// SHPIX[] SHift point by a PIXel amount
// 0x38
function SHPIX(state) {
    var stack = state.stack;
    var loop = state.loop;
    var fv = state.fv;
    var d = stack.pop() / 0x40;
    var z2 = state.z2;

    while (loop--) {
        var pi = stack.pop();
        var p = z2[pi];

        if (exports.DEBUG) {
            console.log(
                state.step,
                (state.loop > 1 ? 'loop ' + (state.loop - loop) + ': ' : '') +
                'SHPIX[]', pi, d
            );
        }

        fv.setRelative(p, p, d);
        fv.touch(p);
    }

    state.loop = 1;
}

// IP[] Interpolate Point
// 0x39
function IP(state) {
    var stack = state.stack;
    var rp1i = state.rp1;
    var rp2i = state.rp2;
    var loop = state.loop;
    var rp1 = state.z0[rp1i];
    var rp2 = state.z1[rp2i];
    var fv = state.fv;
    var pv = state.dpv;
    var z2 = state.z2;

    while (loop--) {
        var pi = stack.pop();
        var p = z2[pi];

        if (exports.DEBUG) {
            console.log(
                state.step,
                (state.loop > 1 ? 'loop ' + (state.loop - loop) + ': ' : '') +
                'IP[]', pi, rp1i, '<->', rp2i
            );
        }

        fv.interpolate(p, rp1, rp2, pv);

        fv.touch(p);
    }

    state.loop = 1;
}

// MSIRP[a] Move Stack Indirect Relative Point
// 0x3A-0x3B
function MSIRP(a, state) {
    var stack = state.stack;
    var d = stack.pop() / 64;
    var pi = stack.pop();
    var p = state.z1[pi];
    var rp0 = state.z0[state.rp0];
    var fv = state.fv;
    var pv = state.pv;

    fv.setRelative(p, rp0, d, pv);
    fv.touch(p);

    if (exports.DEBUG) { console.log(state.step, 'MSIRP[' + a + ']', d, pi); }

    state.rp1 = state.rp0;
    state.rp2 = pi;
    if (a) { state.rp0 = pi; }
}

// ALIGNRP[] Align to reference point.
// 0x3C
function ALIGNRP(state) {
    var stack = state.stack;
    var rp0i = state.rp0;
    var rp0 = state.z0[rp0i];
    var loop = state.loop;
    var fv = state.fv;
    var pv = state.pv;
    var z1 = state.z1;

    while (loop--) {
        var pi = stack.pop();
        var p = z1[pi];

        if (exports.DEBUG) {
            console.log(
                state.step,
                (state.loop > 1 ? 'loop ' + (state.loop - loop) + ': ' : '') +
                'ALIGNRP[]', pi
            );
        }

        fv.setRelative(p, rp0, 0, pv);
        fv.touch(p);
    }

    state.loop = 1;
}

// RTG[] Round To Double Grid
// 0x3D
function RTDG(state) {
    if (exports.DEBUG) { console.log(state.step, 'RTDG[]'); }

    state.round = roundToDoubleGrid;
}

// MIAP[a] Move Indirect Absolute Point
// 0x3E-0x3F
function MIAP(round, state) {
    var stack = state.stack;
    var n = stack.pop();
    var pi = stack.pop();
    var p = state.z0[pi];
    var fv = state.fv;
    var pv = state.pv;
    var cv = state.cvt[n];

    if (exports.DEBUG) {
        console.log(
            state.step,
            'MIAP[' + round + ']',
            n, '(', cv, ')', pi
        );
    }

    var d = pv.distance(p, HPZero);

    if (round) {
        if (Math.abs(d - cv) < state.cvCutIn) { d = cv; }

        d = state.round(d);
    }

    fv.setRelative(p, HPZero, d, pv);

    if (state.zp0 === 0) {
        p.xo = p.x;
        p.yo = p.y;
    }

    fv.touch(p);

    state.rp0 = state.rp1 = pi;
}

// NPUSB[] PUSH N Bytes
// 0x40
function NPUSHB(state) {
    var prog = state.prog;
    var ip = state.ip;
    var stack = state.stack;

    var n = prog[++ip];

    if (exports.DEBUG) { console.log(state.step, 'NPUSHB[]', n); }

    for (var i = 0; i < n; i++) { stack.push(prog[++ip]); }

    state.ip = ip;
}

// NPUSHW[] PUSH N Words
// 0x41
function NPUSHW(state) {
    var ip = state.ip;
    var prog = state.prog;
    var stack = state.stack;
    var n = prog[++ip];

    if (exports.DEBUG) { console.log(state.step, 'NPUSHW[]', n); }

    for (var i = 0; i < n; i++) {
        var w = (prog[++ip] << 8) | prog[++ip];
        if (w & 0x8000) { w = -((w ^ 0xffff) + 1); }
        stack.push(w);
    }

    state.ip = ip;
}

// WS[] Write Store
// 0x42
function WS(state) {
    var stack = state.stack;
    var store = state.store;

    if (!store) { store = state.store = []; }

    var v = stack.pop();
    var l = stack.pop();

    if (exports.DEBUG) { console.log(state.step, 'WS', v, l); }

    store[l] = v;
}

// RS[] Read Store
// 0x43
function RS(state) {
    var stack = state.stack;
    var store = state.store;

    var l = stack.pop();

    if (exports.DEBUG) { console.log(state.step, 'RS', l); }

    var v = (store && store[l]) || 0;

    stack.push(v);
}

// WCVTP[] Write Control Value Table in Pixel units
// 0x44
function WCVTP(state) {
    var stack = state.stack;

    var v = stack.pop();
    var l = stack.pop();

    if (exports.DEBUG) { console.log(state.step, 'WCVTP', v, l); }

    state.cvt[l] = v / 0x40;
}

// RCVT[] Read Control Value Table entry
// 0x45
function RCVT(state) {
    var stack = state.stack;
    var cvte = stack.pop();

    if (exports.DEBUG) { console.log(state.step, 'RCVT', cvte); }

    stack.push(state.cvt[cvte] * 0x40);
}

// GC[] Get Coordinate projected onto the projection vector
// 0x46-0x47
function GC(a, state) {
    var stack = state.stack;
    var pi = stack.pop();
    var p = state.z2[pi];

    if (exports.DEBUG) { console.log(state.step, 'GC[' + a + ']', pi); }

    stack.push(state.dpv.distance(p, HPZero, a, false) * 0x40);
}

// MD[a] Measure Distance
// 0x49-0x4A
function MD(a, state) {
    var stack = state.stack;
    var pi2 = stack.pop();
    var pi1 = stack.pop();
    var p2 = state.z1[pi2];
    var p1 = state.z0[pi1];
    var d = state.dpv.distance(p1, p2, a, a);

    if (exports.DEBUG) { console.log(state.step, 'MD[' + a + ']', pi2, pi1, '->', d); }

    state.stack.push(Math.round(d * 64));
}

// MPPEM[] Measure Pixels Per EM
// 0x4B
function MPPEM(state) {
    if (exports.DEBUG) { console.log(state.step, 'MPPEM[]'); }
    state.stack.push(state.ppem);
}

// FLIPON[] set the auto FLIP Boolean to ON
// 0x4D
function FLIPON(state) {
    if (exports.DEBUG) { console.log(state.step, 'FLIPON[]'); }
    state.autoFlip = true;
}

// LT[] Less Than
// 0x50
function LT(state) {
    var stack = state.stack;
    var e2 = stack.pop();
    var e1 = stack.pop();

    if (exports.DEBUG) { console.log(state.step, 'LT[]', e2, e1); }

    stack.push(e1 < e2 ? 1 : 0);
}

// LTEQ[] Less Than or EQual
// 0x53
function LTEQ(state) {
    var stack = state.stack;
    var e2 = stack.pop();
    var e1 = stack.pop();

    if (exports.DEBUG) { console.log(state.step, 'LTEQ[]', e2, e1); }

    stack.push(e1 <= e2 ? 1 : 0);
}

// GTEQ[] Greater Than
// 0x52
function GT(state) {
    var stack = state.stack;
    var e2 = stack.pop();
    var e1 = stack.pop();

    if (exports.DEBUG) { console.log(state.step, 'GT[]', e2, e1); }

    stack.push(e1 > e2 ? 1 : 0);
}

// GTEQ[] Greater Than or EQual
// 0x53
function GTEQ(state) {
    var stack = state.stack;
    var e2 = stack.pop();
    var e1 = stack.pop();

    if (exports.DEBUG) { console.log(state.step, 'GTEQ[]', e2, e1); }

    stack.push(e1 >= e2 ? 1 : 0);
}

// EQ[] EQual
// 0x54
function EQ(state) {
    var stack = state.stack;
    var e2 = stack.pop();
    var e1 = stack.pop();

    if (exports.DEBUG) { console.log(state.step, 'EQ[]', e2, e1); }

    stack.push(e2 === e1 ? 1 : 0);
}

// NEQ[] Not EQual
// 0x55
function NEQ(state) {
    var stack = state.stack;
    var e2 = stack.pop();
    var e1 = stack.pop();

    if (exports.DEBUG) { console.log(state.step, 'NEQ[]', e2, e1); }

    stack.push(e2 !== e1 ? 1 : 0);
}

// ODD[] ODD
// 0x56
function ODD(state) {
    var stack = state.stack;
    var n = stack.pop();

    if (exports.DEBUG) { console.log(state.step, 'ODD[]', n); }

    stack.push(Math.trunc(n) % 2 ? 1 : 0);
}

// EVEN[] EVEN
// 0x57
function EVEN(state) {
    var stack = state.stack;
    var n = stack.pop();

    if (exports.DEBUG) { console.log(state.step, 'EVEN[]', n); }

    stack.push(Math.trunc(n) % 2 ? 0 : 1);
}

// IF[] IF test
// 0x58
function IF(state) {
    var test = state.stack.pop();

    if (exports.DEBUG) { console.log(state.step, 'IF[]', test); }

    // if test is true it just continues
    // if not the ip is skipped until matching ELSE or EIF
    if (!test) {
        skip(state, true);

        if (exports.DEBUG) { console.log(state.step,  'EIF[]'); }
    }
}

// EIF[] End IF
// 0x59
function EIF(state) {
    // this can be reached normally when
    // executing an else branch.
    // -> just ignore it

    if (exports.DEBUG) { console.log(state.step, 'EIF[]'); }
}

// AND[] logical AND
// 0x5A
function AND(state) {
    var stack = state.stack;
    var e2 = stack.pop();
    var e1 = stack.pop();

    if (exports.DEBUG) { console.log(state.step, 'AND[]', e2, e1); }

    stack.push(e2 && e1 ? 1 : 0);
}

// OR[] logical OR
// 0x5B
function OR(state) {
    var stack = state.stack;
    var e2 = stack.pop();
    var e1 = stack.pop();

    if (exports.DEBUG) { console.log(state.step, 'OR[]', e2, e1); }

    stack.push(e2 || e1 ? 1 : 0);
}

// NOT[] logical NOT
// 0x5C
function NOT(state) {
    var stack = state.stack;
    var e = stack.pop();

    if (exports.DEBUG) { console.log(state.step, 'NOT[]', e); }

    stack.push(e ? 0 : 1);
}

// DELTAP1[] DELTA exception P1
// DELTAP2[] DELTA exception P2
// DELTAP3[] DELTA exception P3
// 0x5D, 0x71, 0x72
function DELTAP123(b, state) {
    var stack = state.stack;
    var n = stack.pop();
    var fv = state.fv;
    var pv = state.pv;
    var ppem = state.ppem;
    var base = state.deltaBase + (b - 1) * 16;
    var ds = state.deltaShift;
    var z0 = state.z0;

    if (exports.DEBUG) { console.log(state.step, 'DELTAP[' + b + ']', n, stack); }

    for (var i = 0; i < n; i++) {
        var pi = stack.pop();
        var arg = stack.pop();
        var appem = base + ((arg & 0xF0) >> 4);
        if (appem !== ppem) { continue; }

        var mag = (arg & 0x0F) - 8;
        if (mag >= 0) { mag++; }
        if (exports.DEBUG) { console.log(state.step, 'DELTAPFIX', pi, 'by', mag * ds); }

        var p = z0[pi];
        fv.setRelative(p, p, mag * ds, pv);
    }
}

// SDB[] Set Delta Base in the graphics state
// 0x5E
function SDB(state) {
    var stack = state.stack;
    var n = stack.pop();

    if (exports.DEBUG) { console.log(state.step, 'SDB[]', n); }

    state.deltaBase = n;
}

// SDS[] Set Delta Shift in the graphics state
// 0x5F
function SDS(state) {
    var stack = state.stack;
    var n = stack.pop();

    if (exports.DEBUG) { console.log(state.step, 'SDS[]', n); }

    state.deltaShift = Math.pow(0.5, n);
}

// ADD[] ADD
// 0x60
function ADD(state) {
    var stack = state.stack;
    var n2 = stack.pop();
    var n1 = stack.pop();

    if (exports.DEBUG) { console.log(state.step, 'ADD[]', n2, n1); }

    stack.push(n1 + n2);
}

// SUB[] SUB
// 0x61
function SUB(state) {
    var stack = state.stack;
    var n2 = stack.pop();
    var n1 = stack.pop();

    if (exports.DEBUG) { console.log(state.step, 'SUB[]', n2, n1); }

    stack.push(n1 - n2);
}

// DIV[] DIV
// 0x62
function DIV(state) {
    var stack = state.stack;
    var n2 = stack.pop();
    var n1 = stack.pop();

    if (exports.DEBUG) { console.log(state.step, 'DIV[]', n2, n1); }

    stack.push(n1 * 64 / n2);
}

// MUL[] MUL
// 0x63
function MUL(state) {
    var stack = state.stack;
    var n2 = stack.pop();
    var n1 = stack.pop();

    if (exports.DEBUG) { console.log(state.step, 'MUL[]', n2, n1); }

    stack.push(n1 * n2 / 64);
}

// ABS[] ABSolute value
// 0x64
function ABS(state) {
    var stack = state.stack;
    var n = stack.pop();

    if (exports.DEBUG) { console.log(state.step, 'ABS[]', n); }

    stack.push(Math.abs(n));
}

// NEG[] NEGate
// 0x65
function NEG(state) {
    var stack = state.stack;
    var n = stack.pop();

    if (exports.DEBUG) { console.log(state.step, 'NEG[]', n); }

    stack.push(-n);
}

// FLOOR[] FLOOR
// 0x66
function FLOOR(state) {
    var stack = state.stack;
    var n = stack.pop();

    if (exports.DEBUG) { console.log(state.step, 'FLOOR[]', n); }

    stack.push(Math.floor(n / 0x40) * 0x40);
}

// CEILING[] CEILING
// 0x67
function CEILING(state) {
    var stack = state.stack;
    var n = stack.pop();

    if (exports.DEBUG) { console.log(state.step, 'CEILING[]', n); }

    stack.push(Math.ceil(n / 0x40) * 0x40);
}

// ROUND[ab] ROUND value
// 0x68-0x6B
function ROUND(dt, state) {
    var stack = state.stack;
    var n = stack.pop();

    if (exports.DEBUG) { console.log(state.step, 'ROUND[]'); }

    stack.push(state.round(n / 0x40) * 0x40);
}

// WCVTF[] Write Control Value Table in Funits
// 0x70
function WCVTF(state) {
    var stack = state.stack;
    var v = stack.pop();
    var l = stack.pop();

    if (exports.DEBUG) { console.log(state.step, 'WCVTF[]', v, l); }

    state.cvt[l] = v * state.ppem / state.font.unitsPerEm;
}

// DELTAC1[] DELTA exception C1
// DELTAC2[] DELTA exception C2
// DELTAC3[] DELTA exception C3
// 0x73, 0x74, 0x75
function DELTAC123(b, state) {
    var stack = state.stack;
    var n = stack.pop();
    var ppem = state.ppem;
    var base = state.deltaBase + (b - 1) * 16;
    var ds = state.deltaShift;

    if (exports.DEBUG) { console.log(state.step, 'DELTAC[' + b + ']', n, stack); }

    for (var i = 0; i < n; i++) {
        var c = stack.pop();
        var arg = stack.pop();
        var appem = base + ((arg & 0xF0) >> 4);
        if (appem !== ppem) { continue; }

        var mag = (arg & 0x0F) - 8;
        if (mag >= 0) { mag++; }

        var delta = mag * ds;

        if (exports.DEBUG) { console.log(state.step, 'DELTACFIX', c, 'by', delta); }

        state.cvt[c] += delta;
    }
}

// SROUND[] Super ROUND
// 0x76
function SROUND(state) {
    var n = state.stack.pop();

    if (exports.DEBUG) { console.log(state.step, 'SROUND[]', n); }

    state.round = roundSuper;

    var period;

    switch (n & 0xC0) {
        case 0x00:
            period = 0.5;
            break;
        case 0x40:
            period = 1;
            break;
        case 0x80:
            period = 2;
            break;
        default:
            throw new Error('invalid SROUND value');
    }

    state.srPeriod = period;

    switch (n & 0x30) {
        case 0x00:
            state.srPhase = 0;
            break;
        case 0x10:
            state.srPhase = 0.25 * period;
            break;
        case 0x20:
            state.srPhase = 0.5  * period;
            break;
        case 0x30:
            state.srPhase = 0.75 * period;
            break;
        default: throw new Error('invalid SROUND value');
    }

    n &= 0x0F;

    if (n === 0) { state.srThreshold = 0; }
    else { state.srThreshold = (n / 8 - 0.5) * period; }
}

// S45ROUND[] Super ROUND 45 degrees
// 0x77
function S45ROUND(state) {
    var n = state.stack.pop();

    if (exports.DEBUG) { console.log(state.step, 'S45ROUND[]', n); }

    state.round = roundSuper;

    var period;

    switch (n & 0xC0) {
        case 0x00:
            period = Math.sqrt(2) / 2;
            break;
        case 0x40:
            period = Math.sqrt(2);
            break;
        case 0x80:
            period = 2 * Math.sqrt(2);
            break;
        default:
            throw new Error('invalid S45ROUND value');
    }

    state.srPeriod = period;

    switch (n & 0x30) {
        case 0x00:
            state.srPhase = 0;
            break;
        case 0x10:
            state.srPhase = 0.25 * period;
            break;
        case 0x20:
            state.srPhase = 0.5  * period;
            break;
        case 0x30:
            state.srPhase = 0.75 * period;
            break;
        default:
            throw new Error('invalid S45ROUND value');
    }

    n &= 0x0F;

    if (n === 0) { state.srThreshold = 0; }
    else { state.srThreshold = (n / 8 - 0.5) * period; }
}

// ROFF[] Round Off
// 0x7A
function ROFF(state) {
    if (exports.DEBUG) { console.log(state.step, 'ROFF[]'); }

    state.round = roundOff;
}

// RUTG[] Round Up To Grid
// 0x7C
function RUTG(state) {
    if (exports.DEBUG) { console.log(state.step, 'RUTG[]'); }

    state.round = roundUpToGrid;
}

// RDTG[] Round Down To Grid
// 0x7D
function RDTG(state) {
    if (exports.DEBUG) { console.log(state.step, 'RDTG[]'); }

    state.round = roundDownToGrid;
}

// SCANCTRL[] SCAN conversion ConTRoL
// 0x85
function SCANCTRL(state) {
    var n = state.stack.pop();

    // ignored by opentype.js

    if (exports.DEBUG) { console.log(state.step, 'SCANCTRL[]', n); }
}

// SDPVTL[a] Set Dual Projection Vector To Line
// 0x86-0x87
function SDPVTL(a, state) {
    var stack = state.stack;
    var p2i = stack.pop();
    var p1i = stack.pop();
    var p2 = state.z2[p2i];
    var p1 = state.z1[p1i];

    if (exports.DEBUG) { console.log(state.step, 'SDPVTL[' + a + ']', p2i, p1i); }

    var dx;
    var dy;

    if (!a) {
        dx = p1.x - p2.x;
        dy = p1.y - p2.y;
    } else {
        dx = p2.y - p1.y;
        dy = p1.x - p2.x;
    }

    state.dpv = getUnitVector(dx, dy);
}

// GETINFO[] GET INFOrmation
// 0x88
function GETINFO(state) {
    var stack = state.stack;
    var sel = stack.pop();
    var r = 0;

    if (exports.DEBUG) { console.log(state.step, 'GETINFO[]', sel); }

    // v35 as in no subpixel hinting
    if (sel & 0x01) { r = 35; }

    // TODO rotation and stretch currently not supported
    // and thus those GETINFO are always 0.

    // opentype.js is always gray scaling
    if (sel & 0x20) { r |= 0x1000; }

    stack.push(r);
}

// ROLL[] ROLL the top three stack elements
// 0x8A
function ROLL(state) {
    var stack = state.stack;
    var a = stack.pop();
    var b = stack.pop();
    var c = stack.pop();

    if (exports.DEBUG) { console.log(state.step, 'ROLL[]'); }

    stack.push(b);
    stack.push(a);
    stack.push(c);
}

// MAX[] MAXimum of top two stack elements
// 0x8B
function MAX(state) {
    var stack = state.stack;
    var e2 = stack.pop();
    var e1 = stack.pop();

    if (exports.DEBUG) { console.log(state.step, 'MAX[]', e2, e1); }

    stack.push(Math.max(e1, e2));
}

// MIN[] MINimum of top two stack elements
// 0x8C
function MIN(state) {
    var stack = state.stack;
    var e2 = stack.pop();
    var e1 = stack.pop();

    if (exports.DEBUG) { console.log(state.step, 'MIN[]', e2, e1); }

    stack.push(Math.min(e1, e2));
}

// SCANTYPE[] SCANTYPE
// 0x8D
function SCANTYPE(state) {
    var n = state.stack.pop();
    // ignored by opentype.js
    if (exports.DEBUG) { console.log(state.step, 'SCANTYPE[]', n); }
}

// INSTCTRL[] INSTCTRL
// 0x8D
function INSTCTRL(state) {
    var s = state.stack.pop();
    var v = state.stack.pop();

    if (exports.DEBUG) { console.log(state.step, 'INSTCTRL[]', s, v); }

    switch (s) {
        case 1 : state.inhibitGridFit = !!v; return;
        case 2 : state.ignoreCvt = !!v; return;
        default: throw new Error('invalid INSTCTRL[] selector');
    }
}

// PUSHB[abc] PUSH Bytes
// 0xB0-0xB7
function PUSHB(n, state) {
    var stack = state.stack;
    var prog = state.prog;
    var ip = state.ip;

    if (exports.DEBUG) { console.log(state.step, 'PUSHB[' + n + ']'); }

    for (var i = 0; i < n; i++) { stack.push(prog[++ip]); }

    state.ip = ip;
}

// PUSHW[abc] PUSH Words
// 0xB8-0xBF
function PUSHW(n, state) {
    var ip = state.ip;
    var prog = state.prog;
    var stack = state.stack;

    if (exports.DEBUG) { console.log(state.ip, 'PUSHW[' + n + ']'); }

    for (var i = 0; i < n; i++) {
        var w = (prog[++ip] << 8) | prog[++ip];
        if (w & 0x8000) { w = -((w ^ 0xffff) + 1); }
        stack.push(w);
    }

    state.ip = ip;
}

// MDRP[abcde] Move Direct Relative Point
// 0xD0-0xEF
// (if indirect is 0)
//
// and
//
// MIRP[abcde] Move Indirect Relative Point
// 0xE0-0xFF
// (if indirect is 1)

function MDRP_MIRP(indirect, setRp0, keepD, ro, dt, state) {
    var stack = state.stack;
    var cvte = indirect && stack.pop();
    var pi = stack.pop();
    var rp0i = state.rp0;
    var rp = state.z0[rp0i];
    var p = state.z1[pi];

    var md = state.minDis;
    var fv = state.fv;
    var pv = state.dpv;
    var od; // original distance
    var d; // moving distance
    var sign; // sign of distance
    var cv;

    d = od = pv.distance(p, rp, true, true);
    sign = d >= 0 ? 1 : -1; // Math.sign would be 0 in case of 0

    // TODO consider autoFlip
    d = Math.abs(d);

    if (indirect) {
        cv = state.cvt[cvte];

        if (ro && Math.abs(d - cv) < state.cvCutIn) { d = cv; }
    }

    if (keepD && d < md) { d = md; }

    if (ro) { d = state.round(d); }

    fv.setRelative(p, rp, sign * d, pv);
    fv.touch(p);

    if (exports.DEBUG) {
        console.log(
            state.step,
            (indirect ? 'MIRP[' : 'MDRP[') +
            (setRp0 ? 'M' : 'm') +
            (keepD ? '>' : '_') +
            (ro ? 'R' : '_') +
            (dt === 0 ? 'Gr' : (dt === 1 ? 'Bl' : (dt === 2 ? 'Wh' : ''))) +
            ']',
            indirect ?
                cvte + '(' + state.cvt[cvte] + ',' +  cv + ')' :
                '',
            pi,
            '(d =', od, '->', sign * d, ')'
        );
    }

    state.rp1 = state.rp0;
    state.rp2 = pi;
    if (setRp0) { state.rp0 = pi; }
}

/*
* The instruction table.
*/
instructionTable = [
    /* 0x00 */ SVTCA.bind(undefined, yUnitVector),
    /* 0x01 */ SVTCA.bind(undefined, xUnitVector),
    /* 0x02 */ SPVTCA.bind(undefined, yUnitVector),
    /* 0x03 */ SPVTCA.bind(undefined, xUnitVector),
    /* 0x04 */ SFVTCA.bind(undefined, yUnitVector),
    /* 0x05 */ SFVTCA.bind(undefined, xUnitVector),
    /* 0x06 */ SPVTL.bind(undefined, 0),
    /* 0x07 */ SPVTL.bind(undefined, 1),
    /* 0x08 */ SFVTL.bind(undefined, 0),
    /* 0x09 */ SFVTL.bind(undefined, 1),
    /* 0x0A */ SPVFS,
    /* 0x0B */ SFVFS,
    /* 0x0C */ GPV,
    /* 0x0D */ GFV,
    /* 0x0E */ SFVTPV,
    /* 0x0F */ ISECT,
    /* 0x10 */ SRP0,
    /* 0x11 */ SRP1,
    /* 0x12 */ SRP2,
    /* 0x13 */ SZP0,
    /* 0x14 */ SZP1,
    /* 0x15 */ SZP2,
    /* 0x16 */ SZPS,
    /* 0x17 */ SLOOP,
    /* 0x18 */ RTG,
    /* 0x19 */ RTHG,
    /* 0x1A */ SMD,
    /* 0x1B */ ELSE,
    /* 0x1C */ JMPR,
    /* 0x1D */ SCVTCI,
    /* 0x1E */ undefined,   // TODO SSWCI
    /* 0x1F */ undefined,   // TODO SSW
    /* 0x20 */ DUP,
    /* 0x21 */ POP,
    /* 0x22 */ CLEAR,
    /* 0x23 */ SWAP,
    /* 0x24 */ DEPTH,
    /* 0x25 */ CINDEX,
    /* 0x26 */ MINDEX,
    /* 0x27 */ undefined,   // TODO ALIGNPTS
    /* 0x28 */ undefined,
    /* 0x29 */ undefined,   // TODO UTP
    /* 0x2A */ LOOPCALL,
    /* 0x2B */ CALL,
    /* 0x2C */ FDEF,
    /* 0x2D */ undefined,   // ENDF (eaten by FDEF)
    /* 0x2E */ MDAP.bind(undefined, 0),
    /* 0x2F */ MDAP.bind(undefined, 1),
    /* 0x30 */ IUP.bind(undefined, yUnitVector),
    /* 0x31 */ IUP.bind(undefined, xUnitVector),
    /* 0x32 */ SHP.bind(undefined, 0),
    /* 0x33 */ SHP.bind(undefined, 1),
    /* 0x34 */ SHC.bind(undefined, 0),
    /* 0x35 */ SHC.bind(undefined, 1),
    /* 0x36 */ SHZ.bind(undefined, 0),
    /* 0x37 */ SHZ.bind(undefined, 1),
    /* 0x38 */ SHPIX,
    /* 0x39 */ IP,
    /* 0x3A */ MSIRP.bind(undefined, 0),
    /* 0x3B */ MSIRP.bind(undefined, 1),
    /* 0x3C */ ALIGNRP,
    /* 0x3D */ RTDG,
    /* 0x3E */ MIAP.bind(undefined, 0),
    /* 0x3F */ MIAP.bind(undefined, 1),
    /* 0x40 */ NPUSHB,
    /* 0x41 */ NPUSHW,
    /* 0x42 */ WS,
    /* 0x43 */ RS,
    /* 0x44 */ WCVTP,
    /* 0x45 */ RCVT,
    /* 0x46 */ GC.bind(undefined, 0),
    /* 0x47 */ GC.bind(undefined, 1),
    /* 0x48 */ undefined,   // TODO SCFS
    /* 0x49 */ MD.bind(undefined, 0),
    /* 0x4A */ MD.bind(undefined, 1),
    /* 0x4B */ MPPEM,
    /* 0x4C */ undefined,   // TODO MPS
    /* 0x4D */ FLIPON,
    /* 0x4E */ undefined,   // TODO FLIPOFF
    /* 0x4F */ undefined,   // TODO DEBUG
    /* 0x50 */ LT,
    /* 0x51 */ LTEQ,
    /* 0x52 */ GT,
    /* 0x53 */ GTEQ,
    /* 0x54 */ EQ,
    /* 0x55 */ NEQ,
    /* 0x56 */ ODD,
    /* 0x57 */ EVEN,
    /* 0x58 */ IF,
    /* 0x59 */ EIF,
    /* 0x5A */ AND,
    /* 0x5B */ OR,
    /* 0x5C */ NOT,
    /* 0x5D */ DELTAP123.bind(undefined, 1),
    /* 0x5E */ SDB,
    /* 0x5F */ SDS,
    /* 0x60 */ ADD,
    /* 0x61 */ SUB,
    /* 0x62 */ DIV,
    /* 0x63 */ MUL,
    /* 0x64 */ ABS,
    /* 0x65 */ NEG,
    /* 0x66 */ FLOOR,
    /* 0x67 */ CEILING,
    /* 0x68 */ ROUND.bind(undefined, 0),
    /* 0x69 */ ROUND.bind(undefined, 1),
    /* 0x6A */ ROUND.bind(undefined, 2),
    /* 0x6B */ ROUND.bind(undefined, 3),
    /* 0x6C */ undefined,   // TODO NROUND[ab]
    /* 0x6D */ undefined,   // TODO NROUND[ab]
    /* 0x6E */ undefined,   // TODO NROUND[ab]
    /* 0x6F */ undefined,   // TODO NROUND[ab]
    /* 0x70 */ WCVTF,
    /* 0x71 */ DELTAP123.bind(undefined, 2),
    /* 0x72 */ DELTAP123.bind(undefined, 3),
    /* 0x73 */ DELTAC123.bind(undefined, 1),
    /* 0x74 */ DELTAC123.bind(undefined, 2),
    /* 0x75 */ DELTAC123.bind(undefined, 3),
    /* 0x76 */ SROUND,
    /* 0x77 */ S45ROUND,
    /* 0x78 */ undefined,   // TODO JROT[]
    /* 0x79 */ undefined,   // TODO JROF[]
    /* 0x7A */ ROFF,
    /* 0x7B */ undefined,
    /* 0x7C */ RUTG,
    /* 0x7D */ RDTG,
    /* 0x7E */ POP, // actually SANGW, supposed to do only a pop though
    /* 0x7F */ POP, // actually AA, supposed to do only a pop though
    /* 0x80 */ undefined,   // TODO FLIPPT
    /* 0x81 */ undefined,   // TODO FLIPRGON
    /* 0x82 */ undefined,   // TODO FLIPRGOFF
    /* 0x83 */ undefined,
    /* 0x84 */ undefined,
    /* 0x85 */ SCANCTRL,
    /* 0x86 */ SDPVTL.bind(undefined, 0),
    /* 0x87 */ SDPVTL.bind(undefined, 1),
    /* 0x88 */ GETINFO,
    /* 0x89 */ undefined,   // TODO IDEF
    /* 0x8A */ ROLL,
    /* 0x8B */ MAX,
    /* 0x8C */ MIN,
    /* 0x8D */ SCANTYPE,
    /* 0x8E */ INSTCTRL,
    /* 0x8F */ undefined,
    /* 0x90 */ undefined,
    /* 0x91 */ undefined,
    /* 0x92 */ undefined,
    /* 0x93 */ undefined,
    /* 0x94 */ undefined,
    /* 0x95 */ undefined,
    /* 0x96 */ undefined,
    /* 0x97 */ undefined,
    /* 0x98 */ undefined,
    /* 0x99 */ undefined,
    /* 0x9A */ undefined,
    /* 0x9B */ undefined,
    /* 0x9C */ undefined,
    /* 0x9D */ undefined,
    /* 0x9E */ undefined,
    /* 0x9F */ undefined,
    /* 0xA0 */ undefined,
    /* 0xA1 */ undefined,
    /* 0xA2 */ undefined,
    /* 0xA3 */ undefined,
    /* 0xA4 */ undefined,
    /* 0xA5 */ undefined,
    /* 0xA6 */ undefined,
    /* 0xA7 */ undefined,
    /* 0xA8 */ undefined,
    /* 0xA9 */ undefined,
    /* 0xAA */ undefined,
    /* 0xAB */ undefined,
    /* 0xAC */ undefined,
    /* 0xAD */ undefined,
    /* 0xAE */ undefined,
    /* 0xAF */ undefined,
    /* 0xB0 */ PUSHB.bind(undefined, 1),
    /* 0xB1 */ PUSHB.bind(undefined, 2),
    /* 0xB2 */ PUSHB.bind(undefined, 3),
    /* 0xB3 */ PUSHB.bind(undefined, 4),
    /* 0xB4 */ PUSHB.bind(undefined, 5),
    /* 0xB5 */ PUSHB.bind(undefined, 6),
    /* 0xB6 */ PUSHB.bind(undefined, 7),
    /* 0xB7 */ PUSHB.bind(undefined, 8),
    /* 0xB8 */ PUSHW.bind(undefined, 1),
    /* 0xB9 */ PUSHW.bind(undefined, 2),
    /* 0xBA */ PUSHW.bind(undefined, 3),
    /* 0xBB */ PUSHW.bind(undefined, 4),
    /* 0xBC */ PUSHW.bind(undefined, 5),
    /* 0xBD */ PUSHW.bind(undefined, 6),
    /* 0xBE */ PUSHW.bind(undefined, 7),
    /* 0xBF */ PUSHW.bind(undefined, 8),
    /* 0xC0 */ MDRP_MIRP.bind(undefined, 0, 0, 0, 0, 0),
    /* 0xC1 */ MDRP_MIRP.bind(undefined, 0, 0, 0, 0, 1),
    /* 0xC2 */ MDRP_MIRP.bind(undefined, 0, 0, 0, 0, 2),
    /* 0xC3 */ MDRP_MIRP.bind(undefined, 0, 0, 0, 0, 3),
    /* 0xC4 */ MDRP_MIRP.bind(undefined, 0, 0, 0, 1, 0),
    /* 0xC5 */ MDRP_MIRP.bind(undefined, 0, 0, 0, 1, 1),
    /* 0xC6 */ MDRP_MIRP.bind(undefined, 0, 0, 0, 1, 2),
    /* 0xC7 */ MDRP_MIRP.bind(undefined, 0, 0, 0, 1, 3),
    /* 0xC8 */ MDRP_MIRP.bind(undefined, 0, 0, 1, 0, 0),
    /* 0xC9 */ MDRP_MIRP.bind(undefined, 0, 0, 1, 0, 1),
    /* 0xCA */ MDRP_MIRP.bind(undefined, 0, 0, 1, 0, 2),
    /* 0xCB */ MDRP_MIRP.bind(undefined, 0, 0, 1, 0, 3),
    /* 0xCC */ MDRP_MIRP.bind(undefined, 0, 0, 1, 1, 0),
    /* 0xCD */ MDRP_MIRP.bind(undefined, 0, 0, 1, 1, 1),
    /* 0xCE */ MDRP_MIRP.bind(undefined, 0, 0, 1, 1, 2),
    /* 0xCF */ MDRP_MIRP.bind(undefined, 0, 0, 1, 1, 3),
    /* 0xD0 */ MDRP_MIRP.bind(undefined, 0, 1, 0, 0, 0),
    /* 0xD1 */ MDRP_MIRP.bind(undefined, 0, 1, 0, 0, 1),
    /* 0xD2 */ MDRP_MIRP.bind(undefined, 0, 1, 0, 0, 2),
    /* 0xD3 */ MDRP_MIRP.bind(undefined, 0, 1, 0, 0, 3),
    /* 0xD4 */ MDRP_MIRP.bind(undefined, 0, 1, 0, 1, 0),
    /* 0xD5 */ MDRP_MIRP.bind(undefined, 0, 1, 0, 1, 1),
    /* 0xD6 */ MDRP_MIRP.bind(undefined, 0, 1, 0, 1, 2),
    /* 0xD7 */ MDRP_MIRP.bind(undefined, 0, 1, 0, 1, 3),
    /* 0xD8 */ MDRP_MIRP.bind(undefined, 0, 1, 1, 0, 0),
    /* 0xD9 */ MDRP_MIRP.bind(undefined, 0, 1, 1, 0, 1),
    /* 0xDA */ MDRP_MIRP.bind(undefined, 0, 1, 1, 0, 2),
    /* 0xDB */ MDRP_MIRP.bind(undefined, 0, 1, 1, 0, 3),
    /* 0xDC */ MDRP_MIRP.bind(undefined, 0, 1, 1, 1, 0),
    /* 0xDD */ MDRP_MIRP.bind(undefined, 0, 1, 1, 1, 1),
    /* 0xDE */ MDRP_MIRP.bind(undefined, 0, 1, 1, 1, 2),
    /* 0xDF */ MDRP_MIRP.bind(undefined, 0, 1, 1, 1, 3),
    /* 0xE0 */ MDRP_MIRP.bind(undefined, 1, 0, 0, 0, 0),
    /* 0xE1 */ MDRP_MIRP.bind(undefined, 1, 0, 0, 0, 1),
    /* 0xE2 */ MDRP_MIRP.bind(undefined, 1, 0, 0, 0, 2),
    /* 0xE3 */ MDRP_MIRP.bind(undefined, 1, 0, 0, 0, 3),
    /* 0xE4 */ MDRP_MIRP.bind(undefined, 1, 0, 0, 1, 0),
    /* 0xE5 */ MDRP_MIRP.bind(undefined, 1, 0, 0, 1, 1),
    /* 0xE6 */ MDRP_MIRP.bind(undefined, 1, 0, 0, 1, 2),
    /* 0xE7 */ MDRP_MIRP.bind(undefined, 1, 0, 0, 1, 3),
    /* 0xE8 */ MDRP_MIRP.bind(undefined, 1, 0, 1, 0, 0),
    /* 0xE9 */ MDRP_MIRP.bind(undefined, 1, 0, 1, 0, 1),
    /* 0xEA */ MDRP_MIRP.bind(undefined, 1, 0, 1, 0, 2),
    /* 0xEB */ MDRP_MIRP.bind(undefined, 1, 0, 1, 0, 3),
    /* 0xEC */ MDRP_MIRP.bind(undefined, 1, 0, 1, 1, 0),
    /* 0xED */ MDRP_MIRP.bind(undefined, 1, 0, 1, 1, 1),
    /* 0xEE */ MDRP_MIRP.bind(undefined, 1, 0, 1, 1, 2),
    /* 0xEF */ MDRP_MIRP.bind(undefined, 1, 0, 1, 1, 3),
    /* 0xF0 */ MDRP_MIRP.bind(undefined, 1, 1, 0, 0, 0),
    /* 0xF1 */ MDRP_MIRP.bind(undefined, 1, 1, 0, 0, 1),
    /* 0xF2 */ MDRP_MIRP.bind(undefined, 1, 1, 0, 0, 2),
    /* 0xF3 */ MDRP_MIRP.bind(undefined, 1, 1, 0, 0, 3),
    /* 0xF4 */ MDRP_MIRP.bind(undefined, 1, 1, 0, 1, 0),
    /* 0xF5 */ MDRP_MIRP.bind(undefined, 1, 1, 0, 1, 1),
    /* 0xF6 */ MDRP_MIRP.bind(undefined, 1, 1, 0, 1, 2),
    /* 0xF7 */ MDRP_MIRP.bind(undefined, 1, 1, 0, 1, 3),
    /* 0xF8 */ MDRP_MIRP.bind(undefined, 1, 1, 1, 0, 0),
    /* 0xF9 */ MDRP_MIRP.bind(undefined, 1, 1, 1, 0, 1),
    /* 0xFA */ MDRP_MIRP.bind(undefined, 1, 1, 1, 0, 2),
    /* 0xFB */ MDRP_MIRP.bind(undefined, 1, 1, 1, 0, 3),
    /* 0xFC */ MDRP_MIRP.bind(undefined, 1, 1, 1, 1, 0),
    /* 0xFD */ MDRP_MIRP.bind(undefined, 1, 1, 1, 1, 1),
    /* 0xFE */ MDRP_MIRP.bind(undefined, 1, 1, 1, 1, 2),
    /* 0xFF */ MDRP_MIRP.bind(undefined, 1, 1, 1, 1, 3)
];

/*****************************
  Mathematical Considerations
******************************

fv ... refers to freedom vector
pv ... refers to projection vector
rp ... refers to reference point
p  ... refers to to point being operated on
d  ... refers to distance

SETRELATIVE:
============

case freedom vector == x-axis:
------------------------------

                        (pv)
                     .-'
              rpd .-'
               .-*
          d .-'90°'
         .-'       '
      .-'           '
   *-'               ' b
  rp                  '
                       '
                        '
            p *----------*-------------- (fv)
                          pm

  rpdx = rpx + d * pv.x
  rpdy = rpy + d * pv.y

  equation of line b

   y - rpdy = pvns * (x- rpdx)

   y = p.y

   x = rpdx + ( p.y - rpdy ) / pvns


case freedom vector == y-axis:
------------------------------

    * pm
    |\
    | \
    |  \
    |   \
    |    \
    |     \
    |      \
    |       \
    |        \
    |         \ b
    |          \
    |           \
    |            \    .-' (pv)
    |         90° \.-'
    |           .-'* rpd
    |        .-'
    *     *-'  d
    p     rp

  rpdx = rpx + d * pv.x
  rpdy = rpy + d * pv.y

  equation of line b:
           pvns ... normal slope to pv

   y - rpdy = pvns * (x - rpdx)

   x = p.x

   y = rpdy +  pvns * (p.x - rpdx)



generic case:
-------------


                              .'(fv)
                            .'
                          .* pm
                        .' !
                      .'    .
                    .'      !
                  .'         . b
                .'           !
               *              .
              p               !
                         90°   .    ... (pv)
                           ...-*-'''
                  ...---'''    rpd
         ...---'''   d
   *--'''
  rp

    rpdx = rpx + d * pv.x
    rpdy = rpy + d * pv.y

 equation of line b:
    pvns... normal slope to pv

    y - rpdy = pvns * (x - rpdx)

 equation of freedom vector line:
    fvs ... slope of freedom vector (=fy/fx)

    y - py = fvs * (x - px)


  on pm both equations are true for same x/y

    y - rpdy = pvns * (x - rpdx)

    y - py = fvs * (x - px)

  form to y and set equal:

    pvns * (x - rpdx) + rpdy = fvs * (x - px) + py

  expand:

    pvns * x - pvns * rpdx + rpdy = fvs * x - fvs * px + py

  switch:

    fvs * x - fvs * px + py = pvns * x - pvns * rpdx + rpdy

  solve for x:

    fvs * x - pvns * x = fvs * px - pvns * rpdx - py + rpdy



          fvs * px - pvns * rpdx + rpdy - py
    x =  -----------------------------------
                 fvs - pvns

  and:

    y = fvs * (x - px) + py



INTERPOLATE:
============

Examples of point interpolation.

The weight of the movement of the reference point gets bigger
the further the other reference point is away, thus the safest
option (that is avoiding 0/0 divisions) is to weight the
original distance of the other point by the sum of both distances.

If the sum of both distances is 0, then move the point by the
arithmetic average of the movement of both reference points.




           (+6)
    rp1o *---->*rp1
         .     .                          (+12)
         .     .                  rp2o *---------->* rp2
         .     .                       .           .
         .     .                       .           .
         .    10          20           .           .
         |.........|...................|           .
               .   .                               .
               .   . (+8)                          .
                po *------>*p                      .
               .           .                       .
               .    12     .          24           .
               |...........|.......................|
                                  36


-------



           (+10)
    rp1o *-------->*rp1
         .         .                      (-10)
         .         .              rp2 *<---------* rpo2
         .         .                   .         .
         .         .                   .         .
         .    10   .          30       .         .
         |.........|.............................|
                   .                   .
                   . (+5)              .
                po *--->* p            .
                   .    .              .
                   .    .   20         .
                   |....|..............|
                     5        15


-------


           (+10)
    rp1o *-------->*rp1
         .         .
         .         .
    rp2o *-------->*rp2


                               (+10)
                          po *-------->* p

-------


           (+10)
    rp1o *-------->*rp1
         .         .
         .         .(+30)
    rp2o *---------------------------->*rp2


                                        (+25)
                          po *----------------------->* p



vim: set ts=4 sw=4 expandtab:
*****/

/**
 * Converts a string into a list of tokens.
 */

/**
 * Create a new token
 * @param {string} char a single char
 */
function Token(char) {
    this.char = char;
    this.state = {};
    this.activeState = null;
}

/**
 * Create a new context range
 * @param {number} startIndex range start index
 * @param {number} endOffset range end index offset
 * @param {string} contextName owner context name
 */
function ContextRange(startIndex, endOffset, contextName) {
    this.contextName = contextName;
    this.startIndex = startIndex;
    this.endOffset = endOffset;
}

/**
 * Check context start and end
 * @param {string} contextName a unique context name
 * @param {function} checkStart a predicate function the indicates a context's start
 * @param {function} checkEnd a predicate function the indicates a context's end
 */
function ContextChecker(contextName, checkStart, checkEnd) {
    this.contextName = contextName;
    this.openRange = null;
    this.ranges = [];
    this.checkStart = checkStart;
    this.checkEnd = checkEnd;
}

/**
 * @typedef ContextParams
 * @type Object
 * @property {array} context context items
 * @property {number} currentIndex current item index
 */

/**
 * Create a context params
 * @param {array} context a list of items
 * @param {number} currentIndex current item index
 */
function ContextParams(context, currentIndex) {
    this.context = context;
    this.index = currentIndex;
    this.length = context.length;
    this.current = context[currentIndex];
    this.backtrack = context.slice(0, currentIndex);
    this.lookahead = context.slice(currentIndex + 1);
}

/**
 * Create an event instance
 * @param {string} eventId event unique id
 */
function Event(eventId) {
    this.eventId = eventId;
    this.subscribers = [];
}

/**
 * Initialize a core events and auto subscribe required event handlers
 * @param {any} events an object that enlists core events handlers
 */
function initializeCoreEvents(events) {
    var this$1 = this;

    var coreEvents = [
        'start', 'end', 'next', 'newToken', 'contextStart',
        'contextEnd', 'insertToken', 'removeToken', 'removeRange',
        'replaceToken', 'replaceRange', 'composeRUD', 'updateContextsRanges'
    ];

    coreEvents.forEach(function (eventId) {
        Object.defineProperty(this$1.events, eventId, {
            value: new Event(eventId)
        });
    });

    if (!!events) {
        coreEvents.forEach(function (eventId) {
            var event = events[eventId];
            if (typeof event === 'function') {
                this$1.events[eventId].subscribe(event);
            }
        });
    }
    var requiresContextUpdate = [
        'insertToken', 'removeToken', 'removeRange',
        'replaceToken', 'replaceRange', 'composeRUD'
    ];
    requiresContextUpdate.forEach(function (eventId) {
        this$1.events[eventId].subscribe(
            this$1.updateContextsRanges
        );
    });
}

/**
 * Converts a string into a list of tokens
 * @param {any} events tokenizer core events
 */
function Tokenizer(events) {
    this.tokens = [];
    this.registeredContexts = {};
    this.contextCheckers = [];
    this.events = {};
    this.registeredModifiers = [];

    initializeCoreEvents.call(this, events);
}

/**
 * Sets the state of a token, usually called by a state modifier.
 * @param {string} key state item key
 * @param {any} value state item value
 */
Token.prototype.setState = function(key, value) {
    this.state[key] = value;
    this.activeState = { key: key, value: this.state[key] };
    return this.activeState;
};

Token.prototype.getState = function (stateId) {
    return this.state[stateId] || null;
};

/**
 * Checks if an index exists in the tokens list.
 * @param {number} index token index
 */
Tokenizer.prototype.inboundIndex = function(index) {
    return index >= 0 && index < this.tokens.length;
};

/**
 * Compose and apply a list of operations (replace, update, delete)
 * @param {array} RUDs replace, update and delete operations
 * TODO: Perf. Optimization (lengthBefore === lengthAfter ? dispatch once)
 */
Tokenizer.prototype.composeRUD = function (RUDs) {
    var this$1 = this;

    var silent = true;
    var state = RUDs.map(function (RUD) { return (
        this$1[RUD[0]].apply(this$1, RUD.slice(1).concat(silent))
    ); });
    var hasFAILObject = function (obj) { return (
        typeof obj === 'object' &&
        obj.hasOwnProperty('FAIL')
    ); };
    if (state.every(hasFAILObject)) {
        return {
            FAIL: "composeRUD: one or more operations hasn't completed successfully",
            report: state.filter(hasFAILObject)
        };
    }
    this.dispatch('composeRUD', [state.filter(function (op) { return !hasFAILObject(op); })]);
};

/**
 * Replace a range of tokens with a list of tokens
 * @param {number} startIndex range start index
 * @param {number} offset range offset
 * @param {token} tokens a list of tokens to replace
 * @param {boolean} silent dispatch events and update context ranges
 */
Tokenizer.prototype.replaceRange = function (startIndex, offset, tokens, silent) {
    offset = offset !== null ? offset : this.tokens.length;
    var isTokenType = tokens.every(function (token) { return token instanceof Token; });
    if (!isNaN(startIndex) && this.inboundIndex(startIndex) && isTokenType) {
        var replaced = this.tokens.splice.apply(
            this.tokens, [startIndex, offset].concat(tokens)
        );
        if (!silent) { this.dispatch('replaceToken', [startIndex, offset, tokens]); }
        return [replaced, tokens];
    } else {
        return { FAIL: 'replaceRange: invalid tokens or startIndex.' };
    }
};

/**
 * Replace a token with another token
 * @param {number} index token index
 * @param {token} token a token to replace
 * @param {boolean} silent dispatch events and update context ranges
 */
Tokenizer.prototype.replaceToken = function (index, token, silent) {
    if (!isNaN(index) && this.inboundIndex(index) && token instanceof Token) {
        var replaced = this.tokens.splice(index, 1, token);
        if (!silent) { this.dispatch('replaceToken', [index, token]); }
        return [replaced[0], token];
    } else {
        return { FAIL: 'replaceToken: invalid token or index.' };
    }
};

/**
 * Removes a range of tokens
 * @param {number} startIndex range start index
 * @param {number} offset range offset
 * @param {boolean} silent dispatch events and update context ranges
 */
Tokenizer.prototype.removeRange = function(startIndex, offset, silent) {
    offset = !isNaN(offset) ? offset : this.tokens.length;
    var tokens = this.tokens.splice(startIndex, offset);
    if (!silent) { this.dispatch('removeRange', [tokens, startIndex, offset]); }
    return tokens;
};

/**
 * Remove a token at a certain index
 * @param {number} index token index
 * @param {boolean} silent dispatch events and update context ranges
 */
Tokenizer.prototype.removeToken = function(index, silent) {
    if (!isNaN(index) && this.inboundIndex(index)) {
        var token = this.tokens.splice(index, 1);
        if (!silent) { this.dispatch('removeToken', [token, index]); }
        return token;
    } else {
        return { FAIL: 'removeToken: invalid token index.' };
    }
};

/**
 * Insert a list of tokens at a certain index
 * @param {array} tokens a list of tokens to insert
 * @param {number} index insert the list of tokens at index
 * @param {boolean} silent dispatch events and update context ranges
 */
Tokenizer.prototype.insertToken = function (tokens, index, silent) {
    var tokenType = tokens.every(
        function (token) { return token instanceof Token; }
    );
    if (tokenType) {
        this.tokens.splice.apply(
            this.tokens, [index, 0].concat(tokens)
        );
        if (!silent) { this.dispatch('insertToken', [tokens, index]); }
        return tokens;
    } else {
        return { FAIL: 'insertToken: invalid token(s).' };
    }
};

/**
 * A state modifier that is called on 'newToken' event
 * @param {string} modifierId state modifier id
 * @param {function} condition a predicate function that returns true or false
 * @param {function} modifier a function to update token state
 */
Tokenizer.prototype.registerModifier = function(modifierId, condition, modifier) {
    this.events.newToken.subscribe(function(token, contextParams) {
        var conditionParams = [token, contextParams];
        var canApplyModifier = (
            condition === null ||
            condition.apply(this, conditionParams) === true
        );
        var modifierParams = [token, contextParams];
        if (canApplyModifier) {
            var newStateValue = modifier.apply(this, modifierParams);
            token.setState(modifierId, newStateValue);
        }
    });
    this.registeredModifiers.push(modifierId);
};

/**
 * Subscribe a handler to an event
 * @param {function} eventHandler an event handler function
 */
Event.prototype.subscribe = function (eventHandler) {
    if (typeof eventHandler === 'function') {
        return ((this.subscribers.push(eventHandler)) - 1);
    } else {
        return { FAIL: ("invalid '" + (this.eventId) + "' event handler")};
    }
};

/**
 * Unsubscribe an event handler
 * @param {string} subsId subscription id
 */
Event.prototype.unsubscribe = function (subsId) {
    this.subscribers.splice(subsId, 1);
};

/**
 * Sets context params current value index
 * @param {number} index context params current value index
 */
ContextParams.prototype.setCurrentIndex = function(index) {
    this.index = index;
    this.current = this.context[index];
    this.backtrack = this.context.slice(0, index);
    this.lookahead = this.context.slice(index + 1);
};

/**
 * Get an item at an offset from the current value
 * example (current value is 3):
 *  1    2   [3]   4    5   |   items values
 * -2   -1    0    1    2   |   offset values
 * @param {number} offset an offset from current value index
 */
ContextParams.prototype.get = function (offset) {
    switch (true) {
        case (offset === 0):
            return this.current;
        case (offset < 0 && Math.abs(offset) <= this.backtrack.length):
            return this.backtrack.slice(offset)[0];
        case (offset > 0 && offset <= this.lookahead.length):
            return this.lookahead[offset - 1];
        default:
            return null;
    }
};

/**
 * Converts a context range into a string value
 * @param {contextRange} range a context range
 */
Tokenizer.prototype.rangeToText = function (range) {
    if (range instanceof ContextRange) {
        return (
            this.getRangeTokens(range)
                .map(function (token) { return token.char; }).join('')
        );
    }
};

/**
 * Converts all tokens into a string
 */
Tokenizer.prototype.getText = function () {
    return this.tokens.map(function (token) { return token.char; }).join('');
};

/**
 * Get a context by name
 * @param {string} contextName context name to get
 */
Tokenizer.prototype.getContext = function (contextName) {
    var context = this.registeredContexts[contextName];
    return !!context ? context : null;
};

/**
 * Subscribes a new event handler to an event
 * @param {string} eventName event name to subscribe to
 * @param {function} eventHandler a function to be invoked on event
 */
Tokenizer.prototype.on = function(eventName, eventHandler) {
    var event = this.events[eventName];
    if (!!event) {
        return event.subscribe(eventHandler);
    } else {
        return null;
    }
};

/**
 * Dispatches an event
 * @param {string} eventName event name
 * @param {any} args event handler arguments
 */
Tokenizer.prototype.dispatch = function(eventName, args) {
    var this$1 = this;

    var event = this.events[eventName];
    if (event instanceof Event) {
        event.subscribers.forEach(function (subscriber) {
            subscriber.apply(this$1, args || []);
        });
    }
};

/**
 * Register a new context checker
 * @param {string} contextName a unique context name
 * @param {function} contextStartCheck a predicate function that returns true on context start
 * @param {function} contextEndCheck  a predicate function that returns true on context end
 * TODO: call tokenize on registration to update context ranges with the new context.
 */
Tokenizer.prototype.registerContextChecker = function(contextName, contextStartCheck, contextEndCheck) {
    if (!!this.getContext(contextName)) { return {
        FAIL:
        ("context name '" + contextName + "' is already registered.")
    }; }
    if (typeof contextStartCheck !== 'function') { return {
        FAIL:
        "missing context start check."
    }; }
    if (typeof contextEndCheck !== 'function') { return {
        FAIL:
        "missing context end check."
    }; }
    var contextCheckers = new ContextChecker(
        contextName, contextStartCheck, contextEndCheck
    );
    this.registeredContexts[contextName] = contextCheckers;
    this.contextCheckers.push(contextCheckers);
    return contextCheckers;
};

/**
 * Gets a context range tokens
 * @param {contextRange} range a context range
 */
Tokenizer.prototype.getRangeTokens = function(range) {
    var endIndex = range.startIndex + range.endOffset;
    return [].concat(
        this.tokens
            .slice(range.startIndex, endIndex)
    );
};

/**
 * Gets the ranges of a context
 * @param {string} contextName context name
 */
Tokenizer.prototype.getContextRanges = function(contextName) {
    var context = this.getContext(contextName);
    if (!!context) {
        return context.ranges;
    } else {
        return { FAIL: ("context checker '" + contextName + "' is not registered.") };
    }
};

/**
 * Resets context ranges to run context update
 */
Tokenizer.prototype.resetContextsRanges = function () {
    var registeredContexts = this.registeredContexts;
    for (var contextName in registeredContexts) {
        if (registeredContexts.hasOwnProperty(contextName)) {
            var context = registeredContexts[contextName];
            context.ranges = [];
        }
    }
};

/**
 * Updates context ranges
 */
Tokenizer.prototype.updateContextsRanges = function () {
    this.resetContextsRanges();
    var chars = this.tokens.map(function (token) { return token.char; });
    for (var i = 0; i < chars.length; i++) {
        var contextParams = new ContextParams(chars, i);
        this.runContextCheck(contextParams);
    }
    this.dispatch('updateContextsRanges', [this.registeredContexts]);
};

/**
 * Sets the end offset of an open range
 * @param {number} offset range end offset
 * @param {string} contextName context name
 */
Tokenizer.prototype.setEndOffset = function (offset, contextName) {
    var startIndex = this.getContext(contextName).openRange.startIndex;
    var range = new ContextRange(startIndex, offset, contextName);
    var ranges = this.getContext(contextName).ranges;
    range.rangeId = contextName + "." + (ranges.length);
    ranges.push(range);
    this.getContext(contextName).openRange = null;
    return range;
};

/**
 * Runs a context check on the current context
 * @param {contextParams} contextParams current context params
 */
Tokenizer.prototype.runContextCheck = function(contextParams) {
    var this$1 = this;

    var index = contextParams.index;
    this.contextCheckers.forEach(function (contextChecker) {
        var contextName = contextChecker.contextName;
        var openRange = this$1.getContext(contextName).openRange;
        if (!openRange && contextChecker.checkStart(contextParams)) {
            openRange = new ContextRange(index, null, contextName);
            this$1.getContext(contextName).openRange = openRange;
            this$1.dispatch('contextStart', [contextName, index]);
        }
        if (!!openRange && contextChecker.checkEnd(contextParams)) {
            var offset = (index - openRange.startIndex) + 1;
            var range = this$1.setEndOffset(offset, contextName);
            this$1.dispatch('contextEnd', [contextName, range]);
        }
    });
};

/**
 * Converts a text into a list of tokens
 * @param {string} text a text to tokenize
 */
Tokenizer.prototype.tokenize = function (text) {
    this.tokens = [];
    this.resetContextsRanges();
    var chars = Array.from(text);
    this.dispatch('start');
    for (var i = 0; i < chars.length; i++) {
        var char = chars[i];
        var contextParams = new ContextParams(chars, i);
        this.dispatch('next', [contextParams]);
        this.runContextCheck(contextParams);
        var token = new Token(char);
        this.tokens.push(token);
        this.dispatch('newToken', [token, contextParams]);
    }
    this.dispatch('end', [this.tokens]);
    return this.tokens;
};

// ╭─┄┄┄────────────────────────┄─────────────────────────────────────────────╮
// ┊ Character Class Assertions ┊ Checks if a char belongs to a certain class ┊
// ╰─╾──────────────────────────┄─────────────────────────────────────────────╯
// jscs:disable maximumLineLength
/**
 * Check if a char is Arabic
 * @param {string} c a single char
 */
function isArabicChar(c) {
    return /[\u0600-\u065F\u066A-\u06D2\u06FA-\u06FF]/.test(c);
}

/**
 * Check if a char is an isolated arabic char
 * @param {string} c a single char
 */
function isIsolatedArabicChar(char) {
    return /[\u0630\u0690\u0621\u0631\u0661\u0671\u0622\u0632\u0672\u0692\u06C2\u0623\u0673\u0693\u06C3\u0624\u0694\u06C4\u0625\u0675\u0695\u06C5\u06E5\u0676\u0696\u06C6\u0627\u0677\u0697\u06C7\u0648\u0688\u0698\u06C8\u0689\u0699\u06C9\u068A\u06CA\u066B\u068B\u06CB\u068C\u068D\u06CD\u06FD\u068E\u06EE\u06FE\u062F\u068F\u06CF\u06EF]/.test(char);
}

/**
 * Check if a char is an Arabic Tashkeel char
 * @param {string} c a single char
 */
function isTashkeelArabicChar(char) {
    return /[\u0600-\u0605\u060C-\u060E\u0610-\u061B\u061E\u064B-\u065F\u0670\u06D6-\u06DC\u06DF-\u06E4\u06E7\u06E8\u06EA-\u06ED]/.test(char);
}

/**
 * Check if a char is Latin
 * @param {string} c a single char
 */
function isLatinChar(c) {
    return /[A-z]/.test(c);
}

/**
 * Check if a char is whitespace char
 * @param {string} c a single char
 */
function isWhiteSpace(c) {
    return /\s/.test(c);
}

/**
 * Query a feature by some of it's properties to lookup a glyph substitution.
 */

/**
 * Create feature query instance
 * @param {Font} font opentype font instance
 */
function FeatureQuery(font) {
    this.font = font;
    this.features = {};
}

/**
 * @typedef SubstitutionAction
 * @type Object
 * @property {number} id substitution type
 * @property {string} tag feature tag
 * @property {any} substitution substitution value(s)
 */

/**
 * Create a substitution action instance
 * @param {SubstitutionAction} action
 */
function SubstitutionAction(action) {
    this.id = action.id;
    this.tag = action.tag;
    this.substitution = action.substitution;
}

/**
 * Lookup a coverage table
 * @param {number} glyphIndex glyph index
 * @param {CoverageTable} coverage coverage table
 */
function lookupCoverage(glyphIndex, coverage) {
    if (!glyphIndex) { return -1; }
    switch (coverage.format) {
        case 1:
            return coverage.glyphs.indexOf(glyphIndex);

        case 2:
            var ranges = coverage.ranges;
            for (var i = 0; i < ranges.length; i++) {
                var range = ranges[i];
                if (glyphIndex >= range.start && glyphIndex <= range.end) {
                    var offset = glyphIndex - range.start;
                    return range.index + offset;
                }
            }
            break;
        default:
            return -1; // not found
    }
    return -1;
}

/**
 * Handle a single substitution - format 1
 * @param {ContextParams} contextParams context params to lookup
 */
function singleSubstitutionFormat1(glyphIndex, subtable) {
    var substituteIndex = lookupCoverage(glyphIndex, subtable.coverage);
    if (substituteIndex === -1) { return null; }
    return glyphIndex + subtable.deltaGlyphId;
}

/**
 * Handle a single substitution - format 2
 * @param {ContextParams} contextParams context params to lookup
 */
function singleSubstitutionFormat2(glyphIndex, subtable) {
    var substituteIndex = lookupCoverage(glyphIndex, subtable.coverage);
    if (substituteIndex === -1) { return null; }
    return subtable.substitute[substituteIndex];
}

/**
 * Lookup a list of coverage tables
 * @param {any} coverageList a list of coverage tables
 * @param {ContextParams} contextParams context params to lookup
 */
function lookupCoverageList(coverageList, contextParams) {
    var lookupList = [];
    for (var i = 0; i < coverageList.length; i++) {
        var coverage = coverageList[i];
        var glyphIndex = contextParams.current;
        glyphIndex = Array.isArray(glyphIndex) ? glyphIndex[0] : glyphIndex;
        var lookupIndex = lookupCoverage(glyphIndex, coverage);
        if (lookupIndex !== -1) {
            lookupList.push(lookupIndex);
        }
    }
    if (lookupList.length !== coverageList.length) { return -1; }
    return lookupList;
}

/**
 * Handle chaining context substitution - format 3
 * @param {ContextParams} contextParams context params to lookup
 */
function chainingSubstitutionFormat3(contextParams, subtable) {
    var lookupsCount = (
        subtable.inputCoverage.length +
        subtable.lookaheadCoverage.length +
        subtable.backtrackCoverage.length
    );
    if (contextParams.context.length < lookupsCount) { return []; }
    // INPUT LOOKUP //
    var inputLookups = lookupCoverageList(
        subtable.inputCoverage, contextParams
    );
    if (inputLookups === -1) { return []; }
    // LOOKAHEAD LOOKUP //
    var lookaheadOffset = subtable.inputCoverage.length - 1;
    if (contextParams.lookahead.length < subtable.lookaheadCoverage.length) { return []; }
    var lookaheadContext = contextParams.lookahead.slice(lookaheadOffset);
    while (lookaheadContext.length && isTashkeelArabicChar(lookaheadContext[0].char)) {
        lookaheadContext.shift();
    }
    var lookaheadParams = new ContextParams(lookaheadContext, 0);
    var lookaheadLookups = lookupCoverageList(
        subtable.lookaheadCoverage, lookaheadParams
    );
    // BACKTRACK LOOKUP //
    var backtrackContext = [].concat(contextParams.backtrack);
    backtrackContext.reverse();
    while (backtrackContext.length && isTashkeelArabicChar(backtrackContext[0].char)) {
        backtrackContext.shift();
    }
    if (backtrackContext.length < subtable.backtrackCoverage.length) { return []; }
    var backtrackParams = new ContextParams(backtrackContext, 0);
    var backtrackLookups = lookupCoverageList(
        subtable.backtrackCoverage, backtrackParams
    );
    var contextRulesMatch = (
        inputLookups.length === subtable.inputCoverage.length &&
        lookaheadLookups.length === subtable.lookaheadCoverage.length &&
        backtrackLookups.length === subtable.backtrackCoverage.length
    );
    var substitutions = [];
    if (contextRulesMatch) {
        for (var i = 0; i < subtable.lookupRecords.length; i++) {
            var lookupRecord = subtable.lookupRecords[i];
            var lookupListIndex = lookupRecord.lookupListIndex;
            var lookupTable = this.getLookupByIndex(lookupListIndex);
            for (var s = 0; s < lookupTable.subtables.length; s++) {
                var subtable$1 = lookupTable.subtables[s];
                var lookup = this.getLookupMethod(lookupTable, subtable$1);
                var substitutionType = this.getSubstitutionType(lookupTable, subtable$1);
                if (substitutionType === '12') {
                    for (var n = 0; n < inputLookups.length; n++) {
                        var glyphIndex = contextParams.get(n);
                        var substitution = lookup(glyphIndex);
                        if (substitution) { substitutions.push(substitution); }
                    }
                }
            }
        }
    }
    return substitutions;
}

/**
 * Handle ligature substitution - format 1
 * @param {ContextParams} contextParams context params to lookup
 */
function ligatureSubstitutionFormat1(contextParams, subtable) {
    // COVERAGE LOOKUP //
    var glyphIndex = contextParams.current;
    var ligSetIndex = lookupCoverage(glyphIndex, subtable.coverage);
    if (ligSetIndex === -1) { return null; }
    // COMPONENTS LOOKUP
    // (!) note, components are ordered in the written direction.
    var ligature;
    var ligatureSet = subtable.ligatureSets[ligSetIndex];
    for (var s = 0; s < ligatureSet.length; s++) {
        ligature = ligatureSet[s];
        for (var l = 0; l < ligature.components.length; l++) {
            var lookaheadItem = contextParams.lookahead[l];
            var component = ligature.components[l];
            if (lookaheadItem !== component) { break; }
            if (l === ligature.components.length - 1) { return ligature; }
        }
    }
    return null;
}

/**
 * Handle decomposition substitution - format 1
 * @param {number} glyphIndex glyph index
 * @param {any} subtable subtable
 */
function decompositionSubstitutionFormat1(glyphIndex, subtable) {
    var substituteIndex = lookupCoverage(glyphIndex, subtable.coverage);
    if (substituteIndex === -1) { return null; }
    return subtable.sequences[substituteIndex];
}

/**
 * Get default script features indexes
 */
FeatureQuery.prototype.getDefaultScriptFeaturesIndexes = function () {
    var scripts = this.font.tables.gsub.scripts;
    for (var s = 0; s < scripts.length; s++) {
        var script = scripts[s];
        if (script.tag === 'DFLT') { return (
            script.script.defaultLangSys.featureIndexes
        ); }
    }
    return [];
};

/**
 * Get feature indexes of a specific script
 * @param {string} scriptTag script tag
 */
FeatureQuery.prototype.getScriptFeaturesIndexes = function(scriptTag) {
    var tables = this.font.tables;
    if (!tables.gsub) { return []; }
    if (!scriptTag) { return this.getDefaultScriptFeaturesIndexes(); }
    var scripts = this.font.tables.gsub.scripts;
    for (var i = 0; i < scripts.length; i++) {
        var script = scripts[i];
        if (script.tag === scriptTag && script.script.defaultLangSys) {
            return script.script.defaultLangSys.featureIndexes;
        } else {
            var langSysRecords = script.langSysRecords;
            if (!!langSysRecords) {
                for (var j = 0; j < langSysRecords.length; j++) {
                    var langSysRecord = langSysRecords[j];
                    if (langSysRecord.tag === scriptTag) {
                        var langSys = langSysRecord.langSys;
                        return langSys.featureIndexes;
                    }
                }
            }
        }
    }
    return this.getDefaultScriptFeaturesIndexes();
};

/**
 * Map a feature tag to a gsub feature
 * @param {any} features gsub features
 * @param {string} scriptTag script tag
 */
FeatureQuery.prototype.mapTagsToFeatures = function (features, scriptTag) {
    var tags = {};
    for (var i = 0; i < features.length; i++) {
        var tag = features[i].tag;
        var feature = features[i].feature;
        tags[tag] = feature;
    }
    this.features[scriptTag].tags = tags;
};

/**
 * Get features of a specific script
 * @param {string} scriptTag script tag
 */
FeatureQuery.prototype.getScriptFeatures = function (scriptTag) {
    var features = this.features[scriptTag];
    if (this.features.hasOwnProperty(scriptTag)) { return features; }
    var featuresIndexes = this.getScriptFeaturesIndexes(scriptTag);
    if (!featuresIndexes) { return null; }
    var gsub = this.font.tables.gsub;
    features = featuresIndexes.map(function (index) { return gsub.features[index]; });
    this.features[scriptTag] = features;
    this.mapTagsToFeatures(features, scriptTag);
    return features;
};

/**
 * Get substitution type
 * @param {any} lookupTable lookup table
 * @param {any} subtable subtable
 */
FeatureQuery.prototype.getSubstitutionType = function(lookupTable, subtable) {
    var lookupType = lookupTable.lookupType.toString();
    var substFormat = subtable.substFormat.toString();
    return lookupType + substFormat;
};

/**
 * Get lookup method
 * @param {any} lookupTable lookup table
 * @param {any} subtable subtable
 */
FeatureQuery.prototype.getLookupMethod = function(lookupTable, subtable) {
    var this$1 = this;

    var substitutionType = this.getSubstitutionType(lookupTable, subtable);
    switch (substitutionType) {
        case '11':
            return function (glyphIndex) { return singleSubstitutionFormat1.apply(
                this$1, [glyphIndex, subtable]
            ); };
        case '12':
            return function (glyphIndex) { return singleSubstitutionFormat2.apply(
                this$1, [glyphIndex, subtable]
            ); };
        case '63':
            return function (contextParams) { return chainingSubstitutionFormat3.apply(
                this$1, [contextParams, subtable]
            ); };
        case '41':
            return function (contextParams) { return ligatureSubstitutionFormat1.apply(
                this$1, [contextParams, subtable]
            ); };
        case '21':
            return function (glyphIndex) { return decompositionSubstitutionFormat1.apply(
                this$1, [glyphIndex, subtable]
            ); };
        default:
            throw new Error(
                "lookupType: " + (lookupTable.lookupType) + " - " +
                "substFormat: " + (subtable.substFormat) + " " +
                "is not yet supported"
            );
    }
};

/**
 * [ LOOKUP TYPES ]
 * -------------------------------
 * Single                        1;
 * Multiple                      2;
 * Alternate                     3;
 * Ligature                      4;
 * Context                       5;
 * ChainingContext               6;
 * ExtensionSubstitution         7;
 * ReverseChainingContext        8;
 * -------------------------------
 *
 */

/**
 * @typedef FQuery
 * @type Object
 * @param {string} tag feature tag
 * @param {string} script feature script
 * @param {ContextParams} contextParams context params
 */

/**
 * Lookup a feature using a query parameters
 * @param {FQuery} query feature query
 */
FeatureQuery.prototype.lookupFeature = function (query) {
    var contextParams = query.contextParams;
    var currentIndex = contextParams.index;
    var feature = this.getFeature({
        tag: query.tag, script: query.script
    });
    if (!feature) { return new Error(
        "font '" + (this.font.names.fullName.en) + "' " +
        "doesn't support feature '" + (query.tag) + "' " +
        "for script '" + (query.script) + "'."
    ); }
    var lookups = this.getFeatureLookups(feature);
    var substitutions = [].concat(contextParams.context);
    for (var l = 0; l < lookups.length; l++) {
        var lookupTable = lookups[l];
        var subtables = this.getLookupSubtables(lookupTable);
        for (var s = 0; s < subtables.length; s++) {
            var subtable = subtables[s];
            var substType = this.getSubstitutionType(lookupTable, subtable);
            var lookup = this.getLookupMethod(lookupTable, subtable);
            var substitution = (void 0);
            switch (substType) {
                case '11':
                    substitution = lookup(contextParams.current);
                    if (substitution) {
                        substitutions.splice(currentIndex, 1, new SubstitutionAction({
                            id: 11, tag: query.tag, substitution: substitution
                        }));
                    }
                    break;
                case '12':
                    substitution = lookup(contextParams.current);
                    if (substitution) {
                        substitutions.splice(currentIndex, 1, new SubstitutionAction({
                            id: 12, tag: query.tag, substitution: substitution
                        }));
                    }
                    break;
                case '63':
                    substitution = lookup(contextParams);
                    if (Array.isArray(substitution) && substitution.length) {
                        substitutions.splice(currentIndex, 1, new SubstitutionAction({
                            id: 63, tag: query.tag, substitution: substitution
                        }));
                    }
                    break;
                case '41':
                    substitution = lookup(contextParams);
                    if (substitution) {
                        substitutions.splice(currentIndex, 1, new SubstitutionAction({
                            id: 41, tag: query.tag, substitution: substitution
                        }));
                    }
                    break;
                case '21':
                    substitution = lookup(contextParams.current);
                    if (substitution) {
                        substitutions.splice(currentIndex, 1, new SubstitutionAction({
                            id: 21, tag: query.tag, substitution: substitution
                        }));
                    }
                    break;
            }
            contextParams = new ContextParams(substitutions, currentIndex);
            if (Array.isArray(substitution) && !substitution.length) { continue; }
            substitution = null;
        }
    }
    return substitutions.length ? substitutions : null;
};

/**
 * Checks if a font supports a specific features
 * @param {FQuery} query feature query object
 */
FeatureQuery.prototype.supports = function (query) {
    if (!query.script) { return false; }
    this.getScriptFeatures(query.script);
    var supportedScript = this.features.hasOwnProperty(query.script);
    if (!query.tag) { return supportedScript; }
    var supportedFeature = (
        this.features[query.script].some(function (feature) { return feature.tag === query.tag; })
    );
    return supportedScript && supportedFeature;
};

/**
 * Get lookup table subtables
 * @param {any} lookupTable lookup table
 */
FeatureQuery.prototype.getLookupSubtables = function (lookupTable) {
    return lookupTable.subtables || null;
};

/**
 * Get lookup table by index
 * @param {number} index lookup table index
 */
FeatureQuery.prototype.getLookupByIndex = function (index) {
    var lookups = this.font.tables.gsub.lookups;
    return lookups[index] || null;
};

/**
 * Get lookup tables for a feature
 * @param {string} feature
 */
FeatureQuery.prototype.getFeatureLookups = function (feature) {
    // TODO: memoize
    return feature.lookupListIndexes.map(this.getLookupByIndex.bind(this));
};

/**
 * Query a feature by it's properties
 * @param {any} query an object that describes the properties of a query
 */
FeatureQuery.prototype.getFeature = function getFeature(query) {
    if (!this.font) { return { FAIL: "No font was found"}; }
    if (!this.features.hasOwnProperty(query.script)) {
        this.getScriptFeatures(query.script);
    }
    var scriptFeatures = this.features[query.script];
    if (!scriptFeatures) { return (
        { FAIL: ("No feature for script " + (query.script))}
    ); }
    if (!scriptFeatures.tags[query.tag]) { return null; }
    return this.features[query.script].tags[query.tag];
};

/**
 * Arabic word context checkers
 */

function arabicWordStartCheck(contextParams) {
    var char = contextParams.current;
    var prevChar = contextParams.get(-1);
    return (
        // ? arabic first char
        (prevChar === null && isArabicChar(char)) ||
        // ? arabic char preceded with a non arabic char
        (!isArabicChar(prevChar) && isArabicChar(char))
    );
}

function arabicWordEndCheck(contextParams) {
    var nextChar = contextParams.get(1);
    return (
        // ? last arabic char
        (nextChar === null) ||
        // ? next char is not arabic
        (!isArabicChar(nextChar))
    );
}

var arabicWordCheck = {
    startCheck: arabicWordStartCheck,
    endCheck: arabicWordEndCheck
};

/**
 * Arabic sentence context checkers
 */

function arabicSentenceStartCheck(contextParams) {
    var char = contextParams.current;
    var prevChar = contextParams.get(-1);
    return (
        // ? an arabic char preceded with a non arabic char
        (isArabicChar(char) || isTashkeelArabicChar(char)) &&
        !isArabicChar(prevChar)
    );
}

function arabicSentenceEndCheck(contextParams) {
    var nextChar = contextParams.get(1);
    switch (true) {
        case nextChar === null:
            return true;
        case (!isArabicChar(nextChar) && !isTashkeelArabicChar(nextChar)):
            var nextIsWhitespace = isWhiteSpace(nextChar);
            if (!nextIsWhitespace) { return true; }
            if (nextIsWhitespace) {
                var arabicCharAhead = false;
                arabicCharAhead = (
                    contextParams.lookahead.some(
                        function (c) { return isArabicChar(c) || isTashkeelArabicChar(c); }
                    )
                );
                if (!arabicCharAhead) { return true; }
            }
            break;
        default:
            return false;
    }
}

var arabicSentenceCheck = {
    startCheck: arabicSentenceStartCheck,
    endCheck: arabicSentenceEndCheck
};

/**
 * Apply single substitution format 1
 * @param {Array} substitutions substitutions
 * @param {any} tokens a list of tokens
 * @param {number} index token index
 */
function singleSubstitutionFormat1$1(action, tokens, index) {
    tokens[index].setState(action.tag, action.substitution);
}

/**
 * Apply single substitution format 2
 * @param {Array} substitutions substitutions
 * @param {any} tokens a list of tokens
 * @param {number} index token index
 */
function singleSubstitutionFormat2$1(action, tokens, index) {
    tokens[index].setState(action.tag, action.substitution);
}

/**
 * Apply chaining context substitution format 3
 * @param {Array} substitutions substitutions
 * @param {any} tokens a list of tokens
 * @param {number} index token index
 */
function chainingSubstitutionFormat3$1(action, tokens, index) {
    action.substitution.forEach(function (subst, offset) {
        var token = tokens[index + offset];
        token.setState(action.tag, subst);
    });
}

/**
 * Apply ligature substitution format 1
 * @param {Array} substitutions substitutions
 * @param {any} tokens a list of tokens
 * @param {number} index token index
 */
function ligatureSubstitutionFormat1$1(action, tokens, index) {
    var token = tokens[index];
    token.setState(action.tag, action.substitution.ligGlyph);
    var compsCount = action.substitution.components.length;
    for (var i = 0; i < compsCount; i++) {
        token = tokens[index + i + 1];
        token.setState('deleted', true);
    }
}

/**
 * Supported substitutions
 */
var SUBSTITUTIONS = {
    11: singleSubstitutionFormat1$1,
    12: singleSubstitutionFormat2$1,
    63: chainingSubstitutionFormat3$1,
    41: ligatureSubstitutionFormat1$1
};

/**
 * Apply substitutions to a list of tokens
 * @param {Array} substitutions substitutions
 * @param {any} tokens a list of tokens
 * @param {number} index token index
 */
function applySubstitution(action, tokens, index) {
    if (action instanceof SubstitutionAction && SUBSTITUTIONS[action.id]) {
        SUBSTITUTIONS[action.id](action, tokens, index);
    }
}

/**
 * Apply Arabic presentation forms to a range of tokens
 */

/**
 * Check if a char can be connected to it's preceding char
 * @param {ContextParams} charContextParams context params of a char
 */
function willConnectPrev(charContextParams) {
    var backtrack = [].concat(charContextParams.backtrack);
    for (var i = backtrack.length - 1; i >= 0; i--) {
        var prevChar = backtrack[i];
        var isolated = isIsolatedArabicChar(prevChar);
        var tashkeel = isTashkeelArabicChar(prevChar);
        if (!isolated && !tashkeel) { return true; }
        if (isolated) { return false; }
    }
    return false;
}

/**
 * Check if a char can be connected to it's proceeding char
 * @param {ContextParams} charContextParams context params of a char
 */
function willConnectNext(charContextParams) {
    if (isIsolatedArabicChar(charContextParams.current)) { return false; }
    for (var i = 0; i < charContextParams.lookahead.length; i++) {
        var nextChar = charContextParams.lookahead[i];
        var tashkeel = isTashkeelArabicChar(nextChar);
        if (!tashkeel) { return true; }
    }
    return false;
}

/**
 * Apply arabic presentation forms to a list of tokens
 * @param {ContextRange} range a range of tokens
 */
function arabicPresentationForms(range) {
    var this$1 = this;

    var script = 'arab';
    var tags = this.featuresTags[script];
    var tokens = this.tokenizer.getRangeTokens(range);
    if (tokens.length === 1) { return; }
    var contextParams = new ContextParams(
        tokens.map(function (token) { return token.getState('glyphIndex'); }
    ), 0);
    var charContextParams = new ContextParams(
        tokens.map(function (token) { return token.char; }
    ), 0);
    tokens.forEach(function (token, index) {
        if (isTashkeelArabicChar(token.char)) { return; }
        contextParams.setCurrentIndex(index);
        charContextParams.setCurrentIndex(index);
        var CONNECT = 0; // 2 bits 00 (10: can connect next) (01: can connect prev)
        if (willConnectPrev(charContextParams)) { CONNECT |= 1; }
        if (willConnectNext(charContextParams)) { CONNECT |= 2; }
        var tag;
        switch (CONNECT) {
            case 1: (tag = 'fina'); break;
            case 2: (tag = 'init'); break;
            case 3: (tag = 'medi'); break;
        }
        if (tags.indexOf(tag) === -1) { return; }
        var substitutions = this$1.query.lookupFeature({
            tag: tag, script: script, contextParams: contextParams
        });
        if (substitutions instanceof Error) { return console.info(substitutions.message); }
        substitutions.forEach(function (action, index) {
            if (action instanceof SubstitutionAction) {
                applySubstitution(action, tokens, index);
                contextParams.context[index] = action.substitution;
            }
        });
    });
}

/**
 * Apply Arabic required ligatures feature to a range of tokens
 */

/**
 * Update context params
 * @param {any} tokens a list of tokens
 * @param {number} index current item index
 */
function getContextParams(tokens, index) {
    var context = tokens.map(function (token) { return token.activeState.value; });
    return new ContextParams(context, index || 0);
}

/**
 * Apply Arabic required ligatures to a context range
 * @param {ContextRange} range a range of tokens
 */
function arabicRequiredLigatures(range) {
    var this$1 = this;

    var script = 'arab';
    var tokens = this.tokenizer.getRangeTokens(range);
    var contextParams = getContextParams(tokens);
    contextParams.context.forEach(function (glyphIndex, index) {
        contextParams.setCurrentIndex(index);
        var substitutions = this$1.query.lookupFeature({
            tag: 'rlig', script: script, contextParams: contextParams
        });
        if (substitutions.length) {
            substitutions.forEach(
                function (action) { return applySubstitution(action, tokens, index); }
            );
            contextParams = getContextParams(tokens);
        }
    });
}

/**
 * Latin word context checkers
 */

function latinWordStartCheck(contextParams) {
    var char = contextParams.current;
    var prevChar = contextParams.get(-1);
    return (
        // ? latin first char
        (prevChar === null && isLatinChar(char)) ||
        // ? latin char preceded with a non latin char
        (!isLatinChar(prevChar) && isLatinChar(char))
    );
}

function latinWordEndCheck(contextParams) {
    var nextChar = contextParams.get(1);
    return (
        // ? last latin char
        (nextChar === null) ||
        // ? next char is not latin
        (!isLatinChar(nextChar))
    );
}

var latinWordCheck = {
    startCheck: latinWordStartCheck,
    endCheck: latinWordEndCheck
};

/**
 * Apply Latin ligature feature to a range of tokens
 */

/**
 * Update context params
 * @param {any} tokens a list of tokens
 * @param {number} index current item index
 */
function getContextParams$1(tokens, index) {
    var context = tokens.map(function (token) { return token.activeState.value; });
    return new ContextParams(context, index || 0);
}

/**
 * Apply Arabic required ligatures to a context range
 * @param {ContextRange} range a range of tokens
 */
function latinLigature(range) {
    var this$1 = this;

    var script = 'latn';
    var tokens = this.tokenizer.getRangeTokens(range);
    var contextParams = getContextParams$1(tokens);
    contextParams.context.forEach(function (glyphIndex, index) {
        contextParams.setCurrentIndex(index);
        var substitutions = this$1.query.lookupFeature({
            tag: 'liga', script: script, contextParams: contextParams
        });
        if (substitutions.length) {
            substitutions.forEach(
                function (action) { return applySubstitution(action, tokens, index); }
            );
            contextParams = getContextParams$1(tokens);
        }
    });
}

/**
 * Infer bidirectional properties for a given text and apply
 * the corresponding layout rules.
 */

/**
 * Create Bidi. features
 * @param {string} baseDir text base direction. value either 'ltr' or 'rtl'
 */
function Bidi(baseDir) {
    this.baseDir = baseDir || 'ltr';
    this.tokenizer = new Tokenizer();
    this.featuresTags = {};
}

/**
 * Sets Bidi text
 * @param {string} text a text input
 */
Bidi.prototype.setText = function (text) {
    this.text = text;
};

/**
 * Store essential context checks:
 * arabic word check for applying gsub features
 * arabic sentence check for adjusting arabic layout
 */
Bidi.prototype.contextChecks = ({
    latinWordCheck: latinWordCheck,
    arabicWordCheck: arabicWordCheck,
    arabicSentenceCheck: arabicSentenceCheck
});

/**
 * Register arabic word check
 */
function registerContextChecker(checkId) {
    var check = this.contextChecks[(checkId + "Check")];
    return this.tokenizer.registerContextChecker(
        checkId, check.startCheck, check.endCheck
    );
}

/**
 * Perform pre tokenization procedure then
 * tokenize text input
 */
function tokenizeText() {
    registerContextChecker.call(this, 'latinWord');
    registerContextChecker.call(this, 'arabicWord');
    registerContextChecker.call(this, 'arabicSentence');
    return this.tokenizer.tokenize(this.text);
}

/**
 * Reverse arabic sentence layout
 * TODO: check base dir before applying adjustments - priority low
 */
function reverseArabicSentences() {
    var this$1 = this;

    var ranges = this.tokenizer.getContextRanges('arabicSentence');
    ranges.forEach(function (range) {
        var rangeTokens = this$1.tokenizer.getRangeTokens(range);
        this$1.tokenizer.replaceRange(
            range.startIndex,
            range.endOffset,
            rangeTokens.reverse()
        );
    });
}

/**
 * Register supported features tags
 * @param {script} script script tag
 * @param {Array} tags features tags list
 */
Bidi.prototype.registerFeatures = function (script, tags) {
    var this$1 = this;

    var supportedTags = tags.filter(
        function (tag) { return this$1.query.supports({script: script, tag: tag}); }
    );
    if (!this.featuresTags.hasOwnProperty(script)) {
        this.featuresTags[script] = supportedTags;
    } else {
        this.featuresTags[script] =
        this.featuresTags[script].concat(supportedTags);
    }
};

/**
 * Apply GSUB features
 * @param {Array} tagsList a list of features tags
 * @param {string} script a script tag
 * @param {Font} font opentype font instance
 */
Bidi.prototype.applyFeatures = function (font, features) {
    if (!font) { throw new Error(
        'No valid font was provided to apply features'
    ); }
    if (!this.query) { this.query = new FeatureQuery(font); }
    for (var f = 0; f < features.length; f++) {
        var feature = features[f];
        if (!this.query.supports({script: feature.script})) { continue; }
        this.registerFeatures(feature.script, feature.tags);
    }
};

/**
 * Register a state modifier
 * @param {string} modifierId state modifier id
 * @param {function} condition a predicate function that returns true or false
 * @param {function} modifier a modifier function to set token state
 */
Bidi.prototype.registerModifier = function (modifierId, condition, modifier) {
    this.tokenizer.registerModifier(modifierId, condition, modifier);
};

/**
 * Check if 'glyphIndex' is registered
 */
function checkGlyphIndexStatus() {
    if (this.tokenizer.registeredModifiers.indexOf('glyphIndex') === -1) {
        throw new Error(
            'glyphIndex modifier is required to apply ' +
            'arabic presentation features.'
        );
    }
}

/**
 * Apply arabic presentation forms features
 */
function applyArabicPresentationForms() {
    var this$1 = this;

    var script = 'arab';
    if (!this.featuresTags.hasOwnProperty(script)) { return; }
    checkGlyphIndexStatus.call(this);
    var ranges = this.tokenizer.getContextRanges('arabicWord');
    ranges.forEach(function (range) {
        arabicPresentationForms.call(this$1, range);
    });
}

/**
 * Apply required arabic ligatures
 */
function applyArabicRequireLigatures() {
    var this$1 = this;

    var script = 'arab';
    if (!this.featuresTags.hasOwnProperty(script)) { return; }
    var tags = this.featuresTags[script];
    if (tags.indexOf('rlig') === -1) { return; }
    checkGlyphIndexStatus.call(this);
    var ranges = this.tokenizer.getContextRanges('arabicWord');
    ranges.forEach(function (range) {
        arabicRequiredLigatures.call(this$1, range);
    });
}

/**
 * Apply required arabic ligatures
 */
function applyLatinLigatures() {
    var this$1 = this;

    var script = 'latn';
    if (!this.featuresTags.hasOwnProperty(script)) { return; }
    var tags = this.featuresTags[script];
    if (tags.indexOf('liga') === -1) { return; }
    checkGlyphIndexStatus.call(this);
    var ranges = this.tokenizer.getContextRanges('latinWord');
    ranges.forEach(function (range) {
        latinLigature.call(this$1, range);
    });
}

/**
 * Check if a context is registered
 * @param {string} contextId context id
 */
Bidi.prototype.checkContextReady = function (contextId) {
    return !!this.tokenizer.getContext(contextId);
};

/**
 * Apply features to registered contexts
 */
Bidi.prototype.applyFeaturesToContexts = function () {
    if (this.checkContextReady('arabicWord')) {
        applyArabicPresentationForms.call(this);
        applyArabicRequireLigatures.call(this);
    }
    if (this.checkContextReady('latinWord')) {
        applyLatinLigatures.call(this);
    }
    if (this.checkContextReady('arabicSentence')) {
        reverseArabicSentences.call(this);
    }
};

/**
 * process text input
 * @param {string} text an input text
 */
Bidi.prototype.processText = function(text) {
    if (!this.text || this.text !== text) {
        this.setText(text);
        tokenizeText.call(this);
        this.applyFeaturesToContexts();
    }
};

/**
 * Process a string of text to identify and adjust
 * bidirectional text entities.
 * @param {string} text input text
 */
Bidi.prototype.getBidiText = function (text) {
    this.processText(text);
    return this.tokenizer.getText();
};

/**
 * Get the current state index of each token
 * @param {text} text an input text
 */
Bidi.prototype.getTextGlyphs = function (text) {
    this.processText(text);
    var indexes = [];
    for (var i = 0; i < this.tokenizer.tokens.length; i++) {
        var token = this.tokenizer.tokens[i];
        if (token.state.deleted) { continue; }
        var index = token.activeState.value;
        indexes.push(Array.isArray(index) ? index[0] : index);
    }
    return indexes;
};

// The Font object

/**
 * @typedef FontOptions
 * @type Object
 * @property {Boolean} empty - whether to create a new empty font
 * @property {string} familyName
 * @property {string} styleName
 * @property {string=} fullName
 * @property {string=} postScriptName
 * @property {string=} designer
 * @property {string=} designerURL
 * @property {string=} manufacturer
 * @property {string=} manufacturerURL
 * @property {string=} license
 * @property {string=} licenseURL
 * @property {string=} version
 * @property {string=} description
 * @property {string=} copyright
 * @property {string=} trademark
 * @property {Number} unitsPerEm
 * @property {Number} ascender
 * @property {Number} descender
 * @property {Number} createdTimestamp
 * @property {string=} weightClass
 * @property {string=} widthClass
 * @property {string=} fsSelection
 */

/**
 * A Font represents a loaded OpenType font file.
 * It contains a set of glyphs and methods to draw text on a drawing context,
 * or to get a path representing the text.
 * @exports opentype.Font
 * @class
 * @param {FontOptions}
 * @constructor
 */
function Font(options) {
    options = options || {};
    options.tables = options.tables || {};

    if (!options.empty) {
        // Check that we've provided the minimum set of names.
        checkArgument(
            options.familyName,
            'When creating a new Font object, familyName is required.'
        );
        checkArgument(
            options.styleName,
            'When creating a new Font object, styleName is required.'
        );
        checkArgument(
            options.unitsPerEm,
            'When creating a new Font object, unitsPerEm is required.'
        );
        checkArgument(
            options.ascender,
            'When creating a new Font object, ascender is required.'
        );
        checkArgument(
            options.descender <= 0,
            'When creating a new Font object, negative descender value is required.'
        );

        this.unitsPerEm = options.unitsPerEm || 1000;
        this.ascender = options.ascender;
        this.descender = options.descender;
        this.createdTimestamp = options.createdTimestamp;
        this.tables = Object.assign(options.tables, {
            os2: Object.assign(
                {
                    usWeightClass:
                        options.weightClass || this.usWeightClasses.MEDIUM,
                    usWidthClass:
                        options.widthClass || this.usWidthClasses.MEDIUM,
                    fsSelection:
                        options.fsSelection || this.fsSelectionValues.REGULAR,
                },
                options.tables.os2
            ),
        });
    }

    this.supported = true; // Deprecated: parseBuffer will throw an error if font is not supported.
    this.glyphs = new glyphset.GlyphSet(this, options.glyphs || []);
    this.encoding = new DefaultEncoding(this);
    this.position = new Position(this);
    this.substitution = new Substitution(this);
    this.tables = this.tables || {};

    // needed for low memory mode only.
    this._push = null;
    this._hmtxTableData = {};

    Object.defineProperty(this, 'hinting', {
        get: function () {
            if (this._hinting) { return this._hinting; }
            if (this.outlinesFormat === 'truetype') {
                return (this._hinting = new Hinting(this));
            }
        },
    });
}

/**
 * Check if the font has a glyph for the given character.
 * @param  {string}
 * @return {Boolean}
 */
Font.prototype.hasChar = function (c) {
    return this.encoding.charToGlyphIndex(c) !== null;
};

/**
 * Convert the given character to a single glyph index.
 * Note that this function assumes that there is a one-to-one mapping between
 * the given character and a glyph; for complex scripts this might not be the case.
 * @param  {string}
 * @return {Number}
 */
Font.prototype.charToGlyphIndex = function (s) {
    return this.encoding.charToGlyphIndex(s);
};

/**
 * Convert the given character to a single Glyph object.
 * Note that this function assumes that there is a one-to-one mapping between
 * the given character and a glyph; for complex scripts this might not be the case.
 * @param  {string}
 * @return {opentype.Glyph}
 */
Font.prototype.charToGlyph = function (c) {
    var glyphIndex = this.charToGlyphIndex(c);
    var glyph = this.glyphs.get(glyphIndex);
    if (!glyph) {
        // .notdef
        glyph = this.glyphs.get(0);
    }

    return glyph;
};

/**
 * Update features
 * @param {any} options features options
 */
Font.prototype.updateFeatures = function (options) {
    // TODO: update all features options not only 'latn'.
    return this.defaultRenderOptions.features.map(function (feature) {
        if (feature.script === 'latn') {
            return {
                script: 'latn',
                tags: feature.tags.filter(function (tag) { return options[tag]; }),
            };
        } else {
            return feature;
        }
    });
};

/**
 * Convert the given text to a list of Glyph objects.
 * Note that there is no strict one-to-one mapping between characters and
 * glyphs, so the list of returned glyphs can be larger or smaller than the
 * length of the given string.
 * @param  {string}
 * @param  {GlyphRenderOptions} [options]
 * @return {opentype.Glyph[]}
 */
Font.prototype.stringToGlyphs = function (s, options) {
    var this$1 = this;

    var bidi = new Bidi();

    // Create and register 'glyphIndex' state modifier
    var charToGlyphIndexMod = function (token) { return this$1.charToGlyphIndex(token.char); };
    bidi.registerModifier('glyphIndex', null, charToGlyphIndexMod);

    // roll-back to default features
    var features = options
        ? this.updateFeatures(options.features)
        : this.defaultRenderOptions.features;

    bidi.applyFeatures(this, features);

    var indexes = bidi.getTextGlyphs(s);

    var length = indexes.length;

    // convert glyph indexes to glyph objects
    var glyphs = new Array(length);
    var notdef = this.glyphs.get(0);
    for (var i = 0; i < length; i += 1) {
        glyphs[i] = this.glyphs.get(indexes[i]) || notdef;
    }
    return glyphs;
};

/**
 * Retrieve the value of the kerning pair between the left glyph (or its index)
 * and the right glyph (or its index). If no kerning pair is found, return 0.
 * The kerning value gets added to the advance width when calculating the spacing
 * between glyphs.
 * For GPOS kerning, this method uses the default script and language, which covers
 * most use cases. To have greater control, use font.position.getKerningValue .
 * @param  {opentype.Glyph} leftGlyph
 * @param  {opentype.Glyph} rightGlyph
 * @return {Number}
 */
Font.prototype.getKerningValue = function (leftGlyph, rightGlyph) {
    leftGlyph = leftGlyph.index || leftGlyph;
    rightGlyph = rightGlyph.index || rightGlyph;
    var gposKerning = this.position.defaultKerningTables;
    if (gposKerning) {
        return this.position.getKerningValue(
            gposKerning,
            leftGlyph,
            rightGlyph
        );
    }
    // "kern" table
    return this.kerningPairs[leftGlyph + ',' + rightGlyph] || 0;
};

/**
 * @typedef GlyphRenderOptions
 * @type Object
 * @property {string} [script] - script used to determine which features to apply. By default, 'DFLT' or 'latn' is used.
 *                               See https://www.microsoft.com/typography/otspec/scripttags.htm
 * @property {string} [language='dflt'] - language system used to determine which features to apply.
 *                                        See https://www.microsoft.com/typography/developers/opentype/languagetags.aspx
 * @property {boolean} [kerning=true] - whether to include kerning values
 * @property {object} [features] - OpenType Layout feature tags. Used to enable or disable the features of the given script/language system.
 *                                 See https://www.microsoft.com/typography/otspec/featuretags.htm
 */
Font.prototype.defaultRenderOptions = {
    kerning: true,
    features: [
        /**
         * these 4 features are required to render Arabic text properly
         * and shouldn't be turned off when rendering arabic text.
         */
        { script: 'arab', tags: ['init', 'medi', 'fina', 'rlig'] },
        { script: 'latn', tags: ['liga', 'rlig'] } ],
};

/**
 * Helper function that invokes the given callback for each glyph in the given text.
 * The callback gets `(glyph, x, y, fontSize, options)`.* @param  {string} text
 * @param {string} text - The text to apply.
 * @param  {number} [x=0] - Horizontal position of the beginning of the text.
 * @param  {number} [y=0] - Vertical position of the *baseline* of the text.
 * @param  {number} [fontSize=72] - Font size in pixels. We scale the glyph units by `1 / unitsPerEm * fontSize`.
 * @param  {GlyphRenderOptions=} options
 * @param  {Function} callback
 */
Font.prototype.forEachGlyph = function (
    text,
    x,
    y,
    fontSize,
    options,
    callback
) {
    x = x !== undefined ? x : 0;
    y = y !== undefined ? y : 0;
    fontSize = fontSize !== undefined ? fontSize : 72;
    options = Object.assign({}, this.defaultRenderOptions, options);
    var fontScale = (1 / this.unitsPerEm) * fontSize;
    var glyphs = this.stringToGlyphs(text, options);
    var kerningLookups;
    if (options.kerning) {
        var script = options.script || this.position.getDefaultScriptName();
        kerningLookups = this.position.getKerningTables(
            script,
            options.language
        );
    }
    for (var i = 0; i < glyphs.length; i += 1) {
        var glyph = glyphs[i];
        callback.call(this, glyph, x, y, fontSize, options);
        if (glyph.advanceWidth) {
            x += glyph.advanceWidth * fontScale;
        }

        if (options.kerning && i < glyphs.length - 1) {
            // We should apply position adjustment lookups in a more generic way.
            // Here we only use the xAdvance value.
            var kerningValue = kerningLookups
                ? this.position.getKerningValue(
                      kerningLookups,
                      glyph.index,
                      glyphs[i + 1].index
                  )
                : this.getKerningValue(glyph, glyphs[i + 1]);
            x += kerningValue * fontScale;
        }

        if (options.letterSpacing) {
            x += options.letterSpacing * fontSize;
        } else if (options.tracking) {
            x += (options.tracking / 1000) * fontSize;
        }
    }
    return x;
};

/**
 * Create a Path object that represents the given text.
 * @param  {string} text - The text to create.
 * @param  {number} [x=0] - Horizontal position of the beginning of the text.
 * @param  {number} [y=0] - Vertical position of the *baseline* of the text.
 * @param  {number} [fontSize=72] - Font size in pixels. We scale the glyph units by `1 / unitsPerEm * fontSize`.
 * @param  {GlyphRenderOptions=} options
 * @return {opentype.Path}
 */
Font.prototype.getPath = function (text, x, y, fontSize, options) {
    var fullPath = new Path();
    this.forEachGlyph(
        text,
        x,
        y,
        fontSize,
        options,
        function (glyph, gX, gY, gFontSize) {
            var glyphPath = glyph.getPath(gX, gY, gFontSize, options, this);
            fullPath.extend(glyphPath);
        }
    );
    return fullPath;
};

/**
 * Create an array of Path objects that represent the glyphs of a given text.
 * @param  {string} text - The text to create.
 * @param  {number} [x=0] - Horizontal position of the beginning of the text.
 * @param  {number} [y=0] - Vertical position of the *baseline* of the text.
 * @param  {number} [fontSize=72] - Font size in pixels. We scale the glyph units by `1 / unitsPerEm * fontSize`.
 * @param  {GlyphRenderOptions=} options
 * @return {opentype.Path[]}
 */
Font.prototype.getPaths = function (text, x, y, fontSize, options) {
    var glyphPaths = [];
    this.forEachGlyph(
        text,
        x,
        y,
        fontSize,
        options,
        function (glyph, gX, gY, gFontSize) {
            var glyphPath = glyph.getPath(gX, gY, gFontSize, options, this);
            glyphPaths.push(glyphPath);
        }
    );

    return glyphPaths;
};

/**
 * Returns the advance width of a text.
 *
 * This is something different than Path.getBoundingBox() as for example a
 * suffixed whitespace increases the advanceWidth but not the bounding box
 * or an overhanging letter like a calligraphic 'f' might have a quite larger
 * bounding box than its advance width.
 *
 * This corresponds to canvas2dContext.measureText(text).width
 *
 * @param  {string} text - The text to create.
 * @param  {number} [fontSize=72] - Font size in pixels. We scale the glyph units by `1 / unitsPerEm * fontSize`.
 * @param  {GlyphRenderOptions=} options
 * @return advance width
 */
Font.prototype.getAdvanceWidth = function (text, fontSize, options) {
    return this.forEachGlyph(text, 0, 0, fontSize, options, function () {});
};

/**
 * @private
 */
Font.prototype.fsSelectionValues = {
    ITALIC: 0x001, //1
    UNDERSCORE: 0x002, //2
    NEGATIVE: 0x004, //4
    OUTLINED: 0x008, //8
    STRIKEOUT: 0x010, //16
    BOLD: 0x020, //32
    REGULAR: 0x040, //64
    USER_TYPO_METRICS: 0x080, //128
    WWS: 0x100, //256
    OBLIQUE: 0x200, //512
};

/**
 * @private
 */
Font.prototype.usWidthClasses = {
    ULTRA_CONDENSED: 1,
    EXTRA_CONDENSED: 2,
    CONDENSED: 3,
    SEMI_CONDENSED: 4,
    MEDIUM: 5,
    SEMI_EXPANDED: 6,
    EXPANDED: 7,
    EXTRA_EXPANDED: 8,
    ULTRA_EXPANDED: 9,
};

/**
 * @private
 */
Font.prototype.usWeightClasses = {
    THIN: 100,
    EXTRA_LIGHT: 200,
    LIGHT: 300,
    NORMAL: 400,
    MEDIUM: 500,
    SEMI_BOLD: 600,
    BOLD: 700,
    EXTRA_BOLD: 800,
    BLACK: 900,
};

// The `cmap` table stores the mappings from characters to glyphs.

function parseCmapTableFormat12(cmap, p) {
    //Skip reserved.
    p.parseUShort();

    // Length in bytes of the sub-tables.
    cmap.length = p.parseULong();
    cmap.language = p.parseULong();

    var groupCount;
    cmap.groupCount = groupCount = p.parseULong();
    cmap.glyphIndexMap = {};

    for (var i = 0; i < groupCount; i += 1) {
        var startCharCode = p.parseULong();
        var endCharCode = p.parseULong();
        var startGlyphId = p.parseULong();

        for (var c = startCharCode; c <= endCharCode; c += 1) {
            cmap.glyphIndexMap[c] = startGlyphId;
            startGlyphId++;
        }
    }
}

function parseCmapTableFormat4(cmap, p, data, start, offset) {
    // Length in bytes of the sub-tables.
    cmap.length = p.parseUShort();
    cmap.language = p.parseUShort();

    // segCount is stored x 2.
    var segCount;
    cmap.segCount = segCount = p.parseUShort() >> 1;

    // Skip searchRange, entrySelector, rangeShift.
    p.skip('uShort', 3);

    // The "unrolled" mapping from character codes to glyph indices.
    cmap.glyphIndexMap = {};
    var endCountParser = new parse.Parser(data, start + offset + 14);
    var startCountParser = new parse.Parser(
        data,
        start + offset + 16 + segCount * 2
    );
    var idDeltaParser = new parse.Parser(
        data,
        start + offset + 16 + segCount * 4
    );
    var idRangeOffsetParser = new parse.Parser(
        data,
        start + offset + 16 + segCount * 6
    );
    var glyphIndexOffset = start + offset + 16 + segCount * 8;
    for (var i = 0; i < segCount - 1; i += 1) {
        var glyphIndex = (void 0);
        var endCount = endCountParser.parseUShort();
        var startCount = startCountParser.parseUShort();
        var idDelta = idDeltaParser.parseShort();
        var idRangeOffset = idRangeOffsetParser.parseUShort();
        for (var c = startCount; c <= endCount; c += 1) {
            if (idRangeOffset !== 0) {
                // The idRangeOffset is relative to the current position in the idRangeOffset array.
                // Take the current offset in the idRangeOffset array.
                glyphIndexOffset =
                    idRangeOffsetParser.offset +
                    idRangeOffsetParser.relativeOffset -
                    2;

                // Add the value of the idRangeOffset, which will move us into the glyphIndex array.
                glyphIndexOffset += idRangeOffset;

                // Then add the character index of the current segment, multiplied by 2 for USHORTs.
                glyphIndexOffset += (c - startCount) * 2;
                glyphIndex = parse.getUShort(data, glyphIndexOffset);
                if (glyphIndex !== 0) {
                    glyphIndex = (glyphIndex + idDelta) & 0xffff;
                }
            } else {
                glyphIndex = (c + idDelta) & 0xffff;
            }

            cmap.glyphIndexMap[c] = glyphIndex;
        }
    }
}

// Parse the `cmap` table. This table stores the mappings from characters to glyphs.
// There are many available formats, but we only support the Windows format 4 and 12.
// This function returns a `CmapEncoding` object or null if no supported format could be found.
function parseCmapTable(data, start) {
    var cmap = {};
    cmap.version = parse.getUShort(data, start);
    check.argument(cmap.version === 0, 'cmap table version should be 0.');

    // The cmap table can contain many sub-tables, each with their own format.
    // We're only interested in a "platform 0" (Unicode format) and "platform 3" (Windows format) table.
    cmap.numTables = parse.getUShort(data, start + 2);
    var offset = -1;
    for (var i = cmap.numTables - 1; i >= 0; i -= 1) {
        var platformId = parse.getUShort(data, start + 4 + i * 8);
        var encodingId = parse.getUShort(data, start + 4 + i * 8 + 2);
        if (
            (platformId === 3 &&
                (encodingId === 0 || encodingId === 1 || encodingId === 10)) ||
            (platformId === 0 &&
                (encodingId === 0 ||
                    encodingId === 1 ||
                    encodingId === 2 ||
                    encodingId === 3 ||
                    encodingId === 4))
        ) {
            offset = parse.getULong(data, start + 4 + i * 8 + 4);
            break;
        }
    }

    if (offset === -1) {
        // There is no cmap table in the font that we support.
        throw new Error('No valid cmap sub-tables found.');
    }

    var p = new parse.Parser(data, start + offset);
    cmap.format = p.parseUShort();

    if (cmap.format === 12) {
        parseCmapTableFormat12(cmap, p);
    } else if (cmap.format === 4) {
        parseCmapTableFormat4(cmap, p, data, start, offset);
    } else {
        throw new Error(
            'Only format 4 and 12 cmap tables are supported (found format ' +
                cmap.format +
                ').'
        );
    }

    return cmap;
}

var cmap = { parse: parseCmapTable };

// The `CFF` table contains the glyph outlines in PostScript format.

// Subroutines are encoded using the negative half of the number space.
// See type 2 chapter 4.7 "Subroutine operators".
function calcCFFSubroutineBias(subrs) {
    var bias;
    if (subrs.length < 1240) {
        bias = 107;
    } else if (subrs.length < 33900) {
        bias = 1131;
    } else {
        bias = 32768;
    }

    return bias;
}

// Parse a `CFF` INDEX array.
// An index array consists of a list of offsets, then a list of objects at those offsets.
function parseCFFIndex(data, start, conversionFn) {
    var offsets = [];
    var objects = [];
    var count = parse.getCard16(data, start);
    var objectOffset;
    var endOffset;
    if (count !== 0) {
        var offsetSize = parse.getByte(data, start + 2);
        objectOffset = start + (count + 1) * offsetSize + 2;
        var pos = start + 3;
        for (var i = 0; i < count + 1; i += 1) {
            offsets.push(parse.getOffset(data, pos, offsetSize));
            pos += offsetSize;
        }

        // The total size of the index array is 4 header bytes + the value of the last offset.
        endOffset = objectOffset + offsets[count];
    } else {
        endOffset = start + 2;
    }

    for (var i$1 = 0; i$1 < offsets.length - 1; i$1 += 1) {
        var value = parse.getBytes(
            data,
            objectOffset + offsets[i$1],
            objectOffset + offsets[i$1 + 1]
        );
        if (conversionFn) {
            value = conversionFn(value);
        }

        objects.push(value);
    }

    return { objects: objects, startOffset: start, endOffset: endOffset };
}

function parseCFFIndexLowMemory(data, start) {
    var offsets = [];
    var count = parse.getCard16(data, start);
    var objectOffset;
    var endOffset;
    if (count !== 0) {
        var offsetSize = parse.getByte(data, start + 2);
        objectOffset = start + (count + 1) * offsetSize + 2;
        var pos = start + 3;
        for (var i = 0; i < count + 1; i += 1) {
            offsets.push(parse.getOffset(data, pos, offsetSize));
            pos += offsetSize;
        }

        // The total size of the index array is 4 header bytes + the value of the last offset.
        endOffset = objectOffset + offsets[count];
    } else {
        endOffset = start + 2;
    }

    return { offsets: offsets, startOffset: start, endOffset: endOffset };
}
function getCffIndexObject(i, offsets, data, start, conversionFn) {
    var count = parse.getCard16(data, start);
    var objectOffset = 0;
    if (count !== 0) {
        var offsetSize = parse.getByte(data, start + 2);
        objectOffset = start + (count + 1) * offsetSize + 2;
    }

    var value = parse.getBytes(
        data,
        objectOffset + offsets[i],
        objectOffset + offsets[i + 1]
    );
    if (conversionFn) {
        value = conversionFn(value);
    }
    return value;
}

// Parse a `CFF` DICT real value.
function parseFloatOperand(parser) {
    var s = '';
    var eof = 15;
    var lookup = [
        '0',
        '1',
        '2',
        '3',
        '4',
        '5',
        '6',
        '7',
        '8',
        '9',
        '.',
        'E',
        'E-',
        null,
        '-' ];
    while (true) {
        var b = parser.parseByte();
        var n1 = b >> 4;
        var n2 = b & 15;

        if (n1 === eof) {
            break;
        }

        s += lookup[n1];

        if (n2 === eof) {
            break;
        }

        s += lookup[n2];
    }

    return parseFloat(s);
}

// Parse a `CFF` DICT operand.
function parseOperand(parser, b0) {
    var b1;
    var b2;
    var b3;
    var b4;
    if (b0 === 28) {
        b1 = parser.parseByte();
        b2 = parser.parseByte();
        return (b1 << 8) | b2;
    }

    if (b0 === 29) {
        b1 = parser.parseByte();
        b2 = parser.parseByte();
        b3 = parser.parseByte();
        b4 = parser.parseByte();
        return (b1 << 24) | (b2 << 16) | (b3 << 8) | b4;
    }

    if (b0 === 30) {
        return parseFloatOperand(parser);
    }

    if (b0 >= 32 && b0 <= 246) {
        return b0 - 139;
    }

    if (b0 >= 247 && b0 <= 250) {
        b1 = parser.parseByte();
        return (b0 - 247) * 256 + b1 + 108;
    }

    if (b0 >= 251 && b0 <= 254) {
        b1 = parser.parseByte();
        return -(b0 - 251) * 256 - b1 - 108;
    }

    throw new Error('Invalid b0 ' + b0);
}

// Convert the entries returned by `parseDict` to a proper dictionary.
// If a value is a list of one, it is unpacked.
function entriesToObject(entries) {
    var o = {};
    for (var i = 0; i < entries.length; i += 1) {
        var key = entries[i][0];
        var values = entries[i][1];
        var value = (void 0);
        if (values.length === 1) {
            value = values[0];
        } else {
            value = values;
        }

        if (o.hasOwnProperty(key) && !isNaN(o[key])) {
            throw new Error('Object ' + o + ' already has key ' + key);
        }

        o[key] = value;
    }

    return o;
}

// Parse a `CFF` DICT object.
// A dictionary contains key-value pairs in a compact tokenized format.
function parseCFFDict(data, start, size) {
    start = start !== undefined ? start : 0;
    var parser = new parse.Parser(data, start);
    var entries = [];
    var operands = [];
    size = size !== undefined ? size : data.length;

    while (parser.relativeOffset < size) {
        var op = parser.parseByte();

        // The first byte for each dict item distinguishes between operator (key) and operand (value).
        // Values <= 21 are operators.
        if (op <= 21) {
            // Two-byte operators have an initial escape byte of 12.
            if (op === 12) {
                op = 1200 + parser.parseByte();
            }

            entries.push([op, operands]);
            operands = [];
        } else {
            // Since the operands (values) come before the operators (keys), we store all operands in a list
            // until we encounter an operator.
            operands.push(parseOperand(parser, op));
        }
    }

    return entriesToObject(entries);
}

// Given a String Index (SID), return the value of the string.
// Strings below index 392 are standard CFF strings and are not encoded in the font.
function getCFFString(strings, index) {
    if (index <= 390) {
        index = cffStandardStrings[index];
    } else {
        index = strings[index - 391];
    }

    return index;
}

// Interpret a dictionary and return a new dictionary with readable keys and values for missing entries.
// This function takes `meta` which is a list of objects containing `operand`, `name` and `default`.
function interpretDict(dict, meta, strings) {
    var newDict = {};
    var value;

    // Because we also want to include missing values, we start out from the meta list
    // and lookup values in the dict.
    for (var i = 0; i < meta.length; i += 1) {
        var m = meta[i];

        if (Array.isArray(m.type)) {
            var values = [];
            values.length = m.type.length;
            for (var j = 0; j < m.type.length; j++) {
                value = dict[m.op] !== undefined ? dict[m.op][j] : undefined;
                if (value === undefined) {
                    value =
                        m.value !== undefined && m.value[j] !== undefined
                            ? m.value[j]
                            : null;
                }
                if (m.type[j] === 'SID') {
                    value = getCFFString(strings, value);
                }
                values[j] = value;
            }
            newDict[m.name] = values;
        } else {
            value = dict[m.op];
            if (value === undefined) {
                value = m.value !== undefined ? m.value : null;
            }

            if (m.type === 'SID') {
                value = getCFFString(strings, value);
            }
            newDict[m.name] = value;
        }
    }

    return newDict;
}

// Parse the CFF header.
function parseCFFHeader(data, start) {
    var header = {};
    header.formatMajor = parse.getCard8(data, start);
    header.formatMinor = parse.getCard8(data, start + 1);
    header.size = parse.getCard8(data, start + 2);
    header.offsetSize = parse.getCard8(data, start + 3);
    header.startOffset = start;
    header.endOffset = start + 4;
    return header;
}

var TOP_DICT_META = [
    { name: 'version', op: 0, type: 'SID' },
    { name: 'notice', op: 1, type: 'SID' },
    { name: 'copyright', op: 1200, type: 'SID' },
    { name: 'fullName', op: 2, type: 'SID' },
    { name: 'familyName', op: 3, type: 'SID' },
    { name: 'weight', op: 4, type: 'SID' },
    { name: 'isFixedPitch', op: 1201, type: 'number', value: 0 },
    { name: 'italicAngle', op: 1202, type: 'number', value: 0 },
    { name: 'underlinePosition', op: 1203, type: 'number', value: -100 },
    { name: 'underlineThickness', op: 1204, type: 'number', value: 50 },
    { name: 'paintType', op: 1205, type: 'number', value: 0 },
    { name: 'charstringType', op: 1206, type: 'number', value: 2 },
    {
        name: 'fontMatrix',
        op: 1207,
        type: ['real', 'real', 'real', 'real', 'real', 'real'],
        value: [0.001, 0, 0, 0.001, 0, 0],
    },
    { name: 'uniqueId', op: 13, type: 'number' },
    {
        name: 'fontBBox',
        op: 5,
        type: ['number', 'number', 'number', 'number'],
        value: [0, 0, 0, 0],
    },
    { name: 'strokeWidth', op: 1208, type: 'number', value: 0 },
    { name: 'xuid', op: 14, type: [], value: null },
    { name: 'charset', op: 15, type: 'offset', value: 0 },
    { name: 'encoding', op: 16, type: 'offset', value: 0 },
    { name: 'charStrings', op: 17, type: 'offset', value: 0 },
    { name: 'private', op: 18, type: ['number', 'offset'], value: [0, 0] },
    { name: 'ros', op: 1230, type: ['SID', 'SID', 'number'] },
    { name: 'cidFontVersion', op: 1231, type: 'number', value: 0 },
    { name: 'cidFontRevision', op: 1232, type: 'number', value: 0 },
    { name: 'cidFontType', op: 1233, type: 'number', value: 0 },
    { name: 'cidCount', op: 1234, type: 'number', value: 8720 },
    { name: 'uidBase', op: 1235, type: 'number' },
    { name: 'fdArray', op: 1236, type: 'offset' },
    { name: 'fdSelect', op: 1237, type: 'offset' },
    { name: 'fontName', op: 1238, type: 'SID' } ];

var PRIVATE_DICT_META = [
    { name: 'subrs', op: 19, type: 'offset', value: 0 },
    { name: 'defaultWidthX', op: 20, type: 'number', value: 0 },
    { name: 'nominalWidthX', op: 21, type: 'number', value: 0 } ];

// Parse the CFF top dictionary. A CFF table can contain multiple fonts, each with their own top dictionary.
// The top dictionary contains the essential metadata for the font, together with the private dictionary.
function parseCFFTopDict(data, strings) {
    var dict = parseCFFDict(data, 0, data.byteLength);
    return interpretDict(dict, TOP_DICT_META, strings);
}

// Parse the CFF private dictionary. We don't fully parse out all the values, only the ones we need.
function parseCFFPrivateDict(data, start, size, strings) {
    var dict = parseCFFDict(data, start, size);
    return interpretDict(dict, PRIVATE_DICT_META, strings);
}

// Returns a list of "Top DICT"s found using an INDEX list.
// Used to read both the usual high-level Top DICTs and also the FDArray
// discovered inside CID-keyed fonts.  When a Top DICT has a reference to
// a Private DICT that is read and saved into the Top DICT.
//
// In addition to the expected/optional values as outlined in TOP_DICT_META
// the following values might be saved into the Top DICT.
//
//    _subrs []        array of local CFF subroutines from Private DICT
//    _subrsBias       bias value computed from number of subroutines
//                      (see calcCFFSubroutineBias() and parseCFFCharstring())
//    _defaultWidthX   default widths for CFF characters
//    _nominalWidthX   bias added to width embedded within glyph description
//
//    _privateDict     saved copy of parsed Private DICT from Top DICT
function gatherCFFTopDicts(data, start, cffIndex, strings) {
    var topDictArray = [];
    for (var iTopDict = 0; iTopDict < cffIndex.length; iTopDict += 1) {
        var topDictData = new DataView(
            new Uint8Array(cffIndex[iTopDict]).buffer
        );
        var topDict = parseCFFTopDict(topDictData, strings);
        topDict._subrs = [];
        topDict._subrsBias = 0;
        topDict._defaultWidthX = 0;
        topDict._nominalWidthX = 0;
        var privateSize = topDict.private[0];
        var privateOffset = topDict.private[1];
        if (privateSize !== 0 && privateOffset !== 0) {
            var privateDict = parseCFFPrivateDict(
                data,
                privateOffset + start,
                privateSize,
                strings
            );
            topDict._defaultWidthX = privateDict.defaultWidthX;
            topDict._nominalWidthX = privateDict.nominalWidthX;
            if (privateDict.subrs !== 0) {
                var subrOffset = privateOffset + privateDict.subrs;
                var subrIndex = parseCFFIndex(data, subrOffset + start);
                topDict._subrs = subrIndex.objects;
                topDict._subrsBias = calcCFFSubroutineBias(topDict._subrs);
            }
            topDict._privateDict = privateDict;
        }
        topDictArray.push(topDict);
    }
    return topDictArray;
}

// Parse the CFF charset table, which contains internal names for all the glyphs.
// This function will return a list of glyph names.
// See Adobe TN #5176 chapter 13, "Charsets".
function parseCFFCharset(data, start, nGlyphs, strings) {
    var sid;
    var count;
    var parser = new parse.Parser(data, start);

    // The .notdef glyph is not included, so subtract 1.
    nGlyphs -= 1;
    var charset = ['.notdef'];

    var format = parser.parseCard8();
    if (format === 0) {
        for (var i = 0; i < nGlyphs; i += 1) {
            sid = parser.parseSID();
            charset.push(getCFFString(strings, sid));
        }
    } else if (format === 1) {
        while (charset.length <= nGlyphs) {
            sid = parser.parseSID();
            count = parser.parseCard8();
            for (var i$1 = 0; i$1 <= count; i$1 += 1) {
                charset.push(getCFFString(strings, sid));
                sid += 1;
            }
        }
    } else if (format === 2) {
        while (charset.length <= nGlyphs) {
            sid = parser.parseSID();
            count = parser.parseCard16();
            for (var i$2 = 0; i$2 <= count; i$2 += 1) {
                charset.push(getCFFString(strings, sid));
                sid += 1;
            }
        }
    } else {
        throw new Error('Unknown charset format ' + format);
    }

    return charset;
}

// Parse the CFF encoding data. Only one encoding can be specified per font.
// See Adobe TN #5176 chapter 12, "Encodings".
function parseCFFEncoding(data, start, charset) {
    var code;
    var enc = {};
    var parser = new parse.Parser(data, start);
    var format = parser.parseCard8();
    if (format === 0) {
        var nCodes = parser.parseCard8();
        for (var i = 0; i < nCodes; i += 1) {
            code = parser.parseCard8();
            enc[code] = i;
        }
    } else if (format === 1) {
        var nRanges = parser.parseCard8();
        code = 1;
        for (var i$1 = 0; i$1 < nRanges; i$1 += 1) {
            var first = parser.parseCard8();
            var nLeft = parser.parseCard8();
            for (var j = first; j <= first + nLeft; j += 1) {
                enc[j] = code;
                code += 1;
            }
        }
    } else {
        throw new Error('Unknown encoding format ' + format);
    }

    return new CffEncoding(enc, charset);
}

// Take in charstring code and return a Glyph object.
// The encoding is described in the Type 2 Charstring Format
// https://www.microsoft.com/typography/OTSPEC/charstr2.htm
function parseCFFCharstring(font, glyph, code) {
    var c1x;
    var c1y;
    var c2x;
    var c2y;
    var p = new Path();
    var stack = [];
    var nStems = 0;
    var haveWidth = false;
    var open = false;
    var x = 0;
    var y = 0;
    var subrs;
    var subrsBias;
    var defaultWidthX;
    var nominalWidthX;
    if (font.isCIDFont) {
        var fdIndex = font.tables.cff.topDict._fdSelect[glyph.index];
        var fdDict = font.tables.cff.topDict._fdArray[fdIndex];
        subrs = fdDict._subrs;
        subrsBias = fdDict._subrsBias;
        defaultWidthX = fdDict._defaultWidthX;
        nominalWidthX = fdDict._nominalWidthX;
    } else {
        subrs = font.tables.cff.topDict._subrs;
        subrsBias = font.tables.cff.topDict._subrsBias;
        defaultWidthX = font.tables.cff.topDict._defaultWidthX;
        nominalWidthX = font.tables.cff.topDict._nominalWidthX;
    }
    var width = defaultWidthX;

    function newContour(x, y) {
        if (open) {
            p.closePath();
        }

        p.moveTo(x, y);
        open = true;
    }

    function parseStems() {
        var hasWidthArg;

        // The number of stem operators on the stack is always even.
        // If the value is uneven, that means a width is specified.
        hasWidthArg = stack.length % 2 !== 0;
        if (hasWidthArg && !haveWidth) {
            width = stack.shift() + nominalWidthX;
        }

        nStems += stack.length >> 1;
        stack.length = 0;
        haveWidth = true;
    }

    function parse(code) {
        var b1;
        var b2;
        var b3;
        var b4;
        var codeIndex;
        var subrCode;
        var jpx;
        var jpy;
        var c3x;
        var c3y;
        var c4x;
        var c4y;

        var i = 0;
        while (i < code.length) {
            var v = code[i];
            i += 1;
            switch (v) {
                case 1: // hstem
                    parseStems();
                    break;
                case 3: // vstem
                    parseStems();
                    break;
                case 4: // vmoveto
                    if (stack.length > 1 && !haveWidth) {
                        width = stack.shift() + nominalWidthX;
                        haveWidth = true;
                    }

                    y += stack.pop();
                    newContour(x, y);
                    break;
                case 5: // rlineto
                    while (stack.length > 0) {
                        x += stack.shift();
                        y += stack.shift();
                        p.lineTo(x, y);
                    }

                    break;
                case 6: // hlineto
                    while (stack.length > 0) {
                        x += stack.shift();
                        p.lineTo(x, y);
                        if (stack.length === 0) {
                            break;
                        }

                        y += stack.shift();
                        p.lineTo(x, y);
                    }

                    break;
                case 7: // vlineto
                    while (stack.length > 0) {
                        y += stack.shift();
                        p.lineTo(x, y);
                        if (stack.length === 0) {
                            break;
                        }

                        x += stack.shift();
                        p.lineTo(x, y);
                    }

                    break;
                case 8: // rrcurveto
                    while (stack.length > 0) {
                        c1x = x + stack.shift();
                        c1y = y + stack.shift();
                        c2x = c1x + stack.shift();
                        c2y = c1y + stack.shift();
                        x = c2x + stack.shift();
                        y = c2y + stack.shift();
                        p.curveTo(c1x, c1y, c2x, c2y, x, y);
                    }

                    break;
                case 10: // callsubr
                    codeIndex = stack.pop() + subrsBias;
                    subrCode = subrs[codeIndex];
                    if (subrCode) {
                        parse(subrCode);
                    }

                    break;
                case 11: // return
                    return;
                case 12: // flex operators
                    v = code[i];
                    i += 1;
                    switch (v) {
                        case 35: // flex
                            // |- dx1 dy1 dx2 dy2 dx3 dy3 dx4 dy4 dx5 dy5 dx6 dy6 fd flex (12 35) |-
                            c1x = x + stack.shift(); // dx1
                            c1y = y + stack.shift(); // dy1
                            c2x = c1x + stack.shift(); // dx2
                            c2y = c1y + stack.shift(); // dy2
                            jpx = c2x + stack.shift(); // dx3
                            jpy = c2y + stack.shift(); // dy3
                            c3x = jpx + stack.shift(); // dx4
                            c3y = jpy + stack.shift(); // dy4
                            c4x = c3x + stack.shift(); // dx5
                            c4y = c3y + stack.shift(); // dy5
                            x = c4x + stack.shift(); // dx6
                            y = c4y + stack.shift(); // dy6
                            stack.shift(); // flex depth
                            p.curveTo(c1x, c1y, c2x, c2y, jpx, jpy);
                            p.curveTo(c3x, c3y, c4x, c4y, x, y);
                            break;
                        case 34: // hflex
                            // |- dx1 dx2 dy2 dx3 dx4 dx5 dx6 hflex (12 34) |-
                            c1x = x + stack.shift(); // dx1
                            c1y = y; // dy1
                            c2x = c1x + stack.shift(); // dx2
                            c2y = c1y + stack.shift(); // dy2
                            jpx = c2x + stack.shift(); // dx3
                            jpy = c2y; // dy3
                            c3x = jpx + stack.shift(); // dx4
                            c3y = c2y; // dy4
                            c4x = c3x + stack.shift(); // dx5
                            c4y = y; // dy5
                            x = c4x + stack.shift(); // dx6
                            p.curveTo(c1x, c1y, c2x, c2y, jpx, jpy);
                            p.curveTo(c3x, c3y, c4x, c4y, x, y);
                            break;
                        case 36: // hflex1
                            // |- dx1 dy1 dx2 dy2 dx3 dx4 dx5 dy5 dx6 hflex1 (12 36) |-
                            c1x = x + stack.shift(); // dx1
                            c1y = y + stack.shift(); // dy1
                            c2x = c1x + stack.shift(); // dx2
                            c2y = c1y + stack.shift(); // dy2
                            jpx = c2x + stack.shift(); // dx3
                            jpy = c2y; // dy3
                            c3x = jpx + stack.shift(); // dx4
                            c3y = c2y; // dy4
                            c4x = c3x + stack.shift(); // dx5
                            c4y = c3y + stack.shift(); // dy5
                            x = c4x + stack.shift(); // dx6
                            p.curveTo(c1x, c1y, c2x, c2y, jpx, jpy);
                            p.curveTo(c3x, c3y, c4x, c4y, x, y);
                            break;
                        case 37: // flex1
                            // |- dx1 dy1 dx2 dy2 dx3 dy3 dx4 dy4 dx5 dy5 d6 flex1 (12 37) |-
                            c1x = x + stack.shift(); // dx1
                            c1y = y + stack.shift(); // dy1
                            c2x = c1x + stack.shift(); // dx2
                            c2y = c1y + stack.shift(); // dy2
                            jpx = c2x + stack.shift(); // dx3
                            jpy = c2y + stack.shift(); // dy3
                            c3x = jpx + stack.shift(); // dx4
                            c3y = jpy + stack.shift(); // dy4
                            c4x = c3x + stack.shift(); // dx5
                            c4y = c3y + stack.shift(); // dy5
                            if (Math.abs(c4x - x) > Math.abs(c4y - y)) {
                                x = c4x + stack.shift();
                            } else {
                                y = c4y + stack.shift();
                            }

                            p.curveTo(c1x, c1y, c2x, c2y, jpx, jpy);
                            p.curveTo(c3x, c3y, c4x, c4y, x, y);
                            break;
                        default:
                            console.log(
                                'Glyph ' +
                                    glyph.index +
                                    ': unknown operator ' +
                                    1200 +
                                    v
                            );
                            stack.length = 0;
                    }
                    break;
                case 14: // endchar
                    if (stack.length > 0 && !haveWidth) {
                        width = stack.shift() + nominalWidthX;
                        haveWidth = true;
                    }

                    if (open) {
                        p.closePath();
                        open = false;
                    }

                    break;
                case 18: // hstemhm
                    parseStems();
                    break;
                case 19: // hintmask
                case 20: // cntrmask
                    parseStems();
                    i += (nStems + 7) >> 3;
                    break;
                case 21: // rmoveto
                    if (stack.length > 2 && !haveWidth) {
                        width = stack.shift() + nominalWidthX;
                        haveWidth = true;
                    }

                    y += stack.pop();
                    x += stack.pop();
                    newContour(x, y);
                    break;
                case 22: // hmoveto
                    if (stack.length > 1 && !haveWidth) {
                        width = stack.shift() + nominalWidthX;
                        haveWidth = true;
                    }

                    x += stack.pop();
                    newContour(x, y);
                    break;
                case 23: // vstemhm
                    parseStems();
                    break;
                case 24: // rcurveline
                    while (stack.length > 2) {
                        c1x = x + stack.shift();
                        c1y = y + stack.shift();
                        c2x = c1x + stack.shift();
                        c2y = c1y + stack.shift();
                        x = c2x + stack.shift();
                        y = c2y + stack.shift();
                        p.curveTo(c1x, c1y, c2x, c2y, x, y);
                    }

                    x += stack.shift();
                    y += stack.shift();
                    p.lineTo(x, y);
                    break;
                case 25: // rlinecurve
                    while (stack.length > 6) {
                        x += stack.shift();
                        y += stack.shift();
                        p.lineTo(x, y);
                    }

                    c1x = x + stack.shift();
                    c1y = y + stack.shift();
                    c2x = c1x + stack.shift();
                    c2y = c1y + stack.shift();
                    x = c2x + stack.shift();
                    y = c2y + stack.shift();
                    p.curveTo(c1x, c1y, c2x, c2y, x, y);
                    break;
                case 26: // vvcurveto
                    if (stack.length % 2) {
                        x += stack.shift();
                    }

                    while (stack.length > 0) {
                        c1x = x;
                        c1y = y + stack.shift();
                        c2x = c1x + stack.shift();
                        c2y = c1y + stack.shift();
                        x = c2x;
                        y = c2y + stack.shift();
                        p.curveTo(c1x, c1y, c2x, c2y, x, y);
                    }

                    break;
                case 27: // hhcurveto
                    if (stack.length % 2) {
                        y += stack.shift();
                    }

                    while (stack.length > 0) {
                        c1x = x + stack.shift();
                        c1y = y;
                        c2x = c1x + stack.shift();
                        c2y = c1y + stack.shift();
                        x = c2x + stack.shift();
                        y = c2y;
                        p.curveTo(c1x, c1y, c2x, c2y, x, y);
                    }

                    break;
                case 28: // shortint
                    b1 = code[i];
                    b2 = code[i + 1];
                    stack.push(((b1 << 24) | (b2 << 16)) >> 16);
                    i += 2;
                    break;
                case 29: // callgsubr
                    codeIndex = stack.pop() + font.gsubrsBias;
                    subrCode = font.gsubrs[codeIndex];
                    if (subrCode) {
                        parse(subrCode);
                    }

                    break;
                case 30: // vhcurveto
                    while (stack.length > 0) {
                        c1x = x;
                        c1y = y + stack.shift();
                        c2x = c1x + stack.shift();
                        c2y = c1y + stack.shift();
                        x = c2x + stack.shift();
                        y = c2y + (stack.length === 1 ? stack.shift() : 0);
                        p.curveTo(c1x, c1y, c2x, c2y, x, y);
                        if (stack.length === 0) {
                            break;
                        }

                        c1x = x + stack.shift();
                        c1y = y;
                        c2x = c1x + stack.shift();
                        c2y = c1y + stack.shift();
                        y = c2y + stack.shift();
                        x = c2x + (stack.length === 1 ? stack.shift() : 0);
                        p.curveTo(c1x, c1y, c2x, c2y, x, y);
                    }

                    break;
                case 31: // hvcurveto
                    while (stack.length > 0) {
                        c1x = x + stack.shift();
                        c1y = y;
                        c2x = c1x + stack.shift();
                        c2y = c1y + stack.shift();
                        y = c2y + stack.shift();
                        x = c2x + (stack.length === 1 ? stack.shift() : 0);
                        p.curveTo(c1x, c1y, c2x, c2y, x, y);
                        if (stack.length === 0) {
                            break;
                        }

                        c1x = x;
                        c1y = y + stack.shift();
                        c2x = c1x + stack.shift();
                        c2y = c1y + stack.shift();
                        x = c2x + stack.shift();
                        y = c2y + (stack.length === 1 ? stack.shift() : 0);
                        p.curveTo(c1x, c1y, c2x, c2y, x, y);
                    }

                    break;
                default:
                    if (v < 32) {
                        console.log(
                            'Glyph ' + glyph.index + ': unknown operator ' + v
                        );
                    } else if (v < 247) {
                        stack.push(v - 139);
                    } else if (v < 251) {
                        b1 = code[i];
                        i += 1;
                        stack.push((v - 247) * 256 + b1 + 108);
                    } else if (v < 255) {
                        b1 = code[i];
                        i += 1;
                        stack.push(-(v - 251) * 256 - b1 - 108);
                    } else {
                        b1 = code[i];
                        b2 = code[i + 1];
                        b3 = code[i + 2];
                        b4 = code[i + 3];
                        i += 4;
                        stack.push(
                            ((b1 << 24) | (b2 << 16) | (b3 << 8) | b4) / 65536
                        );
                    }
            }
        }
    }

    parse(code);

    glyph.advanceWidth = width;
    return p;
}

function parseCFFFDSelect(data, start, nGlyphs, fdArrayCount) {
    var fdSelect = [];
    var fdIndex;
    var parser = new parse.Parser(data, start);
    var format = parser.parseCard8();
    if (format === 0) {
        // Simple list of nGlyphs elements
        for (var iGid = 0; iGid < nGlyphs; iGid++) {
            fdIndex = parser.parseCard8();
            if (fdIndex >= fdArrayCount) {
                throw new Error(
                    'CFF table CID Font FDSelect has bad FD index value ' +
                        fdIndex +
                        ' (FD count ' +
                        fdArrayCount +
                        ')'
                );
            }
            fdSelect.push(fdIndex);
        }
    } else if (format === 3) {
        // Ranges
        var nRanges = parser.parseCard16();
        var first = parser.parseCard16();
        if (first !== 0) {
            throw new Error(
                'CFF Table CID Font FDSelect format 3 range has bad initial GID ' +
                    first
            );
        }
        var next;
        for (var iRange = 0; iRange < nRanges; iRange++) {
            fdIndex = parser.parseCard8();
            next = parser.parseCard16();
            if (fdIndex >= fdArrayCount) {
                throw new Error(
                    'CFF table CID Font FDSelect has bad FD index value ' +
                        fdIndex +
                        ' (FD count ' +
                        fdArrayCount +
                        ')'
                );
            }
            if (next > nGlyphs) {
                throw new Error(
                    'CFF Table CID Font FDSelect format 3 range has bad GID ' +
                        next
                );
            }
            for (; first < next; first++) {
                fdSelect.push(fdIndex);
            }
            first = next;
        }
        if (next !== nGlyphs) {
            throw new Error(
                'CFF Table CID Font FDSelect format 3 range has bad final GID ' +
                    next
            );
        }
    } else {
        throw new Error(
            'CFF Table CID Font FDSelect table has unsupported format ' + format
        );
    }
    return fdSelect;
}

// Parse the `CFF` table, which contains the glyph outlines in PostScript format.
function parseCFFTable(data, start, font, opt) {
    font.tables.cff = {};
    var header = parseCFFHeader(data, start);
    var nameIndex = parseCFFIndex(
        data,
        header.endOffset,
        parse.bytesToString
    );
    var topDictIndex = parseCFFIndex(data, nameIndex.endOffset);
    var stringIndex = parseCFFIndex(
        data,
        topDictIndex.endOffset,
        parse.bytesToString
    );
    var globalSubrIndex = parseCFFIndex(data, stringIndex.endOffset);
    font.gsubrs = globalSubrIndex.objects;
    font.gsubrsBias = calcCFFSubroutineBias(font.gsubrs);

    var topDictArray = gatherCFFTopDicts(
        data,
        start,
        topDictIndex.objects,
        stringIndex.objects
    );
    if (topDictArray.length !== 1) {
        throw new Error(
            "CFF table has too many fonts in 'FontSet' - count of fonts NameIndex.length = " +
                topDictArray.length
        );
    }

    var topDict = topDictArray[0];
    font.tables.cff.topDict = topDict;

    if (topDict._privateDict) {
        font.defaultWidthX = topDict._privateDict.defaultWidthX;
        font.nominalWidthX = topDict._privateDict.nominalWidthX;
    }

    if (topDict.ros[0] !== undefined && topDict.ros[1] !== undefined) {
        font.isCIDFont = true;
    }

    if (font.isCIDFont) {
        var fdArrayOffset = topDict.fdArray;
        var fdSelectOffset = topDict.fdSelect;
        if (fdArrayOffset === 0 || fdSelectOffset === 0) {
            throw new Error(
                'Font is marked as a CID font, but FDArray and/or FDSelect information is missing'
            );
        }
        fdArrayOffset += start;
        var fdArrayIndex = parseCFFIndex(data, fdArrayOffset);
        var fdArray = gatherCFFTopDicts(
            data,
            start,
            fdArrayIndex.objects,
            stringIndex.objects
        );
        topDict._fdArray = fdArray;
        fdSelectOffset += start;
        topDict._fdSelect = parseCFFFDSelect(
            data,
            fdSelectOffset,
            font.numGlyphs,
            fdArray.length
        );
    }

    var privateDictOffset = start + topDict.private[1];
    var privateDict = parseCFFPrivateDict(
        data,
        privateDictOffset,
        topDict.private[0],
        stringIndex.objects
    );
    font.defaultWidthX = privateDict.defaultWidthX;
    font.nominalWidthX = privateDict.nominalWidthX;

    if (privateDict.subrs !== 0) {
        var subrOffset = privateDictOffset + privateDict.subrs;
        var subrIndex = parseCFFIndex(data, subrOffset);
        font.subrs = subrIndex.objects;
        font.subrsBias = calcCFFSubroutineBias(font.subrs);
    } else {
        font.subrs = [];
        font.subrsBias = 0;
    }

    // Offsets in the top dict are relative to the beginning of the CFF data, so add the CFF start offset.
    var charStringsIndex;
    if (opt.lowMemory) {
        charStringsIndex = parseCFFIndexLowMemory(
            data,
            start + topDict.charStrings
        );
        font.nGlyphs = charStringsIndex.offsets.length;
    } else {
        charStringsIndex = parseCFFIndex(data, start + topDict.charStrings);
        font.nGlyphs = charStringsIndex.objects.length;
    }

    var charset = parseCFFCharset(
        data,
        start + topDict.charset,
        font.nGlyphs,
        stringIndex.objects
    );
    if (topDict.encoding === 0) {
        // Standard encoding
        font.cffEncoding = new CffEncoding(cffStandardEncoding, charset);
    } else if (topDict.encoding === 1) {
        // Expert encoding
        font.cffEncoding = new CffEncoding(cffExpertEncoding, charset);
    } else {
        font.cffEncoding = parseCFFEncoding(
            data,
            start + topDict.encoding,
            charset
        );
    }

    // Prefer the CMAP encoding to the CFF encoding.
    font.encoding = font.encoding || font.cffEncoding;

    font.glyphs = new glyphset.GlyphSet(font);
    if (opt.lowMemory) {
        font._push = function (i) {
            var charString = getCffIndexObject(
                i,
                charStringsIndex.offsets,
                data,
                start + topDict.charStrings
            );
            font.glyphs.push(
                i,
                glyphset.cffGlyphLoader(font, i, parseCFFCharstring, charString)
            );
        };
    } else {
        for (var i = 0; i < font.nGlyphs; i += 1) {
            var charString = charStringsIndex.objects[i];
            font.glyphs.push(
                i,
                glyphset.cffGlyphLoader(font, i, parseCFFCharstring, charString)
            );
        }
    }
}

var cff = { parse: parseCFFTable };

// The `fvar` table stores font variation axes and instances.

function parseFvarAxis(data, start, names) {
    var axis = {};
    var p = new parse.Parser(data, start);
    axis.tag = p.parseTag();
    axis.minValue = p.parseFixed();
    axis.defaultValue = p.parseFixed();
    axis.maxValue = p.parseFixed();
    p.skip('uShort', 1); // reserved for flags; no values defined
    axis.name = names[p.parseUShort()] || {};
    return axis;
}

function parseFvarInstance(data, start, axes, names) {
    var inst = {};
    var p = new parse.Parser(data, start);
    inst.name = names[p.parseUShort()] || {};
    p.skip('uShort', 1); // reserved for flags; no values defined

    inst.coordinates = {};
    for (var i = 0; i < axes.length; ++i) {
        inst.coordinates[axes[i].tag] = p.parseFixed();
    }

    return inst;
}

function parseFvarTable(data, start, names) {
    var p = new parse.Parser(data, start);
    var tableVersion = p.parseULong();
    check.argument(
        tableVersion === 0x00010000,
        'Unsupported fvar table version.'
    );
    var offsetToData = p.parseOffset16();
    // Skip countSizePairs.
    p.skip('uShort', 1);
    var axisCount = p.parseUShort();
    var axisSize = p.parseUShort();
    var instanceCount = p.parseUShort();
    var instanceSize = p.parseUShort();

    var axes = [];
    for (var i = 0; i < axisCount; i++) {
        axes.push(
            parseFvarAxis(data, start + offsetToData + i * axisSize, names)
        );
    }

    var instances = [];
    var instanceStart = start + offsetToData + axisCount * axisSize;
    for (var j = 0; j < instanceCount; j++) {
        instances.push(
            parseFvarInstance(
                data,
                instanceStart + j * instanceSize,
                axes,
                names
            )
        );
    }

    return { axes: axes, instances: instances };
}

var fvar = { parse: parseFvarTable };

// The `GDEF` table contains various glyph properties

var attachList = function() {
    return {
        coverage: this.parsePointer(Parser.coverage),
        attachPoints: this.parseList(Parser.pointer(Parser.uShortList))
    };
};

var caretValue = function() {
    var format = this.parseUShort();
    check.argument(format === 1 || format === 2 || format === 3,
        'Unsupported CaretValue table version.');
    if (format === 1) {
        return { coordinate: this.parseShort() };
    } else if (format === 2) {
        return { pointindex: this.parseShort() };
    } else if (format === 3) {
        // Device / Variation Index tables unsupported
        return { coordinate: this.parseShort() };
    }
};

var ligGlyph = function() {
    return this.parseList(Parser.pointer(caretValue));
};

var ligCaretList = function() {
    return {
        coverage: this.parsePointer(Parser.coverage),
        ligGlyphs: this.parseList(Parser.pointer(ligGlyph))
    };
};

var markGlyphSets = function() {
    this.parseUShort(); // Version
    return this.parseList(Parser.pointer(Parser.coverage));
};

function parseGDEFTable(data, start) {
    start = start || 0;
    var p = new Parser(data, start);
    var tableVersion = p.parseVersion(1);
    check.argument(tableVersion === 1 || tableVersion === 1.2 || tableVersion === 1.3,
        'Unsupported GDEF table version.');
    var gdef = {
        version: tableVersion,
        classDef: p.parsePointer(Parser.classDef),
        attachList: p.parsePointer(attachList),
        ligCaretList: p.parsePointer(ligCaretList),
        markAttachClassDef: p.parsePointer(Parser.classDef)
    };
    if (tableVersion >= 1.2) {
        gdef.markGlyphSets = p.parsePointer(markGlyphSets);
    }
    return gdef;
}
var gdef = { parse: parseGDEFTable };

// The `GPOS` table contains kerning pairs, among other things.

var subtableParsers = new Array(10); // subtableParsers[0] is unused

// https://docs.microsoft.com/en-us/typography/opentype/spec/gpos#lookup-type-1-single-adjustment-positioning-subtable
// this = Parser instance
subtableParsers[1] = function parseLookup1() {
    var start = this.offset + this.relativeOffset;
    var posformat = this.parseUShort();
    if (posformat === 1) {
        return {
            posFormat: 1,
            coverage: this.parsePointer(Parser.coverage),
            value: this.parseValueRecord(),
        };
    } else if (posformat === 2) {
        return {
            posFormat: 2,
            coverage: this.parsePointer(Parser.coverage),
            values: this.parseValueRecordList(),
        };
    }
    check.assert(
        false,
        '0x' +
            start.toString(16) +
            ': GPOS lookup type 1 format must be 1 or 2.'
    );
};

// https://docs.microsoft.com/en-us/typography/opentype/spec/gpos#lookup-type-2-pair-adjustment-positioning-subtable
subtableParsers[2] = function parseLookup2() {
    var start = this.offset + this.relativeOffset;
    var posFormat = this.parseUShort();
    check.assert(
        posFormat === 1 || posFormat === 2,
        '0x' +
            start.toString(16) +
            ': GPOS lookup type 2 format must be 1 or 2.'
    );
    var coverage = this.parsePointer(Parser.coverage);
    var valueFormat1 = this.parseUShort();
    var valueFormat2 = this.parseUShort();
    if (posFormat === 1) {
        // Adjustments for Glyph Pairs
        return {
            posFormat: posFormat,
            coverage: coverage,
            valueFormat1: valueFormat1,
            valueFormat2: valueFormat2,
            pairSets: this.parseList(
                Parser.pointer(
                    Parser.list(function () {
                        return {
                            // pairValueRecord
                            secondGlyph: this.parseUShort(),
                            value1: this.parseValueRecord(valueFormat1),
                            value2: this.parseValueRecord(valueFormat2),
                        };
                    })
                )
            ),
        };
    } else if (posFormat === 2) {
        var classDef1 = this.parsePointer(Parser.classDef);
        var classDef2 = this.parsePointer(Parser.classDef);
        var class1Count = this.parseUShort();
        var class2Count = this.parseUShort();
        return {
            // Class Pair Adjustment
            posFormat: posFormat,
            coverage: coverage,
            valueFormat1: valueFormat1,
            valueFormat2: valueFormat2,
            classDef1: classDef1,
            classDef2: classDef2,
            class1Count: class1Count,
            class2Count: class2Count,
            classRecords: this.parseList(
                class1Count,
                Parser.list(class2Count, function () {
                    return {
                        value1: this.parseValueRecord(valueFormat1),
                        value2: this.parseValueRecord(valueFormat2),
                    };
                })
            ),
        };
    }
};

subtableParsers[3] = function parseLookup3() {
    return { error: 'GPOS Lookup 3 not supported' };
};
subtableParsers[4] = function parseLookup4() {
    return { error: 'GPOS Lookup 4 not supported' };
};
subtableParsers[5] = function parseLookup5() {
    return { error: 'GPOS Lookup 5 not supported' };
};
subtableParsers[6] = function parseLookup6() {
    return { error: 'GPOS Lookup 6 not supported' };
};
subtableParsers[7] = function parseLookup7() {
    return { error: 'GPOS Lookup 7 not supported' };
};
subtableParsers[8] = function parseLookup8() {
    return { error: 'GPOS Lookup 8 not supported' };
};
subtableParsers[9] = function parseLookup9() {
    return { error: 'GPOS Lookup 9 not supported' };
};

// https://docs.microsoft.com/en-us/typography/opentype/spec/gpos
function parseGposTable(data, start) {
    start = start || 0;
    var p = new Parser(data, start);
    var tableVersion = p.parseVersion(1);
    check.argument(
        tableVersion === 1 || tableVersion === 1.1,
        'Unsupported GPOS table version ' + tableVersion
    );

    if (tableVersion === 1) {
        return {
            version: tableVersion,
            scripts: p.parseScriptList(),
            features: p.parseFeatureList(),
            lookups: p.parseLookupList(subtableParsers),
        };
    } else {
        return {
            version: tableVersion,
            scripts: p.parseScriptList(),
            features: p.parseFeatureList(),
            lookups: p.parseLookupList(subtableParsers),
            variations: p.parseFeatureVariationsList(),
        };
    }
}

var gpos = { parse: parseGposTable };

// The `GSUB` table contains ligatures, among other things.

var subtableParsers$1 = new Array(9); // subtableParsers[0] is unused

// https://www.microsoft.com/typography/OTSPEC/GSUB.htm#SS
subtableParsers$1[1] = function parseLookup1() {
    var start = this.offset + this.relativeOffset;
    var substFormat = this.parseUShort();
    if (substFormat === 1) {
        return {
            substFormat: 1,
            coverage: this.parsePointer(Parser.coverage),
            deltaGlyphId: this.parseUShort(),
        };
    } else if (substFormat === 2) {
        return {
            substFormat: 2,
            coverage: this.parsePointer(Parser.coverage),
            substitute: this.parseOffset16List(),
        };
    }
    check.assert(
        false,
        '0x' + start.toString(16) + ': lookup type 1 format must be 1 or 2.'
    );
};

// https://www.microsoft.com/typography/OTSPEC/GSUB.htm#MS
subtableParsers$1[2] = function parseLookup2() {
    var substFormat = this.parseUShort();
    check.argument(
        substFormat === 1,
        'GSUB Multiple Substitution Subtable identifier-format must be 1'
    );
    return {
        substFormat: substFormat,
        coverage: this.parsePointer(Parser.coverage),
        sequences: this.parseListOfLists(),
    };
};

// https://www.microsoft.com/typography/OTSPEC/GSUB.htm#AS
subtableParsers$1[3] = function parseLookup3() {
    var substFormat = this.parseUShort();
    check.argument(
        substFormat === 1,
        'GSUB Alternate Substitution Subtable identifier-format must be 1'
    );
    return {
        substFormat: substFormat,
        coverage: this.parsePointer(Parser.coverage),
        alternateSets: this.parseListOfLists(),
    };
};

// https://www.microsoft.com/typography/OTSPEC/GSUB.htm#LS
subtableParsers$1[4] = function parseLookup4() {
    var substFormat = this.parseUShort();
    check.argument(
        substFormat === 1,
        'GSUB ligature table identifier-format must be 1'
    );
    return {
        substFormat: substFormat,
        coverage: this.parsePointer(Parser.coverage),
        ligatureSets: this.parseListOfLists(function () {
            return {
                ligGlyph: this.parseUShort(),
                components: this.parseUShortList(this.parseUShort() - 1),
            };
        }),
    };
};

var lookupRecordDesc = {
    sequenceIndex: Parser.uShort,
    lookupListIndex: Parser.uShort,
};

// https://www.microsoft.com/typography/OTSPEC/GSUB.htm#CSF
subtableParsers$1[5] = function parseLookup5() {
    var start = this.offset + this.relativeOffset;
    var substFormat = this.parseUShort();

    if (substFormat === 1) {
        return {
            substFormat: substFormat,
            coverage: this.parsePointer(Parser.coverage),
            ruleSets: this.parseListOfLists(function () {
                var glyphCount = this.parseUShort();
                var substCount = this.parseUShort();
                return {
                    input: this.parseUShortList(glyphCount - 1),
                    lookupRecords: this.parseRecordList(
                        substCount,
                        lookupRecordDesc
                    ),
                };
            }),
        };
    } else if (substFormat === 2) {
        return {
            substFormat: substFormat,
            coverage: this.parsePointer(Parser.coverage),
            classDef: this.parsePointer(Parser.classDef),
            classSets: this.parseListOfLists(function () {
                var glyphCount = this.parseUShort();
                var substCount = this.parseUShort();
                return {
                    classes: this.parseUShortList(glyphCount - 1),
                    lookupRecords: this.parseRecordList(
                        substCount,
                        lookupRecordDesc
                    ),
                };
            }),
        };
    } else if (substFormat === 3) {
        var glyphCount = this.parseUShort();
        var substCount = this.parseUShort();
        return {
            substFormat: substFormat,
            coverages: this.parseList(
                glyphCount,
                Parser.pointer(Parser.coverage)
            ),
            lookupRecords: this.parseRecordList(substCount, lookupRecordDesc),
        };
    }
    check.assert(
        false,
        '0x' + start.toString(16) + ': lookup type 5 format must be 1, 2 or 3.'
    );
};

// https://www.microsoft.com/typography/OTSPEC/GSUB.htm#CC
subtableParsers$1[6] = function parseLookup6() {
    var start = this.offset + this.relativeOffset;
    var substFormat = this.parseUShort();
    if (substFormat === 1) {
        return {
            substFormat: 1,
            coverage: this.parsePointer(Parser.coverage),
            chainRuleSets: this.parseListOfLists(function () {
                return {
                    backtrack: this.parseUShortList(),
                    input: this.parseUShortList(this.parseShort() - 1),
                    lookahead: this.parseUShortList(),
                    lookupRecords: this.parseRecordList(lookupRecordDesc),
                };
            }),
        };
    } else if (substFormat === 2) {
        return {
            substFormat: 2,
            coverage: this.parsePointer(Parser.coverage),
            backtrackClassDef: this.parsePointer(Parser.classDef),
            inputClassDef: this.parsePointer(Parser.classDef),
            lookaheadClassDef: this.parsePointer(Parser.classDef),
            chainClassSet: this.parseListOfLists(function () {
                return {
                    backtrack: this.parseUShortList(),
                    input: this.parseUShortList(this.parseShort() - 1),
                    lookahead: this.parseUShortList(),
                    lookupRecords: this.parseRecordList(lookupRecordDesc),
                };
            }),
        };
    } else if (substFormat === 3) {
        return {
            substFormat: 3,
            backtrackCoverage: this.parseList(Parser.pointer(Parser.coverage)),
            inputCoverage: this.parseList(Parser.pointer(Parser.coverage)),
            lookaheadCoverage: this.parseList(Parser.pointer(Parser.coverage)),
            lookupRecords: this.parseRecordList(lookupRecordDesc),
        };
    }
    check.assert(
        false,
        '0x' + start.toString(16) + ': lookup type 6 format must be 1, 2 or 3.'
    );
};

// https://www.microsoft.com/typography/OTSPEC/GSUB.htm#ES
subtableParsers$1[7] = function parseLookup7() {
    // Extension Substitution subtable
    var substFormat = this.parseUShort();
    check.argument(
        substFormat === 1,
        'GSUB Extension Substitution subtable identifier-format must be 1'
    );
    var extensionLookupType = this.parseUShort();
    var extensionParser = new Parser(
        this.data,
        this.offset + this.parseULong()
    );
    return {
        substFormat: 1,
        lookupType: extensionLookupType,
        extension: subtableParsers$1[extensionLookupType].call(extensionParser),
    };
};

// https://www.microsoft.com/typography/OTSPEC/GSUB.htm#RCCS
subtableParsers$1[8] = function parseLookup8() {
    var substFormat = this.parseUShort();
    check.argument(
        substFormat === 1,
        'GSUB Reverse Chaining Contextual Single Substitution Subtable identifier-format must be 1'
    );
    return {
        substFormat: substFormat,
        coverage: this.parsePointer(Parser.coverage),
        backtrackCoverage: this.parseList(Parser.pointer(Parser.coverage)),
        lookaheadCoverage: this.parseList(Parser.pointer(Parser.coverage)),
        substitutes: this.parseUShortList(),
    };
};

// https://www.microsoft.com/typography/OTSPEC/gsub.htm
function parseGsubTable(data, start) {
    start = start || 0;
    var p = new Parser(data, start);
    var tableVersion = p.parseVersion(1);
    check.argument(
        tableVersion === 1 || tableVersion === 1.1,
        'Unsupported GSUB table version.'
    );
    if (tableVersion === 1) {
        return {
            version: tableVersion,
            scripts: p.parseScriptList(),
            features: p.parseFeatureList(),
            lookups: p.parseLookupList(subtableParsers$1),
        };
    } else {
        return {
            version: tableVersion,
            scripts: p.parseScriptList(),
            features: p.parseFeatureList(),
            lookups: p.parseLookupList(subtableParsers$1),
            variations: p.parseFeatureVariationsList(),
        };
    }
}

var gsub = { parse: parseGsubTable };

// The `head` table contains global information about the font.

// Parse the header `head` table
function parseHeadTable(data, start) {
    var head = {};
    var p = new parse.Parser(data, start);
    head.version = p.parseVersion();
    head.fontRevision = Math.round(p.parseFixed() * 1000) / 1000;
    head.checkSumAdjustment = p.parseULong();
    head.magicNumber = p.parseULong();
    check.argument(
        head.magicNumber === 0x5f0f3cf5,
        'Font header has wrong magic number.'
    );
    head.flags = p.parseUShort();
    head.unitsPerEm = p.parseUShort();
    head.created = p.parseLongDateTime();
    head.modified = p.parseLongDateTime();
    head.xMin = p.parseShort();
    head.yMin = p.parseShort();
    head.xMax = p.parseShort();
    head.yMax = p.parseShort();
    head.macStyle = p.parseUShort();
    head.lowestRecPPEM = p.parseUShort();
    head.fontDirectionHint = p.parseShort();
    head.indexToLocFormat = p.parseShort();
    head.glyphDataFormat = p.parseShort();
    return head;
}

var head = { parse: parseHeadTable };

// The `hhea` table contains information for horizontal layout.

// Parse the horizontal header `hhea` table
function parseHheaTable(data, start) {
    var hhea = {};
    var p = new parse.Parser(data, start);
    hhea.version = p.parseVersion();
    hhea.ascender = p.parseShort();
    hhea.descender = p.parseShort();
    hhea.lineGap = p.parseShort();
    hhea.advanceWidthMax = p.parseUShort();
    hhea.minLeftSideBearing = p.parseShort();
    hhea.minRightSideBearing = p.parseShort();
    hhea.xMaxExtent = p.parseShort();
    hhea.caretSlopeRise = p.parseShort();
    hhea.caretSlopeRun = p.parseShort();
    hhea.caretOffset = p.parseShort();
    p.relativeOffset += 8;
    hhea.metricDataFormat = p.parseShort();
    hhea.numberOfHMetrics = p.parseUShort();
    return hhea;
}

var hhea = { parse: parseHheaTable };

// The `hmtx` table contains the horizontal metrics for all glyphs.

function parseHmtxTableAll(data, start, numMetrics, numGlyphs, glyphs) {
    var advanceWidth;
    var leftSideBearing;
    var p = new parse.Parser(data, start);
    for (var i = 0; i < numGlyphs; i += 1) {
        // If the font is monospaced, only one entry is needed. This last entry applies to all subsequent glyphs.
        if (i < numMetrics) {
            advanceWidth = p.parseUShort();
            leftSideBearing = p.parseShort();
        }

        var glyph = glyphs.get(i);
        glyph.advanceWidth = advanceWidth;
        glyph.leftSideBearing = leftSideBearing;
    }
}

function parseHmtxTableOnLowMemory(font, data, start, numMetrics, numGlyphs) {
    font._hmtxTableData = {};

    var advanceWidth;
    var leftSideBearing;
    var p = new parse.Parser(data, start);
    for (var i = 0; i < numGlyphs; i += 1) {
        // If the font is monospaced, only one entry is needed. This last entry applies to all subsequent glyphs.
        if (i < numMetrics) {
            advanceWidth = p.parseUShort();
            leftSideBearing = p.parseShort();
        }

        font._hmtxTableData[i] = {
            advanceWidth: advanceWidth,
            leftSideBearing: leftSideBearing,
        };
    }
}

// Parse the `hmtx` table, which contains the horizontal metrics for all glyphs.
// This function augments the glyph array, adding the advanceWidth and leftSideBearing to each glyph.
function parseHmtxTable(font, data, start, numMetrics, numGlyphs, glyphs, opt) {
    if (opt.lowMemory)
        { parseHmtxTableOnLowMemory(font, data, start, numMetrics, numGlyphs); }
    else { parseHmtxTableAll(data, start, numMetrics, numGlyphs, glyphs); }
}

var hmtx = { parse: parseHmtxTable };

// The `kern` table contains kerning pairs.

function parseWindowsKernTable(p) {
    var pairs = {};
    // Skip nTables.
    p.skip('uShort');
    var subtableVersion = p.parseUShort();
    check.argument(subtableVersion === 0, 'Unsupported kern sub-table version.');
    // Skip subtableLength, subtableCoverage
    p.skip('uShort', 2);
    var nPairs = p.parseUShort();
    // Skip searchRange, entrySelector, rangeShift.
    p.skip('uShort', 3);
    for (var i = 0; i < nPairs; i += 1) {
        var leftIndex = p.parseUShort();
        var rightIndex = p.parseUShort();
        var value = p.parseShort();
        pairs[leftIndex + ',' + rightIndex] = value;
    }
    return pairs;
}

function parseMacKernTable(p) {
    var pairs = {};
    // The Mac kern table stores the version as a fixed (32 bits) but we only loaded the first 16 bits.
    // Skip the rest.
    p.skip('uShort');
    var nTables = p.parseULong();
    //check.argument(nTables === 1, 'Only 1 subtable is supported (got ' + nTables + ').');
    if (nTables > 1) {
        console.warn('Only the first kern subtable is supported.');
    }
    p.skip('uLong');
    var coverage = p.parseUShort();
    var subtableVersion = coverage & 0xFF;
    p.skip('uShort');
    if (subtableVersion === 0) {
        var nPairs = p.parseUShort();
        // Skip searchRange, entrySelector, rangeShift.
        p.skip('uShort', 3);
        for (var i = 0; i < nPairs; i += 1) {
            var leftIndex = p.parseUShort();
            var rightIndex = p.parseUShort();
            var value = p.parseShort();
            pairs[leftIndex + ',' + rightIndex] = value;
        }
    }
    return pairs;
}

// Parse the `kern` table which contains kerning pairs.
function parseKernTable(data, start) {
    var p = new parse.Parser(data, start);
    var tableVersion = p.parseUShort();
    if (tableVersion === 0) {
        return parseWindowsKernTable(p);
    } else if (tableVersion === 1) {
        return parseMacKernTable(p);
    } else {
        throw new Error('Unsupported kern table version (' + tableVersion + ').');
    }
}

var kern = { parse: parseKernTable };

// The `ltag` table stores IETF BCP-47 language tags. It allows supporting

function parseLtagTable(data, start) {
    var p = new parse.Parser(data, start);
    var tableVersion = p.parseULong();
    check.argument(tableVersion === 1, 'Unsupported ltag table version.');
    // The 'ltag' specification does not define any flags; skip the field.
    p.skip('uLong', 1);
    var numTags = p.parseULong();

    var tags = [];
    for (var i = 0; i < numTags; i++) {
        var tag = '';
        var offset = start + p.parseUShort();
        var length = p.parseUShort();
        for (var j = offset; j < offset + length; ++j) {
            tag += String.fromCharCode(data.getInt8(j));
        }

        tags.push(tag);
    }

    return tags;
}

var ltag = { parse: parseLtagTable };

// The `loca` table stores the offsets to the locations of the glyphs in the font.

// Parse the `loca` table. This table stores the offsets to the locations of the glyphs in the font,
// relative to the beginning of the glyphData table.
// The number of glyphs stored in the `loca` table is specified in the `maxp` table (under numGlyphs)
// The loca table has two versions: a short version where offsets are stored as uShorts, and a long
// version where offsets are stored as uLongs. The `head` table specifies which version to use
// (under indexToLocFormat).
function parseLocaTable(data, start, numGlyphs, shortVersion) {
    var p = new parse.Parser(data, start);
    var parseFn = shortVersion ? p.parseUShort : p.parseULong;
    // There is an extra entry after the last index element to compute the length of the last glyph.
    // That's why we use numGlyphs + 1.
    var glyphOffsets = [];
    for (var i = 0; i < numGlyphs + 1; i += 1) {
        var glyphOffset = parseFn.call(p);
        if (shortVersion) {
            // The short table version stores the actual offset divided by 2.
            glyphOffset *= 2;
        }

        glyphOffsets.push(glyphOffset);
    }

    return glyphOffsets;
}

var loca = { parse: parseLocaTable };

// The `maxp` table establishes the memory requirements for the font.

// Parse the maximum profile `maxp` table.
function parseMaxpTable(data, start) {
    var maxp = {};
    var p = new parse.Parser(data, start);
    maxp.version = p.parseVersion();
    maxp.numGlyphs = p.parseUShort();
    if (maxp.version === 1.0) {
        maxp.maxPoints = p.parseUShort();
        maxp.maxContours = p.parseUShort();
        maxp.maxCompositePoints = p.parseUShort();
        maxp.maxCompositeContours = p.parseUShort();
        maxp.maxZones = p.parseUShort();
        maxp.maxTwilightPoints = p.parseUShort();
        maxp.maxStorage = p.parseUShort();
        maxp.maxFunctionDefs = p.parseUShort();
        maxp.maxInstructionDefs = p.parseUShort();
        maxp.maxStackElements = p.parseUShort();
        maxp.maxSizeOfInstructions = p.parseUShort();
        maxp.maxComponentElements = p.parseUShort();
        maxp.maxComponentDepth = p.parseUShort();
    }

    return maxp;
}

var maxp = { parse: parseMaxpTable };

// The `OS/2` table contains metrics required in OpenType fonts.

// Parse the OS/2 and Windows metrics `OS/2` table
function parseOS2Table(data, start) {
    var os2 = {};
    var p = new parse.Parser(data, start);
    os2.version = p.parseUShort();
    os2.xAvgCharWidth = p.parseShort();
    os2.usWeightClass = p.parseUShort();
    os2.usWidthClass = p.parseUShort();
    os2.fsType = p.parseUShort();
    os2.ySubscriptXSize = p.parseShort();
    os2.ySubscriptYSize = p.parseShort();
    os2.ySubscriptXOffset = p.parseShort();
    os2.ySubscriptYOffset = p.parseShort();
    os2.ySuperscriptXSize = p.parseShort();
    os2.ySuperscriptYSize = p.parseShort();
    os2.ySuperscriptXOffset = p.parseShort();
    os2.ySuperscriptYOffset = p.parseShort();
    os2.yStrikeoutSize = p.parseShort();
    os2.yStrikeoutPosition = p.parseShort();
    os2.sFamilyClass = p.parseShort();
    os2.panose = [];
    for (var i = 0; i < 10; i++) {
        os2.panose[i] = p.parseByte();
    }

    os2.ulUnicodeRange1 = p.parseULong();
    os2.ulUnicodeRange2 = p.parseULong();
    os2.ulUnicodeRange3 = p.parseULong();
    os2.ulUnicodeRange4 = p.parseULong();
    os2.achVendID = String.fromCharCode(
        p.parseByte(),
        p.parseByte(),
        p.parseByte(),
        p.parseByte()
    );
    os2.fsSelection = p.parseUShort();
    os2.usFirstCharIndex = p.parseUShort();
    os2.usLastCharIndex = p.parseUShort();
    os2.sTypoAscender = p.parseShort();
    os2.sTypoDescender = p.parseShort();
    os2.sTypoLineGap = p.parseShort();
    os2.usWinAscent = p.parseUShort();
    os2.usWinDescent = p.parseUShort();
    if (os2.version >= 1) {
        os2.ulCodePageRange1 = p.parseULong();
        os2.ulCodePageRange2 = p.parseULong();
    }

    if (os2.version >= 2) {
        os2.sxHeight = p.parseShort();
        os2.sCapHeight = p.parseShort();
        os2.usDefaultChar = p.parseUShort();
        os2.usBreakChar = p.parseUShort();
        os2.usMaxContent = p.parseUShort();
    }

    return os2;
}

var os2 = { parse: parseOS2Table };

// The `post` table stores additional PostScript information, such as glyph names.

// Parse the PostScript `post` table
function parsePostTable(data, start) {
    var post = {};
    var p = new parse.Parser(data, start);
    post.version = p.parseVersion();
    post.italicAngle = p.parseFixed();
    post.underlinePosition = p.parseShort();
    post.underlineThickness = p.parseShort();
    post.isFixedPitch = p.parseULong();
    post.minMemType42 = p.parseULong();
    post.maxMemType42 = p.parseULong();
    post.minMemType1 = p.parseULong();
    post.maxMemType1 = p.parseULong();
    post.names = [];
    switch (post.version) {
        case 1:
            break;
        case 2:
            post.numberOfGlyphs = p.parseUShort();
            post.glyphNameIndex = new Array(post.numberOfGlyphs);
            for (var i = 0; i < post.numberOfGlyphs; i++) {
                post.glyphNameIndex[i] = p.parseUShort();
            }
            break;
        case 2.5:
            post.numberOfGlyphs = p.parseUShort();
            post.offset = new Array(post.numberOfGlyphs);
            for (var i$1 = 0; i$1 < post.numberOfGlyphs; i$1++) {
                post.offset[i$1] = p.parseChar();
            }
            break;
    }
    return post;
}

var post = { parse: parsePostTable };

// Data types used in the OpenType font file.

/**
 * @exports opentype.decode
 * @class
 */
var decode = {};

/**
 * @param {DataView} data
 * @param {number} offset
 * @param {number} numBytes
 * @returns {string}
 */
decode.UTF8 = function(data, offset, numBytes) {
    var codePoints = [];
    var numChars = numBytes;
    for (var j = 0; j < numChars; j++, offset += 1) {
        codePoints[j] = data.getUint8(offset);
    }

    return String.fromCharCode.apply(null, codePoints);
};

/**
 * @param {DataView} data
 * @param {number} offset
 * @param {number} numBytes
 * @returns {string}
 */
decode.UTF16 = function(data, offset, numBytes) {
    var codePoints = [];
    var numChars = numBytes / 2;
    for (var j = 0; j < numChars; j++, offset += 2) {
        codePoints[j] = data.getUint16(offset);
    }

    return String.fromCharCode.apply(null, codePoints);
};

// Data for converting old eight-bit Macintosh encodings to Unicode.
// This representation is optimized for decoding; encoding is slower
// and needs more memory. The assumption is that all opentype.js users
// want to open fonts, but saving a font will be comparatively rare
// so it can be more expensive. Keyed by IANA character set name.
//
// Python script for generating these strings:
//
//     s = u''.join([chr(c).decode('mac_greek') for c in range(128, 256)])
//     print(s.encode('utf-8'))
/**
 * @private
 */
var eightBitMacEncodings = {
    'x-mac-croatian':  // Python: 'mac_croatian'
    'ÄÅÇÉÑÖÜáàâäãåçéèêëíìîïñóòôöõúùûü†°¢£§•¶ß®Š™´¨≠ŽØ∞±≤≥∆µ∂∑∏š∫ªºΩžø' +
    '¿¡¬√ƒ≈Ć«Č… ÀÃÕŒœĐ—“”‘’÷◊©⁄€‹›Æ»–·‚„‰ÂćÁčÈÍÎÏÌÓÔđÒÚÛÙıˆ˜¯πË˚¸Êæˇ',
    'x-mac-cyrillic':  // Python: 'mac_cyrillic'
    'АБВГДЕЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯ†°Ґ£§•¶І®©™Ђђ≠Ѓѓ∞±≤≥іµґЈЄєЇїЉљЊњ' +
    'јЅ¬√ƒ≈∆«»… ЋћЌќѕ–—“”‘’÷„ЎўЏџ№Ёёяабвгдежзийклмнопрстуфхцчшщъыьэю',
    'x-mac-gaelic': // http://unicode.org/Public/MAPPINGS/VENDORS/APPLE/GAELIC.TXT
    'ÄÅÇÉÑÖÜáàâäãåçéèêëíìîïñóòôöõúùûü†°¢£§•¶ß®©™´¨≠ÆØḂ±≤≥ḃĊċḊḋḞḟĠġṀæø' +
    'ṁṖṗɼƒſṠ«»… ÀÃÕŒœ–—“”‘’ṡẛÿŸṪ€‹›Ŷŷṫ·Ỳỳ⁊ÂÊÁËÈÍÎÏÌÓÔ♣ÒÚÛÙıÝýŴŵẄẅẀẁẂẃ',
    'x-mac-greek':  // Python: 'mac_greek'
    'Ä¹²É³ÖÜ΅àâä΄¨çéèêë£™îï•½‰ôö¦€ùûü†ΓΔΘΛΞΠß®©ΣΪ§≠°·Α±≤≥¥ΒΕΖΗΙΚΜΦΫΨΩ' +
    'άΝ¬ΟΡ≈Τ«»… ΥΧΆΈœ–―“”‘’÷ΉΊΌΎέήίόΏύαβψδεφγηιξκλμνοπώρστθωςχυζϊϋΐΰ\u00AD',
    'x-mac-icelandic':  // Python: 'mac_iceland'
    'ÄÅÇÉÑÖÜáàâäãåçéèêëíìîïñóòôöõúùûüÝ°¢£§•¶ß®©™´¨≠ÆØ∞±≤≥¥µ∂∑∏π∫ªºΩæø' +
    '¿¡¬√ƒ≈∆«»… ÀÃÕŒœ–—“”‘’÷◊ÿŸ⁄€ÐðÞþý·‚„‰ÂÊÁËÈÍÎÏÌÓÔÒÚÛÙıˆ˜¯˘˙˚¸˝˛ˇ',
    'x-mac-inuit': // http://unicode.org/Public/MAPPINGS/VENDORS/APPLE/INUIT.TXT
    'ᐃᐄᐅᐆᐊᐋᐱᐲᐳᐴᐸᐹᑉᑎᑏᑐᑑᑕᑖᑦᑭᑮᑯᑰᑲᑳᒃᒋᒌᒍᒎᒐᒑ°ᒡᒥᒦ•¶ᒧ®©™ᒨᒪᒫᒻᓂᓃᓄᓅᓇᓈᓐᓯᓰᓱᓲᓴᓵᔅᓕᓖᓗ' +
    'ᓘᓚᓛᓪᔨᔩᔪᔫᔭ… ᔮᔾᕕᕖᕗ–—“”‘’ᕘᕙᕚᕝᕆᕇᕈᕉᕋᕌᕐᕿᖀᖁᖂᖃᖄᖅᖏᖐᖑᖒᖓᖔᖕᙱᙲᙳᙴᙵᙶᖖᖠᖡᖢᖣᖤᖥᖦᕼŁł',
    'x-mac-ce':  // Python: 'mac_latin2'
    'ÄĀāÉĄÖÜáąČäčĆćéŹźĎíďĒēĖóėôöõúĚěü†°Ę£§•¶ß®©™ę¨≠ģĮįĪ≤≥īĶ∂∑łĻļĽľĹĺŅ' +
    'ņŃ¬√ńŇ∆«»… ňŐÕőŌ–—“”‘’÷◊ōŔŕŘ‹›řŖŗŠ‚„šŚśÁŤťÍŽžŪÓÔūŮÚůŰűŲųÝýķŻŁżĢˇ',
    macintosh:  // Python: 'mac_roman'
    'ÄÅÇÉÑÖÜáàâäãåçéèêëíìîïñóòôöõúùûü†°¢£§•¶ß®©™´¨≠ÆØ∞±≤≥¥µ∂∑∏π∫ªºΩæø' +
    '¿¡¬√ƒ≈∆«»… ÀÃÕŒœ–—“”‘’÷◊ÿŸ⁄€‹›ﬁﬂ‡·‚„‰ÂÊÁËÈÍÎÏÌÓÔÒÚÛÙıˆ˜¯˘˙˚¸˝˛ˇ',
    'x-mac-romanian':  // Python: 'mac_romanian'
    'ÄÅÇÉÑÖÜáàâäãåçéèêëíìîïñóòôöõúùûü†°¢£§•¶ß®©™´¨≠ĂȘ∞±≤≥¥µ∂∑∏π∫ªºΩăș' +
    '¿¡¬√ƒ≈∆«»… ÀÃÕŒœ–—“”‘’÷◊ÿŸ⁄€‹›Țț‡·‚„‰ÂÊÁËÈÍÎÏÌÓÔÒÚÛÙıˆ˜¯˘˙˚¸˝˛ˇ',
    'x-mac-turkish':  // Python: 'mac_turkish'
    'ÄÅÇÉÑÖÜáàâäãåçéèêëíìîïñóòôöõúùûü†°¢£§•¶ß®©™´¨≠ÆØ∞±≤≥¥µ∂∑∏π∫ªºΩæø' +
    '¿¡¬√ƒ≈∆«»… ÀÃÕŒœ–—“”‘’÷◊ÿŸĞğİıŞş‡·‚„‰ÂÊÁËÈÍÎÏÌÓÔÒÚÛÙˆ˜¯˘˙˚¸˝˛ˇ'
};

/**
 * Decodes an old-style Macintosh string. Returns either a Unicode JavaScript
 * string, or 'undefined' if the encoding is unsupported. For example, we do
 * not support Chinese, Japanese or Korean because these would need large
 * mapping tables.
 * @param {DataView} dataView
 * @param {number} offset
 * @param {number} dataLength
 * @param {string} encoding
 * @returns {string}
 */
decode.MACSTRING = function(dataView, offset, dataLength, encoding) {
    var table = eightBitMacEncodings[encoding];
    if (table === undefined) {
        return undefined;
    }

    var result = '';
    for (var i = 0; i < dataLength; i++) {
        var c = dataView.getUint8(offset + i);
        // In all eight-bit Mac encodings, the characters 0x00..0x7F are
        // mapped to U+0000..U+007F; we only need to look up the others.
        if (c <= 0x7F) {
            result += String.fromCharCode(c);
        } else {
            result += table[c & 0x7F];
        }
    }

    return result;
};

// The `GPOS` table contains kerning pairs, among other things.

// Parse the metadata `meta` table.
// https://developer.apple.com/fonts/TrueType-Reference-Manual/RM06/Chap6meta.html
function parseMetaTable(data, start) {
    var p = new parse.Parser(data, start);
    var tableVersion = p.parseULong();
    check.argument(tableVersion === 1, 'Unsupported META table version.');
    p.parseULong(); // flags - currently unused and set to 0
    p.parseULong(); // tableOffset
    var numDataMaps = p.parseULong();

    var tags = {};
    for (var i = 0; i < numDataMaps; i++) {
        var tag = p.parseTag();
        var dataOffset = p.parseULong();
        var dataLength = p.parseULong();
        var text = decode.UTF8(data, start + dataOffset, dataLength);

        tags[tag] = text;
    }
    return tags;
}

var meta = { parse: parseMetaTable };

// opentype.js

/**
 * The opentype library.
 * @namespace opentype
 */

// Table Directory Entries //////////////////////////////////////////////
/**
 * Parses OpenType table entries.
 * @param  {DataView}
 * @param  {Number}
 * @return {Object[]}
 */
function parseOpenTypeTableEntries(data, numTables) {
    var tableEntries = [];
    var p = 12;
    for (var i = 0; i < numTables; i += 1) {
        var tag = parse.getTag(data, p);
        var checksum = parse.getULong(data, p + 4);
        var offset = parse.getULong(data, p + 8);
        var length = parse.getULong(data, p + 12);
        tableEntries.push({
            tag: tag,
            checksum: checksum,
            offset: offset,
            length: length,
            compression: false,
        });
        p += 16;
    }

    return tableEntries;
}

/**
 * Parses WOFF table entries.
 * @param  {DataView}
 * @param  {Number}
 * @return {Object[]}
 */
function parseWOFFTableEntries(data, numTables) {
    var tableEntries = [];
    var p = 44; // offset to the first table directory entry.
    for (var i = 0; i < numTables; i += 1) {
        var tag = parse.getTag(data, p);
        var offset = parse.getULong(data, p + 4);
        var compLength = parse.getULong(data, p + 8);
        var origLength = parse.getULong(data, p + 12);
        var compression = (void 0);
        if (compLength < origLength) {
            compression = 'WOFF';
        } else {
            compression = false;
        }

        tableEntries.push({
            tag: tag,
            offset: offset,
            compression: compression,
            compressedLength: compLength,
            length: origLength,
        });
        p += 20;
    }

    return tableEntries;
}

/**
 * @typedef TableData
 * @type Object
 * @property {DataView} data - The DataView
 * @property {number} offset - The data offset.
 */

/**
 * @param  {DataView}
 * @param  {Object}
 * @return {TableData}
 */
function uncompressTable(data, tableEntry) {
    if (tableEntry.compression === 'WOFF') {
        var inBuffer = new Uint8Array(
            data.buffer,
            tableEntry.offset + 2,
            tableEntry.compressedLength - 2
        );
        var outBuffer = new Uint8Array(tableEntry.length);
        inflateSync(inBuffer, outBuffer);
        if (outBuffer.byteLength !== tableEntry.length) {
            throw new Error(
                'Decompression error: ' +
                    tableEntry.tag +
                    " decompressed length doesn't match recorded length"
            );
        }

        var view = new DataView(outBuffer.buffer, 0);
        return { data: view, offset: 0 };
    } else {
        return { data: data, offset: tableEntry.offset };
    }
}

// Public API ///////////////////////////////////////////////////////////

/**
 * Parse the OpenType file data (as an ArrayBuffer) and return a Font object.
 * Throws an error if the font could not be parsed.
 * @param  {ArrayBuffer}
 * @param  {Object} opt - options for parsing
 * @return {opentype.Font}
 */
function parseBuffer(buffer, opt) {
    opt = opt === undefined || opt === null ? {} : opt;

    var indexToLocFormat;

    // Since the constructor can also be called to create new fonts from scratch, we indicate this
    // should be an empty font that we'll fill with our own data.
    var font = new Font({ empty: true });

    // OpenType fonts use big endian byte ordering.
    // We can't rely on typed array view types, because they operate with the endianness of the host computer.
    // Instead we use DataViews where we can specify endianness.
    var data = new DataView(buffer, 0);
    var numTables;
    var tableEntries = [];
    var signature = parse.getTag(data, 0);
    if (
        signature === String.fromCharCode(0, 1, 0, 0) ||
        signature === 'true' ||
        signature === 'typ1'
    ) {
        font.outlinesFormat = 'truetype';
        numTables = parse.getUShort(data, 4);
        tableEntries = parseOpenTypeTableEntries(data, numTables);
    } else if (signature === 'OTTO') {
        font.outlinesFormat = 'cff';
        numTables = parse.getUShort(data, 4);
        tableEntries = parseOpenTypeTableEntries(data, numTables);
    } else if (signature === 'wOFF') {
        var flavor = parse.getTag(data, 4);
        if (flavor === String.fromCharCode(0, 1, 0, 0)) {
            font.outlinesFormat = 'truetype';
        } else if (flavor === 'OTTO') {
            font.outlinesFormat = 'cff';
        } else {
            throw new Error('Unsupported OpenType flavor ' + signature);
        }

        numTables = parse.getUShort(data, 12);
        tableEntries = parseWOFFTableEntries(data, numTables);
    } else {
        throw new Error('Unsupported OpenType signature ' + signature);
    }

    var cffTableEntry;
    var fvarTableEntry;
    var glyfTableEntry;
    var gdefTableEntry;
    var gposTableEntry;
    var gsubTableEntry;
    var hmtxTableEntry;
    var kernTableEntry;
    var locaTableEntry;
    var metaTableEntry;
    var p;

    for (var i = 0; i < numTables; i += 1) {
        var tableEntry = tableEntries[i];
        var table = (void 0);
        switch (tableEntry.tag) {
            case 'cmap':
                table = uncompressTable(data, tableEntry);
                font.tables.cmap = cmap.parse(table.data, table.offset);
                font.encoding = new CmapEncoding(font.tables.cmap);
                break;
            case 'cvt ':
                table = uncompressTable(data, tableEntry);
                p = new parse.Parser(table.data, table.offset);
                font.tables.cvt = p.parseShortList(tableEntry.length / 2);
                break;
            case 'fvar':
                fvarTableEntry = tableEntry;
                break;
            case 'fpgm':
                table = uncompressTable(data, tableEntry);
                p = new parse.Parser(table.data, table.offset);
                font.tables.fpgm = p.parseByteList(tableEntry.length);
                break;
            case 'head':
                table = uncompressTable(data, tableEntry);
                font.tables.head = head.parse(table.data, table.offset);
                font.unitsPerEm = font.tables.head.unitsPerEm;
                indexToLocFormat = font.tables.head.indexToLocFormat;
                break;
            case 'hhea':
                table = uncompressTable(data, tableEntry);
                font.tables.hhea = hhea.parse(table.data, table.offset);
                font.ascender = font.tables.hhea.ascender;
                font.descender = font.tables.hhea.descender;
                font.numberOfHMetrics = font.tables.hhea.numberOfHMetrics;
                break;
            case 'hmtx':
                hmtxTableEntry = tableEntry;
                break;
            case 'ltag':
                table = uncompressTable(data, tableEntry);
                ltagTable = ltag.parse(table.data, table.offset);
                break;
            case 'maxp':
                table = uncompressTable(data, tableEntry);
                font.tables.maxp = maxp.parse(table.data, table.offset);
                font.numGlyphs = font.tables.maxp.numGlyphs;
                break;
            case 'OS/2':
                table = uncompressTable(data, tableEntry);
                font.tables.os2 = os2.parse(table.data, table.offset);
                break;
            case 'post':
                table = uncompressTable(data, tableEntry);
                font.tables.post = post.parse(table.data, table.offset);
                break;
            case 'prep':
                table = uncompressTable(data, tableEntry);
                p = new parse.Parser(table.data, table.offset);
                font.tables.prep = p.parseByteList(tableEntry.length);
                break;
            case 'glyf':
                glyfTableEntry = tableEntry;
                break;
            case 'loca':
                locaTableEntry = tableEntry;
                break;
            case 'CFF ':
                cffTableEntry = tableEntry;
                break;
            case 'kern':
                kernTableEntry = tableEntry;
                break;
            case 'GDEF':
                gdefTableEntry = tableEntry;
                break;
            case 'GPOS':
                gposTableEntry = tableEntry;
                break;
            case 'GSUB':
                gsubTableEntry = tableEntry;
                break;
            case 'meta':
                metaTableEntry = tableEntry;
                break;
        }
    }

    if (glyfTableEntry && locaTableEntry) {
        var shortVersion = indexToLocFormat === 0;
        var locaTable = uncompressTable(data, locaTableEntry);
        var locaOffsets = loca.parse(
            locaTable.data,
            locaTable.offset,
            font.numGlyphs,
            shortVersion
        );
        var glyfTable = uncompressTable(data, glyfTableEntry);
        font.glyphs = glyf.parse(
            glyfTable.data,
            glyfTable.offset,
            locaOffsets,
            font,
            opt
        );
    } else if (cffTableEntry) {
        var cffTable = uncompressTable(data, cffTableEntry);
        cff.parse(cffTable.data, cffTable.offset, font, opt);
    } else {
        throw new Error("Font doesn't contain TrueType or CFF outlines.");
    }

    var hmtxTable = uncompressTable(data, hmtxTableEntry);
    hmtx.parse(
        font,
        hmtxTable.data,
        hmtxTable.offset,
        font.numberOfHMetrics,
        font.numGlyphs,
        font.glyphs,
        opt
    );
    addGlyphNames(font, opt);

    if (kernTableEntry) {
        var kernTable = uncompressTable(data, kernTableEntry);
        font.kerningPairs = kern.parse(kernTable.data, kernTable.offset);
    } else {
        font.kerningPairs = {};
    }

    if (gdefTableEntry) {
        var gdefTable = uncompressTable(data, gdefTableEntry);
        font.tables.gdef = gdef.parse(gdefTable.data, gdefTable.offset);
    }

    if (gposTableEntry) {
        var gposTable = uncompressTable(data, gposTableEntry);
        font.tables.gpos = gpos.parse(gposTable.data, gposTable.offset);
        font.position.init();
    }

    if (gsubTableEntry) {
        var gsubTable = uncompressTable(data, gsubTableEntry);
        font.tables.gsub = gsub.parse(gsubTable.data, gsubTable.offset);
    }

    if (fvarTableEntry) {
        var fvarTable = uncompressTable(data, fvarTableEntry);
        font.tables.fvar = fvar.parse(
            fvarTable.data,
            fvarTable.offset,
            font.names
        );
    }

    if (metaTableEntry) {
        var metaTable = uncompressTable(data, metaTableEntry);
        font.tables.meta = meta.parse(metaTable.data, metaTable.offset);
        font.metas = font.tables.meta;
    }

    return font;
}

function load() {}
function loadSync() {}

var opentype = /*#__PURE__*/Object.freeze({
   __proto__: null,
   Font: Font,
   Glyph: Glyph,
   Path: Path,
   _parse: parse,
   parse: parseBuffer,
   load: load,
   loadSync: loadSync
});

/* harmony default export */ const opentype_module = (opentype);

//# sourceMappingURL=opentype.module.js.map

;// CONCATENATED MODULE: ./node_modules/satori/dist/index.wasm.js
var yu=Object.create;var or=Object.defineProperty;var xu=Object.getOwnPropertyDescriptor;var wu=Object.getOwnPropertyNames;var _u=Object.getPrototypeOf,Su=Object.prototype.hasOwnProperty;var Wr=(e,t)=>()=>(e&&(t=e(e=0)),t);var R=(e,t)=>()=>(t||e((t={exports:{}}).exports,t),t.exports),uo=(e,t)=>{for(var n in t)or(e,n,{get:t[n],enumerable:!0})},lo=(e,t,n,r)=>{if(t&&typeof t=="object"||typeof t=="function")for(let i of wu(t))!Su.call(e,i)&&i!==n&&or(e,i,{get:()=>t[i],enumerable:!(r=xu(t,i))||r.enumerable});return e};var ku=(e,t,n)=>(n=e!=null?yu(_u(e)):{},lo(t||!e||!e.__esModule?or(n,"default",{value:e,enumerable:!0}):n,e)),ar=e=>lo(or({},"__esModule",{value:!0}),e);var c=Wr(()=>{});var dn=R(cn=>{"use strict";c();Object.defineProperty(cn,"__esModule",{value:!0});Object.defineProperty(cn,"default",{enumerable:!0,get:()=>ol});function ol(e){if(e=`${e}`,e==="0")return"0";if(/^[+-]?(\d+|\d*\.\d+)(e[+-]?\d+)?(%|\w+)?$/.test(e))return e.replace(/^[+-]?/,t=>t==="-"?"":"-");if(e.includes("var(")||e.includes("calc("))return`calc(${e} * -1)`}});var Mo=R(pn=>{"use strict";c();Object.defineProperty(pn,"__esModule",{value:!0});Object.defineProperty(pn,"default",{enumerable:!0,get:()=>al});var al=["preflight","container","accessibility","pointerEvents","visibility","position","inset","isolation","zIndex","order","gridColumn","gridColumnStart","gridColumnEnd","gridRow","gridRowStart","gridRowEnd","float","clear","margin","boxSizing","display","aspectRatio","height","maxHeight","minHeight","width","minWidth","maxWidth","flex","flexShrink","flexGrow","flexBasis","tableLayout","borderCollapse","borderSpacing","transformOrigin","translate","rotate","skew","scale","transform","animation","cursor","touchAction","userSelect","resize","scrollSnapType","scrollSnapAlign","scrollSnapStop","scrollMargin","scrollPadding","listStylePosition","listStyleType","appearance","columns","breakBefore","breakInside","breakAfter","gridAutoColumns","gridAutoFlow","gridAutoRows","gridTemplateColumns","gridTemplateRows","flexDirection","flexWrap","placeContent","placeItems","alignContent","alignItems","justifyContent","justifyItems","gap","space","divideWidth","divideStyle","divideColor","divideOpacity","placeSelf","alignSelf","justifySelf","overflow","overscrollBehavior","scrollBehavior","textOverflow","whitespace","wordBreak","borderRadius","borderWidth","borderStyle","borderColor","borderOpacity","backgroundColor","backgroundOpacity","backgroundImage","gradientColorStops","boxDecorationBreak","backgroundSize","backgroundAttachment","backgroundClip","backgroundPosition","backgroundRepeat","backgroundOrigin","fill","stroke","strokeWidth","objectFit","objectPosition","padding","textAlign","textIndent","verticalAlign","fontFamily","fontSize","fontWeight","textTransform","fontStyle","fontVariantNumeric","lineHeight","letterSpacing","textColor","textOpacity","textDecoration","textDecorationColor","textDecorationStyle","textDecorationThickness","textUnderlineOffset","fontSmoothing","placeholderColor","placeholderOpacity","caretColor","accentColor","opacity","backgroundBlendMode","mixBlendMode","boxShadow","boxShadowColor","outlineStyle","outlineWidth","outlineOffset","outlineColor","ringWidth","ringColor","ringOpacity","ringOffsetWidth","ringOffsetColor","blur","brightness","contrast","dropShadow","grayscale","hueRotate","invert","saturate","sepia","filter","backdropBlur","backdropBrightness","backdropContrast","backdropGrayscale","backdropHueRotate","backdropInvert","backdropOpacity","backdropSaturate","backdropSepia","backdropFilter","transitionProperty","transitionDelay","transitionDuration","transitionTimingFunction","willChange","content"]});var No=R(hn=>{"use strict";c();Object.defineProperty(hn,"__esModule",{value:!0});Object.defineProperty(hn,"default",{enumerable:!0,get:()=>sl});function sl(e,t){return e===void 0?t:Array.isArray(e)?e:[...new Set(t.filter(r=>e!==!1&&e[r]!==!1).concat(Object.keys(e).filter(r=>e[r]!==!1)))]}});var mn=R((Wm,Wo)=>{c();Wo.exports={content:[],presets:[],darkMode:"media",theme:{screens:{sm:"640px",md:"768px",lg:"1024px",xl:"1280px","2xl":"1536px"},colors:({colors:e})=>({inherit:e.inherit,current:e.current,transparent:e.transparent,black:e.black,white:e.white,slate:e.slate,gray:e.gray,zinc:e.zinc,neutral:e.neutral,stone:e.stone,red:e.red,orange:e.orange,amber:e.amber,yellow:e.yellow,lime:e.lime,green:e.green,emerald:e.emerald,teal:e.teal,cyan:e.cyan,sky:e.sky,blue:e.blue,indigo:e.indigo,violet:e.violet,purple:e.purple,fuchsia:e.fuchsia,pink:e.pink,rose:e.rose}),columns:{auto:"auto",1:"1",2:"2",3:"3",4:"4",5:"5",6:"6",7:"7",8:"8",9:"9",10:"10",11:"11",12:"12","3xs":"16rem","2xs":"18rem",xs:"20rem",sm:"24rem",md:"28rem",lg:"32rem",xl:"36rem","2xl":"42rem","3xl":"48rem","4xl":"56rem","5xl":"64rem","6xl":"72rem","7xl":"80rem"},spacing:{px:"1px",0:"0px",.5:"0.125rem",1:"0.25rem",1.5:"0.375rem",2:"0.5rem",2.5:"0.625rem",3:"0.75rem",3.5:"0.875rem",4:"1rem",5:"1.25rem",6:"1.5rem",7:"1.75rem",8:"2rem",9:"2.25rem",10:"2.5rem",11:"2.75rem",12:"3rem",14:"3.5rem",16:"4rem",20:"5rem",24:"6rem",28:"7rem",32:"8rem",36:"9rem",40:"10rem",44:"11rem",48:"12rem",52:"13rem",56:"14rem",60:"15rem",64:"16rem",72:"18rem",80:"20rem",96:"24rem"},animation:{none:"none",spin:"spin 1s linear infinite",ping:"ping 1s cubic-bezier(0, 0, 0.2, 1) infinite",pulse:"pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",bounce:"bounce 1s infinite"},aspectRatio:{auto:"auto",square:"1 / 1",video:"16 / 9"},backdropBlur:({theme:e})=>e("blur"),backdropBrightness:({theme:e})=>e("brightness"),backdropContrast:({theme:e})=>e("contrast"),backdropGrayscale:({theme:e})=>e("grayscale"),backdropHueRotate:({theme:e})=>e("hueRotate"),backdropInvert:({theme:e})=>e("invert"),backdropOpacity:({theme:e})=>e("opacity"),backdropSaturate:({theme:e})=>e("saturate"),backdropSepia:({theme:e})=>e("sepia"),backgroundColor:({theme:e})=>e("colors"),backgroundImage:{none:"none","gradient-to-t":"linear-gradient(to top, var(--tw-gradient-stops))","gradient-to-tr":"linear-gradient(to top right, var(--tw-gradient-stops))","gradient-to-r":"linear-gradient(to right, var(--tw-gradient-stops))","gradient-to-br":"linear-gradient(to bottom right, var(--tw-gradient-stops))","gradient-to-b":"linear-gradient(to bottom, var(--tw-gradient-stops))","gradient-to-bl":"linear-gradient(to bottom left, var(--tw-gradient-stops))","gradient-to-l":"linear-gradient(to left, var(--tw-gradient-stops))","gradient-to-tl":"linear-gradient(to top left, var(--tw-gradient-stops))"},backgroundOpacity:({theme:e})=>e("opacity"),backgroundPosition:{bottom:"bottom",center:"center",left:"left","left-bottom":"left bottom","left-top":"left top",right:"right","right-bottom":"right bottom","right-top":"right top",top:"top"},backgroundSize:{auto:"auto",cover:"cover",contain:"contain"},blur:{0:"0",none:"0",sm:"4px",DEFAULT:"8px",md:"12px",lg:"16px",xl:"24px","2xl":"40px","3xl":"64px"},brightness:{0:"0",50:".5",75:".75",90:".9",95:".95",100:"1",105:"1.05",110:"1.1",125:"1.25",150:"1.5",200:"2"},borderColor:({theme:e})=>({...e("colors"),DEFAULT:e("colors.gray.200","currentColor")}),borderOpacity:({theme:e})=>e("opacity"),borderRadius:{none:"0px",sm:"0.125rem",DEFAULT:"0.25rem",md:"0.375rem",lg:"0.5rem",xl:"0.75rem","2xl":"1rem","3xl":"1.5rem",full:"9999px"},borderSpacing:({theme:e})=>({...e("spacing")}),borderWidth:{DEFAULT:"1px",0:"0px",2:"2px",4:"4px",8:"8px"},boxShadow:{sm:"0 1px 2px 0 rgb(0 0 0 / 0.05)",DEFAULT:"0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)",md:"0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",lg:"0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)",xl:"0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)","2xl":"0 25px 50px -12px rgb(0 0 0 / 0.25)",inner:"inset 0 2px 4px 0 rgb(0 0 0 / 0.05)",none:"none"},boxShadowColor:({theme:e})=>e("colors"),caretColor:({theme:e})=>e("colors"),accentColor:({theme:e})=>({...e("colors"),auto:"auto"}),contrast:{0:"0",50:".5",75:".75",100:"1",125:"1.25",150:"1.5",200:"2"},container:{},content:{none:"none"},cursor:{auto:"auto",default:"default",pointer:"pointer",wait:"wait",text:"text",move:"move",help:"help","not-allowed":"not-allowed",none:"none","context-menu":"context-menu",progress:"progress",cell:"cell",crosshair:"crosshair","vertical-text":"vertical-text",alias:"alias",copy:"copy","no-drop":"no-drop",grab:"grab",grabbing:"grabbing","all-scroll":"all-scroll","col-resize":"col-resize","row-resize":"row-resize","n-resize":"n-resize","e-resize":"e-resize","s-resize":"s-resize","w-resize":"w-resize","ne-resize":"ne-resize","nw-resize":"nw-resize","se-resize":"se-resize","sw-resize":"sw-resize","ew-resize":"ew-resize","ns-resize":"ns-resize","nesw-resize":"nesw-resize","nwse-resize":"nwse-resize","zoom-in":"zoom-in","zoom-out":"zoom-out"},divideColor:({theme:e})=>e("borderColor"),divideOpacity:({theme:e})=>e("borderOpacity"),divideWidth:({theme:e})=>e("borderWidth"),dropShadow:{sm:"0 1px 1px rgb(0 0 0 / 0.05)",DEFAULT:["0 1px 2px rgb(0 0 0 / 0.1)","0 1px 1px rgb(0 0 0 / 0.06)"],md:["0 4px 3px rgb(0 0 0 / 0.07)","0 2px 2px rgb(0 0 0 / 0.06)"],lg:["0 10px 8px rgb(0 0 0 / 0.04)","0 4px 3px rgb(0 0 0 / 0.1)"],xl:["0 20px 13px rgb(0 0 0 / 0.03)","0 8px 5px rgb(0 0 0 / 0.08)"],"2xl":"0 25px 25px rgb(0 0 0 / 0.15)",none:"0 0 #0000"},fill:({theme:e})=>e("colors"),grayscale:{0:"0",DEFAULT:"100%"},hueRotate:{0:"0deg",15:"15deg",30:"30deg",60:"60deg",90:"90deg",180:"180deg"},invert:{0:"0",DEFAULT:"100%"},flex:{1:"1 1 0%",auto:"1 1 auto",initial:"0 1 auto",none:"none"},flexBasis:({theme:e})=>({auto:"auto",...e("spacing"),"1/2":"50%","1/3":"33.333333%","2/3":"66.666667%","1/4":"25%","2/4":"50%","3/4":"75%","1/5":"20%","2/5":"40%","3/5":"60%","4/5":"80%","1/6":"16.666667%","2/6":"33.333333%","3/6":"50%","4/6":"66.666667%","5/6":"83.333333%","1/12":"8.333333%","2/12":"16.666667%","3/12":"25%","4/12":"33.333333%","5/12":"41.666667%","6/12":"50%","7/12":"58.333333%","8/12":"66.666667%","9/12":"75%","10/12":"83.333333%","11/12":"91.666667%",full:"100%"}),flexGrow:{0:"0",DEFAULT:"1"},flexShrink:{0:"0",DEFAULT:"1"},fontFamily:{sans:["ui-sans-serif","system-ui","-apple-system","BlinkMacSystemFont",'"Segoe UI"',"Roboto",'"Helvetica Neue"',"Arial",'"Noto Sans"',"sans-serif",'"Apple Color Emoji"','"Segoe UI Emoji"','"Segoe UI Symbol"','"Noto Color Emoji"'],serif:["ui-serif","Georgia","Cambria",'"Times New Roman"',"Times","serif"],mono:["ui-monospace","SFMono-Regular","Menlo","Monaco","Consolas",'"Liberation Mono"','"Courier New"',"monospace"]},fontSize:{xs:["0.75rem",{lineHeight:"1rem"}],sm:["0.875rem",{lineHeight:"1.25rem"}],base:["1rem",{lineHeight:"1.5rem"}],lg:["1.125rem",{lineHeight:"1.75rem"}],xl:["1.25rem",{lineHeight:"1.75rem"}],"2xl":["1.5rem",{lineHeight:"2rem"}],"3xl":["1.875rem",{lineHeight:"2.25rem"}],"4xl":["2.25rem",{lineHeight:"2.5rem"}],"5xl":["3rem",{lineHeight:"1"}],"6xl":["3.75rem",{lineHeight:"1"}],"7xl":["4.5rem",{lineHeight:"1"}],"8xl":["6rem",{lineHeight:"1"}],"9xl":["8rem",{lineHeight:"1"}]},fontWeight:{thin:"100",extralight:"200",light:"300",normal:"400",medium:"500",semibold:"600",bold:"700",extrabold:"800",black:"900"},gap:({theme:e})=>e("spacing"),gradientColorStops:({theme:e})=>e("colors"),gridAutoColumns:{auto:"auto",min:"min-content",max:"max-content",fr:"minmax(0, 1fr)"},gridAutoRows:{auto:"auto",min:"min-content",max:"max-content",fr:"minmax(0, 1fr)"},gridColumn:{auto:"auto","span-1":"span 1 / span 1","span-2":"span 2 / span 2","span-3":"span 3 / span 3","span-4":"span 4 / span 4","span-5":"span 5 / span 5","span-6":"span 6 / span 6","span-7":"span 7 / span 7","span-8":"span 8 / span 8","span-9":"span 9 / span 9","span-10":"span 10 / span 10","span-11":"span 11 / span 11","span-12":"span 12 / span 12","span-full":"1 / -1"},gridColumnEnd:{auto:"auto",1:"1",2:"2",3:"3",4:"4",5:"5",6:"6",7:"7",8:"8",9:"9",10:"10",11:"11",12:"12",13:"13"},gridColumnStart:{auto:"auto",1:"1",2:"2",3:"3",4:"4",5:"5",6:"6",7:"7",8:"8",9:"9",10:"10",11:"11",12:"12",13:"13"},gridRow:{auto:"auto","span-1":"span 1 / span 1","span-2":"span 2 / span 2","span-3":"span 3 / span 3","span-4":"span 4 / span 4","span-5":"span 5 / span 5","span-6":"span 6 / span 6","span-full":"1 / -1"},gridRowStart:{auto:"auto",1:"1",2:"2",3:"3",4:"4",5:"5",6:"6",7:"7"},gridRowEnd:{auto:"auto",1:"1",2:"2",3:"3",4:"4",5:"5",6:"6",7:"7"},gridTemplateColumns:{none:"none",1:"repeat(1, minmax(0, 1fr))",2:"repeat(2, minmax(0, 1fr))",3:"repeat(3, minmax(0, 1fr))",4:"repeat(4, minmax(0, 1fr))",5:"repeat(5, minmax(0, 1fr))",6:"repeat(6, minmax(0, 1fr))",7:"repeat(7, minmax(0, 1fr))",8:"repeat(8, minmax(0, 1fr))",9:"repeat(9, minmax(0, 1fr))",10:"repeat(10, minmax(0, 1fr))",11:"repeat(11, minmax(0, 1fr))",12:"repeat(12, minmax(0, 1fr))"},gridTemplateRows:{none:"none",1:"repeat(1, minmax(0, 1fr))",2:"repeat(2, minmax(0, 1fr))",3:"repeat(3, minmax(0, 1fr))",4:"repeat(4, minmax(0, 1fr))",5:"repeat(5, minmax(0, 1fr))",6:"repeat(6, minmax(0, 1fr))"},height:({theme:e})=>({auto:"auto",...e("spacing"),"1/2":"50%","1/3":"33.333333%","2/3":"66.666667%","1/4":"25%","2/4":"50%","3/4":"75%","1/5":"20%","2/5":"40%","3/5":"60%","4/5":"80%","1/6":"16.666667%","2/6":"33.333333%","3/6":"50%","4/6":"66.666667%","5/6":"83.333333%",full:"100%",screen:"100vh",min:"min-content",max:"max-content",fit:"fit-content"}),inset:({theme:e})=>({auto:"auto",...e("spacing"),"1/2":"50%","1/3":"33.333333%","2/3":"66.666667%","1/4":"25%","2/4":"50%","3/4":"75%",full:"100%"}),keyframes:{spin:{to:{transform:"rotate(360deg)"}},ping:{"75%, 100%":{transform:"scale(2)",opacity:"0"}},pulse:{"50%":{opacity:".5"}},bounce:{"0%, 100%":{transform:"translateY(-25%)",animationTimingFunction:"cubic-bezier(0.8,0,1,1)"},"50%":{transform:"none",animationTimingFunction:"cubic-bezier(0,0,0.2,1)"}}},letterSpacing:{tighter:"-0.05em",tight:"-0.025em",normal:"0em",wide:"0.025em",wider:"0.05em",widest:"0.1em"},lineHeight:{none:"1",tight:"1.25",snug:"1.375",normal:"1.5",relaxed:"1.625",loose:"2",3:".75rem",4:"1rem",5:"1.25rem",6:"1.5rem",7:"1.75rem",8:"2rem",9:"2.25rem",10:"2.5rem"},listStyleType:{none:"none",disc:"disc",decimal:"decimal"},margin:({theme:e})=>({auto:"auto",...e("spacing")}),maxHeight:({theme:e})=>({...e("spacing"),full:"100%",screen:"100vh",min:"min-content",max:"max-content",fit:"fit-content"}),maxWidth:({theme:e,breakpoints:t})=>({none:"none",0:"0rem",xs:"20rem",sm:"24rem",md:"28rem",lg:"32rem",xl:"36rem","2xl":"42rem","3xl":"48rem","4xl":"56rem","5xl":"64rem","6xl":"72rem","7xl":"80rem",full:"100%",min:"min-content",max:"max-content",fit:"fit-content",prose:"65ch",...t(e("screens"))}),minHeight:{0:"0px",full:"100%",screen:"100vh",min:"min-content",max:"max-content",fit:"fit-content"},minWidth:{0:"0px",full:"100%",min:"min-content",max:"max-content",fit:"fit-content"},objectPosition:{bottom:"bottom",center:"center",left:"left","left-bottom":"left bottom","left-top":"left top",right:"right","right-bottom":"right bottom","right-top":"right top",top:"top"},opacity:{0:"0",5:"0.05",10:"0.1",20:"0.2",25:"0.25",30:"0.3",40:"0.4",50:"0.5",60:"0.6",70:"0.7",75:"0.75",80:"0.8",90:"0.9",95:"0.95",100:"1"},order:{first:"-9999",last:"9999",none:"0",1:"1",2:"2",3:"3",4:"4",5:"5",6:"6",7:"7",8:"8",9:"9",10:"10",11:"11",12:"12"},padding:({theme:e})=>e("spacing"),placeholderColor:({theme:e})=>e("colors"),placeholderOpacity:({theme:e})=>e("opacity"),outlineColor:({theme:e})=>e("colors"),outlineOffset:{0:"0px",1:"1px",2:"2px",4:"4px",8:"8px"},outlineWidth:{0:"0px",1:"1px",2:"2px",4:"4px",8:"8px"},ringColor:({theme:e})=>({DEFAULT:e("colors.blue.500","#3b82f6"),...e("colors")}),ringOffsetColor:({theme:e})=>e("colors"),ringOffsetWidth:{0:"0px",1:"1px",2:"2px",4:"4px",8:"8px"},ringOpacity:({theme:e})=>({DEFAULT:"0.5",...e("opacity")}),ringWidth:{DEFAULT:"3px",0:"0px",1:"1px",2:"2px",4:"4px",8:"8px"},rotate:{0:"0deg",1:"1deg",2:"2deg",3:"3deg",6:"6deg",12:"12deg",45:"45deg",90:"90deg",180:"180deg"},saturate:{0:"0",50:".5",100:"1",150:"1.5",200:"2"},scale:{0:"0",50:".5",75:".75",90:".9",95:".95",100:"1",105:"1.05",110:"1.1",125:"1.25",150:"1.5"},scrollMargin:({theme:e})=>({...e("spacing")}),scrollPadding:({theme:e})=>e("spacing"),sepia:{0:"0",DEFAULT:"100%"},skew:{0:"0deg",1:"1deg",2:"2deg",3:"3deg",6:"6deg",12:"12deg"},space:({theme:e})=>({...e("spacing")}),stroke:({theme:e})=>e("colors"),strokeWidth:{0:"0",1:"1",2:"2"},textColor:({theme:e})=>e("colors"),textDecorationColor:({theme:e})=>e("colors"),textDecorationThickness:{auto:"auto","from-font":"from-font",0:"0px",1:"1px",2:"2px",4:"4px",8:"8px"},textUnderlineOffset:{auto:"auto",0:"0px",1:"1px",2:"2px",4:"4px",8:"8px"},textIndent:({theme:e})=>({...e("spacing")}),textOpacity:({theme:e})=>e("opacity"),transformOrigin:{center:"center",top:"top","top-right":"top right",right:"right","bottom-right":"bottom right",bottom:"bottom","bottom-left":"bottom left",left:"left","top-left":"top left"},transitionDelay:{75:"75ms",100:"100ms",150:"150ms",200:"200ms",300:"300ms",500:"500ms",700:"700ms",1e3:"1000ms"},transitionDuration:{DEFAULT:"150ms",75:"75ms",100:"100ms",150:"150ms",200:"200ms",300:"300ms",500:"500ms",700:"700ms",1e3:"1000ms"},transitionProperty:{none:"none",all:"all",DEFAULT:"color, background-color, border-color, text-decoration-color, fill, stroke, opacity, box-shadow, transform, filter, backdrop-filter",colors:"color, background-color, border-color, text-decoration-color, fill, stroke",opacity:"opacity",shadow:"box-shadow",transform:"transform"},transitionTimingFunction:{DEFAULT:"cubic-bezier(0.4, 0, 0.2, 1)",linear:"linear",in:"cubic-bezier(0.4, 0, 1, 1)",out:"cubic-bezier(0, 0, 0.2, 1)","in-out":"cubic-bezier(0.4, 0, 0.2, 1)"},translate:({theme:e})=>({...e("spacing"),"1/2":"50%","1/3":"33.333333%","2/3":"66.666667%","1/4":"25%","2/4":"50%","3/4":"75%",full:"100%"}),width:({theme:e})=>({auto:"auto",...e("spacing"),"1/2":"50%","1/3":"33.333333%","2/3":"66.666667%","1/4":"25%","2/4":"50%","3/4":"75%","1/5":"20%","2/5":"40%","3/5":"60%","4/5":"80%","1/6":"16.666667%","2/6":"33.333333%","3/6":"50%","4/6":"66.666667%","5/6":"83.333333%","1/12":"8.333333%","2/12":"16.666667%","3/12":"25%","4/12":"33.333333%","5/12":"41.666667%","6/12":"50%","7/12":"58.333333%","8/12":"66.666667%","9/12":"75%","10/12":"83.333333%","11/12":"91.666667%",full:"100%",screen:"100vw",min:"min-content",max:"max-content",fit:"fit-content"}),willChange:{auto:"auto",scroll:"scroll-position",contents:"contents",transform:"transform"},zIndex:{auto:"auto",0:"0",10:"10",20:"20",30:"30",40:"40",50:"50"}},variantOrder:["first","last","odd","even","visited","checked","empty","read-only","group-hover","group-focus","focus-within","hover","focus","focus-visible","active","disabled"],plugins:[]}});var hr={};uo(hr,{default:()=>ul});var ul,mr=Wr(()=>{c();ul={info(e,t){console.info(...Array.isArray(e)?[e]:[t,e])},warn(e,t){console.warn(...Array.isArray(e)?[e]:[t,e])},risk(e,t){console.error(...Array.isArray(e)?[e]:[t,e])}}});var $o=R(gn=>{"use strict";c();Object.defineProperty(gn,"__esModule",{value:!0});Object.defineProperty(gn,"default",{enumerable:!0,get:()=>cl});var ll=fl((mr(),ar(hr)));function fl(e){return e&&e.__esModule?e:{default:e}}function bt({version:e,from:t,to:n}){ll.default.warn(`${t}-color-renamed`,[`As of Tailwind CSS ${e}, \`${t}\` has been renamed to \`${n}\`.`,"Update your configuration file to silence this warning."])}var cl={inherit:"inherit",current:"currentColor",transparent:"transparent",black:"#000",white:"#fff",slate:{50:"#f8fafc",100:"#f1f5f9",200:"#e2e8f0",300:"#cbd5e1",400:"#94a3b8",500:"#64748b",600:"#475569",700:"#334155",800:"#1e293b",900:"#0f172a"},gray:{50:"#f9fafb",100:"#f3f4f6",200:"#e5e7eb",300:"#d1d5db",400:"#9ca3af",500:"#6b7280",600:"#4b5563",700:"#374151",800:"#1f2937",900:"#111827"},zinc:{50:"#fafafa",100:"#f4f4f5",200:"#e4e4e7",300:"#d4d4d8",400:"#a1a1aa",500:"#71717a",600:"#52525b",700:"#3f3f46",800:"#27272a",900:"#18181b"},neutral:{50:"#fafafa",100:"#f5f5f5",200:"#e5e5e5",300:"#d4d4d4",400:"#a3a3a3",500:"#737373",600:"#525252",700:"#404040",800:"#262626",900:"#171717"},stone:{50:"#fafaf9",100:"#f5f5f4",200:"#e7e5e4",300:"#d6d3d1",400:"#a8a29e",500:"#78716c",600:"#57534e",700:"#44403c",800:"#292524",900:"#1c1917"},red:{50:"#fef2f2",100:"#fee2e2",200:"#fecaca",300:"#fca5a5",400:"#f87171",500:"#ef4444",600:"#dc2626",700:"#b91c1c",800:"#991b1b",900:"#7f1d1d"},orange:{50:"#fff7ed",100:"#ffedd5",200:"#fed7aa",300:"#fdba74",400:"#fb923c",500:"#f97316",600:"#ea580c",700:"#c2410c",800:"#9a3412",900:"#7c2d12"},amber:{50:"#fffbeb",100:"#fef3c7",200:"#fde68a",300:"#fcd34d",400:"#fbbf24",500:"#f59e0b",600:"#d97706",700:"#b45309",800:"#92400e",900:"#78350f"},yellow:{50:"#fefce8",100:"#fef9c3",200:"#fef08a",300:"#fde047",400:"#facc15",500:"#eab308",600:"#ca8a04",700:"#a16207",800:"#854d0e",900:"#713f12"},lime:{50:"#f7fee7",100:"#ecfccb",200:"#d9f99d",300:"#bef264",400:"#a3e635",500:"#84cc16",600:"#65a30d",700:"#4d7c0f",800:"#3f6212",900:"#365314"},green:{50:"#f0fdf4",100:"#dcfce7",200:"#bbf7d0",300:"#86efac",400:"#4ade80",500:"#22c55e",600:"#16a34a",700:"#15803d",800:"#166534",900:"#14532d"},emerald:{50:"#ecfdf5",100:"#d1fae5",200:"#a7f3d0",300:"#6ee7b7",400:"#34d399",500:"#10b981",600:"#059669",700:"#047857",800:"#065f46",900:"#064e3b"},teal:{50:"#f0fdfa",100:"#ccfbf1",200:"#99f6e4",300:"#5eead4",400:"#2dd4bf",500:"#14b8a6",600:"#0d9488",700:"#0f766e",800:"#115e59",900:"#134e4a"},cyan:{50:"#ecfeff",100:"#cffafe",200:"#a5f3fc",300:"#67e8f9",400:"#22d3ee",500:"#06b6d4",600:"#0891b2",700:"#0e7490",800:"#155e75",900:"#164e63"},sky:{50:"#f0f9ff",100:"#e0f2fe",200:"#bae6fd",300:"#7dd3fc",400:"#38bdf8",500:"#0ea5e9",600:"#0284c7",700:"#0369a1",800:"#075985",900:"#0c4a6e"},blue:{50:"#eff6ff",100:"#dbeafe",200:"#bfdbfe",300:"#93c5fd",400:"#60a5fa",500:"#3b82f6",600:"#2563eb",700:"#1d4ed8",800:"#1e40af",900:"#1e3a8a"},indigo:{50:"#eef2ff",100:"#e0e7ff",200:"#c7d2fe",300:"#a5b4fc",400:"#818cf8",500:"#6366f1",600:"#4f46e5",700:"#4338ca",800:"#3730a3",900:"#312e81"},violet:{50:"#f5f3ff",100:"#ede9fe",200:"#ddd6fe",300:"#c4b5fd",400:"#a78bfa",500:"#8b5cf6",600:"#7c3aed",700:"#6d28d9",800:"#5b21b6",900:"#4c1d95"},purple:{50:"#faf5ff",100:"#f3e8ff",200:"#e9d5ff",300:"#d8b4fe",400:"#c084fc",500:"#a855f7",600:"#9333ea",700:"#7e22ce",800:"#6b21a8",900:"#581c87"},fuchsia:{50:"#fdf4ff",100:"#fae8ff",200:"#f5d0fe",300:"#f0abfc",400:"#e879f9",500:"#d946ef",600:"#c026d3",700:"#a21caf",800:"#86198f",900:"#701a75"},pink:{50:"#fdf2f8",100:"#fce7f3",200:"#fbcfe8",300:"#f9a8d4",400:"#f472b6",500:"#ec4899",600:"#db2777",700:"#be185d",800:"#9d174d",900:"#831843"},rose:{50:"#fff1f2",100:"#ffe4e6",200:"#fecdd3",300:"#fda4af",400:"#fb7185",500:"#f43f5e",600:"#e11d48",700:"#be123c",800:"#9f1239",900:"#881337"},get lightBlue(){return bt({version:"v2.2",from:"lightBlue",to:"sky"}),this.sky},get warmGray(){return bt({version:"v3.0",from:"warmGray",to:"stone"}),this.stone},get trueGray(){return bt({version:"v3.0",from:"trueGray",to:"neutral"}),this.neutral},get coolGray(){return bt({version:"v3.0",from:"coolGray",to:"gray"}),this.gray},get blueGray(){return bt({version:"v3.0",from:"blueGray",to:"slate"}),this.slate}}});var qo=R(vn=>{"use strict";c();Object.defineProperty(vn,"__esModule",{value:!0});Object.defineProperty(vn,"defaults",{enumerable:!0,get:()=>dl});function dl(e,...t){for(let i of t){for(let a in i){var n;!(e==null||(n=e.hasOwnProperty)===null||n===void 0)&&n.call(e,a)||(e[a]=i[a])}for(let a of Object.getOwnPropertySymbols(i)){var r;!(e==null||(r=e.hasOwnProperty)===null||r===void 0)&&r.call(e,a)||(e[a]=i[a])}}return e}});var Bo=R(bn=>{"use strict";c();Object.defineProperty(bn,"__esModule",{value:!0});Object.defineProperty(bn,"toPath",{enumerable:!0,get:()=>pl});function pl(e){if(Array.isArray(e))return e;let t=e.split("[").length-1,n=e.split("]").length-1;if(t!==n)throw new Error(`Path is invalid. Has unbalanced brackets: ${e}`);return e.split(/\.(?![^\[]*\])|[\[\]]/g).filter(Boolean)}});var zo=R(yn=>{"use strict";c();Object.defineProperty(yn,"__esModule",{value:!0});Object.defineProperty(yn,"normalizeConfig",{enumerable:!0,get:()=>ml});var yt=hl((mr(),ar(hr)));function Uo(e){if(typeof WeakMap!="function")return null;var t=new WeakMap,n=new WeakMap;return(Uo=function(r){return r?n:t})(e)}function hl(e,t){if(!t&&e&&e.__esModule)return e;if(e===null||typeof e!="object"&&typeof e!="function")return{default:e};var n=Uo(t);if(n&&n.has(e))return n.get(e);var r={},i=Object.defineProperty&&Object.getOwnPropertyDescriptor;for(var a in e)if(a!=="default"&&Object.prototype.hasOwnProperty.call(e,a)){var o=i?Object.getOwnPropertyDescriptor(e,a):null;o&&(o.get||o.set)?Object.defineProperty(r,a,o):r[a]=e[a]}return r.default=e,n&&n.set(e,r),r}function ml(e){if((()=>{if(e.purge||!e.content||!Array.isArray(e.content)&&!(typeof e.content=="object"&&e.content!==null))return!1;if(Array.isArray(e.content))return e.content.every(r=>typeof r=="string"?!0:!(typeof(r==null?void 0:r.raw)!="string"||(r==null?void 0:r.extension)&&typeof(r==null?void 0:r.extension)!="string"));if(typeof e.content=="object"&&e.content!==null){if(Object.keys(e.content).some(r=>!["files","extract","transform"].includes(r)))return!1;if(Array.isArray(e.content.files)){if(!e.content.files.every(r=>typeof r=="string"?!0:!(typeof(r==null?void 0:r.raw)!="string"||(r==null?void 0:r.extension)&&typeof(r==null?void 0:r.extension)!="string")))return!1;if(typeof e.content.extract=="object"){for(let r of Object.values(e.content.extract))if(typeof r!="function")return!1}else if(!(e.content.extract===void 0||typeof e.content.extract=="function"))return!1;if(typeof e.content.transform=="object"){for(let r of Object.values(e.content.transform))if(typeof r!="function")return!1}else if(!(e.content.transform===void 0||typeof e.content.transform=="function"))return!1}return!0}return!1})()||yt.default.warn("purge-deprecation",["The `purge`/`content` options have changed in Tailwind CSS v3.0.","Update your configuration file to eliminate this warning.","https://tailwindcss.com/docs/upgrade-guide#configure-content-sources"]),e.safelist=(()=>{var r;let{content:i,purge:a,safelist:o}=e;return Array.isArray(o)?o:Array.isArray(i==null?void 0:i.safelist)?i.safelist:Array.isArray(a==null?void 0:a.safelist)?a.safelist:Array.isArray(a==null||(r=a.options)===null||r===void 0?void 0:r.safelist)?a.options.safelist:[]})(),typeof e.prefix=="function")yt.default.warn("prefix-function",["As of Tailwind CSS v3.0, `prefix` cannot be a function.","Update `prefix` in your configuration to be a string to eliminate this warning.","https://tailwindcss.com/docs/upgrade-guide#prefix-cannot-be-a-function"]),e.prefix="";else{var n;e.prefix=(n=e.prefix)!==null&&n!==void 0?n:""}e.content={files:(()=>{let{content:r,purge:i}=e;return Array.isArray(i)?i:Array.isArray(i==null?void 0:i.content)?i.content:Array.isArray(r)?r:Array.isArray(r==null?void 0:r.content)?r.content:Array.isArray(r==null?void 0:r.files)?r.files:[]})(),extract:(()=>{let r=(()=>{var o,s,u,l,f,p,g,m,d,h;return!((o=e.purge)===null||o===void 0)&&o.extract?e.purge.extract:!((s=e.content)===null||s===void 0)&&s.extract?e.content.extract:!((u=e.purge)===null||u===void 0||(l=u.extract)===null||l===void 0)&&l.DEFAULT?e.purge.extract.DEFAULT:!((f=e.content)===null||f===void 0||(p=f.extract)===null||p===void 0)&&p.DEFAULT?e.content.extract.DEFAULT:!((g=e.purge)===null||g===void 0||(m=g.options)===null||m===void 0)&&m.extractors?e.purge.options.extractors:!((d=e.content)===null||d===void 0||(h=d.options)===null||h===void 0)&&h.extractors?e.content.options.extractors:{}})(),i={},a=(()=>{var o,s,u,l;if(!((o=e.purge)===null||o===void 0||(s=o.options)===null||s===void 0)&&s.defaultExtractor)return e.purge.options.defaultExtractor;if(!((u=e.content)===null||u===void 0||(l=u.options)===null||l===void 0)&&l.defaultExtractor)return e.content.options.defaultExtractor})();if(a!==void 0&&(i.DEFAULT=a),typeof r=="function")i.DEFAULT=r;else if(Array.isArray(r))for(let{extensions:o,extractor:s}of r!=null?r:[])for(let u of o)i[u]=s;else typeof r=="object"&&r!==null&&Object.assign(i,r);return i})(),transform:(()=>{let r=(()=>{var a,o,s,u,l,f;return!((a=e.purge)===null||a===void 0)&&a.transform?e.purge.transform:!((o=e.content)===null||o===void 0)&&o.transform?e.content.transform:!((s=e.purge)===null||s===void 0||(u=s.transform)===null||u===void 0)&&u.DEFAULT?e.purge.transform.DEFAULT:!((l=e.content)===null||l===void 0||(f=l.transform)===null||f===void 0)&&f.DEFAULT?e.content.transform.DEFAULT:{}})(),i={};return typeof r=="function"&&(i.DEFAULT=r),typeof r=="object"&&r!==null&&Object.assign(i,r),i})()};for(let r of e.content.files)if(typeof r=="string"&&/{([^,]*?)}/g.test(r)){yt.default.warn("invalid-glob-braces",[`The glob pattern ${(0,yt.dim)(r)} in your Tailwind CSS configuration is invalid.`,`Update it to ${(0,yt.dim)(r.replace(/{([^,]*?)}/g,"$1"))} to silence this warning.`]);break}return e}});var Go=R(xn=>{"use strict";c();Object.defineProperty(xn,"__esModule",{value:!0});Object.defineProperty(xn,"default",{enumerable:!0,get:()=>gl});function gl(e){if(Object.prototype.toString.call(e)!=="[object Object]")return!1;let t=Object.getPrototypeOf(e);return t===null||t===Object.prototype}});var jo=R(_n=>{"use strict";c();Object.defineProperty(_n,"__esModule",{value:!0});Object.defineProperty(_n,"cloneDeep",{enumerable:!0,get:()=>wn});function wn(e){return Array.isArray(e)?e.map(t=>wn(t)):typeof e=="object"&&e!==null?Object.fromEntries(Object.entries(e).map(([t,n])=>[t,wn(n)])):e}});var Sn=R((gr,Vo)=>{"use strict";c();gr.__esModule=!0;gr.default=yl;function vl(e){for(var t=e.toLowerCase(),n="",r=!1,i=0;i<6&&t[i]!==void 0;i++){var a=t.charCodeAt(i),o=a>=97&&a<=102||a>=48&&a<=57;if(r=a===32,!o)break;n+=t[i]}if(n.length!==0){var s=parseInt(n,16),u=s>=55296&&s<=57343;return u||s===0||s>1114111?["\uFFFD",n.length+(r?1:0)]:[String.fromCodePoint(s),n.length+(r?1:0)]}}var bl=/\\/;function yl(e){var t=bl.test(e);if(!t)return e;for(var n="",r=0;r<e.length;r++){if(e[r]==="\\"){var i=vl(e.slice(r+1,r+7));if(i!==void 0){n+=i[0],r+=i[1];continue}if(e[r+1]==="\\"){n+="\\",r++;continue}e.length===r+1&&(n+=e[r]);continue}n+=e[r]}return n}Vo.exports=gr.default});var Yo=R((vr,Ho)=>{"use strict";c();vr.__esModule=!0;vr.default=xl;function xl(e){for(var t=arguments.length,n=new Array(t>1?t-1:0),r=1;r<t;r++)n[r-1]=arguments[r];for(;n.length>0;){var i=n.shift();if(!e[i])return;e=e[i]}return e}Ho.exports=vr.default});var Qo=R((br,Xo)=>{"use strict";c();br.__esModule=!0;br.default=wl;function wl(e){for(var t=arguments.length,n=new Array(t>1?t-1:0),r=1;r<t;r++)n[r-1]=arguments[r];for(;n.length>0;){var i=n.shift();e[i]||(e[i]={}),e=e[i]}}Xo.exports=br.default});var Ko=R((yr,Jo)=>{"use strict";c();yr.__esModule=!0;yr.default=_l;function _l(e){for(var t="",n=e.indexOf("/*"),r=0;n>=0;){t=t+e.slice(r,n);var i=e.indexOf("*/",n+2);if(i<0)return t;r=i+2,n=e.indexOf("/*",r)}return t=t+e.slice(r),t}Jo.exports=yr.default});var xt=R(Te=>{"use strict";c();Te.__esModule=!0;Te.stripComments=Te.ensureObject=Te.getProp=Te.unesc=void 0;var Sl=xr(Sn());Te.unesc=Sl.default;var kl=xr(Yo());Te.getProp=kl.default;var Tl=xr(Qo());Te.ensureObject=Tl.default;var El=xr(Ko());Te.stripComments=El.default;function xr(e){return e&&e.__esModule?e:{default:e}}});var Re=R((wt,ta)=>{"use strict";c();wt.__esModule=!0;wt.default=void 0;var Zo=xt();function ea(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}function Ol(e,t,n){return t&&ea(e.prototype,t),n&&ea(e,n),e}var Pl=function e(t,n){if(typeof t!="object"||t===null)return t;var r=new t.constructor;for(var i in t)if(!!t.hasOwnProperty(i)){var a=t[i],o=typeof a;i==="parent"&&o==="object"?n&&(r[i]=n):a instanceof Array?r[i]=a.map(function(s){return e(s,r)}):r[i]=e(a,r)}return r},Al=function(){function e(n){n===void 0&&(n={}),Object.assign(this,n),this.spaces=this.spaces||{},this.spaces.before=this.spaces.before||"",this.spaces.after=this.spaces.after||""}var t=e.prototype;return t.remove=function(){return this.parent&&this.parent.removeChild(this),this.parent=void 0,this},t.replaceWith=function(){if(this.parent){for(var r in arguments)this.parent.insertBefore(this,arguments[r]);this.remove()}return this},t.next=function(){return this.parent.at(this.parent.index(this)+1)},t.prev=function(){return this.parent.at(this.parent.index(this)-1)},t.clone=function(r){r===void 0&&(r={});var i=Pl(this);for(var a in r)i[a]=r[a];return i},t.appendToPropertyAndEscape=function(r,i,a){this.raws||(this.raws={});var o=this[r],s=this.raws[r];this[r]=o+i,s||a!==i?this.raws[r]=(s||o)+a:delete this.raws[r]},t.setPropertyAndEscape=function(r,i,a){this.raws||(this.raws={}),this[r]=i,this.raws[r]=a},t.setPropertyWithoutEscape=function(r,i){this[r]=i,this.raws&&delete this.raws[r]},t.isAtPosition=function(r,i){if(this.source&&this.source.start&&this.source.end)return!(this.source.start.line>r||this.source.end.line<r||this.source.start.line===r&&this.source.start.column>i||this.source.end.line===r&&this.source.end.column<i)},t.stringifyProperty=function(r){return this.raws&&this.raws[r]||this[r]},t.valueToString=function(){return String(this.stringifyProperty("value"))},t.toString=function(){return[this.rawSpaceBefore,this.valueToString(),this.rawSpaceAfter].join("")},Ol(e,[{key:"rawSpaceBefore",get:function(){var r=this.raws&&this.raws.spaces&&this.raws.spaces.before;return r===void 0&&(r=this.spaces&&this.spaces.before),r||""},set:function(r){(0,Zo.ensureObject)(this,"raws","spaces"),this.raws.spaces.before=r}},{key:"rawSpaceAfter",get:function(){var r=this.raws&&this.raws.spaces&&this.raws.spaces.after;return r===void 0&&(r=this.spaces.after),r||""},set:function(r){(0,Zo.ensureObject)(this,"raws","spaces"),this.raws.spaces.after=r}}]),e}();wt.default=Al;ta.exports=wt.default});var ne=R(H=>{"use strict";c();H.__esModule=!0;H.UNIVERSAL=H.ATTRIBUTE=H.CLASS=H.COMBINATOR=H.COMMENT=H.ID=H.NESTING=H.PSEUDO=H.ROOT=H.SELECTOR=H.STRING=H.TAG=void 0;var Rl="tag";H.TAG=Rl;var Il="string";H.STRING=Il;var Ll="selector";H.SELECTOR=Ll;var Cl="root";H.ROOT=Cl;var Dl="pseudo";H.PSEUDO=Dl;var Fl="nesting";H.NESTING=Fl;var Ml="id";H.ID=Ml;var Nl="comment";H.COMMENT=Nl;var Wl="combinator";H.COMBINATOR=Wl;var $l="class";H.CLASS=$l;var ql="attribute";H.ATTRIBUTE=ql;var Bl="universal";H.UNIVERSAL=Bl});var wr=R((_t,oa)=>{"use strict";c();_t.__esModule=!0;_t.default=void 0;var Ul=Gl(Re()),Ie=zl(ne());function ia(){if(typeof WeakMap!="function")return null;var e=new WeakMap;return ia=function(){return e},e}function zl(e){if(e&&e.__esModule)return e;if(e===null||typeof e!="object"&&typeof e!="function")return{default:e};var t=ia();if(t&&t.has(e))return t.get(e);var n={},r=Object.defineProperty&&Object.getOwnPropertyDescriptor;for(var i in e)if(Object.prototype.hasOwnProperty.call(e,i)){var a=r?Object.getOwnPropertyDescriptor(e,i):null;a&&(a.get||a.set)?Object.defineProperty(n,i,a):n[i]=e[i]}return n.default=e,t&&t.set(e,n),n}function Gl(e){return e&&e.__esModule?e:{default:e}}function jl(e,t){var n;if(typeof Symbol>"u"||e[Symbol.iterator]==null){if(Array.isArray(e)||(n=Vl(e))||t&&e&&typeof e.length=="number"){n&&(e=n);var r=0;return function(){return r>=e.length?{done:!0}:{done:!1,value:e[r++]}}}throw new TypeError(`Invalid attempt to iterate non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`)}return n=e[Symbol.iterator](),n.next.bind(n)}function Vl(e,t){if(!!e){if(typeof e=="string")return ra(e,t);var n=Object.prototype.toString.call(e).slice(8,-1);if(n==="Object"&&e.constructor&&(n=e.constructor.name),n==="Map"||n==="Set")return Array.from(e);if(n==="Arguments"||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n))return ra(e,t)}}function ra(e,t){(t==null||t>e.length)&&(t=e.length);for(var n=0,r=new Array(t);n<t;n++)r[n]=e[n];return r}function na(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}function Hl(e,t,n){return t&&na(e.prototype,t),n&&na(e,n),e}function Yl(e,t){e.prototype=Object.create(t.prototype),e.prototype.constructor=e,kn(e,t)}function kn(e,t){return kn=Object.setPrototypeOf||function(r,i){return r.__proto__=i,r},kn(e,t)}var Xl=function(e){Yl(t,e);function t(r){var i;return i=e.call(this,r)||this,i.nodes||(i.nodes=[]),i}var n=t.prototype;return n.append=function(i){return i.parent=this,this.nodes.push(i),this},n.prepend=function(i){return i.parent=this,this.nodes.unshift(i),this},n.at=function(i){return this.nodes[i]},n.index=function(i){return typeof i=="number"?i:this.nodes.indexOf(i)},n.removeChild=function(i){i=this.index(i),this.at(i).parent=void 0,this.nodes.splice(i,1);var a;for(var o in this.indexes)a=this.indexes[o],a>=i&&(this.indexes[o]=a-1);return this},n.removeAll=function(){for(var i=jl(this.nodes),a;!(a=i()).done;){var o=a.value;o.parent=void 0}return this.nodes=[],this},n.empty=function(){return this.removeAll()},n.insertAfter=function(i,a){a.parent=this;var o=this.index(i);this.nodes.splice(o+1,0,a),a.parent=this;var s;for(var u in this.indexes)s=this.indexes[u],o<=s&&(this.indexes[u]=s+1);return this},n.insertBefore=function(i,a){a.parent=this;var o=this.index(i);this.nodes.splice(o,0,a),a.parent=this;var s;for(var u in this.indexes)s=this.indexes[u],s<=o&&(this.indexes[u]=s+1);return this},n._findChildAtPosition=function(i,a){var o=void 0;return this.each(function(s){if(s.atPosition){var u=s.atPosition(i,a);if(u)return o=u,!1}else if(s.isAtPosition(i,a))return o=s,!1}),o},n.atPosition=function(i,a){if(this.isAtPosition(i,a))return this._findChildAtPosition(i,a)||this},n._inferEndPosition=function(){this.last&&this.last.source&&this.last.source.end&&(this.source=this.source||{},this.source.end=this.source.end||{},Object.assign(this.source.end,this.last.source.end))},n.each=function(i){this.lastEach||(this.lastEach=0),this.indexes||(this.indexes={}),this.lastEach++;var a=this.lastEach;if(this.indexes[a]=0,!!this.length){for(var o,s;this.indexes[a]<this.length&&(o=this.indexes[a],s=i(this.at(o),o),s!==!1);)this.indexes[a]+=1;if(delete this.indexes[a],s===!1)return!1}},n.walk=function(i){return this.each(function(a,o){var s=i(a,o);if(s!==!1&&a.length&&(s=a.walk(i)),s===!1)return!1})},n.walkAttributes=function(i){var a=this;return this.walk(function(o){if(o.type===Ie.ATTRIBUTE)return i.call(a,o)})},n.walkClasses=function(i){var a=this;return this.walk(function(o){if(o.type===Ie.CLASS)return i.call(a,o)})},n.walkCombinators=function(i){var a=this;return this.walk(function(o){if(o.type===Ie.COMBINATOR)return i.call(a,o)})},n.walkComments=function(i){var a=this;return this.walk(function(o){if(o.type===Ie.COMMENT)return i.call(a,o)})},n.walkIds=function(i){var a=this;return this.walk(function(o){if(o.type===Ie.ID)return i.call(a,o)})},n.walkNesting=function(i){var a=this;return this.walk(function(o){if(o.type===Ie.NESTING)return i.call(a,o)})},n.walkPseudos=function(i){var a=this;return this.walk(function(o){if(o.type===Ie.PSEUDO)return i.call(a,o)})},n.walkTags=function(i){var a=this;return this.walk(function(o){if(o.type===Ie.TAG)return i.call(a,o)})},n.walkUniversals=function(i){var a=this;return this.walk(function(o){if(o.type===Ie.UNIVERSAL)return i.call(a,o)})},n.split=function(i){var a=this,o=[];return this.reduce(function(s,u,l){var f=i.call(a,u);return o.push(u),f?(s.push(o),o=[]):l===a.length-1&&s.push(o),s},[])},n.map=function(i){return this.nodes.map(i)},n.reduce=function(i,a){return this.nodes.reduce(i,a)},n.every=function(i){return this.nodes.every(i)},n.some=function(i){return this.nodes.some(i)},n.filter=function(i){return this.nodes.filter(i)},n.sort=function(i){return this.nodes.sort(i)},n.toString=function(){return this.map(String).join("")},Hl(t,[{key:"first",get:function(){return this.at(0)}},{key:"last",get:function(){return this.at(this.length-1)}},{key:"length",get:function(){return this.nodes.length}}]),t}(Ul.default);_t.default=Xl;oa.exports=_t.default});var En=R((St,sa)=>{"use strict";c();St.__esModule=!0;St.default=void 0;var Ql=Kl(wr()),Jl=ne();function Kl(e){return e&&e.__esModule?e:{default:e}}function aa(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}function Zl(e,t,n){return t&&aa(e.prototype,t),n&&aa(e,n),e}function ef(e,t){e.prototype=Object.create(t.prototype),e.prototype.constructor=e,Tn(e,t)}function Tn(e,t){return Tn=Object.setPrototypeOf||function(r,i){return r.__proto__=i,r},Tn(e,t)}var tf=function(e){ef(t,e);function t(r){var i;return i=e.call(this,r)||this,i.type=Jl.ROOT,i}var n=t.prototype;return n.toString=function(){var i=this.reduce(function(a,o){return a.push(String(o)),a},[]).join(",");return this.trailingComma?i+",":i},n.error=function(i,a){return this._error?this._error(i,a):new Error(i)},Zl(t,[{key:"errorGenerator",set:function(i){this._error=i}}]),t}(Ql.default);St.default=tf;sa.exports=St.default});var Pn=R((kt,ua)=>{"use strict";c();kt.__esModule=!0;kt.default=void 0;var rf=of(wr()),nf=ne();function of(e){return e&&e.__esModule?e:{default:e}}function af(e,t){e.prototype=Object.create(t.prototype),e.prototype.constructor=e,On(e,t)}function On(e,t){return On=Object.setPrototypeOf||function(r,i){return r.__proto__=i,r},On(e,t)}var sf=function(e){af(t,e);function t(n){var r;return r=e.call(this,n)||this,r.type=nf.SELECTOR,r}return t}(rf.default);kt.default=sf;ua.exports=kt.default});var _r=R((Hm,la)=>{"use strict";c();var uf={},lf=uf.hasOwnProperty,ff=function(t,n){if(!t)return n;var r={};for(var i in n)r[i]=lf.call(t,i)?t[i]:n[i];return r},cf=/[ -,\.\/:-@\[-\^`\{-~]/,df=/[ -,\.\/:-@\[\]\^`\{-~]/,pf=/(^|\\+)?(\\[A-F0-9]{1,6})\x20(?![a-fA-F0-9\x20])/g,An=function e(t,n){n=ff(n,e.options),n.quotes!="single"&&n.quotes!="double"&&(n.quotes="single");for(var r=n.quotes=="double"?'"':"'",i=n.isIdentifier,a=t.charAt(0),o="",s=0,u=t.length;s<u;){var l=t.charAt(s++),f=l.charCodeAt(),p=void 0;if(f<32||f>126){if(f>=55296&&f<=56319&&s<u){var g=t.charCodeAt(s++);(g&64512)==56320?f=((f&1023)<<10)+(g&1023)+65536:s--}p="\\"+f.toString(16).toUpperCase()+" "}else n.escapeEverything?cf.test(l)?p="\\"+l:p="\\"+f.toString(16).toUpperCase()+" ":/[\t\n\f\r\x0B]/.test(l)?p="\\"+f.toString(16).toUpperCase()+" ":l=="\\"||!i&&(l=='"'&&r==l||l=="'"&&r==l)||i&&df.test(l)?p="\\"+l:p=l;o+=p}return i&&(/^-[-\d]/.test(o)?o="\\-"+o.slice(1):/\d/.test(a)&&(o="\\3"+a+" "+o.slice(1))),o=o.replace(pf,function(m,d,h){return d&&d.length%2?m:(d||"")+h}),!i&&n.wrap?r+o+r:o};An.options={escapeEverything:!1,isIdentifier:!1,quotes:"single",wrap:!1};An.version="3.0.0";la.exports=An});var In=R((Tt,da)=>{"use strict";c();Tt.__esModule=!0;Tt.default=void 0;var hf=ca(_r()),mf=xt(),gf=ca(Re()),vf=ne();function ca(e){return e&&e.__esModule?e:{default:e}}function fa(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}function bf(e,t,n){return t&&fa(e.prototype,t),n&&fa(e,n),e}function yf(e,t){e.prototype=Object.create(t.prototype),e.prototype.constructor=e,Rn(e,t)}function Rn(e,t){return Rn=Object.setPrototypeOf||function(r,i){return r.__proto__=i,r},Rn(e,t)}var xf=function(e){yf(t,e);function t(r){var i;return i=e.call(this,r)||this,i.type=vf.CLASS,i._constructed=!0,i}var n=t.prototype;return n.valueToString=function(){return"."+e.prototype.valueToString.call(this)},bf(t,[{key:"value",get:function(){return this._value},set:function(i){if(this._constructed){var a=(0,hf.default)(i,{isIdentifier:!0});a!==i?((0,mf.ensureObject)(this,"raws"),this.raws.value=a):this.raws&&delete this.raws.value}this._value=i}}]),t}(gf.default);Tt.default=xf;da.exports=Tt.default});var Cn=R((Et,pa)=>{"use strict";c();Et.__esModule=!0;Et.default=void 0;var wf=Sf(Re()),_f=ne();function Sf(e){return e&&e.__esModule?e:{default:e}}function kf(e,t){e.prototype=Object.create(t.prototype),e.prototype.constructor=e,Ln(e,t)}function Ln(e,t){return Ln=Object.setPrototypeOf||function(r,i){return r.__proto__=i,r},Ln(e,t)}var Tf=function(e){kf(t,e);function t(n){var r;return r=e.call(this,n)||this,r.type=_f.COMMENT,r}return t}(wf.default);Et.default=Tf;pa.exports=Et.default});var Fn=R((Ot,ha)=>{"use strict";c();Ot.__esModule=!0;Ot.default=void 0;var Ef=Pf(Re()),Of=ne();function Pf(e){return e&&e.__esModule?e:{default:e}}function Af(e,t){e.prototype=Object.create(t.prototype),e.prototype.constructor=e,Dn(e,t)}function Dn(e,t){return Dn=Object.setPrototypeOf||function(r,i){return r.__proto__=i,r},Dn(e,t)}var Rf=function(e){Af(t,e);function t(r){var i;return i=e.call(this,r)||this,i.type=Of.ID,i}var n=t.prototype;return n.valueToString=function(){return"#"+e.prototype.valueToString.call(this)},t}(Ef.default);Ot.default=Rf;ha.exports=Ot.default});var Sr=R((Pt,va)=>{"use strict";c();Pt.__esModule=!0;Pt.default=void 0;var If=ga(_r()),Lf=xt(),Cf=ga(Re());function ga(e){return e&&e.__esModule?e:{default:e}}function ma(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}function Df(e,t,n){return t&&ma(e.prototype,t),n&&ma(e,n),e}function Ff(e,t){e.prototype=Object.create(t.prototype),e.prototype.constructor=e,Mn(e,t)}function Mn(e,t){return Mn=Object.setPrototypeOf||function(r,i){return r.__proto__=i,r},Mn(e,t)}var Mf=function(e){Ff(t,e);function t(){return e.apply(this,arguments)||this}var n=t.prototype;return n.qualifiedName=function(i){return this.namespace?this.namespaceString+"|"+i:i},n.valueToString=function(){return this.qualifiedName(e.prototype.valueToString.call(this))},Df(t,[{key:"namespace",get:function(){return this._namespace},set:function(i){if(i===!0||i==="*"||i==="&"){this._namespace=i,this.raws&&delete this.raws.namespace;return}var a=(0,If.default)(i,{isIdentifier:!0});this._namespace=i,a!==i?((0,Lf.ensureObject)(this,"raws"),this.raws.namespace=a):this.raws&&delete this.raws.namespace}},{key:"ns",get:function(){return this._namespace},set:function(i){this.namespace=i}},{key:"namespaceString",get:function(){if(this.namespace){var i=this.stringifyProperty("namespace");return i===!0?"":i}else return""}}]),t}(Cf.default);Pt.default=Mf;va.exports=Pt.default});var Wn=R((At,ba)=>{"use strict";c();At.__esModule=!0;At.default=void 0;var Nf=$f(Sr()),Wf=ne();function $f(e){return e&&e.__esModule?e:{default:e}}function qf(e,t){e.prototype=Object.create(t.prototype),e.prototype.constructor=e,Nn(e,t)}function Nn(e,t){return Nn=Object.setPrototypeOf||function(r,i){return r.__proto__=i,r},Nn(e,t)}var Bf=function(e){qf(t,e);function t(n){var r;return r=e.call(this,n)||this,r.type=Wf.TAG,r}return t}(Nf.default);At.default=Bf;ba.exports=At.default});var qn=R((Rt,ya)=>{"use strict";c();Rt.__esModule=!0;Rt.default=void 0;var Uf=Gf(Re()),zf=ne();function Gf(e){return e&&e.__esModule?e:{default:e}}function jf(e,t){e.prototype=Object.create(t.prototype),e.prototype.constructor=e,$n(e,t)}function $n(e,t){return $n=Object.setPrototypeOf||function(r,i){return r.__proto__=i,r},$n(e,t)}var Vf=function(e){jf(t,e);function t(n){var r;return r=e.call(this,n)||this,r.type=zf.STRING,r}return t}(Uf.default);Rt.default=Vf;ya.exports=Rt.default});var Un=R((It,xa)=>{"use strict";c();It.__esModule=!0;It.default=void 0;var Hf=Xf(wr()),Yf=ne();function Xf(e){return e&&e.__esModule?e:{default:e}}function Qf(e,t){e.prototype=Object.create(t.prototype),e.prototype.constructor=e,Bn(e,t)}function Bn(e,t){return Bn=Object.setPrototypeOf||function(r,i){return r.__proto__=i,r},Bn(e,t)}var Jf=function(e){Qf(t,e);function t(r){var i;return i=e.call(this,r)||this,i.type=Yf.PSEUDO,i}var n=t.prototype;return n.toString=function(){var i=this.length?"("+this.map(String).join(",")+")":"";return[this.rawSpaceBefore,this.stringifyProperty("value"),i,this.rawSpaceAfter].join("")},t}(Hf.default);It.default=Jf;xa.exports=It.default});var index_wasm_a=R((Ym,wa)=>{c();wa.exports=function(t,n){return function(...r){return console.warn(n),t(...r)}}});var Yn=R(Dt=>{"use strict";c();Dt.__esModule=!0;Dt.unescapeValue=Hn;Dt.default=void 0;var Lt=Vn(_r()),Kf=Vn(Sn()),Zf=Vn(Sr()),ec=ne(),zn;function Vn(e){return e&&e.__esModule?e:{default:e}}function Sa(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}function tc(e,t,n){return t&&Sa(e.prototype,t),n&&Sa(e,n),e}function rc(e,t){e.prototype=Object.create(t.prototype),e.prototype.constructor=e,jn(e,t)}function jn(e,t){return jn=Object.setPrototypeOf||function(r,i){return r.__proto__=i,r},jn(e,t)}var Ct=index_wasm_a(),nc=/^('|")([^]*)\1$/,ic=Ct(function(){},"Assigning an attribute a value containing characters that might need to be escaped is deprecated. Call attribute.setValue() instead."),oc=Ct(function(){},"Assigning attr.quoted is deprecated and has no effect. Assign to attr.quoteMark instead."),ac=Ct(function(){},"Constructing an Attribute selector with a value without specifying quoteMark is deprecated. Note: The value should be unescaped now.");function Hn(e){var t=!1,n=null,r=e,i=r.match(nc);return i&&(n=i[1],r=i[2]),r=(0,Kf.default)(r),r!==e&&(t=!0),{deprecatedUsage:t,unescaped:r,quoteMark:n}}function sc(e){if(e.quoteMark!==void 0||e.value===void 0)return e;ac();var t=Hn(e.value),n=t.quoteMark,r=t.unescaped;return e.raws||(e.raws={}),e.raws.value===void 0&&(e.raws.value=e.value),e.value=r,e.quoteMark=n,e}var kr=function(e){rc(t,e);function t(r){var i;return r===void 0&&(r={}),i=e.call(this,sc(r))||this,i.type=ec.ATTRIBUTE,i.raws=i.raws||{},Object.defineProperty(i.raws,"unquoted",{get:Ct(function(){return i.value},"attr.raws.unquoted is deprecated. Call attr.value instead."),set:Ct(function(){return i.value},"Setting attr.raws.unquoted is deprecated and has no effect. attr.value is unescaped by default now.")}),i._constructed=!0,i}var n=t.prototype;return n.getQuotedValue=function(i){i===void 0&&(i={});var a=this._determineQuoteMark(i),o=Gn[a],s=(0,Lt.default)(this._value,o);return s},n._determineQuoteMark=function(i){return i.smart?this.smartQuoteMark(i):this.preferredQuoteMark(i)},n.setValue=function(i,a){a===void 0&&(a={}),this._value=i,this._quoteMark=this._determineQuoteMark(a),this._syncRawValue()},n.smartQuoteMark=function(i){var a=this.value,o=a.replace(/[^']/g,"").length,s=a.replace(/[^"]/g,"").length;if(o+s===0){var u=(0,Lt.default)(a,{isIdentifier:!0});if(u===a)return t.NO_QUOTE;var l=this.preferredQuoteMark(i);if(l===t.NO_QUOTE){var f=this.quoteMark||i.quoteMark||t.DOUBLE_QUOTE,p=Gn[f],g=(0,Lt.default)(a,p);if(g.length<u.length)return f}return l}else return s===o?this.preferredQuoteMark(i):s<o?t.DOUBLE_QUOTE:t.SINGLE_QUOTE},n.preferredQuoteMark=function(i){var a=i.preferCurrentQuoteMark?this.quoteMark:i.quoteMark;return a===void 0&&(a=i.preferCurrentQuoteMark?i.quoteMark:this.quoteMark),a===void 0&&(a=t.DOUBLE_QUOTE),a},n._syncRawValue=function(){var i=(0,Lt.default)(this._value,Gn[this.quoteMark]);i===this._value?this.raws&&delete this.raws.value:this.raws.value=i},n._handleEscapes=function(i,a){if(this._constructed){var o=(0,Lt.default)(a,{isIdentifier:!0});o!==a?this.raws[i]=o:delete this.raws[i]}},n._spacesFor=function(i){var a={before:"",after:""},o=this.spaces[i]||{},s=this.raws.spaces&&this.raws.spaces[i]||{};return Object.assign(a,o,s)},n._stringFor=function(i,a,o){a===void 0&&(a=i),o===void 0&&(o=ka);var s=this._spacesFor(a);return o(this.stringifyProperty(i),s)},n.offsetOf=function(i){var a=1,o=this._spacesFor("attribute");if(a+=o.before.length,i==="namespace"||i==="ns")return this.namespace?a:-1;if(i==="attributeNS"||(a+=this.namespaceString.length,this.namespace&&(a+=1),i==="attribute"))return a;a+=this.stringifyProperty("attribute").length,a+=o.after.length;var s=this._spacesFor("operator");a+=s.before.length;var u=this.stringifyProperty("operator");if(i==="operator")return u?a:-1;a+=u.length,a+=s.after.length;var l=this._spacesFor("value");a+=l.before.length;var f=this.stringifyProperty("value");if(i==="value")return f?a:-1;a+=f.length,a+=l.after.length;var p=this._spacesFor("insensitive");return a+=p.before.length,i==="insensitive"&&this.insensitive?a:-1},n.toString=function(){var i=this,a=[this.rawSpaceBefore,"["];return a.push(this._stringFor("qualifiedAttribute","attribute")),this.operator&&(this.value||this.value==="")&&(a.push(this._stringFor("operator")),a.push(this._stringFor("value")),a.push(this._stringFor("insensitiveFlag","insensitive",function(o,s){return o.length>0&&!i.quoted&&s.before.length===0&&!(i.spaces.value&&i.spaces.value.after)&&(s.before=" "),ka(o,s)}))),a.push("]"),a.push(this.rawSpaceAfter),a.join("")},tc(t,[{key:"quoted",get:function(){var i=this.quoteMark;return i==="'"||i==='"'},set:function(i){oc()}},{key:"quoteMark",get:function(){return this._quoteMark},set:function(i){if(!this._constructed){this._quoteMark=i;return}this._quoteMark!==i&&(this._quoteMark=i,this._syncRawValue())}},{key:"qualifiedAttribute",get:function(){return this.qualifiedName(this.raws.attribute||this.attribute)}},{key:"insensitiveFlag",get:function(){return this.insensitive?"i":""}},{key:"value",get:function(){return this._value},set:function(i){if(this._constructed){var a=Hn(i),o=a.deprecatedUsage,s=a.unescaped,u=a.quoteMark;if(o&&ic(),s===this._value&&u===this._quoteMark)return;this._value=s,this._quoteMark=u,this._syncRawValue()}else this._value=i}},{key:"attribute",get:function(){return this._attribute},set:function(i){this._handleEscapes("attribute",i),this._attribute=i}}]),t}(Zf.default);Dt.default=kr;kr.NO_QUOTE=null;kr.SINGLE_QUOTE="'";kr.DOUBLE_QUOTE='"';var Gn=(zn={"'":{quotes:"single",wrap:!0},'"':{quotes:"double",wrap:!0}},zn[null]={isIdentifier:!0},zn);function ka(e,t){return""+t.before+e+t.after}});var Qn=R((Ft,Ta)=>{"use strict";c();Ft.__esModule=!0;Ft.default=void 0;var uc=fc(Sr()),lc=ne();function fc(e){return e&&e.__esModule?e:{default:e}}function cc(e,t){e.prototype=Object.create(t.prototype),e.prototype.constructor=e,Xn(e,t)}function Xn(e,t){return Xn=Object.setPrototypeOf||function(r,i){return r.__proto__=i,r},Xn(e,t)}var dc=function(e){cc(t,e);function t(n){var r;return r=e.call(this,n)||this,r.type=lc.UNIVERSAL,r.value="*",r}return t}(uc.default);Ft.default=dc;Ta.exports=Ft.default});var Kn=R((Mt,Ea)=>{"use strict";c();Mt.__esModule=!0;Mt.default=void 0;var pc=mc(Re()),hc=ne();function mc(e){return e&&e.__esModule?e:{default:e}}function gc(e,t){e.prototype=Object.create(t.prototype),e.prototype.constructor=e,Jn(e,t)}function Jn(e,t){return Jn=Object.setPrototypeOf||function(r,i){return r.__proto__=i,r},Jn(e,t)}var vc=function(e){gc(t,e);function t(n){var r;return r=e.call(this,n)||this,r.type=hc.COMBINATOR,r}return t}(pc.default);Mt.default=vc;Ea.exports=Mt.default});var ei=R((Nt,Oa)=>{"use strict";c();Nt.__esModule=!0;Nt.default=void 0;var bc=xc(Re()),yc=ne();function xc(e){return e&&e.__esModule?e:{default:e}}function wc(e,t){e.prototype=Object.create(t.prototype),e.prototype.constructor=e,Zn(e,t)}function Zn(e,t){return Zn=Object.setPrototypeOf||function(r,i){return r.__proto__=i,r},Zn(e,t)}var _c=function(e){wc(t,e);function t(n){var r;return r=e.call(this,n)||this,r.type=yc.NESTING,r.value="&",r}return t}(bc.default);Nt.default=_c;Oa.exports=Nt.default});var Aa=R((Tr,Pa)=>{"use strict";c();Tr.__esModule=!0;Tr.default=Sc;function Sc(e){return e.sort(function(t,n){return t-n})}Pa.exports=Tr.default});var ti=R(O=>{"use strict";c();O.__esModule=!0;O.combinator=O.word=O.comment=O.str=O.tab=O.newline=O.feed=O.cr=O.backslash=O.bang=O.slash=O.doubleQuote=O.singleQuote=O.space=O.greaterThan=O.pipe=O.equals=O.plus=O.caret=O.tilde=O.dollar=O.closeSquare=O.openSquare=O.closeParenthesis=O.openParenthesis=O.semicolon=O.colon=O.comma=O.at=O.asterisk=O.ampersand=void 0;var kc=38;O.ampersand=kc;var Tc=42;O.asterisk=Tc;var Ec=64;O.at=Ec;var Oc=44;O.comma=Oc;var Pc=58;O.colon=Pc;var Ac=59;O.semicolon=Ac;var Rc=40;O.openParenthesis=Rc;var Ic=41;O.closeParenthesis=Ic;var Lc=91;O.openSquare=Lc;var Cc=93;O.closeSquare=Cc;var Dc=36;O.dollar=Dc;var Fc=126;O.tilde=Fc;var Mc=94;O.caret=Mc;var Nc=43;O.plus=Nc;var Wc=61;O.equals=Wc;var $c=124;O.pipe=$c;var qc=62;O.greaterThan=qc;var Bc=32;O.space=Bc;var Ra=39;O.singleQuote=Ra;var Uc=34;O.doubleQuote=Uc;var zc=47;O.slash=zc;var Gc=33;O.bang=Gc;var jc=92;O.backslash=jc;var Vc=13;O.cr=Vc;var Hc=12;O.feed=Hc;var Yc=10;O.newline=Yc;var Xc=9;O.tab=Xc;var Qc=Ra;O.str=Qc;var Jc=-1;O.comment=Jc;var Kc=-2;O.word=Kc;var Zc=-3;O.combinator=Zc});var Ca=R(Wt=>{"use strict";c();Wt.__esModule=!0;Wt.default=ad;Wt.FIELDS=void 0;var k=ed(ti()),rt,V;function La(){if(typeof WeakMap!="function")return null;var e=new WeakMap;return La=function(){return e},e}function ed(e){if(e&&e.__esModule)return e;if(e===null||typeof e!="object"&&typeof e!="function")return{default:e};var t=La();if(t&&t.has(e))return t.get(e);var n={},r=Object.defineProperty&&Object.getOwnPropertyDescriptor;for(var i in e)if(Object.prototype.hasOwnProperty.call(e,i)){var a=r?Object.getOwnPropertyDescriptor(e,i):null;a&&(a.get||a.set)?Object.defineProperty(n,i,a):n[i]=e[i]}return n.default=e,t&&t.set(e,n),n}var td=(rt={},rt[k.tab]=!0,rt[k.newline]=!0,rt[k.cr]=!0,rt[k.feed]=!0,rt),rd=(V={},V[k.space]=!0,V[k.tab]=!0,V[k.newline]=!0,V[k.cr]=!0,V[k.feed]=!0,V[k.ampersand]=!0,V[k.asterisk]=!0,V[k.bang]=!0,V[k.comma]=!0,V[k.colon]=!0,V[k.semicolon]=!0,V[k.openParenthesis]=!0,V[k.closeParenthesis]=!0,V[k.openSquare]=!0,V[k.closeSquare]=!0,V[k.singleQuote]=!0,V[k.doubleQuote]=!0,V[k.plus]=!0,V[k.pipe]=!0,V[k.tilde]=!0,V[k.greaterThan]=!0,V[k.equals]=!0,V[k.dollar]=!0,V[k.caret]=!0,V[k.slash]=!0,V),ri={},Ia="0123456789abcdefABCDEF";for(Er=0;Er<Ia.length;Er++)ri[Ia.charCodeAt(Er)]=!0;var Er;function nd(e,t){var n=t,r;do{if(r=e.charCodeAt(n),rd[r])return n-1;r===k.backslash?n=id(e,n)+1:n++}while(n<e.length);return n-1}function id(e,t){var n=t,r=e.charCodeAt(n+1);if(!td[r])if(ri[r]){var i=0;do n++,i++,r=e.charCodeAt(n+1);while(ri[r]&&i<6);i<6&&r===k.space&&n++}else n++;return n}var od={TYPE:0,START_LINE:1,START_COL:2,END_LINE:3,END_COL:4,START_POS:5,END_POS:6};Wt.FIELDS=od;function ad(e){var t=[],n=e.css.valueOf(),r=n,i=r.length,a=-1,o=1,s=0,u=0,l,f,p,g,m,d,h,w,b,_,T,I,C;function M(D,F){if(e.safe)n+=F,b=n.length-1;else throw e.error("Unclosed "+D,o,s-a,s)}for(;s<i;){switch(l=n.charCodeAt(s),l===k.newline&&(a=s,o+=1),l){case k.space:case k.tab:case k.newline:case k.cr:case k.feed:b=s;do b+=1,l=n.charCodeAt(b),l===k.newline&&(a=b,o+=1);while(l===k.space||l===k.newline||l===k.tab||l===k.cr||l===k.feed);C=k.space,g=o,p=b-a-1,u=b;break;case k.plus:case k.greaterThan:case k.tilde:case k.pipe:b=s;do b+=1,l=n.charCodeAt(b);while(l===k.plus||l===k.greaterThan||l===k.tilde||l===k.pipe);C=k.combinator,g=o,p=s-a,u=b;break;case k.asterisk:case k.ampersand:case k.bang:case k.comma:case k.equals:case k.dollar:case k.caret:case k.openSquare:case k.closeSquare:case k.colon:case k.semicolon:case k.openParenthesis:case k.closeParenthesis:b=s,C=l,g=o,p=s-a,u=b+1;break;case k.singleQuote:case k.doubleQuote:I=l===k.singleQuote?"'":'"',b=s;do for(m=!1,b=n.indexOf(I,b+1),b===-1&&M("quote",I),d=b;n.charCodeAt(d-1)===k.backslash;)d-=1,m=!m;while(m);C=k.str,g=o,p=s-a,u=b+1;break;default:l===k.slash&&n.charCodeAt(s+1)===k.asterisk?(b=n.indexOf("*/",s+2)+1,b===0&&M("comment","*/"),f=n.slice(s,b+1),w=f.split(`
`),h=w.length-1,h>0?(_=o+h,T=b-w[h].length):(_=o,T=a),C=k.comment,o=_,g=_,p=b-T):l===k.slash?(b=s,C=l,g=o,p=s-a,u=b+1):(b=nd(n,s),C=k.word,g=o,p=b-a),u=b+1;break}t.push([C,o,s-a,g,p,s,u]),T&&(a=T,T=null),s=u}return t}});var Ba=R(($t,qa)=>{"use strict";c();$t.__esModule=!0;$t.default=void 0;var sd=be(En()),ni=be(Pn()),ud=be(In()),Da=be(Cn()),ld=be(Fn()),fd=be(Wn()),ii=be(qn()),cd=be(Un()),Fa=Or(Yn()),dd=be(Qn()),oi=be(Kn()),pd=be(ei()),hd=be(Aa()),S=Or(Ca()),E=Or(ti()),md=Or(ne()),Z=xt(),Ve,ai;function $a(){if(typeof WeakMap!="function")return null;var e=new WeakMap;return $a=function(){return e},e}function Or(e){if(e&&e.__esModule)return e;if(e===null||typeof e!="object"&&typeof e!="function")return{default:e};var t=$a();if(t&&t.has(e))return t.get(e);var n={},r=Object.defineProperty&&Object.getOwnPropertyDescriptor;for(var i in e)if(Object.prototype.hasOwnProperty.call(e,i)){var a=r?Object.getOwnPropertyDescriptor(e,i):null;a&&(a.get||a.set)?Object.defineProperty(n,i,a):n[i]=e[i]}return n.default=e,t&&t.set(e,n),n}function be(e){return e&&e.__esModule?e:{default:e}}function Ma(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}function gd(e,t,n){return t&&Ma(e.prototype,t),n&&Ma(e,n),e}var li=(Ve={},Ve[E.space]=!0,Ve[E.cr]=!0,Ve[E.feed]=!0,Ve[E.newline]=!0,Ve[E.tab]=!0,Ve),vd=Object.assign({},li,(ai={},ai[E.comment]=!0,ai));function Na(e){return{line:e[S.FIELDS.START_LINE],column:e[S.FIELDS.START_COL]}}function Wa(e){return{line:e[S.FIELDS.END_LINE],column:e[S.FIELDS.END_COL]}}function He(e,t,n,r){return{start:{line:e,column:t},end:{line:n,column:r}}}function nt(e){return He(e[S.FIELDS.START_LINE],e[S.FIELDS.START_COL],e[S.FIELDS.END_LINE],e[S.FIELDS.END_COL])}function si(e,t){if(!!e)return He(e[S.FIELDS.START_LINE],e[S.FIELDS.START_COL],t[S.FIELDS.END_LINE],t[S.FIELDS.END_COL])}function it(e,t){var n=e[t];if(typeof n=="string")return n.indexOf("\\")!==-1&&((0,Z.ensureObject)(e,"raws"),e[t]=(0,Z.unesc)(n),e.raws[t]===void 0&&(e.raws[t]=n)),e}function ui(e,t){for(var n=-1,r=[];(n=e.indexOf(t,n+1))!==-1;)r.push(n);return r}function bd(){var e=Array.prototype.concat.apply([],arguments);return e.filter(function(t,n){return n===e.indexOf(t)})}var yd=function(){function e(n,r){r===void 0&&(r={}),this.rule=n,this.options=Object.assign({lossy:!1,safe:!1},r),this.position=0,this.css=typeof this.rule=="string"?this.rule:this.rule.selector,this.tokens=(0,S.default)({css:this.css,error:this._errorGenerator(),safe:this.options.safe});var i=si(this.tokens[0],this.tokens[this.tokens.length-1]);this.root=new sd.default({source:i}),this.root.errorGenerator=this._errorGenerator();var a=new ni.default({source:{start:{line:1,column:1}}});this.root.append(a),this.current=a,this.loop()}var t=e.prototype;return t._errorGenerator=function(){var r=this;return function(i,a){return typeof r.rule=="string"?new Error(i):r.rule.error(i,a)}},t.attribute=function(){var r=[],i=this.currToken;for(this.position++;this.position<this.tokens.length&&this.currToken[S.FIELDS.TYPE]!==E.closeSquare;)r.push(this.currToken),this.position++;if(this.currToken[S.FIELDS.TYPE]!==E.closeSquare)return this.expected("closing square bracket",this.currToken[S.FIELDS.START_POS]);var a=r.length,o={source:He(i[1],i[2],this.currToken[3],this.currToken[4]),sourceIndex:i[S.FIELDS.START_POS]};if(a===1&&!~[E.word].indexOf(r[0][S.FIELDS.TYPE]))return this.expected("attribute",r[0][S.FIELDS.START_POS]);for(var s=0,u="",l="",f=null,p=!1;s<a;){var g=r[s],m=this.content(g),d=r[s+1];switch(g[S.FIELDS.TYPE]){case E.space:if(p=!0,this.options.lossy)break;if(f){(0,Z.ensureObject)(o,"spaces",f);var h=o.spaces[f].after||"";o.spaces[f].after=h+m;var w=(0,Z.getProp)(o,"raws","spaces",f,"after")||null;w&&(o.raws.spaces[f].after=w+m)}else u=u+m,l=l+m;break;case E.asterisk:if(d[S.FIELDS.TYPE]===E.equals)o.operator=m,f="operator";else if((!o.namespace||f==="namespace"&&!p)&&d){u&&((0,Z.ensureObject)(o,"spaces","attribute"),o.spaces.attribute.before=u,u=""),l&&((0,Z.ensureObject)(o,"raws","spaces","attribute"),o.raws.spaces.attribute.before=u,l=""),o.namespace=(o.namespace||"")+m;var b=(0,Z.getProp)(o,"raws","namespace")||null;b&&(o.raws.namespace+=m),f="namespace"}p=!1;break;case E.dollar:if(f==="value"){var _=(0,Z.getProp)(o,"raws","value");o.value+="$",_&&(o.raws.value=_+"$");break}case E.caret:d[S.FIELDS.TYPE]===E.equals&&(o.operator=m,f="operator"),p=!1;break;case E.combinator:if(m==="~"&&d[S.FIELDS.TYPE]===E.equals&&(o.operator=m,f="operator"),m!=="|"){p=!1;break}d[S.FIELDS.TYPE]===E.equals?(o.operator=m,f="operator"):!o.namespace&&!o.attribute&&(o.namespace=!0),p=!1;break;case E.word:if(d&&this.content(d)==="|"&&r[s+2]&&r[s+2][S.FIELDS.TYPE]!==E.equals&&!o.operator&&!o.namespace)o.namespace=m,f="namespace";else if(!o.attribute||f==="attribute"&&!p){u&&((0,Z.ensureObject)(o,"spaces","attribute"),o.spaces.attribute.before=u,u=""),l&&((0,Z.ensureObject)(o,"raws","spaces","attribute"),o.raws.spaces.attribute.before=l,l=""),o.attribute=(o.attribute||"")+m;var T=(0,Z.getProp)(o,"raws","attribute")||null;T&&(o.raws.attribute+=m),f="attribute"}else if(!o.value&&o.value!==""||f==="value"&&!p){var I=(0,Z.unesc)(m),C=(0,Z.getProp)(o,"raws","value")||"",M=o.value||"";o.value=M+I,o.quoteMark=null,(I!==m||C)&&((0,Z.ensureObject)(o,"raws"),o.raws.value=(C||M)+m),f="value"}else{var D=m==="i"||m==="I";(o.value||o.value==="")&&(o.quoteMark||p)?(o.insensitive=D,(!D||m==="I")&&((0,Z.ensureObject)(o,"raws"),o.raws.insensitiveFlag=m),f="insensitive",u&&((0,Z.ensureObject)(o,"spaces","insensitive"),o.spaces.insensitive.before=u,u=""),l&&((0,Z.ensureObject)(o,"raws","spaces","insensitive"),o.raws.spaces.insensitive.before=l,l="")):(o.value||o.value==="")&&(f="value",o.value+=m,o.raws.value&&(o.raws.value+=m))}p=!1;break;case E.str:if(!o.attribute||!o.operator)return this.error("Expected an attribute followed by an operator preceding the string.",{index:g[S.FIELDS.START_POS]});var F=(0,Fa.unescapeValue)(m),W=F.unescaped,G=F.quoteMark;o.value=W,o.quoteMark=G,f="value",(0,Z.ensureObject)(o,"raws"),o.raws.value=m,p=!1;break;case E.equals:if(!o.attribute)return this.expected("attribute",g[S.FIELDS.START_POS],m);if(o.value)return this.error('Unexpected "=" found; an operator was already defined.',{index:g[S.FIELDS.START_POS]});o.operator=o.operator?o.operator+m:m,f="operator",p=!1;break;case E.comment:if(f)if(p||d&&d[S.FIELDS.TYPE]===E.space||f==="insensitive"){var q=(0,Z.getProp)(o,"spaces",f,"after")||"",N=(0,Z.getProp)(o,"raws","spaces",f,"after")||q;(0,Z.ensureObject)(o,"raws","spaces",f),o.raws.spaces[f].after=N+m}else{var $=o[f]||"",B=(0,Z.getProp)(o,"raws",f)||$;(0,Z.ensureObject)(o,"raws"),o.raws[f]=B+m}else l=l+m;break;default:return this.error('Unexpected "'+m+'" found.',{index:g[S.FIELDS.START_POS]})}s++}it(o,"attribute"),it(o,"namespace"),this.newNode(new Fa.default(o)),this.position++},t.parseWhitespaceEquivalentTokens=function(r){r<0&&(r=this.tokens.length);var i=this.position,a=[],o="",s=void 0;do if(li[this.currToken[S.FIELDS.TYPE]])this.options.lossy||(o+=this.content());else if(this.currToken[S.FIELDS.TYPE]===E.comment){var u={};o&&(u.before=o,o=""),s=new Da.default({value:this.content(),source:nt(this.currToken),sourceIndex:this.currToken[S.FIELDS.START_POS],spaces:u}),a.push(s)}while(++this.position<r);if(o){if(s)s.spaces.after=o;else if(!this.options.lossy){var l=this.tokens[i],f=this.tokens[this.position-1];a.push(new ii.default({value:"",source:He(l[S.FIELDS.START_LINE],l[S.FIELDS.START_COL],f[S.FIELDS.END_LINE],f[S.FIELDS.END_COL]),sourceIndex:l[S.FIELDS.START_POS],spaces:{before:o,after:""}}))}}return a},t.convertWhitespaceNodesToSpace=function(r,i){var a=this;i===void 0&&(i=!1);var o="",s="";r.forEach(function(l){var f=a.lossySpace(l.spaces.before,i),p=a.lossySpace(l.rawSpaceBefore,i);o+=f+a.lossySpace(l.spaces.after,i&&f.length===0),s+=f+l.value+a.lossySpace(l.rawSpaceAfter,i&&p.length===0)}),s===o&&(s=void 0);var u={space:o,rawSpace:s};return u},t.isNamedCombinator=function(r){return r===void 0&&(r=this.position),this.tokens[r+0]&&this.tokens[r+0][S.FIELDS.TYPE]===E.slash&&this.tokens[r+1]&&this.tokens[r+1][S.FIELDS.TYPE]===E.word&&this.tokens[r+2]&&this.tokens[r+2][S.FIELDS.TYPE]===E.slash},t.namedCombinator=function(){if(this.isNamedCombinator()){var r=this.content(this.tokens[this.position+1]),i=(0,Z.unesc)(r).toLowerCase(),a={};i!==r&&(a.value="/"+r+"/");var o=new oi.default({value:"/"+i+"/",source:He(this.currToken[S.FIELDS.START_LINE],this.currToken[S.FIELDS.START_COL],this.tokens[this.position+2][S.FIELDS.END_LINE],this.tokens[this.position+2][S.FIELDS.END_COL]),sourceIndex:this.currToken[S.FIELDS.START_POS],raws:a});return this.position=this.position+3,o}else this.unexpected()},t.combinator=function(){var r=this;if(this.content()==="|")return this.namespace();var i=this.locateNextMeaningfulToken(this.position);if(i<0||this.tokens[i][S.FIELDS.TYPE]===E.comma){var a=this.parseWhitespaceEquivalentTokens(i);if(a.length>0){var o=this.current.last;if(o){var s=this.convertWhitespaceNodesToSpace(a),u=s.space,l=s.rawSpace;l!==void 0&&(o.rawSpaceAfter+=l),o.spaces.after+=u}else a.forEach(function(C){return r.newNode(C)})}return}var f=this.currToken,p=void 0;i>this.position&&(p=this.parseWhitespaceEquivalentTokens(i));var g;if(this.isNamedCombinator()?g=this.namedCombinator():this.currToken[S.FIELDS.TYPE]===E.combinator?(g=new oi.default({value:this.content(),source:nt(this.currToken),sourceIndex:this.currToken[S.FIELDS.START_POS]}),this.position++):li[this.currToken[S.FIELDS.TYPE]]||p||this.unexpected(),g){if(p){var m=this.convertWhitespaceNodesToSpace(p),d=m.space,h=m.rawSpace;g.spaces.before=d,g.rawSpaceBefore=h}}else{var w=this.convertWhitespaceNodesToSpace(p,!0),b=w.space,_=w.rawSpace;_||(_=b);var T={},I={spaces:{}};b.endsWith(" ")&&_.endsWith(" ")?(T.before=b.slice(0,b.length-1),I.spaces.before=_.slice(0,_.length-1)):b.startsWith(" ")&&_.startsWith(" ")?(T.after=b.slice(1),I.spaces.after=_.slice(1)):I.value=_,g=new oi.default({value:" ",source:si(f,this.tokens[this.position-1]),sourceIndex:f[S.FIELDS.START_POS],spaces:T,raws:I})}return this.currToken&&this.currToken[S.FIELDS.TYPE]===E.space&&(g.spaces.after=this.optionalSpace(this.content()),this.position++),this.newNode(g)},t.comma=function(){if(this.position===this.tokens.length-1){this.root.trailingComma=!0,this.position++;return}this.current._inferEndPosition();var r=new ni.default({source:{start:Na(this.tokens[this.position+1])}});this.current.parent.append(r),this.current=r,this.position++},t.comment=function(){var r=this.currToken;this.newNode(new Da.default({value:this.content(),source:nt(r),sourceIndex:r[S.FIELDS.START_POS]})),this.position++},t.error=function(r,i){throw this.root.error(r,i)},t.missingBackslash=function(){return this.error("Expected a backslash preceding the semicolon.",{index:this.currToken[S.FIELDS.START_POS]})},t.missingParenthesis=function(){return this.expected("opening parenthesis",this.currToken[S.FIELDS.START_POS])},t.missingSquareBracket=function(){return this.expected("opening square bracket",this.currToken[S.FIELDS.START_POS])},t.unexpected=function(){return this.error("Unexpected '"+this.content()+"'. Escaping special characters with \\ may help.",this.currToken[S.FIELDS.START_POS])},t.namespace=function(){var r=this.prevToken&&this.content(this.prevToken)||!0;if(this.nextToken[S.FIELDS.TYPE]===E.word)return this.position++,this.word(r);if(this.nextToken[S.FIELDS.TYPE]===E.asterisk)return this.position++,this.universal(r)},t.nesting=function(){if(this.nextToken){var r=this.content(this.nextToken);if(r==="|"){this.position++;return}}var i=this.currToken;this.newNode(new pd.default({value:this.content(),source:nt(i),sourceIndex:i[S.FIELDS.START_POS]})),this.position++},t.parentheses=function(){var r=this.current.last,i=1;if(this.position++,r&&r.type===md.PSEUDO){var a=new ni.default({source:{start:Na(this.tokens[this.position-1])}}),o=this.current;for(r.append(a),this.current=a;this.position<this.tokens.length&&i;)this.currToken[S.FIELDS.TYPE]===E.openParenthesis&&i++,this.currToken[S.FIELDS.TYPE]===E.closeParenthesis&&i--,i?this.parse():(this.current.source.end=Wa(this.currToken),this.current.parent.source.end=Wa(this.currToken),this.position++);this.current=o}else{for(var s=this.currToken,u="(",l;this.position<this.tokens.length&&i;)this.currToken[S.FIELDS.TYPE]===E.openParenthesis&&i++,this.currToken[S.FIELDS.TYPE]===E.closeParenthesis&&i--,l=this.currToken,u+=this.parseParenthesisToken(this.currToken),this.position++;r?r.appendToPropertyAndEscape("value",u,u):this.newNode(new ii.default({value:u,source:He(s[S.FIELDS.START_LINE],s[S.FIELDS.START_COL],l[S.FIELDS.END_LINE],l[S.FIELDS.END_COL]),sourceIndex:s[S.FIELDS.START_POS]}))}if(i)return this.expected("closing parenthesis",this.currToken[S.FIELDS.START_POS])},t.pseudo=function(){for(var r=this,i="",a=this.currToken;this.currToken&&this.currToken[S.FIELDS.TYPE]===E.colon;)i+=this.content(),this.position++;if(!this.currToken)return this.expected(["pseudo-class","pseudo-element"],this.position-1);if(this.currToken[S.FIELDS.TYPE]===E.word)this.splitWord(!1,function(o,s){i+=o,r.newNode(new cd.default({value:i,source:si(a,r.currToken),sourceIndex:a[S.FIELDS.START_POS]})),s>1&&r.nextToken&&r.nextToken[S.FIELDS.TYPE]===E.openParenthesis&&r.error("Misplaced parenthesis.",{index:r.nextToken[S.FIELDS.START_POS]})});else return this.expected(["pseudo-class","pseudo-element"],this.currToken[S.FIELDS.START_POS])},t.space=function(){var r=this.content();this.position===0||this.prevToken[S.FIELDS.TYPE]===E.comma||this.prevToken[S.FIELDS.TYPE]===E.openParenthesis||this.current.nodes.every(function(i){return i.type==="comment"})?(this.spaces=this.optionalSpace(r),this.position++):this.position===this.tokens.length-1||this.nextToken[S.FIELDS.TYPE]===E.comma||this.nextToken[S.FIELDS.TYPE]===E.closeParenthesis?(this.current.last.spaces.after=this.optionalSpace(r),this.position++):this.combinator()},t.string=function(){var r=this.currToken;this.newNode(new ii.default({value:this.content(),source:nt(r),sourceIndex:r[S.FIELDS.START_POS]})),this.position++},t.universal=function(r){var i=this.nextToken;if(i&&this.content(i)==="|")return this.position++,this.namespace();var a=this.currToken;this.newNode(new dd.default({value:this.content(),source:nt(a),sourceIndex:a[S.FIELDS.START_POS]}),r),this.position++},t.splitWord=function(r,i){for(var a=this,o=this.nextToken,s=this.content();o&&~[E.dollar,E.caret,E.equals,E.word].indexOf(o[S.FIELDS.TYPE]);){this.position++;var u=this.content();if(s+=u,u.lastIndexOf("\\")===u.length-1){var l=this.nextToken;l&&l[S.FIELDS.TYPE]===E.space&&(s+=this.requiredSpace(this.content(l)),this.position++)}o=this.nextToken}var f=ui(s,".").filter(function(d){var h=s[d-1]==="\\",w=/^\d+\.\d+%$/.test(s);return!h&&!w}),p=ui(s,"#").filter(function(d){return s[d-1]!=="\\"}),g=ui(s,"#{");g.length&&(p=p.filter(function(d){return!~g.indexOf(d)}));var m=(0,hd.default)(bd([0].concat(f,p)));m.forEach(function(d,h){var w=m[h+1]||s.length,b=s.slice(d,w);if(h===0&&i)return i.call(a,b,m.length);var _,T=a.currToken,I=T[S.FIELDS.START_POS]+m[h],C=He(T[1],T[2]+d,T[3],T[2]+(w-1));if(~f.indexOf(d)){var M={value:b.slice(1),source:C,sourceIndex:I};_=new ud.default(it(M,"value"))}else if(~p.indexOf(d)){var D={value:b.slice(1),source:C,sourceIndex:I};_=new ld.default(it(D,"value"))}else{var F={value:b,source:C,sourceIndex:I};it(F,"value"),_=new fd.default(F)}a.newNode(_,r),r=null}),this.position++},t.word=function(r){var i=this.nextToken;return i&&this.content(i)==="|"?(this.position++,this.namespace()):this.splitWord(r)},t.loop=function(){for(;this.position<this.tokens.length;)this.parse(!0);return this.current._inferEndPosition(),this.root},t.parse=function(r){switch(this.currToken[S.FIELDS.TYPE]){case E.space:this.space();break;case E.comment:this.comment();break;case E.openParenthesis:this.parentheses();break;case E.closeParenthesis:r&&this.missingParenthesis();break;case E.openSquare:this.attribute();break;case E.dollar:case E.caret:case E.equals:case E.word:this.word();break;case E.colon:this.pseudo();break;case E.comma:this.comma();break;case E.asterisk:this.universal();break;case E.ampersand:this.nesting();break;case E.slash:case E.combinator:this.combinator();break;case E.str:this.string();break;case E.closeSquare:this.missingSquareBracket();case E.semicolon:this.missingBackslash();default:this.unexpected()}},t.expected=function(r,i,a){if(Array.isArray(r)){var o=r.pop();r=r.join(", ")+" or "+o}var s=/^[aeiou]/.test(r[0])?"an":"a";return a?this.error("Expected "+s+" "+r+', found "'+a+'" instead.',{index:i}):this.error("Expected "+s+" "+r+".",{index:i})},t.requiredSpace=function(r){return this.options.lossy?" ":r},t.optionalSpace=function(r){return this.options.lossy?"":r},t.lossySpace=function(r,i){return this.options.lossy?i?" ":"":r},t.parseParenthesisToken=function(r){var i=this.content(r);return r[S.FIELDS.TYPE]===E.space?this.requiredSpace(i):i},t.newNode=function(r,i){return i&&(/^ +$/.test(i)&&(this.options.lossy||(this.spaces=(this.spaces||"")+i),i=!0),r.namespace=i,it(r,"namespace")),this.spaces&&(r.spaces.before=this.spaces,this.spaces=""),this.current.append(r)},t.content=function(r){return r===void 0&&(r=this.currToken),this.css.slice(r[S.FIELDS.START_POS],r[S.FIELDS.END_POS])},t.locateNextMeaningfulToken=function(r){r===void 0&&(r=this.position+1);for(var i=r;i<this.tokens.length;)if(vd[this.tokens[i][S.FIELDS.TYPE]]){i++;continue}else return i;return-1},gd(e,[{key:"currToken",get:function(){return this.tokens[this.position]}},{key:"nextToken",get:function(){return this.tokens[this.position+1]}},{key:"prevToken",get:function(){return this.tokens[this.position-1]}}]),e}();$t.default=yd;qa.exports=$t.default});var za=R((qt,Ua)=>{"use strict";c();qt.__esModule=!0;qt.default=void 0;var xd=wd(Ba());function wd(e){return e&&e.__esModule?e:{default:e}}var _d=function(){function e(n,r){this.func=n||function(){},this.funcRes=null,this.options=r}var t=e.prototype;return t._shouldUpdateSelector=function(r,i){i===void 0&&(i={});var a=Object.assign({},this.options,i);return a.updateSelector===!1?!1:typeof r!="string"},t._isLossy=function(r){r===void 0&&(r={});var i=Object.assign({},this.options,r);return i.lossless===!1},t._root=function(r,i){i===void 0&&(i={});var a=new xd.default(r,this._parseOptions(i));return a.root},t._parseOptions=function(r){return{lossy:this._isLossy(r)}},t._run=function(r,i){var a=this;return i===void 0&&(i={}),new Promise(function(o,s){try{var u=a._root(r,i);Promise.resolve(a.func(u)).then(function(l){var f=void 0;return a._shouldUpdateSelector(r,i)&&(f=u.toString(),r.selector=f),{transform:l,root:u,string:f}}).then(o,s)}catch(l){s(l);return}})},t._runSync=function(r,i){i===void 0&&(i={});var a=this._root(r,i),o=this.func(a);if(o&&typeof o.then=="function")throw new Error("Selector processor returned a promise to a synchronous call.");var s=void 0;return i.updateSelector&&typeof r!="string"&&(s=a.toString(),r.selector=s),{transform:o,root:a,string:s}},t.ast=function(r,i){return this._run(r,i).then(function(a){return a.root})},t.astSync=function(r,i){return this._runSync(r,i).root},t.transform=function(r,i){return this._run(r,i).then(function(a){return a.transform})},t.transformSync=function(r,i){return this._runSync(r,i).transform},t.process=function(r,i){return this._run(r,i).then(function(a){return a.string||a.root.toString()})},t.processSync=function(r,i){var a=this._runSync(r,i);return a.string||a.root.toString()},e}();qt.default=_d;Ua.exports=qt.default});var Ga=R(Y=>{"use strict";c();Y.__esModule=!0;Y.universal=Y.tag=Y.string=Y.selector=Y.root=Y.pseudo=Y.nesting=Y.id=Y.comment=Y.combinator=Y.className=Y.attribute=void 0;var Sd=ye(Yn()),kd=ye(In()),Td=ye(Kn()),Ed=ye(Cn()),Od=ye(Fn()),Pd=ye(ei()),Ad=ye(Un()),Rd=ye(En()),Id=ye(Pn()),Ld=ye(qn()),Cd=ye(Wn()),Dd=ye(Qn());function ye(e){return e&&e.__esModule?e:{default:e}}var Fd=function(t){return new Sd.default(t)};Y.attribute=Fd;var Md=function(t){return new kd.default(t)};Y.className=Md;var Nd=function(t){return new Td.default(t)};Y.combinator=Nd;var Wd=function(t){return new Ed.default(t)};Y.comment=Wd;var $d=function(t){return new Od.default(t)};Y.id=$d;var qd=function(t){return new Pd.default(t)};Y.nesting=qd;var Bd=function(t){return new Ad.default(t)};Y.pseudo=Bd;var Ud=function(t){return new Rd.default(t)};Y.root=Ud;var zd=function(t){return new Id.default(t)};Y.selector=zd;var Gd=function(t){return new Ld.default(t)};Y.string=Gd;var jd=function(t){return new Cd.default(t)};Y.tag=jd;var Vd=function(t){return new Dd.default(t)};Y.universal=Vd});var Ya=R(U=>{"use strict";c();U.__esModule=!0;U.isNode=fi;U.isPseudoElement=Ha;U.isPseudoClass=np;U.isContainer=ip;U.isNamespace=op;U.isUniversal=U.isTag=U.isString=U.isSelector=U.isRoot=U.isPseudo=U.isNesting=U.isIdentifier=U.isComment=U.isCombinator=U.isClassName=U.isAttribute=void 0;var ee=ne(),le,Hd=(le={},le[ee.ATTRIBUTE]=!0,le[ee.CLASS]=!0,le[ee.COMBINATOR]=!0,le[ee.COMMENT]=!0,le[ee.ID]=!0,le[ee.NESTING]=!0,le[ee.PSEUDO]=!0,le[ee.ROOT]=!0,le[ee.SELECTOR]=!0,le[ee.STRING]=!0,le[ee.TAG]=!0,le[ee.UNIVERSAL]=!0,le);function fi(e){return typeof e=="object"&&Hd[e.type]}function xe(e,t){return fi(t)&&t.type===e}var ja=xe.bind(null,ee.ATTRIBUTE);U.isAttribute=ja;var Yd=xe.bind(null,ee.CLASS);U.isClassName=Yd;var Xd=xe.bind(null,ee.COMBINATOR);U.isCombinator=Xd;var Qd=xe.bind(null,ee.COMMENT);U.isComment=Qd;var Jd=xe.bind(null,ee.ID);U.isIdentifier=Jd;var Kd=xe.bind(null,ee.NESTING);U.isNesting=Kd;var ci=xe.bind(null,ee.PSEUDO);U.isPseudo=ci;var Zd=xe.bind(null,ee.ROOT);U.isRoot=Zd;var ep=xe.bind(null,ee.SELECTOR);U.isSelector=ep;var tp=xe.bind(null,ee.STRING);U.isString=tp;var Va=xe.bind(null,ee.TAG);U.isTag=Va;var rp=xe.bind(null,ee.UNIVERSAL);U.isUniversal=rp;function Ha(e){return ci(e)&&e.value&&(e.value.startsWith("::")||e.value.toLowerCase()===":before"||e.value.toLowerCase()===":after"||e.value.toLowerCase()===":first-letter"||e.value.toLowerCase()===":first-line")}function np(e){return ci(e)&&!Ha(e)}function ip(e){return!!(fi(e)&&e.walk)}function op(e){return ja(e)||Va(e)}});var Xa=R(ke=>{"use strict";c();ke.__esModule=!0;var di=ne();Object.keys(di).forEach(function(e){e==="default"||e==="__esModule"||e in ke&&ke[e]===di[e]||(ke[e]=di[e])});var pi=Ga();Object.keys(pi).forEach(function(e){e==="default"||e==="__esModule"||e in ke&&ke[e]===pi[e]||(ke[e]=pi[e])});var hi=Ya();Object.keys(hi).forEach(function(e){e==="default"||e==="__esModule"||e in ke&&ke[e]===hi[e]||(ke[e]=hi[e])})});var Ka=R((Bt,Ja)=>{"use strict";c();Bt.__esModule=!0;Bt.default=void 0;var ap=lp(za()),sp=up(Xa());function Qa(){if(typeof WeakMap!="function")return null;var e=new WeakMap;return Qa=function(){return e},e}function up(e){if(e&&e.__esModule)return e;if(e===null||typeof e!="object"&&typeof e!="function")return{default:e};var t=Qa();if(t&&t.has(e))return t.get(e);var n={},r=Object.defineProperty&&Object.getOwnPropertyDescriptor;for(var i in e)if(Object.prototype.hasOwnProperty.call(e,i)){var a=r?Object.getOwnPropertyDescriptor(e,i):null;a&&(a.get||a.set)?Object.defineProperty(n,i,a):n[i]=e[i]}return n.default=e,t&&t.set(e,n),n}function lp(e){return e&&e.__esModule?e:{default:e}}var mi=function(t){return new ap.default(t)};Object.assign(mi,sp);delete mi.__esModule;var fp=mi;Bt.default=fp;Ja.exports=Bt.default});var Za=R(gi=>{"use strict";c();Object.defineProperty(gi,"__esModule",{value:!0});Object.defineProperty(gi,"default",{enumerable:!0,get:()=>cp});function cp(e){return e.replace(/\\,/g,"\\2c ")}});var ts=R((rg,es)=>{"use strict";c();es.exports={aliceblue:[240,248,255],antiquewhite:[250,235,215],aqua:[0,255,255],aquamarine:[127,255,212],azure:[240,255,255],beige:[245,245,220],bisque:[255,228,196],black:[0,0,0],blanchedalmond:[255,235,205],blue:[0,0,255],blueviolet:[138,43,226],brown:[165,42,42],burlywood:[222,184,135],cadetblue:[95,158,160],chartreuse:[127,255,0],chocolate:[210,105,30],coral:[255,127,80],cornflowerblue:[100,149,237],cornsilk:[255,248,220],crimson:[220,20,60],cyan:[0,255,255],darkblue:[0,0,139],darkcyan:[0,139,139],darkgoldenrod:[184,134,11],darkgray:[169,169,169],darkgreen:[0,100,0],darkgrey:[169,169,169],darkkhaki:[189,183,107],darkmagenta:[139,0,139],darkolivegreen:[85,107,47],darkorange:[255,140,0],darkorchid:[153,50,204],darkred:[139,0,0],darksalmon:[233,150,122],darkseagreen:[143,188,143],darkslateblue:[72,61,139],darkslategray:[47,79,79],darkslategrey:[47,79,79],darkturquoise:[0,206,209],darkviolet:[148,0,211],deeppink:[255,20,147],deepskyblue:[0,191,255],dimgray:[105,105,105],dimgrey:[105,105,105],dodgerblue:[30,144,255],firebrick:[178,34,34],floralwhite:[255,250,240],forestgreen:[34,139,34],fuchsia:[255,0,255],gainsboro:[220,220,220],ghostwhite:[248,248,255],gold:[255,215,0],goldenrod:[218,165,32],gray:[128,128,128],green:[0,128,0],greenyellow:[173,255,47],grey:[128,128,128],honeydew:[240,255,240],hotpink:[255,105,180],indianred:[205,92,92],indigo:[75,0,130],ivory:[255,255,240],khaki:[240,230,140],lavender:[230,230,250],lavenderblush:[255,240,245],lawngreen:[124,252,0],lemonchiffon:[255,250,205],lightblue:[173,216,230],lightcoral:[240,128,128],lightcyan:[224,255,255],lightgoldenrodyellow:[250,250,210],lightgray:[211,211,211],lightgreen:[144,238,144],lightgrey:[211,211,211],lightpink:[255,182,193],lightsalmon:[255,160,122],lightseagreen:[32,178,170],lightskyblue:[135,206,250],lightslategray:[119,136,153],lightslategrey:[119,136,153],lightsteelblue:[176,196,222],lightyellow:[255,255,224],lime:[0,255,0],limegreen:[50,205,50],linen:[250,240,230],magenta:[255,0,255],maroon:[128,0,0],mediumaquamarine:[102,205,170],mediumblue:[0,0,205],mediumorchid:[186,85,211],mediumpurple:[147,112,219],mediumseagreen:[60,179,113],mediumslateblue:[123,104,238],mediumspringgreen:[0,250,154],mediumturquoise:[72,209,204],mediumvioletred:[199,21,133],midnightblue:[25,25,112],mintcream:[245,255,250],mistyrose:[255,228,225],moccasin:[255,228,181],navajowhite:[255,222,173],navy:[0,0,128],oldlace:[253,245,230],olive:[128,128,0],olivedrab:[107,142,35],orange:[255,165,0],orangered:[255,69,0],orchid:[218,112,214],palegoldenrod:[238,232,170],palegreen:[152,251,152],paleturquoise:[175,238,238],palevioletred:[219,112,147],papayawhip:[255,239,213],peachpuff:[255,218,185],peru:[205,133,63],pink:[255,192,203],plum:[221,160,221],powderblue:[176,224,230],purple:[128,0,128],rebeccapurple:[102,51,153],red:[255,0,0],rosybrown:[188,143,143],royalblue:[65,105,225],saddlebrown:[139,69,19],salmon:[250,128,114],sandybrown:[244,164,96],seagreen:[46,139,87],seashell:[255,245,238],sienna:[160,82,45],silver:[192,192,192],skyblue:[135,206,235],slateblue:[106,90,205],slategray:[112,128,144],slategrey:[112,128,144],snow:[255,250,250],springgreen:[0,255,127],steelblue:[70,130,180],tan:[210,180,140],teal:[0,128,128],thistle:[216,191,216],tomato:[255,99,71],turquoise:[64,224,208],violet:[238,130,238],wheat:[245,222,179],white:[255,255,255],whitesmoke:[245,245,245],yellow:[255,255,0],yellowgreen:[154,205,50]}});var bi=R(vi=>{"use strict";c();Object.defineProperty(vi,"__esModule",{value:!0});function dp(e,t){for(var n in t)Object.defineProperty(e,n,{enumerable:!0,get:t[n]})}dp(vi,{parseColor:()=>bp,formatColor:()=>yp});var rs=pp(ts());function pp(e){return e&&e.__esModule?e:{default:e}}var hp=/^#([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})?$/i,mp=/^#([a-f\d])([a-f\d])([a-f\d])([a-f\d])?$/i,Ne=/(?:\d+|\d*\.\d+)%?/,Pr=/(?:\s*,\s*|\s+)/,ns=/\s*[,/]\s*/,We=/var\(--(?:[^ )]*?)\)/,gp=new RegExp(`^(rgb)a?\\(\\s*(${Ne.source}|${We.source})(?:${Pr.source}(${Ne.source}|${We.source}))?(?:${Pr.source}(${Ne.source}|${We.source}))?(?:${ns.source}(${Ne.source}|${We.source}))?\\s*\\)$`),vp=new RegExp(`^(hsl)a?\\(\\s*((?:${Ne.source})(?:deg|rad|grad|turn)?|${We.source})(?:${Pr.source}(${Ne.source}|${We.source}))?(?:${Pr.source}(${Ne.source}|${We.source}))?(?:${ns.source}(${Ne.source}|${We.source}))?\\s*\\)$`);function bp(e,{loose:t=!1}={}){var n,r;if(typeof e!="string")return null;if(e=e.trim(),e==="transparent")return{mode:"rgb",color:["0","0","0"],alpha:"0"};if(e in rs.default)return{mode:"rgb",color:rs.default[e].map(u=>u.toString())};let i=e.replace(mp,(u,l,f,p,g)=>["#",l,l,f,f,p,p,g?g+g:""].join("")).match(hp);if(i!==null)return{mode:"rgb",color:[parseInt(i[1],16),parseInt(i[2],16),parseInt(i[3],16)].map(u=>u.toString()),alpha:i[4]?(parseInt(i[4],16)/255).toString():void 0};var a;let o=(a=e.match(gp))!==null&&a!==void 0?a:e.match(vp);if(o===null)return null;let s=[o[2],o[3],o[4]].filter(Boolean).map(u=>u.toString());return!t&&s.length!==3||s.length<3&&!s.some(u=>/^var\(.*?\)$/.test(u))?null:{mode:o[1],color:s,alpha:(n=o[5])===null||n===void 0||(r=n.toString)===null||r===void 0?void 0:r.call(n)}}function yp({mode:e,color:t,alpha:n}){let r=n!==void 0;return`${e}(${t.join(" ")}${r?` / ${n}`:""})`}});var xi=R(yi=>{"use strict";c();Object.defineProperty(yi,"__esModule",{value:!0});function xp(e,t){for(var n in t)Object.defineProperty(e,n,{enumerable:!0,get:t[n]})}xp(yi,{withAlphaValue:()=>wp,default:()=>_p});var Ar=bi();function wp(e,t,n){if(typeof e=="function")return e({opacityValue:t});let r=(0,Ar.parseColor)(e,{loose:!0});return r===null?n:(0,Ar.formatColor)({...r,alpha:t})}function _p({color:e,property:t,variable:n}){let r=[].concat(t);if(typeof e=="function")return{[n]:"1",...Object.fromEntries(r.map(a=>[a,e({opacityVariable:n,opacityValue:`var(${n})`})]))};let i=(0,Ar.parseColor)(e);return i===null?Object.fromEntries(r.map(a=>[a,e])):i.alpha!==void 0?Object.fromEntries(r.map(a=>[a,e])):{[n]:"1",...Object.fromEntries(r.map(a=>[a,(0,Ar.formatColor)({...i,alpha:`var(${n})`})]))}}});var us=R(wi=>{"use strict";c();Object.defineProperty(wi,"__esModule",{value:!0});function Sp(e,t){for(var n in t)Object.defineProperty(e,n,{enumerable:!0,get:t[n]})}Sp(wi,{pattern:()=>Tp,withoutCapturing:()=>os,any:()=>as,optional:()=>Ep,zeroOrMore:()=>Op,nestedBrackets:()=>ss,escape:()=>Ye});var is=/[\\^$.*+?()[\]{}|]/g,kp=RegExp(is.source);function Ut(e){return e=Array.isArray(e)?e:[e],e=e.map(t=>t instanceof RegExp?t.source:t),e.join("")}function Tp(e){return new RegExp(Ut(e),"g")}function os(e){return new RegExp(`(?:${Ut(e)})`,"g")}function as(e){return`(?:${e.map(Ut).join("|")})`}function Ep(e){return`(?:${Ut(e)})?`}function Op(e){return`(?:${Ut(e)})*`}function ss(e,t,n=1){return os([Ye(e),/[^\s]*/,n===1?`[^${Ye(e)}${Ye(t)}s]*`:as([`[^${Ye(e)}${Ye(t)}s]*`,ss(e,t,n-1)]),/[^\s]*/,Ye(t)])}function Ye(e){return e&&kp.test(e)?e.replace(is,"\\$&"):e||""}});var fs=R(_i=>{"use strict";c();Object.defineProperty(_i,"__esModule",{value:!0});Object.defineProperty(_i,"splitAtTopLevelOnly",{enumerable:!0,get:()=>Rp});var Pp=Ap(us());function ls(e){if(typeof WeakMap!="function")return null;var t=new WeakMap,n=new WeakMap;return(ls=function(r){return r?n:t})(e)}function Ap(e,t){if(!t&&e&&e.__esModule)return e;if(e===null||typeof e!="object"&&typeof e!="function")return{default:e};var n=ls(t);if(n&&n.has(e))return n.get(e);var r={},i=Object.defineProperty&&Object.getOwnPropertyDescriptor;for(var a in e)if(a!=="default"&&Object.prototype.hasOwnProperty.call(e,a)){var o=i?Object.getOwnPropertyDescriptor(e,a):null;o&&(o.get||o.set)?Object.defineProperty(r,a,o):r[a]=e[a]}return r.default=e,n&&n.set(e,r),r}function*Rp(e,t){let n=new RegExp(`[(){}\\[\\]${Pp.escape(t)}]`,"g"),r=0,i=0,a=!1,o=0,s=0,u=t.length;for(let l of e.matchAll(n)){let f=l[0]===t[o],p=o===u-1,g=f&&p;l[0]==="("&&r++,l[0]===")"&&r--,l[0]==="["&&r++,l[0]==="]"&&r--,l[0]==="{"&&r++,l[0]==="}"&&r--,f&&r===0&&(s===0&&(s=l.index),o++),g&&r===0&&(a=!0,yield e.substring(i,s),i=s+u),o===u&&(o=0,s=0)}a?yield e.substring(i):yield e}});var ds=R(Si=>{"use strict";c();Object.defineProperty(Si,"__esModule",{value:!0});function Ip(e,t){for(var n in t)Object.defineProperty(e,n,{enumerable:!0,get:t[n]})}Ip(Si,{parseBoxShadowValue:()=>Fp,formatBoxShadowValue:()=>Mp});var Lp=fs(),Cp=new Set(["inset","inherit","initial","revert","unset"]),Dp=/\ +(?![^(]*\))/g,cs=/^-?(\d+|\.\d+)(.*?)$/g;function Fp(e){return Array.from((0,Lp.splitAtTopLevelOnly)(e,",")).map(n=>{let r=n.trim(),i={raw:r},a=r.split(Dp),o=new Set;for(let s of a)cs.lastIndex=0,!o.has("KEYWORD")&&Cp.has(s)?(i.keyword=s,o.add("KEYWORD")):cs.test(s)?o.has("X")?o.has("Y")?o.has("BLUR")?o.has("SPREAD")||(i.spread=s,o.add("SPREAD")):(i.blur=s,o.add("BLUR")):(i.y=s,o.add("Y")):(i.x=s,o.add("X")):i.color?(i.unknown||(i.unknown=[]),i.unknown.push(s)):i.color=s;return i.valid=i.x!==void 0&&i.y!==void 0,i})}function Mp(e){return e.map(t=>t.valid?[t.keyword,t.x,t.y,t.blur,t.spread,t.color].filter(Boolean).join(" "):t.raw).join(", ")}});var ys=R(Ti=>{"use strict";c();Object.defineProperty(Ti,"__esModule",{value:!0});function Np(e,t){for(var n in t)Object.defineProperty(e,n,{enumerable:!0,get:t[n]})}Np(Ti,{normalize:()=>$e,url:()=>ms,number:()=>qp,percentage:()=>gs,length:()=>vs,lineWidth:()=>zp,shadow:()=>Gp,color:()=>jp,image:()=>Vp,gradient:()=>bs,position:()=>Xp,familyName:()=>Qp,genericName:()=>Kp,absoluteSize:()=>eh,relativeSize:()=>rh});var Wp=bi(),$p=ds(),ki=["min","max","clamp","calc"],hs=/,(?![^(]*\))/g,Rr=/_(?![^(]*\))/g;function $e(e,t=!0){return e.includes("url(")?e.split(/(url\(.*?\))/g).filter(Boolean).map(n=>/^url\(.*?\)$/.test(n)?n:$e(n,!1)).join(""):(e=e.replace(/([^\\])_+/g,(n,r)=>r+" ".repeat(n.length-1)).replace(/^_/g," ").replace(/\\_/g,"_"),t&&(e=e.trim()),e=e.replace(/(calc|min|max|clamp)\(.+\)/g,n=>n.replace(/(-?\d*\.?\d(?!\b-.+[,)](?![^+\-/*])\D)(?:%|[a-z]+)?|\))([+\-/*])/g,"$1 $2 ")),e)}function ms(e){return e.startsWith("url(")}function qp(e){return!isNaN(Number(e))||ki.some(t=>new RegExp(`^${t}\\(.+?`).test(e))}function gs(e){return e.split(Rr).every(t=>/%$/g.test(t)||ki.some(n=>new RegExp(`^${n}\\(.+?%`).test(t)))}var Bp=["cm","mm","Q","in","pc","pt","px","em","ex","ch","rem","lh","vw","vh","vmin","vmax"],ps=`(?:${Bp.join("|")})`;function vs(e){return e.split(Rr).every(t=>t==="0"||new RegExp(`${ps}$`).test(t)||ki.some(n=>new RegExp(`^${n}\\(.+?${ps}`).test(t)))}var Up=new Set(["thin","medium","thick"]);function zp(e){return Up.has(e)}function Gp(e){let t=(0,$p.parseBoxShadowValue)($e(e));for(let n of t)if(!n.valid)return!1;return!0}function jp(e){let t=0;return e.split(Rr).every(r=>(r=$e(r),r.startsWith("var(")?!0:(0,Wp.parseColor)(r,{loose:!0})!==null?(t++,!0):!1))?t>0:!1}function Vp(e){let t=0;return e.split(hs).every(r=>(r=$e(r),r.startsWith("var(")?!0:ms(r)||bs(r)||["element(","image(","cross-fade(","image-set("].some(i=>r.startsWith(i))?(t++,!0):!1))?t>0:!1}var Hp=new Set(["linear-gradient","radial-gradient","repeating-linear-gradient","repeating-radial-gradient","conic-gradient"]);function bs(e){e=$e(e);for(let t of Hp)if(e.startsWith(`${t}(`))return!0;return!1}var Yp=new Set(["center","top","right","bottom","left"]);function Xp(e){let t=0;return e.split(Rr).every(r=>(r=$e(r),r.startsWith("var(")?!0:Yp.has(r)||vs(r)||gs(r)?(t++,!0):!1))?t>0:!1}function Qp(e){let t=0;return e.split(hs).every(r=>(r=$e(r),r.startsWith("var(")?!0:r.includes(" ")&&!/(['"])([^"']+)\1/g.test(r)||/^\d/g.test(r)?!1:(t++,!0)))?t>0:!1}var Jp=new Set(["serif","sans-serif","monospace","cursive","fantasy","system-ui","ui-serif","ui-sans-serif","ui-monospace","ui-rounded","math","emoji","fangsong"]);function Kp(e){return Jp.has(e)}var Zp=new Set(["xx-small","x-small","small","medium","large","x-large","x-large","xxx-large"]);function eh(e){return Zp.has(e)}var th=new Set(["larger","smaller"]);function rh(e){return th.has(e)}});var Os=R(Pi=>{"use strict";c();Object.defineProperty(Pi,"__esModule",{value:!0});function nh(e,t){for(var n in t)Object.defineProperty(e,n,{enumerable:!0,get:t[n]})}nh(Pi,{updateAllClasses:()=>ah,asValue:()=>Gt,parseColorFormat:()=>Ei,asColor:()=>ks,asLookupValue:()=>Ts,coerceValue:()=>fh});var ih=Oi(Ka()),oh=Oi(Za()),xs=xi(),fe=ys(),ws=Oi(dn());function Oi(e){return e&&e.__esModule?e:{default:e}}function ah(e,t){return(0,ih.default)(i=>{i.walkClasses(a=>{let o=t(a.value);a.value=o,a.raws&&a.raws.value&&(a.raws.value=(0,oh.default)(a.raws.value))})}).processSync(e)}function Ss(e,t){if(!zt(e))return;let n=e.slice(1,-1);if(!!t(n))return(0,fe.normalize)(n)}function sh(e,t={},n){let r=t[e];if(r!==void 0)return(0,ws.default)(r);if(zt(e)){let i=Ss(e,n);return i===void 0?void 0:(0,ws.default)(i)}}function Gt(e,t={},{validate:n=()=>!0}={}){var r;let i=(r=t.values)===null||r===void 0?void 0:r[e];return i!==void 0?i:t.supportsNegativeValues&&e.startsWith("-")?sh(e.slice(1),t.values,n):Ss(e,n)}function zt(e){return e.startsWith("[")&&e.endsWith("]")}function uh(e){let t=e.lastIndexOf("/");return t===-1||t===e.length-1?[e]:[e.slice(0,t),e.slice(t+1)]}function Ei(e){if(typeof e=="string"&&e.includes("<alpha-value>")){let t=e;return({opacityValue:n=1})=>t.replace("<alpha-value>",n)}return e}function ks(e,t={},{tailwindConfig:n={}}={}){var r;if(((r=t.values)===null||r===void 0?void 0:r[e])!==void 0){var i;return Ei((i=t.values)===null||i===void 0?void 0:i[e])}let[a,o]=uh(e);if(o!==void 0){var s,u,l,f;let p=(f=(s=t.values)===null||s===void 0?void 0:s[a])!==null&&f!==void 0?f:zt(a)?a.slice(1,-1):void 0;return p===void 0?void 0:(p=Ei(p),zt(o)?(0,xs.withAlphaValue)(p,o.slice(1,-1)):((u=n.theme)===null||u===void 0||(l=u.opacity)===null||l===void 0?void 0:l[o])===void 0?void 0:(0,xs.withAlphaValue)(p,n.theme.opacity[o]))}return Gt(e,t,{validate:fe.color})}function Ts(e,t={}){var n;return(n=t.values)===null||n===void 0?void 0:n[e]}function we(e){return(t,n)=>Gt(t,n,{validate:e})}var Es={any:Gt,color:ks,url:we(fe.url),image:we(fe.image),length:we(fe.length),percentage:we(fe.percentage),position:we(fe.position),lookup:Ts,"generic-name":we(fe.genericName),"family-name":we(fe.familyName),number:we(fe.number),"line-width":we(fe.lineWidth),"absolute-size":we(fe.absoluteSize),"relative-size":we(fe.relativeSize),shadow:we(fe.shadow)},_s=Object.keys(Es);function lh(e,t){let n=e.indexOf(t);return n===-1?[void 0,e]:[e.slice(0,n),e.slice(n+1)]}function fh(e,t,n,r){if(zt(t)){let i=t.slice(1,-1),[a,o]=lh(i,":");if(!/^[\w-_]+$/g.test(a))o=i;else if(a!==void 0&&!_s.includes(a))return[];if(o.length>0&&_s.includes(a))return[Gt(`[${o}]`,n),a]}for(let i of[].concat(e)){let a=Es[i](t,n,{tailwindConfig:r});if(a!==void 0)return[a,i]}return[]}});var Ps=R(Ai=>{"use strict";c();Object.defineProperty(Ai,"__esModule",{value:!0});Object.defineProperty(Ai,"default",{enumerable:!0,get:()=>ch});function ch(e){return typeof e=="function"?e({}):e}});var Cs=R(Ii=>{"use strict";c();Object.defineProperty(Ii,"__esModule",{value:!0});Object.defineProperty(Ii,"default",{enumerable:!0,get:()=>Ih});var dh=Xe(dn()),ph=Xe(Mo()),hh=Xe(No()),mh=Xe(mn()),gh=Xe($o()),Is=qo(),As=Bo(),vh=zo(),bh=Xe(Go()),yh=jo(),xh=Os(),wh=xi(),_h=Xe(Ps());function Xe(e){return e&&e.__esModule?e:{default:e}}function ot(e){return typeof e=="function"}function jt(e){return typeof e=="object"&&e!==null}function Vt(e,...t){let n=t.pop();for(let r of t)for(let i in r){let a=n(e[i],r[i]);a===void 0?jt(e[i])&&jt(r[i])?e[i]=Vt(e[i],r[i],n):e[i]=r[i]:e[i]=a}return e}var Ri={colors:gh.default,negative(e){return Object.keys(e).filter(t=>e[t]!=="0").reduce((t,n)=>{let r=(0,dh.default)(e[n]);return r!==void 0&&(t[`-${n}`]=r),t},{})},breakpoints(e){return Object.keys(e).filter(t=>typeof e[t]=="string").reduce((t,n)=>({...t,[`screen-${n}`]:e[n]}),{})}};function Sh(e,...t){return ot(e)?e(...t):e}function kh(e){return e.reduce((t,{extend:n})=>Vt(t,n,(r,i)=>r===void 0?[i]:Array.isArray(r)?[i,...r]:[i,r]),{})}function Th(e){return{...e.reduce((t,n)=>(0,Is.defaults)(t,n),{}),extend:kh(e)}}function Rs(e,t){if(Array.isArray(e)&&jt(e[0]))return e.concat(t);if(Array.isArray(t)&&jt(t[0])&&jt(e))return[e,...t];if(Array.isArray(t))return t}function Eh({extend:e,...t}){return Vt(t,e,(n,r)=>!ot(n)&&!r.some(ot)?Vt({},n,...r,Rs):(i,a)=>Vt({},...[n,...r].map(o=>Sh(o,i,a)),Rs))}function*Oh(e){let t=(0,As.toPath)(e);if(t.length===0||(yield t,Array.isArray(e)))return;let n=/^(.*?)\s*\/\s*([^/]+)$/,r=e.match(n);if(r!==null){let[,i,a]=r,o=(0,As.toPath)(i);o.alpha=a,yield o}}function Ph(e){let t=(n,r)=>{for(let i of Oh(n)){let a=0,o=e;for(;o!=null&&a<i.length;)o=o[i[a++]],o=ot(o)&&(i.alpha===void 0||a<=i.length-1)?o(t,Ri):o;if(o!==void 0){if(i.alpha!==void 0){let s=(0,xh.parseColorFormat)(o);return(0,wh.withAlphaValue)(s,i.alpha,(0,_h.default)(s))}return(0,bh.default)(o)?(0,yh.cloneDeep)(o):o}}return r};return Object.assign(t,{theme:t,...Ri}),Object.keys(e).reduce((n,r)=>(n[r]=ot(e[r])?e[r](t,Ri):e[r],n),{})}function Ls(e){let t=[];return e.forEach(n=>{t=[...t,n];var r;let i=(r=n==null?void 0:n.plugins)!==null&&r!==void 0?r:[];i.length!==0&&i.forEach(a=>{a.__isOptionsFunction&&(a=a());var o;t=[...t,...Ls([(o=a==null?void 0:a.config)!==null&&o!==void 0?o:{}])]})}),t}function Ah(e){return[...e].reduceRight((n,r)=>ot(r)?r({corePlugins:n}):(0,hh.default)(r,n),ph.default)}function Rh(e){return[...e].reduceRight((n,r)=>[...n,...r],[])}function Ih(e){let t=[...Ls(e),{prefix:"",important:!1,separator:":",variantOrder:mh.default.variantOrder}];var n,r;return(0,vh.normalizeConfig)((0,Is.defaults)({theme:Ph(Eh(Th(t.map(i=>(n=i==null?void 0:i.theme)!==null&&n!==void 0?n:{})))),corePlugins:Ah(t.map(i=>i.corePlugins)),plugins:Rh(e.map(i=>(r=i==null?void 0:i.plugins)!==null&&r!==void 0?r:[]))},...t))}});var Ds={};uo(Ds,{default:()=>Lh});var Lh,Fs=Wr(()=>{c();Lh={yellow:e=>e}});var $s=R(Li=>{"use strict";c();Object.defineProperty(Li,"__esModule",{value:!0});function Ch(e,t){for(var n in t)Object.defineProperty(e,n,{enumerable:!0,get:t[n]})}Ch(Li,{flagEnabled:()=>Mh,issueFlagNotices:()=>Nh,default:()=>Wh});var Dh=Ws((Fs(),ar(Ds))),Fh=Ws((mr(),ar(hr)));function Ws(e){return e&&e.__esModule?e:{default:e}}var Ms={optimizeUniversalDefaults:!1},Ht={future:["hoverOnlyWhenSupported","respectDefaultRingColorOpacity"],experimental:["optimizeUniversalDefaults","matchVariant"]};function Mh(e,t){if(Ht.future.includes(t)){var n,r,i;return e.future==="all"||((i=(r=e==null||(n=e.future)===null||n===void 0?void 0:n[t])!==null&&r!==void 0?r:Ms[t])!==null&&i!==void 0?i:!1)}if(Ht.experimental.includes(t)){var a,o,s;return e.experimental==="all"||((s=(o=e==null||(a=e.experimental)===null||a===void 0?void 0:a[t])!==null&&o!==void 0?o:Ms[t])!==null&&s!==void 0?s:!1)}return!1}function Ns(e){if(e.experimental==="all")return Ht.experimental;var t;return Object.keys((t=e==null?void 0:e.experimental)!==null&&t!==void 0?t:{}).filter(n=>Ht.experimental.includes(n)&&e.experimental[n])}function Nh(e){if(process.env.JEST_WORKER_ID===void 0&&Ns(e).length>0){let t=Ns(e).map(n=>Dh.default.yellow(n)).join(", ");Fh.default.warn("experimental-flags-enabled",[`You have enabled experimental features: ${t}`,"Experimental features in Tailwind CSS are not covered by semver, may introduce breaking changes, and can change at any time."])}}var Wh=Ht});var Bs=R(Ci=>{"use strict";c();Object.defineProperty(Ci,"__esModule",{value:!0});Object.defineProperty(Ci,"default",{enumerable:!0,get:()=>qs});var $h=Bh(mn()),qh=$s();function Bh(e){return e&&e.__esModule?e:{default:e}}function qs(e){var t;let n=((t=e==null?void 0:e.presets)!==null&&t!==void 0?t:[$h.default]).slice().reverse().flatMap(a=>qs(typeof a=="function"?a():a)),r={respectDefaultRingColorOpacity:{theme:{ringColor:{DEFAULT:"#3b82f67f"}}}},i=Object.keys(r).filter(a=>(0,qh.flagEnabled)(e,a)).map(a=>r[a]);return[e,...i,...n]}});var zs=R(Di=>{"use strict";c();Object.defineProperty(Di,"__esModule",{value:!0});Object.defineProperty(Di,"default",{enumerable:!0,get:()=>Gh});var Uh=Us(Cs()),zh=Us(Bs());function Us(e){return e&&e.__esModule?e:{default:e}}function Gh(...e){let[,...t]=(0,zh.default)(e[0]);return(0,Uh.default)([...e,...t])}});var js=R((mg,Gs)=>{c();var Fi=zs();Gs.exports=(Fi.__esModule?Fi:{default:Fi}).default});c();c();c();c();var fo={};var $r;$r=fo.default;function Tu(e){$r=e}function Ae(){return $r}c();c();c();var ft=(e,t)=>()=>(t||e((t={exports:{}}).exports,t),t.exports),Eu=ft((e,t)=>{t.exports=["em","ex","ch","rem","vh","vw","vmin","vmax","px","mm","cm","in","pt","pc","mozmm"]}),Ou=ft((e,t)=>{t.exports=["deg","grad","rad","turn"]}),Pu=ft((e,t)=>{t.exports=["dpi","dpcm","dppx"]}),Au=ft((e,t)=>{t.exports=["Hz","kHz"]}),Ru=ft((e,t)=>{t.exports=["s","ms"]}),Iu=Eu(),co=Ou(),po=Pu(),ho=Au(),mo=Ru();function Br(e){if(/\.\D?$/.test(e))throw new Error("The dot should be followed by a number");if(/^[+-]{2}/.test(e))throw new Error("Only one leading +/- is allowed");if(Lu(e)>1)throw new Error("Only one dot is allowed");if(/%$/.test(e)){this.type="percentage",this.value=qr(e),this.unit="%";return}var t=Du(e);if(!t){this.type="number",this.value=qr(e);return}this.type=Mu(t),this.value=qr(e.substr(0,e.length-t.length)),this.unit=t}Br.prototype.valueOf=function(){return this.value};Br.prototype.toString=function(){return this.value+(this.unit||"")};function Me(e){return new Br(e)}function Lu(e){var t=e.match(/\./g);return t?t.length:0}function qr(e){var t=parseFloat(e);if(isNaN(t))throw new Error("Invalid number: "+e);return t}var Cu=[].concat(co,ho,Iu,po,mo);function Du(e){var t=e.match(/\D+$/),n=t&&t[0];if(n&&Cu.indexOf(n)===-1)throw new Error("Invalid unit: "+n);return n}var Fu=Object.assign(sr(co,"angle"),sr(ho,"frequency"),sr(po,"resolution"),sr(mo,"time"));function sr(e,t){return Object.fromEntries(e.map(n=>[n,t]))}function Mu(e){return Fu[e]||"length"}function jr(e){let t=typeof e;return!(t==="number"||t==="bigint"||t==="string"||t==="boolean")}function vo(e){return/^class\s/.test(e.toString())}function bo(e){let t=typeof e>"u"?[]:[].concat(e).flat(1/0),n=[];for(let r=0;r<t.length;r++){let i=t[r];typeof i>"u"||typeof i=="boolean"||i===null||(typeof i=="number"&&(i=String(i)),typeof i=="string"&&n.length&&typeof n[n.length-1]=="string"?n[n.length-1]+=i:n.push(i))}return n}function ze(e,t,n,r,i=!1){if(typeof e=="number")return e;try{if(e=e.trim(),/[ /\(,]/.test(e))return;let a=new Me(e);if(a.type==="length")switch(a.unit){case"em":return a.value*t;case"rem":return a.value*16;case"vw":return~~(a.value*r._viewportWidth/100);case"vh":return~~(a.value*r._viewportHeight/100);default:return a.value}else if(a.type==="angle")switch(a.unit){case"deg":return a.value;case"rad":return a.value*180/Math.PI;default:return a.value}else if(a.type==="percentage"&&i)return a.value/100*n}catch{}}function ct(e,t){return[e[0]*t[0]+e[2]*t[1],e[1]*t[0]+e[3]*t[1],e[0]*t[2]+e[2]*t[3],e[1]*t[2]+e[3]*t[3],e[0]*t[4]+e[2]*t[5]+e[4],e[1]*t[4]+e[3]*t[5]+e[5]]}function ae(e,t,n,r){let i=t[e];if(typeof i>"u"){if(r&&typeof e<"u")throw new Error(`Invalid value for CSS property "${r}". Allowed values: ${Object.keys(t).map(a=>`"${a}"`).join(" | ")}. Received: "${e}".`);i=n}return i}var go=void 0,Ur,zr,ur=[32,160,4961,65792,65793,4153,4241,10].map(e=>String.fromCodePoint(e));function Ge(e,t){if(!Ur||!zr){if(!(typeof Intl<"u"&&"Segmenter"in Intl))throw new Error("Intl.Segmenter does not exist, please use import a polyfill.");Ur=new Intl.Segmenter(go,{granularity:"word"}),zr=new Intl.Segmenter(go,{granularity:"grapheme"})}return t==="word"?[...Ur.segment(e)].map(n=>n.segment):[...zr.segment(e)].map(n=>n.segment)}function P(e,t,n){let r="";for(let[i,a]of Object.entries(t))typeof a<"u"&&(r+=` ${i}="${a}"`);return n?`<${e}${r}>${n}</${e}>`:`<${e}${r}/>`}function yo(e=20){let t=new Map;function n(i,a){if(t.size>=e){let o=t.keys().next().value;t.delete(o)}t.set(i,a)}function r(i){if(!t.has(i))return;let o=t.get(i);return t.delete(i),t.set(i,o),o}return{set:n,get:r}}var xo={accentHeight:"accent-height",alignmentBaseline:"alignment-baseline",arabicForm:"arabic-form",baselineShift:"baseline-shift",capHeight:"cap-height",clipPath:"clip-path",clipRule:"clip-rule",colorInterpolation:"color-interpolation",colorInterpolationFilters:"color-interpolation-filters",colorProfile:"color-profile",colorRendering:"color-rendering",dominantBaseline:"dominant-baseline",enableBackground:"enable-background",fillOpacity:"fill-opacity",fillRule:"fill-rule",floodColor:"flood-color",floodOpacity:"flood-opacity",fontFamily:"font-family",fontSize:"font-size",fontSizeAdjust:"font-size-adjust",fontStretch:"font-stretch",fontStyle:"font-style",fontVariant:"font-variant",fontWeight:"font-weight",glyphName:"glyph-name",glyphOrientationHorizontal:"glyph-orientation-horizontal",glyphOrientationVertical:"glyph-orientation-vertical",horizAdvX:"horiz-adv-x",horizOriginX:"horiz-origin-x",imageRendering:"image-rendering",letterSpacing:"letter-spacing",lightingColor:"lighting-color",markerEnd:"marker-end",markerMid:"marker-mid",markerStart:"marker-start",overlinePosition:"overline-position",overlineThickness:"overline-thickness",paintOrder:"paint-order",panose1:"panose-1",pointerEvents:"pointer-events",renderingIntent:"rendering-intent",shapeRendering:"shape-rendering",stopColor:"stop-color",stopOpacity:"stop-opacity",strikethroughPosition:"strikethrough-position",strikethroughThickness:"strikethrough-thickness",strokeDasharray:"stroke-dasharray",strokeDashoffset:"stroke-dashoffset",strokeLinecap:"stroke-linecap",strokeLinejoin:"stroke-linejoin",strokeMiterlimit:"stroke-miterlimit",strokeOpacity:"stroke-opacity",strokeWidth:"stroke-width",textAnchor:"text-anchor",textDecoration:"text-decoration",textRendering:"text-rendering",underlinePosition:"underline-position",underlineThickness:"underline-thickness",unicodeBidi:"unicode-bidi",unicodeRange:"unicode-range",unitsPerEm:"units-per-em",vAlphabetic:"v-alphabetic",vHanging:"v-hanging",vIdeographic:"v-ideographic",vMathematical:"v-mathematical",vectorEffect:"vector-effect",vertAdvY:"vert-adv-y",vertOriginX:"vert-origin-x",vertOriginY:"vert-origin-y",wordSpacing:"word-spacing",writingMode:"writing-mode",xHeight:"x-height",xlinkActuate:"xlink:actuate",xlinkArcrole:"xlink:arcrole",xlinkHref:"xlink:href",xlinkRole:"xlink:role",xlinkShow:"xlink:show",xlinkTitle:"xlink:title",xlinkType:"xlink:type",xmlBase:"xml:base",xmlLang:"xml:lang",xmlSpace:"xml:space",xmlnsXlink:"xmlns:xlink"},Nu=/[\r\n%#()<>?[\\\]^`{|}"']/g;function Gr(e){if(!e)return"";if(Array.isArray(e))return e.map(Gr).join("");if(typeof e!="object")return String(e);let t=e.type;if(t==="text")throw new Error("<text> nodes are not currently supported, please convert them to <path>");let{children:n,...r}=e.props||{};return`<${t}${Object.entries(r).map(([i,a])=>` ${xo[i]||i}="${a}"`).join("")}>${Gr(n)}</${t}>`}function wo(e){let{viewBox:t,viewbox:n,width:r,height:i,className:a,style:o,children:s,...u}=e.props||{};t||(t=n);let l=t.split(" ").map(f=>parseInt(f,10));return u.xmlns="http://www.w3.org/2000/svg",u.viewBox=t,u.width=l[2],u.height=l[3],`data:image/svg+xml;utf8,${`<svg${Object.entries(u).map(([f,p])=>` ${xo[f]||f}="${p}"`).join("")}>${Gr(s)}</svg>`.replace(Nu,encodeURIComponent)}`}c();c();var ve="flex",_o={p:{display:ve,marginTop:"1em",marginBottom:"1em"},div:{display:ve},blockquote:{display:ve,marginTop:"1em",marginBottom:"1em",marginLeft:40,marginRight:40},center:{display:ve,textAlign:"center"},hr:{display:ve,marginTop:"0.5em",marginBottom:"0.5em",marginLeft:"auto",marginRight:"auto",borderWidth:1,borderStyle:"solid"},h1:{display:ve,fontSize:"2em",marginTop:"0.67em",marginBottom:"0.67em",marginLeft:0,marginRight:0,fontWeight:"bold"},h2:{display:ve,fontSize:"1.5em",marginTop:"0.83em",marginBottom:"0.83em",marginLeft:0,marginRight:0,fontWeight:"bold"},h3:{display:ve,fontSize:"1.17em",marginTop:"1em",marginBottom:"1em",marginLeft:0,marginRight:0,fontWeight:"bold"},h4:{display:ve,marginTop:"1.33em",marginBottom:"1.33em",marginLeft:0,marginRight:0,fontWeight:"bold"},h5:{display:ve,fontSize:"0.83em",marginTop:"1.67em",marginBottom:"1.67em",marginLeft:0,marginRight:0,fontWeight:"bold"},h6:{display:ve,fontSize:"0.67em",marginTop:"2.33em",marginBottom:"2.33em",marginLeft:0,marginRight:0,fontWeight:"bold"},u:{textDecoration:"underline"},strong:{fontWeight:"bold"},b:{fontWeight:"bold"},i:{fontStyle:"italic"},em:{fontStyle:"italic"},code:{fontFamily:"monospace"},kbd:{fontFamily:"monospace"},pre:{display:ve,fontFamily:"monospace",whiteSpace:"pre",marginTop:"1em",marginBottom:"1em"},mark:{backgroundColor:"yellow",color:"black"},big:{fontSize:"larger"},small:{fontSize:"smaller"},s:{textDecoration:"line-through"}};c();var Wu=new Set(["color","font","fontFamily","fontSize","fontStyle","fontWeight","letterSpacing","lineHeight","textAlign","textTransform","textShadowOffset","textShadowColor","textShadowRadius","textDecorationLine","textDecorationStyle","textDecorationColor","whiteSpace","transform","wordBreak","opacity","filter","_viewportWidth","_viewportHeight","_inheritedClipPathId","_inheritedMaskId","_inheritedBackgroundClipTextPath"]);function Vr(e){let t={};for(let n in e)Wu.has(n)&&(t[n]=e[n]);return t}c();c();function qu(e,t){try{let n=new Me(e);switch(n.unit){case"px":return{absolute:n.value};case"em":return{absolute:n.value*t};case"rem":return{absolute:n.value*16};case"%":return{relative:n.value};default:return{}}}catch{return{}}}function Hr(e,t,n){switch(e){case"top":return{yRelative:0};case"left":return{xRelative:0};case"right":return{xRelative:100};case"bottom":return{yRelative:100};case"center":return{};default:{let r=qu(e,t);return r.absolute?{[n?"xAbsolute":"yAbsolute"]:r.absolute}:r.relative?{[n?"xRelative":"yRelative"]:r.relative}:{}}}}function Yr(e,t){if(typeof e=="number")return{xAbsolute:e};let n;try{n=lib(e).nodes.filter(r=>r.type==="word").map(r=>r.value)}catch{return{}}return n.length===1?Hr(n[0],t,!0):n.length===2?((n[0]==="top"||n[0]==="bottom"||n[1]==="left"||n[1]==="right")&&n.reverse(),{...Hr(n[0],t,!0),...Hr(n[1],t,!1)}):{}}var Gu=new Set(["flex","flexGrow","flexShrink","flexBasis","fontWeight","lineHeight","opacity","scale","scaleX","scaleY"]),ju=new Set(["lineHeight"]);function Vu(e,t,n,r){return e==="textDecoration"&&!n.includes(t.textDecorationColor)&&(t.textDecorationColor=r),t}function dt(e,t){return typeof t=="number"?Gu.has(e)?ju.has(e)?t:String(t):t+"px":t}function Hu(e,t,n){if(e==="lineHeight")return{lineHeight:dt(e,t)};if(e==="fontFamily")return{fontFamily:t.split(",").map(r=>r.trim().replace(/(^['"])|(['"]$)/g,"").toLocaleLowerCase())};if(e==="borderRadius"){if(typeof t!="string"||!t.includes("/"))return;let[r,i]=t.split("/"),a=(0,css_to_react_native/* getStylesForProperty */.HM)(e,r,!0),o=(0,css_to_react_native/* getStylesForProperty */.HM)(e,i,!0);for(let s in a)o[s]=dt(e,a[s])+" "+dt(e,o[s]);return o}if(/^border(Top|Right|Bottom|Left)?$/.test(e)){let r=(0,css_to_react_native/* getStylesForProperty */.HM)("border",t,!0);r.borderWidth===1&&!String(t).includes("1px")&&(r.borderWidth=3),r.borderColor==="black"&&!String(t).includes("black")&&(r.borderColor=n);let i={Width:dt(e+"Width",r.borderWidth),Style:ae(r.borderStyle,{solid:"solid",dashed:"dashed"},"solid",e+"Style"),Color:r.borderColor},a={};for(let o of e==="border"?["Top","Right","Bottom","Left"]:[e.slice(6)])for(let s in i)a["border"+o+s]=i[s];return a}if(e==="boxShadow"){if(!t)throw new Error('Invalid `boxShadow` value: "'+t+'".');return{[e]:typeof t=="string"?(0,css_box_shadow.parse)(t):t}}if(e==="transform"){if(typeof t!="string")throw new Error("Invalid `transform` value.");let r={},i=t.replace(/(-?[\d.]+%)/g,(o,s)=>{let u=~~(Math.random()*1e9);return r[u]=s,u+"px"}),a=(0,css_to_react_native/* getStylesForProperty */.HM)("transform",i,!0);for(let o of a.transform)for(let s in o)r[o[s]]&&(o[s]=r[o[s]]);return a}if(e==="background")return t=t.toString().trim(),/^(linear-gradient|radial-gradient|url)\(/.test(t)?(0,css_to_react_native/* getStylesForProperty */.HM)("backgroundImage",t,!0):(0,css_to_react_native/* getStylesForProperty */.HM)("background",t,!0)}function So(e){return e==="transform"?" Only absolute lengths such as `10px` are supported.":""}var ko=/rgb\((\d+)\s+(\d+)\s+(\d+)\s*\/\s*([\.\d]+)\)/;function To(e){if(typeof e=="string"&&ko.test(e.trim()))return e.trim().replace(ko,(t,n,r,i,a)=>`rgba(${n}, ${r}, ${i}, ${a})`);if(typeof e=="object"&&e!==null){for(let t in e)e[t]=To(e[t]);return e}return e}function lr(e,t){var i;let n={};for(let a in e){if(a.startsWith("_")){n[a]=e[a];continue}let o=(0,css_to_react_native/* getPropertyName */.Hp)(a),s=e.color||t.color;try{let u=Hu(o,e[a],s)||Vu(o,(0,css_to_react_native/* getStylesForProperty */.HM)(o,dt(o,e[a]),!0),e[a],s);Object.assign(n,u)}catch(u){throw new Error(u.message+(u.message.includes(e[a])?`
  `+So(o):`
  in CSS rule \`${o}: ${e[a]}\`.${So(o)}`))}}if(n.backgroundImage){let{backgrounds:a}=(0,css_background_parser.parseElementStyle)(n);n.backgroundImage=a}let r=typeof n.fontSize=="number"?n.fontSize:t.fontSize;if(typeof r=="string")try{let a=new Me(r);switch(a.unit){case"em":r=a.value*t.fontSize;break;case"rem":r=a.value*16;break}}catch{r=16}typeof n.fontSize<"u"&&(n.fontSize=r),n.transformOrigin&&(n.transformOrigin=Yr(n.transformOrigin,r));for(let a in n){let o=n[a];if(a==="lineHeight")typeof o=="string"&&(o=n[a]=ze(o,r,r,t,!0)/r);else{if(typeof o=="string"){let s=ze(o,r,r,t);typeof s<"u"&&(n[a]=s),o=n[a]}if(typeof o=="string"||typeof o=="object"){let s=To(o);s&&(n[a]=s),o=n[a]}}if(a==="opacity"&&(o=n[a]=o*t.opacity),a==="transform"){let s=o;for(let u of s){let l=Object.keys(u)[0],f=u[l],p=typeof f=="string"&&(i=ze(f,r,r,t))!=null?i:f;u[l]=p}}}return n}c();function Yu(e){let t=new DataView(e),n=4,r=t.byteLength;for(;n<r;){let i=t.getUint16(n,!1);if(i>r)throw new TypeError("Invalid JPEG");let a=t.getUint8(i+1+n);if(a===192||a===193||a===194)return[t.getUint16(i+7+n,!1),t.getUint16(i+5+n,!1)];n+=i+2}throw new TypeError("Invalid JPEG")}function Xu(e){let t=new Uint8Array(e.slice(6,10));return[t[0]|t[1]<<8,t[2]|t[3]<<8]}function Qu(e){let t=new DataView(e);return[t.getUint16(18,!1),t.getUint16(22,!1)]}var Xr=yo(100),Qr=new Map,Ju=["image/png","image/jpeg","image/gif","image/svg+xml"];function Ku(e){let t="",n=new Uint8Array(e);for(let r=0;r<n.byteLength;r++)t+=String.fromCharCode(n[r]);return btoa(t)}async function fr(e){if(!e)throw new Error("Image source is not provided.");if(e.startsWith("data:"))return[e];if(!globalThis.fetch)throw new Error("`fetch` is required to be polyfilled to load images.");if(Qr.has(e))return Qr.get(e);let t=Xr.get(e);if(t)return t;let n=new Promise((r,i)=>{fetch(e).then(a=>{let o=a.headers.get("content-type");return o==="image/svg+xml"||o==="application/svg+xml"?a.text():a.arrayBuffer()}).then(a=>{if(typeof a=="string")try{let p=`data:image/svg+xml;base64,${btoa(a)}`,g=a.match(/<svg[^>]*>/)[0],m=g.match(/viewBox="0 0 (\d+) (\d+)"/),d=g.match(/width="(\d+)"/),h=g.match(/height="(\d+)"/);!m&&d&&h&&(m=[null,d[1],h[1]]);let w=+m[1]/+m[2],b=d&&h?[+d[1],+h[1]]:d?[+d[1],+d[1]/w]:h?[+h[1]*w,+h[1]]:[+m[1],+m[2]];Xr.set(e,[p,...b]),r([p,...b]);return}catch(p){throw new Error(`Failed to parse SVG image: ${p.message}`)}let o,s;switch([...new Uint8Array(a.slice(0,4))].map(p=>p.toString(16)).join("")){case"89504e47":o="image/png",s=Qu(a);break;case"47494638":o="image/gif",s=Xu(a);break;case"ffd8ffe0":case"ffd8ffe1":case"ffd8ffe2":case"ffd8ffe3":case"ffd8ffe8":case"ffd8ffed":case"ffd8ffdb":o="image/jpeg",s=Yu(a);break}if(!Ju.includes(o))throw new Error(`Unsupported image type: ${o||"unknown"}`);let f=`data:${o};base64,${Ku(a)}`;Xr.set(e,[f,...s]),r([f,...s])}).catch(a=>{i(new Error(`Can't load image ${e}: `+a.message))})});return Qr.set(e,n),n}async function Jr(e,t,n,r,i){let a=Ae(),o={...n,...lr(_o[t],n),...lr(r,n)};if(t==="img"){let[s,u,l]=await fr(i.src);if(u===void 0&&l===void 0){if(i.width===void 0||i.height===void 0)throw new Error("Image size cannot be determined. Please provide the width and height of the image.");u=parseInt(i.width),l=parseInt(i.height)}let f=l/u,p=(o.borderLeftWidth||0)+(o.borderRightWidth||0)+(o.paddingLeft||0)+(o.paddingRight||0),g=(o.borderTopWidth||0)+(o.borderBottomWidth||0)+(o.paddingTop||0)+(o.paddingBottom||0),m=o.width||i.width,d=o.height||i.height,h=typeof m!="string"&&typeof d!="string";typeof m=="number"&&h&&(m-=p),typeof d=="number"&&h&&(d-=g),m===void 0&&d===void 0?(m=u,d=l):m===void 0?typeof d=="number"?m=d/f:e.setAspectRatio(1/f):d===void 0&&(typeof m=="number"?d=m*f:e.setAspectRatio(1/f)),o.width=h?m+p:m,o.height=h?m+g:d,o.__src=s}if(t==="svg"){let u=(i.viewBox||i.viewbox).split(" ").map(g=>parseInt(g,10)),l=u[3]/u[2],{width:f,height:p}=i;typeof f>"u"&&p?typeof p=="string"&&p.endsWith("%")?f=parseInt(p)/l+"%":f=parseInt(p)/l:typeof p>"u"&&f?typeof f=="string"&&f.endsWith("%")?p=parseInt(f)*l+"%":p=parseInt(f)*l:(f||(f=u[2]),p||(p=u[3])),o.width||(o.width=f),o.height||(o.height=p)}return e.setDisplay(ae(o.display,{flex:a.DISPLAY_FLEX,none:a.DISPLAY_NONE},a.DISPLAY_FLEX,"display")),e.setAlignContent(ae(o.alignContent,{stretch:a.ALIGN_STRETCH,center:a.ALIGN_CENTER,"flex-start":a.ALIGN_FLEX_START,"flex-end":a.ALIGN_FLEX_END,"space-between":a.ALIGN_SPACE_BETWEEN,"space-around":a.ALIGN_SPACE_AROUND,baseline:a.ALIGN_BASELINE,normal:a.ALIGN_AUTO},a.ALIGN_AUTO,"alignContent")),e.setAlignItems(ae(o.alignItems,{stretch:a.ALIGN_STRETCH,center:a.ALIGN_CENTER,"flex-start":a.ALIGN_FLEX_START,"flex-end":a.ALIGN_FLEX_END,baseline:a.ALIGN_BASELINE,normal:a.ALIGN_AUTO},a.ALIGN_FLEX_START,"alignItems")),e.setAlignSelf(ae(o.alignSelf,{stretch:a.ALIGN_STRETCH,center:a.ALIGN_CENTER,"flex-start":a.ALIGN_FLEX_START,"flex-end":a.ALIGN_FLEX_END,baseline:a.ALIGN_BASELINE,normal:a.ALIGN_AUTO},a.ALIGN_AUTO,"alignSelf")),e.setJustifyContent(ae(o.justifyContent,{center:a.JUSTIFY_CENTER,"flex-start":a.JUSTIFY_FLEX_START,"flex-end":a.JUSTIFY_FLEX_END,"space-between":a.JUSTIFY_SPACE_BETWEEN,"space-around":a.JUSTIFY_SPACE_AROUND},a.JUSTIFY_FLEX_START,"justifyContent")),e.setFlexDirection(ae(o.flexDirection,{row:a.FLEX_DIRECTION_ROW,column:a.FLEX_DIRECTION_COLUMN,"row-reverse":a.FLEX_DIRECTION_ROW_REVERSE,"column-reverse":a.FLEX_DIRECTION_COLUMN_REVERSE},a.FLEX_DIRECTION_ROW,"flexDirection")),e.setFlexWrap(ae(o.flexWrap,{wrap:a.WRAP_WRAP,nowrap:a.WRAP_NO_WRAP,"wrap-reverse":a.WRAP_WRAP_REVERSE},a.WRAP_NO_WRAP,"flexWrap")),typeof o.flexBasis<"u"&&e.setFlexBasis(o.flexBasis),e.setFlexGrow(typeof o.flexGrow>"u"?0:o.flexGrow),e.setFlexShrink(typeof o.flexShrink>"u"?0:o.flexShrink),typeof o.maxHeight<"u"&&e.setMaxHeight(o.maxHeight),typeof o.maxWidth<"u"&&e.setMaxWidth(o.maxWidth),typeof o.minHeight<"u"&&e.setMinHeight(o.minHeight),typeof o.minWidth<"u"&&e.setMinWidth(o.minWidth),e.setOverflow(ae(o.overflow,{visible:a.OVERFLOW_VISIBLE,hidden:a.OVERFLOW_HIDDEN},a.OVERFLOW_VISIBLE,"overflow")),e.setMargin(a.EDGE_TOP,o.marginTop||0),e.setMargin(a.EDGE_BOTTOM,o.marginBottom||0),e.setMargin(a.EDGE_LEFT,o.marginLeft||0),e.setMargin(a.EDGE_RIGHT,o.marginRight||0),e.setBorder(a.EDGE_TOP,o.borderTopWidth||0),e.setBorder(a.EDGE_BOTTOM,o.borderBottomWidth||0),e.setBorder(a.EDGE_LEFT,o.borderLeftWidth||0),e.setBorder(a.EDGE_RIGHT,o.borderRightWidth||0),e.setPadding(a.EDGE_TOP,o.paddingTop||0),e.setPadding(a.EDGE_BOTTOM,o.paddingBottom||0),e.setPadding(a.EDGE_LEFT,o.paddingLeft||0),e.setPadding(a.EDGE_RIGHT,o.paddingRight||0),e.setPositionType(ae(o.position,{absolute:a.POSITION_TYPE_ABSOLUTE,relative:a.POSITION_TYPE_RELATIVE},a.POSITION_TYPE_RELATIVE,"position")),typeof o.top<"u"&&e.setPosition(a.EDGE_TOP,o.top),typeof o.bottom<"u"&&e.setPosition(a.EDGE_BOTTOM,o.bottom),typeof o.left<"u"&&e.setPosition(a.EDGE_LEFT,o.left),typeof o.right<"u"&&e.setPosition(a.EDGE_RIGHT,o.right),typeof o.height<"u"?e.setHeight(o.height):e.setHeightAuto(),typeof o.width<"u"?e.setWidth(o.width):e.setWidthAuto(),[o,Vr(o)]}c();c();c();var Eo=[1,0,0,1,0,0];function Zu(e,t,n){let r=[...Eo];for(let i of e){let a=Object.keys(i)[0],o=i[a];if(typeof o=="string")if(a==="translateX")o=parseFloat(o)/100*t,i[a]=o;else if(a==="translateY")o=parseFloat(o)/100*n,i[a]=o;else throw new Error(`Invalid transform: "${a}: ${o}".`);let s=o,u=[...Eo];switch(a){case"translateX":u[4]=s;break;case"translateY":u[5]=s;break;case"scale":u[0]=s,u[3]=s;break;case"scaleX":u[0]=s;break;case"scaleY":u[3]=s;break;case"rotate":{let l=s*Math.PI/180,f=Math.cos(l),p=Math.sin(l);u[0]=f,u[1]=p,u[2]=-p,u[3]=f;break}case"skewX":u[2]=Math.tan(s*Math.PI/180);break;case"skewY":u[1]=Math.tan(s*Math.PI/180);break}r=ct(u,r)}e.splice(0,e.length),e.push(...r),e.__resolved=!0}function pt({left:e,top:t,width:n,height:r},i,a,o){var l,f,p,g;let s;i.__resolved||Zu(i,n,r);let u=i;if(a)s=u;else{let m=(f=o==null?void 0:o.xAbsolute)!=null?f:((l=o==null?void 0:o.xRelative)!=null?l:50)*n/100,d=(g=o==null?void 0:o.yAbsolute)!=null?g:((p=o==null?void 0:o.yRelative)!=null?p:50)*r/100,h=e+m,w=t+d;s=ct([1,0,0,1,h,w],ct(u,[1,0,0,1,-h,-w])),u.__parent&&(s=ct(u.__parent,s)),u.splice(0,6,...s)}return`matrix(${s.map(m=>m.toFixed(2)).join(",")})`}function Oo({left:e,top:t,width:n,height:r,isInheritingTransform:i},a){let o="",s=1;return a.transform&&(o=pt({left:e,top:t,width:n,height:r},a.transform,i,a.transformOrigin)),a.opacity!==void 0&&(s=+a.opacity),{matrix:o,opacity:s}}function Kr({id:e,content:t,filter:n,left:r,top:i,width:a,height:o,matrix:s,opacity:u,image:l,clipPathId:f,debug:p,shape:g,decorationShape:m},d){let h="";if(p&&(h=P("rect",{x:r,y:i-o,width:a,height:o,fill:"transparent",stroke:"#575eff","stroke-width":1,transform:s||void 0,"clip-path":f?`url(#${f})`:void 0})),l){let b={href:l,x:r,y:i,width:a,height:o,transform:s||void 0,"clip-path":f?`url(#${f})`:void 0,style:d.filter?`filter:${d.filter}`:void 0};return[(n?`${n}<g filter="url(#satori_s-${e})">`:"")+P("image",{...b,opacity:u!==1?u:void 0})+(m||"")+(n?"</g>":"")+h,""]}let w={x:r,y:i,width:a,height:o,"font-weight":d.fontWeight,"font-style":d.fontStyle,"font-size":d.fontSize,"font-family":d.fontFamily,"letter-spacing":d.letterSpacing||void 0,transform:s||void 0,"clip-path":f?`url(#${f})`:void 0,style:d.filter?`filter:${d.filter}`:void 0};return[(n?`${n}<g filter="url(#satori_s-${e})">`:"")+P("text",{...w,fill:d.color,opacity:u!==1?u:void 0},t)+(m||"")+(n?"</g>":"")+h,g?P("text",w,t):""]}c();function el(e,t,n){return e.replace(/([MA])([0-9.-]+),([0-9.-]+)/g,function(r,i,a,o){return i+(parseFloat(a)+t)+","+(parseFloat(o)+n)})}function Po({id:e,width:t,height:n},r){if(!r.shadowColor||!r.shadowOffset||typeof r.shadowRadius>"u")return"";let i=r.shadowRadius*r.shadowRadius/4,a=Math.min(r.shadowOffset.width-i,0),o=Math.max(r.shadowOffset.width+i+t,t),s=Math.min(r.shadowOffset.height-i,0),u=Math.max(r.shadowOffset.height+i+n,n);return`<defs><filter id="satori_s-${e}" x="${a/t*100}%" y="${s/n*100}%" width="${(o-a)/t*100}%" height="${(u-s)/n*100}%"><feDropShadow dx="${r.shadowOffset.width}" dy="${r.shadowOffset.height}" stdDeviation="${r.shadowRadius/2}" flood-color="${r.shadowColor}" flood-opacity="1"/></filter></defs>`}function Ao({width:e,height:t,shape:n,opacity:r,id:i},a){if(!a.boxShadow)return null;let o="",s="";for(let u=a.boxShadow.length-1;u>=0;u--){let l="",f=a.boxShadow[u];f.spreadRadius&&f.inset&&(f.spreadRadius=-f.spreadRadius);let p=f.blurRadius*f.blurRadius/4+(f.spreadRadius||0),g=Math.min(-p-(f.inset?f.offsetX:0),0),m=Math.max(p+e-(f.inset?f.offsetX:0),e),d=Math.min(-p-(f.inset?f.offsetY:0),0),h=Math.max(p+t-(f.inset?f.offsetY:0),t),w=`satori_s-${i}-${u}`,b=`satori_ms-${i}-${u}`,_=f.spreadRadius?n.replace('stroke-width="0"',`stroke-width="${f.spreadRadius*2}"`):n;l+=P("mask",{id:b,maskUnits:"userSpaceOnUse"},P("rect",{x:0,y:0,width:a._viewportWidth,height:a._viewportHeight,fill:f.inset?"#000":"#fff"})+_.replace('fill="#fff"',f.inset?'fill="#fff"':'fill="#000"').replace('stroke="#fff"',""));let T=_.replace(/d="([^"]+)"/,(I,C)=>'d="'+el(C,f.offsetX,f.offsetY)+'"').replace(/x="([^"]+)"/,(I,C)=>'x="'+(parseFloat(C)+f.offsetX)+'"').replace(/y="([^"]+)"/,(I,C)=>'y="'+(parseFloat(C)+f.offsetY)+'"');f.spreadRadius&&f.spreadRadius<0&&(l+=P("mask",{id:b+"-neg",maskUnits:"userSpaceOnUse"},T.replace('stroke="#fff"','stroke="#000"').replace(/stroke-width="[^"]+"/,`stroke-width="${-f.spreadRadius*2}"`))),f.spreadRadius&&f.spreadRadius<0&&(T=P("g",{mask:`url(#${b}-neg)`},T)),l+=P("defs",{},P("filter",{id:w,x:`${g/e*100}%`,y:`${d/t*100}%`,width:`${(m-g)/e*100}%`,height:`${(h-d)/t*100}%`},P("feGaussianBlur",{stdDeviation:f.blurRadius/2,result:"b"})+P("feFlood",{"flood-color":f.color,in:"SourceGraphic",result:"f"})+P("feComposite",{in:"f",in2:"b",operator:f.inset?"out":"in"})))+P("g",{mask:`url(#${b})`,filter:`url(#${w})`,opacity:r},T),f.inset?s+=l:o+=l}return[o,s]}c();function Zr({width:e,left:t,top:n,ascender:r,clipPathId:i},a){let{textDecorationColor:o,textDecorationStyle:s,textDecorationLine:u,fontSize:l}=a;if(!u||u==="none")return"";let f=Math.max(1,l*.1),p=u==="line-through"?n+r*.5:u==="underline"?n+r*1.1:n,g=s==="dashed"?`${f*1.2} ${f*2}`:s==="dotted"?`0 ${f*2}`:void 0;return P("line",{x1:t,y1:p,x2:t+e,y2:p,stroke:o,"stroke-width":f,"stroke-dasharray":g,"stroke-linecap":s==="dotted"?"round":"square","clip-path":i?`url(#${i})`:void 0})}var en=void 0;async function*tn(e,t){var oo;let n=Ae(),{parentStyle:r,inheritedStyle:i,parent:a,font:o,id:s,isInheritingTransform:u,debug:l,embedFont:f,graphemeImages:p,canLoadAdditionalAssets:g}=t;r.textTransform==="uppercase"?e=e.toLocaleUpperCase(en):r.textTransform==="lowercase"?e=e.toLocaleLowerCase(en):r.textTransform==="capitalize"&&(e=Ge(e,"word").map(X=>Ge(X,"grapheme").map((J,K)=>K===0?J.toLocaleUpperCase(en):J).join("")).join(""));let m=ae(r.wordBreak,{normal:"word","break-all":"grapheme","break-word":"grapheme","keep-all":"word"},"word","wordBreak"),d=Ge(e,m),h=n.Node.create();h.setAlignItems(n.ALIGN_BASELINE),h.setJustifyContent(ae(r.textAlign,{left:n.JUSTIFY_FLEX_START,right:n.JUSTIFY_FLEX_END,center:n.JUSTIFY_CENTER,justify:n.JUSTIFY_SPACE_BETWEEN,start:n.JUSTIFY_FLEX_START,end:n.JUSTIFY_FLEX_END},n.JUSTIFY_FLEX_START,"textAlign")),a.insertChild(h,a.getChildCount());let{textAlign:w,textOverflow:b,whiteSpace:_,lineHeight:T,filter:I,_inheritedBackgroundClipTextPath:C}=r,M=r.fontSize,D=o.getEngine(M,T,r),F=g?d.filter(X=>!D.has(X)):[];yield F,F.length&&(D=o.getEngine(M,T,r));let W=[],G=[],q=[],N=[],$=new Map,B=X=>{let J=0;for(let K of X){if($.has(K)){J+=$.get(K);continue}let ue=D.measure(K,r);$.set(K,ue),J+=ue}return J},Q=0,se=[],L=0;for(let X of d){let J=!1,K=p&&p[X];_==="pre"?J=X[0]===`
`:_!=="nowrap"&&(K||ur.includes(X[0]))&&(J=!0),J?(_==="nowrap"?L+=B(se)+r.fontSize:(Q=Math.max(Q,B(se)),K&&(Q=Math.max(Q,r.fontSize))),se=[]):(!ur.includes(X[0])||!se.length)&&se.push(X===`
`?" ":X)}Q=Math.max(Q,B(se)+L);let A=a.getMinWidth(),j=a.getMaxWidth(),Se=a.getWidth();isNaN(Se.value)&&(isNaN(A.value)||A.unit===1&&A.value>Q)&&(isNaN(j.value)||j.unit===1&&(Q=Math.min(Q,j.value)),a.setMinWidth(Q)),typeof r.flexShrink>"u"&&a.setFlexShrink(1);let Dr=_==="pre-wrap"||_==="pre";h.setMeasureFunc(X=>{let J=0,K="",ue=0,de=0,pe=0,he=-1,Be=0,te=0,Ue=0;W=[],q=[0];for(let De=0;De<d.length;De++){let ie=d[De];if(!Dr&&ur.includes(ie[0]))K||(K=" "),ue=B([K]),N[De]=null;else{let Fe=Dr&&ie===`
`,me=Fe?0:p&&p[ie]?r.fontSize:B([ie]);Fe&&te===0&&(te=D.height(ie)),de||(K="",ue=0);let oe=ue||",.!?:-@)>]}%#".indexOf(ie[0])<0,ge=!de||!!ue;if(Fe||De&&oe&&de+ue+me>X&&_!=="nowrap"&&_!=="pre")W.push(de),G.push(Ue),J++,Be+=te,de=me,te=me?D.height(ie):0,Ue=me?D.baseline(ie):0,q.push(1),he=-1,Fe||(pe=Math.max(pe,X));else{de+=ue+me;let et=D.height(ie);et>te&&(te=et,Ue=D.baseline(ie)),ge&&q[q.length-1]++}K="",ue=0,ge&&he++,pe=Math.max(pe,de),N[De]={y:Be,x:de-me,width:me,line:J,lineIndex:he}}}return de&&(J++,W.push(de),G.push(Ue),Be+=te),{width:pe,height:Be}});let[ut,vu]=yield,Fr="",Zt="",Ce=i._inheritedClipPathId,Zi=i._inheritedMaskId,{left:eo,top:to,width:er,height:ro}=h.getComputedLayout(),Mr=a.getComputedWidth()-a.getComputedPadding(n.EDGE_LEFT)-a.getComputedPadding(n.EDGE_RIGHT)-a.getComputedBorder(n.EDGE_LEFT)-a.getComputedBorder(n.EDGE_RIGHT),Ke=ut+eo,Ze=vu+to,{matrix:Pe,opacity:tr}=Oo({left:eo,top:to,width:er,height:ro,isInheritingTransform:u},r),rr="";r.textShadowOffset&&(rr=Po({width:er,height:ro,id:s},{shadowColor:r.textShadowColor,shadowOffset:r.textShadowOffset,shadowRadius:r.textShadowRadius}));let lt="",nr="",no="",Nr=-1,io=b==="ellipsis"?B(["\u2026"]):0,bu=b==="ellipsis"?B([" "]):0,ir={};for(let X=0;X<d.length;X++){if(!N[X])continue;let J=N[X],K=d[X],ue=null,de=p?p[K]:null,pe=J.y,he=J.x,Be=J.width,te=J.line;if(te===Nr)continue;let Ue=!1;if(W.length>1){let oe=er-W[te];if(w==="right"||w==="end")he+=oe;else if(w==="center")he+=oe/2;else if(w==="justify"&&te<W.length-1){let ge=q[te];he+=(ge>1?oe/(ge-1):0)*J.lineIndex,Ue=!0}}if(ir[te]||(ir[te]=[he,Ue?er:W[te]]),b==="ellipsis"&&W[te]>Mr&&J.x+Be+io+bu>Mr){let oe=Ge(K,"grapheme"),ge="",et=0;for(let ao of oe){let so=J.x+B([ge+ao]);if(ge&&so+io>Mr)break;ge+=ao,et=so}K=ge+"\u2026",Nr=te,ir[te][1]=et}let De=G[te],ie=D.baseline(K),Fe=D.height(K),me=De-ie;if(de?pe+=0:f?(ue=D.getSVG(K,{...r,left:Ke+he,top:Ze+pe+ie+me,letterSpacing:r.letterSpacing}),l&&(no+=P("rect",{x:Ke+he,y:Ze+pe+me,width:J.width,height:Fe,fill:"transparent",stroke:"#575eff","stroke-width":1,transform:Pe||void 0,"clip-path":Ce?`url(#${Ce})`:void 0})+P("line",{x1:Ke+he,x2:Ke+he+J.width,y1:Ze+pe+me+ie,y2:Ze+pe+me+ie,stroke:"#14c000","stroke-width":1,transform:Pe||void 0,"clip-path":Ce?`url(#${Ce})`:void 0}))):pe+=ie+me,r.textDecorationLine&&(te!==((oo=N[X+1])==null?void 0:oo.line)||Nr===te)){let oe=ir[te];oe&&!oe[2]&&(lt+=Zr({left:Ke+oe[0],top:Ze+Fe*+te,width:oe[1],ascender:D.baseline(K),clipPathId:Ce},r),oe[2]=1)}if(ue!==null)nr+=ue+" ";else{let[oe,ge]=Kr({content:K,filter:rr,id:s,left:Ke+he,top:Ze+pe,width:Be,height:Fe,matrix:Pe,opacity:tr,image:de,clipPathId:Ce,debug:l,shape:!!C,decorationShape:lt},r);Fr+=oe,Zt+=ge,lt=""}}if(nr){let X=r.color!=="transparent"&&tr!==0?P("path",{fill:r.color,d:nr,transform:Pe||void 0,opacity:tr!==1?tr:void 0,"clip-path":Ce?`url(#${Ce})`:void 0,mask:Zi?`url(#${Zi})`:void 0,style:I?`filter:${I}`:void 0}):"";C&&(Zt=P("path",{d:nr,transform:Pe||void 0})),Fr+=(rr?rr+P("g",{filter:`url(#satori_s-${s})`},X+lt):X+lt)+no}return Zt&&(r._inheritedBackgroundClipTextPath.value+=Zt),Fr}c();c();c();var rn=rn||{},Ro={type:"directional",value:"bottom"};rn.parse=function(){var e={linearGradient:/^(\-(webkit|o|ms|moz)\-)?(linear\-gradient)/i,repeatingLinearGradient:/^(\-(webkit|o|ms|moz)\-)?(repeating\-linear\-gradient)/i,radialGradient:/^(\-(webkit|o|ms|moz)\-)?(radial\-gradient)/i,repeatingRadialGradient:/^(\-(webkit|o|ms|moz)\-)?(repeating\-radial\-gradient)/i,sideOrCorner:/^to (left (top|bottom)|right (top|bottom)|top (left|right)|bottom (left|right)|left|right|top|bottom)/i,extentKeywords:/^(closest\-side|closest\-corner|farthest\-side|farthest\-corner|contain|cover)/,positionKeywords:/^(left|center|right|top|bottom)/i,pixelValue:/^(-?(([0-9]*\.[0-9]+)|([0-9]+\.?)))px/,percentageValue:/^(-?(([0-9]*\.[0-9]+)|([0-9]+\.?)))\%/,emValue:/^(-?(([0-9]*\.[0-9]+)|([0-9]+\.?)))em/,angleValue:/^(-?(([0-9]*\.[0-9]+)|([0-9]+\.?)))deg/,startCall:/^\(/,endCall:/^\)/,comma:/^,/,hexColor:/^\#([0-9a-fA-F]+)/,literalColor:/^([a-zA-Z]+)/,rgbColor:/^rgb/i,rgbaColor:/^rgba/i,number:/^(([0-9]*\.[0-9]+)|([0-9]+\.?))/},t="";function n(L){var A=new Error(t+": "+L);throw A.source=t,A}function r(){var L=i();return t.length>0&&n("Invalid input not EOF"),L}function i(){return T(a)}function a(){return o("linear-gradient",e.linearGradient,u,Ro)||o("repeating-linear-gradient",e.repeatingLinearGradient,u,Ro)||o("radial-gradient",e.radialGradient,p)||o("repeating-radial-gradient",e.repeatingRadialGradient,p)}function o(L,A,j,Se){return s(A,function(Dr){var ut=j();return ut?Q(e.comma)||n("Missing comma before color stops"):ut=Se,{type:L,orientation:ut,colorStops:T(I)}})}function s(L,A){var j=Q(L);if(j){Q(e.startCall)||n("Missing (");var Se=A(j);return Q(e.endCall)||n("Missing )"),Se}}function u(){return l()||f()}function l(){return B("directional",e.sideOrCorner,1)}function f(){return B("angular",e.angleValue,1)}function p(){var L,A=g(),j;return A&&(L=[],L.push(A),j=t,Q(e.comma)&&(A=g(),A?L.push(A):t=j)),L}function g(){var L=m()||d();if(L)L.at=w();else{var A=h();if(A){L=A;var j=w();j&&(L.at=j)}else{var Se=b();Se&&(L={type:"default-radial",at:Se})}}return L}function m(){var L=B("shape",/^(circle)/i,0);return L&&(L.style=$()||h()),L}function d(){var L=B("shape",/^(ellipse)/i,0);return L&&(L.style=q()||h()),L}function h(){return B("extent-keyword",e.extentKeywords,1)}function w(){if(B("position",/^at/,0)){var L=b();return L||n("Missing positioning value"),L}}function b(){var L=_();if(L.x||L.y)return{type:"position",value:L}}function _(){return{x:q(),y:q()}}function T(L){var A=L(),j=[];if(A)for(j.push(A);Q(e.comma);)A=L(),A?j.push(A):n("One extra comma");return j}function I(){var L=C();return L||n("Expected color definition"),L.length=q(),L}function C(){return D()||W()||F()||M()}function M(){return B("literal",e.literalColor,0)}function D(){return B("hex",e.hexColor,1)}function F(){return s(e.rgbColor,function(){return{type:"rgb",value:T(G)}})}function W(){return s(e.rgbaColor,function(){return{type:"rgba",value:T(G)}})}function G(){return Q(e.number)[1]}function q(){return B("%",e.percentageValue,1)||N()||$()}function N(){return B("position-keyword",e.positionKeywords,1)}function $(){return B("px",e.pixelValue,1)||B("em",e.emValue,1)}function B(L,A,j){var Se=Q(A);if(Se)return{type:L,value:Se[j]}}function Q(L){var A,j;return j=/^[\n\r\t\s]+/.exec(t),j&&se(j[0].length),A=L.exec(t),A&&se(A[0].length),A}function se(L){t=t.substr(L)}return function(L){return t=L.toString(),r()}}();var nn=rn;function tl(e){return e.type==="literal"?e.value:e.type==="hex"?`#${e.value}`:e.type==="rgb"?`rgb(${e.value.join(",")})`:e.type==="rgba"?`rgba(${e.value.join(",")})`:"transparent"}function rl(e,t){return typeof e=="string"&&e.endsWith("%")?t*parseFloat(e)/100:+e}function on(e,{x:t,y:n,defaultX:r,defaultY:i}){return(e?e.split(" ").map(a=>{try{let o=new Me(a);return o.type==="length"||o.type==="number"?o.value:o.value+o.unit}catch{return null}}).filter(a=>a!==null):[r,i]).map((a,o)=>rl(a,[t,n][o]))}function Io(e,t){let n=[];for(let o of t){let s=tl(o);if(!n.length&&(n.push({offset:0,color:s}),typeof o.length>"u"||o.length.value==="0"))continue;let u=typeof o.length>"u"?void 0:o.length.type==="%"?o.length.value/100:o.length.value/e;n.push({offset:u,color:s})}n.length||n.push({offset:0,color:"transparent"});let r=n[n.length-1];r.offset!==1&&(typeof r.offset>"u"?r.offset=1:n.push({offset:1,color:r.color}));let i=0,a=1;for(let o=0;o<n.length;o++)if(typeof n[o].offset>"u"){for(a<o&&(a=o);typeof n[a].offset>"u";)a++;n[o].offset=(n[a].offset-n[i].offset)/(a-i)*(o-i)+n[i].offset}else i=o;return n}async function an({id:e,width:t,height:n,left:r,top:i},{image:a,size:o,position:s,repeat:u}){u=u||"repeat";let l=u==="repeat-x"||u==="repeat",f=u==="repeat-y"||u==="repeat",p=on(o,{x:t,y:n,defaultX:t,defaultY:n}),g=on(s,{x:t,y:n,defaultX:0,defaultY:0});if(a.startsWith("linear-gradient(")){let m=nn.parse(a)[0],[d,h]=p,w,b,_,T;if(m.orientation.type==="directional")[w,b,_,T]={top:[0,1,0,0],bottom:[0,0,0,1],left:[1,0,0,0],right:[0,0,1,0]}[m.orientation.value];else if(m.orientation.type==="angular"){let F=+m.orientation.value/180*Math.PI-Math.PI/2,W=Math.cos(F),G=Math.sin(F);w=0,b=0,_=W,T=G,_<0&&(w-=_,_=0),T<0&&(b-=T,T=0)}let I=Io(t,m.colorStops),C=`satori_bi${e}`,M=`satori_pattern_${e}`,D=P("pattern",{id:M,x:g[0]/t,y:g[1]/n,width:l?d/t:"1",height:f?h/n:"1",patternUnits:"objectBoundingBox"},P("linearGradient",{id:C,x1:w,y1:b,x2:_,y2:T},I.map(F=>P("stop",{offset:F.offset*100+"%","stop-color":F.color})).join(""))+P("rect",{x:0,y:0,width:d,height:h,fill:`url(#${C})`}));return[M,D]}if(a.startsWith("radial-gradient(")){let m=nn.parse(a)[0],d=m.orientation[0],[h,w]=p,b="circle",_=h/2,T=w/2;if(d.type==="shape"){if(b=d.value,d.at)if(d.at.type==="position")_=d.at.value.x.value,T=d.at.value.y.value;else throw new Error("orientation.at.type not implemented: "+d.at.type)}else throw new Error("orientation.type not implemented: "+d.type);let I=Io(t,m.colorStops),C=`satori_radial_${e}`,M=`satori_pattern_${e}`,D=`satori_mask_${e}`,F={},W=Math.max(Math.abs(h-_),Math.abs(_)),G=Math.max(Math.abs(w-T),Math.abs(T));if(b==="circle")F.r=Math.sqrt(W*W+G*G);else if(b==="ellipse"){let $=G!==0?W/G:1;F.ry=Math.sqrt(W*W+G*G*$*$)/$,F.rx=F.ry*$}let q=P("pattern",{id:M,x:g[0]/t,y:g[1]/n,width:l?h/t:"1",height:f?w/n:"1",patternUnits:"objectBoundingBox"},P("radialGradient",{id:C},I.map($=>P("stop",{offset:$.offset,"stop-color":$.color})).join(""))+P("mask",{id:D},P("rect",{x:0,y:0,width:h,height:w,fill:"#fff"}))+P(b,{cx:_,cy:T,width:h,height:w,...F,fill:`url(#${C})`,mask:`url(#${D})`}));return[M,q]}if(a.startsWith("url(")){let m=on(o,{x:t,y:n,defaultX:0,defaultY:0}),[d,h,w]=await fr(a.slice(4,-1)),b=m[0]||h,_=m[1]||w;return[`satori_bi${e}`,P("pattern",{id:`satori_bi${e}`,patternContentUnits:"userSpaceOnUse",patternUnits:"userSpaceOnUse",x:g[0]+r,y:g[1]+i,width:l?b:"100%",height:f?_:"100%"},P("image",{x:0,y:0,width:b,height:_,preserveAspectRatio:"none",href:d}))]}throw new Error(`Invalid background image: "${a}"`)}c();function nl([e,t]){return Math.round(e*1e3)===0&&Math.round(t*1e3)===0?0:Math.round(e*t/Math.sqrt(e*e+t*t)*1e3)/1e3}function cr(e,t,n){return n<e+t&&(n/2<e&&n/2<t?e=t=n/2:n/2<e?e=n-t:n/2<t&&(t=n-e)),[e,t]}function dr(e){e[0]=e[1]=Math.min(e[0],e[1])}function pr(e,t,n,r,i){if(typeof e=="string"){let a=e.split(" ").map(s=>s.trim()),o=!a[1]&&!a[0].endsWith("%");return a[1]=a[1]||a[0],[o,[Math.min(ze(a[0],r,t,i,!0),t),Math.min(ze(a[1],r,n,i,!0),n)]]}return typeof e=="number"?[!0,[Math.min(e,t),Math.min(e,n)]]:[!0,void 0]}function tt({left:e,top:t,width:n,height:r},i,a){let{borderTopLeftRadius:o,borderTopRightRadius:s,borderBottomLeftRadius:u,borderBottomRightRadius:l,fontSize:f}=i,p,g,m,d;if([p,o]=pr(o,n,r,f,i),[g,s]=pr(s,n,r,f,i),[m,u]=pr(u,n,r,f,i),[d,l]=pr(l,n,r,f,i),!a&&!o&&!s&&!u&&!l)return"";o||(o=[0,0]),s||(s=[0,0]),u||(u=[0,0]),l||(l=[0,0]),[o[0],s[0]]=cr(o[0],s[0],n),[u[0],l[0]]=cr(u[0],l[0],n),[o[1],u[1]]=cr(o[1],u[1],r),[s[1],l[1]]=cr(s[1],l[1],r),p&&dr(o),g&&dr(s),m&&dr(u),d&&dr(l);let h=[];h[0]=[s,s],h[1]=[l,[-l[0],l[1]]],h[2]=[u,[-u[0],-u[1]]],h[3]=[o,[o[0],-o[1]]];let w=`h${n-o[0]-s[0]} a${h[0][0]} 0 0 1 ${h[0][1]}`,b=`v${r-s[1]-l[1]} a${h[1][0]} 0 0 1 ${h[1][1]}`,_=`h${l[0]+u[0]-n} a${h[2][0]} 0 0 1 ${h[2][1]}`,T=`v${u[1]+o[1]-r} a${h[3][0]} 0 0 1 ${h[3][1]}`;if(a){let C=function(N){let $=nl([o,s,l,u][N]);return N===0?[[e+o[0]-$,t+o[1]-$],[e+o[0],t]]:N===1?[[e+n-s[0]+$,t+s[1]-$],[e+n,t+s[1]]]:N===2?[[e+n-l[0]+$,t+r-l[1]+$],[e+n-l[0],t+r]]:[[e+u[0]-$,t+r-u[1]+$],[e,t+r-u[1]]]},I=a.indexOf(!1);if(!a.includes(!0))throw new Error("Invalid `partialSides`.");if(I===-1)I=0;else for(;!a[I];)I=(I+1)%4;let M="",D=C(I),F=`M${D[0]} A${h[(I+3)%4][0]} 0 0 1 ${D[1]}`,W=0;for(;W<4&&a[(I+W)%4];W++)M+=F+" ",F=[w,b,_,T][(I+W)%4];let G=(I+W)%4;M+=F.split(" ")[0];let q=C(G);return M+=` A${h[(G+3)%4][0]} 0 0 1 ${q[0]}`,M}return`M${e+o[0]},${t} ${w} ${b} ${_} ${T}`}c();c();c();function Lo(e,t,n){return n[e+"Width"]===n[t+"Width"]&&n[e+"Style"]===n[t+"Style"]&&n[e+"Color"]===n[t+"Color"]}function Co({id:e,currentClipPathId:t,borderPath:n,borderType:r,left:i,top:a,width:o,height:s},u){if(!(u.borderTopWidth||u.borderRightWidth||u.borderBottomWidth||u.borderLeftWidth))return null;let f=`satori_bc-${e}`;return[P("clipPath",{id:f,"clip-path":t?`url(#${t})`:void 0},P(r,{x:i,y:a,width:o,height:s,d:n||void 0})),f]}function ht({left:e,top:t,width:n,height:r,props:i,asContentMask:a,maskBorderOnly:o},s){let u=["borderTop","borderRight","borderBottom","borderLeft"];if(!a&&!u.some(m=>s[m+"Width"]))return"";let l="",f=0;for(;f>0&&Lo(u[f],u[(f+3)%4],s);)f=(f+3)%4;let p=[!1,!1,!1,!1],g=[];for(let m=0;m<4;m++){let d=(f+m)%4,h=(f+m+1)%4,w=u[d],b=u[h];if(p[d]=!0,g=[s[w+"Width"],s[w+"Style"],s[w+"Color"],w],!Lo(w,b,s)){let _=(g[0]||0)+(a&&!o&&s[w.replace("border","padding")]||0);_&&(l+=P("path",{width:n,height:r,...i,fill:"none",stroke:a?"#000":g[2],"stroke-width":_*2,"stroke-dasharray":!a&&g[1]==="dashed"?_*2+" "+_:void 0,d:tt({left:e,top:t,width:n,height:r},s,p)})),p=[!1,!1,!1,!1]}}if(p.some(Boolean)){let m=(g[0]||0)+(a&&!o&&s[g[3].replace("border","padding")]||0);m&&(l+=P("path",{width:n,height:r,...i,fill:"none",stroke:a?"#000":g[2],"stroke-width":m*2,"stroke-dasharray":!a&&g[1]==="dashed"?m*2+" "+m:void 0,d:tt({left:e,top:t,width:n,height:r},s,p)}))}return l}function sn({id:e,left:t,top:n,width:r,height:i,matrix:a,borderOnly:o},s){let u=(s.borderLeftWidth||0)+(o?0:s.paddingLeft||0),l=(s.borderTopWidth||0)+(o?0:s.paddingTop||0),f=(s.borderRightWidth||0)+(o?0:s.paddingRight||0),p=(s.borderBottomWidth||0)+(o?0:s.paddingBottom||0),g={x:t+u,y:n+l,width:r-u-f,height:i-l-p};return P("mask",{id:e},P("rect",{...g,fill:"#fff",mask:s._inheritedMaskId?`url(#${s._inheritedMaskId})`:void 0})+ht({left:t,top:n,width:r,height:i,props:{transform:a||void 0},asContentMask:!0,maskBorderOnly:o},s))}function un({left:e,top:t,width:n,height:r,path:i,matrix:a,id:o,currentClipPath:s,src:u},l){if(l.overflow!=="hidden"&&!u)return"";let f=sn({id:`satori_om-${o}`,left:e,top:t,width:n,height:r,matrix:a,borderOnly:!u},l);return P("clipPath",{id:`satori_cp-${o}`,"clip-path":s},P(i?"path":"rect",{x:e,y:t,width:n,height:r,d:i||void 0}))+f}async function mt({id:e,left:t,top:n,width:r,height:i,isInheritingTransform:a,src:o,debug:s},u){if(u.display==="none")return"";let l=!!o,f="rect",p="",g="",m=[],d=1,h="";u.backgroundColor&&m.push(u.backgroundColor),u.opacity!==void 0&&(d=+u.opacity),u.transform&&(p=pt({left:t,top:n,width:r,height:i},u.transform,a,u.transformOrigin));let w="";if(u.backgroundImage){let q=[];for(let N=0;N<u.backgroundImage.length;N++){let $=u.backgroundImage[N],B=await an({id:e+"_"+N,width:r,height:i,left:t,top:n},$);B&&q.unshift(B)}for(let N of q)m.push(`url(#${N[0]})`),g+=N[1],N[2]&&(w+=N[2])}let b=tt({left:t,top:n,width:r,height:i},u);b&&(f="path");let _=u._inheritedClipPathId,T=u._inheritedMaskId;s&&(h=P("rect",{x:t,y:n,width:r,height:i,fill:"transparent",stroke:"#ff5757","stroke-width":1,transform:p||void 0,"clip-path":_?`url(#${_})`:void 0}));let{backgroundClip:I,filter:C}=u,M=I==="text"?`url(#satori_bct-${e})`:_?`url(#${_})`:void 0,D=un({left:t,top:n,width:r,height:i,path:b,id:e,matrix:p,currentClipPath:M,src:o},u),F=m.map(q=>P(f,{x:t,y:n,width:r,height:i,fill:q,d:b||void 0,transform:p||void 0,"clip-path":M,style:C?`filter:${C}`:void 0,mask:T?`url(#${T})`:void 0})).join(""),W=Co({id:e,left:t,top:n,width:r,height:i,currentClipPathId:_,borderPath:b,borderType:f},u);if(l){let q=(u.borderLeftWidth||0)+(u.paddingLeft||0),N=(u.borderTopWidth||0)+(u.paddingTop||0),$=(u.borderRightWidth||0)+(u.paddingRight||0),B=(u.borderBottomWidth||0)+(u.paddingBottom||0),Q=u.objectFit==="contain"?"xMidYMid":u.objectFit==="cover"?"xMidYMid slice":"none";F+=P("image",{x:t+q,y:n+N,width:r-q-$,height:i-N-B,href:o,preserveAspectRatio:Q,transform:p||void 0,style:C?`filter:${C}`:void 0,"clip-path":`url(#satori_cp-${e})`,mask:`url(#satori_om-${e})`})}if(W){g+=W[0];let q=W[1];F+=ht({left:t,top:n,width:r,height:i,props:{transform:p||void 0,"clip-path":`url(#${q})`}},u)}let G=Ao({width:r,height:i,id:e,opacity:d,shape:P(f,{x:t,y:n,width:r,height:i,fill:"#fff",stroke:"#fff","stroke-width":0,d:b||void 0,transform:p||void 0,"clip-path":M,mask:T?`url(#${T})`:void 0})},u);return(g?P("defs",{},g):"")+(G?G[0]:"")+D+(d!==1?`<g opacity="${d}">`:"")+(w||F)+(d!==1?"</g>":"")+(G?G[1]:"")+h}async function*gt(e,t){let n=Ae(),{id:r,inheritedStyle:i,parent:a,font:o,debug:s,embedFont:u=!0,graphemeImages:l,canLoadAdditionalAssets:f,getTwStyles:p}=t;if(e===null||typeof e>"u")return yield,yield,"";if(!jr(e)||typeof e.type=="function"){let A;if(!jr(e))A=tn(String(e),t),yield(await A.next()).value;else{if(vo(e.type))throw new Error("Class component is not supported.");A=gt(e.type(e.props),t),yield(await A.next()).value}await A.next();let j=yield;return(await A.next(j)).value}let{type:g,props:m}=e,{style:d,children:h,tw:w}=m||{};if(w){let A=p(w,d);d=Object.assign(A,d)}let b=n.Node.create();a.insertChild(b,a.getChildCount());let[_,T]=await Jr(b,g,i,d,m),I=_.transform===i.transform;if(I||(_.transform.__parent=i.transform),_.overflow==="hidden"&&(T._inheritedClipPathId=`satori_cp-${r}`,T._inheritedMaskId=`satori_om-${r}`),_.backgroundClip==="text"){let A={value:""};T._inheritedBackgroundClipTextPath=A,_._inheritedBackgroundClipTextPath=A}let C=bo(h),M=[],D=0,F=[];for(let A of C){let j=gt(A,{id:r+"-"+D++,parentStyle:_,inheritedStyle:T,isInheritingTransform:!0,parent:b,font:o,embedFont:u,debug:s,graphemeImages:l,canLoadAdditionalAssets:f,getTwStyles:p});f?F.push(...(await j.next()).value||[]):await j.next(),M.push(j)}yield F;for(let A of M)await A.next();let[W,G]=yield,{left:q,top:N,width:$,height:B}=b.getComputedLayout();q+=W,N+=G;let Q="",se="",L="";if(g==="img"){let A=_.__src;se=await mt({id:r,left:q,top:N,width:$,height:B,src:A,isInheritingTransform:I,debug:s},_)}else if(g==="svg"){let A=wo(e);se=await mt({id:r,left:q,top:N,width:$,height:B,src:A,isInheritingTransform:I,debug:s},_)}else{let A=d==null?void 0:d.display;if(g==="div"&&h&&typeof h!="string"&&A!=="flex"&&A!=="none")throw new Error('Expected <div> to have explicit "display: flex" or "display: none" if it has more than one child node.');se=await mt({id:r,left:q,top:N,width:$,height:B,isInheritingTransform:I,debug:s},_)}for(let A of M)Q+=(await A.next([q,N])).value;return _._inheritedBackgroundClipTextPath&&(L+=P("clipPath",{id:`satori_bct-${r}`,"clip-path":_._inheritedClipPathId?`url(#${_._inheritedClipPathId})`:void 0},_._inheritedBackgroundClipTextPath.value)),L+se+Q}c();function il(e,t,[n,r],[i,a]){if(n!==i)return n?!i||n===e?-1:i===e?1:e===400&&n===500||e===500&&n===400?-1:e===400&&i===500||e===500&&i===400?1:e<400?n<e&&i<e?i-n:n<e?-1:i<e?1:n-i:e<n&&e<i?n-i:e<n?-1:e<i?1:i-n:1;if(r!==a){if(r===t)return-1;if(a===t)return 1}return-1}var vt=class{constructor(t){this.fonts=new Map;this.addFonts(t)}get({name:t,weight:n,style:r}){if(!this.fonts.has(t))return null;n==="normal"&&(n=400),n==="bold"&&(n=700);let i=[...this.fonts.get(t)],a=i[0];for(let o=1;o<i.length;o++){let[,s,u]=a,[,l,f]=i[o];il(n,r,[s,u],[l,f])>0&&(a=i[o])}return a[0]}addFonts(t){for(let n of t){let r=n.data,i=opentype_module.parse("buffer"in r?r.buffer.slice(r.byteOffset,r.byteOffset+r.byteLength):r,{lowMemory:!0}),a=i.charToGlyphIndex;i.charToGlyphIndex=s=>{let u=a.call(i,s);return u===0&&i._trackBrokenChars&&i._trackBrokenChars.push(s),u},this.defaultFont||(this.defaultFont=i);let o=n.name.toLowerCase();this.fonts.has(o)||this.fonts.set(o,[]),this.fonts.get(o).push([i,n.weight,n.style])}}getEngine(t=16,n=1.2,{fontFamily:r,fontWeight:i=400,fontStyle:a="normal"}){if(!this.fonts.size)throw new Error("No fonts are loaded. At least one font is required to calculate the layout.");r=(Array.isArray(r)?r:[r]).map(d=>d.toLowerCase());let o=r.map(d=>this.get({name:d,weight:i,style:a})).filter(Boolean),s=Array.from(this.fonts.keys());for(let d of s)r.includes(d)||o.push(this.get({name:d,weight:i,style:a}));let u=new Map,l=(d,h=!0)=>{let w=d.charCodeAt(0);if(u.has(w))return u.get(w);let b=o.find((_,T)=>!!_.charToGlyphIndex(d)||h&&T===o.length-1);return b&&u.set(w,b),b},f=(d,h=!1)=>{var b,_;return((h?(_=(b=d.tables)==null?void 0:b.os2)==null?void 0:_.sTypoAscender:0)||d.ascender)/d.unitsPerEm*t},p=(d,h=!1)=>{var b,_;return((h?(_=(b=d.tables)==null?void 0:b.os2)==null?void 0:_.sTypoDescender:0)||d.descender)/d.unitsPerEm*t},g=d=>l(d,!1),m={has:d=>{if(d===`
`)return!0;let h=g(d);return h?(h._trackBrokenChars=[],h.stringToGlyphs(d),h._trackBrokenChars.length?(h._trackBrokenChars=void 0,!1):!0):!1},baseline:(d,h=typeof d>"u"?o[0]:l(d))=>{let w=f(h,!0),b=p(h,!0),_=m.height(d,h),{yMax:T,yMin:I}=h.tables.head,C=w-b,M=(T/(T-I)-1)*C;return _*((1.2/n+1)/2)+M},height:(d,h=typeof d>"u"?o[0]:l(d))=>(f(h)-p(h))*(n/1.2),measure:(d,h)=>this.measure(l,d,h),getSVG:(d,h)=>this.getSVG(l,d,h)};return m}patchFontFallbackResolver(t,n){let r=[];t._trackBrokenChars=r;let i=t.stringToGlyphs;return t.stringToGlyphs=(a,...o)=>{let s=i.call(t,a,...o);for(let u=0;u<s.length;u++)if(s[u].unicode===void 0){let l=r.shift(),f=n(l);if(f!==t){let p=f.charToGlyph(l),g=t.unitsPerEm/f.unitsPerEm,m=new opentype_module.Path;m.unitsPerEm=t.unitsPerEm,m.commands=p.path.commands.map(h=>{let w={...h};for(let b in w)typeof w[b]=="number"&&(w[b]*=g);return w});let d=new opentype_module.Glyph({...p,advanceWidth:p.advanceWidth*g,xMin:p.xMin*g,xMax:p.xMax*g,yMin:p.yMin*g,yMax:p.yMax*g,path:m});s[u]=d}}return s},()=>{t.stringToGlyphs=i,t._trackBrokenChars=void 0}}measure(t,n,{fontSize:r,letterSpacing:i=0}){let a=t(n),o=this.patchFontFallbackResolver(a,t);try{return a.getAdvanceWidth(n,r,{letterSpacing:i/r})}finally{o()}}getSVG(t,n,{fontSize:r,top:i,left:a,letterSpacing:o=0}){let s=t(n),u=this.patchFontFallbackResolver(s,t);try{return r===0?"":s.getPath(n.replace(/\n/g,""),a,i,r,{letterSpacing:o/r}).toPathData(1)}finally{u()}}};c();function fn({width:e,height:t,content:n}){return P("svg",{width:e,height:t,viewBox:`0 0 ${e} ${t}`,xmlns:"http://www.w3.org/2000/svg"},n)}c();var Do={emoji:/\p{RI}\p{RI}|\p{Emoji}(\p{EMod}+|\u{FE0F}\u{20E3}?|[\u{E0020}-\u{E007E}]+\u{E007F})?(\u{200D}\p{Emoji}(\p{EMod}+|\u{FE0F}\u{20E3}?|[\u{E0020}-\u{E007E}]+\u{E007F})?)+|\p{EPres}(\p{EMod}+|\u{FE0F}\u{20E3}?|[\u{E0020}-\u{E007E}]+\u{E007F})?|\p{Emoji}(\p{EMod}+|\u{FE0F}\u{20E3}?|[\u{E0020}-\u{E007E}]+\u{E007F})|[\u{E000}-\u{F8FF}]|[\u{F0000}-\u{FFFFD}]|[\u{100000}-\u{10FFFD}]/u,ja:/\p{scx=Hira}|\p{scx=Kana}|[，；：]/u,ko:/\p{scx=Hangul}/u,zh:/\p{scx=Han}/u,th:/\p{scx=Thai}/u,bn:/\p{scx=Bengali}/u,ar:/\p{scx=Arabic}/u,ta:/\p{scx=Tamil}/u,ml:/\p{scx=Malayalam}/u,he:/\p{scx=Hebrew}/u,te:/\p{scx=Telugu}/u,devanagari:/\p{scx=Devanagari}/u};function Fo(e){for(let t in Do)if(Do[t].test(e))return t;return"unknown"}c();c();var hu=ku(js());c();c();c();c();var jh=["ios","android","windows","macos","web"];function Hs(e){return jh.includes(e)}var Vh=["portrait","landscape"];function Ys(e){return Vh.includes(e)}var Vs;(function(e){e.fontSize="fontSize",e.lineHeight="lineHeight"})(Vs||(Vs={}));var z;(function(e){e.rem="rem",e.em="em",e.px="px",e.percent="%",e.vw="vw",e.vh="vh",e.none="<no-css-unit>"})(z||(z={}));function Mi(e){return typeof e=="string"}function Ni(e){return typeof e=="object"}var Wi;function v(e){return{kind:"complete",style:e}}function re(e,t={}){let{fractions:n}=t;if(n&&e.includes("/")){let[a="",o=""]=e.split("/",2),s=re(a),u=re(o);return!s||!u?null:[s[0]/u[0],u[1]]}let r=parseFloat(e);if(Number.isNaN(r))return null;let i=e.match(/(([a-z]{2,}|%))$/);if(!i)return[r,z.none];switch(i==null?void 0:i[1]){case"rem":return[r,z.rem];case"px":return[r,z.px];case"em":return[r,z.em];case"%":return[r,z.percent];case"vw":return[r,z.vw];case"vh":return[r,z.vh];default:return null}}function Le(e,t,n={}){let r=Ee(t,n);return r===null?null:v({[e]:r})}function Ir(e,t,n){let r=Ee(t);return r!==null&&(n[e]=r),n}function Qs(e,t){let n=Ee(t);return n===null?null:{[e]:n}}function Ee(e,t={}){if(e===void 0)return null;let n=re(String(e),t);return n?qe(...n,t):null}function qe(e,t,n={}){let{isNegative:r,device:i}=n;switch(t){case z.rem:return e*16*(r?-1:1);case z.px:return e*(r?-1:1);case z.percent:return`${r?"-":""}${e}%`;case z.none:return e*(r?-1:1);case z.vw:return i!=null&&i.windowDimensions?i.windowDimensions.width*(e/100):(ce("`vw` CSS unit requires configuration with `useDeviceContext()`"),null);case z.vh:return i!=null&&i.windowDimensions?i.windowDimensions.height*(e/100):(ce("`vh` CSS unit requires configuration with `useDeviceContext()`"),null);default:return null}}function $i(e){let t=re(e);if(!t)return null;let[n,r]=t;switch(r){case z.rem:return n*16;case z.px:return n;default:return null}}var Hh={t:"Top",tr:"TopRight",tl:"TopLeft",b:"Bottom",br:"BottomRight",bl:"BottomLeft",l:"Left",r:"Right",x:"Horizontal",y:"Vertical"};function qi(e){return Hh[e!=null?e:""]||"All"}function Bi(e){let t="All";return[e.replace(/^-(t|b|r|l|tr|tl|br|bl)(-|$)/,(r,i)=>(t=qi(i),"")),t]}function Qe(e,t={}){if(e.includes("/")){let n=Xs(e,{...t,fractions:!0});if(n)return n}return e[0]==="["&&(e=e.slice(1,-1)),Xs(e,t)}function _e(e,t,n={}){let r=Qe(t,n);return r===null?null:v({[e]:r})}function Xs(e,t={}){if(e==="px")return 1;let n=re(e,t);if(!n)return null;let[r,i]=n;return t.fractions&&(i=z.percent,r*=100),i===z.none&&(r=r/4,i=z.rem),qe(r,i,t)}function Yh(...e){console.warn(...e)}function Xh(...e){}var ce=typeof process>"u"||((Wi=process==null?void 0:process.env)===null||Wi===void 0?void 0:Wi.JEST_WORKER_ID)===void 0?Yh:Xh;var Qh=[["aspect-square",v({aspectRatio:1})],["aspect-video",v({aspectRatio:16/9})],["items-center",v({alignItems:"center"})],["items-start",v({alignItems:"flex-start"})],["items-end",v({alignItems:"flex-end"})],["items-baseline",v({alignItems:"baseline"})],["items-stretch",v({alignItems:"stretch"})],["justify-start",v({justifyContent:"flex-start"})],["justify-end",v({justifyContent:"flex-end"})],["justify-center",v({justifyContent:"center"})],["justify-between",v({justifyContent:"space-between"})],["justify-around",v({justifyContent:"space-around"})],["justify-evenly",v({justifyContent:"space-evenly"})],["content-start",v({alignContent:"flex-start"})],["content-end",v({alignContent:"flex-end"})],["content-between",v({alignContent:"space-between"})],["content-around",v({alignContent:"space-around"})],["content-stretch",v({alignContent:"stretch"})],["content-center",v({alignContent:"center"})],["self-auto",v({alignSelf:"auto"})],["self-start",v({alignSelf:"flex-start"})],["self-end",v({alignSelf:"flex-end"})],["self-center",v({alignSelf:"center"})],["self-stretch",v({alignSelf:"stretch"})],["self-baseline",v({alignSelf:"baseline"})],["direction-inherit",v({direction:"inherit"})],["direction-ltr",v({direction:"ltr"})],["direction-rtl",v({direction:"rtl"})],["hidden",v({display:"none"})],["flex",v({display:"flex"})],["flex-row",v({flexDirection:"row"})],["flex-row-reverse",v({flexDirection:"row-reverse"})],["flex-col",v({flexDirection:"column"})],["flex-col-reverse",v({flexDirection:"column-reverse"})],["flex-wrap",v({flexWrap:"wrap"})],["flex-wrap-reverse",v({flexWrap:"wrap-reverse"})],["flex-nowrap",v({flexWrap:"nowrap"})],["flex-auto",v({flexGrow:1,flexShrink:1,flexBasis:"auto"})],["flex-initial",v({flexGrow:0,flexShrink:1,flexBasis:"auto"})],["flex-none",v({flexGrow:0,flexShrink:0,flexBasis:"auto"})],["overflow-hidden",v({overflow:"hidden"})],["overflow-visible",v({overflow:"visible"})],["overflow-scroll",v({overflow:"scroll"})],["absolute",v({position:"absolute"})],["relative",v({position:"relative"})],["italic",v({fontStyle:"italic"})],["not-italic",v({fontStyle:"normal"})],["oldstyle-nums",Yt("oldstyle-nums")],["small-caps",Yt("small-caps")],["lining-nums",Yt("lining-nums")],["tabular-nums",Yt("tabular-nums")],["proportional-nums",Yt("proportional-nums")],["font-thin",v({fontWeight:"100"})],["font-100",v({fontWeight:"100"})],["font-extralight",v({fontWeight:"200"})],["font-200",v({fontWeight:"200"})],["font-light",v({fontWeight:"300"})],["font-300",v({fontWeight:"300"})],["font-normal",v({fontWeight:"normal"})],["font-400",v({fontWeight:"400"})],["font-medium",v({fontWeight:"500"})],["font-500",v({fontWeight:"500"})],["font-semibold",v({fontWeight:"600"})],["font-600",v({fontWeight:"600"})],["font-bold",v({fontWeight:"bold"})],["font-700",v({fontWeight:"700"})],["font-extrabold",v({fontWeight:"800"})],["font-800",v({fontWeight:"800"})],["font-black",v({fontWeight:"900"})],["font-900",v({fontWeight:"900"})],["include-font-padding",v({includeFontPadding:!0})],["remove-font-padding",v({includeFontPadding:!1})],["max-w-none",v({maxWidth:"99999%"})],["text-left",v({textAlign:"left"})],["text-center",v({textAlign:"center"})],["text-right",v({textAlign:"right"})],["text-justify",v({textAlign:"justify"})],["text-auto",v({textAlign:"auto"})],["underline",v({textDecorationLine:"underline"})],["line-through",v({textDecorationLine:"line-through"})],["no-underline",v({textDecorationLine:"none"})],["uppercase",v({textTransform:"uppercase"})],["lowercase",v({textTransform:"lowercase"})],["capitalize",v({textTransform:"capitalize"})],["normal-case",v({textTransform:"none"})],["w-auto",v({width:"auto"})],["h-auto",v({height:"auto"})],["shadow-sm",v({shadowOffset:{width:1,height:1},shadowColor:"#000",shadowRadius:1,shadowOpacity:.025,elevation:1})],["shadow",v({shadowOffset:{width:1,height:1},shadowColor:"#000",shadowRadius:1,shadowOpacity:.075,elevation:2})],["shadow-md",v({shadowOffset:{width:1,height:1},shadowColor:"#000",shadowRadius:3,shadowOpacity:.125,elevation:3})],["shadow-lg",v({shadowOffset:{width:1,height:1},shadowColor:"#000",shadowOpacity:.15,shadowRadius:8,elevation:8})],["shadow-xl",v({shadowOffset:{width:1,height:1},shadowColor:"#000",shadowOpacity:.19,shadowRadius:20,elevation:12})],["shadow-2xl",v({shadowOffset:{width:1,height:1},shadowColor:"#000",shadowOpacity:.25,shadowRadius:30,elevation:16})],["shadow-none",v({shadowOffset:{width:0,height:0},shadowColor:"#000",shadowRadius:0,shadowOpacity:0,elevation:0})]],Ui=Qh;function Yt(e){return{kind:"dependent",complete(t){(!t.fontVariant||!Array.isArray(t.fontVariant))&&(t.fontVariant=[]),t.fontVariant.push(e)}}}var Xt=class{constructor(t){this.ir=new Map(Ui),this.styles=new Map,this.prefixes=new Map,this.ir=new Map([...Ui,...t!=null?t:[]])}getStyle(t){return this.styles.get(t)}setStyle(t,n){this.styles.set(t,n)}getIr(t){return this.ir.get(t)}setIr(t,n){this.ir.set(t,n)}getPrefixMatch(t){return this.prefixes.get(t)}setPrefixMatch(t,n){this.prefixes.set(t,n)}};c();c();function zi(e,t,n={}){let r=t==null?void 0:t[e];if(!r)return _e("fontSize",e,n);if(typeof r=="string")return Le("fontSize",r);let i={},[a,o]=r,s=Qs("fontSize",a);if(s&&(i=s),typeof o=="string")return v(Ir("lineHeight",Js(o,i),i));let{lineHeight:u,letterSpacing:l}=o;return u&&Ir("lineHeight",Js(u,i),i),l&&Ir("letterSpacing",l,i),v(i)}function Js(e,t){let n=re(e);if(n){let[r,i]=n;if((i===z.none||i===z.em)&&typeof t.fontSize=="number")return t.fontSize*r}return e}c();function Gi(e,t){var n;let r=(n=t==null?void 0:t[e])!==null&&n!==void 0?n:e.startsWith("[")?e.slice(1,-1):e,i=re(r);if(!i)return null;let[a,o]=i;if(o===z.none)return{kind:"dependent",complete(u){if(typeof u.fontSize!="number")return"relative line-height utilities require that font-size be set";u.lineHeight=u.fontSize*a}};let s=qe(a,o);return s!==null?v({lineHeight:s}):null}c();function ji(e,t,n,r,i){let a="";if(r[0]==="[")a=r.slice(1,-1);else{let l=i==null?void 0:i[r];if(l)a=l;else{let f=Qe(r);return f&&typeof f=="number"?Ks(f,z.px,t,e):null}}if(a==="auto")return Zs(t,e,"auto");let o=re(a);if(!o)return null;let[s,u]=o;return n&&(s=-s),Ks(s,u,t,e)}function Ks(e,t,n,r){let i=qe(e,t);return i===null?null:Zs(n,r,i)}function Zs(e,t,n){switch(e){case"All":return{kind:"complete",style:{[`${t}Top`]:n,[`${t}Right`]:n,[`${t}Bottom`]:n,[`${t}Left`]:n}};case"Bottom":case"Top":case"Left":case"Right":return{kind:"complete",style:{[`${t}${e}`]:n}};case"Vertical":return{kind:"complete",style:{[`${t}Top`]:n,[`${t}Bottom`]:n}};case"Horizontal":return{kind:"complete",style:{[`${t}Left`]:n,[`${t}Right`]:n}};default:return null}}c();function Vi(e){if(!e)return{};let t=Object.entries(e).reduce((i,[a,o])=>{let s=[0,1/0,0],u=typeof o=="string"?{min:o}:o,l=u.min?$i(u.min):0;l===null?ce(`invalid screen config value: ${a}->min: ${u.min}`):s[0]=l;let f=u.max?$i(u.max):1/0;return f===null?ce(`invalid screen config value: ${a}->max: ${u.max}`):s[1]=f,i[a]=s,i},{}),n=Object.values(t);n.sort((i,a)=>{let[o,s]=i,[u,l]=a;return s===1/0||l===1/0?o-u:s-l});let r=0;return n.forEach(i=>i[2]=r++),t}c();function Hi(e,t){let n=t==null?void 0:t[e];if(!n)return null;if(typeof n=="string")return v({fontFamily:n});let r=n[0];return r?v({fontFamily:r}):null}c();function Je(e,t,n){if(!n)return null;let r;t.includes("/")&&([t="",r]=t.split("/",2));let i="";if(t.startsWith("[#")||t.startsWith("[rgb")?i=t.slice(1,-1):i=ru(t,n),!i)return null;if(r){let a=Number(r);if(!Number.isNaN(a))return i=eu(i,a/100),v({[Lr[e].color]:i})}return{kind:"dependent",complete(a){let o=Lr[e].opacity,s=a[o];typeof s=="number"&&(i=eu(i,s)),a[Lr[e].color]=i}}}function Qt(e,t){let n=parseInt(t,10);if(Number.isNaN(n))return null;let r=n/100,i={[Lr[e].opacity]:r};return{kind:"complete",style:i}}function eu(e,t){return e.startsWith("#")?e=Jh(e):e.startsWith("rgb(")&&(e=e.replace(/^rgb\(/,"rgba(").replace(/\)$/,", 1)")),e.replace(/, ?\d*\.?(\d+)\)$/,`, ${t})`)}function tu(e){for(let t in e)t.startsWith("__opacity_")&&delete e[t]}var Lr={bg:{opacity:"__opacity_bg",color:"backgroundColor"},text:{opacity:"__opacity_text",color:"color"},border:{opacity:"__opacity_border",color:"borderColor"},borderTop:{opacity:"__opacity_border",color:"borderTopColor"},borderBottom:{opacity:"__opacity_border",color:"borderBottomColor"},borderLeft:{opacity:"__opacity_border",color:"borderLeftColor"},borderRight:{opacity:"__opacity_border",color:"borderRightColor"},shadow:{opacity:"__opacity_shadow",color:"shadowColor"},tint:{opacity:"__opacity_tint",color:"tintColor"}};function Jh(e){let t=e;e=e.replace(Kh,(o,s,u,l)=>s+s+u+u+l+l);let n=Zh.exec(e);if(!n)return ce(`invalid config hex color value: ${t}`),"rgba(0, 0, 0, 1)";let r=parseInt(n[1],16),i=parseInt(n[2],16),a=parseInt(n[3],16);return`rgba(${r}, ${i}, ${a}, 1)`}function ru(e,t){let n=t[e];if(Mi(n))return n;if(Ni(n)&&Mi(n.DEFAULT))return n.DEFAULT;let[r="",...i]=e.split("-");for(;r!==e;){let a=t[r];if(Ni(a))return ru(i.join("-"),a);if(i.length===0)return"";r=`${r}-${i.shift()}`}return""}var Kh=/^#?([a-f\d])([a-f\d])([a-f\d])$/i,Zh=/^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i;c();function iu(e,t){let[n,r]=Bi(e);if(n.match(/^(-?(\d)+)?$/))return e0(n,r,t==null?void 0:t.borderWidth);if(n=n.replace(/^-/,""),["dashed","solid","dotted"].includes(n))return v({borderStyle:n});let a="border";switch(r){case"Bottom":a="borderBottom";break;case"Top":a="borderTop";break;case"Left":a="borderLeft";break;case"Right":a="borderRight";break}let o=Je(a,n,t==null?void 0:t.borderColor);if(o)return o;let s=`border${r==="All"?"":r}Width`;n=n.replace(/^-/,"");let u=n.slice(1,-1),l=_e(s,u);return typeof(l==null?void 0:l.style[s])!="number"?null:l}function e0(e,t,n){if(!n)return null;e=e.replace(/^-/,"");let i=n[e===""?"DEFAULT":e];if(i===void 0)return null;let a=`border${t==="All"?"":t}Width`;return Le(a,i)}function ou(e,t){if(!t)return null;let[n,r]=Bi(e);n=n.replace(/^-/,""),n===""&&(n="DEFAULT");let i=`border${r==="All"?"":r}Radius`,a=t[n];if(a)return nu(Le(i,a));let o=_e(i,n);return typeof(o==null?void 0:o.style[i])!="number"?null:nu(o)}function nu(e){if((e==null?void 0:e.kind)!=="complete")return e;let t=e.style.borderTopRadius;t!==void 0&&(e.style.borderTopLeftRadius=t,e.style.borderTopRightRadius=t,delete e.style.borderTopRadius);let n=e.style.borderBottomRadius;n!==void 0&&(e.style.borderBottomLeftRadius=n,e.style.borderBottomRightRadius=n,delete e.style.borderBottomRadius);let r=e.style.borderLeftRadius;r!==void 0&&(e.style.borderBottomLeftRadius=r,e.style.borderTopLeftRadius=r,delete e.style.borderLeftRadius);let i=e.style.borderRightRadius;return i!==void 0&&(e.style.borderBottomRightRadius=i,e.style.borderTopRightRadius=i,delete e.style.borderRightRadius),e}c();function at(e,t,n,r){let i=null;e==="inset"&&(t=t.replace(/^(x|y)-/,(s,u)=>(i=u==="x"?"x":"y","")));let a=r==null?void 0:r[t];if(a){let s=Ee(a,{isNegative:n});if(s!==null)return au(e,i,s)}let o=Qe(t,{isNegative:n});return o!==null?au(e,i,o):null}function au(e,t,n){if(e!=="inset")return v({[e]:n});switch(t){case null:return v({top:n,left:n,right:n,bottom:n});case"y":return v({top:n,bottom:n});case"x":return v({left:n,right:n})}}c();function Jt(e,t,n){var r;t=t.replace(/^-/,"");let i=t===""?"DEFAULT":t,a=Number((r=n==null?void 0:n[i])!==null&&r!==void 0?r:t);return Number.isNaN(a)?null:v({[`flex${e}`]:a})}function su(e,t){var n,r;if(e=(t==null?void 0:t[e])||e,["min-content","revert","unset"].includes(e))return null;if(e.match(/^\d+(\.\d+)?$/))return v({flexGrow:Number(e),flexBasis:"0%"});let i=e.match(/^(\d+)\s+(\d+)$/);if(i)return v({flexGrow:Number(i[1]),flexShrink:Number(i[2])});if(i=e.match(/^(\d+)\s+([^ ]+)$/),i){let a=Ee((n=i[2])!==null&&n!==void 0?n:"");return a?v({flexGrow:Number(i[1]),flexBasis:a}):null}if(i=e.match(/^(\d+)\s+(\d+)\s+(.+)$/),i){let a=Ee((r=i[3])!==null&&r!==void 0?r:"");return a?v({flexGrow:Number(i[1]),flexShrink:Number(i[2]),flexBasis:a}):null}return null}c();function Yi(e,t,n={},r){let i=r==null?void 0:r[t];return i!==void 0?Le(e,i,n):_e(e,t,n)}function Kt(e,t,n={},r){let i=Ee(r==null?void 0:r[t],n);return i?v({[e]:i}):(t==="screen"&&(t=e.includes("Width")?"100vw":"100vh"),_e(e,t,n))}c();function uu(e,t,n){let r=n==null?void 0:n[e];if(r){let i=re(r,{isNegative:t});if(!i)return null;let[a,o]=i;if(o===z.em)return t0(a);if(o===z.percent)return ce("percentage-based letter-spacing configuration currently unsupported, switch to `em`s, or open an issue if you'd like to see support added."),null;let s=qe(a,o,{isNegative:t});return s!==null?v({letterSpacing:s}):null}return _e("letterSpacing",e,{isNegative:t})}function t0(e){return{kind:"dependent",complete(t){let n=t.fontSize;if(typeof n!="number"||Number.isNaN(n))return"tracking-X relative letter spacing classes require font-size to be set";t.letterSpacing=Math.round((e*n+Number.EPSILON)*100)/100}}}c();function lu(e,t){let n=t==null?void 0:t[e];if(n){let i=re(String(n));if(i)return v({opacity:i[0]})}let r=re(e);return r?v({opacity:r[0]/100}):null}c();function fu(e){let t=parseInt(e,10);return Number.isNaN(t)?null:{kind:"complete",style:{shadowOpacity:t/100}}}function cu(e){if(e.includes("/")){let[n="",r=""]=e.split("/",2),i=Xi(n),a=Xi(r);return i===null||a===null?null:{kind:"complete",style:{shadowOffset:{width:i,height:a}}}}let t=Xi(e);return t===null?null:{kind:"complete",style:{shadowOffset:{width:t,height:t}}}}function Xi(e){let t=Qe(e);return typeof t=="number"?t:null}var st=class{constructor(t,n={},r,i,a){var o,s,u,l,f,p;this.config=n,this.cache=r,this.position=0,this.isNull=!1,this.isNegative=!1,this.context={},this.context.device=i;let g=t.trim().split(":"),m=[];g.length===1?this.string=t:(this.string=(o=g.pop())!==null&&o!==void 0?o:"",m=g),this.char=this.string[0];let d=Vi((s=this.config.theme)===null||s===void 0?void 0:s.screens);for(let h of m)if(d[h]){let w=(u=d[h])===null||u===void 0?void 0:u[2];w!==void 0&&(this.order=((l=this.order)!==null&&l!==void 0?l:0)+w);let b=(f=i.windowDimensions)===null||f===void 0?void 0:f.width;if(b){let[_,T]=(p=d[h])!==null&&p!==void 0?p:[0,0];(b<=_||b>T)&&(this.isNull=!0)}else this.isNull=!0}else Hs(h)?this.isNull=h!==a:Ys(h)?i.windowDimensions?(i.windowDimensions.width>i.windowDimensions.height?"landscape":"portrait")!==h?this.isNull=!0:this.incrementOrder():this.isNull=!0:h==="retina"?i.pixelDensity===2?this.incrementOrder():this.isNull=!0:h==="dark"?i.colorScheme!=="dark"?this.isNull=!0:this.incrementOrder():this.handlePossibleArbitraryBreakpointPrefix(h)||(this.isNull=!0)}parse(){if(this.isNull)return{kind:"null"};let t=this.cache.getIr(this.rest);if(t)return t;this.parseIsNegative();let n=this.parseUtility();return n?this.order!==void 0?{kind:"ordered",order:this.order,styleIr:n}:n:{kind:"null"}}parseUtility(){var t,n,r,i,a;let o=this.config.theme,s=null;switch(this.char){case"m":case"p":{let u=this.peekSlice(1,3).match(/^(t|b|r|l|x|y)?-/);if(u){let l=this.char==="m"?"margin":"padding";this.advance(((n=(t=u[0])===null||t===void 0?void 0:t.length)!==null&&n!==void 0?n:0)+1);let f=qi(u[1]),p=ji(l,f,this.isNegative,this.rest,(r=this.config.theme)===null||r===void 0?void 0:r[l]);if(p)return p}}}if(this.consumePeeked("h-")&&(s=Yi("height",this.rest,this.context,o==null?void 0:o.height),s)||this.consumePeeked("w-")&&(s=Yi("width",this.rest,this.context,o==null?void 0:o.width),s)||this.consumePeeked("min-w-")&&(s=Kt("minWidth",this.rest,this.context,o==null?void 0:o.minWidth),s)||this.consumePeeked("min-h-")&&(s=Kt("minHeight",this.rest,this.context,o==null?void 0:o.minHeight),s)||this.consumePeeked("max-w-")&&(s=Kt("maxWidth",this.rest,this.context,o==null?void 0:o.maxWidth),s)||this.consumePeeked("max-h-")&&(s=Kt("maxHeight",this.rest,this.context,o==null?void 0:o.maxHeight),s)||this.consumePeeked("leading-")&&(s=Gi(this.rest,o==null?void 0:o.lineHeight),s)||this.consumePeeked("text-")&&(s=zi(this.rest,o==null?void 0:o.fontSize,this.context),s||(s=Je("text",this.rest,o==null?void 0:o.textColor),s)||this.consumePeeked("opacity-")&&(s=Qt("text",this.rest),s))||this.consumePeeked("font-")&&(s=Hi(this.rest,o==null?void 0:o.fontFamily),s)||this.consumePeeked("aspect-")&&(this.consumePeeked("ratio-")&&ce("`aspect-ratio-{ratio}` is deprecated, use `aspect-{ratio}` instead"),s=Le("aspectRatio",this.rest,{fractions:!0}),s)||this.consumePeeked("tint-")&&(s=Je("tint",this.rest,o==null?void 0:o.colors),s)||this.consumePeeked("bg-")&&(s=Je("bg",this.rest,o==null?void 0:o.backgroundColor),s||this.consumePeeked("opacity-")&&(s=Qt("bg",this.rest),s))||this.consumePeeked("border")&&(s=iu(this.rest,o),s||this.consumePeeked("-opacity-")&&(s=Qt("border",this.rest),s))||this.consumePeeked("rounded")&&(s=ou(this.rest,o==null?void 0:o.borderRadius),s)||this.consumePeeked("bottom-")&&(s=at("bottom",this.rest,this.isNegative,o==null?void 0:o.inset),s)||this.consumePeeked("top-")&&(s=at("top",this.rest,this.isNegative,o==null?void 0:o.inset),s)||this.consumePeeked("left-")&&(s=at("left",this.rest,this.isNegative,o==null?void 0:o.inset),s)||this.consumePeeked("right-")&&(s=at("right",this.rest,this.isNegative,o==null?void 0:o.inset),s)||this.consumePeeked("inset-")&&(s=at("inset",this.rest,this.isNegative,o==null?void 0:o.inset),s)||this.consumePeeked("flex-")&&(this.consumePeeked("grow")?s=Jt("Grow",this.rest,o==null?void 0:o.flexGrow):this.consumePeeked("shrink")?s=Jt("Shrink",this.rest,o==null?void 0:o.flexShrink):s=su(this.rest,o==null?void 0:o.flex),s)||this.consumePeeked("grow")&&(s=Jt("Grow",this.rest,o==null?void 0:o.flexGrow),s)||this.consumePeeked("shrink")&&(s=Jt("Shrink",this.rest,o==null?void 0:o.flexShrink),s)||this.consumePeeked("shadow-color-opacity-")&&(s=Qt("shadow",this.rest),s)||this.consumePeeked("shadow-opacity-")&&(s=fu(this.rest),s)||this.consumePeeked("shadow-offset-")&&(s=cu(this.rest),s)||this.consumePeeked("shadow-radius-")&&(s=_e("shadowRadius",this.rest),s)||this.consumePeeked("shadow-")&&(s=Je("shadow",this.rest,o==null?void 0:o.colors),s))return s;if(this.consumePeeked("elevation-")){let u=parseInt(this.rest,10);if(!Number.isNaN(u))return v({elevation:u})}if(this.consumePeeked("opacity-")&&(s=lu(this.rest,o==null?void 0:o.opacity),s)||this.consumePeeked("tracking-")&&(s=uu(this.rest,this.isNegative,o==null?void 0:o.letterSpacing),s))return s;if(this.consumePeeked("z-")){let u=Number((a=(i=o==null?void 0:o.zIndex)===null||i===void 0?void 0:i[this.rest])!==null&&a!==void 0?a:this.rest);if(!Number.isNaN(u))return v({zIndex:u})}return ce(`\`${this.rest}\` unknown or invalid utility`),null}handlePossibleArbitraryBreakpointPrefix(t){var n;if(t[0]!=="m")return!1;let r=t.match(/^(min|max)-(w|h)-\[([^\]]+)\]$/);if(!r)return!1;if(!(!((n=this.context.device)===null||n===void 0)&&n.windowDimensions))return this.isNull=!0,!0;let i=this.context.device.windowDimensions,[,a="",o="",s=""]=r,u=o==="w"?i.width:i.height,l=re(s,this.context);if(l===null)return this.isNull=!0,!0;let[f,p]=l;return p!=="px"&&(this.isNull=!0),(a==="min"?u>=f:u<=f)?this.incrementOrder():this.isNull=!0,!0}advance(t=1){this.position+=t,this.char=this.string[this.position]}get rest(){return this.peekSlice(0,this.string.length)}peekSlice(t,n){return this.string.slice(this.position+t,this.position+n)}consumePeeked(t){return this.peekSlice(0,t.length)===t?(this.advance(t.length),!0):!1}parseIsNegative(){this.char==="-"&&(this.advance(),this.isNegative=!0,this.context.isNegative=!0)}incrementOrder(){var t;this.order=((t=this.order)!==null&&t!==void 0?t:0)+1}};c();function du(e){let t=[],n=null;return e.forEach(r=>{if(typeof r=="string")t=[...t,...Qi(r)];else if(Array.isArray(r))t=[...t,...r.flatMap(Qi)];else if(typeof r=="object"&&r!==null)for(let[i,a]of Object.entries(r))typeof a=="boolean"?t=[...t,...a?Qi(i):[]]:n?n[i]=a:n={[i]:a}}),[t.filter(Boolean).filter(r0),n]}function Qi(e){return e.trim().split(/\s+/)}function r0(e,t,n){return n.indexOf(e)===t}c();function pu(e){var t;return(t=e==null?void 0:e.reduce((n,r)=>({...n,...n0(r.handler)}),{}))!==null&&t!==void 0?t:{}}function n0(e){let t={};return e({addUtilities:n=>{t=n},...i0}),t}function Oe(e){throw new Error(`tailwindcss plugin function argument object prop "${e}" not implemented`)}var i0={addComponents:Oe,addBase:Oe,addVariant:Oe,e:Oe,prefix:Oe,theme:Oe,variants:Oe,config:Oe,corePlugins:Oe,matchUtilities:Oe,postcss:null};function mu(e,t){let n=(0,hu.default)(o0(e)),r={},i=pu(n.plugins),a={},o=Object.entries(i).map(([d,h])=>typeof h=="string"?(a[d]=h,[d,{kind:"null"}]):[d,v(h)]).filter(([,d])=>d.kind!=="null");function s(){return[r.windowDimensions?`w${r.windowDimensions.width}`:!1,r.windowDimensions?`h${r.windowDimensions.height}`:!1,r.fontScale?`fs${r.fontScale}`:!1,r.colorScheme==="dark"?"dark":!1,r.pixelDensity===2?"retina":!1].filter(Boolean).join("--")||"default"}let u=s(),l={};function f(){let d=l[u];if(d)return d;let h=new Xt(o);return l[u]=h,h}function p(...d){let h=f(),w={},b=[],_=[],[T,I]=du(d),C=T.join(" "),M=h.getStyle(C);if(M)return{...M,...I||{}};for(let D of T){let F=h.getIr(D);if(!F&&D in a){let G=p(a[D]);h.setIr(D,v(G)),w={...w,...G};continue}switch(F=new st(D,n,h,r,t).parse(),F.kind){case"complete":w={...w,...F.style},h.setIr(D,F);break;case"dependent":b.push(F);break;case"ordered":_.push(F);break;case"null":h.setIr(D,F);break}}if(_.length>0){_.sort((D,F)=>D.order-F.order);for(let D of _)switch(D.styleIr.kind){case"complete":w={...w,...D.styleIr.style};break;case"dependent":b.push(D.styleIr);break}}if(b.length>0){for(let D of b){let F=D.complete(w);F&&ce(F)}tu(w)}return C!==""&&h.setStyle(C,w),I&&(w={...w,...I}),w}function g(d){let h=p(d.split(/\s+/g).map(w=>w.replace(/^(bg|text|border)-/,"")).map(w=>`bg-${w}`).join(" "));return typeof h.backgroundColor=="string"?h.backgroundColor:void 0}let m=(d,...h)=>{let w="";return d.forEach((b,_)=>{var T;w+=b+((T=h[_])!==null&&T!==void 0?T:"")}),p(w)};return m.style=p,m.color=g,m.prefixMatch=(...d)=>{let h=d.sort().join(":"),w=f(),b=w.getPrefixMatch(h);if(b!==void 0)return b;let I=new st(`${h}:flex`,n,w,r,t).parse().kind!=="null";return w.setPrefixMatch(h,I),I},m.setWindowDimensions=d=>{r.windowDimensions=d,u=s()},m.setFontScale=d=>{r.fontScale=d,u=s()},m.setPixelDensity=d=>{r.pixelDensity=d,u=s()},m.setColorScheme=d=>{r.colorScheme=d,u=s()},m}function o0(e){return{...e,content:["_no_warnings_please"]}}var s0={plugins:[{handler:({addUtilities:e})=>{e({"shadow-sm":{boxShadow:"0 1px 2px 0 rgb(0 0 0 / 0.05)"},shadow:{boxShadow:"0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)"},"shadow-md":{boxShadow:"0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)"},"shadow-lg":{boxShadow:"0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)"},"shadow-xl":{boxShadow:"0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)"},"shadow-2xl":{boxShadow:"0 25px 50px -12px rgb(0 0 0 / 0.25)"},"shadow-inner":{boxShadow:"inset 0 2px 4px 0 rgb(0 0 0 / 0.05)"},"shadow-none":{boxShadow:"0 0 #0000"}})}}]};function u0(){return mu(s0,"web")}var Cr;function Ji({width:e,height:t}){return Cr||(Cr=u0()),Cr.setWindowDimensions({width:+e,height:+t}),Cr}var Ki=new WeakMap;async function gu(e,t){let n=Ae();if(!n||!n.Node)throw new Error("Satori is not initialized: expect `yoga` to be loaded, got "+n);let r;Ki.has(t.fonts)?r=Ki.get(t.fonts):Ki.set(t.fonts,r=new vt(t.fonts));let i=n.Node.create();i.setWidth(t.width),i.setHeight(t.height),i.setFlexDirection(n.FLEX_DIRECTION_ROW),i.setFlexWrap(n.WRAP_WRAP),i.setAlignContent(n.ALIGN_AUTO),i.setAlignItems(n.ALIGN_FLEX_START),i.setJustifyContent(n.JUSTIFY_FLEX_START),i.setOverflow(n.OVERFLOW_HIDDEN);let a={...t.graphemeImages},o=gt(e,{id:"id",parentStyle:{},inheritedStyle:{fontSize:16,fontWeight:"normal",fontFamily:"serif",fontStyle:"normal",lineHeight:1.2,color:"black",opacity:1,whiteSpace:"normal",_viewportWidth:t.width,_viewportHeight:t.height},parent:i,font:r,embedFont:t.embedFont,debug:t.debug,graphemeImages:a,canLoadAdditionalAssets:!!t.loadAdditionalAsset,getTwStyles:(l,f)=>{let g={...Ji({width:t.width,height:t.height})([l])};return typeof g.lineHeight=="number"&&(g.lineHeight=g.lineHeight/(+g.fontSize||f.fontSize||16)),g.shadowColor&&g.boxShadow&&(g.boxShadow=g.boxShadow.replace(/rgba?\([^)]+\)/,g.shadowColor)),g}}),s=(await o.next()).value;if(t.loadAdditionalAsset&&s.length){s=Array.from(new Set(Ge(s.join(""),"grapheme")));let l={};s.forEach(g=>{let m=Fo(g);l[m]=l[m]||[],m==="emoji"?l[m].push(g):l[m][0]=(l[m][0]||"")+g});let f=[],p={};await Promise.all(Object.entries(l).flatMap(([g,m])=>m.map(d=>t.loadAdditionalAsset(g,d).then(h=>{typeof h=="string"?p[d]=h:h&&f.push(h)})))),r.addFonts(f),Object.assign(a,p)}await o.next(),i.calculateLayout(t.width,t.height,n.DIRECTION_LTR);let u=(await o.next([0,0])).value;return i.freeRecursive(),fn({width:t.width,height:t.height,content:u})}
//# sourceMappingURL=index.wasm.js.map
;// CONCATENATED MODULE: ./node_modules/yoga-wasm-web/dist/entry.js
var L=(T,t)=>()=>(t||T((t={exports:{}}).exports,t),t.exports);var entry_R=L((D,u)=>{var S={ALIGN_COUNT:8,ALIGN_AUTO:0,ALIGN_FLEX_START:1,ALIGN_CENTER:2,ALIGN_FLEX_END:3,ALIGN_STRETCH:4,ALIGN_BASELINE:5,ALIGN_SPACE_BETWEEN:6,ALIGN_SPACE_AROUND:7,DIMENSION_COUNT:2,DIMENSION_WIDTH:0,DIMENSION_HEIGHT:1,DIRECTION_COUNT:3,DIRECTION_INHERIT:0,DIRECTION_LTR:1,DIRECTION_RTL:2,DISPLAY_COUNT:2,DISPLAY_FLEX:0,DISPLAY_NONE:1,EDGE_COUNT:9,EDGE_LEFT:0,EDGE_TOP:1,EDGE_RIGHT:2,EDGE_BOTTOM:3,EDGE_START:4,EDGE_END:5,EDGE_HORIZONTAL:6,EDGE_VERTICAL:7,EDGE_ALL:8,EXPERIMENTAL_FEATURE_COUNT:1,EXPERIMENTAL_FEATURE_WEB_FLEX_BASIS:0,FLEX_DIRECTION_COUNT:4,FLEX_DIRECTION_COLUMN:0,FLEX_DIRECTION_COLUMN_REVERSE:1,FLEX_DIRECTION_ROW:2,FLEX_DIRECTION_ROW_REVERSE:3,JUSTIFY_COUNT:6,JUSTIFY_FLEX_START:0,JUSTIFY_CENTER:1,JUSTIFY_FLEX_END:2,JUSTIFY_SPACE_BETWEEN:3,JUSTIFY_SPACE_AROUND:4,JUSTIFY_SPACE_EVENLY:5,LOG_LEVEL_COUNT:6,LOG_LEVEL_ERROR:0,LOG_LEVEL_WARN:1,LOG_LEVEL_INFO:2,LOG_LEVEL_DEBUG:3,LOG_LEVEL_VERBOSE:4,LOG_LEVEL_FATAL:5,MEASURE_MODE_COUNT:3,MEASURE_MODE_UNDEFINED:0,MEASURE_MODE_EXACTLY:1,MEASURE_MODE_AT_MOST:2,NODE_TYPE_COUNT:2,NODE_TYPE_DEFAULT:0,NODE_TYPE_TEXT:1,OVERFLOW_COUNT:3,OVERFLOW_VISIBLE:0,OVERFLOW_HIDDEN:1,OVERFLOW_SCROLL:2,POSITION_TYPE_COUNT:2,POSITION_TYPE_RELATIVE:0,POSITION_TYPE_ABSOLUTE:1,PRINT_OPTIONS_COUNT:3,PRINT_OPTIONS_LAYOUT:1,PRINT_OPTIONS_STYLE:2,PRINT_OPTIONS_CHILDREN:4,UNIT_COUNT:4,UNIT_UNDEFINED:0,UNIT_POINT:1,UNIT_PERCENT:2,UNIT_AUTO:3,WRAP_COUNT:3,WRAP_NO_WRAP:0,WRAP_WRAP:1,WRAP_WRAP_REVERSE:2};u.exports=S});var U=L((P,A)=>{var _=entry_R(),a=class{left;right;top;bottom;width;height;constructor(t,N,E,e,s,o){this.left=t,this.right=N,this.top=E,this.bottom=e,this.width=s,this.height=o}fromJS(t){t(this.left,this.right,this.top,this.bottom,this.width,this.height)}toString(){return`<Layout#${this.left}:${this.right};${this.top}:${this.bottom};${this.width}:${this.height}>`}},h=class{static fromJS({width:t,height:N}){return new h(t,N)}width;height;constructor(t,N){this.width=t,this.height=N}fromJS(t){t(this.width,this.height)}toString(){return`<Size#${this.width}x${this.height}>`}},n=class{unit;value;constructor(t,N){this.unit=t,this.value=N}fromJS(t){t(this.unit,this.value)}toString(){switch(this.unit){case _.UNIT_POINT:return String(this.value);case _.UNIT_PERCENT:return`${this.value}%`;case _.UNIT_AUTO:return"auto";default:return`${this.value}?`}}valueOf(){return this.value}};function O(T,t,N){let E=T[t];T[t]=function(...e){return N.call(this,E,...e)}}A.exports=(T,t)=>{for(let E of["setPosition","setMargin","setFlexBasis","setWidth","setHeight","setMinWidth","setMinHeight","setMaxWidth","setMaxHeight","setPadding"]){let e={[_.UNIT_POINT]:t.Node.prototype[E],[_.UNIT_PERCENT]:t.Node.prototype[`${E}Percent`],[_.UNIT_AUTO]:t.Node.prototype[`${E}Auto`]};O(t.Node.prototype,E,function(s,...o){let i=o.pop(),I,r;if(i==="auto")I=_.UNIT_AUTO,r=void 0;else if(i instanceof n)I=i.unit,r=i.valueOf();else if(I=typeof i=="string"&&i.endsWith("%")?_.UNIT_PERCENT:_.UNIT_POINT,r=parseFloat(i),!Number.isNaN(i)&&Number.isNaN(r))throw new Error(`Invalid value ${i} for ${E}`);if(!e[I])throw new Error(`Failed to execute "${E}": Unsupported unit '${i}'`);return r!==void 0?e[I].call(this,...o,r):e[I].call(this,...o)})}O(t.Config.prototype,"free",function(){t.Config.destroy(this)}),O(t.Node,"create",function(E,e){return e?t.Node.createWithConfig(e):t.Node.createDefault()}),O(t.Node.prototype,"free",function(){t.Node.destroy(this)}),O(t.Node.prototype,"freeRecursive",function(){for(let E=0,e=this.getChildCount();E<e;++E)this.getChild(0).freeRecursive();this.free()});function N(E){return t.MeasureCallback.implement({measure:E})}return O(t.Node.prototype,"setMeasureFunc",function(E,e){E.call(this,N(e))}),O(t.Node.prototype,"calculateLayout",function(E,e=NaN,s=NaN,o=_.DIRECTION_LTR){return E.call(this,e,s,o)}),{Config:t.Config,Node:t.Node,Layout:T("Layout",a),Size:T("Size",h),Value:T("Value",n),..._}}});/* harmony default export */ const entry = (U());

;// CONCATENATED MODULE: ./node_modules/yoga-wasm-web/dist/yoga.mjs

var yoga = (() => {
  var _scriptDir = "file:///Users/laneparton/Projects/Personal/laneparton.com/node_modules/yoga-wasm-web/dist/yoga.mjs";
  
  return (
function(yoga) {
  yoga = yoga || {};


var l;l||(l=typeof yoga !== 'undefined' ? yoga : {});var aa,ba;l.ready=new Promise(function(b,a){aa=b;ba=a});var da=Object.assign({},l),q="";"undefined"!=typeof document&&document.currentScript&&(q=document.currentScript.src);_scriptDir&&(q=_scriptDir);0!==q.indexOf("blob:")?q=q.substr(0,q.replace(/[?#].*/,"").lastIndexOf("/")+1):q="";var ea=console.log.bind(console),v=console.warn.bind(console);Object.assign(l,da);da=null;"object"!=typeof WebAssembly&&w("no native wasm support detected");
var fa,ha=!1;function ia(b,a,c,d){var e={string:function(h){var n=0;if(null!==h&&void 0!==h&&0!==h){var p=(h.length<<2)+1;n=ja(p);ka(h,n,p)}return n},array:function(h){var n=ja(h.length);x.set(h,n);return n}};b=l["_"+b];var f=[],k=0;if(d)for(var g=0;g<d.length;g++){var m=e[c[g]];m?(0===k&&(k=la()),f[g]=m(d[g])):f[g]=d[g]}c=b.apply(null,f);return c=function(h){0!==k&&ma(k);return"string"===a?h?na(y,h):"":"boolean"===a?!!h:h}(c)}
function na(b,a,c){c=a+c;for(var d="";!(a>=c);){var e=b[a++];if(!e)break;if(e&128){var f=b[a++]&63;if(192==(e&224))d+=String.fromCharCode((e&31)<<6|f);else{var k=b[a++]&63;e=224==(e&240)?(e&15)<<12|f<<6|k:(e&7)<<18|f<<12|k<<6|b[a++]&63;65536>e?d+=String.fromCharCode(e):(e-=65536,d+=String.fromCharCode(55296|e>>10,56320|e&1023))}}else d+=String.fromCharCode(e)}return d}
function ka(b,a,c){var d=y;if(0<c){c=a+c-1;for(var e=0;e<b.length;++e){var f=b.charCodeAt(e);if(55296<=f&&57343>=f){var k=b.charCodeAt(++e);f=65536+((f&1023)<<10)|k&1023}if(127>=f){if(a>=c)break;d[a++]=f}else{if(2047>=f){if(a+1>=c)break;d[a++]=192|f>>6}else{if(65535>=f){if(a+2>=c)break;d[a++]=224|f>>12}else{if(a+3>=c)break;d[a++]=240|f>>18;d[a++]=128|f>>12&63}d[a++]=128|f>>6&63}d[a++]=128|f&63}}d[a]=0}}
function oa(b,a){for(var c="",d=0;!(d>=a/2);++d){var e=A[b+2*d>>1];if(0==e)break;c+=String.fromCharCode(e)}return c}function pa(b,a,c){void 0===c&&(c=2147483647);if(2>c)return 0;c-=2;var d=a;c=c<2*b.length?c/2:b.length;for(var e=0;e<c;++e)A[a>>1]=b.charCodeAt(e),a+=2;A[a>>1]=0;return a-d}function qa(b){return 2*b.length}
function ra(b,a){for(var c=0,d="";!(c>=a/4);){var e=B[b+4*c>>2];if(0==e)break;++c;65536<=e?(e-=65536,d+=String.fromCharCode(55296|e>>10,56320|e&1023)):d+=String.fromCharCode(e)}return d}function sa(b,a,c){void 0===c&&(c=2147483647);if(4>c)return 0;var d=a;c=d+c-4;for(var e=0;e<b.length;++e){var f=b.charCodeAt(e);if(55296<=f&&57343>=f){var k=b.charCodeAt(++e);f=65536+((f&1023)<<10)|k&1023}B[a>>2]=f;a+=4;if(a+4>c)break}B[a>>2]=0;return a-d}
function ta(b){for(var a=0,c=0;c<b.length;++c){var d=b.charCodeAt(c);55296<=d&&57343>=d&&++c;a+=4}return a}var ua,x,y,A,va,B,D,wa,xa;function ya(){var b=fa.buffer;ua=b;l.HEAP8=x=new Int8Array(b);l.HEAP16=A=new Int16Array(b);l.HEAP32=B=new Int32Array(b);l.HEAPU8=y=new Uint8Array(b);l.HEAPU16=va=new Uint16Array(b);l.HEAPU32=D=new Uint32Array(b);l.HEAPF32=wa=new Float32Array(b);l.HEAPF64=xa=new Float64Array(b)}var E,za=[],Aa=[],Ba=[],F=0,Ca=null,G=null;
function w(b){b="Aborted("+b+")";v(b);ha=!0;b=new WebAssembly.RuntimeError(b+". Build with -sASSERTIONS for more info.");ba(b);throw b;}function Da(){return H.startsWith("data:application/octet-stream;base64,")}var H;if(l.locateFile){if(H="yoga.wasm",!Da()){var Ea=H;H=l.locateFile?l.locateFile(Ea,q):q+Ea}}else H=("").toString();function Fa(){try{throw"both async and sync fetching of the wasm failed";}catch(b){w(b)}}
function Ga(){return"function"==typeof fetch?fetch(H,{credentials:"same-origin"}).then(function(b){if(!b.ok)throw"failed to load wasm binary file at '"+H+"'";return b.arrayBuffer()}).catch(function(){return Fa()}):Promise.resolve().then(function(){return Fa()})}var I,Ha;function Ia(b){for(;0<b.length;){var a=b.shift();if("function"==typeof a)a(l);else{var c=a.Qa;"number"==typeof c?void 0===a.ka?E.get(c)():E.get(c)(a.ka):c(void 0===a.ka?null:a.ka)}}}
function Ja(b){this.U=b-24;this.ya=function(a){D[this.U+4>>2]=a};this.va=function(a){D[this.U+8>>2]=a};this.wa=function(){B[this.U>>2]=0};this.ua=function(){x[this.U+12>>0]=0};this.xa=function(){x[this.U+13>>0]=0};this.sa=function(a,c){this.ta();this.ya(a);this.va(c);this.wa();this.ua();this.xa()};this.ta=function(){D[this.U+16>>2]=0}}var Ka=0;function La(b){if(void 0===b)return"_unknown";b=b.replace(/[^a-zA-Z0-9_]/g,"$");var a=b.charCodeAt(0);return 48<=a&&57>=a?"_"+b:b}
function Ma(b,a){b=La(b);return function(){null;return a.apply(this,arguments)}}var K=[{},{value:void 0},{value:null},{value:!0},{value:!1}],Na=[];function Oa(b){var a=Error,c=Ma(b,function(d){this.name=b;this.message=d;d=Error(d).stack;void 0!==d&&(this.stack=this.toString()+"\n"+d.replace(/^Error(:[^\n]*)?\n/,""))});c.prototype=Object.create(a.prototype);c.prototype.constructor=c;c.prototype.toString=function(){return void 0===this.message?this.name:this.name+": "+this.message};return c}var L=void 0;
function M(b){throw new L(b);}var N=b=>{b||M("Cannot use deleted val. handle = "+b);return K[b].value},Pa=b=>{switch(b){case void 0:return 1;case null:return 2;case !0:return 3;case !1:return 4;default:var a=Na.length?Na.pop():K.length;K[a]={na:1,value:b};return a}},Qa=void 0,Ra=void 0;function O(b){for(var a="";y[b];)a+=Ra[y[b++]];return a}var P=[];function Sa(){for(;P.length;){var b=P.pop();b.T.fa=!1;b["delete"]()}}var Ta=void 0,Q={};
function Ua(b,a){for(void 0===a&&M("ptr should not be undefined");b.X;)a=b.ha(a),b=b.X;return a}var R={};function Va(b){b=Wa(b);var a=O(b);S(b);return a}function Xa(b,a){var c=R[b];void 0===c&&M(a+" has unknown type "+Va(b));return c}function Ya(){}var Za=!1;function $a(b){--b.count.value;0===b.count.value&&(b.Z?b.aa.ba(b.Z):b.W.V.ba(b.U))}function ab(b,a,c){if(a===c)return b;if(void 0===c.X)return null;b=ab(b,a,c.X);return null===b?null:c.Ba(b)}var bb={};function cb(b,a){a=Ua(b,a);return Q[a]}
var db=void 0;function eb(b){throw new db(b);}function fb(b,a){a.W&&a.U||eb("makeClassHandle requires ptr and ptrType");!!a.aa!==!!a.Z&&eb("Both smartPtrType and smartPtr must be specified");a.count={value:1};return T(Object.create(b,{T:{value:a}}))}function T(b){if("undefined"===typeof FinalizationRegistry)return T=a=>a,b;Za=new FinalizationRegistry(a=>{$a(a.T)});T=a=>{var c=a.T;c.Z&&Za.register(a,{T:c},a);return a};Ya=a=>{Za.unregister(a)};return T(b)}var gb={};
function hb(b){for(;b.length;){var a=b.pop();b.pop()(a)}}function ib(b){return this.fromWireType(D[b>>2])}var U={},jb={};function V(b,a,c){function d(g){g=c(g);g.length!==b.length&&eb("Mismatched type converter count");for(var m=0;m<b.length;++m)W(b[m],g[m])}b.forEach(function(g){jb[g]=a});var e=Array(a.length),f=[],k=0;a.forEach((g,m)=>{R.hasOwnProperty(g)?e[m]=R[g]:(f.push(g),U.hasOwnProperty(g)||(U[g]=[]),U[g].push(()=>{e[m]=R[g];++k;k===f.length&&d(e)}))});0===f.length&&d(e)}
function kb(b){switch(b){case 1:return 0;case 2:return 1;case 4:return 2;case 8:return 3;default:throw new TypeError("Unknown type size: "+b);}}
function W(b,a,c={}){if(!("argPackAdvance"in a))throw new TypeError("registerType registeredInstance requires argPackAdvance");var d=a.name;b||M('type "'+d+'" must have a positive integer typeid pointer');if(R.hasOwnProperty(b)){if(c.Ia)return;M("Cannot register type '"+d+"' twice")}R[b]=a;delete jb[b];U.hasOwnProperty(b)&&(a=U[b],delete U[b],a.forEach(e=>e()))}function lb(b){M(b.T.W.V.name+" instance already deleted")}function X(){}
function mb(b,a,c){if(void 0===b[a].Y){var d=b[a];b[a]=function(){b[a].Y.hasOwnProperty(arguments.length)||M("Function '"+c+"' called with an invalid number of arguments ("+arguments.length+") - expects one of ("+b[a].Y+")!");return b[a].Y[arguments.length].apply(this,arguments)};b[a].Y=[];b[a].Y[d.ea]=d}}
function nb(b,a){l.hasOwnProperty(b)?(M("Cannot register public name '"+b+"' twice"),mb(l,b,b),l.hasOwnProperty(void 0)&&M("Cannot register multiple overloads of a function with the same number of arguments (undefined)!"),l[b].Y[void 0]=a):l[b]=a}function qb(b,a,c,d,e,f,k,g){this.name=b;this.constructor=a;this.ca=c;this.ba=d;this.X=e;this.Da=f;this.ha=k;this.Ba=g;this.qa=[]}
function rb(b,a,c){for(;a!==c;)a.ha||M("Expected null or instance of "+c.name+", got an instance of "+a.name),b=a.ha(b),a=a.X;return b}function sb(b,a){if(null===a)return this.la&&M("null is not a valid "+this.name),0;a.T||M('Cannot pass "'+tb(a)+'" as a '+this.name);a.T.U||M("Cannot pass deleted object as a pointer of type "+this.name);return rb(a.T.U,a.T.W.V,this.V)}
function ub(b,a){if(null===a){this.la&&M("null is not a valid "+this.name);if(this.ja){var c=this.ma();null!==b&&b.push(this.ba,c);return c}return 0}a.T||M('Cannot pass "'+tb(a)+'" as a '+this.name);a.T.U||M("Cannot pass deleted object as a pointer of type "+this.name);!this.ia&&a.T.W.ia&&M("Cannot convert argument of type "+(a.T.aa?a.T.aa.name:a.T.W.name)+" to parameter type "+this.name);c=rb(a.T.U,a.T.W.V,this.V);if(this.ja)switch(void 0===a.T.Z&&M("Passing raw pointer to smart pointer is illegal"),
this.Pa){case 0:a.T.aa===this?c=a.T.Z:M("Cannot convert argument of type "+(a.T.aa?a.T.aa.name:a.T.W.name)+" to parameter type "+this.name);break;case 1:c=a.T.Z;break;case 2:if(a.T.aa===this)c=a.T.Z;else{var d=a.clone();c=this.La(c,Pa(function(){d["delete"]()}));null!==b&&b.push(this.ba,c)}break;default:M("Unsupporting sharing policy")}return c}
function vb(b,a){if(null===a)return this.la&&M("null is not a valid "+this.name),0;a.T||M('Cannot pass "'+tb(a)+'" as a '+this.name);a.T.U||M("Cannot pass deleted object as a pointer of type "+this.name);a.T.W.ia&&M("Cannot convert argument of type "+a.T.W.name+" to parameter type "+this.name);return rb(a.T.U,a.T.W.V,this.V)}
function Y(b,a,c,d){this.name=b;this.V=a;this.la=c;this.ia=d;this.ja=!1;this.ba=this.La=this.ma=this.ra=this.Pa=this.Ka=void 0;void 0!==a.X?this.toWireType=ub:(this.toWireType=d?sb:vb,this.$=null)}function wb(b,a){l.hasOwnProperty(b)||eb("Replacing nonexistant public symbol");l[b]=a;l[b].ea=void 0}
function xb(b,a){var c=[];return function(){c.length=0;Object.assign(c,arguments);if(b.includes("j")){var d=l["dynCall_"+b];d=c&&c.length?d.apply(null,[a].concat(c)):d.call(null,a)}else d=E.get(a).apply(null,c);return d}}function Z(b,a){b=O(b);var c=b.includes("j")?xb(b,a):E.get(a);"function"!=typeof c&&M("unknown function pointer with signature "+b+": "+a);return c}var yb=void 0;
function zb(b,a){function c(f){e[f]||R[f]||(jb[f]?jb[f].forEach(c):(d.push(f),e[f]=!0))}var d=[],e={};a.forEach(c);throw new yb(b+": "+d.map(Va).join([", "]));}
function Ab(b,a,c,d,e){var f=a.length;2>f&&M("argTypes array size mismatch! Must at least get return value and 'this' types!");var k=null!==a[1]&&null!==c,g=!1;for(c=1;c<a.length;++c)if(null!==a[c]&&void 0===a[c].$){g=!0;break}var m="void"!==a[0].name,h=f-2,n=Array(h),p=[],r=[];return function(){arguments.length!==h&&M("function "+b+" called with "+arguments.length+" arguments, expected "+h+" args!");r.length=0;p.length=k?2:1;p[0]=e;if(k){var u=a[1].toWireType(r,this);p[1]=u}for(var t=0;t<h;++t)n[t]=
a[t+2].toWireType(r,arguments[t]),p.push(n[t]);t=d.apply(null,p);if(g)hb(r);else for(var z=k?1:2;z<a.length;z++){var C=1===z?u:n[z-2];null!==a[z].$&&a[z].$(C)}u=m?a[0].fromWireType(t):void 0;return u}}function Bb(b,a){for(var c=[],d=0;d<b;d++)c.push(B[(a>>2)+d]);return c}function Cb(b){4<b&&0===--K[b].na&&(K[b]=void 0,Na.push(b))}
function Db(b,a,c){switch(a){case 0:return function(d){return this.fromWireType((c?x:y)[d])};case 1:return function(d){return this.fromWireType((c?A:va)[d>>1])};case 2:return function(d){return this.fromWireType((c?B:D)[d>>2])};default:throw new TypeError("Unknown integer type: "+b);}}function tb(b){if(null===b)return"null";var a=typeof b;return"object"===a||"array"===a||"function"===a?b.toString():""+b}
function Eb(b,a){switch(a){case 2:return function(c){return this.fromWireType(wa[c>>2])};case 3:return function(c){return this.fromWireType(xa[c>>3])};default:throw new TypeError("Unknown float type: "+b);}}
function Fb(b,a,c){switch(a){case 0:return c?function(d){return x[d]}:function(d){return y[d]};case 1:return c?function(d){return A[d>>1]}:function(d){return va[d>>1]};case 2:return c?function(d){return B[d>>2]}:function(d){return D[d>>2]};default:throw new TypeError("Unknown integer type: "+b);}}var Gb={};function Hb(b){var a=Gb[b];return void 0===a?O(b):a}var Ib=[];function Jb(b){var a=Ib.length;Ib.push(b);return a}
function Kb(b,a){for(var c=Array(b),d=0;d<b;++d)c[d]=Xa(D[a+4*d>>2],"parameter "+d);return c}var Lb=[],Mb=[null,[],[]];L=l.BindingError=Oa("BindingError");l.count_emval_handles=function(){for(var b=0,a=5;a<K.length;++a)void 0!==K[a]&&++b;return b};l.get_first_emval=function(){for(var b=5;b<K.length;++b)if(void 0!==K[b])return K[b];return null};Qa=l.PureVirtualError=Oa("PureVirtualError");for(var Nb=Array(256),Ob=0;256>Ob;++Ob)Nb[Ob]=String.fromCharCode(Ob);Ra=Nb;l.getInheritedInstanceCount=function(){return Object.keys(Q).length};
l.getLiveInheritedInstances=function(){var b=[],a;for(a in Q)Q.hasOwnProperty(a)&&b.push(Q[a]);return b};l.flushPendingDeletes=Sa;l.setDelayFunction=function(b){Ta=b;P.length&&Ta&&Ta(Sa)};db=l.InternalError=Oa("InternalError");X.prototype.isAliasOf=function(b){if(!(this instanceof X&&b instanceof X))return!1;var a=this.T.W.V,c=this.T.U,d=b.T.W.V;for(b=b.T.U;a.X;)c=a.ha(c),a=a.X;for(;d.X;)b=d.ha(b),d=d.X;return a===d&&c===b};
X.prototype.clone=function(){this.T.U||lb(this);if(this.T.ga)return this.T.count.value+=1,this;var b=T,a=Object,c=a.create,d=Object.getPrototypeOf(this),e=this.T;b=b(c.call(a,d,{T:{value:{count:e.count,fa:e.fa,ga:e.ga,U:e.U,W:e.W,Z:e.Z,aa:e.aa}}}));b.T.count.value+=1;b.T.fa=!1;return b};X.prototype["delete"]=function(){this.T.U||lb(this);this.T.fa&&!this.T.ga&&M("Object already scheduled for deletion");Ya(this);$a(this.T);this.T.ga||(this.T.Z=void 0,this.T.U=void 0)};X.prototype.isDeleted=function(){return!this.T.U};
X.prototype.deleteLater=function(){this.T.U||lb(this);this.T.fa&&!this.T.ga&&M("Object already scheduled for deletion");P.push(this);1===P.length&&Ta&&Ta(Sa);this.T.fa=!0;return this};Y.prototype.Ea=function(b){this.ra&&(b=this.ra(b));return b};Y.prototype.oa=function(b){this.ba&&this.ba(b)};Y.prototype.argPackAdvance=8;Y.prototype.readValueFromPointer=ib;Y.prototype.deleteObject=function(b){if(null!==b)b["delete"]()};
Y.prototype.fromWireType=function(b){function a(){return this.ja?fb(this.V.ca,{W:this.Ka,U:c,aa:this,Z:b}):fb(this.V.ca,{W:this,U:b})}var c=this.Ea(b);if(!c)return this.oa(b),null;var d=cb(this.V,c);if(void 0!==d){if(0===d.T.count.value)return d.T.U=c,d.T.Z=b,d.clone();d=d.clone();this.oa(b);return d}d=this.V.Da(c);d=bb[d];if(!d)return a.call(this);d=this.ia?d.za:d.pointerType;var e=ab(c,this.V,d.V);return null===e?a.call(this):this.ja?fb(d.V.ca,{W:d,U:e,aa:this,Z:b}):fb(d.V.ca,{W:d,U:e})};
yb=l.UnboundTypeError=Oa("UnboundTypeError");
var Qb={l:function(b){return Pb(b+24)+24},k:function(b,a,c){(new Ja(b)).sa(a,c);Ka++;throw b;},r:function(b,a,c){b=O(b);a=Xa(a,"wrapper");c=N(c);var d=[].slice,e=a.V,f=e.ca,k=e.X.ca,g=e.X.constructor;b=Ma(b,function(){e.X.qa.forEach(function(h){if(this[h]===k[h])throw new Qa("Pure virtual function "+h+" must be implemented in JavaScript");}.bind(this));Object.defineProperty(this,"__parent",{value:f});this.__construct.apply(this,d.call(arguments))});f.__construct=function(){this===f&&M("Pass correct 'this' to __construct");
var h=g.implement.apply(void 0,[this].concat(d.call(arguments)));Ya(h);var n=h.T;h.notifyOnDestruction();n.ga=!0;Object.defineProperties(this,{T:{value:n}});T(this);h=n.U;h=Ua(e,h);Q.hasOwnProperty(h)?M("Tried to register registered instance: "+h):Q[h]=this};f.__destruct=function(){this===f&&M("Pass correct 'this' to __destruct");Ya(this);var h=this.T.U;h=Ua(e,h);Q.hasOwnProperty(h)?delete Q[h]:M("Tried to unregister unregistered instance: "+h)};b.prototype=Object.create(f);for(var m in c)b.prototype[m]=
c[m];return Pa(b)},j:function(b){var a=gb[b];delete gb[b];var c=a.ma,d=a.ba,e=a.pa,f=e.map(k=>k.Ha).concat(e.map(k=>k.Na));V([b],f,k=>{var g={};e.forEach((m,h)=>{var n=k[h],p=m.Fa,r=m.Ga,u=k[h+e.length],t=m.Ma,z=m.Oa;g[m.Ca]={read:C=>n.fromWireType(p(r,C)),write:(C,ca)=>{var J=[];t(z,C,u.toWireType(J,ca));hb(J)}}});return[{name:a.name,fromWireType:function(m){var h={},n;for(n in g)h[n]=g[n].read(m);d(m);return h},toWireType:function(m,h){for(var n in g)if(!(n in h))throw new TypeError('Missing field:  "'+
n+'"');var p=c();for(n in g)g[n].write(p,h[n]);null!==m&&m.push(d,p);return p},argPackAdvance:8,readValueFromPointer:ib,$:d}]})},u:function(){},B:function(b,a,c,d,e){var f=kb(c);a=O(a);W(b,{name:a,fromWireType:function(k){return!!k},toWireType:function(k,g){return g?d:e},argPackAdvance:8,readValueFromPointer:function(k){if(1===c)var g=x;else if(2===c)g=A;else if(4===c)g=B;else throw new TypeError("Unknown boolean type size: "+a);return this.fromWireType(g[k>>f])},$:null})},e:function(b,a,c,d,e,f,
k,g,m,h,n,p,r){n=O(n);f=Z(e,f);g&&(g=Z(k,g));h&&(h=Z(m,h));r=Z(p,r);var u=La(n);nb(u,function(){zb("Cannot construct "+n+" due to unbound types",[d])});V([b,a,c],d?[d]:[],function(t){t=t[0];if(d){var z=t.V;var C=z.ca}else C=X.prototype;t=Ma(u,function(){if(Object.getPrototypeOf(this)!==ca)throw new L("Use 'new' to construct "+n);if(void 0===J.da)throw new L(n+" has no accessible constructor");var ob=J.da[arguments.length];if(void 0===ob)throw new L("Tried to invoke ctor of "+n+" with invalid number of parameters ("+
arguments.length+") - expected ("+Object.keys(J.da).toString()+") parameters instead!");return ob.apply(this,arguments)});var ca=Object.create(C,{constructor:{value:t}});t.prototype=ca;var J=new qb(n,t,ca,r,z,f,g,h);z=new Y(n,J,!0,!1);C=new Y(n+"*",J,!1,!1);var pb=new Y(n+" const*",J,!1,!0);bb[b]={pointerType:C,za:pb};wb(u,t);return[z,C,pb]})},d:function(b,a,c,d,e,f,k){var g=Bb(c,d);a=O(a);f=Z(e,f);V([],[b],function(m){function h(){zb("Cannot call "+n+" due to unbound types",g)}m=m[0];var n=m.name+
"."+a;a.startsWith("@@")&&(a=Symbol[a.substring(2)]);var p=m.V.constructor;void 0===p[a]?(h.ea=c-1,p[a]=h):(mb(p,a,n),p[a].Y[c-1]=h);V([],g,function(r){r=Ab(n,[r[0],null].concat(r.slice(1)),null,f,k);void 0===p[a].Y?(r.ea=c-1,p[a]=r):p[a].Y[c-1]=r;return[]});return[]})},m:function(b,a,c,d,e,f){0<a||w();var k=Bb(a,c);e=Z(d,e);V([],[b],function(g){g=g[0];var m="constructor "+g.name;void 0===g.V.da&&(g.V.da=[]);if(void 0!==g.V.da[a-1])throw new L("Cannot register multiple constructors with identical number of parameters ("+
(a-1)+") for class '"+g.name+"'! Overload resolution is currently only performed using the parameter count, not actual type info!");g.V.da[a-1]=()=>{zb("Cannot construct "+g.name+" due to unbound types",k)};V([],k,function(h){h.splice(1,0,null);g.V.da[a-1]=Ab(m,h,null,e,f);return[]});return[]})},a:function(b,a,c,d,e,f,k,g){var m=Bb(c,d);a=O(a);f=Z(e,f);V([],[b],function(h){function n(){zb("Cannot call "+p+" due to unbound types",m)}h=h[0];var p=h.name+"."+a;a.startsWith("@@")&&(a=Symbol[a.substring(2)]);
g&&h.V.qa.push(a);var r=h.V.ca,u=r[a];void 0===u||void 0===u.Y&&u.className!==h.name&&u.ea===c-2?(n.ea=c-2,n.className=h.name,r[a]=n):(mb(r,a,p),r[a].Y[c-2]=n);V([],m,function(t){t=Ab(p,t,h,f,k);void 0===r[a].Y?(t.ea=c-2,r[a]=t):r[a].Y[c-2]=t;return[]});return[]})},A:function(b,a){a=O(a);W(b,{name:a,fromWireType:function(c){var d=N(c);Cb(c);return d},toWireType:function(c,d){return Pa(d)},argPackAdvance:8,readValueFromPointer:ib,$:null})},o:function(b,a,c,d){function e(){}c=kb(c);a=O(a);e.values=
{};W(b,{name:a,constructor:e,fromWireType:function(f){return this.constructor.values[f]},toWireType:function(f,k){return k.value},argPackAdvance:8,readValueFromPointer:Db(a,c,d),$:null});nb(a,e)},n:function(b,a,c){var d=Xa(b,"enum");a=O(a);b=d.constructor;d=Object.create(d.constructor.prototype,{value:{value:c},constructor:{value:Ma(d.name+"_"+a,function(){})}});b.values[c]=d;b[a]=d},p:function(b,a,c){c=kb(c);a=O(a);W(b,{name:a,fromWireType:function(d){return d},toWireType:function(d,e){return e},
argPackAdvance:8,readValueFromPointer:Eb(a,c),$:null})},c:function(b,a,c,d,e){a=O(a);-1===e&&(e=4294967295);e=kb(c);var f=g=>g;if(0===d){var k=32-8*c;f=g=>g<<k>>>k}c=a.includes("unsigned")?function(g,m){return m>>>0}:function(g,m){return m};W(b,{name:a,fromWireType:f,toWireType:c,argPackAdvance:8,readValueFromPointer:Fb(a,e,0!==d),$:null})},b:function(b,a,c){function d(f){f>>=2;var k=D;return new e(ua,k[f+1],k[f])}var e=[Int8Array,Uint8Array,Int16Array,Uint16Array,Int32Array,Uint32Array,Float32Array,
Float64Array][a];c=O(c);W(b,{name:c,fromWireType:d,argPackAdvance:8,readValueFromPointer:d},{Ia:!0})},q:function(b,a){a=O(a);var c="std::string"===a;W(b,{name:a,fromWireType:function(d){var e=D[d>>2];if(c)for(var f=d+4,k=0;k<=e;++k){var g=d+4+k;if(k==e||0==y[g]){f=f?na(y,f,g-f):"";if(void 0===m)var m=f;else m+=String.fromCharCode(0),m+=f;f=g+1}}else{m=Array(e);for(k=0;k<e;++k)m[k]=String.fromCharCode(y[d+4+k]);m=m.join("")}S(d);return m},toWireType:function(d,e){e instanceof ArrayBuffer&&(e=new Uint8Array(e));
var f="string"==typeof e;f||e instanceof Uint8Array||e instanceof Uint8ClampedArray||e instanceof Int8Array||M("Cannot pass non-string to std::string");var k=(c&&f?()=>{for(var h=0,n=0;n<e.length;++n){var p=e.charCodeAt(n);55296<=p&&57343>=p&&(p=65536+((p&1023)<<10)|e.charCodeAt(++n)&1023);127>=p?++h:h=2047>=p?h+2:65535>=p?h+3:h+4}return h}:()=>e.length)(),g=Pb(4+k+1);D[g>>2]=k;if(c&&f)ka(e,g+4,k+1);else if(f)for(f=0;f<k;++f){var m=e.charCodeAt(f);255<m&&(S(g),M("String has UTF-16 code units that do not fit in 8 bits"));
y[g+4+f]=m}else for(f=0;f<k;++f)y[g+4+f]=e[f];null!==d&&d.push(S,g);return g},argPackAdvance:8,readValueFromPointer:ib,$:function(d){S(d)}})},i:function(b,a,c){c=O(c);if(2===a){var d=oa;var e=pa;var f=qa;var k=()=>va;var g=1}else 4===a&&(d=ra,e=sa,f=ta,k=()=>D,g=2);W(b,{name:c,fromWireType:function(m){for(var h=D[m>>2],n=k(),p,r=m+4,u=0;u<=h;++u){var t=m+4+u*a;if(u==h||0==n[t>>g])r=d(r,t-r),void 0===p?p=r:(p+=String.fromCharCode(0),p+=r),r=t+a}S(m);return p},toWireType:function(m,h){"string"!=typeof h&&
M("Cannot pass non-string to C++ string type "+c);var n=f(h),p=Pb(4+n+a);D[p>>2]=n>>g;e(h,p+4,n+a);null!==m&&m.push(S,p);return p},argPackAdvance:8,readValueFromPointer:ib,$:function(m){S(m)}})},h:function(b,a,c,d,e,f){gb[b]={name:O(a),ma:Z(c,d),ba:Z(e,f),pa:[]}},g:function(b,a,c,d,e,f,k,g,m,h){gb[b].pa.push({Ca:O(a),Ha:c,Fa:Z(d,e),Ga:f,Na:k,Ma:Z(g,m),Oa:h})},C:function(b,a){a=O(a);W(b,{Ja:!0,name:a,argPackAdvance:0,fromWireType:function(){},toWireType:function(){}})},F:function(b,a,c,d,e){b=Ib[b];
a=N(a);c=Hb(c);var f=[];B[d>>2]=Pa(f);return b(a,c,f,e)},H:function(b,a,c,d){b=Ib[b];a=N(a);c=Hb(c);b(a,c,null,d)},G:Cb,s:function(b,a){var c=Kb(b,a),d=c[0];a=d.name+"_$"+c.slice(1).map(function(k){return k.name}).join("_")+"$";var e=Lb[a];if(void 0!==e)return e;var f=Array(b-1);e=Jb((k,g,m,h)=>{for(var n=0,p=0;p<b-1;++p)f[p]=c[p+1].readValueFromPointer(h+n),n+=c[p+1].argPackAdvance;k=k[g].apply(k,f);for(p=0;p<b-1;++p)c[p+1].Aa&&c[p+1].Aa(f[p]);if(!d.Ja)return d.toWireType(m,k)});return Lb[a]=e},
D:function(b){4<b&&(K[b].na+=1)},E:function(b){var a=N(b);hb(a);Cb(b)},f:function(){w("")},x:function(b,a,c){y.copyWithin(b,a,a+c)},w:function(b){var a=y.length;b>>>=0;if(2147483648<b)return!1;for(var c=1;4>=c;c*=2){var d=a*(1+.2/c);d=Math.min(d,b+100663296);var e=Math;d=Math.max(b,d);e=e.min.call(e,2147483648,d+(65536-d%65536)%65536);a:{try{fa.grow(e-ua.byteLength+65535>>>16);ya();var f=1;break a}catch(k){}f=void 0}if(f)return!0}return!1},z:function(){return 52},t:function(){return 70},y:function(b,
a,c,d){for(var e=0,f=0;f<c;f++){var k=D[a>>2],g=D[a+4>>2];a+=8;for(var m=0;m<g;m++){var h=y[k+m],n=Mb[b];0===h||10===h?((1===b?ea:v)(na(n,0)),n.length=0):n.push(h)}e+=g}D[d>>2]=e;return 0},v:function(){}};
(function(){function b(e){l.asm=e.exports;fa=l.asm.I;ya();E=l.asm.O;Aa.unshift(l.asm.J);F--;0==F&&(null!==Ca&&(clearInterval(Ca),Ca=null),G&&(e=G,G=null,e()))}function a(e){b(e.instance)}function c(e){return Ga().then(function(f){return WebAssembly.instantiate(f,d)}).then(function(f){return f}).then(e,function(f){v("failed to asynchronously prepare wasm: "+f);w(f)})}var d={a:Qb};F++;if(l.instantiateWasm)try{return l.instantiateWasm(d,b)}catch(e){return v("Module.instantiateWasm callback failed with error: "+
e),!1}(function(){return"function"!=typeof WebAssembly.instantiateStreaming||Da()||"function"!=typeof fetch?c(a):fetch(H,{credentials:"same-origin"}).then(function(e){return WebAssembly.instantiateStreaming(e,d).then(a,function(f){v("wasm streaming compile failed: "+f);v("falling back to ArrayBuffer instantiation");return c(a)})})})().catch(ba);return{}})();l.___wasm_call_ctors=function(){return(l.___wasm_call_ctors=l.asm.J).apply(null,arguments)};
var Pb=l._malloc=function(){return(Pb=l._malloc=l.asm.K).apply(null,arguments)},S=l._free=function(){return(S=l._free=l.asm.L).apply(null,arguments)},Wa=l.___getTypeName=function(){return(Wa=l.___getTypeName=l.asm.M).apply(null,arguments)};l.___embind_register_native_and_builtin_types=function(){return(l.___embind_register_native_and_builtin_types=l.asm.N).apply(null,arguments)};
var la=l.stackSave=function(){return(la=l.stackSave=l.asm.P).apply(null,arguments)},ma,ja=l.stackAlloc=function(){return(ja=l.stackAlloc=l.asm.Q).apply(null,arguments)};l.___cxa_is_pointer_type=function(){return(l.___cxa_is_pointer_type=l.asm.R).apply(null,arguments)};l.dynCall_jiji=function(){return(l.dynCall_jiji=l.asm.S).apply(null,arguments)};l.cwrap=function(b,a,c,d){c=c||[];var e=c.every(function(f){return"number"===f});return"string"!==a&&e&&!d?l["_"+b]:function(){return ia(b,a,c,arguments)}};
l.setValue=function(b,a,c="i8"){c.endsWith("*")&&(c="i32");switch(c){case "i1":x[b>>0]=a;break;case "i8":x[b>>0]=a;break;case "i16":A[b>>1]=a;break;case "i32":B[b>>2]=a;break;case "i64":Ha=[a>>>0,(I=a,1<=+Math.abs(I)?0<I?(Math.min(+Math.floor(I/4294967296),4294967295)|0)>>>0:~~+Math.ceil((I-+(~~I>>>0))/4294967296)>>>0:0)];B[b>>2]=Ha[0];B[b+4>>2]=Ha[1];break;case "float":wa[b>>2]=a;break;case "double":xa[b>>3]=a;break;default:w("invalid type for setValue: "+c)}};var Rb;
G=function Sb(){Rb||Tb();Rb||(G=Sb)};function Tb(){0<F||(Ia(za),0<F||Rb||(Rb=!0,l.calledRun=!0,ha||(Ia(Aa),aa(l),Ia(Ba))))}l.run=Tb;Tb();


  return yoga.ready
}
);
})();
/* harmony default export */ const dist_yoga = (yoga);
;// CONCATENATED MODULE: ./node_modules/yoga-wasm-web/dist/index.js
function s(e,t){return t}async function dist_c(e){let t=await dist_yoga({instantiateWasm(r,a){return WebAssembly.instantiate(e,r).then(n=>{a(n.instance||n)}),{}},locateFile(){return""}});return entry(s,t)}async function l(e){let t=await o({instantiateWasm(r,a){return WebAssembly.instantiateStreaming(e,r).then(n=>{a(n.instance||n)}),{}},locateFile(){return""}});return i(s,t)}

;// CONCATENATED MODULE: ./node_modules/@resvg/resvg-wasm/index.mjs
// wasm/dist/index.js
var wasm;
var heap = new Array(32).fill(void 0);
heap.push(void 0, null, true, false);
function getObject(idx) {
  return heap[idx];
}
var WASM_VECTOR_LEN = 0;
var cachegetUint8Memory0 = null;
function getUint8Memory0() {
  if (cachegetUint8Memory0 === null || cachegetUint8Memory0.buffer !== wasm.memory.buffer) {
    cachegetUint8Memory0 = new Uint8Array(wasm.memory.buffer);
  }
  return cachegetUint8Memory0;
}
var cachedTextEncoder = new TextEncoder("utf-8");
var encodeString = typeof cachedTextEncoder.encodeInto === "function" ? function(arg, view) {
  return cachedTextEncoder.encodeInto(arg, view);
} : function(arg, view) {
  const buf = cachedTextEncoder.encode(arg);
  view.set(buf);
  return {
    read: arg.length,
    written: buf.length
  };
};
function passStringToWasm0(arg, malloc, realloc) {
  if (realloc === void 0) {
    const buf = cachedTextEncoder.encode(arg);
    const ptr2 = malloc(buf.length);
    getUint8Memory0().subarray(ptr2, ptr2 + buf.length).set(buf);
    WASM_VECTOR_LEN = buf.length;
    return ptr2;
  }
  let len = arg.length;
  let ptr = malloc(len);
  const mem = getUint8Memory0();
  let offset = 0;
  for (; offset < len; offset++) {
    const code = arg.charCodeAt(offset);
    if (code > 127)
      break;
    mem[ptr + offset] = code;
  }
  if (offset !== len) {
    if (offset !== 0) {
      arg = arg.slice(offset);
    }
    ptr = realloc(ptr, len, len = offset + arg.length * 3);
    const view = getUint8Memory0().subarray(ptr + offset, ptr + len);
    const ret = encodeString(arg, view);
    offset += ret.written;
  }
  WASM_VECTOR_LEN = offset;
  return ptr;
}
function isLikeNone(x) {
  return x === void 0 || x === null;
}
var cachegetInt32Memory0 = null;
function getInt32Memory0() {
  if (cachegetInt32Memory0 === null || cachegetInt32Memory0.buffer !== wasm.memory.buffer) {
    cachegetInt32Memory0 = new Int32Array(wasm.memory.buffer);
  }
  return cachegetInt32Memory0;
}
var heap_next = heap.length;
function addHeapObject(obj) {
  if (heap_next === heap.length)
    heap.push(heap.length + 1);
  const idx = heap_next;
  heap_next = heap[idx];
  heap[idx] = obj;
  return idx;
}
function dropObject(idx) {
  if (idx < 36)
    return;
  heap[idx] = heap_next;
  heap_next = idx;
}
function takeObject(idx) {
  const ret = getObject(idx);
  dropObject(idx);
  return ret;
}
var cachedTextDecoder = new TextDecoder("utf-8", { ignoreBOM: true, fatal: true });
cachedTextDecoder.decode();
function getStringFromWasm0(ptr, len) {
  return cachedTextDecoder.decode(getUint8Memory0().subarray(ptr, ptr + len));
}
var Resvg = class {
  static __wrap(ptr) {
    const obj = Object.create(Resvg.prototype);
    obj.ptr = ptr;
    return obj;
  }
  __destroy_into_raw() {
    const ptr = this.ptr;
    this.ptr = 0;
    return ptr;
  }
  free() {
    const ptr = this.__destroy_into_raw();
    wasm.__wbg_resvg_free(ptr);
  }
  get width() {
    var ret = wasm.resvg_width(this.ptr);
    return ret;
  }
  get height() {
    var ret = wasm.resvg_height(this.ptr);
    return ret;
  }
  toString() {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      wasm.resvg_toString(retptr, this.ptr);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      return getStringFromWasm0(r0, r1);
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
      wasm.__wbindgen_free(r0, r1);
    }
  }
  constructor(svg, options) {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      var ptr0 = isLikeNone(options) ? 0 : passStringToWasm0(options, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
      var len0 = WASM_VECTOR_LEN;
      wasm.resvg_new(retptr, addHeapObject(svg), ptr0, len0);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var r2 = getInt32Memory0()[retptr / 4 + 2];
      if (r2) {
        throw takeObject(r1);
      }
      return Resvg.__wrap(r0);
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
    }
  }
  render() {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      wasm.resvg_render(retptr, this.ptr);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var r2 = getInt32Memory0()[retptr / 4 + 2];
      if (r2) {
        throw takeObject(r1);
      }
      return takeObject(r0);
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
    }
  }
};
async function resvg_wasm_load(module, imports) {
  if (typeof Response === "function" && module instanceof Response) {
    if (typeof WebAssembly.instantiateStreaming === "function") {
      try {
        return await WebAssembly.instantiateStreaming(module, imports);
      } catch (e) {
        if (module.headers.get("Content-Type") != "application/wasm") {
          console.warn("`WebAssembly.instantiateStreaming` failed because your server does not serve wasm with `application/wasm` MIME type. Falling back to `WebAssembly.instantiate` which is slower. Original error:\n", e);
        } else {
          throw e;
        }
      }
    }
    const bytes = await module.arrayBuffer();
    return await WebAssembly.instantiate(bytes, imports);
  } else {
    const instance = await WebAssembly.instantiate(module, imports);
    if (instance instanceof WebAssembly.Instance) {
      return { instance, module };
    } else {
      return instance;
    }
  }
}
async function init(input) {
  if (typeof input === "undefined") {
    input = new URL("index_bg.wasm", void 0);
  }
  const imports = {};
  imports.wbg = {};
  imports.wbg.__wbg_new_f2ab1043dfd47875 = function(arg0, arg1) {
    var ret = new TypeError(getStringFromWasm0(arg0, arg1));
    return addHeapObject(ret);
  };
  imports.wbg.__wbg_instanceof_Uint8Array_8a8537f46e056474 = function(arg0) {
    var ret = getObject(arg0) instanceof Uint8Array;
    return ret;
  };
  imports.wbg.__wbindgen_string_get = function(arg0, arg1) {
    const obj = getObject(arg1);
    var ret = typeof obj === "string" ? obj : void 0;
    var ptr0 = isLikeNone(ret) ? 0 : passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    var len0 = WASM_VECTOR_LEN;
    getInt32Memory0()[arg0 / 4 + 1] = len0;
    getInt32Memory0()[arg0 / 4 + 0] = ptr0;
  };
  imports.wbg.__wbg_length_30803400a8f15c59 = function(arg0) {
    var ret = getObject(arg0).length;
    return ret;
  };
  imports.wbg.__wbindgen_memory = function() {
    var ret = wasm.memory;
    return addHeapObject(ret);
  };
  imports.wbg.__wbg_buffer_5e74a88a1424a2e0 = function(arg0) {
    var ret = getObject(arg0).buffer;
    return addHeapObject(ret);
  };
  imports.wbg.__wbg_new_e3b800e570795b3c = function(arg0) {
    var ret = new Uint8Array(getObject(arg0));
    return addHeapObject(ret);
  };
  imports.wbg.__wbindgen_object_drop_ref = function(arg0) {
    takeObject(arg0);
  };
  imports.wbg.__wbg_set_5b8081e9d002f0df = function(arg0, arg1, arg2) {
    getObject(arg0).set(getObject(arg1), arg2 >>> 0);
  };
  imports.wbg.__wbg_newwithbyteoffsetandlength_278ec7532799393a = function(arg0, arg1, arg2) {
    var ret = new Uint8Array(getObject(arg0), arg1 >>> 0, arg2 >>> 0);
    return addHeapObject(ret);
  };
  imports.wbg.__wbindgen_throw = function(arg0, arg1) {
    throw new Error(getStringFromWasm0(arg0, arg1));
  };
  if (typeof input === "string" || typeof Request === "function" && input instanceof Request || typeof URL === "function" && input instanceof URL) {
    input = fetch(input);
  }
  const { instance, module } = await resvg_wasm_load(await input, imports);
  wasm = instance.exports;
  init.__wbindgen_wasm_module = module;
  return wasm;
}
var dist_default = init;

// wasm-binding.ts
var initialized = false;
var initWasm = async (module_or_path) => {
  if (initialized) {
    throw new Error("Already initialized. The `initWasm()` function can be used only once.");
  }
  await dist_default(await module_or_path);
  initialized = true;
};
var Resvg2 = class extends Resvg {
  constructor(svg, options) {
    if (!initialized)
      throw new Error("WASM has not been initialized. Call `initWasm()` function.");
    super(svg, JSON.stringify(options));
  }
};


// EXTERNAL MODULE: ./node_modules/@vercel/og/vendor/resvg.simd.wasm?module
var resvg_simdmodule = __webpack_require__(966);
// EXTERNAL MODULE: ./node_modules/@vercel/og/vendor/yoga.wasm?module
var yogamodule = __webpack_require__(744);
;// CONCATENATED MODULE: ./node_modules/@vercel/og/dist/index.js
var dist_v=String.fromCharCode(8205),j=/\uFE0F/g;function og_dist_c(t){return y(t.indexOf(dist_v)<0?t.replace(j,""):t)}function y(t){for(var n=[],e=0,o=0,s=0;s<t.length;)e=t.charCodeAt(s++),o?(n.push((65536+(o-55296<<10)+(e-56320)).toString(16)),o=0):55296<=e&&e<=56319?o=e:n.push(e.toString(16));return n.join("-")}var r={twemoji:t=>"https://twemoji.maxcdn.com/v/latest/svg/"+t.toLowerCase()+".svg",openmoji:"https://cdn.jsdelivr.net/npm/@svgmoji/openmoji@2.0.0/svg/",blobmoji:"https://cdn.jsdelivr.net/npm/@svgmoji/blob@2.0.0/svg/",noto:"https://cdn.jsdelivr.net/gh/svgmoji/svgmoji/packages/svgmoji__noto/svg/",fluent:t=>"https://cdn.jsdelivr.net/gh/shuding/fluentui-emoji-unicode/assets/"+t.toLowerCase()+"_color.svg",fluentFlat:t=>"https://cdn.jsdelivr.net/gh/shuding/fluentui-emoji-unicode/assets/"+t.toLowerCase()+"_flat.svg"};function m(t,n){(!n||!r[n])&&(n="twemoji");let e=r[n];return fetch(typeof e=="function"?e(t):`${e}${t.toUpperCase()}.svg`)}var C=initWasm(resvg_simdmodule),dist_x=dist_c(yogamodule).then(t=>Tu(t)),_=fetch(/* asset import */ new __webpack_require__.U(__webpack_require__(742))).then(t=>t.arrayBuffer()),f,u,dist_R=((u=(f=globalThis==null?void 0:globalThis.process)==null?void 0:f.env)==null?void 0:u.NODE_ENV)==="development",dist_l={zh:"Noto+Sans+SC",ja:"Noto+Sans+JP",ko:"Noto+Sans+KR",th:"Noto+Sans+Thai",he:"Noto+Sans+Hebrew",ar:"Noto+Sans+Arabic",bn:"Noto+Sans+Bengali",ta:"Noto+Sans+Tamil",te:"Noto+Sans+Telugu",ml:"Noto+Sans+Malayalam",devanagari:"Noto+Sans+Devanagari",unknown:"Noto+Sans"};async function k(t,n){if(!t||!n)return;let e=`https://fonts.googleapis.com/css2?family=${t}&text=${encodeURIComponent(n)}`,s=(await(await fetch(e,{headers:{"User-Agent":"Mozilla/5.0 (Macintosh; U; Intel Mac OS X 10_6_8; de-at) AppleWebKit/533.21.1 (KHTML, like Gecko) Version/5.0.5 Safari/533.21.1"}})).text()).match(/src: url\((.+)\) format\('(opentype|truetype)'\)/);if(!s)throw new Error("Failed to load font");return fetch(s[1]).then(a=>a.arrayBuffer())}var g=new Map,F=({emoji:t})=>{let n=async(e,o)=>{if(e==="emoji")return"data:image/svg+xml;base64,"+btoa(await(await m(og_dist_c(o),t)).text());dist_l[e]||(e="unknown");try{let s=await k(dist_l[e],o);if(s)return{name:`satori_${e}_fallback_${o}`,data:s,weight:400,style:"normal"}}catch(s){console.error("Failed to load dynamic font for",o,". Error:",s)}};return async(...e)=>{let o=JSON.stringify(e),s=g.get(o);if(s)return s;let a=await n(...e);return g.set(o,a),a}},p=class{constructor(n,e={}){let o=Object.assign({width:1200,height:630,debug:!1},e),s=new ReadableStream({async start(a){await dist_x,await C;let d=await _,h=await gu(n,{width:o.width,height:o.height,debug:o.debug,fonts:o.fonts||[{name:"sans serif",data:d,weight:700,style:"normal"}],loadAdditionalAsset:F({emoji:o.emoji})}),w=new Resvg2(h,{fitTo:{mode:"width",value:o.width}});a.enqueue(w.render()),a.close()}});return new Response(s,{headers:{"content-type":"image/png","cache-control":dist_R?"no-cache, no-store":"public, immutable, no-transform, max-age=31536000",...o.headers},status:o.status,statusText:o.statusText})}};
/*! Copyright Twitter Inc. and other contributors. Licensed under MIT */
//# sourceMappingURL=index.js.map
// EXTERNAL MODULE: ./node_modules/eventemitter3/index.js
var eventemitter3 = __webpack_require__(819);
;// CONCATENATED MODULE: ./node_modules/p-queue/node_modules/p-timeout/index.js
class p_timeout_TimeoutError extends Error {
	constructor(message) {
		super(message);
		this.name = 'TimeoutError';
	}
}

/**
An error to be thrown when the request is aborted by AbortController.
DOMException is thrown instead of this Error when DOMException is available.
*/
class AbortError extends Error {
	constructor(message) {
		super();
		this.name = 'AbortError';
		this.message = message;
	}
}

/**
TODO: Remove AbortError and just throw DOMException when targeting Node 18.
*/
const getDOMException = errorMessage => globalThis.DOMException === undefined ?
	new AbortError(errorMessage) :
	new DOMException(errorMessage);

/**
TODO: Remove below function and just 'reject(signal.reason)' when targeting Node 18.
*/
const getAbortedReason = signal => {
	const reason = signal.reason === undefined ?
		getDOMException('This operation was aborted.') :
		signal.reason;

	return reason instanceof Error ? reason : getDOMException(reason);
};

function p_timeout_pTimeout(promise, milliseconds, fallback, options) {
	let timer;

	const cancelablePromise = new Promise((resolve, reject) => {
		if (typeof milliseconds !== 'number' || Math.sign(milliseconds) !== 1) {
			throw new TypeError(`Expected \`milliseconds\` to be a positive number, got \`${milliseconds}\``);
		}

		if (milliseconds === Number.POSITIVE_INFINITY) {
			resolve(promise);
			return;
		}

		options = {
			customTimers: {setTimeout, clearTimeout},
			...options
		};

		if (options.signal) {
			const {signal} = options;
			if (signal.aborted) {
				reject(getAbortedReason(signal));
			}

			signal.addEventListener('abort', () => {
				reject(getAbortedReason(signal));
			});
		}

		timer = options.customTimers.setTimeout.call(undefined, () => {
			if (typeof fallback === 'function') {
				try {
					resolve(fallback());
				} catch (error) {
					reject(error);
				}

				return;
			}

			const message = typeof fallback === 'string' ? fallback : `Promise timed out after ${milliseconds} milliseconds`;
			const timeoutError = fallback instanceof Error ? fallback : new p_timeout_TimeoutError(message);

			if (typeof promise.cancel === 'function') {
				promise.cancel();
			}

			reject(timeoutError);
		}, milliseconds);

		(async () => {
			try {
				resolve(await promise);
			} catch (error) {
				reject(error);
			} finally {
				options.customTimers.clearTimeout.call(undefined, timer);
			}
		})();
	});

	cancelablePromise.clear = () => {
		clearTimeout(timer);
		timer = undefined;
	};

	return cancelablePromise;
}

;// CONCATENATED MODULE: ./node_modules/p-queue/dist/priority-queue.js
var __classPrivateFieldGet = (undefined && undefined.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _PriorityQueue_queue;

class priority_queue_PriorityQueue {
    constructor() {
        _PriorityQueue_queue.set(this, []);
    }
    enqueue(run, options) {
        options = {
            priority: 0,
            ...options,
        };
        const element = {
            priority: options.priority,
            run,
        };
        if (this.size && __classPrivateFieldGet(this, _PriorityQueue_queue, "f")[this.size - 1].priority >= options.priority) {
            __classPrivateFieldGet(this, _PriorityQueue_queue, "f").push(element);
            return;
        }
        const index = lowerBound(__classPrivateFieldGet(this, _PriorityQueue_queue, "f"), element, (a, b) => b.priority - a.priority);
        __classPrivateFieldGet(this, _PriorityQueue_queue, "f").splice(index, 0, element);
    }
    dequeue() {
        const item = __classPrivateFieldGet(this, _PriorityQueue_queue, "f").shift();
        return item === null || item === void 0 ? void 0 : item.run;
    }
    filter(options) {
        return __classPrivateFieldGet(this, _PriorityQueue_queue, "f").filter((element) => element.priority === options.priority).map((element) => element.run);
    }
    get size() {
        return __classPrivateFieldGet(this, _PriorityQueue_queue, "f").length;
    }
}
_PriorityQueue_queue = new WeakMap();

;// CONCATENATED MODULE: ./node_modules/p-queue/dist/index.js
var __classPrivateFieldSet = (undefined && undefined.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var dist_classPrivateFieldGet = (undefined && undefined.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _PQueue_instances, _PQueue_carryoverConcurrencyCount, _PQueue_isIntervalIgnored, _PQueue_intervalCount, _PQueue_intervalCap, _PQueue_interval, _PQueue_intervalEnd, _PQueue_intervalId, _PQueue_timeoutId, _PQueue_queue, _PQueue_queueClass, _PQueue_pending, _PQueue_concurrency, _PQueue_isPaused, _PQueue_throwOnTimeout, _PQueue_doesIntervalAllowAnother_get, _PQueue_doesConcurrentAllowAnother_get, _PQueue_next, _PQueue_onResumeInterval, _PQueue_isIntervalPaused_get, _PQueue_tryToStartAnother, _PQueue_initializeIntervalIfNeeded, _PQueue_onInterval, _PQueue_processQueue, _PQueue_throwOnAbort, _PQueue_onEvent;



/**
The error thrown by `queue.add()` when a job is aborted before it is run. See `signal`.
*/
class dist_AbortError extends Error {
}
/**
Promise queue with concurrency control.
*/
class PQueue extends (/* unused pure expression or super */ null && (EventEmitter)) {
    // TODO: The `throwOnTimeout` option should affect the return types of `add()` and `addAll()`
    constructor(options) {
        var _a, _b, _c, _d;
        super();
        _PQueue_instances.add(this);
        _PQueue_carryoverConcurrencyCount.set(this, void 0);
        _PQueue_isIntervalIgnored.set(this, void 0);
        _PQueue_intervalCount.set(this, 0);
        _PQueue_intervalCap.set(this, void 0);
        _PQueue_interval.set(this, void 0);
        _PQueue_intervalEnd.set(this, 0);
        _PQueue_intervalId.set(this, void 0);
        _PQueue_timeoutId.set(this, void 0);
        _PQueue_queue.set(this, void 0);
        _PQueue_queueClass.set(this, void 0);
        _PQueue_pending.set(this, 0);
        // The `!` is needed because of https://github.com/microsoft/TypeScript/issues/32194
        _PQueue_concurrency.set(this, void 0);
        _PQueue_isPaused.set(this, void 0);
        _PQueue_throwOnTimeout.set(this, void 0);
        /**
        Per-operation timeout in milliseconds. Operations fulfill once `timeout` elapses if they haven't already.
    
        Applies to each future operation.
        */
        Object.defineProperty(this, "timeout", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
        options = {
            carryoverConcurrencyCount: false,
            intervalCap: Number.POSITIVE_INFINITY,
            interval: 0,
            concurrency: Number.POSITIVE_INFINITY,
            autoStart: true,
            queueClass: PriorityQueue,
            ...options,
        };
        if (!(typeof options.intervalCap === 'number' && options.intervalCap >= 1)) {
            throw new TypeError(`Expected \`intervalCap\` to be a number from 1 and up, got \`${(_b = (_a = options.intervalCap) === null || _a === void 0 ? void 0 : _a.toString()) !== null && _b !== void 0 ? _b : ''}\` (${typeof options.intervalCap})`);
        }
        if (options.interval === undefined || !(Number.isFinite(options.interval) && options.interval >= 0)) {
            throw new TypeError(`Expected \`interval\` to be a finite number >= 0, got \`${(_d = (_c = options.interval) === null || _c === void 0 ? void 0 : _c.toString()) !== null && _d !== void 0 ? _d : ''}\` (${typeof options.interval})`);
        }
        __classPrivateFieldSet(this, _PQueue_carryoverConcurrencyCount, options.carryoverConcurrencyCount, "f");
        __classPrivateFieldSet(this, _PQueue_isIntervalIgnored, options.intervalCap === Number.POSITIVE_INFINITY || options.interval === 0, "f");
        __classPrivateFieldSet(this, _PQueue_intervalCap, options.intervalCap, "f");
        __classPrivateFieldSet(this, _PQueue_interval, options.interval, "f");
        __classPrivateFieldSet(this, _PQueue_queue, new options.queueClass(), "f");
        __classPrivateFieldSet(this, _PQueue_queueClass, options.queueClass, "f");
        this.concurrency = options.concurrency;
        this.timeout = options.timeout;
        __classPrivateFieldSet(this, _PQueue_throwOnTimeout, options.throwOnTimeout === true, "f");
        __classPrivateFieldSet(this, _PQueue_isPaused, options.autoStart === false, "f");
    }
    get concurrency() {
        return dist_classPrivateFieldGet(this, _PQueue_concurrency, "f");
    }
    set concurrency(newConcurrency) {
        if (!(typeof newConcurrency === 'number' && newConcurrency >= 1)) {
            throw new TypeError(`Expected \`concurrency\` to be a number from 1 and up, got \`${newConcurrency}\` (${typeof newConcurrency})`);
        }
        __classPrivateFieldSet(this, _PQueue_concurrency, newConcurrency, "f");
        dist_classPrivateFieldGet(this, _PQueue_instances, "m", _PQueue_processQueue).call(this);
    }
    async add(function_, options = {}) {
        options = {
            timeout: this.timeout,
            throwOnTimeout: dist_classPrivateFieldGet(this, _PQueue_throwOnTimeout, "f"),
            ...options,
        };
        return new Promise((resolve, reject) => {
            dist_classPrivateFieldGet(this, _PQueue_queue, "f").enqueue(async () => {
                var _a;
                var _b, _c;
                __classPrivateFieldSet(this, _PQueue_pending, (_b = dist_classPrivateFieldGet(this, _PQueue_pending, "f"), _b++, _b), "f");
                __classPrivateFieldSet(this, _PQueue_intervalCount, (_c = dist_classPrivateFieldGet(this, _PQueue_intervalCount, "f"), _c++, _c), "f");
                try {
                    // TODO: Use options.signal?.throwIfAborted() when targeting Node.js 18
                    if ((_a = options.signal) === null || _a === void 0 ? void 0 : _a.aborted) {
                        // TODO: Use ABORT_ERR code when targeting Node.js 16 (https://nodejs.org/docs/latest-v16.x/api/errors.html#abort_err)
                        throw new dist_AbortError('The task was aborted.');
                    }
                    let operation = function_({ signal: options.signal });
                    if (options.timeout) {
                        operation = pTimeout(Promise.resolve(operation), options.timeout);
                    }
                    if (options.signal) {
                        operation = Promise.race([operation, dist_classPrivateFieldGet(this, _PQueue_instances, "m", _PQueue_throwOnAbort).call(this, options.signal)]);
                    }
                    const result = await operation;
                    resolve(result);
                    this.emit('completed', result);
                }
                catch (error) {
                    if (error instanceof TimeoutError && !options.throwOnTimeout) {
                        resolve();
                        return;
                    }
                    reject(error);
                    this.emit('error', error);
                }
                finally {
                    dist_classPrivateFieldGet(this, _PQueue_instances, "m", _PQueue_next).call(this);
                }
            }, options);
            this.emit('add');
            dist_classPrivateFieldGet(this, _PQueue_instances, "m", _PQueue_tryToStartAnother).call(this);
        });
    }
    async addAll(functions, options) {
        return Promise.all(functions.map(async (function_) => this.add(function_, options)));
    }
    /**
    Start (or resume) executing enqueued tasks within concurrency limit. No need to call this if queue is not paused (via `options.autoStart = false` or by `.pause()` method.)
    */
    start() {
        if (!dist_classPrivateFieldGet(this, _PQueue_isPaused, "f")) {
            return this;
        }
        __classPrivateFieldSet(this, _PQueue_isPaused, false, "f");
        dist_classPrivateFieldGet(this, _PQueue_instances, "m", _PQueue_processQueue).call(this);
        return this;
    }
    /**
    Put queue execution on hold.
    */
    pause() {
        __classPrivateFieldSet(this, _PQueue_isPaused, true, "f");
    }
    /**
    Clear the queue.
    */
    clear() {
        __classPrivateFieldSet(this, _PQueue_queue, new (dist_classPrivateFieldGet(this, _PQueue_queueClass, "f"))(), "f");
    }
    /**
    Can be called multiple times. Useful if you for example add additional items at a later time.

    @returns A promise that settles when the queue becomes empty.
    */
    async onEmpty() {
        // Instantly resolve if the queue is empty
        if (dist_classPrivateFieldGet(this, _PQueue_queue, "f").size === 0) {
            return;
        }
        await dist_classPrivateFieldGet(this, _PQueue_instances, "m", _PQueue_onEvent).call(this, 'empty');
    }
    /**
    @returns A promise that settles when the queue size is less than the given limit: `queue.size < limit`.

    If you want to avoid having the queue grow beyond a certain size you can `await queue.onSizeLessThan()` before adding a new item.

    Note that this only limits the number of items waiting to start. There could still be up to `concurrency` jobs already running that this call does not include in its calculation.
    */
    async onSizeLessThan(limit) {
        // Instantly resolve if the queue is empty.
        if (dist_classPrivateFieldGet(this, _PQueue_queue, "f").size < limit) {
            return;
        }
        await dist_classPrivateFieldGet(this, _PQueue_instances, "m", _PQueue_onEvent).call(this, 'next', () => dist_classPrivateFieldGet(this, _PQueue_queue, "f").size < limit);
    }
    /**
    The difference with `.onEmpty` is that `.onIdle` guarantees that all work from the queue has finished. `.onEmpty` merely signals that the queue is empty, but it could mean that some promises haven't completed yet.

    @returns A promise that settles when the queue becomes empty, and all promises have completed; `queue.size === 0 && queue.pending === 0`.
    */
    async onIdle() {
        // Instantly resolve if none pending and if nothing else is queued
        if (dist_classPrivateFieldGet(this, _PQueue_pending, "f") === 0 && dist_classPrivateFieldGet(this, _PQueue_queue, "f").size === 0) {
            return;
        }
        await dist_classPrivateFieldGet(this, _PQueue_instances, "m", _PQueue_onEvent).call(this, 'idle');
    }
    /**
    Size of the queue, the number of queued items waiting to run.
    */
    get size() {
        return dist_classPrivateFieldGet(this, _PQueue_queue, "f").size;
    }
    /**
    Size of the queue, filtered by the given options.

    For example, this can be used to find the number of items remaining in the queue with a specific priority level.
    */
    sizeBy(options) {
        // eslint-disable-next-line unicorn/no-array-callback-reference
        return dist_classPrivateFieldGet(this, _PQueue_queue, "f").filter(options).length;
    }
    /**
    Number of running items (no longer in the queue).
    */
    get pending() {
        return dist_classPrivateFieldGet(this, _PQueue_pending, "f");
    }
    /**
    Whether the queue is currently paused.
    */
    get isPaused() {
        return dist_classPrivateFieldGet(this, _PQueue_isPaused, "f");
    }
}
_PQueue_carryoverConcurrencyCount = new WeakMap(), _PQueue_isIntervalIgnored = new WeakMap(), _PQueue_intervalCount = new WeakMap(), _PQueue_intervalCap = new WeakMap(), _PQueue_interval = new WeakMap(), _PQueue_intervalEnd = new WeakMap(), _PQueue_intervalId = new WeakMap(), _PQueue_timeoutId = new WeakMap(), _PQueue_queue = new WeakMap(), _PQueue_queueClass = new WeakMap(), _PQueue_pending = new WeakMap(), _PQueue_concurrency = new WeakMap(), _PQueue_isPaused = new WeakMap(), _PQueue_throwOnTimeout = new WeakMap(), _PQueue_instances = new WeakSet(), _PQueue_doesIntervalAllowAnother_get = function _PQueue_doesIntervalAllowAnother_get() {
    return dist_classPrivateFieldGet(this, _PQueue_isIntervalIgnored, "f") || dist_classPrivateFieldGet(this, _PQueue_intervalCount, "f") < dist_classPrivateFieldGet(this, _PQueue_intervalCap, "f");
}, _PQueue_doesConcurrentAllowAnother_get = function _PQueue_doesConcurrentAllowAnother_get() {
    return dist_classPrivateFieldGet(this, _PQueue_pending, "f") < dist_classPrivateFieldGet(this, _PQueue_concurrency, "f");
}, _PQueue_next = function _PQueue_next() {
    var _a;
    __classPrivateFieldSet(this, _PQueue_pending, (_a = dist_classPrivateFieldGet(this, _PQueue_pending, "f"), _a--, _a), "f");
    dist_classPrivateFieldGet(this, _PQueue_instances, "m", _PQueue_tryToStartAnother).call(this);
    this.emit('next');
}, _PQueue_onResumeInterval = function _PQueue_onResumeInterval() {
    dist_classPrivateFieldGet(this, _PQueue_instances, "m", _PQueue_onInterval).call(this);
    dist_classPrivateFieldGet(this, _PQueue_instances, "m", _PQueue_initializeIntervalIfNeeded).call(this);
    __classPrivateFieldSet(this, _PQueue_timeoutId, undefined, "f");
}, _PQueue_isIntervalPaused_get = function _PQueue_isIntervalPaused_get() {
    const now = Date.now();
    if (dist_classPrivateFieldGet(this, _PQueue_intervalId, "f") === undefined) {
        const delay = dist_classPrivateFieldGet(this, _PQueue_intervalEnd, "f") - now;
        if (delay < 0) {
            // Act as the interval was done
            // We don't need to resume it here because it will be resumed on line 160
            __classPrivateFieldSet(this, _PQueue_intervalCount, (dist_classPrivateFieldGet(this, _PQueue_carryoverConcurrencyCount, "f")) ? dist_classPrivateFieldGet(this, _PQueue_pending, "f") : 0, "f");
        }
        else {
            // Act as the interval is pending
            if (dist_classPrivateFieldGet(this, _PQueue_timeoutId, "f") === undefined) {
                __classPrivateFieldSet(this, _PQueue_timeoutId, setTimeout(() => {
                    dist_classPrivateFieldGet(this, _PQueue_instances, "m", _PQueue_onResumeInterval).call(this);
                }, delay), "f");
            }
            return true;
        }
    }
    return false;
}, _PQueue_tryToStartAnother = function _PQueue_tryToStartAnother() {
    if (dist_classPrivateFieldGet(this, _PQueue_queue, "f").size === 0) {
        // We can clear the interval ("pause")
        // Because we can redo it later ("resume")
        if (dist_classPrivateFieldGet(this, _PQueue_intervalId, "f")) {
            clearInterval(dist_classPrivateFieldGet(this, _PQueue_intervalId, "f"));
        }
        __classPrivateFieldSet(this, _PQueue_intervalId, undefined, "f");
        this.emit('empty');
        if (dist_classPrivateFieldGet(this, _PQueue_pending, "f") === 0) {
            this.emit('idle');
        }
        return false;
    }
    if (!dist_classPrivateFieldGet(this, _PQueue_isPaused, "f")) {
        const canInitializeInterval = !dist_classPrivateFieldGet(this, _PQueue_instances, "a", _PQueue_isIntervalPaused_get);
        if (dist_classPrivateFieldGet(this, _PQueue_instances, "a", _PQueue_doesIntervalAllowAnother_get) && dist_classPrivateFieldGet(this, _PQueue_instances, "a", _PQueue_doesConcurrentAllowAnother_get)) {
            const job = dist_classPrivateFieldGet(this, _PQueue_queue, "f").dequeue();
            if (!job) {
                return false;
            }
            this.emit('active');
            job();
            if (canInitializeInterval) {
                dist_classPrivateFieldGet(this, _PQueue_instances, "m", _PQueue_initializeIntervalIfNeeded).call(this);
            }
            return true;
        }
    }
    return false;
}, _PQueue_initializeIntervalIfNeeded = function _PQueue_initializeIntervalIfNeeded() {
    if (dist_classPrivateFieldGet(this, _PQueue_isIntervalIgnored, "f") || dist_classPrivateFieldGet(this, _PQueue_intervalId, "f") !== undefined) {
        return;
    }
    __classPrivateFieldSet(this, _PQueue_intervalId, setInterval(() => {
        dist_classPrivateFieldGet(this, _PQueue_instances, "m", _PQueue_onInterval).call(this);
    }, dist_classPrivateFieldGet(this, _PQueue_interval, "f")), "f");
    __classPrivateFieldSet(this, _PQueue_intervalEnd, Date.now() + dist_classPrivateFieldGet(this, _PQueue_interval, "f"), "f");
}, _PQueue_onInterval = function _PQueue_onInterval() {
    if (dist_classPrivateFieldGet(this, _PQueue_intervalCount, "f") === 0 && dist_classPrivateFieldGet(this, _PQueue_pending, "f") === 0 && dist_classPrivateFieldGet(this, _PQueue_intervalId, "f")) {
        clearInterval(dist_classPrivateFieldGet(this, _PQueue_intervalId, "f"));
        __classPrivateFieldSet(this, _PQueue_intervalId, undefined, "f");
    }
    __classPrivateFieldSet(this, _PQueue_intervalCount, dist_classPrivateFieldGet(this, _PQueue_carryoverConcurrencyCount, "f") ? dist_classPrivateFieldGet(this, _PQueue_pending, "f") : 0, "f");
    dist_classPrivateFieldGet(this, _PQueue_instances, "m", _PQueue_processQueue).call(this);
}, _PQueue_processQueue = function _PQueue_processQueue() {
    // eslint-disable-next-line no-empty
    while (dist_classPrivateFieldGet(this, _PQueue_instances, "m", _PQueue_tryToStartAnother).call(this)) { }
}, _PQueue_throwOnAbort = async function _PQueue_throwOnAbort(signal) {
    return new Promise((_resolve, reject) => {
        signal.addEventListener('abort', () => {
            // TODO: Reject with signal.throwIfAborted() when targeting Node.js 18
            // TODO: Use ABORT_ERR code when targeting Node.js 16 (https://nodejs.org/docs/latest-v16.x/api/errors.html#abort_err)
            reject(new dist_AbortError('The task was aborted.'));
        }, { once: true });
    });
}, _PQueue_onEvent = async function _PQueue_onEvent(event, filter) {
    return new Promise(resolve => {
        const listener = () => {
            if (filter && !filter()) {
                return;
            }
            this.off(event, listener);
            resolve();
        };
        this.on(event, listener);
    });
};

;// CONCATENATED MODULE: ./node_modules/mimic-fn/index.js
const copyProperty = (to, from, property, ignoreNonConfigurable) => {
	// `Function#length` should reflect the parameters of `to` not `from` since we keep its body.
	// `Function#prototype` is non-writable and non-configurable so can never be modified.
	if (property === 'length' || property === 'prototype') {
		return;
	}

	// `Function#arguments` and `Function#caller` should not be copied. They were reported to be present in `Reflect.ownKeys` for some devices in React Native (#41), so we explicitly ignore them here.
	if (property === 'arguments' || property === 'caller') {
		return;
	}

	const toDescriptor = Object.getOwnPropertyDescriptor(to, property);
	const fromDescriptor = Object.getOwnPropertyDescriptor(from, property);

	if (!canCopyProperty(toDescriptor, fromDescriptor) && ignoreNonConfigurable) {
		return;
	}

	Object.defineProperty(to, property, fromDescriptor);
};

// `Object.defineProperty()` throws if the property exists, is not configurable and either:
// - one its descriptors is changed
// - it is non-writable and its value is changed
const canCopyProperty = function (toDescriptor, fromDescriptor) {
	return toDescriptor === undefined || toDescriptor.configurable || (
		toDescriptor.writable === fromDescriptor.writable &&
		toDescriptor.enumerable === fromDescriptor.enumerable &&
		toDescriptor.configurable === fromDescriptor.configurable &&
		(toDescriptor.writable || toDescriptor.value === fromDescriptor.value)
	);
};

const changePrototype = (to, from) => {
	const fromPrototype = Object.getPrototypeOf(from);
	if (fromPrototype === Object.getPrototypeOf(to)) {
		return;
	}

	Object.setPrototypeOf(to, fromPrototype);
};

const wrappedToString = (withName, fromBody) => `/* Wrapped ${withName}*/\n${fromBody}`;

const toStringDescriptor = Object.getOwnPropertyDescriptor(Function.prototype, 'toString');
const toStringName = Object.getOwnPropertyDescriptor(Function.prototype.toString, 'name');

// We call `from.toString()` early (not lazily) to ensure `from` can be garbage collected.
// We use `bind()` instead of a closure for the same reason.
// Calling `from.toString()` early also allows caching it in case `to.toString()` is called several times.
const changeToString = (to, from, name) => {
	const withName = name === '' ? '' : `with ${name.trim()}() `;
	const newToString = wrappedToString.bind(null, withName, from.toString());
	// Ensure `to.toString.toString` is non-enumerable and has the same `same`
	Object.defineProperty(newToString, 'name', toStringName);
	Object.defineProperty(to, 'toString', {...toStringDescriptor, value: newToString});
};

function mimicFunction(to, from, {ignoreNonConfigurable = false} = {}) {
	const {name} = to;

	for (const property of Reflect.ownKeys(from)) {
		copyProperty(to, from, property, ignoreNonConfigurable);
	}

	changePrototype(to, from);
	changeToString(to, from, name);

	return to;
}

// EXTERNAL MODULE: ./node_modules/mem/node_modules/map-age-cleaner/dist/index.js
var dist = __webpack_require__(606);
;// CONCATENATED MODULE: ./node_modules/mem/dist/index.js


const cacheStore = new WeakMap();
/**
[Memoize](https://en.wikipedia.org/wiki/Memoization) functions - An optimization used to speed up consecutive function calls by caching the result of calls with identical input.

@param fn - Function to be memoized.

@example
```
import mem from 'mem';

let index = 0;
const counter = () => ++index;
const memoized = mem(counter);

memoized('foo');
//=> 1

// Cached as it's the same argument
memoized('foo');
//=> 1

// Not cached anymore as the arguments changed
memoized('bar');
//=> 2

memoized('bar');
//=> 2
```
*/
function mem(fn, { cacheKey, cache = new Map(), maxAge, } = {}) {
    if (typeof maxAge === 'number') {
        dist(cache);
    }
    const memoized = function (...arguments_) {
        const key = cacheKey ? cacheKey(arguments_) : arguments_[0];
        const cacheItem = cache.get(key);
        if (cacheItem) {
            return cacheItem.data; // eslint-disable-line @typescript-eslint/no-unsafe-return
        }
        const result = fn.apply(this, arguments_);
        cache.set(key, {
            data: result,
            maxAge: maxAge ? Date.now() + maxAge : Number.POSITIVE_INFINITY,
        });
        return result; // eslint-disable-line @typescript-eslint/no-unsafe-return
    };
    mimicFunction(memoized, fn, {
        ignoreNonConfigurable: true,
    });
    cacheStore.set(memoized, cache);
    return memoized;
}
/**
@returns A [decorator](https://github.com/tc39/proposal-decorators) to memoize class methods or static class methods.

@example
```
import {memDecorator} from 'mem';

class Example {
    index = 0

    @memDecorator()
    counter() {
        return ++this.index;
    }
}

class ExampleWithOptions {
    index = 0

    @memDecorator({maxAge: 1000})
    counter() {
        return ++this.index;
    }
}
```
*/
function memDecorator(options = {}) {
    const instanceMap = new WeakMap();
    return (target, propertyKey, descriptor) => {
        const input = target[propertyKey]; // eslint-disable-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
        if (typeof input !== 'function') {
            throw new TypeError('The decorated value must be a function');
        }
        delete descriptor.value;
        delete descriptor.writable;
        descriptor.get = function () {
            if (!instanceMap.has(this)) {
                const value = mem(input, options);
                instanceMap.set(this, value);
                return value;
            }
            return instanceMap.get(this);
        };
    };
}
/**
Clear all cached data of a memoized function.

@param fn - Memoized function.
*/
function memClear(fn) {
    const cache = cacheStore.get(fn);
    if (!cache) {
        throw new TypeError('Can\'t clear a function that was not memoized!');
    }
    if (typeof cache.clear !== 'function') {
        throw new TypeError('The cache Map can\'t be cleared!');
    }
    cache.clear();
}

;// CONCATENATED MODULE: ./node_modules/normalize-url/index.js
// https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/Data_URIs
const DATA_URL_DEFAULT_MIME_TYPE = 'text/plain';
const DATA_URL_DEFAULT_CHARSET = 'us-ascii';

const testParameter = (name, filters) => filters.some(filter => filter instanceof RegExp ? filter.test(name) : filter === name);

const normalizeDataURL = (urlString, {stripHash}) => {
	const match = /^data:(?<type>[^,]*?),(?<data>[^#]*?)(?:#(?<hash>.*))?$/.exec(urlString);

	if (!match) {
		throw new Error(`Invalid URL: ${urlString}`);
	}

	let {type, data, hash} = match.groups;
	const mediaType = type.split(';');
	hash = stripHash ? '' : hash;

	let isBase64 = false;
	if (mediaType[mediaType.length - 1] === 'base64') {
		mediaType.pop();
		isBase64 = true;
	}

	// Lowercase MIME type
	const mimeType = (mediaType.shift() || '').toLowerCase();
	const attributes = mediaType
		.map(attribute => {
			let [key, value = ''] = attribute.split('=').map(string => string.trim());

			// Lowercase `charset`
			if (key === 'charset') {
				value = value.toLowerCase();

				if (value === DATA_URL_DEFAULT_CHARSET) {
					return '';
				}
			}

			return `${key}${value ? `=${value}` : ''}`;
		})
		.filter(Boolean);

	const normalizedMediaType = [
		...attributes,
	];

	if (isBase64) {
		normalizedMediaType.push('base64');
	}

	if (normalizedMediaType.length > 0 || (mimeType && mimeType !== DATA_URL_DEFAULT_MIME_TYPE)) {
		normalizedMediaType.unshift(mimeType);
	}

	return `data:${normalizedMediaType.join(';')},${isBase64 ? data.trim() : data}${hash ? `#${hash}` : ''}`;
};

function normalizeUrl(urlString, options) {
	options = {
		defaultProtocol: 'http:',
		normalizeProtocol: true,
		forceHttp: false,
		forceHttps: false,
		stripAuthentication: true,
		stripHash: false,
		stripTextFragment: true,
		stripWWW: true,
		removeQueryParameters: [/^utm_\w+/i],
		removeTrailingSlash: true,
		removeSingleSlash: true,
		removeDirectoryIndex: false,
		removeExplicitPort: false,
		sortQueryParameters: true,
		...options,
	};

	urlString = urlString.trim();

	// Data URL
	if (/^data:/i.test(urlString)) {
		return normalizeDataURL(urlString, options);
	}

	if (/^view-source:/i.test(urlString)) {
		throw new Error('`view-source:` is not supported as it is a non-standard protocol');
	}

	const hasRelativeProtocol = urlString.startsWith('//');
	const isRelativeUrl = !hasRelativeProtocol && /^\.*\//.test(urlString);

	// Prepend protocol
	if (!isRelativeUrl) {
		urlString = urlString.replace(/^(?!(?:\w+:)?\/\/)|^\/\//, options.defaultProtocol);
	}

	const urlObject = new URL(urlString);

	if (options.forceHttp && options.forceHttps) {
		throw new Error('The `forceHttp` and `forceHttps` options cannot be used together');
	}

	if (options.forceHttp && urlObject.protocol === 'https:') {
		urlObject.protocol = 'http:';
	}

	if (options.forceHttps && urlObject.protocol === 'http:') {
		urlObject.protocol = 'https:';
	}

	// Remove auth
	if (options.stripAuthentication) {
		urlObject.username = '';
		urlObject.password = '';
	}

	// Remove hash
	if (options.stripHash) {
		urlObject.hash = '';
	} else if (options.stripTextFragment) {
		urlObject.hash = urlObject.hash.replace(/#?:~:text.*?$/i, '');
	}

	// Remove duplicate slashes if not preceded by a protocol
	// NOTE: This could be implemented using a single negative lookbehind
	// regex, but we avoid that to maintain compatibility with older js engines
	// which do not have support for that feature.
	if (urlObject.pathname) {
		// TODO: Replace everything below with `urlObject.pathname = urlObject.pathname.replace(/(?<!\b[a-z][a-z\d+\-.]{1,50}:)\/{2,}/g, '/');` when Safari supports negative lookbehind.

		// Split the string by occurrences of this protocol regex, and perform
		// duplicate-slash replacement on the strings between those occurrences
		// (if any).
		const protocolRegex = /\b[a-z][a-z\d+\-.]{1,50}:\/\//g;

		let lastIndex = 0;
		let result = '';
		for (;;) {
			const match = protocolRegex.exec(urlObject.pathname);
			if (!match) {
				break;
			}

			const protocol = match[0];
			const protocolAtIndex = match.index;
			const intermediate = urlObject.pathname.slice(lastIndex, protocolAtIndex);

			result += intermediate.replace(/\/{2,}/g, '/');
			result += protocol;
			lastIndex = protocolAtIndex + protocol.length;
		}

		const remnant = urlObject.pathname.slice(lastIndex, urlObject.pathname.length);
		result += remnant.replace(/\/{2,}/g, '/');

		urlObject.pathname = result;
	}

	// Decode URI octets
	if (urlObject.pathname) {
		try {
			urlObject.pathname = decodeURI(urlObject.pathname);
		} catch {}
	}

	// Remove directory index
	if (options.removeDirectoryIndex === true) {
		options.removeDirectoryIndex = [/^index\.[a-z]+$/];
	}

	if (Array.isArray(options.removeDirectoryIndex) && options.removeDirectoryIndex.length > 0) {
		let pathComponents = urlObject.pathname.split('/');
		const lastComponent = pathComponents[pathComponents.length - 1];

		if (testParameter(lastComponent, options.removeDirectoryIndex)) {
			pathComponents = pathComponents.slice(0, -1);
			urlObject.pathname = pathComponents.slice(1).join('/') + '/';
		}
	}

	if (urlObject.hostname) {
		// Remove trailing dot
		urlObject.hostname = urlObject.hostname.replace(/\.$/, '');

		// Remove `www.`
		if (options.stripWWW && /^www\.(?!www\.)[a-z\-\d]{1,63}\.[a-z.\-\d]{2,63}$/.test(urlObject.hostname)) {
			// Each label should be max 63 at length (min: 1).
			// Source: https://en.wikipedia.org/wiki/Hostname#Restrictions_on_valid_host_names
			// Each TLD should be up to 63 characters long (min: 2).
			// It is technically possible to have a single character TLD, but none currently exist.
			urlObject.hostname = urlObject.hostname.replace(/^www\./, '');
		}
	}

	// Remove query unwanted parameters
	if (Array.isArray(options.removeQueryParameters)) {
		// eslint-disable-next-line unicorn/no-useless-spread -- We are intentionally spreading to get a copy.
		for (const key of [...urlObject.searchParams.keys()]) {
			if (testParameter(key, options.removeQueryParameters)) {
				urlObject.searchParams.delete(key);
			}
		}
	}

	if (!Array.isArray(options.keepQueryParameters) && options.removeQueryParameters === true) {
		urlObject.search = '';
	}

	// Keep wanted query parameters
	if (Array.isArray(options.keepQueryParameters) && options.keepQueryParameters.length > 0) {
		// eslint-disable-next-line unicorn/no-useless-spread -- We are intentionally spreading to get a copy.
		for (const key of [...urlObject.searchParams.keys()]) {
			if (!testParameter(key, options.keepQueryParameters)) {
				urlObject.searchParams.delete(key);
			}
		}
	}

	// Sort query parameters
	if (options.sortQueryParameters) {
		urlObject.searchParams.sort();

		// Calling `.sort()` encodes the search parameters, so we need to decode them again.
		try {
			urlObject.search = decodeURIComponent(urlObject.search);
		} catch {}
	}

	if (options.removeTrailingSlash) {
		urlObject.pathname = urlObject.pathname.replace(/\/$/, '');
	}

	// Remove an explicit port number, excluding a default port number, if applicable
	if (options.removeExplicitPort && urlObject.port) {
		urlObject.port = '';
	}

	const oldUrlString = urlString;

	// Take advantage of many of the Node `url` normalizations
	urlString = urlObject.toString();

	if (!options.removeSingleSlash && urlObject.pathname === '/' && !oldUrlString.endsWith('/') && urlObject.hash === '') {
		urlString = urlString.replace(/\/$/, '');
	}

	// Remove ending `/` unless removeSingleSlash is false
	if ((options.removeTrailingSlash || urlObject.pathname === '/') && urlObject.hash === '' && options.removeSingleSlash) {
		urlString = urlString.replace(/\/$/, '');
	}

	// Restore relative protocol, if applicable
	if (hasRelativeProtocol && !options.normalizeProtocol) {
		urlString = urlString.replace(/^http:\/\//, '//');
	}

	// Remove http/https
	if (options.stripProtocol) {
		urlString = urlString.replace(/^(?:https?:)?\/\//, '');
	}

	return urlString;
}

;// CONCATENATED MODULE: ./node_modules/notion-utils/build/index.js
var q=Object.defineProperty,N=Object.defineProperties;var V=Object.getOwnPropertyDescriptors;var $=Object.getOwnPropertySymbols;var H=Object.prototype.hasOwnProperty,Q=Object.prototype.propertyIsEnumerable;var D=(e,t,o)=>t in e?q(e,t,{enumerable:!0,configurable:!0,writable:!0,value:o}):e[t]=o,build_g=(e,t)=>{for(var o in t||(t={}))H.call(t,o)&&D(e,o,t[o]);if($)for(var o of $(t))Q.call(t,o)&&D(e,o,t[o]);return e},build_U=(e,t)=>N(e,V(t));var build_R=(e,t,o)=>new Promise((n,s)=>{var r=c=>{try{m(o.next(c))}catch(l){s(l)}},a=c=>{try{m(o.throw(c))}catch(l){s(l)}},m=c=>c.done?n(c.value):Promise.resolve(c.value).then(r,a);m((o=o.apply(e,t)).next())});var h=e=>{var t;return e?Array.isArray(e)?(t=e==null?void 0:e.reduce((o,n)=>o+(n[0]!=="\u204D"&&n[0]!=="\u2023"?n[0]:""),""))!=null?t:"":e:""};function w(e,t){var s,r,a,m,c,l,i;let o=e.collection_id||((r=(s=e.format)==null?void 0:s.collection_pointer)==null?void 0:r.id);if(o)return o;let n=(a=e==null?void 0:e.view_ids)==null?void 0:a[0];if(n){let u=(c=(m=t.collection_view)==null?void 0:m[n])==null?void 0:c.value;if(u)return(i=(l=u.format)==null?void 0:l.collection_pointer)==null?void 0:i.id}return null}function build_v(e,t){var o,n;if((o=e.properties)!=null&&o.title)return h(e.properties.title);if(e.type==="collection_view_page"||e.type==="collection_view"){let s=w(e,t);if(s){let r=(n=t.collection[s])==null?void 0:n.value;if(r)return h(r.name)}}return""}function B(e,t){var o,n,s;if((o=e.format)!=null&&o.page_icon)return(n=e.format)==null?void 0:n.page_icon;if(e.type==="collection_view_page"||e.type==="collection_view"){let r=w(e,t);if(r){let a=(s=t.collection[r])==null?void 0:s.value;if(a)return a.icon}}return null}function pe(e){var o;let t=(o=e.block[Object.keys(e.block)[0]])==null?void 0:o.value;return t?build_v(t,e):null}function build_P(e,t,o){var n;try{if(!t.properties||!Object.keys(o.collection))return null;let s=(n=o.collection[t.parent_id])==null?void 0:n.value;if(s){let r=e.toLowerCase(),a=Object.keys(s.schema).find(l=>{var i,u;return((u=(i=s.schema[l])==null?void 0:i.name)==null?void 0:u.toLowerCase())===r});if(!a)return null;let{type:m}=s.schema[a],c=h(t.properties[a]);switch(m){case"created_time":return t.created_time;case"multi_select":return c.split(",");case"date":{let i=t.properties[a][0][1][0][1];if(i.type=="datetime")return new Date(`${i.start_date} ${i.start_time}`).getTime();if(i.type=="date")return new Date(i.start_date).getTime();if(i.type=="datetimerange"){let{start_date:u,start_time:y,end_date:f,end_time:T}=i,b=new Date(`${u} ${y}`).getTime(),d=new Date(`${f} ${T}`).getTime();return[b,d]}else{let u=new Date(i.start_date).getTime(),y=new Date(i.end_date).getTime();return[u,y]}}case"checkbox":return c=="Yes";case"last_edited_time":return t.last_edited_time;default:return c}}}catch(s){}return null}var Y=e=>{if(e&&Array.isArray(e)){if(e[0]==="d")return e[1];for(let t of e){let o=Y(t);if(o)return o}}return null};var O=(e,t,{inclusive:o=!1}={})=>{var s,r;let n=e;for(;n!=null;){if(o&&(n==null?void 0:n.type)==="page")return n;let a=n.parent_id,m=n.parent_table;if(!a)break;if(m==="collection")n=(s=t.collection[a])==null?void 0:s.value;else if(n=(r=t.block[a])==null?void 0:r.value,(n==null?void 0:n.type)==="page")return n}return null};var Z={header:0,sub_header:1,sub_sub_header:2},S=(e,t)=>{var s;let o=((s=e.content)!=null?s:[]).map(r=>{var m,c;let a=(m=t.block[r])==null?void 0:m.value;if(a){let{type:l}=a;if(l==="header"||l==="sub_header"||l==="sub_sub_header")return{id:r,type:l,text:h((c=a.properties)==null?void 0:c.title),indentLevel:Z[l]}}return null}).filter(Boolean),n=[{actual:-1,effective:-1}];for(let r of o){let{indentLevel:a}=r,m=a;do{let c=n[n.length-1],{actual:l,effective:i}=c;if(m>l)r.indentLevel=i+1,n.push({actual:m,effective:r.indentLevel});else if(m===l){r.indentLevel=i;break}else n.pop()}while(!0)}return o};var Te=(e,t)=>{let o=t||Object.keys(e.block)[0],n=new Set;function s(r){var u,y,f,T;if(n.has(r))return;n.add(r);let a=(u=e.block[r])==null?void 0:u.value;if(!a)return;let{content:m,type:c,properties:l,format:i}=a;if(l)for(let b of Object.keys(l)){let d=l[b];d.map(k=>{var _,I;let p=(I=(_=k==null?void 0:k[0])==null?void 0:_[1])==null?void 0:I[0];(p==null?void 0:p[0])==="p"&&p[1]&&s(p[1])});let x=(f=(y=d==null?void 0:d[0])==null?void 0:y[1])==null?void 0:f[0];(x==null?void 0:x[0])==="p"&&x[1]&&s(x[1])}if(i){let b=(T=i.transclusion_reference_pointer)==null?void 0:T.id;b&&s(b)}if(!(!m||!Array.isArray(m))&&!(r!==o&&(c==="page"||c==="collection_view_page")))for(let b of m)s(b)}return s(o),Array.from(n)};var build_L=(e="")=>`${e.substr(0,8)}-${e.substr(8,4)}-${e.substr(12,4)}-${e.substr(16,4)}-${e.substr(20)}`;var G=/\b([a-f0-9]{32})\b/,J=/\b([a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12})\b/,W=(e="",{uuid:t=!0}={})=>{if(!e)return null;e=e.split("?")[0];let o=e.match(G);if(o)return t?build_L(o[1]):o[1];let n=e.match(J);return n?t?n[1]:n[1].replace(/-/g,""):null};var M=e=>e.replace(/-/g,"");function build_Ee(a,m,c){return build_R(this,arguments,function*(e,t,o,{concurrency:n=4,traverseCollections:s=!0,targetPageId:r=null}={}){let l={},i=new Set,u=new K({concurrency:n});function y(f){return build_R(this,null,function*(){r&&i.has(r)||(f=W(f),f&&!l[f]&&!i.has(f)&&(i.add(f),u.add(()=>build_R(this,null,function*(){var T,b;try{if(r&&i.has(r)&&f!==r)return;let d=yield o(f);if(!d)return;let x=(b=(T=d.block[f])==null?void 0:T.value)==null?void 0:b.space_id;if(x){if(!t)t=x;else if(t!==x)return}if(Object.keys(d.block).filter(k=>{var _;let p=(_=d.block[k])==null?void 0:_.value;return!(!p||p.type!=="page"&&p.type!=="collection_view_page"||t&&p.space_id&&p.space_id!==t)}).forEach(k=>y(k)),s)for(let k of Object.values(d.collection_query))for(let p of Object.values(k)){let{blockIds:_}=p;if(_)for(let I of _)y(I)}l[f]=d}catch(d){console.warn("page load error",{pageId:f,spaceId:t},d.statusCode,d.message),l[f]=null}i.delete(f)}))))})}return yield y(e),yield u.onIdle(),l})}var build_z=e=>(e||"").replace(/ /g,"-").replace(/[^a-zA-Z0-9-\u4e00-\u9FFF\u3041-\u3096\u30A1-\u30FC\u3000-\u303F]/g,"").replace(/--/g,"-").replace(/-$/,"").replace(/^-/,"").trim().toLowerCase();var We=(e,t,{uuid:o=!0}={})=>{var r;if(!e||!t)return null;let n=M(e),s=(r=t.block[e])==null?void 0:r.value;if(s){let a=build_P("slug",s,t)||build_P("Slug",s,t)||build_z(build_v(s,t));if(a)return o?`${a}-${n}`:a}return n};var je=(e,t)=>{var r;let o=e.block,n=[],s=t;do{let a=(r=o[s])==null?void 0:r.value;if(!a)break;let m=build_v(a,e),c=B(a,e);if(!(m||c))break;n.push({block:a,active:s===t,pageId:s,title:m,icon:c});let l=O(a,e),i=l==null?void 0:l.id;if(!i)break;s=i}while(!0);return n.reverse(),n};var Ye=(e,{mapImageUrl:t})=>{let n=Object.keys(e.block).flatMap(s=>{var m,c,l,i,u,y,f,T,b,d,x;let r=(m=e.block[s])==null?void 0:m.value,a=[];if(r){if(r.type==="image"){let _=((c=e.signed_urls)==null?void 0:c[r.id])||((u=(i=(l=r.properties)==null?void 0:l.source)==null?void 0:i[0])==null?void 0:u[0]);_.includes("file.notion.so")&&(_=(T=(f=(y=r.properties)==null?void 0:y.source)==null?void 0:f[0])==null?void 0:T[0]),_&&a.push({block:r,url:_})}if((b=r.format)!=null&&b.page_cover){let p=r.format.page_cover;a.push({block:r,url:p})}if((d=r.format)!=null&&d.bookmark_cover){let p=r.format.bookmark_cover;a.push({block:r,url:p})}if((x=r.format)!=null&&x.bookmark_icon){let p=r.format.bookmark_icon;a.push({block:r,url:p})}let k=B(r,e);k&&A(k)&&a.push({block:r,url:k})}return a}).filter(Boolean).map(({block:s,url:r})=>t(r,s)).filter(Boolean);return Array.from(new Set(n))};var te=mem(e=>{if(!e)return"";try{if(e.startsWith("https://www.notion.so/image/")){let t=new URL(e),o=decodeURIComponent(t.pathname.substr(7)),n=te(o);t.pathname=`/image/${encodeURIComponent(n)}`,e=t.toString()}return normalizeUrl(e,{stripProtocol:!0,stripWWW:!0,stripHash:!0,stripTextFragment:!0,removeQueryParameters:!0})}catch(t){return""}});function Xe(e,t){return{block:build_g(build_g({},e.block),t.block),collection:build_g(build_g({},e.collection),t.collection),collection_view:build_g(build_g({},e.collection_view),t.collection_view),notion_user:build_g(build_g({},e.notion_user),t.notion_user),collection_query:build_g(build_g({},e.collection_query),t.collection_query),signed_urls:build_g(build_g({},e.signed_urls),t.signed_urls),preview_images:build_g(build_g({},e.preview_images),t.preview_images)}}var build_F=(e,{month:t="short"}={})=>{let o=new Date(e);return`${o.toLocaleString("en-US",{month:t})} ${o.getUTCDate()}, ${o.getUTCFullYear()}`};var rt=e=>{let t=`${e.start_time||""} ${e.start_date} ${e.time_zone||""}`;return build_F(t)};function oe(e,t,{wordsPerMinute:o=275,imageReadTimeInSeconds:n=12}={}){let s=build_C(e,t),r=s.numWords/o,m=(s.numImages>10?s.numImages/2*(n+3)+(s.numImages-10)*3:s.numImages/2*(2*n+(1-s.numImages)))/60,c=r+m;return build_U(build_g({},s),{totalWordsReadTimeInMinutes:r,totalImageReadTimeInMinutes:m,totalReadTimeInMinutes:c})}function build_ct(e,t,o){let n=oe(e,t,o);return build_ne(n.totalReadTimeInMinutes)}function build_C(e,t){var n,s,r,a;let o={numWords:0,numImages:0};if(!e)return o;for(let m of e.content||[]){let c=(n=t.block[m])==null?void 0:n.value,l=!1;if(!!c){switch(c.type){case"quote":case"alias":case"header":case"sub_header":case"sub_sub_header":{let i=build_v(c,t);o.numWords+=E(i);break}case"callout":case"toggle":case"to_do":case"bulleted_list":case"numbered_list":case"text":{let i=build_v(c,t);o.numWords+=E(i),l=!0;break}case"embed":case"tweet":case"maps":case"pdf":case"figma":case"typeform":case"codepen":case"excalidraw":case"gist":case"video":case"drive":case"audio":case"file":case"image":o.numImages+=1;break;case"bookmark":o.numImages+=.25;break;case"code":o.numImages+=2;break;case"table":case"collection_view":o.numImages+=2;break;case"column":case"column_list":case"transclusion_container":l=!0;break;case"table_of_contents":{let i=e;if(!i)continue;let u=S(i,t);for(let y of u)o.numWords+=E(y.text);break}case"transclusion_reference":{let i=(r=(s=c==null?void 0:c.format)==null?void 0:s.transclusion_reference_pointer)==null?void 0:r.id;if(!i)continue;let u=(a=t.block[i])==null?void 0:a.value;u&&build_j(o,build_C(u,t));break}default:break}l&&build_j(o,build_C(c,t))}}return o}function build_j(e,t){e.numWords+=t.numWords,e.numImages+=t.numImages}function E(e){return e?(e.match(/\w+/g)||[]).length:0}function build_ne(e){return e<.5?"less than a minute":e<1.5?"1 minute":`${Math.ceil(e)} minutes`}
//# sourceMappingURL=index.js.map
;// CONCATENATED MODULE: ./lib/site-config.ts
const siteConfig = (config)=>{
    return config;
};

;// CONCATENATED MODULE: ./site.config.ts

/* harmony default export */ const site_config = (siteConfig({
    // the site's root Notion page (required)
    rootNotionPageId: "ababeb3954a74132ade2899619a50d21",
    // if you want to restrict pages to a single notion workspace (optional)
    // (this should be a Notion ID; see the docs for how to extract this)
    rootNotionSpaceId: null,
    // basic site info (required)
    name: "Lane Parton",
    domain: "laneparton.com",
    author: "Lane Parton",
    // open graph metadata (optional)
    description: "Just my little home on the internet.",
    // social usernames (optional)
    twitter: "laneparton",
    github: "laneparton",
    linkedin: "lane-parton",
    // mastodon: '#', // optional mastodon profile URL, provides link verification
    // newsletter: '#', // optional newsletter URL
    // youtube: '#', // optional youtube channel name or `channel/UCGbXXXXXXXXXXXXXXXXXXXXXX`
    // default notion icon and cover images for site-wide consistency (optional)
    // page-specific values will override these site-wide defaults
    defaultPageIcon: null,
    defaultPageCover: null,
    defaultPageCoverPosition: 0.5,
    // whether or not to enable support for LQIP preview images (optional)
    isPreviewImageSupportEnabled: true,
    // whether or not redis is enabled for caching generated preview images (optional)
    // NOTE: if you enable redis, you need to set the `REDIS_HOST` and `REDIS_PASSWORD`
    // environment variables. see the readme for more info
    isRedisEnabled: false,
    // map of notion page IDs to URL paths (optional)
    // any pages defined here will override their default URL paths
    // example:
    //
    // pageUrlOverrides: {
    //   '/foo': '067dd719a912471ea9a3ac10710e7fdf',
    //   '/bar': '0be6efce9daf42688f65c76b89f8eb27'
    // }
    pageUrlOverrides: null,
    // whether to use the default notion navigation style or a custom one with links to
    // important pages
    navigationStyle: "default"
}));

;// CONCATENATED MODULE: ./lib/get-config-value.ts

if (!site_config) {
    throw new Error(`Config error: invalid site.config.ts`);
}
// allow environment variables to override site.config.ts
let siteConfigOverrides;
try {
    if (process.env.NEXT_PUBLIC_SITE_CONFIG) {
        siteConfigOverrides = JSON.parse(process.env.NEXT_PUBLIC_SITE_CONFIG);
    }
} catch (err) {
    console.error('Invalid config "NEXT_PUBLIC_SITE_CONFIG" failed to parse');
    throw err;
}
const get_config_value_siteConfig = {
    ...site_config,
    ...siteConfigOverrides
};
function getSiteConfig(key, defaultValue) {
    const value = get_config_value_siteConfig[key];
    if (value !== undefined) {
        return value;
    }
    if (defaultValue !== undefined) {
        return defaultValue;
    }
    throw new Error(`Config error: missing required site config value "${key}"`);
}
function getEnv(key, defaultValue, env = process.env) {
    const value = env[key];
    if (value !== undefined) {
        return value;
    }
    if (defaultValue !== undefined) {
        return defaultValue;
    }
    throw new Error(`Config error: missing required env variable "${key}"`);
}

;// CONCATENATED MODULE: ./lib/config.ts
/**
 * Site-wide app configuration.
 *
 * This file pulls from the root "site.config.ts" as well as environment variables
 * for optional depenencies.
 */ 
//import { PostHogConfig } from 'posthog-js'

const rootNotionPageId = W(getSiteConfig("rootNotionPageId"), {
    uuid: false
});
if (!rootNotionPageId) {
    throw new Error('Config error invalid "rootNotionPageId"');
}
// if you want to restrict pages to a single notion workspace (optional)
const rootNotionSpaceId = W(getSiteConfig("rootNotionSpaceId", null), {
    uuid: true
});
const pageUrlOverrides = cleanPageUrlMap(getSiteConfig("pageUrlOverrides", {}) || {}, {
    label: "pageUrlOverrides"
});
const pageUrlAdditions = cleanPageUrlMap(getSiteConfig("pageUrlAdditions", {}) || {}, {
    label: "pageUrlAdditions"
});
const inversePageUrlOverrides = invertPageUrlOverrides(pageUrlOverrides);
const environment = "production" || 0;
const isDev = environment === "development";
// general site config
const config_name = getSiteConfig("name");
const author = getSiteConfig("author");
const domain = getSiteConfig("domain");
const description = getSiteConfig("description", "Notion Blog");
const language = getSiteConfig("language", "en");
// social accounts
const twitter = getSiteConfig("twitter", null);
const mastodon = getSiteConfig("mastodon", null);
const github = getSiteConfig("github", null);
const youtube = getSiteConfig("youtube", null);
const linkedin = getSiteConfig("linkedin", null);
const newsletter = getSiteConfig("newsletter", null);
const zhihu = getSiteConfig("zhihu", null);
const getMastodonHandle = ()=>{
    if (!mastodon) {
        return null;
    }
    // Since Mastodon is decentralized, handles include the instance domain name.
    // e.g. @example@mastodon.social
    const url = new URL(mastodon);
    return `${url.pathname.slice(1)}@${url.hostname}`;
};
// default notion values for site-wide consistency (optional; may be overridden on a per-page basis)
const defaultPageIcon = getSiteConfig("defaultPageIcon", null);
const defaultPageCover = getSiteConfig("defaultPageCover", null);
const defaultPageCoverPosition = getSiteConfig("defaultPageCoverPosition", 0.5);
// Optional whether or not to enable support for LQIP preview images
const isPreviewImageSupportEnabled = getSiteConfig("isPreviewImageSupportEnabled", false);
// Optional whether or not to include the Notion ID in page URLs or just use slugs
const includeNotionIdInUrls = getSiteConfig("includeNotionIdInUrls", !!isDev);
const navigationStyle = getSiteConfig("navigationStyle", "default");
const navigationLinks = getSiteConfig("navigationLinks", null);
// Optional site search
const isSearchEnabled = getSiteConfig("isSearchEnabled", true);
// ----------------------------------------------------------------------------
// Optional redis instance for persisting preview images
const isRedisEnabled = getSiteConfig("isRedisEnabled", false) || !!getEnv("REDIS_ENABLED", null);
// (if you want to enable redis, only REDIS_HOST and REDIS_PASSWORD are required)
// we recommend that you store these in a local `.env` file
const redisHost = getEnv("REDIS_HOST", null);
const redisPassword = getEnv("REDIS_PASSWORD", null);
const redisUser = getEnv("REDIS_USER", "default");
const redisUrl = getEnv("REDIS_URL", `redis://${redisUser}:${redisPassword}@${redisHost}`);
const redisNamespace = getEnv("REDIS_NAMESPACE", "preview-images");
// ----------------------------------------------------------------------------
const isServer = (/* unused pure expression or super */ null && ("undefined" === "undefined"));
const port = getEnv("PORT", "3000");
const host = isDev ? `http://localhost:${port}` : `https://${domain}`;
const apiHost = isDev ? host : `https://${process.env.VERCEL_URL || domain}`;
const apiBaseUrl = `/api`;
const api = {
    searchNotion: `${apiBaseUrl}/search-notion`,
    getNotionPageInfo: `${apiBaseUrl}/notion-page-info`,
    getSocialImage: `${apiBaseUrl}/social-image`
};
// ----------------------------------------------------------------------------
const site = {
    domain,
    name: config_name,
    rootNotionPageId,
    rootNotionSpaceId,
    description
};
const fathomId = isDev ? null : process.env.NEXT_PUBLIC_FATHOM_ID;
const fathomConfig = fathomId ? {
    excludedDomains: [
        "localhost",
        "localhost:3000"
    ]
} : undefined;
// export const posthogId = process.env.NEXT_PUBLIC_POSTHOG_ID
// export const posthogConfig: Partial<PostHogConfig> = {
//   api_host: 'https://app.posthog.com'
// }
function cleanPageUrlMap(pageUrlMap, { label  }) {
    return Object.keys(pageUrlMap).reduce((acc, uri)=>{
        const pageId = pageUrlMap[uri];
        const uuid = W(pageId, {
            uuid: false
        });
        if (!uuid) {
            throw new Error(`Invalid ${label} page id "${pageId}"`);
        }
        if (!uri) {
            throw new Error(`Missing ${label} value for page "${pageId}"`);
        }
        if (!uri.startsWith("/")) {
            throw new Error(`Invalid ${label} value for page "${pageId}": value "${uri}" should be a relative URI that starts with "/"`);
        }
        const path = uri.slice(1);
        return {
            ...acc,
            [path]: uuid
        };
    }, {});
}
function invertPageUrlOverrides(pageUrlOverrides) {
    return Object.keys(pageUrlOverrides).reduce((acc, uri)=>{
        const pageId = pageUrlOverrides[uri];
        return {
            ...acc,
            [pageId]: uri
        };
    }, {});
}

;// CONCATENATED MODULE: ./pages/api/social-image.tsx




const interRegularFontP = fetch(/* asset import */ new __webpack_require__.U(__webpack_require__(140))).then((res)=>res.arrayBuffer());
const interBoldFontP = fetch(/* asset import */ new __webpack_require__.U(__webpack_require__(118))).then((res)=>res.arrayBuffer());
const config = {
    runtime: "experimental-edge"
};
async function OGImage(req) {
    const { searchParams  } = new URL(req.url);
    const pageId = searchParams.get("id") || rootNotionPageId;
    if (!pageId) {
        return new Response("Invalid notion page id", {
            status: 400
        });
    }
    const pageInfoRes = await fetch(`${apiHost}${api.getNotionPageInfo}`, {
        method: "POST",
        body: JSON.stringify({
            pageId
        }),
        headers: {
            "content-type": "application/json"
        }
    });
    if (!pageInfoRes.ok) {
        return new Response(pageInfoRes.statusText, {
            status: pageInfoRes.status
        });
    }
    const pageInfo = await pageInfoRes.json();
    console.log(pageInfo);
    const [interRegularFont, interBoldFont] = await Promise.all([
        interRegularFontP,
        interBoldFontP
    ]);
    return new p(/*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
        style: {
            position: "relative",
            width: "100%",
            height: "100%",
            display: "flex",
            flexDirection: "column",
            backgroundColor: "#1F2027",
            alignItems: "center",
            justifyContent: "center",
            fontFamily: '"Inter", sans-serif',
            color: "black"
        },
        children: [
            pageInfo.image && /*#__PURE__*/ (0,jsx_runtime.jsx)("img", {
                src: pageInfo.image,
                style: {
                    position: "absolute",
                    width: "100%",
                    height: "100%",
                    objectFit: "cover"
                }
            }),
            /*#__PURE__*/ (0,jsx_runtime.jsx)("div", {
                style: {
                    position: "relative",
                    width: 900,
                    height: 465,
                    display: "flex",
                    flexDirection: "column",
                    border: "16px solid rgba(0,0,0,0.3)",
                    borderRadius: 8,
                    zIndex: "1"
                },
                children: /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                    style: {
                        width: "100%",
                        height: "100%",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "space-around",
                        backgroundColor: "#fff",
                        padding: 24,
                        alignItems: "center",
                        textAlign: "center"
                    },
                    children: [
                        pageInfo.detail && /*#__PURE__*/ (0,jsx_runtime.jsx)("div", {
                            style: {
                                fontSize: 32,
                                opacity: 0
                            },
                            children: pageInfo.detail
                        }),
                        /*#__PURE__*/ (0,jsx_runtime.jsx)("div", {
                            style: {
                                fontSize: 70,
                                fontWeight: 700,
                                fontFamily: "Inter"
                            },
                            children: pageInfo.title
                        }),
                        pageInfo.detail && /*#__PURE__*/ (0,jsx_runtime.jsx)("div", {
                            style: {
                                fontSize: 32,
                                opacity: 0.6
                            },
                            children: pageInfo.detail
                        })
                    ]
                })
            }),
            pageInfo.authorImage && /*#__PURE__*/ (0,jsx_runtime.jsx)("div", {
                style: {
                    position: "absolute",
                    top: 47,
                    left: 104,
                    height: 128,
                    width: 128,
                    display: "flex",
                    borderRadius: "50%",
                    border: "4px solid #fff",
                    zIndex: "5"
                },
                children: /*#__PURE__*/ (0,jsx_runtime.jsx)("img", {
                    src: pageInfo.authorImage,
                    style: {
                        width: "100%",
                        height: "100%"
                    }
                })
            })
        ]
    }), {
        width: 1200,
        height: 630,
        fonts: [
            {
                name: "Inter",
                data: interRegularFont,
                style: "normal",
                weight: 400
            },
            {
                name: "Inter",
                data: interBoldFont,
                style: "normal",
                weight: 700
            }
        ]
    });
}


/***/ }),

/***/ 207:
/***/ ((module) => {

var __dirname = "/";
(()=>{"use strict";if(typeof __nccwpck_require__!=="undefined")__nccwpck_require__.ab=__dirname+"/";var e={};(()=>{var r=e;
/*!
 * cookie
 * Copyright(c) 2012-2014 Roman Shtylman
 * Copyright(c) 2015 Douglas Christopher Wilson
 * MIT Licensed
 */r.parse=parse;r.serialize=serialize;var i=decodeURIComponent;var t=encodeURIComponent;var a=/; */;var n=/^[\u0009\u0020-\u007e\u0080-\u00ff]+$/;function parse(e,r){if(typeof e!=="string"){throw new TypeError("argument str must be a string")}var t={};var n=r||{};var o=e.split(a);var s=n.decode||i;for(var p=0;p<o.length;p++){var f=o[p];var u=f.indexOf("=");if(u<0){continue}var v=f.substr(0,u).trim();var c=f.substr(++u,f.length).trim();if('"'==c[0]){c=c.slice(1,-1)}if(undefined==t[v]){t[v]=tryDecode(c,s)}}return t}function serialize(e,r,i){var a=i||{};var o=a.encode||t;if(typeof o!=="function"){throw new TypeError("option encode is invalid")}if(!n.test(e)){throw new TypeError("argument name is invalid")}var s=o(r);if(s&&!n.test(s)){throw new TypeError("argument val is invalid")}var p=e+"="+s;if(null!=a.maxAge){var f=a.maxAge-0;if(isNaN(f)||!isFinite(f)){throw new TypeError("option maxAge is invalid")}p+="; Max-Age="+Math.floor(f)}if(a.domain){if(!n.test(a.domain)){throw new TypeError("option domain is invalid")}p+="; Domain="+a.domain}if(a.path){if(!n.test(a.path)){throw new TypeError("option path is invalid")}p+="; Path="+a.path}if(a.expires){if(typeof a.expires.toUTCString!=="function"){throw new TypeError("option expires is invalid")}p+="; Expires="+a.expires.toUTCString()}if(a.httpOnly){p+="; HttpOnly"}if(a.secure){p+="; Secure"}if(a.sameSite){var u=typeof a.sameSite==="string"?a.sameSite.toLowerCase():a.sameSite;switch(u){case true:p+="; SameSite=Strict";break;case"lax":p+="; SameSite=Lax";break;case"strict":p+="; SameSite=Strict";break;case"none":p+="; SameSite=None";break;default:throw new TypeError("option sameSite is invalid")}}return p}function tryDecode(e,r){try{return r(e)}catch(r){return e}}})();module.exports=e})();

/***/ }),

/***/ 51:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({
    value: true
}));
exports.stripInternalQueries = stripInternalQueries;
exports.stripInternalSearchParams = stripInternalSearchParams;
const INTERNAL_QUERY_NAMES = [
    "__nextFallback",
    "__nextLocale",
    "__nextDefaultLocale",
    "__nextIsNotFound",
    // RSC
    "__flight__",
    // Routing
    "__flight_router_state_tree__",
    "__flight_prefetch__", 
];
const EXTENDED_INTERNAL_QUERY_NAMES = [
    "__nextDataReq"
];
function stripInternalQueries(query) {
    for (const name of INTERNAL_QUERY_NAMES){
        delete query[name];
    }
}
function stripInternalSearchParams(searchParams, extended) {
    for (const name of INTERNAL_QUERY_NAMES){
        searchParams.delete(name);
    }
    if (extended) {
        for (const name of EXTENDED_INTERNAL_QUERY_NAMES){
            searchParams.delete(name);
        }
    }
    return searchParams;
}

//# sourceMappingURL=internal-utils.js.map

/***/ }),

/***/ 384:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";
var __webpack_unused_export__;

__webpack_unused_export__ = ({
    value: true
});
exports.VL = adapter;
__webpack_unused_export__ = blockUnallowedResponse;
exports.gL = enhanceGlobals;
var _error = __webpack_require__(928);
var _utils = __webpack_require__(625);
var _fetchEvent = __webpack_require__(125);
var _request = __webpack_require__(953);
var _response = __webpack_require__(57);
var _relativizeUrl = __webpack_require__(73);
var _nextUrl = __webpack_require__(961);
var _internalUtils = __webpack_require__(51);
class NextRequestHint extends _request.NextRequest {
    constructor(params){
        super(params.input, params.init);
        this.sourcePage = params.page;
    }
    get request() {
        throw new _error.PageSignatureError({
            page: this.sourcePage
        });
    }
    respondWith() {
        throw new _error.PageSignatureError({
            page: this.sourcePage
        });
    }
    waitUntil() {
        throw new _error.PageSignatureError({
            page: this.sourcePage
        });
    }
}
async function adapter(params) {
    // TODO-APP: use explicit marker for this
    const isEdgeRendering = typeof self.__BUILD_MANIFEST !== "undefined";
    const requestUrl = new _nextUrl.NextURL(params.request.url, {
        headers: params.request.headers,
        nextConfig: params.request.nextConfig
    });
    // Ensure users only see page requests, never data requests.
    const buildId = requestUrl.buildId;
    requestUrl.buildId = "";
    const isDataReq = params.request.headers["x-nextjs-data"];
    if (isDataReq && requestUrl.pathname === "/index") {
        requestUrl.pathname = "/";
    }
    // Preserve flight data.
    const flightSearchParameters = requestUrl.flightSearchParameters;
    // Parameters should only be stripped for middleware
    if (!isEdgeRendering) {
        requestUrl.flightSearchParameters = undefined;
    }
    // Strip internal query parameters off the request.
    (0, _internalUtils).stripInternalSearchParams(requestUrl.searchParams, true);
    const request = new NextRequestHint({
        page: params.page,
        input: String(requestUrl),
        init: {
            body: params.request.body,
            geo: params.request.geo,
            headers: (0, _utils).fromNodeHeaders(params.request.headers),
            ip: params.request.ip,
            method: params.request.method,
            nextConfig: params.request.nextConfig
        }
    });
    /**
   * This allows to identify the request as a data request. The user doesn't
   * need to know about this property neither use it. We add it for testing
   * purposes.
   */ if (isDataReq) {
        Object.defineProperty(request, "__isData", {
            enumerable: false,
            value: true
        });
    }
    const event = new _fetchEvent.NextFetchEvent({
        request,
        page: params.page
    });
    let response = await params.handler(request, event);
    /**
   * For rewrites we must always include the locale in the final pathname
   * so we re-create the NextURL forcing it to include it when the it is
   * an internal rewrite. Also we make sure the outgoing rewrite URL is
   * a data URL if the request was a data request.
   */ const rewrite = response == null ? void 0 : response.headers.get("x-middleware-rewrite");
    if (response && rewrite) {
        const rewriteUrl = new _nextUrl.NextURL(rewrite, {
            forceLocale: true,
            headers: params.request.headers,
            nextConfig: params.request.nextConfig
        });
        if (true) {
            if (rewriteUrl.host === request.nextUrl.host) {
                rewriteUrl.buildId = buildId || rewriteUrl.buildId;
                rewriteUrl.flightSearchParameters = flightSearchParameters || rewriteUrl.flightSearchParameters;
                response.headers.set("x-middleware-rewrite", String(rewriteUrl));
            }
        }
        /**
     * When the request is a data request we must show if there was a rewrite
     * with an internal header so the client knows which component to load
     * from the data request.
     */ if (isDataReq) {
            response.headers.set("x-nextjs-rewrite", (0, _relativizeUrl).relativizeURL(String(rewriteUrl), String(requestUrl)));
        }
    }
    /**
   * For redirects we will not include the locale in case when it is the
   * default and we must also make sure the outgoing URL is a data one if
   * the incoming request was a data request.
   */ const redirect = response == null ? void 0 : response.headers.get("Location");
    if (response && redirect) {
        const redirectURL = new _nextUrl.NextURL(redirect, {
            forceLocale: false,
            headers: params.request.headers,
            nextConfig: params.request.nextConfig
        });
        /**
     * Responses created from redirects have immutable headers so we have
     * to clone the response to be able to modify it.
     */ response = new Response(response.body, response);
        if (true) {
            if (redirectURL.host === request.nextUrl.host) {
                redirectURL.buildId = buildId || redirectURL.buildId;
                redirectURL.flightSearchParameters = flightSearchParameters || redirectURL.flightSearchParameters;
                response.headers.set("Location", String(redirectURL));
            }
        }
        /**
     * When the request is a data request we can't use the location header as
     * it may end up with CORS error. Instead we map to an internal header so
     * the client knows the destination.
     */ if (isDataReq) {
            response.headers.delete("Location");
            response.headers.set("x-nextjs-redirect", (0, _relativizeUrl).relativizeURL(String(redirectURL), String(requestUrl)));
        }
    }
    return {
        response: response || _response.NextResponse.next(),
        waitUntil: Promise.all(event[_fetchEvent.waitUntilSymbol])
    };
}
function blockUnallowedResponse(promise) {
    if (false) {}
    return promise.then((result)=>{
        var ref;
        if ((ref = result.response) == null ? void 0 : ref.body) {
            console.error(new Error(`A middleware can not alter response's body. Learn more: https://nextjs.org/docs/messages/returning-response-body-in-middleware`));
            return {
                ...result,
                response: new Response("Internal Server Error", {
                    status: 500,
                    statusText: "Internal Server Error"
                })
            };
        }
        return result;
    });
}
function getUnsupportedModuleErrorMessage(module) {
    // warning: if you change these messages, you must adjust how react-dev-overlay's middleware detects modules not found
    return `The edge runtime does not support Node.js '${module}' module.
Learn More: https://nextjs.org/docs/messages/node-module-in-edge-runtime`;
}
function __import_unsupported(moduleName) {
    const proxy = new Proxy(function() {}, {
        get (_obj, prop) {
            if (prop === "then") {
                return {};
            }
            throw new Error(getUnsupportedModuleErrorMessage(moduleName));
        },
        construct () {
            throw new Error(getUnsupportedModuleErrorMessage(moduleName));
        },
        apply (_target, _this, args) {
            if (typeof args[0] === "function") {
                return args[0](proxy);
            }
            throw new Error(getUnsupportedModuleErrorMessage(moduleName));
        }
    });
    return new Proxy({}, {
        get: ()=>proxy
    });
}
function enhanceGlobals() {
    // The condition is true when the "process" module is provided
    if (process !== __webpack_require__.g.process) {
        // prefer local process but global.process has correct "env"
        process.env = __webpack_require__.g.process.env;
        __webpack_require__.g.process = process;
    }
    // to allow building code that import but does not use node.js modules,
    // webpack will expect this function to exist in global scope
    Object.defineProperty(globalThis, "__import_unsupported", {
        value: __import_unsupported,
        enumerable: false,
        configurable: false
    });
}

//# sourceMappingURL=adapter.js.map

/***/ }),

/***/ 928:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({
    value: true
}));
class PageSignatureError extends Error {
    constructor({ page  }){
        super(`The middleware "${page}" accepts an async API directly with the form:
  
  export function middleware(request, event) {
    return NextResponse.redirect('/new-location')
  }
  
  Read more: https://nextjs.org/docs/messages/middleware-new-signature
  `);
    }
}
exports.PageSignatureError = PageSignatureError;
class RemovedPageError extends Error {
    constructor(){
        super(`The request.page has been deprecated in favour of \`URLPattern\`.
  Read more: https://nextjs.org/docs/messages/middleware-request-page
  `);
    }
}
exports.RemovedPageError = RemovedPageError;
class RemovedUAError extends Error {
    constructor(){
        super(`The request.ua has been removed in favour of \`userAgent\` function.
  Read more: https://nextjs.org/docs/messages/middleware-parse-user-agent
  `);
    }
}
exports.RemovedUAError = RemovedUAError;

//# sourceMappingURL=error.js.map

/***/ }),

/***/ 961:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({
    value: true
}));
var _detectDomainLocale = __webpack_require__(156);
var _formatNextPathnameInfo = __webpack_require__(356);
var _getHostname = __webpack_require__(802);
var _getNextPathnameInfo = __webpack_require__(764);
const FLIGHT_PARAMETERS = [
    "__flight__",
    "__flight_router_state_tree__",
    "__flight_prefetch__", 
];
const REGEX_LOCALHOST_HOSTNAME = /(?!^https?:\/\/)(127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}|::1|localhost)/;
function parseURL(url, base) {
    return new URL(String(url).replace(REGEX_LOCALHOST_HOSTNAME, "localhost"), base && String(base).replace(REGEX_LOCALHOST_HOSTNAME, "localhost"));
}
function parseFlightParameters(searchParams) {
    let flightSearchParameters = {};
    let flightSearchParametersUpdated = false;
    for (const name of FLIGHT_PARAMETERS){
        const value = searchParams.get(name);
        if (value === null) {
            continue;
        }
        flightSearchParameters[name] = value;
        flightSearchParametersUpdated = true;
    }
    if (!flightSearchParametersUpdated) {
        return undefined;
    }
    return flightSearchParameters;
}
const Internal = Symbol("NextURLInternal");
class NextURL {
    constructor(input, baseOrOpts, opts){
        let base;
        let options;
        if (typeof baseOrOpts === "object" && "pathname" in baseOrOpts || typeof baseOrOpts === "string") {
            base = baseOrOpts;
            options = opts || {};
        } else {
            options = opts || baseOrOpts || {};
        }
        this[Internal] = {
            url: parseURL(input, base != null ? base : options.base),
            options: options,
            basePath: ""
        };
        this.analyzeUrl();
    }
    analyzeUrl() {
        var ref, ref1, ref2, ref3, ref4;
        const pathnameInfo = (0, _getNextPathnameInfo).getNextPathnameInfo(this[Internal].url.pathname, {
            nextConfig: this[Internal].options.nextConfig,
            parseData: !undefined
        });
        this[Internal].domainLocale = (0, _detectDomainLocale).detectDomainLocale((ref = this[Internal].options.nextConfig) == null ? void 0 : (ref1 = ref.i18n) == null ? void 0 : ref1.domains, (0, _getHostname).getHostname(this[Internal].url, this[Internal].options.headers));
        const defaultLocale = ((ref2 = this[Internal].domainLocale) == null ? void 0 : ref2.defaultLocale) || ((ref3 = this[Internal].options.nextConfig) == null ? void 0 : (ref4 = ref3.i18n) == null ? void 0 : ref4.defaultLocale);
        this[Internal].url.pathname = pathnameInfo.pathname;
        this[Internal].defaultLocale = defaultLocale;
        var _basePath;
        this[Internal].basePath = (_basePath = pathnameInfo.basePath) != null ? _basePath : "";
        this[Internal].buildId = pathnameInfo.buildId;
        var _locale;
        this[Internal].locale = (_locale = pathnameInfo.locale) != null ? _locale : defaultLocale;
        this[Internal].trailingSlash = pathnameInfo.trailingSlash;
        this[Internal].flightSearchParameters = parseFlightParameters(this[Internal].url.searchParams);
    }
    formatPathname() {
        return (0, _formatNextPathnameInfo).formatNextPathnameInfo({
            basePath: this[Internal].basePath,
            buildId: this[Internal].buildId,
            defaultLocale: !this[Internal].options.forceLocale ? this[Internal].defaultLocale : undefined,
            locale: this[Internal].locale,
            pathname: this[Internal].url.pathname,
            trailingSlash: this[Internal].trailingSlash
        });
    }
    formatSearch() {
        const flightSearchParameters = this[Internal].flightSearchParameters;
        // If no flight parameters are set, return the search string as is.
        // This is a fast path to ensure URLSearchParams only has to be recreated on Flight requests.
        if (!flightSearchParameters) {
            return this[Internal].url.search;
        }
        // Create separate URLSearchParams to ensure the original search string is not modified.
        const searchParams = new URLSearchParams(this[Internal].url.searchParams);
        // If any exist this loop is always limited to the amount of FLIGHT_PARAMETERS.
        for(const name in flightSearchParameters){
            searchParams.set(name, flightSearchParameters[name]);
        }
        const params = searchParams.toString();
        return params === "" ? "" : `?${params}`;
    }
    get buildId() {
        return this[Internal].buildId;
    }
    set buildId(buildId) {
        this[Internal].buildId = buildId;
    }
    get flightSearchParameters() {
        return this[Internal].flightSearchParameters;
    }
    set flightSearchParameters(flightSearchParams) {
        if (flightSearchParams) {
            for (const name of FLIGHT_PARAMETERS){
                // Ensure only the provided values are set
                if (flightSearchParams[name]) {
                    this[Internal].url.searchParams.set(name, flightSearchParams[name]);
                } else {
                    // Delete the ones that are not provided as flightData should be overridden.
                    this[Internal].url.searchParams.delete(name);
                }
            }
        } else {
            for (const name of FLIGHT_PARAMETERS){
                this[Internal].url.searchParams.delete(name);
            }
        }
        this[Internal].flightSearchParameters = flightSearchParams;
    }
    get locale() {
        var _locale;
        return (_locale = this[Internal].locale) != null ? _locale : "";
    }
    set locale(locale) {
        var ref, ref5;
        if (!this[Internal].locale || !((ref = this[Internal].options.nextConfig) == null ? void 0 : (ref5 = ref.i18n) == null ? void 0 : ref5.locales.includes(locale))) {
            throw new TypeError(`The NextURL configuration includes no locale "${locale}"`);
        }
        this[Internal].locale = locale;
    }
    get defaultLocale() {
        return this[Internal].defaultLocale;
    }
    get domainLocale() {
        return this[Internal].domainLocale;
    }
    get searchParams() {
        return this[Internal].url.searchParams;
    }
    get host() {
        return this[Internal].url.host;
    }
    set host(value) {
        this[Internal].url.host = value;
    }
    get hostname() {
        return this[Internal].url.hostname;
    }
    set hostname(value) {
        this[Internal].url.hostname = value;
    }
    get port() {
        return this[Internal].url.port;
    }
    set port(value) {
        this[Internal].url.port = value;
    }
    get protocol() {
        return this[Internal].url.protocol;
    }
    set protocol(value) {
        this[Internal].url.protocol = value;
    }
    get href() {
        const pathname = this.formatPathname();
        const search = this.formatSearch();
        return `${this.protocol}//${this.host}${pathname}${search}`;
    }
    set href(url) {
        this[Internal].url = parseURL(url);
        this.analyzeUrl();
    }
    get origin() {
        return this[Internal].url.origin;
    }
    get pathname() {
        return this[Internal].url.pathname;
    }
    set pathname(value) {
        this[Internal].url.pathname = value;
    }
    get hash() {
        return this[Internal].url.hash;
    }
    set hash(value) {
        this[Internal].url.hash = value;
    }
    get search() {
        return this[Internal].url.search;
    }
    set search(value) {
        this[Internal].url.search = value;
    }
    get password() {
        return this[Internal].url.password;
    }
    set password(value) {
        this[Internal].url.password = value;
    }
    get username() {
        return this[Internal].url.username;
    }
    set username(value) {
        this[Internal].url.username = value;
    }
    get basePath() {
        return this[Internal].basePath;
    }
    set basePath(value) {
        this[Internal].basePath = value.startsWith("/") ? value : `/${value}`;
    }
    toString() {
        return this.href;
    }
    toJSON() {
        return this.href;
    }
    [Symbol.for("edge-runtime.inspect.custom")]() {
        return {
            href: this.href,
            origin: this.origin,
            protocol: this.protocol,
            username: this.username,
            password: this.password,
            host: this.host,
            hostname: this.hostname,
            port: this.port,
            pathname: this.pathname,
            search: this.search,
            searchParams: this.searchParams,
            hash: this.hash
        };
    }
    clone() {
        return new NextURL(String(this), this[Internal].options);
    }
}
exports.NextURL = NextURL;

//# sourceMappingURL=next-url.js.map

/***/ }),

/***/ 993:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({
    value: true
}));
var _cookie = _interopRequireDefault(__webpack_require__(207));
function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
const normalizeCookieOptions = (options)=>{
    options = Object.assign({}, options);
    if (options.maxAge) {
        options.expires = new Date(Date.now() + options.maxAge * 1000);
    }
    if (options.path == null) {
        options.path = "/";
    }
    return options;
};
const serializeValue = (value)=>typeof value === "object" ? `j:${JSON.stringify(value)}` : String(value);
const serializeExpiredCookie = (key, options = {})=>_cookie.default.serialize(key, "", {
        expires: new Date(0),
        path: "/",
        ...options
    });
const deserializeCookie = (input)=>{
    const value = input.headers.get("set-cookie");
    return value !== undefined && value !== null ? value.split(", ") : [];
};
const serializeCookie = (input)=>input.join(", ");
class Cookies extends Map {
    constructor(input){
        const parsedInput = typeof input === "string" ? _cookie.default.parse(input) : {};
        super(Object.entries(parsedInput));
    }
    set(key, value, options = {}) {
        return super.set(key, _cookie.default.serialize(key, serializeValue(value), normalizeCookieOptions(options)));
    }
    [Symbol.for("edge-runtime.inspect.custom")]() {
        return Object.fromEntries(this.entries());
    }
}
exports.Cookies = Cookies;
class NextCookies extends Cookies {
    constructor(response){
        super(response.headers.get("cookie"));
        this.response = response;
    }
    get = (...args)=>{
        return this.getWithOptions(...args).value;
    };
    getWithOptions = (...args)=>{
        const raw = super.get(...args);
        if (typeof raw !== "string") return {
            value: raw,
            options: {}
        };
        const { [args[0]]: value , ...options } = _cookie.default.parse(raw);
        return {
            value,
            options
        };
    };
    set = (...args)=>{
        const isAlreadyAdded = super.has(args[0]);
        super.set(...args);
        const currentCookie = super.get(args[0]);
        if (typeof currentCookie !== "string") {
            throw new Error(`Invariant: failed to generate cookie for ${JSON.stringify(args)}`);
        }
        if (isAlreadyAdded) {
            const setCookie = serializeCookie(deserializeCookie(this.response).filter((value)=>!value.startsWith(`${args[0]}=`)));
            if (setCookie) {
                this.response.headers.set("set-cookie", [
                    currentCookie,
                    setCookie
                ].join(", "));
            } else {
                this.response.headers.set("set-cookie", currentCookie);
            }
        } else {
            this.response.headers.append("set-cookie", currentCookie);
        }
        return this;
    };
    delete = (key, options = {})=>{
        const isDeleted = super.delete(key);
        if (isDeleted) {
            const setCookie = serializeCookie(deserializeCookie(this.response).filter((value)=>!value.startsWith(`${key}=`)));
            const expiredCookie = serializeExpiredCookie(key, options);
            this.response.headers.set("set-cookie", [
                expiredCookie,
                setCookie
            ].join(", "));
        }
        return isDeleted;
    };
    clear = (options = {})=>{
        const expiredCookies = Array.from(super.keys()).map((key)=>serializeExpiredCookie(key, options)).join(", ");
        if (expiredCookies) this.response.headers.set("set-cookie", expiredCookies);
        return super.clear();
    };
}
exports.NextCookies = NextCookies;

//# sourceMappingURL=cookies.js.map

/***/ }),

/***/ 125:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({
    value: true
}));
exports.waitUntilSymbol = void 0;
var _error = __webpack_require__(928);
const responseSymbol = Symbol("response");
const passThroughSymbol = Symbol("passThrough");
const waitUntilSymbol = Symbol("waitUntil");
exports.waitUntilSymbol = waitUntilSymbol;
class FetchEvent {
    [waitUntilSymbol] = [];
    [passThroughSymbol] = false;
    // eslint-disable-next-line @typescript-eslint/no-useless-constructor
    constructor(_request){}
    respondWith(response) {
        if (!this[responseSymbol]) {
            this[responseSymbol] = Promise.resolve(response);
        }
    }
    passThroughOnException() {
        this[passThroughSymbol] = true;
    }
    waitUntil(promise) {
        this[waitUntilSymbol].push(promise);
    }
}
class NextFetchEvent extends FetchEvent {
    constructor(params){
        super(params.request);
        this.sourcePage = params.page;
    }
    /**
   * @deprecated The `request` is now the first parameter and the API is now async.
   *
   * Read more: https://nextjs.org/docs/messages/middleware-new-signature
   */ get request() {
        throw new _error.PageSignatureError({
            page: this.sourcePage
        });
    }
    /**
   * @deprecated Using `respondWith` is no longer needed.
   *
   * Read more: https://nextjs.org/docs/messages/middleware-new-signature
   */ respondWith() {
        throw new _error.PageSignatureError({
            page: this.sourcePage
        });
    }
}
exports.NextFetchEvent = NextFetchEvent;

//# sourceMappingURL=fetch-event.js.map

/***/ }),

/***/ 953:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({
    value: true
}));
exports.INTERNALS = void 0;
var _nextUrl = __webpack_require__(961);
var _utils = __webpack_require__(625);
var _error = __webpack_require__(928);
var _cookies = __webpack_require__(993);
const INTERNALS = Symbol("internal request");
exports.INTERNALS = INTERNALS;
class NextRequest extends Request {
    constructor(input, init = {}){
        const url = typeof input !== "string" && "url" in input ? input.url : String(input);
        (0, _utils).validateURL(url);
        super(url, init);
        this[INTERNALS] = {
            cookies: new _cookies.NextCookies(this),
            geo: init.geo || {},
            ip: init.ip,
            url: new _nextUrl.NextURL(url, {
                headers: (0, _utils).toNodeHeaders(this.headers),
                nextConfig: init.nextConfig
            })
        };
    }
    [Symbol.for("edge-runtime.inspect.custom")]() {
        return {
            cookies: this.cookies,
            geo: this.geo,
            ip: this.ip,
            nextUrl: this.nextUrl,
            url: this.url,
            // rest of props come from Request
            bodyUsed: this.bodyUsed,
            cache: this.cache,
            credentials: this.credentials,
            destination: this.destination,
            headers: Object.fromEntries(this.headers),
            integrity: this.integrity,
            keepalive: this.keepalive,
            method: this.method,
            mode: this.mode,
            redirect: this.redirect,
            referrer: this.referrer,
            referrerPolicy: this.referrerPolicy,
            signal: this.signal
        };
    }
    get cookies() {
        return this[INTERNALS].cookies;
    }
    get geo() {
        return this[INTERNALS].geo;
    }
    get ip() {
        return this[INTERNALS].ip;
    }
    get nextUrl() {
        return this[INTERNALS].url;
    }
    /**
   * @deprecated
   * `page` has been deprecated in favour of `URLPattern`.
   * Read more: https://nextjs.org/docs/messages/middleware-request-page
   */ get page() {
        throw new _error.RemovedPageError();
    }
    /**
   * @deprecated
   * `ua` has been removed in favour of \`userAgent\` function.
   * Read more: https://nextjs.org/docs/messages/middleware-parse-user-agent
   */ get ua() {
        throw new _error.RemovedUAError();
    }
    get url() {
        return this[INTERNALS].url.toString();
    }
}
exports.NextRequest = NextRequest;

//# sourceMappingURL=request.js.map

/***/ }),

/***/ 57:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({
    value: true
}));
var _nextUrl = __webpack_require__(961);
var _utils = __webpack_require__(625);
var _cookies = __webpack_require__(993);
const INTERNALS = Symbol("internal response");
const REDIRECTS = new Set([
    301,
    302,
    303,
    307,
    308
]);
class NextResponse extends Response {
    constructor(body, init = {}){
        super(body, init);
        this[INTERNALS] = {
            cookies: new _cookies.NextCookies(this),
            url: init.url ? new _nextUrl.NextURL(init.url, {
                headers: (0, _utils).toNodeHeaders(this.headers),
                nextConfig: init.nextConfig
            }) : undefined
        };
    }
    [Symbol.for("edge-runtime.inspect.custom")]() {
        return {
            cookies: this.cookies,
            url: this.url,
            // rest of props come from Response
            body: this.body,
            bodyUsed: this.bodyUsed,
            headers: Object.fromEntries(this.headers),
            ok: this.ok,
            redirected: this.redirected,
            status: this.status,
            statusText: this.statusText,
            type: this.type
        };
    }
    get cookies() {
        return this[INTERNALS].cookies;
    }
    static json(body, init) {
        // @ts-expect-error This is not in lib/dom right now, and we can't augment it.
        const response = Response.json(body, init);
        return new NextResponse(response.body, response);
    }
    static redirect(url, init) {
        var ref;
        const status = typeof init === "number" ? init : (ref = init == null ? void 0 : init.status) != null ? ref : 307;
        if (!REDIRECTS.has(status)) {
            throw new RangeError('Failed to execute "redirect" on "response": Invalid status code');
        }
        const initObj = typeof init === "object" ? init : {};
        const headers = new Headers(initObj == null ? void 0 : initObj.headers);
        headers.set("Location", (0, _utils).validateURL(url));
        return new NextResponse(null, {
            ...initObj,
            headers,
            status
        });
    }
    static rewrite(destination, init) {
        const headers = new Headers(init == null ? void 0 : init.headers);
        headers.set("x-middleware-rewrite", (0, _utils).validateURL(destination));
        return new NextResponse(null, {
            ...init,
            headers
        });
    }
    static next(init) {
        const headers = new Headers(init == null ? void 0 : init.headers);
        headers.set("x-middleware-next", "1");
        return new NextResponse(null, {
            ...init,
            headers
        });
    }
}
exports.NextResponse = NextResponse;

//# sourceMappingURL=response.js.map

/***/ }),

/***/ 625:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({
    value: true
}));
exports.fromNodeHeaders = fromNodeHeaders;
exports.splitCookiesString = splitCookiesString;
exports.toNodeHeaders = toNodeHeaders;
exports.validateURL = validateURL;
function fromNodeHeaders(object) {
    const headers = new Headers();
    for (let [key, value] of Object.entries(object)){
        const values = Array.isArray(value) ? value : [
            value
        ];
        for (let v of values){
            if (v !== undefined) {
                headers.append(key, v);
            }
        }
    }
    return headers;
}
function splitCookiesString(cookiesString) {
    var cookiesStrings = [];
    var pos = 0;
    var start;
    var ch;
    var lastComma;
    var nextStart;
    var cookiesSeparatorFound;
    function skipWhitespace() {
        while(pos < cookiesString.length && /\s/.test(cookiesString.charAt(pos))){
            pos += 1;
        }
        return pos < cookiesString.length;
    }
    function notSpecialChar() {
        ch = cookiesString.charAt(pos);
        return ch !== "=" && ch !== ";" && ch !== ",";
    }
    while(pos < cookiesString.length){
        start = pos;
        cookiesSeparatorFound = false;
        while(skipWhitespace()){
            ch = cookiesString.charAt(pos);
            if (ch === ",") {
                // ',' is a cookie separator if we have later first '=', not ';' or ','
                lastComma = pos;
                pos += 1;
                skipWhitespace();
                nextStart = pos;
                while(pos < cookiesString.length && notSpecialChar()){
                    pos += 1;
                }
                // currently special character
                if (pos < cookiesString.length && cookiesString.charAt(pos) === "=") {
                    // we found cookies separator
                    cookiesSeparatorFound = true;
                    // pos is inside the next cookie, so back up and return it.
                    pos = nextStart;
                    cookiesStrings.push(cookiesString.substring(start, lastComma));
                    start = pos;
                } else {
                    // in param ',' or param separator ';',
                    // we continue from that comma
                    pos = lastComma + 1;
                }
            } else {
                pos += 1;
            }
        }
        if (!cookiesSeparatorFound || pos >= cookiesString.length) {
            cookiesStrings.push(cookiesString.substring(start, cookiesString.length));
        }
    }
    return cookiesStrings;
}
function toNodeHeaders(headers) {
    const result = {};
    if (headers) {
        for (const [key, value] of headers.entries()){
            result[key] = value;
            if (key.toLowerCase() === "set-cookie") {
                result[key] = splitCookiesString(value);
            }
        }
    }
    return result;
}
function validateURL(url) {
    try {
        return String(new URL(String(url)));
    } catch (error) {
        throw new Error(`URLs is malformed. Please use only absolute URLs - https://nextjs.org/docs/messages/middleware-relative-urls`, {
            cause: error
        });
    }
}

//# sourceMappingURL=utils.js.map

/***/ }),

/***/ 972:
/***/ ((module) => {

"use strict";

module.exports = () => {
	const ret = {};

	ret.promise = new Promise((resolve, reject) => {
		ret.resolve = resolve;
		ret.reject = reject;
	});

	return ret;
};


/***/ }),

/***/ 627:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var parse = __webpack_require__(899);
var walk = __webpack_require__(861);
var stringify = __webpack_require__(414);

function ValueParser(value) {
  if (this instanceof ValueParser) {
    this.nodes = parse(value);
    return this;
  }
  return new ValueParser(value);
}

ValueParser.prototype.toString = function() {
  return Array.isArray(this.nodes) ? stringify(this.nodes) : "";
};

ValueParser.prototype.walk = function(cb, bubble) {
  walk(this.nodes, cb, bubble);
  return this;
};

ValueParser.unit = __webpack_require__(172);

ValueParser.walk = walk;

ValueParser.stringify = stringify;

module.exports = ValueParser;


/***/ }),

/***/ 899:
/***/ ((module) => {

var openParentheses = "(".charCodeAt(0);
var closeParentheses = ")".charCodeAt(0);
var singleQuote = "'".charCodeAt(0);
var doubleQuote = '"'.charCodeAt(0);
var backslash = "\\".charCodeAt(0);
var slash = "/".charCodeAt(0);
var comma = ",".charCodeAt(0);
var colon = ":".charCodeAt(0);
var star = "*".charCodeAt(0);
var uLower = "u".charCodeAt(0);
var uUpper = "U".charCodeAt(0);
var plus = "+".charCodeAt(0);
var isUnicodeRange = /^[a-f0-9?-]+$/i;

module.exports = function(input) {
  var tokens = [];
  var value = input;

  var next,
    quote,
    prev,
    token,
    escape,
    escapePos,
    whitespacePos,
    parenthesesOpenPos;
  var pos = 0;
  var code = value.charCodeAt(pos);
  var max = value.length;
  var stack = [{ nodes: tokens }];
  var balanced = 0;
  var parent;

  var name = "";
  var before = "";
  var after = "";

  while (pos < max) {
    // Whitespaces
    if (code <= 32) {
      next = pos;
      do {
        next += 1;
        code = value.charCodeAt(next);
      } while (code <= 32);
      token = value.slice(pos, next);

      prev = tokens[tokens.length - 1];
      if (code === closeParentheses && balanced) {
        after = token;
      } else if (prev && prev.type === "div") {
        prev.after = token;
        prev.sourceEndIndex += token.length;
      } else if (
        code === comma ||
        code === colon ||
        (code === slash &&
          value.charCodeAt(next + 1) !== star &&
          (!parent ||
            (parent && parent.type === "function" && parent.value !== "calc")))
      ) {
        before = token;
      } else {
        tokens.push({
          type: "space",
          sourceIndex: pos,
          sourceEndIndex: next,
          value: token
        });
      }

      pos = next;

      // Quotes
    } else if (code === singleQuote || code === doubleQuote) {
      next = pos;
      quote = code === singleQuote ? "'" : '"';
      token = {
        type: "string",
        sourceIndex: pos,
        quote: quote
      };
      do {
        escape = false;
        next = value.indexOf(quote, next + 1);
        if (~next) {
          escapePos = next;
          while (value.charCodeAt(escapePos - 1) === backslash) {
            escapePos -= 1;
            escape = !escape;
          }
        } else {
          value += quote;
          next = value.length - 1;
          token.unclosed = true;
        }
      } while (escape);
      token.value = value.slice(pos + 1, next);
      token.sourceEndIndex = token.unclosed ? next : next + 1;
      tokens.push(token);
      pos = next + 1;
      code = value.charCodeAt(pos);

      // Comments
    } else if (code === slash && value.charCodeAt(pos + 1) === star) {
      next = value.indexOf("*/", pos);

      token = {
        type: "comment",
        sourceIndex: pos,
        sourceEndIndex: next + 2
      };

      if (next === -1) {
        token.unclosed = true;
        next = value.length;
        token.sourceEndIndex = next;
      }

      token.value = value.slice(pos + 2, next);
      tokens.push(token);

      pos = next + 2;
      code = value.charCodeAt(pos);

      // Operation within calc
    } else if (
      (code === slash || code === star) &&
      parent &&
      parent.type === "function" &&
      parent.value === "calc"
    ) {
      token = value[pos];
      tokens.push({
        type: "word",
        sourceIndex: pos - before.length,
        sourceEndIndex: pos + token.length,
        value: token
      });
      pos += 1;
      code = value.charCodeAt(pos);

      // Dividers
    } else if (code === slash || code === comma || code === colon) {
      token = value[pos];

      tokens.push({
        type: "div",
        sourceIndex: pos - before.length,
        sourceEndIndex: pos + token.length,
        value: token,
        before: before,
        after: ""
      });
      before = "";

      pos += 1;
      code = value.charCodeAt(pos);

      // Open parentheses
    } else if (openParentheses === code) {
      // Whitespaces after open parentheses
      next = pos;
      do {
        next += 1;
        code = value.charCodeAt(next);
      } while (code <= 32);
      parenthesesOpenPos = pos;
      token = {
        type: "function",
        sourceIndex: pos - name.length,
        value: name,
        before: value.slice(parenthesesOpenPos + 1, next)
      };
      pos = next;

      if (name === "url" && code !== singleQuote && code !== doubleQuote) {
        next -= 1;
        do {
          escape = false;
          next = value.indexOf(")", next + 1);
          if (~next) {
            escapePos = next;
            while (value.charCodeAt(escapePos - 1) === backslash) {
              escapePos -= 1;
              escape = !escape;
            }
          } else {
            value += ")";
            next = value.length - 1;
            token.unclosed = true;
          }
        } while (escape);
        // Whitespaces before closed
        whitespacePos = next;
        do {
          whitespacePos -= 1;
          code = value.charCodeAt(whitespacePos);
        } while (code <= 32);
        if (parenthesesOpenPos < whitespacePos) {
          if (pos !== whitespacePos + 1) {
            token.nodes = [
              {
                type: "word",
                sourceIndex: pos,
                sourceEndIndex: whitespacePos + 1,
                value: value.slice(pos, whitespacePos + 1)
              }
            ];
          } else {
            token.nodes = [];
          }
          if (token.unclosed && whitespacePos + 1 !== next) {
            token.after = "";
            token.nodes.push({
              type: "space",
              sourceIndex: whitespacePos + 1,
              sourceEndIndex: next,
              value: value.slice(whitespacePos + 1, next)
            });
          } else {
            token.after = value.slice(whitespacePos + 1, next);
            token.sourceEndIndex = next;
          }
        } else {
          token.after = "";
          token.nodes = [];
        }
        pos = next + 1;
        token.sourceEndIndex = token.unclosed ? next : pos;
        code = value.charCodeAt(pos);
        tokens.push(token);
      } else {
        balanced += 1;
        token.after = "";
        token.sourceEndIndex = pos + 1;
        tokens.push(token);
        stack.push(token);
        tokens = token.nodes = [];
        parent = token;
      }
      name = "";

      // Close parentheses
    } else if (closeParentheses === code && balanced) {
      pos += 1;
      code = value.charCodeAt(pos);

      parent.after = after;
      parent.sourceEndIndex += after.length;
      after = "";
      balanced -= 1;
      stack[stack.length - 1].sourceEndIndex = pos;
      stack.pop();
      parent = stack[balanced];
      tokens = parent.nodes;

      // Words
    } else {
      next = pos;
      do {
        if (code === backslash) {
          next += 1;
        }
        next += 1;
        code = value.charCodeAt(next);
      } while (
        next < max &&
        !(
          code <= 32 ||
          code === singleQuote ||
          code === doubleQuote ||
          code === comma ||
          code === colon ||
          code === slash ||
          code === openParentheses ||
          (code === star &&
            parent &&
            parent.type === "function" &&
            parent.value === "calc") ||
          (code === slash &&
            parent.type === "function" &&
            parent.value === "calc") ||
          (code === closeParentheses && balanced)
        )
      );
      token = value.slice(pos, next);

      if (openParentheses === code) {
        name = token;
      } else if (
        (uLower === token.charCodeAt(0) || uUpper === token.charCodeAt(0)) &&
        plus === token.charCodeAt(1) &&
        isUnicodeRange.test(token.slice(2))
      ) {
        tokens.push({
          type: "unicode-range",
          sourceIndex: pos,
          sourceEndIndex: next,
          value: token
        });
      } else {
        tokens.push({
          type: "word",
          sourceIndex: pos,
          sourceEndIndex: next,
          value: token
        });
      }

      pos = next;
    }
  }

  for (pos = stack.length - 1; pos; pos -= 1) {
    stack[pos].unclosed = true;
    stack[pos].sourceEndIndex = value.length;
  }

  return stack[0].nodes;
};


/***/ }),

/***/ 414:
/***/ ((module) => {

function stringifyNode(node, custom) {
  var type = node.type;
  var value = node.value;
  var buf;
  var customResult;

  if (custom && (customResult = custom(node)) !== undefined) {
    return customResult;
  } else if (type === "word" || type === "space") {
    return value;
  } else if (type === "string") {
    buf = node.quote || "";
    return buf + value + (node.unclosed ? "" : buf);
  } else if (type === "comment") {
    return "/*" + value + (node.unclosed ? "" : "*/");
  } else if (type === "div") {
    return (node.before || "") + value + (node.after || "");
  } else if (Array.isArray(node.nodes)) {
    buf = stringify(node.nodes, custom);
    if (type !== "function") {
      return buf;
    }
    return (
      value +
      "(" +
      (node.before || "") +
      buf +
      (node.after || "") +
      (node.unclosed ? "" : ")")
    );
  }
  return value;
}

function stringify(nodes, custom) {
  var result, i;

  if (Array.isArray(nodes)) {
    result = "";
    for (i = nodes.length - 1; ~i; i -= 1) {
      result = stringifyNode(nodes[i], custom) + result;
    }
    return result;
  }
  return stringifyNode(nodes, custom);
}

module.exports = stringify;


/***/ }),

/***/ 172:
/***/ ((module) => {

var minus = "-".charCodeAt(0);
var plus = "+".charCodeAt(0);
var dot = ".".charCodeAt(0);
var exp = "e".charCodeAt(0);
var EXP = "E".charCodeAt(0);

// Check if three code points would start a number
// https://www.w3.org/TR/css-syntax-3/#starts-with-a-number
function likeNumber(value) {
  var code = value.charCodeAt(0);
  var nextCode;

  if (code === plus || code === minus) {
    nextCode = value.charCodeAt(1);

    if (nextCode >= 48 && nextCode <= 57) {
      return true;
    }

    var nextNextCode = value.charCodeAt(2);

    if (nextCode === dot && nextNextCode >= 48 && nextNextCode <= 57) {
      return true;
    }

    return false;
  }

  if (code === dot) {
    nextCode = value.charCodeAt(1);

    if (nextCode >= 48 && nextCode <= 57) {
      return true;
    }

    return false;
  }

  if (code >= 48 && code <= 57) {
    return true;
  }

  return false;
}

// Consume a number
// https://www.w3.org/TR/css-syntax-3/#consume-number
module.exports = function(value) {
  var pos = 0;
  var length = value.length;
  var code;
  var nextCode;
  var nextNextCode;

  if (length === 0 || !likeNumber(value)) {
    return false;
  }

  code = value.charCodeAt(pos);

  if (code === plus || code === minus) {
    pos++;
  }

  while (pos < length) {
    code = value.charCodeAt(pos);

    if (code < 48 || code > 57) {
      break;
    }

    pos += 1;
  }

  code = value.charCodeAt(pos);
  nextCode = value.charCodeAt(pos + 1);

  if (code === dot && nextCode >= 48 && nextCode <= 57) {
    pos += 2;

    while (pos < length) {
      code = value.charCodeAt(pos);

      if (code < 48 || code > 57) {
        break;
      }

      pos += 1;
    }
  }

  code = value.charCodeAt(pos);
  nextCode = value.charCodeAt(pos + 1);
  nextNextCode = value.charCodeAt(pos + 2);

  if (
    (code === exp || code === EXP) &&
    ((nextCode >= 48 && nextCode <= 57) ||
      ((nextCode === plus || nextCode === minus) &&
        nextNextCode >= 48 &&
        nextNextCode <= 57))
  ) {
    pos += nextCode === plus || nextCode === minus ? 3 : 2;

    while (pos < length) {
      code = value.charCodeAt(pos);

      if (code < 48 || code > 57) {
        break;
      }

      pos += 1;
    }
  }

  return {
    number: value.slice(0, pos),
    unit: value.slice(pos)
  };
};


/***/ }),

/***/ 861:
/***/ ((module) => {

module.exports = function walk(nodes, cb, bubble) {
  var i, max, node, result;

  for (i = 0, max = nodes.length; i < max; i += 1) {
    node = nodes[i];
    if (!bubble) {
      result = cb(node, i, nodes);
    }

    if (
      result !== false &&
      node.type === "function" &&
      Array.isArray(node.nodes)
    ) {
      walk(node.nodes, cb, bubble);
    }

    if (bubble) {
      cb(node, i, nodes);
    }
  }
};


/***/ }),

/***/ 914:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";
var __webpack_unused_export__;
/**
 * @license React
 * react-jsx-runtime.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var f=__webpack_require__(618),k=Symbol.for("react.element"),l=Symbol.for("react.fragment"),m=Object.prototype.hasOwnProperty,n=f.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner,p={key:!0,ref:!0,__self:!0,__source:!0};
function q(c,a,g){var b,d={},e=null,h=null;void 0!==g&&(e=""+g);void 0!==a.key&&(e=""+a.key);void 0!==a.ref&&(h=a.ref);for(b in a)m.call(a,b)&&!p.hasOwnProperty(b)&&(d[b]=a[b]);if(c&&c.defaultProps)for(b in a=c.defaultProps,a)void 0===d[b]&&(d[b]=a[b]);return{$$typeof:k,type:c,key:e,ref:h,props:d,_owner:n.current}}__webpack_unused_export__=l;exports.jsx=q;exports.jsxs=q;


/***/ }),

/***/ 280:
/***/ ((__unused_webpack_module, exports) => {

"use strict";
/**
 * @license React
 * react.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var l=Symbol.for("react.element"),n=Symbol.for("react.portal"),p=Symbol.for("react.fragment"),q=Symbol.for("react.strict_mode"),r=Symbol.for("react.profiler"),t=Symbol.for("react.provider"),u=Symbol.for("react.context"),v=Symbol.for("react.forward_ref"),w=Symbol.for("react.suspense"),x=Symbol.for("react.memo"),y=Symbol.for("react.lazy"),z=Symbol.iterator;function A(a){if(null===a||"object"!==typeof a)return null;a=z&&a[z]||a["@@iterator"];return"function"===typeof a?a:null}
var B={isMounted:function(){return!1},enqueueForceUpdate:function(){},enqueueReplaceState:function(){},enqueueSetState:function(){}},C=Object.assign,D={};function E(a,b,e){this.props=a;this.context=b;this.refs=D;this.updater=e||B}E.prototype.isReactComponent={};
E.prototype.setState=function(a,b){if("object"!==typeof a&&"function"!==typeof a&&null!=a)throw Error("setState(...): takes an object of state variables to update or a function which returns an object of state variables.");this.updater.enqueueSetState(this,a,b,"setState")};E.prototype.forceUpdate=function(a){this.updater.enqueueForceUpdate(this,a,"forceUpdate")};function F(){}F.prototype=E.prototype;function G(a,b,e){this.props=a;this.context=b;this.refs=D;this.updater=e||B}var H=G.prototype=new F;
H.constructor=G;C(H,E.prototype);H.isPureReactComponent=!0;var I=Array.isArray,J=Object.prototype.hasOwnProperty,K={current:null},L={key:!0,ref:!0,__self:!0,__source:!0};
function M(a,b,e){var d,c={},k=null,h=null;if(null!=b)for(d in void 0!==b.ref&&(h=b.ref),void 0!==b.key&&(k=""+b.key),b)J.call(b,d)&&!L.hasOwnProperty(d)&&(c[d]=b[d]);var g=arguments.length-2;if(1===g)c.children=e;else if(1<g){for(var f=Array(g),m=0;m<g;m++)f[m]=arguments[m+2];c.children=f}if(a&&a.defaultProps)for(d in g=a.defaultProps,g)void 0===c[d]&&(c[d]=g[d]);return{$$typeof:l,type:a,key:k,ref:h,props:c,_owner:K.current}}
function N(a,b){return{$$typeof:l,type:a.type,key:b,ref:a.ref,props:a.props,_owner:a._owner}}function O(a){return"object"===typeof a&&null!==a&&a.$$typeof===l}function escape(a){var b={"=":"=0",":":"=2"};return"$"+a.replace(/[=:]/g,function(a){return b[a]})}var P=/\/+/g;function Q(a,b){return"object"===typeof a&&null!==a&&null!=a.key?escape(""+a.key):b.toString(36)}
function R(a,b,e,d,c){var k=typeof a;if("undefined"===k||"boolean"===k)a=null;var h=!1;if(null===a)h=!0;else switch(k){case "string":case "number":h=!0;break;case "object":switch(a.$$typeof){case l:case n:h=!0}}if(h)return h=a,c=c(h),a=""===d?"."+Q(h,0):d,I(c)?(e="",null!=a&&(e=a.replace(P,"$&/")+"/"),R(c,b,e,"",function(a){return a})):null!=c&&(O(c)&&(c=N(c,e+(!c.key||h&&h.key===c.key?"":(""+c.key).replace(P,"$&/")+"/")+a)),b.push(c)),1;h=0;d=""===d?".":d+":";if(I(a))for(var g=0;g<a.length;g++){k=
a[g];var f=d+Q(k,g);h+=R(k,b,e,f,c)}else if(f=A(a),"function"===typeof f)for(a=f.call(a),g=0;!(k=a.next()).done;)k=k.value,f=d+Q(k,g++),h+=R(k,b,e,f,c);else if("object"===k)throw b=String(a),Error("Objects are not valid as a React child (found: "+("[object Object]"===b?"object with keys {"+Object.keys(a).join(", ")+"}":b)+"). If you meant to render a collection of children, use an array instead.");return h}
function S(a,b,e){if(null==a)return a;var d=[],c=0;R(a,d,"","",function(a){return b.call(e,a,c++)});return d}function T(a){if(-1===a._status){var b=a._result;b=b();b.then(function(b){if(0===a._status||-1===a._status)a._status=1,a._result=b},function(b){if(0===a._status||-1===a._status)a._status=2,a._result=b});-1===a._status&&(a._status=0,a._result=b)}if(1===a._status)return a._result.default;throw a._result;}
var U={current:null},V={transition:null},W={ReactCurrentDispatcher:U,ReactCurrentBatchConfig:V,ReactCurrentOwner:K};exports.Children={map:S,forEach:function(a,b,e){S(a,function(){b.apply(this,arguments)},e)},count:function(a){var b=0;S(a,function(){b++});return b},toArray:function(a){return S(a,function(a){return a})||[]},only:function(a){if(!O(a))throw Error("React.Children.only expected to receive a single React element child.");return a}};exports.Component=E;exports.Fragment=p;
exports.Profiler=r;exports.PureComponent=G;exports.StrictMode=q;exports.Suspense=w;exports.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED=W;
exports.cloneElement=function(a,b,e){if(null===a||void 0===a)throw Error("React.cloneElement(...): The argument must be a React element, but you passed "+a+".");var d=C({},a.props),c=a.key,k=a.ref,h=a._owner;if(null!=b){void 0!==b.ref&&(k=b.ref,h=K.current);void 0!==b.key&&(c=""+b.key);if(a.type&&a.type.defaultProps)var g=a.type.defaultProps;for(f in b)J.call(b,f)&&!L.hasOwnProperty(f)&&(d[f]=void 0===b[f]&&void 0!==g?g[f]:b[f])}var f=arguments.length-2;if(1===f)d.children=e;else if(1<f){g=Array(f);
for(var m=0;m<f;m++)g[m]=arguments[m+2];d.children=g}return{$$typeof:l,type:a.type,key:c,ref:k,props:d,_owner:h}};exports.createContext=function(a){a={$$typeof:u,_currentValue:a,_currentValue2:a,_threadCount:0,Provider:null,Consumer:null,_defaultValue:null,_globalName:null};a.Provider={$$typeof:t,_context:a};return a.Consumer=a};exports.createElement=M;exports.createFactory=function(a){var b=M.bind(null,a);b.type=a;return b};exports.createRef=function(){return{current:null}};
exports.forwardRef=function(a){return{$$typeof:v,render:a}};exports.isValidElement=O;exports.lazy=function(a){return{$$typeof:y,_payload:{_status:-1,_result:a},_init:T}};exports.memo=function(a,b){return{$$typeof:x,type:a,compare:void 0===b?null:b}};exports.startTransition=function(a){var b=V.transition;V.transition={};try{a()}finally{V.transition=b}};exports.unstable_act=function(){throw Error("act(...) is not supported in production builds of React.");};
exports.useCallback=function(a,b){return U.current.useCallback(a,b)};exports.useContext=function(a){return U.current.useContext(a)};exports.useDebugValue=function(){};exports.useDeferredValue=function(a){return U.current.useDeferredValue(a)};exports.useEffect=function(a,b){return U.current.useEffect(a,b)};exports.useId=function(){return U.current.useId()};exports.useImperativeHandle=function(a,b,e){return U.current.useImperativeHandle(a,b,e)};
exports.useInsertionEffect=function(a,b){return U.current.useInsertionEffect(a,b)};exports.useLayoutEffect=function(a,b){return U.current.useLayoutEffect(a,b)};exports.useMemo=function(a,b){return U.current.useMemo(a,b)};exports.useReducer=function(a,b,e){return U.current.useReducer(a,b,e)};exports.useRef=function(a){return U.current.useRef(a)};exports.useState=function(a){return U.current.useState(a)};exports.useSyncExternalStore=function(a,b,e){return U.current.useSyncExternalStore(a,b,e)};
exports.useTransition=function(){return U.current.useTransition()};exports.version="18.2.0";


/***/ }),

/***/ 618:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


if (true) {
  module.exports = __webpack_require__(280);
} else {}


/***/ }),

/***/ 425:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


if (true) {
  module.exports = __webpack_require__(914);
} else {}


/***/ }),

/***/ 814:
/***/ ((module) => {

"use strict";
module.exports = JSON.parse('{"black":"#000000","silver":"#c0c0c0","gray":"#808080","white":"#ffffff","maroon":"#800000","red":"#ff0000","purple":"#800080","fuchsia":"#ff00ff","green":"#008000","lime":"#00ff00","olive":"#808000","yellow":"#ffff00","navy":"#000080","blue":"#0000ff","teal":"#008080","aqua":"#00ffff","orange":"#ffa500","aliceblue":"#f0f8ff","antiquewhite":"#faebd7","aquamarine":"#7fffd4","azure":"#f0ffff","beige":"#f5f5dc","bisque":"#ffe4c4","blanchedalmond":"#ffebcd","blueviolet":"#8a2be2","brown":"#a52a2a","burlywood":"#deb887","cadetblue":"#5f9ea0","chartreuse":"#7fff00","chocolate":"#d2691e","coral":"#ff7f50","cornflowerblue":"#6495ed","cornsilk":"#fff8dc","crimson":"#dc143c","darkblue":"#00008b","darkcyan":"#008b8b","darkgoldenrod":"#b8860b","darkgray":"#a9a9a9","darkgreen":"#006400","darkgrey":"#a9a9a9","darkkhaki":"#bdb76b","darkmagenta":"#8b008b","darkolivegreen":"#556b2f","darkorange":"#ff8c00","darkorchid":"#9932cc","darkred":"#8b0000","darksalmon":"#e9967a","darkseagreen":"#8fbc8f","darkslateblue":"#483d8b","darkslategray":"#2f4f4f","darkslategrey":"#2f4f4f","darkturquoise":"#00ced1","darkviolet":"#9400d3","deeppink":"#ff1493","deepskyblue":"#00bfff","dimgray":"#696969","dimgrey":"#696969","dodgerblue":"#1e90ff","firebrick":"#b22222","floralwhite":"#fffaf0","forestgreen":"#228b22","gainsboro":"#dcdcdc","ghostwhite":"#f8f8ff","gold":"#ffd700","goldenrod":"#daa520","greenyellow":"#adff2f","grey":"#808080","honeydew":"#f0fff0","hotpink":"#ff69b4","indianred":"#cd5c5c","indigo":"#4b0082","ivory":"#fffff0","khaki":"#f0e68c","lavender":"#e6e6fa","lavenderblush":"#fff0f5","lawngreen":"#7cfc00","lemonchiffon":"#fffacd","lightblue":"#add8e6","lightcoral":"#f08080","lightcyan":"#e0ffff","lightgoldenrodyellow":"#fafad2","lightgray":"#d3d3d3","lightgreen":"#90ee90","lightgrey":"#d3d3d3","lightpink":"#ffb6c1","lightsalmon":"#ffa07a","lightseagreen":"#20b2aa","lightskyblue":"#87cefa","lightslategray":"#778899","lightslategrey":"#778899","lightsteelblue":"#b0c4de","lightyellow":"#ffffe0","limegreen":"#32cd32","linen":"#faf0e6","mediumaquamarine":"#66cdaa","mediumblue":"#0000cd","mediumorchid":"#ba55d3","mediumpurple":"#9370db","mediumseagreen":"#3cb371","mediumslateblue":"#7b68ee","mediumspringgreen":"#00fa9a","mediumturquoise":"#48d1cc","mediumvioletred":"#c71585","midnightblue":"#191970","mintcream":"#f5fffa","mistyrose":"#ffe4e1","moccasin":"#ffe4b5","navajowhite":"#ffdead","oldlace":"#fdf5e6","olivedrab":"#6b8e23","orangered":"#ff4500","orchid":"#da70d6","palegoldenrod":"#eee8aa","palegreen":"#98fb98","paleturquoise":"#afeeee","palevioletred":"#db7093","papayawhip":"#ffefd5","peachpuff":"#ffdab9","peru":"#cd853f","pink":"#ffc0cb","plum":"#dda0dd","powderblue":"#b0e0e6","rosybrown":"#bc8f8f","royalblue":"#4169e1","saddlebrown":"#8b4513","salmon":"#fa8072","sandybrown":"#f4a460","seagreen":"#2e8b57","seashell":"#fff5ee","sienna":"#a0522d","skyblue":"#87ceeb","slateblue":"#6a5acd","slategray":"#708090","slategrey":"#708090","snow":"#fffafa","springgreen":"#00ff7f","steelblue":"#4682b4","tan":"#d2b48c","thistle":"#d8bfd8","tomato":"#ff6347","turquoise":"#40e0d0","violet":"#ee82ee","wheat":"#f5deb3","whitesmoke":"#f5f5f5","yellowgreen":"#9acd32","rebeccapurple":"#663399"}');

/***/ })

},
/******/ __webpack_require__ => { // webpackRuntimeModules
/******/ var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
/******/ var __webpack_exports__ = (__webpack_exec__(350));
/******/ (_ENTRIES = typeof _ENTRIES === "undefined" ? {} : _ENTRIES)["middleware_pages/api/social-image"] = __webpack_exports__;
/******/ }
]);
//# sourceMappingURL=social-image.js.map