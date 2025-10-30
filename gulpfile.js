// generated on 2016-06-15 using generator-webapp 2.1.0
const gulp = require('gulp');
const gulpLoadPlugins = require('gulp-load-plugins');
const gulpHtmlBeautify = require('gulp-html-beautify');
const browserSync = require('browser-sync');
const sassLint = require('gulp-sass-lint');
const del = require('del');
const wiredep = require('wiredep').stream;
const jslint = require('gulp-jslint');
const $ = gulpLoadPlugins();
const reload = browserSync.reload;

gulp.task('styles', () => {
  return gulp.src('app/assets/scss/*.scss')
    .pipe($.plumber())
    .pipe($.sourcemaps.init())
    .pipe($.sass.sync({
      outputStyle: 'expanded',
      precision: 10,
      includePaths: ['.']
    }).on('error', $.sass.logError))
    .pipe($.autoprefixer({browsers: ['> 1%', 'last 20 versions', 'Firefox ESR']}))
    .pipe($.sourcemaps.write())
    .pipe(gulp.dest('.tmp/assets/css'))
    .pipe(reload({stream: true}));
});

gulp.task('jslint', function() {
  return gulp.src('app/js/**/main.js')
    .pipe(jslint())
    .pipe(jslint.reporter('default'));
});

gulp.task('sassLint', function() {
 // return gulp.src(['app/assets/scss/**/*.scss', '!app/assets/scss/framework/_normalize.scss', '!app/assets/scss/framework/_scaffolding.scss', '!app/assets/scss/styles.scss', '!app/assets/scss/framework/_glyphicons.scss', '!app/assets/scss/framework/mixins/**/*.scss'])
   // .pipe(sassLint())
   // .pipe(sassLint.format())
    //.pipe(sassLint.failOnError());
});

gulp.task('scripts', () => {
  return gulp.src('app/assets/js/**/*.js')
    .pipe($.plumber())
    .pipe($.sourcemaps.init())
    .pipe($.babel())
    .pipe($.sourcemaps.write('.'))
    .pipe(gulp.dest('.tmp/assets/js'))
    .pipe(reload({stream: true}));
});

function lint(files, options) {
  return gulp.src(files)
    .pipe(reload({stream: true, once: true}))
    .pipe($.eslint(options))
    .pipe($.eslint.format())
    .pipe($.if(!browserSync.active, $.eslint.failAfterError()));
}

gulp.task('lint', () => {
  return lint('app/assets/js/**/*.js', {
    fix: true
  })
    .pipe(gulp.dest('app/assets/js'));
});
gulp.task('lint:test', () => {
  return lint('test/spec/**/*.js', {
    fix: true,
    env: {
      mocha: true
    }
  })
    .pipe(gulp.dest('test/spec/**/*.js'));
});

gulp.task('html', ['views', 'styles', 'scripts'], () => {
  return gulp.src(['app/**/*.html', '.tmp/**/*.html'])
    .pipe($.useref({searchPath: ['.tmp', 'app', '.']}))
    //.pipe($.if('*.js', $.uglify()))
    //.pipe($.if('*.css', $.cssnano({safe: true, autoprefixer: false})))
    .pipe($.if('*.html', gulpHtmlBeautify({indentSize: 2})))
    .pipe(gulp.dest('docs'));
});

gulp.task('views', () => {
  return gulp.src(['app/**/*.jade', '!app/components/*.jade', '!app/layouts/*.jade'])
    .pipe($.plumber())
    .pipe($.jade({pretty: true}))
    .pipe(gulp.dest('.tmp'))
    .pipe(reload({stream: true}));
});

gulp.task('images', () => {
  return gulp.src('app/assets/images/**/*')
    .pipe($.cache($.imagemin({
      progressive: true,
      interlaced: true,
      // don't remove IDs from SVGs, they are often used
      // as hooks for embedding and styling
      svgoPlugins: [{cleanupIDs: false}]
    })))
    .pipe(gulp.dest('docs/assets/images'));
});

gulp.task('fonts', () => {
  return gulp.src(require('main-bower-files')('**/*.{eot,svg,ttf,woff,woff2}', function (err) {})
    .concat('app/assets/fonts/**/*'))
    .pipe(gulp.dest('.tmp/assets/fonts'))
    .pipe(gulp.dest('docs/assets/fonts'));
});

gulp.task('extras', () => {
  return gulp.src([
    'app/*.*',
    '!app/**/*.html',
    '!app/**/*.jade'
  ], {
    dot: true
  }).pipe(gulp.dest('docs'));
});

gulp.task('clean', del.bind(null, ['.tmp', 'docs']));

gulp.task('serve', ['views', 'styles', 'sassLint', 'scripts', 'jslint', 'fonts'], () => {
  browserSync({
    notify: false,
    port: 9000,
    server: {
      baseDir: ['.tmp', 'app'],
      routes: {
        '/bower_components': 'bower_components'
      }
    }
  });

  gulp.watch([
    'app/**/*.html',
    'app/assets/img/**/*',
    '.tmp/assets/fonts/**/*'
  ]).on('change', reload);

  gulp.watch('app/**/*.jade', ['views']);
  gulp.watch('app/assets/scss/**/*.scss', ['styles', 'sassLint']);
  gulp.watch('app/assets/js/**/*.js', ['scripts', 'jslint']);
  gulp.watch('app/assets/fonts/**/*', ['fonts']);
  gulp.watch('bower.json', ['wiredep', 'fonts']);
});

gulp.task('serve:dist', () => {
  browserSync({
    notify: false,
    port: 9000,
    server: {
      baseDir: ['docs']
    }
  });
});

gulp.task('serve:test', ['scripts'], () => {
  browserSync({
    notify: false,
    port: 9000,
    ui: false,
    server: {
      baseDir: 'test',
      routes: {
        '/scripts': '.tmp/assets/js',
        '/bower_components': 'bower_components'
      }
    }
  });

  gulp.watch('app/assets/js/**/*.js', ['scripts']);
  gulp.watch('test/spec/**/*.js').on('change', reload);
  gulp.watch('test/spec/**/*.js', ['lint:test']);
});

// inject bower components
gulp.task('wiredep', () => {
  gulp.src('app/assets/scss/*.scss')
    .pipe(wiredep({
      ignorePath: /^(\.\.\/)+/
    }))
    .pipe(gulp.dest('app/assets/css'));

  gulp.src('app/templates/layouts/*.jade')
    .pipe(wiredep({
      ignorePath: /^(\.\.\/)*\.\./
    }))
    .pipe(gulp.dest('app'));
});

gulp.task('build', ['lint', 'html', 'images', 'fonts', 'extras'], () => {
  return gulp.src('docs/**/*').pipe($.size({title: 'build', gzip: true}));
});

gulp.task('default', ['clean'], () => {
  gulp.start('build');
});
