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
        imagemin.mozjpeg({'progressive': true}), 
		 //imagemin.jpegtran({'progressive': true}), 
		
        imagemin.optipng({'optimizationLevel': 7}), 
        imagemin.svgo()],
        {'verbose': true}))
        .pipe(gulp.dest('./public'))
});

// 压缩 public/images 目录内图片
//gulp.task('minify-images', function() {
 // gulp.src('./public/images/**/*.*')
 // .pipe(imagemin({
 //    optimizationLevel: 5, //类型：Number  默认：3  取值范围：0-7（优化等级）
 //    progressive: true, //类型：Boolean 默认：false 无损压缩jpg图片
 //    interlaced: false, //类型：Boolean 默认：false 隔行扫描gif进行渲染
 //    multipass: false, //类型：Boolean 默认：false 多次优化svg直到完全优化
 // }))
 // .pipe(gulp.dest('./public/uploads'));
//});


// 默认任务
/*
gulp.task('default', [
    'minify-html','minify-html1','minify-css','minify-js','minify-images'
]);
*/
// gulp 4.0 适用的方式
gulp.task('default', gulp.parallel('minify-html','minify-css','minify-js','minify-images'
 //build the website
));
