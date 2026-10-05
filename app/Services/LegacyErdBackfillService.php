<?php

namespace App\Services;

use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class LegacyErdBackfillService
{
    /** @return array<string, int> */
    public function run(): array
    {
        return DB::transaction(function (): array {
            $counts = ['prodis' => 0, 'people' => 0, 'memberships' => 0, 'slugs' => 0, 'revisions' => 0, 'participants' => 0];
            $now = now();

            foreach (['Statistika dan Sains Data', 'Matematika', 'Aktuaria', 'Ilmu Komputer', 'Kecerdasan Buatan'] as $name) {
                $counts['prodis'] += DB::table('prodis')->insertOrIgnore(['nama' => $name, 'created_at' => $now, 'updated_at' => $now]);
            }

            foreach (DB::table('users')->whereNotNull('prodi')->get(['id', 'prodi']) as $user) {
                $prodi = DB::table('prodis')->where('nama', $user->prodi)->first(['id']);
                if ($prodi !== null) {
                    DB::table('users')->where('id', $user->id)->update(['prodi_id' => $prodi->id]);
                }
            }

            foreach (['admin' => 'Administrator', 'editor' => 'Editor', 'viewer' => 'Pembaca'] as $code => $name) {
                DB::table('roles')->insertOrIgnore(['code' => $code, 'name' => $name, 'created_at' => $now, 'updated_at' => $now]);
            }

            $peopleUsers = DB::table('users')
                ->whereIn('id', DB::table('users_bem')->select('id'))
                ->orWhereIn('id', DB::table('panitia_proker')->select('user_id'))
                ->get(['id', 'name', 'person_id']);

            foreach ($peopleUsers as $user) {
                if ($user->person_id !== null) {
                    continue;
                }

                $personId = DB::table('people')->insertGetId([
                    'display_name' => $user->name,
                    'created_at' => $now,
                    'updated_at' => $now,
                ]);
                DB::table('users')->where('id', $user->id)->whereNull('person_id')->update(['person_id' => $personId]);
                $counts['people']++;
            }

            foreach (DB::table('users_bem')->join('users', 'users.id', '=', 'users_bem.id')->get(['users.person_id', 'users_bem.idbirdept', 'users_bem.jabatan']) as $member) {
                if ($member->person_id === null) {
                    continue;
                }

                $exists = DB::table('memberships')
                    ->where('person_id', $member->person_id)
                    ->where('birdept_id', $member->idbirdept)
                    ->where('position', $member->jabatan)
                    ->whereNull('ended_on')
                    ->exists();
                if (! $exists) {
                    DB::table('memberships')->insert([
                        'person_id' => $member->person_id,
                        'birdept_id' => $member->idbirdept,
                        'position' => $member->jabatan,
                        'created_at' => $now,
                        'updated_at' => $now,
                    ]);
                    $counts['memberships']++;
                }
            }

            foreach (DB::table('informasi')->whereNull('slug')->get(['id', 'judul']) as $info) {
                $base = Str::slug($info->judul);
                $slug = Str::limit($base !== '' ? $base : 'informasi', 190, '').'-'.$info->id;
                DB::table('informasi')->where('id', $info->id)->update(['slug' => $slug]);
                $counts['slugs']++;
            }

            foreach (DB::table('informasi')->get(['id', 'judul', 'deskripsi', 'sumber', 'status', 'jenis_informasi', 'idbirdept', 'waktu_publikasi', 'tanggal_kadaluarsa']) as $info) {
                if (DB::table('content_revisions')->where('informasi_id', $info->id)->where('version', 1)->exists()) {
                    continue;
                }

                DB::table('content_revisions')->insert([
                    'informasi_id' => $info->id,
                    'version' => 1,
                    'changed_by' => null,
                    'change_reason' => 'Baseline dari data sebelum ERD v2; riwayat perubahan sebelumnya tidak tersedia',
                    'safe_snapshot' => json_encode([
                        'judul' => $info->judul,
                        'deskripsi' => $info->deskripsi,
                        'sumber' => $info->sumber,
                        'status' => $info->status,
                        'jenis_informasi' => $info->jenis_informasi,
                        'idbirdept' => $info->idbirdept,
                        'waktu_publikasi' => $info->waktu_publikasi,
                        'tanggal_kadaluarsa' => $info->tanggal_kadaluarsa,
                    ], JSON_THROW_ON_ERROR),
                    'created_at' => $now,
                ]);
                $counts['revisions']++;
            }

            foreach (DB::table('panitia_proker')->join('users', 'users.id', '=', 'panitia_proker.user_id')->get(['panitia_proker.id_proker', 'panitia_proker.jabatan', 'panitia_proker.divisi', 'users.person_id']) as $participant) {
                if ($participant->person_id === null || DB::table('proker_participants')->where('informasi_id', $participant->id_proker)->where('person_id', $participant->person_id)->exists()) {
                    continue;
                }

                DB::table('proker_participants')->insert([
                    'informasi_id' => $participant->id_proker,
                    'person_id' => $participant->person_id,
                    'position' => $participant->jabatan,
                    'division' => $participant->divisi,
                    'created_at' => $now,
                    'updated_at' => $now,
                ]);
                $counts['participants']++;
            }

            return $counts;
        });
    }
}
