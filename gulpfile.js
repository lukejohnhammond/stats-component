const gulp = require('gulp');
const plumber = require('gulp-plumber');
const del = require('del');
const nodemon = require('gulp-nodemon');
const bower = require('main-bower-files')();
const filter = require('gulp-filter');
const concat = require('gulp-concat');
const babel = require('gulp-babel');
const flatten = require('gulp-flatten');
const order = require('gulp-order');
const uglify = require('gulp-uglify');
const sass = require('gulp-sass');
const cleanCSS = require('gulp-clean-css');
const sourcemaps = require('gulp-sourcemaps');
const sequence = require('gulp-sequence');
const livereload = require('gulp-livereload');

// clean
gulp.task('clean', () => {
  del(['public/***/**/*']);
});

// bower
gulp.task('bower:js', () => {
  return gulp.src(bower)
    .pipe(filter(['**/*.js']))
    .pipe(concat('vendor.js'))
    .pipe(gulp.dest('public/js'));
});

gulp.task('bower:css', () => {
  return gulp.src(bower)
    .pipe(filter(['**/*.css']))
    .pipe(concat('vendor.css'))
    .pipe(plumber())
    .pipe(cleanCSS({ compatibility: 'ie8' }))
    .pipe(gulp.dest('public/css'));
});

// scripts
gulp.task('scripts', () => {
  return gulp.src('src/js/**/*.js')
    .pipe(sourcemaps.init())
    .pipe(plumber())
    .pipe(babel({
      presets: ['es2015'],
      compact: true
    }))
    .pipe(flatten())
    .pipe(order([
      'app.js',
      '**/*.js'
    ]))
    .pipe(concat('playerStats.js'))
    .pipe(uglify())
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest('public/js'))
    .pipe(livereload());
});


// styles
gulp.task('styles', () => {
  return gulp.src('src/scss/main.scss')
    .pipe(sourcemaps.init())
    .pipe(sass().on('error', sass.logError))
		.pipe(cleanCSS({ compatibility: 'ie8'}))
    .pipe(plumber())
    .pipe(flatten())
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest('public/css/'))
    .pipe(livereload());
});

// images
gulp.task('images', () => {
  return gulp.src(['src/images/**/*.jpg', 'src/images/**/*.png', 'src/images/**/*.gif', 'src/images/**/*.svg'])
    .pipe(gulp.dest('public/images'));
});

// images
gulp.task('data', () => {
  return gulp.src(['src/data/*.json'])
    .pipe(gulp.dest('public/data'));
});

// html
gulp.task('html', () => {
  return gulp.src('src/**/*.html')
    .pipe(gulp.dest('public'))
    .pipe(livereload());
});

// nodemon
gulp.task('nodemon', () => {
  return nodemon()
    .on('readable', () => {
      this.stdout.on('data', chunk => {
        process.stdout.write(chunk);
      });
    });
});

// watch
gulp.task('watch', () => {
  livereload.listen();
  gulp.watch('src/**/*.html', ['html']);
  gulp.watch(['src/images/*.jpg', 'src/images/*.png', 'src/images/*.gif', 'src/images/*.svg'], ['images']);
  gulp.watch('src/**/*.js', ['scripts']);
  gulp.watch('src/**/*.scss', ['styles']);
  gulp.watch('src/**/*.jsx', ['jsx']);
  gulp.watch('src/**/*.json', ['data']);
});

gulp.task('default', sequence('clean', ['bower:js', 'bower:css'], ['scripts', 'styles', 'html', 'data', 'images'], 'watch', 'nodemon'));
