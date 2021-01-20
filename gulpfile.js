/*==============================================================================
  #Variáveis de configuração.
==============================================================================*/
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





/*------------------------------------------------------------------------------ 
  #BROWSERSYNC
------------------------------------------------------------------------------*/

/* 
 * Atualiza automaticamente as alterações feitas na pasta SRC.
 * Funciona como um server.
 */
gulp.task('serve', () => {
  browserSync.init({
    server: {
      baseDir: "src"
    }

  });
  gulp.watch("./src/**/*").on('change', browserSync.reload);
});





/*------------------------------------------------------------------------------ 
  #HTMLMIN
------------------------------------------------------------------------------*/

/* 
 * Mimifica os arquivos HTML presentes na pasta SRC para a pasta DIST
 */
gulp.task("minify", () => {
  return gulp
    .src("./src/**/*.html")
    .pipe(htmlmin({
      collapseWhitespace: true
    }))
    .pipe(gulp.dest("./dist"));
});





/*------------------------------------------------------------------------------ 
  #IMAGEMIN
------------------------------------------------------------------------------*/

/* 
  * Otimiza as imagens presentes na pasta IMG do diretório SRC para o diretório
  * DIST na pasta IMG
  * Aceita PNG,SVG,GIF e JPEG

*/
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





/*------------------------------------------------------------------------------ 
  #SASS 
------------------------------------------------------------------------------*/

/* 
 * Executa arquivos .SASS , .SCSS
 * Compila os arquivos Sass para a pasta CSS já com autoprefixer,
 *  css mimificado.
 * Contém o arquivo sourcemaps na pasta CSS.
 * O Notify avisa sobre erros presentes nos arquivos 
 */
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





/*------------------------------------------------------------------------------ 
  #JAVASCRIPT
------------------------------------------------------------------------------*/

/* 
 * 
 * O Notify avisa sobre erros presentes nos arquivos 
 */
gulp.task("javascript", () => {
  gulp
    .src("./src/js/**/*.js")
    .pipe(concat("all.js"))
    .on("error", notify.onError("Error: <%= error.message %>"))
    .pipe(uglify())
    .pipe(gulp.dest("./dist/js"));
});





/*------------------------------------------------------------------------------ 
  #WATCH
-------------------------------------------------------------------------------*/

/* 
  * Assiste as alterações feitas nos arquivos

*/
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