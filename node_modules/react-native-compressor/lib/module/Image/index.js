import { NativeModules } from 'react-native';
const base64UrlRegex = /^data:image\/.*;(?:charset=.{3,5};)?base64,/;
const NativeImage = NativeModules.Compressor;
const Image = {
  compress: (value, options) => {
    if (!value) {
      throw new Error('Compression value is empty, please provide a value for compression.');
    }

    const cleanData = value.replace(base64UrlRegex, '');
    return NativeImage.image_compress(cleanData, options);
  }
};
export default Image;
//# sourceMappingURL=index.js.map