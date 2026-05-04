<?php

use App\Http\Controllers\BirdeptController;
use App\Http\Controllers\FaqController;
use Illuminate\Support\Facades\Route;

Route::inertia('/', 'home')->name('home');

Route::get('/bemssmi', [BirdeptController::class, 'bemssmi'])->name('bemssmi');

Route::get('/faq', [FaqController::class, 'index'])->name('faq');


// Route::get('/birdept', [BirdeptController::class, 'index'])->name('birdept.index');
// Route::get('/birdept/{id}', [BirdeptController::class, 'show'])->name('birdept.show');