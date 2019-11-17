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

Route::get("/", "WelcomeController@welcome")->name("welcome.welcome");


Auth::routes();

Route::group(["middleware" => ["auth"]], function () {

    Route::get("/dashboard/created_materials", "DashboardController@createdMaterials")->name("dashboard.created_materials");
    Route::get('/dashboard/purchased_materials', 'DashboardController@purchasedMaterials')->name('dashboard.purchased_materials');
    Route::get("/dashboard/lessons", "DashboardController@lessons")->name("dashboard.lessons");

    //Route::resource("lessons", "LessonsController");
    Route::get("lessons", "LessonsController@index")->name("lessons.index");
    Route::get("lessons/create", "LessonsController@create")->name("lessons.create");
    Route::post("lessons", "LessonsController@store")->name("lessons.store");
    Route::put("lessons/{lesson}", "LessonsController@update")->name("lessons.update");

    Route::resource("materials", "MaterialsController");

    Route::get("material_purchase/{material}", "MaterialPurchaseController@show")->name("material_purchase.show");
    Route::post("material_purchase/{material}", "MaterialPurchaseController@purchase")->name("material_purchase.purchase");

    Route::get("/development/creating/{lesson}", "DevelopmentController@creating")->name("development.creating");
    Route::get("/development/learning", "DevelopmentController@learning")->name("development.learning");
    Route::get("/development_writing/{lesson}", "DevelopmentController@writing")->name("development.writing");
    Route::get("/development/reading", "DevelopmentController@reading")->name("development.reading");
    Route::post("/development/unload/{lessonId}", "DevelopmentController@unload")->name("development.unload");

    // Route::get("/folders", "FoldersController@index")->name("folders.index");
    // Route::post("/folders", "FoldersController@store")->name("folders.store");
    // Route::put("/folders/{folder}", "FoldersController@update")->name("folders.update");
    // Route::delete("/folders/{folder}", "FoldersController@destroy")->name("folders.destroy");
    // Route::get("/folders/tree", "FoldersController@tree")->name("folders.tree");
    Route::get("/folders/children", "FoldersController@children")->name("folders.children");

    Route::get("/files", "FilesController@index")->name("files.index");
    // Route::post("/files", "FilesController@store")->name("files.store");
    Route::put("/files", "FilesController@update")->name("files.update");
    // Route::delete("/files/{file}", "FilesController@destroy")->name("files.destroy");
    //Route::get("/files/fetch_text", "FilesController@fetchText")->name("files.fetchText");

    //Route::get("/questions", "QuestionsController@index")->name("questions.index");
    Route::post("/questions", "QuestionsController@store")->name("questions.store");
    //Route::put("/questions/{question}", "QuestionsController@update")->name("questions.update");
    //Route::delete("/questions/{question}", "QuestionsController@destroy")->name("questions.destroy");

    Route::get("file_delta", "FileDeltaController@delta")->name("file_delta.delta");

    Route::put("lesson_ratings", "LessonRatingsController@update")->name("lesson_ratings.update");
});
