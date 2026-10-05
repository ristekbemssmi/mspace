<?php

use App\Models\Birdept;
use App\Models\Informasi;
use App\Models\User;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

test('admin upload is converted to WebP and its metadata is saved', function () {
    Storage::fake('informationMedia');
    $admin = User::factory()->create();
    $admin->forceFill(['adminRole' => 'admin'])->save();
    $unit = Birdept::create(['name' => 'Media Branding', 'abbreviation' => 'medbrand', 'type' => 'biro']);

    $this->actingAs($admin)->post(route('admin.informasi.store'), [
        'unitId' => $unit->unitId,
        'title' => 'Kegiatan baru',
        'description' => 'Dokumentasi kegiatan',
        'category' => 'kegiatan',
        'status' => 'draft',
        'images' => [UploadedFile::fake()->image('foto.png', 2000, 1000)],
    ])->assertSessionHasNoErrors();

    $image = Informasi::sole()->images()->sole();
    expect($image->mimeType)->toBe('image/webp')
        ->and($image->width)->toBe(1600)
        ->and($image->height)->toBe(800);
    Storage::disk('informationMedia')->assertExists($image->storagePath);
    $bytes = Storage::disk('informationMedia')->get($image->storagePath);
    expect(substr($bytes, 0, 4))->toBe('RIFF')
        ->and(substr($bytes, 8, 4))->toBe('WEBP');
    $this->get(route('admin.informasi.image', $image->id))->assertOk();

    $this->post(route('admin.informasi.update', $image->informationId), [
        '_method' => 'put',
        'unitId' => $unit->unitId,
        'title' => 'Kegiatan baru',
        'description' => 'Dokumentasi kegiatan',
        'category' => 'kegiatan',
        'status' => 'draft',
        'removeImageIds' => [$image->id],
        'images' => [UploadedFile::fake()->image('pengganti.jpg', 300, 200)],
    ])->assertSessionHasNoErrors();
    expect(Informasi::sole()->images()->count())->toBe(1);
    Storage::disk('informationMedia')->assertMissing($image->storagePath);
});

test('unauthorized accounts cannot upload or view draft documentation', function () {
    Storage::fake('informationMedia');
    $user = User::factory()->create();
    $unit = Birdept::create(['name' => 'Media Branding', 'abbreviation' => 'medbrand', 'type' => 'biro']);
    $this->actingAs($user)->post(route('admin.informasi.store'), [
        'unitId' => $unit->unitId, 'title' => 'Ditolak', 'description' => 'Isi',
        'category' => 'kegiatan', 'status' => 'draft',
        'images' => [UploadedFile::fake()->image('foto.png')],
    ])->assertForbidden();
    expect(Informasi::count())->toBe(0);
});

test('server upload limit shows a useful image error', function () {
    $admin = User::factory()->create();
    $admin->forceFill(['adminRole' => 'admin'])->save();
    $unit = Birdept::create(['name' => 'Media Branding', 'abbreviation' => 'medbrand', 'type' => 'biro']);
    $failedUpload = new UploadedFile(__FILE__, 'large.jpg', 'image/jpeg', UPLOAD_ERR_INI_SIZE, true);

    $this->actingAs($admin)->post(route('admin.informasi.store'), [
        'unitId' => $unit->unitId,
        'title' => 'Gambar terlalu besar',
        'description' => 'Dokumentasi',
        'category' => 'kegiatan',
        'status' => 'draft',
        'images' => [$failedUpload],
    ])->assertSessionHasErrors(['images.0' => 'Gambar gagal diunggah karena melebihi batas server. Pilih kembali melalui Tambahkan gambar agar dikompresi otomatis.']);
});
