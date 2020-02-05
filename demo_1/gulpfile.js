const {watch, src, dest, series} = require('gulp');
const sass  = require('gulp-sass');
const browserAsync = require('browser-sync').create();
const useref = require('gulp-useref');
const gulpif = require('gulp-if');
const terser = require('gulp-terser');
const minifyCss = require('gulp-clean-css');

// create a task to convert scss file to scc file.
function convertToCSS(){
    return src('src/scss/*.scss')
        .pipe(sass())
        .pipe(dest('src/css'));
}
// create a browser server task to reload page when detect these changes
function browserSync(){
    browserAsync.init({
        server: {
            baseDir: 'src'
        }
    })
}
// create watchall task to listen these changes
function watchAll(){
    browserSync();
    convertToCSS();
    watch('src/*.html').on('change', browserAsync.reload);
    watch('src/scss/*.scss', series(convertToCSS)).on('change', browserAsync.reload);
    watch('src/js/*.js').on('change', browserAsync.reload);
}
// 
// Optimizing CSS and JS file
// 
function useRef(){
    return src('src/*.html')
        .pipe(useref())
        .pipe(gulpif('*.js', terser()))
        .pipe(gulpif('*.css', minifyCss()))
        .pipe(dest('dist'))
}

exports.default = watchAll;
exports.useRef = useRef;