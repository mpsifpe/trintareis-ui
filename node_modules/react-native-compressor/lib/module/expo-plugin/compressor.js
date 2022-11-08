import { createRunOncePlugin } from '@expo/config-plugins';

const pkg = require('../../../package.json');

const withCompressor = config => config;

export default createRunOncePlugin(withCompressor, pkg.name, pkg.version);
//# sourceMappingURL=compressor.js.map