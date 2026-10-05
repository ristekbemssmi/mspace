<?php

namespace App\Support;

use Illuminate\Support\Str;

class AccountUsername
{
    public static function fromEmail(string $email): string
    {
        $base = Str::slug(Str::before($email, '@'));

        return Str::limit($base !== '' ? $base : 'pengguna', 40, '').'-'.Str::lower(Str::random(12));
    }
}
