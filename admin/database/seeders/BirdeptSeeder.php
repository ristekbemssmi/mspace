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

        DB::table('units')->insert([
            [
                'name' => 'Badan Pengurus Harian',
                'abbreviation'=> 'BPH',
                'type' => 'bph', 
                'description' => 'Badan Pengurus Harian berperan sebagai badan inti atau eksekutif tertinggi yang bertanggung jawab atas pengelolaan BEM SSMI sehari-hari. BPH bertindak sebagai penggerak utama, pengarah, dan penanggung jawab tertinggi dalam bidang administratif maupun operasional.',
                'instagram' => '@bemssmi_bph',
                'createdAt' => now(),
                'updatedAt' => now(),
            ],
            [
                'name' => 'Eksternal, Bisnis, dan Kemitraan',
                'abbreviation'=> 'Eksmit', 
                'type' => 'biro', 
                'description' => 'Biro Eksternal, Bisnis, dan Kemitraan BEM SSMI berperan dalampengelolaan BEM untuk membangun kerja sama eksternal, mengelolakemitraan, serta mengembangkan potensi bisnis dan sirkulasi keuanganBEM. Biro ini memiliki fokus utama untuk menjaga citra positif BEM sekaligus membuka peluang kolaborasi yang mengelola keberlangsungan serta kemajuan BEM SSMI.',
                'instagram' => null,
                'createdAt' => now(),
                'updatedAt' => now(),
            ],
            [
                'name' => 'Internal dan Pengembangan', 
                'abbreviation'=> 'Imbang',
                'type' => 'biro', 
                'description' => 'Biro Internal dan Pengembangan BEM SSMI berperan dalam pengelolaan kualitas fungsionaris dan stabilitas internal BEM. Biro ini memiliki fokus utama dalam pemantauan kinerja fungsionaris, pemfasilitasan pengembangan soft skill maupun hard skill fungsionaris, serta menciptakan lingkungan kerja yang terukur dan berkelanjutan.',
                'instagram' => null,
                'createdAt' => now(),
                'updatedAt' => now(),
            ],
            [
                'name' => 'Media Branding',
                'abbreviation'=> 'Medbrand',
                'type' => 'biro', 
                'description' => 'Biro Media Branding BEM SSMI berperan dalam pengelolaan citra dan identitas visual BEM ke khalayak umum sebagai bentuk peningkatan kredibilitas. Biro ini memiliki fokus utama dalam perantara komunikasi antara BEM dengan KM SSMI melalui pemanfataan media kreatif berisikan information yang relevan dan akurat.',
                'instagram' => '@medbrandnyasesemi',
                'createdAt' => now(),
                'updatedAt' => now(),
            ],
            [
                'name' => 'Riset dan Teknologi',
                'abbreviation'=> 'Rizztek',
                'type' => 'biro',
                'description' => 'Biro Riset dan Teknologi BEM SSMI berperan dalam pengelolaan BEM melalui pengumpulan data yang akurat, analisis kebutuhan, serta pemanfaatan teknologi untuk memperkuat tata kelola yang progresif dan efisien. Biro ini memiliki fokus utama dalam penyediaan inovasi digital dan source information yang akurat guna meningkatkan kualitas layanan BEM kepada KM SSMI.',
                'instagram' => '@rizzteknologia',
                'createdAt' => now(),
                'updatedAt' => now(),
            ],
            [
                'name' => 'Advokasi dan Kesejahteraan Mahasiswa',
                'abbreviation'=> 'Adkesmah',
                'type' => 'departemen', 
                'description' => 'Departemen Advokasi dan Kesejahteraan Mahasiswa BEM SSMI berperan dalam peningkatan kesejahteraan mahasiswa melalui pendampingan isu kesehatan mental, dukungan finansial, sedta layanan advokasi yang responsif dan berorientasi pada kebutuhan KM. Departemen ini memiliki fokus utama dalam peran pelindungan dan pendampingan KM untuk menciptakan lingkungan yang kondusif dan suportif.',
                'instagram' => null,
                'createdAt' => now(),
                'updatedAt' => now(),
            ],
            [
                'name' => 'Akademik dan Prestasi',
                'abbreviation'=> 'Akpres',
                'type' => 'departemen', 
                'description' => 'Departemen Akademik dan Prestasi BEM SSMI berperan dalam peningkatan strategis untuk memotivasi dan memfasilitasi partisipasi KM dalam berbagai ajang kompetisi. Departemen ini memiliki fokus utama dalam peningkatan serta pemberian penghargaan dan apresiasi atas kontribusi serta pencapaian prestasi seluruh sivitas SSMI.',
                'instagram' => null,
                'createdAt' => now(),
                'updatedAt' => now(),
            ],
            [
                'name' => 'Kajian dan Aksi Strategis',
                'abbreviation'=> 'Kastrat',
                'type' => 'departemen', 
                'description' => 'Departemen Kajian dan Aksi Strategis BEM SSMI berperan dalam peningkatan pola berpikir kritis dan wadah dialektika KM. Departemen ini memiliki fokus utama dalam peningkatan kepedulian KM, menganalisis, pendampingan, dan penyikapan terhadap isu-isu politik dan kebijakan publik dalam ranah peran yang relevan dengan SSMI.',
                'instagram' => null,
                'createdAt' => now(),
                'updatedAt' => now(),
            ],
            [
                'name' => 'Olahraga',
                'abbreviation'=> 'Depor',
                'type' => 'departemen', 
                'description' => 'Departemen Olahraga BEM SSMI berperan dalam peningkatan minat dan bakat KM di bidang keolahragaan. Departemen ini memiliki fokus utama dalam pemberian wadah pembinaan, pelatihan, serta fasilitator kegiatan olahraga untuk menumbuhkan semangat kompetisi dan sportivitas di antara KM melalui program yang terstruktur dan berkelanjutan.',
                'instagram' => null,
                'createdAt' => now(),
                'updatedAt' => now(),
            ],
            [
                'name' => 'Pengembangan Sumber Daya Mahasiswa dan Karir',
                'abbreviation'=> 'PSDMK',
                'type' => 'departemen', 
                'description' => 'Departemen Pengembangan Sumber Daya Mahasiswa dan Karir BEM SSMI berperan dalam peningkatan kualitas, pembinaan, dan pengembangan potensi source daya mahasiswa guna menunjang kesiapan KM dalam kehidupan setelah kuliah.',
                'instagram' => null,
                'createdAt' => now(),
                'updatedAt' => now(),
            ],
            [
                'name' => 'Seni Budaya',
                'abbreviation'=> 'Senbud',
                'type' => 'departemen', 
                'description' => 'Departemen Seni Budaya BEM SSMI berperan dalam peningkatan dan pengelolaan potensi serta ekspresi kreatif KM di bidang seni budaya. Departemen ini memiliki fokus utama dalam pemberian wadah pelestarian, apresiasi, dan kreasi karya seni serta budaya KM SSMI ke khalayak umum melalui kegiatan yang edukatif, kolaboratif, dan inovatif.',
                'instagram' => null,
                'createdAt' => now(),
                'updatedAt' => now(),
            ],
            [
                'name' => 'Sosial dan Lingkungan',
                'abbreviation'=> 'Sosling',
                'type' => 'departemen', 
                'description' => 'Departemen Sosial dan Lingkungan berperan dalam perancangan dan pelaksanaan program pemberdayaan masyarakat yang inklusif guna pelestarian lingkungan keberlanjutan. Departemen ini memiliki fokus utama dalam peningkatan kepedulian KM dan pemberian wadah implementasi terhadap isu sosial dan lingkungan.',
                'instagram' => null,
                'createdAt' => now(),
                'updatedAt' => now(),
            ],
        ]);
    }
}
