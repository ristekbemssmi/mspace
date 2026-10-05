<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

use App\Models\ProgramKerja;

class ProgramKerjaSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Get valid Birdept and User
        $birdept = \App\Models\Birdept::first();
        $user = \App\Models\User::first();

        if (!$birdept || !$user) {
            throw new \Exception('Seeding failed: Please ensure units and users tables have at least one record.');
        }

        // Clear existing data
        \DB::statement('SET FOREIGN_KEY_CHECKS=0;');
        \App\Models\InformasiProker::truncate();
        \DB::table('workprogramcommittees')->truncate();
        \App\Models\Informasi::where('category', 'proker')->delete();
        \DB::statement('SET FOREIGN_KEY_CHECKS=1;');

        $prokers = [
            ['name' => 'M Care', 'desc' => 'Program kerja yang berfokus pada kesejahteraan dan kepedulian antar sesama mahasiswa SSMI.'],
            ['name' => 'MISSION 2.0', 'desc' => 'Inisiatif strategis untuk meningkatkan kapasitas intelektual dan profesionalisme mahasiswa.'],
            ['name' => 'Mignight', 'desc' => 'Malam apresiasi dan keakraban bagi seluruh civitas akademika SSMI.'],
            ['name' => 'SPECTRA', 'desc' => 'Ajang unjuk bakat dan kreativitas dalam berbagai bidang minat mahasiswa.'],
            ['name' => 'Pojok Seni', 'desc' => 'Wadah bagi mahasiswa untuk mengekspresikan karya seni dan kreativitas visual.'],
            ['name' => 'Tekno Karsa 2.0', 'desc' => 'Pengembangan inovasi teknologi tepat guna untuk menjawab tantangan masyarakat.'],
        ];

        foreach ($prokers as $index => $p) {
            $information = \App\Models\Informasi::create([
                'unitId' => $birdept->unitId,
                'userId' => $user->id,
                'title' => $p['name'],
                'description' => $p['desc'],
                'status' => 'published',
                'category' => 'proker',
                'publishedAt' => now(),
            ]);

            \App\Models\InformasiProker::create([
                'id' => $information->id,
                'purpose' => 'Meningkatkan solidaritas mahasiswa',
                'audience' => 'Seluruh Mahasiswa SSMI',
                'startsOn' => now(),
                'endsOn' => now()->addDays(7),
                'priority' => $index + 1,
            ]);

            // Add sample committee
            \DB::table('workprogramcommittees')->insert([
                'workProgramId' => $information->id,
                'userId' => $user->id,
                'position' => 'Penanggung Jawab',
                'division' => null,
            ]);
        }
    }
}
