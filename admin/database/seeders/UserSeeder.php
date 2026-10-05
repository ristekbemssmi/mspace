<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Content fixture only. No account seeded here can access the dashboard.
        User::firstOrCreate(
            ['username' => 'content-seed'],
            [
                'name' => 'Content Fixture',
                'email' => 'content-seed@example.invalid',
                'password' => Hash::make(Str::random(64)),
                'studentNumber' => 'S000000001',
            ]
        );
    }
}
