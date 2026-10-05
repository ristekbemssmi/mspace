<?php

namespace App\Models;

use Illuminate\Contracts\Auth\MustVerifyEmail;
use Database\Factories\UserFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Fortify\TwoFactorAuthenticatable;

class User extends Authenticatable implements MustVerifyEmail
{
    public const CREATED_AT = 'createdAt';
    public const UPDATED_AT = 'updatedAt';
    /** @use HasFactory<UserFactory> */
    use HasFactory, Notifiable, TwoFactorAuthenticatable;

    protected $fillable = [
        'username',
        'password',
        'email',
        'phone',
        'name',
        'studentNumber',
        'studyProgram',
        'lastLoginAt',
    ];

    protected $hidden = [
        'password',
        'remember_token',
        'two_factor_secret',
        'two_factor_recovery_codes',
    ];

    public function hasAdminRole(string ...$roles): bool
    {
        return in_array($this->adminRole, $roles, true);
    }

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'lastLoginAt' => 'datetime',
            'password' => 'hashed',
        ];
    }

    public function userBem()
    {
        return $this->hasOne(UserBem::class, 'id', 'id');
    }

    public function userUmum()
    {
        return $this->hasOne(UserUmum::class, 'id', 'id');
    }

    public function information()
    {
        return $this->hasMany(Informasi::class, 'userId', 'id');
    }
}
