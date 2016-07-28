'use strict';

import gulp from 'gulp';

import sourcemaps from 'gulp-sourcemaps';
import changed from 'gulp-changed';
import clean from 'gulp-clean';
import plumber from 'gulp-plumber';
import ignore from 'gulp-ignore';
import concat from 'gulp-concat';
import print from 'gulp-print';
import util from 'gulp-util';

import pug from 'gulp-pug';

import imagemin from 'gulp-imagemin';
import splashiconGenerator from 'splashicon-generator';

import stylus from 'gulp-stylus';
import autoprefixer from 'autoprefixer-stylus';
import cssmin from 'gulp-cssmin';

import {rollup} from 'rollup';
import babel from 'rollup-plugin-babel';
import nodeResolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import uglify from 'rollup-plugin-uglify';
import json from 'rollup-plugin-json';

import fontello from 'gulp-fontello';
import googleWebFonts from 'gulp-google-webfonts';
import webFontsBase64 from 'gulp-google-fonts-base64-css';

import browserSync from 'browser-sync';


const SRC = 'src/';
const DIST = util.env.phonegap ? 'www/' : 'dist/';

const JS = 'js/';
const CSS = 'css/';
const IMG = 'img/';
const MP3 = 'mp3/';
const FONTS = 'font/';


gulp.task('pug',
    () => gulp.src(SRC + 'index.pug')
        .pipe(plumber())
        .pipe(changed(DIST, {extension: '.html'}))
        .pipe(pug({
            locals: {
                PHONEGAP: util.env.phonegap
            }
        }))
        .pipe(gulp.dest(DIST))
        .pipe(browserSync.stream())
);

gulp.task('css',
    () => gulp.src(SRC + CSS + 'style.styl')
        .pipe(plumber())
        //.pipe(changed(OUT + CSS, {extension: '.css'}))
        .pipe(sourcemaps.init({loadMaps: true}))
        .pipe(stylus({
            use: autoprefixer(),
            compress: true,
            'include css': true
        }))
        .pipe(cssmin())
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest(DIST + CSS))
        .pipe(browserSync.stream())
);


gulp.task('js',
    () => rollup({
        entry: SRC + JS + 'App.js',
        plugins: [
            json(),
            nodeResolve({jsnext: true}),
            babel({
                babelrc: false,
                presets: ['es2015-rollup'],
                exclude: 'node_modules/**'
            }),
            commonjs(),
            uglify()
        ]
    }).then(
        (bundle) => {
            bundle.write({
                format: 'iife',
                dest: DIST + JS + 'App.js',
                sourceMap: true
            });
            browserSync.reload();
        }
    )
);

gulp.task('img',
    () => gulp.src(SRC + IMG + '*')
        .pipe(changed(DIST + IMG))
        .pipe(imagemin())
        .pipe(gulp.dest(DIST + IMG))
);

gulp.task('generate-splashicon', (done) => {
    if (util.env.phonegap) {
        const options = {
            ICON_FILE: SRC + IMG + 'icon.png',
            SPLASH_FILE: SRC + IMG + 'splash.png',
            ICON_PLATFORMS: [{
                name: 'android',
                iconsPath: 'res/icons/android/',
                isAdded: true,
                icons: [
                    {name: 'icon-36-ldpi.png', size: 36, density: 'ldpi'},
                    {name: 'icon-48-mdpi.png', size: 48, density: 'mdpi'},
                    {name: 'icon-72-hdpi.png', size: 72, density: 'hdpi'},
                    {name: 'icon-96-xhdpi.png', size: 96, density: 'xhdpi'},
                    {name: 'icon-144-xxhdpi.png', size: 144, density: 'xxhdpi'},
                    {name: 'icon-192-xxxhdpi.png', size: 192, density: 'xxxhdpi'},
                ]
            }],
            SPLASH_PLATFORMS: [{
                name: 'android',
                isAdded: true,
                splashPath: 'res/screens/android/',
                splash: [
                    {name: "screen-ldpi-portrait.png", width: 320, height: 426, density: "port-ldpi"}, // 200x320
                    {name: "screen-ldpi-landscape.png", width: 426, height: 320, density: "land-ldpi"}, // 320x200
                    {name: "screen-hdpi-portrait.png", width: 480, height: 640, density: "port-hdpi"}, // 320x480
                    {name: "screen-hdpi-landscape.png", width: 640, height: 480, density: "land-hdpi"}, // 480x320
                    {name: "screen-mdpi-portrait.png", width: 320, height: 470, density: "port-mdpi"}, // 480x800
                    {name: "screen-mdpi-landscape.png", width: 470, height: 320, density: "land-mdpi"}, // 800x480
                    {name: "screen-xhdpi-portrait.png", width: 720, height: 960, density: "port-xhdpi"}, // 720x1280
                    {name: "screen-xhdpi-landscape.png", width: 960, height: 720, density: "land-xhdpi"}, // 1280x720
                    {name: "screen-xxhdpi-portrait.png", width: 960, height: 1600, density: "port-xxhdpi"}, // 960x1600
                    {name: "screen-xxhdpi-landscape.png", width: 1600, height: 960, density: "land-xxhdpi"}, // 1600x960
                    {name: "screen-xxxhdpi-portrait.png", width: 1280, height: 1920, density: "port-xxhdpi"}, // 1280x1920
                    {name: "screen-xxxhdpi-landscape.png", width: 1920, height: 1280, density: "land-xxhdpi"} // 1920x1280
                ]
            }]
        };
        // Generate only the custom assets specified in the `options` parameter
        splashiconGenerator.generate(options).then(function () {
            done();
        });
    } else {
        done();
    }
});

gulp.task('mp3',
    () => gulp.src(SRC + MP3 + '*')
        .pipe(changed(DIST + MP3))
        .pipe(gulp.dest(DIST + MP3))
);

gulp.task('glyphs', () =>
    gulp.src(SRC + 'fontello-config.json')
        .pipe(fontello())
        .pipe(ignore.exclude('css/fontello-*.css'))
        .pipe(ignore.exclude('css/animation.css'))
        .pipe(gulp.dest(DIST))
);

gulp.task('fonts',
    () => gulp.src(SRC + 'google-fonts.list')
        .pipe(webFontsBase64())
        .pipe(concat('web-fonts.css'))
        .pipe(cssmin())
        .pipe(gulp.dest(DIST + CSS))
);

gulp.task('build', ['pug', 'js', 'css', 'img', 'mp3', 'glyphs', 'fonts', 'generate-splashicon']);

gulp.task('browser-sync', () => {
    if (!util.env.phonegap) {
        browserSync.init({
            server: {
                baseDir: DIST
            }
        });
    }
});

gulp.task('watch', () => {
    gulp.watch(SRC + CSS + '**/*.styl', ['css']);
    gulp.watch(SRC + 'index.pug', ['pug']);
    gulp.watch(SRC + JS + '**/*.js', ['js']);
});

gulp.task('default', ['build', 'watch', 'browser-sync']);