# style-config-webpack-plugin
A webpack plugin for import style config to CSS、LESS and SASS.

## Install
``` shell
$ yarn add style-config-webpack-plugin
```

## Usage
Add the plugin to your webpack config, as webpack.config.js. For example:
``` javascript
import * as style-config-webpack-plugin from 'style-config-webpack-plugin';

// add plugin
export default {
    plugins: [new StyleConfigPlugin()],
};
```

