<?php

use App\Http\Controllers\BirdeptController;
use App\Http\Controllers\FaqController;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\BeasiswaController;
use Illuminate\Support\Facades\Route;

Route::get('/', [HomeController::class, 'index'])->name('home');

Route::get('/bemssmi', [BirdeptController::class, 'bemssmi'])->name('bemssmi');

Route::get('/faq', [FaqController::class, 'index'])->name('faq');

Route::inertia('/akademik', 'Akademik/Index')->name('akademik');

Route::get('/informasi-beasiswa', [BeasiswaController::class, 'index'])->name('informasi-beasiswa');
Route::inertia('/informasi-wisuda', 'Wisuda/Index')->name('informasi-wisuda');
Route::inertia('/informasi-alumni', 'Alumni/Index')->name('informasi-alumni');
Route::inertia('/informasi-magang', 'Magang/Index')->name('informasi-magang');
Route::inertia('/informasi-kegiatan', 'Kegiatan/Index')->name('informasi-kegiatan');



// Route::get('/birdept', [BirdeptController::class, 'index'])->name('birdept.index');
Route::get('/birdept/{slug}', [BirdeptController::class, 'show'])->name('birdept.show');