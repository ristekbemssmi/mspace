<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    private const TABLES = [
        'birdepts' => 'units',
        'prodis' => 'studyPrograms',
        'informasi' => 'information',
        'informasi_beasiswa' => 'scholarships',
        'syarat_beasiswa' => 'scholarshipRequirements',
        'benefit_beasiswa' => 'scholarshipBenefits',
        'informasi_kegiatan' => 'activities',
        'informasi_himpunan' => 'studentAssociations',
        'informasi_wisuda' => 'graduations',
        'informasi_alumni' => 'alumni',
        'informasi_magang' => 'internships',
        'informasi_proker' => 'workPrograms',
        'informasi_prokers' => 'workProgramLinks',
        'informasi_lomba' => 'competitions',
        'informasi_birdepts' => 'informationUnits',
        'informasi_documents' => 'informationDocuments',
        'panitia_proker' => 'workProgramCommittees',
        'users_bem' => 'organizationMembers',
        'users_umum' => 'generalUsers',
        'program_kerjas' => 'featuredPrograms',
        'proker_participants' => 'workProgramParticipants',
        'wisuda_profiles' => 'graduationProfiles',
        'user_roles' => 'userRoles',
        'document_versions' => 'documentVersions',
        'content_revisions' => 'contentRevisions',
        'audit_events' => 'auditEvents',
    ];

    private const COLUMNS = [
        'idbirdept' => 'unitId', 'iduser' => 'userId', 'id_beasiswa' => 'scholarshipId',
        'id_proker' => 'workProgramId', 'informasi_id' => 'informationId',
        'birdept_id' => 'unitId', 'user_id' => 'userId', 'role_id' => 'roleId',
        'person_id' => 'personId', 'prodi_id' => 'studyProgramId',
        'document_id' => 'documentId', 'actor_user_id' => 'actorUserId',
        'nama_birdept' => 'name', 'nama_panggilan' => 'abbreviation',
        'nama' => 'name', 'singkatan' => 'abbreviation', 'jenis' => 'type',
        'judul' => 'title', 'deskripsi' => 'description', 'sumber' => 'source',
        'jumlah_kunjungan' => 'viewCount', 'waktu_publikasi' => 'publishedAt',
        'jenis_informasi' => 'category', 'tanggal_kadaluarsa' => 'expiresAt',
        'penyelenggara' => 'organizer', 'tanggal_buka' => 'opensOn',
        'tanggal_tutup' => 'closesOn', 'link_poster' => 'posterUrl',
        'link_instagram' => 'instagramUrl', 'link_pendaftaran' => 'registrationUrl',
        'nama_syarat' => 'requirement', 'nama_benefit' => 'benefit',
        'keterangan' => 'description', 'sort_order' => 'sortOrder',
        'waktu_pelaksanaan' => 'eventAt', 'lokasi' => 'location',
        'nama_himpunan' => 'name', 'kontak_person' => 'contact',
        'periode_wisuda' => 'graduationPeriod', 'alur_pendaftaran' => 'registrationSteps',
        'nama_alumni' => 'name', 'angkatan' => 'cohort', 'topik_sharing' => 'topic',
        'perusahaan' => 'company', 'posisi' => 'position', 'durasi' => 'duration',
        'tujuan' => 'purpose', 'sasaran' => 'audience',
        'waktu_mulai' => 'startsOn', 'waktu_selesai' => 'endsOn',
        'penanggung_jawab' => 'personInCharge', 'link_detail' => 'detailUrl',
        'jabatan' => 'position', 'divisi' => 'division',
        'pertanyaan' => 'question', 'jawaban' => 'answer', 'urutan' => 'sortOrder',
        'is_active' => 'isActive', 'gambar' => 'imageUrl', 'kategori' => 'category',
        'telepon' => 'phone', 'prodi' => 'studyProgram', 'nim' => 'studentNumber',
        'login_terakhir' => 'lastLoginAt', 'account_status' => 'accountStatus',
        'disabled_at' => 'disabledAt', 'admin_role' => 'adminRole',
        'display_name' => 'displayName', 'started_on' => 'startsOn',
        'ended_on' => 'endsOn', 'publication_consent_at' => 'publicationConsentAt',
        'created_by' => 'createdBy', 'updated_by' => 'updatedBy',
        'published_by' => 'publishedBy', 'changed_by' => 'changedBy',
        'uploaded_by' => 'uploadedBy', 'retention_until' => 'retentionUntil',
        'storage_key' => 'storageKey', 'original_name' => 'originalName',
        'mime_type' => 'mimeType', 'size_bytes' => 'sizeBytes',
        'change_reason' => 'changeReason', 'safe_snapshot' => 'safeSnapshot',
        'entity_type' => 'entityType', 'entity_id' => 'entityId',
        'request_id' => 'requestId', 'safe_metadata' => 'safeMetadata',
        'occurred_at' => 'occurredAt',
        'created_at' => 'createdAt', 'updated_at' => 'updatedAt',
        'deleted_at' => 'deletedAt',
    ];

    public function up(): void
    {
        foreach (self::TABLES as $old => $new) {
            if (Schema::hasTable($old) && ! Schema::hasTable($new)) {
                Schema::rename($old, $new);
            }
        }

        $tables = array_merge(['users', 'faqs', 'people', 'roles', 'memberships', 'documents'], array_values(self::TABLES));
        foreach ($tables as $table) {
            if (! Schema::hasTable($table)) {
                continue;
            }
            foreach (self::COLUMNS as $old => $new) {
                if (Schema::hasColumn($table, $old) && ! Schema::hasColumn($table, $new)) {
                    Schema::table($table, fn (Blueprint $blueprint) => $blueprint->renameColumn($old, $new));
                }
            }
        }

        if (Schema::hasTable('information') && ! Schema::hasColumn('information', 'deletedAt')) {
            Schema::table('information', fn (Blueprint $blueprint) => $blueprint->softDeletes('deletedAt'));
        }
    }

    public function down(): void
    {
        throw new RuntimeException('Restore a verified database backup to reverse the domain schema rename.');
    }
};
