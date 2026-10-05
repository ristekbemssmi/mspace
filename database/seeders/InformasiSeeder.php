<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class InformasiSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // 1. Beasiswa Djarum Plus
        $beasiswaId = DB::table('information')->insertGetId([
            'unitId' => 7, // Akpres
            'userId' => 1,
            'title' => 'Beasiswa Djarum Plus 2026',
            'description' => 'Beasiswa Djarum Plus merupakan beasiswa prestasi yang memberikan pembekalan soft skills bagi mahasiswa berprestasi di Indonesia.',
            'source' => 'djarumbeasiswa-plus.org',
            'status' => 'published',
            'viewCount' => 150,
            'publishedAt' => now(),
            'category' => 'beasiswa',
            'expiresAt' => now()->addMonths(2),
            'createdAt' => now(),
            'updatedAt' => now(),
        ]);

        DB::table('scholarships')->insert([
            'id' => $beasiswaId,
            'organizer' => 'Djarum Foundation',
            'opensOn' => '2026-05-01',
            'closesOn' => '2026-06-30',
            'posterUrl' => '/img/poster-djarum.jpg',
            'instagramUrl' => 'https://instagram.com/djarumbeasiswaplus',
            'registrationUrl' => 'https://register.djarumbeasiswaplus.org',
        ]);

        DB::table('scholarshipRequirements')->insert([
            ['scholarshipId' => $beasiswaId, 'requirement' => 'IPK', 'description' => 'Minimal 3.20 pada semester 4'],
            ['scholarshipId' => $beasiswaId, 'requirement' => 'Organisasi', 'description' => 'Aktif berorganisasi di dalam maupun luar kampus'],
            ['scholarshipId' => $beasiswaId, 'requirement' => 'Status', 'description' => 'Sedang menempuh pendidikan S1/D4'],
        ]);

        DB::table('scholarshipBenefits')->insert([
            ['scholarshipId' => $beasiswaId, 'benefit' => 'Dana Beasiswa', 'description' => 'Rp 1.000.000 setiap bulan selama 1 tahun'],
            ['scholarshipId' => $beasiswaId, 'benefit' => 'Character Building', 'description' => 'Pelatihan pembentukan karakter'],
            ['scholarshipId' => $beasiswaId, 'benefit' => 'Leadership Development', 'description' => 'Pelatihan kepemimpinan'],
        ]);

        // 2. Proker: M Care
        $prokerId1 = DB::table('information')->insertGetId([
            'unitId' => 12, // Sosling
            'userId' => 1,
            'title' => 'M Care: Bakti Sosial KM SSMI',
            'description' => 'Program kerja yang berfokus pada aksi sosial dan kepedulian terhadap masyarakat sekitar kampus SSMI.',
            'source' => 'Internal BEM SSMI',
            'status' => 'published',
            'viewCount' => 85,
            'publishedAt' => now()->subDays(5),
            'category' => 'proker',
            'expiresAt' => now()->addDays(15),
            'createdAt' => now(),
            'updatedAt' => now(),
        ]);

        DB::table('workPrograms')->insert([
            'id' => $prokerId1,
            'purpose' => 'Meningkatkan kepedulian sosial mahasiswa',
            'audience' => 'Masyarakat sekitar dan panti asuhan',
            'startsOn' => '2026-07-10',
            'endsOn' => '2026-07-12',
            'priority' => 1,
        ]);

        // 3. Proker: MISSION 2.0
        $prokerId2 = DB::table('information')->insertGetId([
            'unitId' => 5, // Rizztek
            'userId' => 1,
            'title' => 'Dirgahayu SSMI 2026: Semangat Baru!',
            'description' => 'Inovasi digital untuk mempermudah pelayanan mahasiswa SSMI melalui platform terintegrasi MISSION 2.0.',
            'source' => 'Internal BEM SSMI',
            'status' => 'published',
            'viewCount' => 200,
            'publishedAt' => now()->subDays(19),
            'category' => 'proker',
            'expiresAt' => now()->addMonths(1),
            'createdAt' => now(),
            'updatedAt' => now(),
        ]);

        DB::table('workPrograms')->insert([
            'id' => $prokerId2,
            'purpose' => 'Digitalisasi layanan BEM SSMI',
            'audience' => 'Seluruh Keluarga Mahasiswa SSMI',
            'startsOn' => '2026-01-01',
            'endsOn' => '2026-12-31',
            'priority' => 2,
        ]);

        // 4. Kegiatan: Web Development Workshop
        $kegiatanId = DB::table('information')->insertGetId([
            'unitId' => 5, // Rizztek
            'userId' => 1,
            'title' => 'Workshop Web Development: React & Laravel',
            'description' => 'Belajar membuat aplikasi web modern menggunakan React dan Laravel dari dasar hingga deploy.',
            'source' => 'Biro Rizztek',
            'status' => 'published',
            'viewCount' => 120,
            'publishedAt' => now()->subDays(2),
            'category' => 'kegiatan',
            'expiresAt' => now()->addDays(3),
            'createdAt' => now(),
            'updatedAt' => now(),
        ]);

        DB::table('activities')->insert([
            'id' => $kegiatanId,
            'eventAt' => '2026-06-15 09:00:00',
            'location' => 'Aula Gedung C, Kampus SSMI',
            'organizer' => 'Biro Riset dan Teknologi',
        ]);

        // 5. Magang: Magang Bakti BCA
        $magangId = DB::table('information')->insertGetId([
            'unitId' => 10, // PSDMK
            'userId' => 1,
            'title' => 'Magang Bakti BCA 2026',
            'description' => 'Program magang untuk mahasiswa tingkat akhir yang ingin merasakan pengalaman bekerja di perbankan.',
            'source' => 'karir.bca.co.id',
            'status' => 'published',
            'viewCount' => 310,
            'publishedAt' => now()->subDays(10),
            'category' => 'magang',
            'expiresAt' => now()->addDays(20),
            'createdAt' => now(),
            'updatedAt' => now(),
        ]);

        DB::table('internships')->insert([
            'id' => $magangId,
            'company' => 'PT Bank Central Asia Tbk',
            'position' => 'Customer Service / Teller',
            'duration' => '6 - 12 Bulan',
        ]);
    }
}
