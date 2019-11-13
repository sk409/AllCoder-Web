const mix = require("laravel-mix");

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

mix.js("resources/js/app.js", "public/js")
    .js("resources/js/development_ide.js", "public/js/development_ide.js")
    .js("resources/js/development_writing.js", "public/js")
    .js("resources/js/development_reading.js", "public/js")
    .js("resources/js/lodash.full.min.js", "public/js")
    .js("resources/js/material_create.js", "public/js")
    .js("resources/js/material_edit.js", "public/js")
    .js("resources/js/material_show.js", "public/js")
    .js("resources/js/welcome.js", "public/js")
    .js("resources/js/material_purchase_show.js", "public/js")
    .js("resources/js/dashboard_created_materials.js", "public/js")
    .js("resources/js/dashboard_purchased_materials.js", "public/js")
    .js("resources/js/dashboard_lessons.js", "public/js")
    .sass("resources/sass/app.scss", "public/css")
    .sass("resources/sass/development_ide.scss", "public/css")
    .sass("resources/sass/dashboard.scss", "public/css")
    .sass("resources/sass/dashboard_lessons.scss", "public/css")
    .sass("resources/sass/materials/create.scss", "public/css/materials")
    .sass("resources/sass/materials/edit.scss", "public/css/materials")
    .sass("resources/sass/material_show.scss", "public/css")
    .sass("resources/sass/welcome.scss", "public/css")
    .sass("resources/sass/material_purchase_show.scss", "public/css");
