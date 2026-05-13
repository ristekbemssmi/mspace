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
        $beasiswaId = DB::table('informasi')->insertGetId([
            'idbirdept' => 7, // Akpres
            'iduser' => 1,
            'judul' => 'Beasiswa Djarum Plus 2026',
            'deskripsi' => 'Beasiswa Djarum Plus merupakan beasiswa prestasi yang memberikan pembekalan soft skills bagi mahasiswa berprestasi di Indonesia.',
            'sumber' => 'djarumbeasiswa-plus.org',
            'status' => 'published',
            'jumlah_kunjungan' => 150,
            'waktu_publikasi' => now(),
            'jenis_informasi' => 'beasiswa',
            'tanggal_kadaluarsa' => now()->addMonths(2),
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        DB::table('informasi_beasiswa')->insert([
            'id' => $beasiswaId,
            'penyelenggara' => 'Djarum Foundation',
            'tanggal_buka' => '2026-05-01',
            'tanggal_tutup' => '2026-06-30',
            'link_poster' => '/img/poster-djarum.jpg',
            'link_instagram' => 'https://instagram.com/djarumbeasiswaplus',
            'link_pendaftaran' => 'https://register.djarumbeasiswaplus.org',
        ]);

        DB::table('syarat_beasiswa')->insert([
            ['id_beasiswa' => $beasiswaId, 'nama_syarat' => 'IPK', 'keterangan' => 'Minimal 3.20 pada semester 4'],
            ['id_beasiswa' => $beasiswaId, 'nama_syarat' => 'Organisasi', 'keterangan' => 'Aktif berorganisasi di dalam maupun luar kampus'],
            ['id_beasiswa' => $beasiswaId, 'nama_syarat' => 'Status', 'keterangan' => 'Sedang menempuh pendidikan S1/D4'],
        ]);

        DB::table('benefit_beasiswa')->insert([
            ['id_beasiswa' => $beasiswaId, 'nama_benefit' => 'Dana Beasiswa', 'keterangan' => 'Rp 1.000.000 setiap bulan selama 1 tahun'],
            ['id_beasiswa' => $beasiswaId, 'nama_benefit' => 'Character Building', 'keterangan' => 'Pelatihan pembentukan karakter'],
            ['id_beasiswa' => $beasiswaId, 'nama_benefit' => 'Leadership Development', 'keterangan' => 'Pelatihan kepemimpinan'],
        ]);

        // 2. Proker: M Care
        $prokerId1 = DB::table('informasi')->insertGetId([
            'idbirdept' => 12, // Sosling
            'iduser' => 1,
            'judul' => 'M Care: Bakti Sosial KM SSMI',
            'deskripsi' => 'Program kerja yang berfokus pada aksi sosial dan kepedulian terhadap masyarakat sekitar kampus SSMI.',
            'sumber' => 'Internal BEM SSMI',
            'status' => 'published',
            'jumlah_kunjungan' => 85,
            'waktu_publikasi' => now()->subDays(5),
            'jenis_informasi' => 'proker',
            'tanggal_kadaluarsa' => now()->addDays(15),
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        DB::table('informasi_proker')->insert([
            'id' => $prokerId1,
            'tujuan' => 'Meningkatkan kepedulian sosial mahasiswa',
            'sasaran' => 'Masyarakat sekitar dan panti asuhan',
            'waktu_mulai' => '2026-07-10',
            'waktu_selesai' => '2026-07-12',
        ]);

        // 3. Proker: MISSION 2.0
        $prokerId2 = DB::table('informasi')->insertGetId([
            'idbirdept' => 5, // Rizztek
            'iduser' => 1,
            'judul' => 'Dirgahayu SSMI 2026: Semangat Baru!',
            'deskripsi' => 'Inovasi digital untuk mempermudah pelayanan mahasiswa SSMI melalui platform terintegrasi MISSION 2.0.',
            'sumber' => 'Internal BEM SSMI',
            'status' => 'published',
            'jumlah_kunjungan' => 200,
            'waktu_publikasi' => now()->subDays(19),
            'jenis_informasi' => 'proker',
            'tanggal_kadaluarsa' => now()->addMonths(1),
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        DB::table('informasi_proker')->insert([
            'id' => $prokerId2,
            'tujuan' => 'Digitalisasi layanan BEM SSMI',
            'sasaran' => 'Seluruh Keluarga Mahasiswa SSMI',
            'waktu_mulai' => '2026-01-01',
            'waktu_selesai' => '2026-12-31',
        ]);

        // 4. Kegiatan: Web Development Workshop
        $kegiatanId = DB::table('informasi')->insertGetId([
            'idbirdept' => 5, // Rizztek
            'iduser' => 1,
            'judul' => 'Workshop Web Development: React & Laravel',
            'deskripsi' => 'Belajar membuat aplikasi web modern menggunakan React dan Laravel dari dasar hingga deploy.',
            'sumber' => 'Biro Rizztek',
            'status' => 'published',
            'jumlah_kunjungan' => 120,
            'waktu_publikasi' => now()->subDays(2),
            'jenis_informasi' => 'kegiatan',
            'tanggal_kadaluarsa' => now()->addDays(3),
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        DB::table('informasi_kegiatan')->insert([
            'id' => $kegiatanId,
            'waktu_pelaksanaan' => '2026-06-15 09:00:00',
            'lokasi' => 'Aula Gedung C, Kampus SSMI',
            'penyelenggara' => 'Biro Riset dan Teknologi',
        ]);

        // 5. Magang: Magang Bakti BCA
        $magangId = DB::table('informasi')->insertGetId([
            'idbirdept' => 10, // PSDMK
            'iduser' => 1,
            'judul' => 'Magang Bakti BCA 2026',
            'deskripsi' => 'Program magang untuk mahasiswa tingkat akhir yang ingin merasakan pengalaman bekerja di perbankan.',
            'sumber' => 'karir.bca.co.id',
            'status' => 'published',
            'jumlah_kunjungan' => 310,
            'waktu_publikasi' => now()->subDays(10),
            'jenis_informasi' => 'magang',
            'tanggal_kadaluarsa' => now()->addDays(20),
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        DB::table('informasi_magang')->insert([
            'id' => $magangId,
            'perusahaan' => 'PT Bank Central Asia Tbk',
            'posisi' => 'Customer Service / Teller',
            'durasi' => '6 - 12 Bulan',
        ]);
    }
}
