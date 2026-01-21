<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::get('/phone-combinations', function () {
    return Inertia::render('phone-combinations');
})->name('phone-combinations');
