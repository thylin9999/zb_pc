const useAnalyser = process.env.VUE_APP_USE_ANALYSZER
const path = require('path')
const resolve = path.resolve
const { getSass } = require('@zougt/some-loader-utils')
const multipleScopeVars = [
    {
    // 必需
        scopeName: 'theme-default',
        path: path.resolve('src/theme/default-vars.scss')
    },
    {
        scopeName: 'theme-mauve',
        path: path.resolve('src/theme/mauve-vars.scss')
    }
]
module.exports = {
    lintOnSave: false,
    publicPath: './',
    css: {
        loaderOptions: {
            css: {
                sourceMap: true
            },
            scss: {
                implementation: getSass({
                    getMultipleScopeVars: sassOptions => multipleScopeVars.map(item => {
                        return {
                            ...item,
                            path: path.resolve(item.path)
                        }
                    })
                })
            }
        }
    },
    chainWebpack: config => {
        if (useAnalyser) {
            config
                .plugin('webpack-bundle-analyzer')
                .use(require('webpack-bundle-analyzer').BundleAnalyzerPlugin).end()
        }
        // 必要css样式 内联，防止阻塞渲染
        // config.plugin('critters-webpack-plugin').use(require('critters-webpack-plugin'), [{
        //   inlineThreshold: 10
        // }]).end()
        // svg rule loader
        const svgRule = config.module.rule('svg') // 找到svg-loader
        svgRule.uses.clear() // 清除已有的loader, 如果不这样做会添加在此loader之后
        svgRule.exclude.add(/node_modules/) // 正则匹配排除node_modules目录
        svgRule // 添加svg新的loader处理
            .test(/\.svg$/)
            .use('svg-sprite-loader')
            .loader('svg-sprite-loader')
            .options({
                symbolId: 'icon-[name]'
            })
        // // 修改images loader 添加svg处理
        const imagesRule = config.module.rule('images')
        imagesRule.exclude.add(resolve('src/icons'))
        config.module
            .rule('images')
            .test(/\.(png|jpe?g|gif|svg)(\?.*)?$/)
        config.plugin('html')
            .tap((args) => {
                args[0].title = process.env.VUE_APP_APP_NAME
                return args
            })
        config.optimization.splitChunks({
            chunks: 'all',
            minSize: 20000, // 允许新拆出 chunk 的最小体积，也是异步 chunk 公共模块的强制拆分体积
            maxAsyncRequests: 6, // 每个异步加载模块最多能被拆分的数量
            maxInitialRequests: 6, // 每个入口和它的同步依赖最多能被拆分的数量
            enforceSizeThreshold: 50000, // 强制执行拆分的体积阈值并忽略其他限制
            cacheGroups: {
                libs: { // 第三方库
                    name: 'chunk-libs',
                    test: /[\\/]node_modules[\\/]/,
                    priority: 10,
                    chunks: 'initial' // 只打包初始时依赖的第三方
                },
                elementUI: { // elementUI 单独拆包
                    name: 'chunk-elementUI',
                    test: /[\\/]node_modules[\\/]element-ui[\\/]/,
                    priority: 20 // 权重要大于 libs
                },
                svgIcon: { // svg 图标
                    name: 'chunk-svgIcon',
                    test (module) {
                        // `module.resource` 是文件的绝对路径
                        // 用`path.sep` 代替 / or \，以便跨平台兼容
                        // const path = require('path') // path 一般会在配置文件引入，此处只是说明 path 的来源，实际并不用加上
                        return (
                            module.resource &&
                            module.resource.endsWith('.svg') &&
                            module.resource.includes(`${path.sep}icons${path.sep}`)
                        )
                    },
                    priority: 30
                },
                commons: { // 公共模块包
                    name: 'chunk-commons',
                    minChunks: 2,
                    priority: 0,
                    reuseExistingChunk: true
                }
            }
        })
    },

    devServer: {
        proxy: {
            '/api': { // 代理 所有  /api 开头的 请求
                // 这样写就可以了
                // target: 'http://api.wuhaicj.com',
                // target: 'http://api.haibao18.cn',
                target: 'http://api.hljhwyy.cn',
                changeOrigin: true, // 跨域
                pathRewrite: {
                    '^/api': '/api'
                }
            },
            '/common': {
                // target: 'http://api.wuhaicj.com',
                // target: 'http://api.haibao18.cn',
                target: 'http://api.hljhwyy.cn',
                changeOrigin: true, // 跨域
                pathRewrite: {
                    '^/common': '/common'
                }
            },
            // '/gift': { // 代理 所有  /api 开头的 请求
            //     // 这样写就可以了
            //     // target: 'http://api.wuhaicj.com',
            //     // target: 'http://api.haibao18.cn',
            //     target: 'http://img.wuhaicj.com/',
            //     changeOrigin: true, // 跨域
            //     pathRewrite: {
            //         '^/gift': '/gift'
            //     }
            // },
            '/dankamu': {
                target: 'https://dplayer.moerats.com/v3/',
                changeOrigin: true, // 跨域
                pathRewrite: {
                    '^/dankamu': ''
                }
            }
            // '/api/v2': { // 代理 所有  /api/v1 开头的 请求
            //     // 这样写就可以了
            //     target: process.env.VUE_PROXY_HOST,
            //     changeOrigin: true,// 跨域
            //     pathRewrite: {
            //       '^/api/v2': '/api/v1'
            //     }
            // }
            // '/file/uploads': { // 代理上传的功能
            //   // 这样写就可以了
            //   target: 'http://172.19.103.145:3000',
            //   changeOrigin: true, // 跨域
            //   pathRewrite: {
            //     '^file': ''
            //   }
            // }
        }
    }
}
