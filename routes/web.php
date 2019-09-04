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

Route::get("/folders/fetch", "FoldersController@fetch")->name("folders.fetch");
Route::post("/folders", "FoldersController@store")->name("folders.store");
Route::delete("/folders/{folder}", "FoldersController@destroy")->name("folders.destroy");

Route::get("/files/fetch", "FilesController@fetch")->name("files.fetch");
Route::post("/files", "FilesController@store")->name("files.store");
Route::put("/files/{file}", "FilesController@update")->name("files.update");
Route::delete("/files/{file}", "FilesController@destroy")->name("files.destroy");

Route::get("/questions/fetch", "QuestionsController@fetch")->name("questions.fetch");
Route::post("/questions", "QuestionsController@store")->name("questions.store");
Route::put("/questions/{question}", "QuestionsController@update")->name("questions.update");
Route::delete("/questions", "QuestionsController@destroy")->name("questions.destroy");

Route::get("/descriptions/fetch", "DescriptionsController@fetch")->name("descriptions.fetch");
Route::post("/descriptions", "DescriptionsController@store")->name("descriptions.store");
Route::put("/descriptions/{description}", "DescriptionsController@update")->name("descriptions.update");

Route::get("/description_targets/fetch", "DescriptionTargetsController@fetch")->name("descriptionTarget.fetch");
Route::post("/description_targets", "DescriptionTargetsController@store")->name("descriptionTarget.store");
Route::put("/description_targets/{description_target}", "DescriptionTargetsController@update")->name("descriptionTargets.update");
Route::delete("/description_targets", "DescriptionTargetsController@destroy")->name("descriptionTargets.destroy");