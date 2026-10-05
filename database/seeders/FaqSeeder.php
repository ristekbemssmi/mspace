<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class FaqSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $faqs = [
            [
                'question' => 'Apa itu BEM dan apa bedanya dengan DPM?',
                'answer' => 'BEM (Badan Eksekutif Mahasiswa) adalah lembaga eksekutif yang menjalankan program kerja dan aspirasi mahasiswa. Sedangkan DPM (Dewan Perwakilan Mahasiswa) adalah lembaga legislatif yang berfungsi mengawasi, membuat regulasi, dan menyalurkan aspirasi ke pihak kampus.',
                'sortOrder' => 1,
            ],
            [
                'question' => 'Bagaimana cara bergabung menjadi pengurus BEM?',
                'answer' => 'Pendaftaran biasanya dibuka melalui "Open Recruitment" (Oprec) di awal periode kepengurusan. Syarat dan link pendaftaran akan diumumkan melalui media sosial resmi kami.',
                'sortOrder' => 2,
            ],
            [
                'question' => 'Apakah mahasiswa baru bisa langsung masuk BEM?',
                'answer' => 'Tentu! Kami biasanya membuka jalur khusus untuk Staf Magang atau pengurus muda agar mahasiswa baru bisa belajar berorganisasi sejak awal.',
                'sortOrder' => 3,
            ],
            [
                'question' => 'Di mana saya bisa melihat information mengenai beasiswa terbaru?',
                'answer' => 'Kami selalu memperbarui information beasiswa melalui kanal media sosial (Instagram/Telegram) dan halaman khusus "Scholarship" di portal resmi kami.',
                'sortOrder' => 4,
            ],
            [
                'question' => 'Bagaimana prosedur pengajuan dispensasi kuliah?',
                'answer' => 'Mahasiswa dapat menghubungi Departemen Dalam Negeri untuk meminta surat pengantar, yang kemudian akan diproses ke pihak dekanat atau bagian akademik fakultas.',
                'sortOrder' => 5,
            ],
            [
                'question' => 'Bagaimana cara menyampaikan keluhan atau aspirasi?',
                'answer' => 'Anda bisa mengisi formulir aspirasi yang tersedia di link bio Instagram kami atau langsung mengirim pesan melalui kanal pengaduan resmi. Identitas pelapor akan kami rahasiakan.',
                'sortOrder' => 6,
            ],
            [
                'question' => 'Di mana saya bisa mengunduh berkas penting (Kalender Akademik, dll)?',
                'answer' => 'Semua berkas publik dapat diakses melalui menu "Download Center" atau "Resource" pada portal website kami.',
                'sortOrder' => 7,
            ],
        ]; 

        foreach ($faqs as $faq) {
            DB::table('faqs')->insert(array_merge($faq, [
                'isActive' => true,
                'createdAt' => now(),
                'updatedAt' => now(),
            ]));
        }
    }
}
