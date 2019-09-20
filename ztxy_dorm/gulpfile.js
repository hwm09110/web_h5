// gulp 配置
const app = {  // 定义目录
  srcPath:'src/',
  assetsPath: 'src/assets/',
  distPath:'dist/'
};


const { series, src, dest, watch } = require('gulp');
const del = require('del');
const sass = require('gulp-sass');
const uglify = require('gulp-uglify');
const connect = require('gulp-connect');
const htmlmin = require('gulp-html-minify');
const imagemin = require('gulp-imagemin');
const babelJs = require('gulp-babel');
const babelenv = require('babel-preset-env');
const autoprefixer = require('gulp-autoprefixer');
const cssmin = require('gulp-csso');
const imgbase64 = require('gulp-base64');
const cleancss = require('gulp-clean-css');
const concat = require('gulp-concat');
const gulpif = require('gulp-if');
const rev = require('gulp-rev');
const revreplace = require('gulp-rev-replace');
const cleanDest = require('gulp-clean-dest');

// 删除dist目录
function removeDist() {
  return del(['dist']);
}

//把所有html文件移动另一个位置
function handleHtml() {
  return src(app.srcPath + '**/*.html')  /*src下所有目录下的所有.html文件*/
         .pipe(htmlmin()) //压缩html
         .pipe(dest(app.distPath))
         .pipe(connect.reload()) //当内容发生改变时， 重新加载。
}

// 处理js
function handleJs() {
  return src(app.assetsPath + 'js/**/*.js')
        .pipe(babelJs({
          presets: [babelenv]
        }))
        .pipe(uglify())
        .pipe(dest(app.distPath+'assets/js'))
        .pipe(connect.reload())
}

// 处理css
function handleCss() {
  return src(app.assetsPath + 'css/**/*.css')
        .pipe(dest(app.distPath+'assets/css'))
        .pipe(connect.reload())
}

// 处理图片
function handleImage() {
  return src(app.assetsPath + 'img/**/*.*')
        .pipe(imagemin())
        .pipe(dest(app.distPath + 'assets/img'))
}

// scss 转 csss
function handleSass() {
  return src(app.assetsPath + 'sass/**/*.scss')
        .pipe(sass({
          // outputStyle: 'compressed'  // 配置输出方式,默认为nested
        }))
        .pipe(autoprefixer())
        .pipe(dest(app.distPath + 'assets/css'));
}

// 处理lib
function handleLib() {
  return src(app.assetsPath + 'lib/**/*.*')
        .pipe(dest(app.distPath+'assets/lib'))
        .pipe(connect.reload())
}


function defaultTask() {
  // return series(removeDist);  // series让任务按顺序执行
  return series(removeDist, handleHtml, handleJs, handleImage, handleSass, handleCss, handleLib);  // series让任务按顺序执行
}




// 输出控制台执行任务的名称
exports.default = defaultTask()



