"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _reactNative = require("react-native");

var _utils = require("../utils");

const NativeAudio = _reactNative.NativeModules.Compressor;
const Audio = {
  compress: async (url, options = _utils.DEFAULT_COMPRESS_AUDIO_OPTIONS) => {
    try {
      const checkUrlAndOptionsResult = await (0, _utils.checkUrlAndOptions)(url, options);

      if (!checkUrlAndOptionsResult.isCorrect) {
        throw checkUrlAndOptionsResult.message;
      } else {
        // Get resulting output file path
        // Get media details
        // const mediaDetails: any = await getDetails(url).catch(() => null);
        const mediaDetails = {
          bitrate: 0
        }; // Initialize bitrate

        let bitrate = _utils.DEFAULT_COMPRESS_AUDIO_OPTIONS.bitrate;

        if (mediaDetails && mediaDetails.bitrate) {
          // Check and return the appropriate bitrate according to quality expected
          for (let i = 0; i < _utils.AUDIO_BITRATE.length; i++) {
            // Check a particular bitrate to return its nearest lower according to quality
            if (mediaDetails.bitrate > _utils.AUDIO_BITRATE[i]) {
              if (i + 2 < _utils.AUDIO_BITRATE.length) {
                if (options.quality === 'low') bitrate = _utils.AUDIO_BITRATE[i + 2];else if (options.quality === 'medium') bitrate = _utils.AUDIO_BITRATE[i + 1];else bitrate = _utils.AUDIO_BITRATE[i];
              } else if (i + 1 < _utils.AUDIO_BITRATE.length) {
                if (options.quality === 'low') bitrate = _utils.AUDIO_BITRATE[i + 1];else bitrate = _utils.AUDIO_BITRATE[i];
              } else bitrate = _utils.AUDIO_BITRATE[i];

              break;
            } // Check if the matching bitrate is the last in the array


            if (mediaDetails.bitrate <= _utils.AUDIO_BITRATE[_utils.AUDIO_BITRATE.length - 1]) {
              bitrate = _utils.AUDIO_BITRATE[_utils.AUDIO_BITRATE.length - 1];
              break;
            }
          }
        }

        return NativeAudio.compress_audio(url, {
          bitrate,
          quality: options.quality
        });
      }
    } catch (error) {
      throw error.message;
    }
  }
};
var _default = Audio;
exports.default = _default;
//# sourceMappingURL=index.js.map