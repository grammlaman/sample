const gulp = require('gulp'),
    notify = require('gulp-notify'),
    pug = require('gulp-pug'),
    sass = require('gulp-sass'),
    cmq = require('gulp-group-css-media-queries'),
    imagemin = require('gulp-imagemin'),
    browserSync = require('browser-sync'),
    reload      = browserSync.reload,
    concat = require('gulp-concat'),
    rename = require('gulp-rename'),
    pugPHPFilter = require('pug-php-filter'),
    flatten = require('gulp-flatten'),
    sourcemaps = require('gulp-sourcemaps'),
    clean_CSS = require('gulp-clean-css'),
    autoprefixer = require('gulp-autoprefixer'),
    minifyjs = require('gulp-js-minify'),
    grid_template = 'flex',
    pretty = true;
/* --==[ Пути ]==--*/
// html | pug
const
    project_name = "",
    project_path = '../build'

const
    html =  {
        pretty: true,
        path: 'I:/gulp/',
        err_title: "Ошибка компиляции в HTML",
        src_build : ['templates/*.pug'],
        src_all : [
            'templates/template/*.pug',
            'templates/parts/*.pug',
            'templates/*.pug'
        ],
        dest: project_path
    },
    css = {
        style : 'uncompressed',
        path : 'I:/gulp/',
        err_title: "Ошибка при компиляции в CSS",
        src_build : ['sass/*.scss'],
        src_libs : ['sass/css_js/*.css'],
        file_name: 'main.css',
        src_all : [
            'sass/*.scss',
            'sass/media/*.scss',
            'sass/grid/*.scss',
            'sass/ui/*.scss'
        ],
        dest: project_path+'/css'
    },
    js = {
        style : 'compressed',
        path : 'I:/gulp/',
        src_build : ['js/*.js'],
        file_name: 'main.js',
        src_all : [
            'I:/gulp/libs/js/*.js',
            'js/*.js'
        ],
        dest: project_path+'/js'
    },
    img = {
        src_all : ['img/**/*'],
        dest: project_path+'/img'
    }

gulp.task('html', function(){
    return gulp.src(html['src_build'])
        .pipe(
            pug({
                pretty: html['pretty'],
                basedir: 'I:/gulp/',
                filters: {
                    php: pugPHPFilter
                }
            })
                .on('error',
                    notify.onError({
                        message: "<%= error.message%>",
                        title : html['err_title']
                    })
                )
        )
  /*      .pipe(
            rename(function (path) {
                //path.extname = ".php"
            })
        )*/
        .pipe(
            gulp.dest(html['dest'])
        ).pipe(reload({stream:true}));
});
gulp.task('html_func', function(){
    return gulp.src(html['src_all'])
        .pipe(
            pug({
                basedir: 'I:/gulp/',
                pretty: html['pretty']
            }).on('error',
                notify.onError({
                    message: "<%= error.message%>",
                    title : html['err_title']
                })
            )
        ).pipe(reload({stream:true}));
});
gulp.task('css', function(){
    return gulp.src(css['src_build'])
        .pipe(
            sass({
                outputStyle: css['style']
            })
                .on( 'error', notify.onError({
                    message: "<%= error %>",
                    title : css['err_title']
                }))
        )
        .pipe(
            concat(css['file_name'])
        )
        .pipe(
            gulp.dest(css['dest'])
        ).pipe(reload({stream:true}));
});
gulp.task('css_libs', function(){
    return gulp.src(css['src_libs'])
        .pipe(
            gulp.dest(css['dest'])
        );
});
gulp.task('media_query',function () {
    return gulp.src(project_path+'/css/*.css')
        .pipe(cmq({
            log: true
        }))
        .pipe(autoprefixer({
            browsers: ['last 2 versions'],
            cascade: true
        }))
        .pipe(gulp.dest(project_path+'/css'));
});
gulp.task('min_css',function () {
    return gulp.src(project_path+'/css/*.css')
        .pipe(cmq({
            log: true
        }))
        .pipe(clean_CSS())
        .pipe(autoprefixer({
            browsers: ['last 2 versions'],
            cascade: true
        }))
        .pipe(gulp.dest(project_path+'/css'));
});
gulp.task('js',function() {
    return gulp.src(js['src_all'])
        .pipe(
            gulp.dest(js['dest'])
        );
});
gulp.task('min_js',function() {
    return gulp.src(js['src_all'])
    /*   .pipe(
           //concat(js['file_name'])
       )*/
        .pipe(minifyjs())
        .pipe(
            gulp.dest(js['dest'])
        );
});
gulp.task('browserSync', function() {
    browserSync.init({
      server: {
            baseDir: project_path,
            index: "index.html",
            serveStaticOptions: {
                extensions: ["html"]
            }
        },
        port: 80,
        open: true,
        notify: true
    });
});
gulp.task('move_images', function() {
    return gulp.src(img['src_all'])
        .pipe(
            flatten({ includeParents: 0 })
        )
        .pipe(
            gulp.dest(img['dest'])
        )
});
gulp.task('move_fonts', function() {
    return gulp.src('sass/fonts/*.*')
        .pipe(
            flatten({ includeParents: 0 })
        )
        .pipe(
            gulp.dest(project_path+'/css/fonts')
        )
});
gulp.task('min_main', function() {
    return gulp.src(img['src_all'])
        .pipe(imagemin())
        .pipe(
            gulp.dest(img['dest'])
        )
});
gulp.task('watch', function() {
    gulp.watch(html['src_build'],['html']);
    gulp.watch(html['src_all'],function () {
        gulp.start('html')
    });
    gulp.watch(css['src_build'],['css']);
    gulp.watch(css['src_libs'],['css_libs']);
    gulp.watch(css['src_all'],function () {
        gulp.start('css')
    });
    gulp.watch(js['src_all'],['js']);
    gulp.watch(js['src_all'],function () {
        gulp.start('js')
    });
    gulp.watch(img['src_all'],['move_images']);
    gulp.watch(project_path+'/css/*.css',['media_query']);
    gulp.start('default');
});



gulp.task('minify',['min_main','min_css','min_js']);


gulp.task('default', ['watch','html','js', 'move_fonts','css' ,'css_libs','browserSync','move_images','media_query']);
//gulp.task('default', [ 'watch','browserSync']);
