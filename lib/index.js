'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

exports.default = interpreting;

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _interpret = require('interpret');

var _interpret2 = _interopRequireDefault(_interpret);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var interpretExts = Object.keys(_interpret2.default.extensions).sort(function (a, b) {
  return a === '.js' ? -1 : b === '.js' ? 1 : a.localeCompare(b);
});

function interpreting(paths, options) {
  options = options || {};

  if (!Array.isArray(paths)) {
    paths = [paths];
  }

  var entries = entriesVariants(paths);

  entries = entries.filter(entryExists);

  if (!options.multiple) {
    entries = entries.slice(0, 1);
  }

  entries = entries.map(entryCompileRegister).map(entryRequire).map(entryPrepare);

  if (options.required && !entries.length) {
    throw new Error('No files found: ' + paths.map(function (v) {
      return v + '.*';
    }).join(' '));
  }

  if (options.multiple) {
    if (options.join) {
      entries = entries.reduce(function (result, value) {
        Object.assign(result, value);
        return result;
      }, {});
    }
    return entries;
  } else {
    return entries[0] || null;
  }
}

function entriesVariants(paths) {
  return paths.map(function (entry) {
    return entryData(entry, null);
  }).concat(paths.reduce(function (result, entry) {
    return result.concat(interpretExts.map(function (ext) {
      return entryData(entry, ext);
    }));
  }, []));
}

function entryData(entry, ext) {
  return { ext: ext, path: _path2.default.resolve(entry + (ext || '')) };
}

function entryExists(entry) {
  return _fs2.default.existsSync(entry.path);
}

var entryCompileRegisterCache = {};

function entryCompileRegister(entry) {
  if (entryCompileRegisterCache[entry.ext]) {
    return entry;
  }

  entryCompileRegisterCache[entry.ext] = true;

  var moduleInfo = _interpret2.default.extensions[entry.ext];

  if (!moduleInfo) {
    return entry;
  }

  if (!Array.isArray(moduleInfo)) {
    moduleInfo = [moduleInfo];
  }

  var loaded = false;

  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;
  var _iteratorError = undefined;

  try {
    for (var _iterator = moduleInfo[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
      var mod = _step.value;

      try {
        if (typeof mod === 'string') {
          require(mod);
        } else {
          mod.register(require(mod.module));
        }

        loaded = true;
        break;
      } catch (e) {}
    }
  } catch (err) {
    _didIteratorError = true;
    _iteratorError = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion && _iterator.return) {
        _iterator.return();
      }
    } finally {
      if (_didIteratorError) {
        throw _iteratorError;
      }
    }
  }

  if (!loaded) {
    var modules = moduleInfo[0].module || moduleInfo[0].split('/')[0];

    throw new Error('Module loader not found for ' + entry.ext + ' files. Try: npm install ' + modules);
  }

  return entry;
}

function entryRequire(entry) {
  return require(entry.path);
}

function entryPrepare(entry) {
  if ((typeof entry === 'undefined' ? 'undefined' : _typeof(entry)) === 'object' && typeof entry.default !== 'undefined') {
    return entry.default;
  } else {
    return entry;
  }
}