<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\API\PortfolioController;

Route::prefix('portfolios')->group(function () {
    Route::get('/', [PortfolioController::class, 'index']);
    Route::post('/', [PortfolioController::class, 'store']);
    Route::get('/{portfolio}', [PortfolioController::class, 'show']);
    Route::delete('/{portfolio}', [PortfolioController::class, 'destroy']);
});