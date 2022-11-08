"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _reactNative = require("react-native");

const base64UrlRegex = /^data:image\/.*;(?:charset=.{3,5};)?base64,/;
const NativeImage = _reactNative.NativeModules.Compressor;
const Image = {
  compress: (value, options) => {
    if (!value) {
      throw new Error('Compression value is empty, please provide a value for compression.');
    }

    const cleanData = value.replace(base64UrlRegex, '');
    return NativeImage.image_compress(cleanData, options);
  }
};
var _default = Image;
exports.default = _default;
//# sourceMappingURL=index.js.map