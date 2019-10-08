## A small project written by Vue + element-ui
#### package.json
```javascript
{
  "name": "vue-admin-template",
  "version": "3.8.0",
  "license": "MIT",
  "description": "A vue admin template with Element UI & axios & iconfont & permission control & lint",
  "author": "Pan <panfree23@gmail.com>",
  "scripts": {
    "dev": "webpack-dev-server --inline --progress --config build/webpack.dev.conf.js",
    "start": "npm run dev",
    "build": "node build/build.js",
    "build:report": "npm_config_report=true npm run build",
    "lint": "eslint --ext .js,.vue src",
    "test": "npm run lint",
    "svgo": "svgo -f src/icons/svg --config=src/icons/svgo.yml"
  },
  "dependencies": {
    "axios": "0.18.0",
    "element-ui": "2.4.6",
    "js-cookie": "2.2.0",
    "js-md5": "^0.7.3",
    "mockjs": "^1.0.1-beta3",
    "normalize.css": "7.0.0",
    "nprogress": "0.2.0",
    "vue": "2.5.17",
    "vue-cropperjs": "^2.2.2",
    "vue-router": "3.0.1",
    "vuex": "3.0.1"
  },
  "devDependencies": {
    "autoprefixer": "8.5.0",
    "babel-core": "6.26.0",
    "babel-eslint": "8.2.6",
    "babel-helper-vue-jsx-merge-props": "2.0.3",
    "babel-loader": "7.1.5",
    "babel-plugin-syntax-jsx": "6.18.0",
    "babel-plugin-transform-runtime": "6.23.0",
    "babel-plugin-transform-vue-jsx": "3.7.0",
    "babel-polyfill": "^6.26.0",
    "babel-preset-env": "1.7.0",
    "babel-preset-stage-2": "6.24.1",
    "chalk": "2.4.1",
    "compression-webpack-plugin": "^2.0.0",
    "copy-webpack-plugin": "4.5.2",
    "css-loader": "1.0.0",
    "eslint": "4.19.1",
    "eslint-friendly-formatter": "4.0.1",
    "eslint-loader": "2.0.0",
    "eslint-plugin-vue": "4.7.1",
    "eventsource-polyfill": "0.9.6",
    "file-loader": "1.1.11",
    "friendly-errors-webpack-plugin": "1.7.0",
    "html-webpack-plugin": "4.0.0-alpha",
    "mini-css-extract-plugin": "^0.4.4",
    "node-notifier": "5.2.1",
    "node-sass": "^4.7.2",
    "optimize-css-assets-webpack-plugin": "5.0.0",
    "ora": "3.0.0",
    "portfinder": "1.0.16",
    "postcss-import": "12.0.0",
    "postcss-loader": "2.1.6",
    "postcss-url": "7.3.2",
    "rimraf": "2.6.2",
    "sass-loader": "7.0.3",
    "script-ext-html-webpack-plugin": "2.0.1",
    "semver": "5.5.0",
    "shelljs": "0.8.2",
    "svg-sprite-loader": "3.8.0",
    "svgo": "1.0.5",
    "uglifyjs-webpack-plugin": "1.2.7",
    "url-loader": "1.0.1",
    "vue-loader": "15.3.0",
    "vue-style-loader": "4.1.2",
    "vue-template-compiler": "2.5.17",
    "webpack": "4.16.5",
    "webpack-bundle-analyzer": "2.13.1",
    "webpack-cli": "3.1.0",
    "webpack-dev-server": "3.1.5",
    "webpack-merge": "4.1.4"
  },
  "engines": {
    "node": ">= 6.0.0",
    "npm": ">= 3.0.0"
  },
  "browserslist": [
    "> 1%",
    "last 2 versions",
    "not ie <= 8"
  ]
}
