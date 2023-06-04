---
title: gulp压缩静态资源
tags: [front]
translate_title: gulp-compresses-static-resources
date: 2020-08-24T11:28:18+08:00
---

hexo

<!--more-->

 Gulp基于Node.js的前端构建工具，通过Gulp的插件可以实现前端代码的编译（sass、less）、压缩、测试；图片的压缩；浏览器自动刷新;

### 安装依赖

#### 在根目录下:

```linux
npm install gulp --save

npm install gulp-minify-css --save
npm install gulp-uglify --save
npm install gulp-htmlmin --save
npm install gulp-htmlclean --save
npm install gulp-imagemin --save
```

#### 创建文件gulpfile.js:

```js
// 引入需要的模块
var gulp = require('gulp');
var minifycss = require('gulp-minify-css');
var uglify = require('gulp-uglify');
var htmlmin = require('gulp-htmlmin');
var htmlclean = require('gulp-htmlclean');
var imagemin = require('gulp-imagemin');

// 压缩public目录下所有html文件, minify-html是任务名, 设置为default，启动gulp压缩的时候可以省去任务名
gulp.task('minify-html', function() {
    return gulp.src('./public/**/*.html') // 压缩文件所在的目录
        .pipe(htmlclean())
        .pipe(htmlmin({
            removeComments: true,
            minifyJS: true,
            minifyCSS: true,
            minifyURLs: true,
        }))
        .pipe(gulp.dest('./public')) // 输出的目录
});

// 压缩css
gulp.task('minify-css', function() {
    return gulp.src('./public/**/*.css')
        .pipe(minifycss({
            compatibility: 'ie8'
        }))
        .pipe(gulp.dest('./public'));
});
// 压缩js
gulp.task('minify-js', function() {
    return gulp.src(['./public/**/.js','!./public/js/**/*min.js'])
        .pipe(uglify())
        .pipe(gulp.dest('./public'));
});
// 压缩图片
gulp.task('minify-images', function() {
    return gulp.src(['./public/**/*.png','./public/**/*.jpg','./public/**/*.gif'])
        .pipe(imagemin(
        [imagemin.gifsicle({'optimizationLevel': 3}), 
        //imagemin.mozjpeg({'progressive': true}), 
		imagemin.jpegtran({'progressive': true}), 
		
        imagemin.optipng({'optimizationLevel': 7}), 
        imagemin.svgo()],
        {'verbose': true}))
        .pipe(gulp.dest('./public'))
});


// gulp 4.0 适用的方式
gulp.task('default', gulp.parallel('minify-html','minify-css','minify-js','minify-images'
 //build the website
));

```

运行

```
hexo clean && hexo g && gulp default && hexo s
```

完成对静态资源的压缩。

## 注意：

压缩静态资源时，CPU占用率会很高。

如果出现一下错误：

```
TypeError: imagemin.jpegtran is not a function at D:\Blog\gulpfile.js:41:18 at minify-images (D:\Blog\node_modules\undertaker\lib\set-task.js:13:15) at bound (domain.js:419:14) at runBound (domain.js:432:12) at asyncRunner (D:\Blog\node_modules\async-done\index.js:55:18) at processTicksAndRejections (internal/process/task_queues.js:76:11) 
```

修改文件`gulpfile.js`

```js
imagemin.jpegtran({'progressive': true})
修改为
imagemin.mozjpeg({'progressive': true}) 
```



