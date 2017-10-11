/**
 * Use RollupJS to bundle content-script, background, dev-tools files with their dependencies
 * into single file, in order to avoid using requireJS on the browser. In fact, RequireJS is already used by Siebel OpenUI
 * and it could lead to conflict issues.
 */
var gulp = require('gulp'),
    addsrc = require('gulp-add-src'),
    sourcemaps = require('gulp-sourcemaps'),
    babel = require('gulp-babel'),
    rollupBabel = require('rollup-plugin-babel'),
    rollup = require('gulp-rollup'),
    zip = require('gulp-zip');

/*
 * Watch ES6 JS files changes.
 */
gulp.task('watch', ['build'], function() {
    gulp.watch('src/scripts_es6/**/*.js', ['build']);
});

/*
 * Build ES6 JS files into ES5 with Babel.
 */
gulp.task('build:global', function() {
    return gulp.src(['src/scripts_es6/**/*.js', '!src/scripts_es6/lib/', '!src/scripts_es6/lib/**'])
        .pipe(babel({
            presets: ['es2015']
        }))
        /* Don't babelify lib folder */
        .pipe(addsrc(['./src/scripts_es6/lib/**'], { base: './src/scripts_es6/'}))
        .on('error', console.error.bind(console))
        .pipe(gulp.dest('./src/scripts'));
});

/*
 * Bundle the injected + content-script with dependencies using rollupjs, into a single file provided in the manifest.
 */
gulp.task('build:content-injected-script', ['build:global'], function() {
    gulp.src([
            './src/scripts_es6/client-listener.js'
        ])
        .pipe(sourcemaps.init())
        .pipe(rollup({
            /* Fix the filepath does not exist in the hypothetical filesystem issue
             https://github.com/rollup/rollup/issues/772#issuecomment-231299803 */
            allowRealFiles: true,
            input: './src/scripts_es6/client-listener.js',
            plugins: [
                rollupBabel({
                    exclude: 'node_modules/**',
                    presets: ['es2015-rollup'],
                }),
            ],
            format: 'iife'
        }))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('./src/scripts'));
});

/*
 * Build all files : babelify + bundle
 */
gulp.task('build', ['build:content-injected-script']);

/*
 * Package the src in the src/dist/ folder.
 */
gulp.task('dist', function() {
    // Exclude es6 scripts
    return gulp.src(['src/**', '!src/scripts_es6/', '!src/scripts_es6/**'])
        .pipe(zip('chrome.zip'))
        .pipe(gulp.dest('dist'));
});