<?php

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::get('/', function () {
    return view('welcome');
});

Auth::routes();

Route::get('/home/materials', 'HomeController@materials')->name('home.materials');
Route::get("/home/lessons", "HomeController@lessons")->name("home.lessons");

Route::resource("lessons", "LessonsController");

Route::get("/development/{lessonId}", "DevelopmentController@index")->name("development");