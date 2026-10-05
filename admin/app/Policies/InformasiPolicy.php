<?php

namespace App\Policies;

use App\Models\Informasi;
use App\Models\User;
use App\Support\InformationEditorAccess;

class InformasiPolicy
{
    public function viewAny(User $user): bool
    {
        return $user->hasAdminRole('admin', 'editor', 'viewer');
    }

    public function create(User $user): bool
    {
        return $user->hasAdminRole('admin', 'editor');
    }

    public function updateAny(User $user): bool
    {
        return $user->hasAdminRole('admin', 'editor');
    }

    public function update(User $user, Informasi $information): bool
    {
        return $user->hasAdminRole('admin')
            || ($user->hasAdminRole('editor')
                && InformationEditorAccess::unitId($user) !== null
                && (int) $information->unitId === InformationEditorAccess::unitId($user));
    }

    public function createForUnit(User $user, int $unitId, string $category): bool
    {
        return $user->hasAdminRole('admin')
            || ($user->hasAdminRole('editor')
                && InformationEditorAccess::unitId($user) === $unitId
                && in_array($category, InformationEditorAccess::categories($user), true));
    }

    public function deleteAny(User $user): bool
    {
        return $user->hasAdminRole('admin');
    }

    public function delete(User $user, Informasi $information): bool
    {
        return $user->hasAdminRole('admin');
    }

    public function publish(User $user): bool
    {
        return $user->hasAdminRole('admin');
    }

    public function import(User $user): bool
    {
        return $user->hasAdminRole('admin');
    }

    public function export(User $user): bool
    {
        return $user->hasAdminRole('admin');
    }
}
