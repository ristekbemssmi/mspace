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
            'nim' => 'M0403241057',
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        DB::table('users_bem')->insert([
            'id' => $userId,
            'idbirdept' => 5,
            'jabatan' => 'Staff',
        ]);
    }
}
