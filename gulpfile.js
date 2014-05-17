var gulp = require('gulp');
var connect = require('gulp-connect');

gulp.task('connect', function () {
	connect.server({
		port: 8000,
		livereload: true
	});
});

gulp.task('default', ['connect']);