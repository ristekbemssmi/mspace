<?php

use App\Http\Controllers\Admin\AdminDashboardController;
use App\Http\Controllers\Admin\BirdeptController;
use App\Http\Controllers\Admin\CsvImportController;
use App\Http\Controllers\Admin\FaqController;
use App\Http\Controllers\Admin\InformasiController;
use App\Http\Controllers\Admin\UserController;
use App\Models\Birdept;
use App\Models\Faq;
use App\Models\Informasi;
use App\Models\User;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

Route::get('/', fn () => redirect()->route(Auth::check() ? 'dashboard' : 'login'))->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/dashboard', function () {
        return redirect()->route(Auth::user()->hasAdminRole('admin', 'editor', 'viewer') ? 'admin.dashboard' : 'access.pending');
    })->name('dashboard');
    Route::get('/access-pending', fn () => Inertia::render('auth/access-pending'))->name('access.pending');
});

Route::middleware(['auth', 'verified', 'can:access-admin'])->group(function () {
    Route::get('/admin/dashboard', [AdminDashboardController::class, 'index'])->name('admin.dashboard');

    Route::get('/admin/approvals', fn () => Inertia::render('admin/approvals', [
        'accounts' => User::whereNull('adminRole')->orderBy('createdAt')->get(['id', 'name', 'email', 'createdAt']),
    ]))->middleware('can:create,'.User::class)->name('admin.approvals');
    Route::post('/admin/approvals/{user}', function (Request $request, User $user) {
        $data = $request->validate(['role' => 'required|in:viewer,editor,admin']);
        abort_unless($user->adminRole === null, 409);
        $user->forceFill(['adminRole' => $data['role']])->save();
        Log::info('Dashboard role approved', ['actor_id' => $request->user()->id, 'subject_id' => $user->id, 'role' => $data['role']]);

        return back()->with('success', 'Akses akun disetujui.');
    })->middleware('can:create,'.User::class)->name('admin.approvals.store');

    // Modul Birdept
    Route::prefix('admin/birdept')->name('admin.birdept.')->group(function () {
        Route::get('/', [BirdeptController::class, 'index'])->middleware('can:viewAny,'.Birdept::class)->name('index');
        Route::post('/', [BirdeptController::class, 'store'])->middleware('can:create,'.Birdept::class)->name('store');
        Route::put('/{id}', [BirdeptController::class, 'update'])->middleware('can:updateAny,'.Birdept::class)->name('update');
        Route::delete('/{id}', [BirdeptController::class, 'destroy'])->middleware('can:deleteAny,'.Birdept::class)->name('destroy');
        Route::post('/import-csv', [BirdeptController::class, 'importCsv'])->middleware('can:import,'.Birdept::class)->name('import-csv');
        Route::get('/template-csv', [BirdeptController::class, 'downloadTemplate'])->middleware('can:viewAny,'.Birdept::class)->name('template-csv');
        Route::get('/export-csv', [BirdeptController::class, 'exportCsv'])->middleware('can:export,'.Birdept::class)->name('export-csv');
    });

    // Modul Users
    Route::prefix('admin/users')->name('admin.users.')->group(function () {
        Route::get('/', [UserController::class, 'index'])->middleware('can:viewAny,'.User::class)->name('index');
        Route::post('/', [UserController::class, 'store'])->middleware('can:create,'.User::class)->name('store');
        Route::put('/{id}', [UserController::class, 'update'])->middleware('can:updateAny,'.User::class)->name('update');
        Route::delete('/{id}', [UserController::class, 'destroy'])->middleware('can:deleteAny,'.User::class)->name('destroy');
        Route::post('/import-csv', [UserController::class, 'importCsv'])->middleware('can:import,'.User::class)->name('import-csv');
        Route::get('/template-csv', [UserController::class, 'downloadTemplate'])->middleware('can:viewAny,'.User::class)->name('template-csv');
        Route::get('/export-csv', [UserController::class, 'exportCsv'])->middleware('can:export,'.User::class)->name('export-csv');
    });

    // Modul Informasi
    Route::prefix('admin/informasi')->name('admin.informasi.')->group(function () {
        Route::get('/media/{id}', [InformasiController::class, 'image'])->middleware('can:viewAny,'.Informasi::class)->name('image');
        Route::get('/', [InformasiController::class, 'index'])->middleware('can:viewAny,'.Informasi::class)->name('index');
        Route::post('/', [InformasiController::class, 'store'])->middleware('can:create,'.Informasi::class)->name('store');
        Route::put('/{id}', [InformasiController::class, 'update'])->middleware('can:updateAny,'.Informasi::class)->name('update');
        Route::delete('/{id}', [InformasiController::class, 'destroy'])->middleware('can:deleteAny,'.Informasi::class)->name('destroy');
        Route::post('/import-csv', [InformasiController::class, 'importCsv'])->middleware('can:import,'.Informasi::class)->name('import-csv');
        Route::get('/template-csv', [InformasiController::class, 'downloadTemplate'])->middleware('can:viewAny,'.Informasi::class)->name('template-csv');
        Route::get('/export-csv', [InformasiController::class, 'exportCsv'])->middleware('can:export,'.Informasi::class)->name('export-csv');
    });

    // Modul FAQ
    Route::prefix('admin/faqs')->name('admin.faqs.')->group(function () {
        Route::get('/', [FaqController::class, 'index'])->middleware('can:viewAny,'.Faq::class)->name('index');
        Route::post('/', [FaqController::class, 'store'])->middleware('can:create,'.Faq::class)->name('store');
        Route::put('/{id}', [FaqController::class, 'update'])->middleware('can:updateAny,'.Faq::class)->name('update');
        Route::delete('/{id}', [FaqController::class, 'destroy'])->middleware('can:deleteAny,'.Faq::class)->name('destroy');
        Route::post('/import-csv', [FaqController::class, 'importCsv'])->middleware('can:import,'.Faq::class)->name('import-csv');
        Route::get('/template-csv', [FaqController::class, 'downloadTemplate'])->middleware('can:viewAny,'.Faq::class)->name('template-csv');
        Route::get('/export-csv', [FaqController::class, 'exportCsv'])->middleware('can:export,'.Faq::class)->name('export-csv');
    });

    // Central CSV & Excel Import Hub
    Route::prefix('admin/csv-hub')->name('admin.csv-hub.')->group(function () {
        Route::get('/', [CsvImportController::class, 'index'])->middleware('can:import,'.User::class)->name('index');
        Route::post('/process', [CsvImportController::class, 'processImport'])->middleware('can:import,'.User::class)->name('process');
        Route::get('/template/{tableName}', [CsvImportController::class, 'downloadTemplate'])->middleware('can:import,'.User::class)->name('template');
        Route::get('/template-xlsx/{tableName}', [CsvImportController::class, 'downloadTemplateXlsx'])->middleware('can:import,'.User::class)->name('template-xlsx');
        Route::get('/export/{tableName}', [CsvImportController::class, 'exportTable'])->middleware('can:export,'.User::class)->name('export');
    });
});

require __DIR__ . '/settings.php';
