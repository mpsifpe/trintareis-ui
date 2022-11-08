/* eslint-disable no-bitwise */
import { NativeModules } from 'react-native';
const {
  Compressor
} = NativeModules;
export const AUDIO_BITRATE = [256, 192, 160, 128, 96, 64, 32];
const INCORRECT_INPUT_PATH = 'Incorrect input path. Please provide a valid one';
const INCORRECT_OUTPUT_PATH = 'Incorrect output path. Please provide a valid one';
const ERROR_OCCUR_WHILE_GENERATING_OUTPUT_FILE = 'An error occur while generating output file';
export const DEFAULT_COMPRESS_AUDIO_OPTIONS = {
  bitrate: 96,
  quality: 'medium',
  outputFilePath: ''
};
export const generateFilePath = extension => {
  return new Promise((resolve, reject) => {
    Compressor.generateFilePath(extension).then(result => resolve('file://' + result)).catch(error => reject(error));
  });
};
export const getRealPath = (path, type = 'video') => {
  return Compressor.getRealPath(path, type);
};
export const getVideoMetaData = path => {
  return Compressor.getVideoMetaData(path);
};

const isValidUrl = url => /^(?:\w+:)?\/\/([^\s\.]+\.\S{2}|localhost[\:?\d]*)\S*$/.test(url);

const getFullFilename = path => {
  if (typeof path === 'string') {
    let _path = path; // In case of remote media, check if the url would be valid one

    if (path.includes('http') && !isValidUrl(path)) {
      return INCORRECT_INPUT_PATH;
    } // In case of url, check if it ends with "/" and do not consider it furthermore


    if (_path[_path.length - 1] === '/') _path = _path.substring(0, path.length - 1);

    const array = _path.split('/');

    return array.length > 1 ? array[array.length - 1] : INCORRECT_INPUT_PATH;
  }

  return INCORRECT_INPUT_PATH;
};

const isFileNameError = filename => {
  return filename === INCORRECT_INPUT_PATH;
};

const getFilename = path => {
  const fullFilename = getFullFilename(path);

  if (!isFileNameError(fullFilename)) {
    const array = fullFilename.split('.');
    return array.length > 1 ? array.slice(0, -1).join('') : array.join('');
  }

  return fullFilename;
};

const isRemoteMedia = path => {
  return typeof path === 'string' ? path.split(':/')[0].includes('http') : null;
};

export const getDetails = (mediaFullPath, extesnion = 'mp3') => {
  return new Promise(async (resolve, reject) => {
    try {
      // Since we used "-v error", a work around is to call first this command before the following
      const result = {};

      if (result !== 0) {
        throw new Error('Failed to execute command');
      } // get the output result of the command
      // example of output {"programs": [], "streams": [{"width": 640,"height": 360}], "format": {"size": "15804433"}}


      let mediaInfo = await {};
      mediaInfo = JSON.parse(mediaInfo); // execute second command

      const mediaInformation = await {}; // treat both results

      mediaInformation.filename = getFilename(mediaFullPath);
      mediaInformation.bitrate = mediaInformation.getMediaProperties().bit_rate;
      mediaInformation.extension = extesnion;
      mediaInformation.isRemoteMedia = isRemoteMedia(mediaFullPath);
      mediaInformation.size = Number(mediaInfo.format.size);
      resolve(mediaInformation);
    } catch (e) {
      reject(e);
    }
  });
};
export const checkUrlAndOptions = async (url, options) => {
  if (!url) {
    throw new Error('Compression url is empty, please provide a url for compression.');
  }

  const defaultResult = {
    outputFilePath: '',
    isCorrect: true,
    message: ''
  }; // Check if output file is correct

  let outputFilePath;

  try {
    // use default output file
    // or use new file from cache folder
    if (options.outputFilePath) {
      outputFilePath = options.outputFilePath;
      defaultResult.outputFilePath = outputFilePath;
    } else {
      outputFilePath = await generateFilePath('mp3');
      defaultResult.outputFilePath = outputFilePath;
    }

    if (outputFilePath === undefined || outputFilePath === null) {
      defaultResult.isCorrect = false;
      defaultResult.message = options.outputFilePath ? INCORRECT_OUTPUT_PATH : ERROR_OCCUR_WHILE_GENERATING_OUTPUT_FILE;
    }
  } catch (e) {
    defaultResult.isCorrect = false;
    defaultResult.message = options.outputFilePath ? INCORRECT_OUTPUT_PATH : ERROR_OCCUR_WHILE_GENERATING_OUTPUT_FILE;
  } finally {
    return defaultResult;
  }
};
export const uuidv4 = () => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    const r = parseFloat('0.' + Math.random().toString().replace('0.', '') + new Date().getTime()) * 16 | 0,
          // eslint-disable-next-line eqeqeq
    v = c == 'x' ? r : r & 0x3 | 0x8;
    return v.toString(16);
  });
};
//# sourceMappingURL=index.js.map