<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('informasi', function (Blueprint $table) {
            $table->id();
            $table->foreignId('idbirdept')->references('idbirdept')->on('birdepts');
            $table->foreignId('iduser')->references('id')->on('users');
            $table->string('judul');
            $table->text('deskripsi');
            $table->string('sumber')->nullable();
            $table->enum('status', ['draft', 'published', 'archived'])->default('draft');
            $table->integer('jumlah_kunjungan')->default(0);
            $table->timestamp('waktu_publikasi')->nullable();
            $table->timestamps();
        });

        Schema::create('informasi_beasiswa', function (Blueprint $table) {
            $table->foreignId('id')->primary()->references('id')->on('informasi')->onDelete('cascade');
            $table->string('penyelenggara');
            $table->date('deadline');
            $table->string('link_pendaftaran')->nullable();
        });

        // Kegiatan
        Schema::create('informasi_kegiatan', function (Blueprint $table) {
            $table->foreignId('id')->primary()->references('id')->on('informasi')->onDelete('cascade');
            $table->dateTime('waktu_pelaksanaan');
            $table->string('lokasi');
            $table->string('penyelenggara');
        });

        // Himpunan
        Schema::create('informasi_himpunan', function (Blueprint $table) {
            $table->foreignId('id')->primary()->references('id')->on('informasi')->onDelete('cascade');
            $table->string('nama_himpunan');
            $table->string('kontak_person');
        });

        // Wisuda
        Schema::create('informasi_wisuda', function (Blueprint $table) {
            $table->foreignId('id')->primary()->references('id')->on('informasi')->onDelete('cascade');
            $table->string('periode_wisuda');
            $table->text('alur_pendaftaran');
        });

        // Alumni
        Schema::create('informasi_alumni', function (Blueprint $table) {
            $table->foreignId('id')->primary()->references('id')->on('informasi')->onDelete('cascade');
            $table->string('nama_alumni');
            $table->string('angkatan');
            $table->string('topik_sharing'); // Misal: Karir di Tech
        });

        // Magang
        Schema::create('informasi_magang', function (Blueprint $table) {
            $table->foreignId('id')->primary()->references('id')->on('informasi')->onDelete('cascade');
            $table->string('perusahaan');
            $table->string('posisi');
            $table->string('durasi');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('informasi');
        Schema::dropIfExists('informasi_beasiswa');
        Schema::dropIfExists('informasi_kegiatan');
        Schema::dropIfExists('informasi_himpunan');
        Schema::dropIfExists('informasi_wisuda');
        Schema::dropIfExists('informasi_alumni');
        Schema::dropIfExists('informasi_magang');
    }
};
