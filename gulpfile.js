/**
 * Use RollupJS to bundle content-script, background, dev-tools files with their dependencies
 * into single file, in order to avoid using requireJS on the browser. In fact, RequireJS is already used by Siebel OpenUI
 * and it could lead to conflict issues.
 */
var gulp = require('gulp'),
    sourcemaps = require('gulp-sourcemaps'),
    babel = require('gulp-babel'),
    rollupBabel = require('rollup-plugin-babel'),
    rollup = require('gulp-rollup'),
    zip = require('gulp-zip');

/**
 * Watch ES6 JS files changes.
 */
gulp.task('watch', ['build:all'], function() {
    gulp.watch('src/scripts_es6/**/*.js', ['build']);
});

/**
 * Build ES6 JS files into ES5 with Babel.
 */
gulp.task('build:all', function() {
    // TODO : content-script + bg + dev-tools files will be bundled with their dependencies using rollupjs
    // Just run each file tasks sequentially, eg : run build:content-script, then build:background-script, etc.
    return gulp.src(['src/scripts_es6/**/*.js'])
        .pipe(babel({
            presets: ['es2015']
        }))
        .on('error', console.error.bind(console))
        .pipe(gulp.dest('./src/scripts'));
});

// https://lazamar.github.io/up-and-running-with-rollup-js-in-gulp-grunt-and-native-js-api/
/**
 * Bundle the injected + content-script with dependencies using rollupjs, into a single file provided in the manifest.
 */
gulp.task('build:content-injected-script', function() {
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

/**
 * Package the src in the src/dist/ folder.
 */
gulp.task('dist', function() {
    // Exclude es6 scripts
    return gulp.src(['src/**', '!src/scripts_es6/', '!src/scripts_es6/**'])
        .pipe(zip('chrome.zip'))
        .pipe(gulp.dest('dist'));
});
