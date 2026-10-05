<?php

namespace App\Support;

use App\Models\User;

class InformationEditorAccess
{
    private const CATEGORIES_BY_UNIT = [
        'adkesmah' => ['beasiswa'],
        'psdmk' => ['wisuda', 'alumni', 'magang'],
        'akpres' => ['lomba'],
    ];

    public static function categories(User $user): array
    {
        if (! $user->hasAdminRole('editor')) {
            return [];
        }

        $abbreviation = strtolower(trim((string) $user->userBem?->birdept?->abbreviation));
        if ($abbreviation === '') {
            return [];
        }

        return array_merge(['kegiatan', 'proker'], self::CATEGORIES_BY_UNIT[$abbreviation] ?? []);
    }

    public static function unitId(User $user): ?int
    {
        return $user->userBem?->unitId ? (int) $user->userBem->unitId : null;
    }
}
