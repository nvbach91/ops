var gulp = require('gulp'),
	browserSync = require('browser-sync'),
	reload = browserSync.reload,
	uglify = require('gulp-uglify'),
	plumber = require('gulp-plumber'),
	rename = require('gulp-rename'),
	concat = require('gulp-concat');

gulp.task('scripts', function(){
	gulp.src([
		'app/js/components/functions.js',
		'app/js/components/Item.js', 
		'app/js/components/main.js', 
	]).pipe(plumber())
	.pipe(concat('build.js'))
	//.pipe(rename({suffix:'.min'}))
	//.pipe(uglify())
	.pipe(gulp.dest('app/js'))
	.pipe(reload({stream: true}));
});

gulp.task('html', function(){
	gulp.src('app/**/*.html')
	.pipe(reload({stream: true}));
});

gulp.task('css', function(){
	gulp.src('app/css/styles.css')
	.pipe(reload({stream: true}));
});

gulp.task('browser-sync', function(){
	browserSync({
		server: {
			baseDir: "./app/"
		}
	});
});

gulp.task('watch', function(){
	gulp.watch('app/js/**/*.js', ['scripts']);
	gulp.watch('app/**/*.html', ['html']);
	gulp.watch('app/css/styles.css', ['css']);
});

gulp.task('default', ['scripts', 'html', 'css', 'browser-sync', 'watch']);