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
        Schema::create('users', function (Blueprint $table) {
            $table->id();
            $table->string('username')->unique();
            $table->string('password');
            $table->string('email')->unique();
            $table->string('telepon')->nullable();
            $table->string('name');
            $table->string('nim')->unique();
            $table->enum('prodi', [
                'Statistika dan Sains Data',
                'Matematika',
                'Aktuaria',
                'Ilmu Komputer',
                'Kecerdasan Buatan'
            ])->nullable();
            $table->timestamp('login_terakhir')->nullable();
            $table->rememberToken();
            $table->timestamps();
        });

        Schema::create('users_bem', function (Blueprint $table) {
            $table->foreignId('id')->primary()->references('id')->on('users')->onDelete('cascade');
            $table->foreignId('idbirdept')->references('idbirdept')->on('birdepts');
            $table->string('jabatan');
        });

        Schema::create('users_umum', function (Blueprint $table) {
            $table->foreignId('id')->primary()->references('id')->on('users')->onDelete('cascade');
            // Tambahan atribut spesifik user umum jika ada
        });

        Schema::create('password_reset_tokens', function (Blueprint $table) {
            $table->string('email')->index();
            $table->string('token');
            $table->timestamp('created_at')->nullable();
        });

        Schema::create('sessions', function (Blueprint $table) {
            $table->string('id')->primary();
            $table->foreignId('user_id')->nullable()->index();
            $table->string('ip_address', 45)->nullable();
            $table->text('user_agent')->nullable();
            $table->text('payload');
            $table->integer('last_activity')->index();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('users_umum');
        Schema::dropIfExists('users_bem');
        Schema::dropIfExists('sessions');
        Schema::dropIfExists('password_reset_tokens');
        Schema::dropIfExists('users');
    }
};
