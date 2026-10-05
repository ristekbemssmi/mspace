<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // Keep legacy column names while both applications still write to them.
        // Widen lists that change as data instead of freezing them in ENUMs.
        if (DB::getDriverName() === 'mysql') {
            DB::statement('ALTER TABLE birdepts MODIFY nama_birdept VARCHAR(150) NOT NULL, MODIFY nama_panggilan VARCHAR(100) NOT NULL');
            DB::statement('ALTER TABLE users MODIFY prodi VARCHAR(150) NULL');
            DB::statement("ALTER TABLE informasi MODIFY status VARCHAR(20) NOT NULL DEFAULT 'draft', MODIFY jenis_informasi VARCHAR(30) NOT NULL");
        }

        Schema::table('birdepts', function (Blueprint $table): void {
            $table->unique('nama_panggilan', 'birdepts_nama_panggilan_unique');
        });

        Schema::create('prodis', function (Blueprint $table): void {
            $table->id();
            $table->string('nama', 150)->unique();
            $table->string('singkatan', 30)->nullable()->unique();
            $table->timestamps();
        });

        Schema::create('people', function (Blueprint $table): void {
            $table->id();
            $table->string('display_name', 150);
            $table->timestamps();
        });

        Schema::create('roles', function (Blueprint $table): void {
            $table->id();
            $table->string('code', 30)->unique();
            $table->string('name', 100);
            $table->timestamps();
        });

        Schema::table('users', function (Blueprint $table): void {
            $table->foreignId('person_id')->nullable()->unique()->constrained('people')->nullOnDelete();
            $table->foreignId('prodi_id')->nullable()->constrained('prodis')->nullOnDelete();
            $table->string('account_status', 20)->default('active');
            $table->timestamp('disabled_at')->nullable();
        });

        Schema::create('memberships', function (Blueprint $table): void {
            $table->id();
            $table->foreignId('person_id')->constrained('people')->cascadeOnDelete();
            $table->foreignId('birdept_id')->references('idbirdept')->on('birdepts')->restrictOnDelete();
            $table->string('position', 100);
            $table->date('started_on')->nullable();
            $table->date('ended_on')->nullable();
            $table->timestamps();
            $table->index(['birdept_id', 'ended_on']);
        });

        Schema::create('user_roles', function (Blueprint $table): void {
            $table->foreignId('user_id')->constrained('users')->cascadeOnDelete();
            $table->foreignId('role_id')->constrained('roles')->cascadeOnDelete();
            $table->primary(['user_id', 'role_id']);
        });

        Schema::table('informasi', function (Blueprint $table): void {
            $table->string('slug', 210)->nullable()->unique();
            $table->foreignId('updated_by')->nullable()->constrained('users')->nullOnDelete();
            $table->foreignId('published_by')->nullable()->constrained('users')->nullOnDelete();
            $table->softDeletes();
            $table->index(['status', 'waktu_publikasi'], 'informasi_publication_index');
            $table->index(['idbirdept', 'status'], 'informasi_owner_status_index');
            $table->index(['jenis_informasi', 'tanggal_kadaluarsa'], 'informasi_type_expiry_index');
        });

        Schema::table('faqs', function (Blueprint $table): void {
            $table->foreignId('birdept_id')->nullable()->references('idbirdept')->on('birdepts')->nullOnDelete();
            $table->foreignId('created_by')->nullable()->constrained('users')->nullOnDelete();
            $table->foreignId('updated_by')->nullable()->constrained('users')->nullOnDelete();
            $table->index(['is_active', 'urutan']);
        });

        Schema::table('syarat_beasiswa', fn (Blueprint $table) => $table->unsignedInteger('sort_order')->default(0));
        Schema::table('benefit_beasiswa', fn (Blueprint $table) => $table->unsignedInteger('sort_order')->default(0));

        Schema::create('informasi_lomba', function (Blueprint $table): void {
            $table->foreignId('id')->primary()->references('id')->on('informasi')->cascadeOnDelete();
            $table->string('penyelenggara')->nullable();
            $table->string('link_pendaftaran', 2048)->nullable();
            $table->date('tanggal_buka')->nullable();
            $table->date('tanggal_tutup')->nullable();
        });

        Schema::create('informasi_birdepts', function (Blueprint $table): void {
            $table->foreignId('informasi_id')->constrained('informasi')->cascadeOnDelete();
            $table->foreignId('birdept_id')->references('idbirdept')->on('birdepts')->cascadeOnDelete();
            $table->primary(['informasi_id', 'birdept_id']);
        });

        Schema::create('proker_participants', function (Blueprint $table): void {
            $table->id();
            $table->foreignId('informasi_id')->references('id')->on('informasi_proker')->cascadeOnDelete();
            $table->foreignId('person_id')->constrained('people')->restrictOnDelete();
            $table->string('position', 100);
            $table->string('division', 100)->nullable();
            $table->timestamps();
            $table->unique(['informasi_id', 'person_id']);
        });

        Schema::create('wisuda_profiles', function (Blueprint $table): void {
            $table->id();
            $table->foreignId('informasi_id')->references('id')->on('informasi_wisuda')->cascadeOnDelete();
            $table->foreignId('person_id')->nullable()->constrained('people')->nullOnDelete();
            $table->foreignId('prodi_id')->nullable()->constrained('prodis')->nullOnDelete();
            $table->string('display_name', 150);
            $table->decimal('ipk', 3, 2)->nullable();
            $table->unsignedSmallInteger('angkatan')->nullable();
            $table->timestamp('publication_consent_at')->nullable();
            $table->timestamps();
        });

        Schema::create('documents', function (Blueprint $table): void {
            $table->id();
            $table->string('title', 200);
            $table->string('kind', 30);
            $table->string('visibility', 20)->default('private');
            $table->foreignId('created_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamp('retention_until')->nullable();
            $table->timestamps();
        });

        Schema::create('document_versions', function (Blueprint $table): void {
            $table->id();
            $table->foreignId('document_id')->constrained('documents')->cascadeOnDelete();
            $table->unsignedInteger('version');
            $table->string('storage_key', 512);
            $table->string('original_name', 255);
            $table->string('mime_type', 120);
            $table->unsignedBigInteger('size_bytes');
            $table->char('sha256', 64);
            $table->foreignId('uploaded_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamp('created_at')->useCurrent();
            $table->unique(['document_id', 'version']);
            $table->unique('storage_key');
        });

        Schema::create('informasi_documents', function (Blueprint $table): void {
            $table->foreignId('informasi_id')->constrained('informasi')->cascadeOnDelete();
            $table->foreignId('document_id')->constrained('documents')->cascadeOnDelete();
            $table->string('role', 30)->default('attachment');
            $table->unsignedInteger('sort_order')->default(0);
            $table->primary(['informasi_id', 'document_id', 'role'], 'informasi_documents_primary');
        });

        Schema::create('content_revisions', function (Blueprint $table): void {
            $table->id();
            $table->foreignId('informasi_id')->constrained('informasi')->cascadeOnDelete();
            $table->unsignedInteger('version');
            $table->foreignId('changed_by')->nullable()->constrained('users')->nullOnDelete();
            $table->string('change_reason', 200)->nullable();
            $table->json('safe_snapshot');
            $table->timestamp('created_at')->useCurrent();
            $table->unique(['informasi_id', 'version']);
        });

        Schema::create('audit_events', function (Blueprint $table): void {
            $table->id();
            $table->foreignId('actor_user_id')->nullable()->constrained('users')->nullOnDelete();
            $table->string('action', 80);
            $table->string('entity_type', 100)->nullable();
            $table->unsignedBigInteger('entity_id')->nullable();
            $table->string('outcome', 20);
            $table->uuid('request_id')->nullable();
            $table->json('safe_metadata')->nullable();
            $table->timestamp('occurred_at')->useCurrent();
            $table->index(['entity_type', 'entity_id', 'occurred_at']);
            $table->index(['actor_user_id', 'occurred_at']);
        });
    }

    public function down(): void
    {
        throw new RuntimeException('ERD v2 contains migrated data. Restore a verified backup instead of rolling it back.');
    }
};
