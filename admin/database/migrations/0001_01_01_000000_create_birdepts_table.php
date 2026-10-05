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
            $table->text('nama_panggilan');
            $table->enum('jenis', ['bph', 'biro', 'departemen']);
            $table->text('deskripsi')->nullable();
            $table->string('instagram')->nullable();
            $table->timestamps();
        });

    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
            Schema::dropIfExists('birdepts');
    }
};
