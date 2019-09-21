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

Route::group(["middleware" => ["auth"]], function () {

    Route::get('/dashboard/materials', 'DashboardController@materials')->name('dashboard.materials');
    Route::get("/dashboard/lessons", "DashboardController@lessons")->name("dashboard.lessons");

    Route::resource("lessons", "LessonsController");
    Route::resource("materials", "MaterialsController");

    Route::get("/development/{lessonId}", "DevelopmentController@index")->name("development");

    Route::get("/folders", "FoldersController@index")->name("folders.index");
    Route::post("/folders", "FoldersController@store")->name("folders.store");
    Route::put("/folders/{folder}", "FoldersController@update")->name("folders.update");
    Route::delete("/folders/{folder}", "FoldersController@destroy")->name("folders.destroy");

    Route::get("/files", "FilesController@index")->name("files.index");
    Route::post("/files", "FilesController@store")->name("files.store");
    Route::put("/files/{file}", "FilesController@update")->name("files.update");
    Route::delete("/files/{file}", "FilesController@destroy")->name("files.destroy");

    Route::get("/questions", "QuestionsController@index")->name("questions.index");
    Route::post("/questions", "QuestionsController@store")->name("questions.store");
    Route::put("/questions/{question}", "QuestionsController@update")->name("questions.update");
    Route::delete("/questions/{question}", "QuestionsController@destroy")->name("questions.destroy");

    Route::get("/descriptions", "DescriptionsController@index")->name("descriptions.index");
    Route::post("/descriptions", "DescriptionsController@store")->name("descriptions.store");
    Route::put("/descriptions/{description}", "DescriptionsController@update")->name("descriptions.update");

    Route::get("/description_targets", "DescriptionTargetsController@index")->name("descriptionTarget.index");
    Route::post("/description_targets", "DescriptionTargetsController@store")->name("descriptionTarget.store");
    Route::put("/description_targets/{description_target}", "DescriptionTargetsController@update")->name("descriptionTargets.update");
    Route::delete("/description_targets/{description_target}", "DescriptionTargetsController@destroy")->name("descriptionTargets.destroy");

    Route::get("/input_buttons", "InputButtonsController@index")->name("input_buttons.index");
    Route::post("/input_buttons", "InputButtonsController@store")->name("input_buttons.store");
});
