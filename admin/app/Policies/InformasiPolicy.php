<?php

namespace App\Policies;

use App\Models\User;

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

    public function update(User $user, \App\Models\Informasi $information): bool
    {
        return $user->hasAdminRole('admin')
            || ($user->hasAdminRole('editor') && $information->status === 'draft' && (int) $information->userId === (int) $user->id);
    }

    public function deleteAny(User $user): bool
    {
        return $user->hasAdminRole('admin');
    }

    public function delete(User $user, \App\Models\Informasi $information): bool
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
