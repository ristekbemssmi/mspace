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
            $table->enum('jenis_informasi', ['beasiswa', 'kegiatan', 'himpunan', 'wisuda', 'alumni', 'magang', 'proker']);
            $table->timestamp('tanggal_kadaluarsa')->nullable();
            $table->timestamps();
        });

        Schema::create('informasi_beasiswa', function (Blueprint $table) {
            $table->foreignId('id')->primary()->references('id')->on('informasi')->onDelete('cascade');
            $table->string('penyelenggara')->nullable();
            $table->date('tanggal_buka')->nullable();
            $table->date('tanggal_tutup')->nullable();
            $table->string('link_poster');
            $table->string('link_instagram');
            $table->string('link_pendaftaran')->nullable();
        });

        Schema::create('syarat_beasiswa', function (Blueprint $table) {
            $table->id();
            $table->foreignId('id_beasiswa')->references('id')->on('informasi_beasiswa')->onDelete('cascade');
            $table->string('nama_syarat'); // Contoh: "Minimal IPK", "Semester", "Jurusan", "Lainnya"
            $table->string('keterangan'); // Contoh: "3.00", "Minimal Semester 3", "Ilmu Komputer"
        });

        Schema::create('benefit_beasiswa', function (Blueprint $table) {
            $table->id();
            $table->foreignId('id_beasiswa')->references('id')->on('informasi_beasiswa')->onDelete('cascade');
            $table->string('nama_benefit'); // Contoh: "Uang Saku", "Fasilitas", "Potongan UKT"
            $table->string('keterangan'); // Contoh: "Rp 1.000.000 / bulan", "Laptop Acer", "100%"
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

        // Program Kerja (Proker)
        Schema::create('informasi_proker', function (Blueprint $table) {
            $table->foreignId('id')->primary()->references('id')->on('informasi')->onDelete('cascade');
            $table->string('tujuan')->nullable();
            $table->string('sasaran')->nullable();
            $table->date('waktu_mulai')->nullable();
            $table->date('waktu_selesai')->nullable();
        });

        // Entitas Asosiatif (Pivot) untuk Kepanitiaan Proker
        Schema::create('panitia_proker', function (Blueprint $table) {
            $table->foreignId('id_proker')->references('id')->on('informasi_proker')->onDelete('cascade');
            $table->foreignId('user_id')->references('id')->on('users')->onDelete('cascade');
            $table->string('jabatan'); // Misal: 'Penanggung Jawab', 'Ketua Pelaksana', 'Staff', dsb
            $table->string('divisi')->nullable(); // Misal: 'Acara', 'Humas', null jika PJ
            
            // Composite primary key
            $table->primary(['id_proker', 'user_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('benefit_beasiswa');
        Schema::dropIfExists('syarat_beasiswa');
        Schema::dropIfExists('panitia_proker');
        Schema::dropIfExists('informasi_proker');
        Schema::dropIfExists('informasi_magang');
        Schema::dropIfExists('informasi_alumni');
        Schema::dropIfExists('informasi_wisuda');
        Schema::dropIfExists('informasi_himpunan');
        Schema::dropIfExists('informasi_kegiatan');
        Schema::dropIfExists('informasi_beasiswa');
        Schema::dropIfExists('informasi');
    }
};
