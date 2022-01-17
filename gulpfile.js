const {
  src,
  dest,
  series,
  watch,
} = require('gulp');
const sass = require('gulp-sass')(require('sass'));
const csso = require('gulp-csso');
const include = require('gulp-file-include');
const htmlmin = require('gulp-htmlmin');
const del = require('del');
const concat = require('gulp-concat');
const autoprefixer = require('gulp-autoprefixer');
const sync = require('browser-sync').create();

function html() {
  return src('src/**.html')
    .pipe(include({
      prefix: '@@',
    }))
    .pipe(htmlmin({
      collapseWhitespace: true,
      removeComments: true
    }))
    .pipe(dest('dist'))
}

function scss() {
  return src('src/styles/**.scss')
    .pipe(sass())
    .pipe(autoprefixer('last 2 versions'))
    .pipe(csso())
    .pipe(concat('index.css'))
    .pipe(dest('dist'))
}

function img() {
  return src('src/img/**.{png,jpg,jpeg}')
    .pipe(dest('dist/img'))
}

function serve() {
  sync.init({
    server: './dist'
  })

  watch('src/**.html', series(html)).on('change', sync.reload)
  watch('src/parts/**.html', series(html)).on('change', sync.reload)
  watch('src/img/**.{png,jpg,jpeg}', series(img)).on('change', sync.reload)
  watch('src/styles/**.scss', series(scss)).on('change', sync.reload)
}

exports.start = series(html, scss, img, serve);