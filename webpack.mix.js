const mix = require('laravel-mix');

/*
 |--------------------------------------------------------------------------
 | Mix Asset Management
 |--------------------------------------------------------------------------
 |
 | Mix provides a clean, fluent API for defining some Webpack build steps
 | for your Laravel application. By default, we are compiling the Sass
 | file for the application as well as bundling up all the JS files.
 |
 */

mix.js('resources/js/app.js', 'public/js')
    .js("resources/js/development/development.js", "public/js")
    .js("resources/js/lodash.full.min.js", "public/js")
    .js("resources/js/materials/create.js", "public/js/materials")
    .js("resources/js/materials/edit.js", "public/js/materials")
    .sass('resources/sass/app.scss', 'public/css')
    .sass("resources/sass/development.scss", "public/css")
    .sass("resources/sass/materials/create.scss", "public/css/materials")
    .sass("resources/sass/materials/edit.scss", "public/css/materials");