<?php

namespace App\Services;

use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class ErdBackfillService
{
    /** @return array<string, int> */
    public function run(): array
    {
        return DB::transaction(function (): array {
            $counts = ['studyPrograms' => 0, 'people' => 0, 'memberships' => 0, 'slugs' => 0, 'revisions' => 0, 'participants' => 0];
            $now = now();

            foreach (['Statistika dan Sains Data', 'Matematika', 'Aktuaria', 'Ilmu Komputer', 'Kecerdasan Buatan'] as $name) {
                $counts['studyPrograms'] += DB::table('studyprograms')->insertOrIgnore(['name' => $name, 'createdAt' => $now, 'updatedAt' => $now]);
            }

            foreach (DB::table('users')->whereNotNull('studyProgram')->get(['id', 'studyProgram']) as $user) {
                $studyProgram = DB::table('studyprograms')->where('name', $user->studyProgram)->first(['id']);
                if ($studyProgram !== null) {
                    DB::table('users')->where('id', $user->id)->update(['studyProgramId' => $studyProgram->id]);
                }
            }

            foreach (['admin' => 'Administrator', 'editor' => 'Editor', 'viewer' => 'Pembaca'] as $code => $name) {
                DB::table('roles')->insertOrIgnore(['code' => $code, 'name' => $name, 'createdAt' => $now, 'updatedAt' => $now]);
            }

            $peopleUsers = DB::table('users')
                ->whereIn('id', DB::table('organizationmembers')->select('id'))
                ->orWhereIn('id', DB::table('workprogramcommittees')->select('userId'))
                ->get(['id', 'name', 'personId']);

            foreach ($peopleUsers as $user) {
                if ($user->personId !== null) {
                    continue;
                }

                $personId = DB::table('people')->insertGetId([
                    'displayName' => $user->name,
                    'createdAt' => $now,
                    'updatedAt' => $now,
                ]);
                DB::table('users')->where('id', $user->id)->whereNull('personId')->update(['personId' => $personId]);
                $counts['people']++;
            }

            foreach (DB::table('organizationmembers')->join('users', 'users.id', '=', 'organizationmembers.id')->get(['users.personId', 'organizationmembers.unitId', 'organizationmembers.position']) as $member) {
                if ($member->personId === null) {
                    continue;
                }

                $exists = DB::table('memberships')
                    ->where('personId', $member->personId)
                    ->where('unitId', $member->unitId)
                    ->where('position', $member->position)
                    ->whereNull('endsOn')
                    ->exists();
                if (! $exists) {
                    DB::table('memberships')->insert([
                        'personId' => $member->personId,
                        'unitId' => $member->unitId,
                        'position' => $member->position,
                        'createdAt' => $now,
                        'updatedAt' => $now,
                    ]);
                    $counts['memberships']++;
                }
            }

            foreach (DB::table('information')->whereNull('slug')->get(['id', 'title']) as $info) {
                $base = Str::slug($info->title);
                $slug = Str::limit($base !== '' ? $base : 'information', 190, '').'-'.$info->id;
                DB::table('information')->where('id', $info->id)->update(['slug' => $slug]);
                $counts['slugs']++;
            }

            foreach (DB::table('information')->get(['id', 'title', 'description', 'source', 'status', 'category', 'unitId', 'publishedAt', 'expiresAt']) as $info) {
                if (DB::table('contentrevisions')->where('informationId', $info->id)->where('version', 1)->exists()) {
                    continue;
                }

                DB::table('contentrevisions')->insert([
                    'informationId' => $info->id,
                    'version' => 1,
                    'changedBy' => null,
                    'changeReason' => 'Baseline dari data sebelum ERD v2; riwayat perubahan sebelumnya tidak tersedia',
                    'safeSnapshot' => json_encode([
                        'title' => $info->title,
                        'description' => $info->description,
                        'source' => $info->source,
                        'status' => $info->status,
                        'category' => $info->category,
                        'unitId' => $info->unitId,
                        'publishedAt' => $info->publishedAt,
                        'expiresAt' => $info->expiresAt,
                    ], JSON_THROW_ON_ERROR),
                    'createdAt' => $now,
                ]);
                $counts['revisions']++;
            }

            foreach (DB::table('workprogramcommittees')->join('users', 'users.id', '=', 'workprogramcommittees.userId')->get(['workprogramcommittees.workProgramId', 'workprogramcommittees.position', 'workprogramcommittees.division', 'users.personId']) as $participant) {
                if ($participant->personId === null || DB::table('workprogramparticipants')->where('informationId', $participant->workProgramId)->where('personId', $participant->personId)->exists()) {
                    continue;
                }

                DB::table('workprogramparticipants')->insert([
                    'informationId' => $participant->workProgramId,
                    'personId' => $participant->personId,
                    'position' => $participant->position,
                    'division' => $participant->division,
                    'createdAt' => $now,
                    'updatedAt' => $now,
                ]);
                $counts['participants']++;
            }

            return $counts;
        });
    }
}
