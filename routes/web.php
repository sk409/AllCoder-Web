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

Route::get('/dashboard/materials', 'DashboardController@materials')->name('dashboard.materials');
Route::get("/dashboard/lessons", "DashboardController@lessons")->name("dashboard.lessons");

Route::resource("lessons", "LessonsController");

Route::get("/development/{lessonId}", "DevelopmentController@index")->name("development");

Route::get("/folders/select", "FoldersController@select")->name("folders.select");
Route::post("/folders", "FoldersController@store")->name("folders.store");