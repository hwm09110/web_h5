// gulp 配置
const app = {  // 定义目录
  srcPath:'src/',
  assetsPath: 'src/assets/',
  distPath:'dist/'
};


const gulp = require('gulp');
const sass = require('gulp-sass');
const uglify = require('gulp-uglify');
const connect = require('gulp-connect');
const imagemin = require('gulp-imagemin');
const babelJs = require('gulp-babel');
const babelenv = require('babel-preset-env');
const autoprefixer = require('gulp-autoprefixer');
const cssmin = require('gulp-csso');
const imgbase64 = require('gulp-base64');
const cleancss = require('gulp-clean-css');
const concat = require('gulp-concat');
const htmlmin = require('gulp-html-minify');
const gulpif = require('gulp-if');
const rev = require('gulp-rev');
const revreplace = require('gulp-rev-replace');
const cleanDest = require('gulp-clean-dest');

// 清除dist
gulp.task('cleanDist', function() {
  return cleanDest([
      'dist'
  ]);
});

//把所有html文件移动另一个位置
gulp.task('html', function () {
  return gulp.src(app.srcPath + '**/*.html')  /*src下所有目录下的所有.html文件*/
        .pipe(gulp.dest(app.distPath))
        .pipe(connect.reload()) //当内容发生改变时， 重新加载。
});

// 处理js
gulp.task('js', function () {
  return gulp.src(app.assetsPath + 'js/**/*.js')
        .pipe(babelJs({
          presets: [babelenv]
        }))
        .pipe(uglify())
        .pipe(gulp.dest(app.distPath+'assets/js'))
        .pipe(connect.reload())
});

// 处理css
gulp.task('css', function () {
  return gulp.src(app.assetsPath + 'css/**/*.css')
        .pipe(gulp.dest(app.distPath+'assets/css'))
        .pipe(connect.reload())
});

// 处理图片
gulp.task('image', function(){
  return gulp.src(app.assetsPath + 'img/**/*.*')
        .pipe(imagemin())
        .pipe(gulp.dest(app.distPath + 'assets/img'))
});

// scss 转 csss
gulp.task('sass', function(){
  return gulp.src(app.assetsPath + 'sass/**/*.scss')
        .pipe(sass({
          // outputStyle: 'compressed'  // 配置输出方式,默认为nested
        }))
        .pipe(autoprefixer())
        .pipe(gulp.dest(app.distPath + 'assets/css'));
});

// 处理lib
gulp.task('lib', function () {
  return gulp.src(app.assetsPath + 'lib/**/*.*')
        .pipe(gulp.dest(app.distPath+'assets/lib'))
        .pipe(connect.reload())
});

/*同时执行多个任务 [其它任务的名称]
 * 当前bulid时，会自动把数组当中的所有任务给执行了。
 * */
gulp.task('build', gulp.series('html', 'js', 'sass', 'css', 'image', 'lib'));


/*定义默认任务
* 直接执行gulp 会调用的任务
* */
gulp.task('default', gulp.series('build'));



