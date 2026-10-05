<?php

use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;
use App\Models\User;

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');

Artisan::command('admin:grant {email} {role=admin}', function (string $email, string $role): void {
    if (! in_array($role, ['admin', 'editor', 'viewer', 'none'], true)) {
        $this->error('Role harus admin, editor, viewer, atau none.');
        return;
    }

    $user = User::where('email', $email)->first();
    if (! $user) {
        $this->error('Akun tidak ditemukan.');
        return;
    }

    if ($user->adminRole === 'admin' && $role !== 'admin' && User::where('adminRole', 'admin')->count() <= 1) {
        $this->error('Admin terakhir tidak boleh dicabut.');
        return;
    }

    $user->forceFill(['adminRole' => $role === 'none' ? null : $role])->save();
    $this->info("Peran dashboard untuk {$email} diperbarui.");
})->purpose('Berikan atau cabut peran dashboard untuk akun yang sudah ada');
