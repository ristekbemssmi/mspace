<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Facades\DB;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $userId = DB::table('users')->insertGetId([
            'username' => 'zakwan',
            'password' => bcrypt('zakwan'),
            'email' => 'muhammadzakwansakhiy@gmail.com',
            'name' => 'Zakwan',
            'studentNumber' => 'M0403241057',
            'createdAt' => now(),
            'updatedAt' => now(),
        ]);

        DB::table('organizationMembers')->insert([
            'id' => $userId,
            'unitId' => 5,
            'position' => 'Staff',
        ]);
    }
}
