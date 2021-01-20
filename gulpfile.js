/* Variables */
const gulp = require("gulp");
const htmlmin = require("gulp-htmlmin");
const sass = require("gulp-sass");
const autoprefixer = require("gulp-autoprefixer");
const concat = require("gulp-concat");
const cssnano = require("gulp-cssnano");
const sourcemaps = require("gulp-sourcemaps");
const uglify = require("gulp-uglify");
const notify = require("gulp-notify");
const imagemin = require('gulp-imagemin');
const browserSync = require('browser-sync').create();
const reload = browserSync.reload;

/* Browser Sync */

gulp.task('serve', () => {
  browserSync.init({
    server: {
      baseDir: "src"
    }

  });
  gulp.watch("./src/**/*").on('change', browserSync.reload);
});


/* HTML Minify */
gulp.task("minify", () => {
  return gulp
    .src("./src/**/*.html")
    .pipe(htmlmin({
      collapseWhitespace: true
    }))
    .pipe(gulp.dest("./dist"));
});



/* IMAGES Minify */
gulp.task("images", () => {
  gulp
  gulp.src('./src/img/*')
    .pipe(imagemin([
      imagemin.gifsicle({
        /* Compress GIF images */
        interlaced: true
      }),
      imagemin.mozjpeg({
        /* Compress JPEG images */
        quality: 75,
        progressive: true
      }),
      imagemin.optipng({
        /* Compress PNG images */
        optimizationLevel: 5
      }),
      imagemin.svgo({
        /*  Compress SVG images */
        plugins: [{
            removeViewBox: true
          },
          {
            cleanupIDs: false
          }
        ]
      })
    ]))
    .pipe(gulp.dest('./dist/img'));
});



/* SASS */
gulp.task("sass", () => {
  return gulp
    .src("./src/sass/**/*.scss")
    .pipe(sourcemaps.init())
    .pipe(sass())
    .on("error", notify.onError("Error: <%= error.message %>"))
    .pipe(autoprefixer({
      cascade: false
    }))
    .pipe(cssnano())
    .pipe(sourcemaps.write("./"))
    .pipe(gulp.dest("./dist/css"));
});



/* JavaScript */
gulp.task("javascript", () => {
  gulp
    .src("./src/js/**/*.js")
    .pipe(concat("all.js"))
    .on("error", notify.onError("Error: <%= error.message %>"))
    .pipe(uglify())
    .pipe(gulp.dest("./dist/js"));
});


gulp.task("watch", () => {
  gulp.watch("./src/**/*.html", ["minify"]);
  gulp.watch("./src/sass/**/*.scss", ["sass"]);
  gulp.watch("./src/js/**/*.js", ["javascript"]);
  gulp.watch("./src/img/*", ["images"]);
});

gulp.task("default", (done) => {
  gulp.series("watch", "minify", "sass", "javascript", "images", "serve");
  done();
});