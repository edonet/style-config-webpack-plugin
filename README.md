# style-config-webpack-plugin
A webpack plugin for import style config to JavaScript、LESS and SASS.

## Install
``` shell
$ yarn add style-config-webpack-plugin
```

## Usage
Add the plugin to your webpack config, as `webpack.config.js`. For example:
``` javascript
const StyleConfigPlugin = require('style-config-webpack-plugin');

// add plugin
module.exports = {
    plugins: [new StyleConfigPlugin()],
};
```

