<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Models\Informasi;
use App\Models\Faq;
use App\Models\InformasiProker;
use Inertia\Inertia;

class HomeController extends Controller
{
    public function index()
    {
        $news = Informasi::published()
            ->active()
            ->whereNotIn('jenis_informasi', ['beasiswa', 'proker'])
            ->orderBy('waktu_publikasi', 'desc')
            ->get()
            ->map(function ($item) {
                $imagePath = "img/informasi/{$item->id}.webp";
                if (!file_exists(public_path($imagePath))) {
                    $imagePath = "img/informasi/{$item->id}.png";
                }
                if (!file_exists(public_path($imagePath))) {
                    $imagePath = "img/fotbar.webp";
                }
                $item->image_url = '/' . $imagePath;
                return $item;
            });

        $scholarships = Informasi::published()
            ->active()
            ->whereIn('jenis_informasi', ['beasiswa'])
            ->with('beasiswa')
            ->orderBy('tanggal_kadaluarsa', 'asc')
            ->get()
            ->map(function ($item) {
                $linkPoster = $item->beasiswa->link_poster ?? null;
                if (empty($linkPoster)) {
                    $linkPoster = "/img/beasiswa.webp";
                } elseif (str_starts_with($linkPoster, '/img/') || str_starts_with($linkPoster, 'img/')) {
                    $cleanPath = ltrim($linkPoster, '/');
                    if (!file_exists(public_path($cleanPath))) {
                        $linkPoster = "/img/beasiswa.webp";
                    }
                }
                if ($item->beasiswa) {
                    $item->beasiswa->link_poster = $linkPoster;
                }
                return $item;
            });

        $faqs = Faq::where('is_active', true)->take(3)->get();

        $flagshipNames = [
            'M Care',
            'MISSION 2.0',
            'Mignight',
            'SPECTRA',
            'Pojok Seni',
            'Tekno Karsa 2.0',
        ];

        $prokersList = Informasi::published()
            ->where('jenis_informasi', 'proker')
            ->with(['birdept', 'proker'])
            ->get();

        $prokers = $prokersList->sortBy(function ($item) use ($flagshipNames) {
            $index = array_search($item->judul, $flagshipNames);
            return $index !== false ? $index : 999;
        })->take(6)->values()->map(function ($proker, $index) {
            $imageMap = [
                'M Care' => '/img/proker/1.png',
                'MISSION 2.0' => '/img/proker/2.png',
                'MISSION' => '/img/proker/2.png',
                'Mignight' => '/img/proker/3.png',
                'SPECTRA' => '/img/proker/4.png',
                'SPECTRA (Sport and Art Competition Arena)' => '/img/proker/4.png',
                'Pojok Seni' => '/img/proker/5.png',
                'Tekno Karsa 2.0' => '/img/proker/6.png',
                'Tekno Karsa' => '/img/proker/6.png',
            ];

            $img = $imageMap[$proker->judul] ?? null;
            if (!$img) {
                $imagePath = "img/proker/{$proker->id}.webp";
                if (!file_exists(public_path($imagePath))) {
                    $imagePath = "img/proker/{$proker->id}.png";
                }
                if (!file_exists(public_path($imagePath))) {
                    $imgNumber = ($index % 6) + 1;
                    $imagePath = "img/proker/{$imgNumber}.png";
                }
                $img = '/' . $imagePath;
            }
            $proker->image_url = $img;
            return $proker;
        });

        return Inertia::render('Home/Index', [
            'news' => $news,
            'scholarships' => $scholarships,
            'faqs' => $faqs,
            'prokers' => $prokers
        ]);
    }
}
