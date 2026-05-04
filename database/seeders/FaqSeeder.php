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
                'pertanyaan' => 'Apa itu BEM dan apa bedanya dengan DPM?',
                'jawaban' => 'BEM (Badan Eksekutif Mahasiswa) adalah lembaga eksekutif yang menjalankan program kerja dan aspirasi mahasiswa. Sedangkan DPM (Dewan Perwakilan Mahasiswa) adalah lembaga legislatif yang berfungsi mengawasi, membuat regulasi, dan menyalurkan aspirasi ke pihak kampus.',
                'urutan' => 1,
            ],
            [
                'pertanyaan' => 'Bagaimana cara bergabung menjadi pengurus BEM?',
                'jawaban' => 'Pendaftaran biasanya dibuka melalui "Open Recruitment" (Oprec) di awal periode kepengurusan. Syarat dan link pendaftaran akan diumumkan melalui media sosial resmi kami.',
                'urutan' => 2,
            ],
            [
                'pertanyaan' => 'Apakah mahasiswa baru bisa langsung masuk BEM?',
                'jawaban' => 'Tentu! Kami biasanya membuka jalur khusus untuk Staf Magang atau pengurus muda agar mahasiswa baru bisa belajar berorganisasi sejak awal.',
                'urutan' => 3,
            ],
            [
                'pertanyaan' => 'Di mana saya bisa melihat informasi mengenai beasiswa terbaru?',
                'jawaban' => 'Kami selalu memperbarui informasi beasiswa melalui kanal media sosial (Instagram/Telegram) dan halaman khusus "Scholarship" di portal resmi kami.',
                'urutan' => 4,
            ],
            [
                'pertanyaan' => 'Bagaimana prosedur pengajuan dispensasi kuliah?',
                'jawaban' => 'Mahasiswa dapat menghubungi Departemen Dalam Negeri untuk meminta surat pengantar, yang kemudian akan diproses ke pihak dekanat atau bagian akademik fakultas.',
                'urutan' => 5,
            ],
            [
                'pertanyaan' => 'Bagaimana cara menyampaikan keluhan atau aspirasi?',
                'jawaban' => 'Anda bisa mengisi formulir aspirasi yang tersedia di link bio Instagram kami atau langsung mengirim pesan melalui kanal pengaduan resmi. Identitas pelapor akan kami rahasiakan.',
                'urutan' => 6,
            ],
            [
                'pertanyaan' => 'Di mana saya bisa mengunduh berkas penting (Kalender Akademik, dll)?',
                'jawaban' => 'Semua berkas publik dapat diakses melalui menu "Download Center" atau "Resource" pada portal website kami.',
                'urutan' => 7,
            ],
        ]; 

        foreach ($faqs as $faq) {
            DB::table('faqs')->insert(array_merge($faq, [
                'is_active' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ]));
        }
    }
}
