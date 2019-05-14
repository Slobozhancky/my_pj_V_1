const gulp         = require('gulp'),
	  sass         = require('gulp-sass'),
	  browserSync  = require('browser-sync'),
	  concat       = require('gulp-concat'),
	  uglify       = require('gulp-uglifyjs'),
	  cssnano      = require('gulp-cssnano'),
	  concatCss    = require('gulp-concat-css'),
	  rename       = require('gulp-rename'),
	  autoprefixer = require('gulp-autoprefixer'),
	  sourcemaps   = require('gulp-sourcemaps'),
	  rigger       = require('gulp-rigger');

gulp.task('help', function() {
	console.log('//=============== Задачи построения =======================\\\\');
	console.log('||                                                         ||');
	console.log('||  init ............... компиляция sass, сборка библиотек ||');
	console.log('||  watch .............. процесс слежения                  ||');
	console.log('||                                                         ||');
	console.log('||=============== Сборка и минификация библиотек ==========||');
	console.log('||                                                         ||');
	console.log('||  concat-all ......... собрать все библиотеки            ||');
	console.log('||  concat-css ......... собрать css библиотеки            ||');
	console.log('||  concat-js .......... собрать js библиотеки             ||');
	console.log('||  concat-js .......... собрать js библиотеки             ||');
	console.log('||                                                         ||');
	console.log('||=============== Минификация =============================||');
	console.log('||                                                         ||');
	console.log('||  min-all ............ минификация style.css, main.js    ||');
	console.log('||  min-css ............ минификация style.css             ||');
	console.log('||  min-js ............. минификация main.js               ||');
	console.log('||                                                         ||');
	console.log('||=============== После сжатия картинок ===================||');
	console.log('||                                                         ||');
	console.log('||  img-rr ............. переименовать img/*-min.*         ||');
	console.log('||                                                         ||');
	console.log('\\\\=========================================================//');
});

// ===========================
// Компиляция SASS
// ===========================
gulp.task('sass', function() {
	gulp.src('app/sass/**/*.+(scss|sass)')
			   .pipe(sourcemaps.init())
			   .pipe(sass({outputStyle: 'expanded'}).on('error', sass.logError))
			   .pipe(autoprefixer(['last 15 versions', '> 1%', 'ie 8', 'ie 7']))
			   .pipe(sourcemaps.write())
			   .pipe(gulp.dest('app/css'))
			   .pipe(browserSync.stream());
});

// ===========================
// Live Reload
// ===========================
gulp.task('watch', function() {
	browserSync.init({
		server: {
			baseDir: 'app'
		},
		notify: false
	});

	gulp.watch('app/sass/**/*.+(scss|sass)', ['sass']);
	gulp.watch('app/tpl/**/*.html', ['html'], browserSync.reload);
	gulp.watch('app/*.html', browserSync.reload);
	gulp.watch('app/js/**/*.js', browserSync.reload);
});

// ===========================
// Concat libs
// ===========================
gulp.task('concat-js', function() {
	return gulp.src([
					'libs/js/*.js'
				])
				.pipe(concat('libs.min.js'))
				.pipe(uglify())
				.pipe(gulp.dest('app/js'));
});

gulp.task('concat-css', function() {
	return gulp.src([
					'libs/css/*.css'
				])
				.pipe(concatCss('libs.min.css'))
				.pipe(cssnano())
				.pipe(gulp.dest('app/css'));
});

gulp.task('concat-all', ['concat-js', 'concat-css']);

// ===========================
// Подготовить проект
// ===========================
gulp.task('init', ['sass', 'concat-all']);

// ===========================
// Очистить папку dist
// ===========================
gulp.task('clean', function() {
	return gulp.src('dist', {read: false})
			   .pipe(clean());
});

// ===========================
// Минификация своих CSS, JS
// ===========================
gulp.task('min-css', function () {
	return gulp.src('app/css/style.css')
			   .pipe(cssnano())
			   .pipe(rename({suffix: '.min'}))
			   .pipe(gulp.dest('app/css'));
});

gulp.task('min-js', function () {
	return gulp.src('app/js/main.js')
			   .pipe(uglify())
			   .pipe(rename({suffix: '.min'}))
			   .pipe(gulp.dest('app/js'));
});

gulp.task('min-all', ['min-css', 'min-js']);

// ===========================
// Переименовать оптимизированные картинки и удалить исходники
// ===========================
gulp.task('img-rr', function() {
	gulp.src('app/img/**/*-min.*')
		.pipe(rename(function (opt, file) {
			opt.basename = opt.basename.slice(0, -4);
			gulp.src(file.history[0], {read: false}).pipe(clean());
			return opt;
		}))
		.pipe(gulp.dest('app/img'));
});

// ===========================
// Собрать шаблон
// ===========================
gulp.task('html', function () {
	gulp.src('app/tpl/**/*.html')
		.pipe(rigger())
		.pipe(gulp.dest('app'));
});