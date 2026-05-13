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
            throw new \Exception('Seeding failed: Please ensure birdepts and users tables have at least one record.');
        }

        // Clear existing data
        \DB::statement('SET FOREIGN_KEY_CHECKS=0;');
        \App\Models\InformasiProker::truncate();
        \DB::table('panitia_proker')->truncate();
        \App\Models\Informasi::where('jenis_informasi', 'proker')->delete();
        \DB::statement('SET FOREIGN_KEY_CHECKS=1;');

        $prokers = [
            ['nama' => 'M Care', 'desc' => 'Program kerja yang berfokus pada kesejahteraan dan kepedulian antar sesama mahasiswa SSMI.'],
            ['nama' => 'MISSION 2.0', 'desc' => 'Inisiatif strategis untuk meningkatkan kapasitas intelektual dan profesionalisme mahasiswa.'],
            ['nama' => 'Mignight', 'desc' => 'Malam apresiasi dan keakraban bagi seluruh civitas akademika SSMI.'],
            ['nama' => 'SPECTRA', 'desc' => 'Ajang unjuk bakat dan kreativitas dalam berbagai bidang minat mahasiswa.'],
            ['nama' => 'Pojok Seni', 'desc' => 'Wadah bagi mahasiswa untuk mengekspresikan karya seni dan kreativitas visual.'],
            ['nama' => 'Tekno Karsa 2.0', 'desc' => 'Pengembangan inovasi teknologi tepat guna untuk menjawab tantangan masyarakat.'],
        ];

        foreach ($prokers as $p) {
            $informasi = \App\Models\Informasi::create([
                'idbirdept' => $birdept->idbirdept,
                'iduser' => $user->id,
                'judul' => $p['nama'],
                'deskripsi' => $p['desc'],
                'status' => 'published',
                'jenis_informasi' => 'proker',
                'waktu_publikasi' => now(),
            ]);

            \App\Models\InformasiProker::create([
                'id' => $informasi->id,
                'tujuan' => 'Meningkatkan solidaritas mahasiswa',
                'sasaran' => 'Seluruh Mahasiswa SSMI',
                'waktu_mulai' => now(),
                'waktu_selesai' => now()->addDays(7),
            ]);

            // Add sample committee
            \DB::table('panitia_proker')->insert([
                'id_proker' => $informasi->id,
                'user_id' => $user->id,
                'jabatan' => 'Penanggung Jawab',
                'divisi' => null,
            ]);
        }
    }
}
