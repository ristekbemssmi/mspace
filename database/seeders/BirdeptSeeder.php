<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class BirdeptSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        //

        DB::table('birdepts')->insert([
            [
                'nama_birdept' => 'Badan Pengurus Harian',
                'nama_panggilan'=> 'BPH',
                'jenis' => 'bph', 
                'deskripsi' => 'Mengurus administrasi',
                'instagram' => '@bemssmi_bph', // Tambahan field jika ingin diisi
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'nama_birdept' => 'Eksternal, Bisnis, dan Kemitraan',
                'nama_panggilan'=> 'Eksmit', 
                'jenis' => 'departemen', 
                'deskripsi' => 'Biro Eksternal, Bisnis, dan Kemitraan BEM SSMI berperan dalam pengelolaan BEM untuk membangun kerja sama eksternal, mengelola kemitraan, serta mengembangkan potensi bisnis dan sirkulasi keuangan BEM.',
                'instagram' => null,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'nama_birdept' => 'Internal dan Pengembangan', 
                'nama_panggilan'=> 'Imbang',
                'jenis' => 'departemen', 
                'deskripsi' => 'Biro Internal dan Pengembangan BEM SSMI berperan dalam pengelolaan kualitas fungsionaris dan stabilitas internal BEM.',
                'instagram' => null,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'nama_birdept' => 'Media Branding',
                'nama_panggilan'=> 'Medbrand',
                'jenis' => 'departemen', 
                'deskripsi' => 'Biro Media Branding BEM SSMI berperan dalam pengelolaan citra dan identitas visual BEM ke khalayak umum.',
                'instagram' => null,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'nama_birdept' => 'Riset dan Teknologi',
                'nama_panggilan'=> 'Rizztekz',
                'jenis' => 'departemen', 
                'deskripsi' => 'Biro Riset dan Teknologi BEM SSMI berperan dalam pengelolaan BEM melalui pengumpulan data yang akurat, analisis kebutuhan, serta pemanfaatan teknologi.',
                'instagram' => null,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'nama_birdept' => 'Advokasi dan Kesejahteraan Mahasiswa',
                'nama_panggilan'=> 'Adkesmah',
                'jenis' => 'departemen', 
                'deskripsi' => 'Departemen Advokasi dan Kesejahteraan Mahasiswa BEM SSMI berperan dalam peningkatan kesejahteraan mahasiswa melalui pendampingan isu kesehatan mental.',
                'instagram' => null,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'nama_birdept' => 'Akademik dan Prestasi',
                'nama_panggilan'=> 'Akpres',
                'jenis' => 'departemen', 
                'deskripsi' => 'Departemen Akademik dan Prestasi BEM SSMI berperan dalam peningkatan strategis untuk memotivasi dan memfasilitasi partisipasi KM.',
                'instagram' => null,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'nama_birdept' => 'Kajian dan Aksi Strategis',
                'nama_panggilan'=> 'Kastrat',
                'jenis' => 'departemen', 
                'deskripsi' => 'Departemen Kajian dan Aksi Strategis BEM SSMI berperan dalam peningkatan pola berpikir kritis dan wadah dialektika KM.',
                'instagram' => null,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'nama_birdept' => 'Olahraga',
                'nama_panggilan'=> 'Depor',
                'jenis' => 'departemen', 
                'deskripsi' => 'Departemen Olahraga BEM SSMI berperan dalam peningkatan minat dan bakat KM di bidang keolahragaan.',
                'instagram' => null,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'nama_birdept' => 'Pengembangan Sumber Daya Mahasiswa dan Karir',
                'nama_panggilan'=> 'PSDMK',
                'jenis' => 'departemen', 
                'deskripsi' => 'Departemen Pengembangan Sumber Daya Mahasiswa dan Karir BEM SSMI berperan dalam peningkatan kualitas, pembinaan, dan pengembangan potensi sumber daya mahasiswa.',
                'instagram' => null,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'nama_birdept' => 'Seni Budaya',
                'nama_panggilan'=> 'Senbud',
                'jenis' => 'departemen', 
                'deskripsi' => 'Departemen Seni Budaya BEM SSMI berperan dalam peningkatan dan pengelolaan potensi serta ekspresi kreatif KM di bidang seni budaya.',
                'instagram' => null,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'nama_birdept' => 'Sosial dan Lingkungan',
                'nama_panggilan'=> 'Sosling',
                'jenis' => 'departemen', 
                'deskripsi' => 'Departemen Sosial dan Lingkungan berperan dalam perancangan dan pelaksanaan program pemberdayaan masyarakat.',
                'instagram' => null,
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);
    }
}
