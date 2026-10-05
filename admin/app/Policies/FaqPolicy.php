<?php

namespace App\Policies;

use App\Models\User;

class FaqPolicy
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

    public function deleteAny(User $user): bool
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
