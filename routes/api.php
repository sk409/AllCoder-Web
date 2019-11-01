<?php

use Illuminate\Http\Request;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::middleware('auth:api')->get('/user', function (Request $request) {
    return $request->user();
});

Route::group(['middleware' => ["api"]], function () {
    Route::get("users", "Api\UsersController@index");
    Route::get("materials", "Api\MaterialsController@index");
    Route::get("lessons", "Api\LessonsController@index");
    Route::post("materials/purchase", "Api\MaterialsController@purchase");
    Route::post("register", "Api\RegisterController@register");
    Route::post("login", "Api\LoginController@login");
    Route::post("upload", "Api\UploadController@store");
    Route::post("files", "Api\FilesController@store");
    Route::post("questions", "Api\QuestionsController@store");
    Route::post("preview/up", "Api\PreviewController@up");
    Route::get("preview", "Api\PreviewController@preview");
    Route::post("preview/down", "Api\PreviewController@down");
});
