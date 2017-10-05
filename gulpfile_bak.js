var gulp = require('gulp'),
    babel = require('gulp-babel'),
    zip = require('gulp-zip');

/**
 * Watch ES6 JS files changes.
 */
gulp.task('watch', ['build'], function() {
    gulp.watch('src/scripts_es6/**/*.js', ['build']);
});

/**
 * Build ES6 JS files into ES5 with Babel.
 */
gulp.task('build', function() {
    return gulp.src('src/scripts_es6/**/*.js')
        .pipe(babel({
            presets: ['es2015']
        }))
        .on('error', console.error.bind(console))
        .pipe(gulp.dest('src/scripts/'));
});

/**
 * Package the src in the src/dist/ folder.
 */
gulp.task('dist', function() {
    // Exclude es6 scripts
    return gulp.src(['src/**', '!src/scripts_es6/', '!src/scripts_es6/**'])
        .pipe(zip('chrome.zip'))
        .pipe(gulp.dest('dist'));
});
