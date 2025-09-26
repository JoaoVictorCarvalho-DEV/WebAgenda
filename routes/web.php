<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\ContactController;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');



    Route::prefix('contact')->name('contact.')->group(
        function () {
            Route::get('create', [ContactController::class, 'create'])
                ->name('create');
            Route::post('store', [ContactController::class, 'store'])
                ->name('store');
            Route::get('index',[ContactController::class, 'index'])
                ->name('index');
        }
    );
});

require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
