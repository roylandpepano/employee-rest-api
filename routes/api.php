<?php

use App\Http\Controllers\Api\AuthTokenController;
use App\Http\Controllers\Api\EmployeeController;
use Illuminate\Support\Facades\Route;

Route::post('/auth/token', [AuthTokenController::class, 'store'])
    ->middleware('throttle:10,1');

Route::delete('/auth/token', [AuthTokenController::class, 'destroy'])
    ->middleware(['auth:sanctum']);

Route::middleware(['auth:sanctum'])->group(function () {
    Route::apiResource('employees', EmployeeController::class);
});
