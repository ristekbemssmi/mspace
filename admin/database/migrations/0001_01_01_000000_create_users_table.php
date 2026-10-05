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
        // Legacy schema: the newer birdepts/users/informasi migrations own these tables.
        if (Schema::hasTable('birdepts')) {
            return;
        }

        // Tabel Birdept
        Schema::create('birdepts', function (Blueprint $table) {
            $table->id('idbirdept');
            $table->enum('nama_birdept', [
                'Badan Pengurus Harian', 'Eksternal, Bisnis, dan Kemitraan',
                'Internal dan Pengembangan', 'Media Branding', 'Riset dan Teknologi',
                'Advokasi dan Kesejahteraan Mahasiswa', 'Akademik dan Prestasi',
                'Kajian dan Aksi Strategis', 'Olahraga',
                'Pengembangan Sumber Daya Mahasiswa dan Karir', 'Seni Budaya',
                'Sosial dan Lingkungan'
            ]);
            $table->enum('jenis', ['biro', 'departemen']);
            $table->text('deskripsi')->nullable();
            $table->timestamps();
        });

        // Tabel Users
        Schema::create('users', function (Blueprint $table) {
            $table->id('iduser');
            $table->string('username')->unique();
            $table->string('password');
            $table->string('email')->unique();
            $table->string('telepon')->nullable();
            $table->string('nama');
            $table->string('nim')->unique();
            $table->timestamp('login_terakhir')->nullable();
            $table->timestamps();
        });

        // Tabel Anggota BEM
        Schema::create('anggota_bem', function (Blueprint $table) {
            $table->foreignId('aiduser')->primary()->constrained('users', 'iduser')->onDelete('cascade');
            $table->foreignId('idbirdept')->constrained('birdepts', 'idbirdept')->onDelete('cascade');
            $table->string('jabatan');
            $table->timestamps();
        });

        // Tabel Umum
        Schema::create('umum', function (Blueprint $table) {
            $table->foreignId('uiduser')->primary()->constrained('users', 'iduser')->onDelete('cascade');
            $table->timestamps();
        });

        // Tabel Informasi
        Schema::create('informasi', function (Blueprint $table) {
            $table->id();
            $table->foreignId('idbirdept')->constrained('birdepts', 'idbirdept')->onDelete('cascade');
            $table->foreignId('iduser')->constrained('users', 'iduser')->onDelete('cascade'); // Pembuat info
            $table->timestamp('waktu_publikasi');
            $table->string('judul');
            $table->text('deskripsi');
            $table->string('status');
            $table->integer('jumlah_kunjungan')->default(0);
            $table->timestamps();
        });

        // Tabel Beasiswa
        Schema::create('beasiswa', function (Blueprint $table) {
            $table->id();
            $table->foreignId('iduser')->constrained('users', 'iduser')->onDelete('cascade'); // Pembuat info beasiswa
            $table->string('judul');
            $table->text('deskripsi');
            $table->string('sumber');
            $table->date('deadline');
            $table->timestamps();
        });

        // Tabel Proker
        Schema::create('prokers', function (Blueprint $table) {
            $table->id();
            $table->foreignId('idbirdept')->constrained('birdepts', 'idbirdept')->onDelete('cascade');
            // Karena nama kolom 'iduser_pj' tidak standar, kita arahkan ke tabel 'users'
            $table->foreignId('iduser_pj')->constrained('users', 'iduser')->onDelete('cascade');
            $table->text('deskripsi');
            $table->string('dokumentasi')->nullable();
            $table->decimal('anggaran', 15, 2);
            $table->string('lokasi');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // The canonical migrations own rollback of the shared tables.
        return;
        Schema::dropIfExists('users');
        Schema::dropIfExists('password_reset_tokens');
        Schema::dropIfExists('sessions');
    }
};
