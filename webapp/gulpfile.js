'use strict';
var gulp = require('gulp');
var browserSync = require('browser-sync');
var usemin = require('gulp-usemin');
var uglify = require('gulp-uglify');
var minifyHtml = require('gulp-minify-html');
var minifyCss = require('gulp-minify-css');
var rev = require('gulp-rev');
var reload = browserSync.reload;

gulp.task('browser-sync', function () {
    browserSync({
        server: {
            baseDir: './'
        },
        files: [
            'index.html',
            'style/*.css',
            'models/*.js',
            'collections/*.js',
            'views/*.js'
        ]
    });
});

gulp.task('build', function () {
    return gulp.src('./index.html')
        .pipe(usemin({
            css: [minifyCss(), 'concat'],
            html: [minifyHtml({empty: true})],
            js: [uglify(), rev()]
        }))
        .pipe(gulp.dest('build/'));
});

gulp.task('dev', ['browser-sync']);
gulp.task('default', ['build']);
