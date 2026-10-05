<?php

use App\Http\Controllers\BeasiswaController;
use App\Http\Controllers\CategoryInformationController;
use App\Http\Controllers\BirdeptController;
use App\Http\Controllers\FaqController;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\InformasiController;
use App\Http\Middleware\TrackPublicVisit;
use Illuminate\Support\Facades\Route;

Route::get('/media/information/{id}', [InformasiController::class, 'image'])->whereNumber('id')->name('information.image');

Route::middleware(TrackPublicVisit::class)->group(function (): void {
    Route::get('/', [HomeController::class, 'index'])->name('home');
    Route::get('/bemssmi', [BirdeptController::class, 'bemssmi'])->name('bemssmi');
    Route::get('/faq', [FaqController::class, 'index'])->name('faq');
    Route::get('/informasi/{identifier}', [InformasiController::class, 'show'])->name('informasi.show');
    Route::inertia('/akademik', 'Akademik/Index')->name('akademik');
    Route::get('/informasi-beasiswa', [BeasiswaController::class, 'index'])->name('informasi-beasiswa');
    Route::get('/informasi-wisuda', [CategoryInformationController::class, 'wisuda'])->name('informasi-wisuda');
    Route::get('/informasi-alumni', [CategoryInformationController::class, 'alumni'])->name('informasi-alumni');
    Route::get('/informasi-magang', [CategoryInformationController::class, 'magang'])->name('informasi-magang');
    Route::get('/informasi-kegiatan', [CategoryInformationController::class, 'kegiatan'])->name('informasi-kegiatan');
    Route::get('/birdept/{slug}', [BirdeptController::class, 'show'])->name('birdept.show');
});
