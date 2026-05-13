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
                'deskripsi' => 'Badan Pengurus Harian berperan sebagai badan inti atau eksekutif tertinggi yang bertanggung jawab atas pengelolaan BEM SSMI sehari-hari. BPH bertindak sebagai penggerak utama, pengarah, dan penanggung jawab tertinggi dalam bidang administratif maupun operasional.',
                'instagram' => '@bemssmi_bph',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'nama_birdept' => 'Eksternal, Bisnis, dan Kemitraan',
                'nama_panggilan'=> 'Eksmit', 
                'jenis' => 'biro', 
                'deskripsi' => 'Biro Eksternal, Bisnis, dan Kemitraan BEM SSMI berperan dalampengelolaan BEM untuk membangun kerja sama eksternal, mengelolakemitraan, serta mengembangkan potensi bisnis dan sirkulasi keuanganBEM. Biro ini memiliki fokus utama untuk menjaga citra positif BEM sekaligus membuka peluang kolaborasi yang mengelola keberlangsungan serta kemajuan BEM SSMI.',
                'instagram' => null,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'nama_birdept' => 'Internal dan Pengembangan', 
                'nama_panggilan'=> 'Imbang',
                'jenis' => 'biro', 
                'deskripsi' => 'Biro Internal dan Pengembangan BEM SSMI berperan dalam pengelolaan kualitas fungsionaris dan stabilitas internal BEM. Biro ini memiliki fokus utama dalam pemantauan kinerja fungsionaris, pemfasilitasan pengembangan soft skill maupun hard skill fungsionaris, serta menciptakan lingkungan kerja yang terukur dan berkelanjutan.',
                'instagram' => null,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'nama_birdept' => 'Media Branding',
                'nama_panggilan'=> 'Medbrand',
                'jenis' => 'biro', 
                'deskripsi' => 'Biro Media Branding BEM SSMI berperan dalam pengelolaan citra dan identitas visual BEM ke khalayak umum sebagai bentuk peningkatan kredibilitas. Biro ini memiliki fokus utama dalam perantara komunikasi antara BEM dengan KM SSMI melalui pemanfataan media kreatif berisikan informasi yang relevan dan akurat.',
                'instagram' => '@medbrandnyasesemi',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'nama_birdept' => 'Riset dan Teknologi',
                'nama_panggilan'=> 'Rizztek',
                'jenis' => 'biro',
                'deskripsi' => 'Biro Riset dan Teknologi BEM SSMI berperan dalam pengelolaan BEM melalui pengumpulan data yang akurat, analisis kebutuhan, serta pemanfaatan teknologi untuk memperkuat tata kelola yang progresif dan efisien. Biro ini memiliki fokus utama dalam penyediaan inovasi digital dan sumber informasi yang akurat guna meningkatkan kualitas layanan BEM kepada KM SSMI.',
                'instagram' => '@rizzteknologia',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'nama_birdept' => 'Advokasi dan Kesejahteraan Mahasiswa',
                'nama_panggilan'=> 'Adkesmah',
                'jenis' => 'departemen', 
                'deskripsi' => 'Departemen Advokasi dan Kesejahteraan Mahasiswa BEM SSMI berperan dalam peningkatan kesejahteraan mahasiswa melalui pendampingan isu kesehatan mental, dukungan finansial, sedta layanan advokasi yang responsif dan berorientasi pada kebutuhan KM. Departemen ini memiliki fokus utama dalam peran pelindungan dan pendampingan KM untuk menciptakan lingkungan yang kondusif dan suportif.',
                'instagram' => null,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'nama_birdept' => 'Akademik dan Prestasi',
                'nama_panggilan'=> 'Akpres',
                'jenis' => 'departemen', 
                'deskripsi' => 'Departemen Akademik dan Prestasi BEM SSMI berperan dalam peningkatan strategis untuk memotivasi dan memfasilitasi partisipasi KM dalam berbagai ajang kompetisi. Departemen ini memiliki fokus utama dalam peningkatan serta pemberian penghargaan dan apresiasi atas kontribusi serta pencapaian prestasi seluruh sivitas SSMI.',
                'instagram' => null,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'nama_birdept' => 'Kajian dan Aksi Strategis',
                'nama_panggilan'=> 'Kastrat',
                'jenis' => 'departemen', 
                'deskripsi' => 'Departemen Kajian dan Aksi Strategis BEM SSMI berperan dalam peningkatan pola berpikir kritis dan wadah dialektika KM. Departemen ini memiliki fokus utama dalam peningkatan kepedulian KM, menganalisis, pendampingan, dan penyikapan terhadap isu-isu politik dan kebijakan publik dalam ranah peran yang relevan dengan SSMI.',
                'instagram' => null,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'nama_birdept' => 'Olahraga',
                'nama_panggilan'=> 'Depor',
                'jenis' => 'departemen', 
                'deskripsi' => 'Departemen Olahraga BEM SSMI berperan dalam peningkatan minat dan bakat KM di bidang keolahragaan. Departemen ini memiliki fokus utama dalam pemberian wadah pembinaan, pelatihan, serta fasilitator kegiatan olahraga untuk menumbuhkan semangat kompetisi dan sportivitas di antara KM melalui program yang terstruktur dan berkelanjutan.',
                'instagram' => null,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'nama_birdept' => 'Pengembangan Sumber Daya Mahasiswa dan Karir',
                'nama_panggilan'=> 'PSDMK',
                'jenis' => 'departemen', 
                'deskripsi' => 'Departemen Pengembangan Sumber Daya Mahasiswa dan Karir BEM SSMI berperan dalam peningkatan kualitas, pembinaan, dan pengembangan potensi sumber daya mahasiswa guna menunjang kesiapan KM dalam kehidupan setelah kuliah.',
                'instagram' => null,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'nama_birdept' => 'Seni Budaya',
                'nama_panggilan'=> 'Senbud',
                'jenis' => 'departemen', 
                'deskripsi' => 'Departemen Seni Budaya BEM SSMI berperan dalam peningkatan dan pengelolaan potensi serta ekspresi kreatif KM di bidang seni budaya. Departemen ini memiliki fokus utama dalam pemberian wadah pelestarian, apresiasi, dan kreasi karya seni serta budaya KM SSMI ke khalayak umum melalui kegiatan yang edukatif, kolaboratif, dan inovatif.',
                'instagram' => null,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'nama_birdept' => 'Sosial dan Lingkungan',
                'nama_panggilan'=> 'Sosling',
                'jenis' => 'departemen', 
                'deskripsi' => 'Departemen Sosial dan Lingkungan berperan dalam perancangan dan pelaksanaan program pemberdayaan masyarakat yang inklusif guna pelestarian lingkungan keberlanjutan. Departemen ini memiliki fokus utama dalam peningkatan kepedulian KM dan pemberian wadah implementasi terhadap isu sosial dan lingkungan.',
                'instagram' => null,
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);
    }
}
