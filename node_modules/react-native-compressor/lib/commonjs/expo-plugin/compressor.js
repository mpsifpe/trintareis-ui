"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _configPlugins = require("@expo/config-plugins");

const pkg = require('../../../package.json');

const withCompressor = config => config;

var _default = (0, _configPlugins.createRunOncePlugin)(withCompressor, pkg.name, pkg.version);

exports.default = _default;
//# sourceMappingURL=compressor.js.map