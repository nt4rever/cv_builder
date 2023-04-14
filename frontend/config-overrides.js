const { alias } = require('react-app-rewire-alias');

module.exports = function override(config) {
    alias({
        '@': 'src',
        '@pages': 'src/pages',
        '@img': 'src/img',
    })(config);

    return config;
};
