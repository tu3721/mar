module.exports = {
    // 基本路径   整个文件夹在哪
    publicPath: './',
    // 输出文件目录   文件夹名
    outputDir: 'preview_dist',
    // 放置生成的静态资源 (js、css、img、fonts) 的 (相对于 outputDir 的) 目录。    资源放的目录
    assetsDir: "./preview_static",
    // 指定生成的 index.html 的输出路径 (相对于 outputDir)。也可以是一个绝对路径    index的路劲和名字
    indexPath: './index.html',
    devServer: {
        open: false,
        host: '0.0.0.0',
        port: 8080,
        https: false,
        hotOnly: false,
        // proxy = null,
        proxy: {
            '/api': {
                // target: 'http://192.168.11.56:80/',//g
                // target: 'http://qy2.miaoxiang.co/',
                target:'https://api.test.miaoxiang.co/',
                changeOrigin: true,
                ws:true,
                pathRewrite: {
                    '^/api': ''
                }
            },
            '/img': {
                // target: 'http://192.168.11.56:80/',//g
                // target: 'http://qy2.miaoxiang.co/',
                target:'https://mx-renderinglibrary.oss-cn-hangzhou.aliyuncs.com/',
                changeOrigin: true,
                ws:true,
                pathRewrite: {
                    '^/img': ''
                }
            },

        },
    },
};