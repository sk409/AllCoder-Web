<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Auth;

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

// Route::get("/", "WelcomeController@welcome")->name("welcome.welcome");


Auth::routes();

Route::group(["middleware" => ["auth"]], function () {

    Route::get('/', 'DashboardController@purchasedMaterials');
    Route::get("/dashboard/created_materials", "DashboardController@createdMaterials")->name("dashboard.created_materials");
    Route::get('/dashboard/purchased_materials', 'DashboardController@purchasedMaterials')->name('dashboard.purchased_materials');
    Route::get("/dashboard/lessons", "DashboardController@lessons")->name("dashboard.lessons");
    Route::get("/dashboard/followings", "DashboardController@followings")->name("dashboard.following");
    Route::get("/dashboard/followers", "DashboardController@followers")->name("dashboard.follower");
    Route::get("/dashboard/chat_rooms", "DashboardController@chatRooms")->name("dashboard.chat_rooms");
    Route::get("/dashboard/review", "DashboardController@review")->name("dashboard.review");

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
    Route::post("/development/down", "DevelopmentController@down")->name("development.down");

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

    Route::post("malware_scan", "MalwareScanController@scan")->name("malware_scan.scan");

    Route::resource("code_questions", "CodeQuestionsController");
    Route::resource("code_question_closes", "CodeQuestionClosesController");
    Route::resource('code_question_answers', 'CodeQuestionAnswersController');

    Route::get("users", "UsersController@index")->name("users.index");
    Route::get("users/{userId}", "UsersController@show")->name("users.show");

    Route::resource("chat_rooms", "ChatRoomsController");
    Route::resource("chat_messages", "ChatMessagesController");

    Route::post("followers", "FollowersController@store")->name("followers.store");

    Route::get("invitation_requests", "InvitationRequestsController@index")->name("invitation_requests.index");
    Route::post("invitation_requests", "InvitationRequestsController@store")->name("inviation_requests.store");
    Route::delete("invitation_requests/{id}", "InvitationRequestsController@destory")->name("invitation_requests.destory");

    Route::post("chat_room_user", "ChatRoomUserController@store")->name("chat_room_user.store");

    Route::get("lesson_material", "LessonMaterialController@index")->name("lesson_material.index");

    Route::get("learning_results", "LearningResultsController@index")->name("learning_results.index");
    Route::post("learning_results", "LearningResultsController@store")->name("learning_resutls.store");
    Route::put("learning_results/{id}", "LearningResultsController@update")->name("learning_results.update");

    Route::get("review", "ReviewController@review")->name("review.review");
});
