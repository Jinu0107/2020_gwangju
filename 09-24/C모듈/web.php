<?php

use src\App\Route;


Route::get("/", "MainController@index");
Route::get("/current", "MainController@current");
Route::get("/festival", "MainController@festival");
Route::get("/sub", "MainController@sub");
Route::get("/login_page", "MainController@login_page");

Route::post("/login_process", "UserController@login");
Route::get("/logout_process", "UserController@logout");


Route::get("/festivalCS", "MainController@festivalCS");
Route::get('/down', "FestivalController@down");

Route::get("/update",  "MainController@update");
Route::get("/insert", "MainController@insert");
Route::get("/festivalView", "MainController@festivalView");

Route::post('/update_process', "FestivalController@update");
Route::post("/insert_process", "FestivalController@insert");
Route::get("/delete_process", "FestivalController@delete");
Route::post("/review_process", "FestivalController@review");
Route::get("/review_delete", "FestivalController@delete_review");

Route::get("/getImage", "FestivalController@getImage");
