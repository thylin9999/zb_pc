# vue-demo1

## Project setup
```
yarn install
```

### Compiles and hot-reloads for development
```
yarn dev
```

### Compiles and minifies for production
```
yarn build
```

### Lints and fixes files
```
yarn lint
```
### eslint保存时自动格式化代码 -> phpstorm中设置
```javascript
/*
前置设置：
file => settings, language and frameworks中，搜索 eslint，勾选 automatic eslint configure,
勾选 下方 run eslint -- fix on save
* 1. file => settings，keymap中搜索 eslint,查看是否有快捷键，如果没有添加 一个，目前我这边是 ctrl + alt+shit + o
* 2. edit => macros，选择start macros recording, 右下角会有一个录制的 状态栏
* 3，先按 ctrl + alt+shit + o,然后点击 右下角栏位 的 结束 录制，并且命名为 Format And Save
* 4. file => settings，keymap中搜索 save, 找到上一步找的 Format And Save， 添加快捷键 ctrl + s即可
* 5. 重启编辑器
* 
* 
* */
```
### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).
