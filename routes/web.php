<?php

use App\Http\Controllers\BirdeptController;
use App\Http\Controllers\FaqController;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\BeasiswaController;
use Illuminate\Support\Facades\Route;

Route::get('/', [HomeController::class, 'index'])->name('home');

Route::get('/bemssmi', [BirdeptController::class, 'bemssmi'])->name('bemssmi');

Route::get('/faq', [FaqController::class, 'index'])->name('faq');

Route::inertia('/akademik', 'akademik')->name('akademik');

Route::get('/informasi-beasiswa', [BeasiswaController::class, 'index'])->name('informasi-beasiswa');


// Route::get('/birdept', [BirdeptController::class, 'index'])->name('birdept.index');
// Route::get('/birdept/{id}', [BirdeptController::class, 'show'])->name('birdept.show');