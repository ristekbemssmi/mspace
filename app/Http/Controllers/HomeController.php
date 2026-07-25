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
            ->whereNotIn('jenis_informasi', ['beasiswa'])
            ->orderBy('tanggal_kadaluarsa', 'asc')
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

        $prokers = InformasiProker::with('parent')->get()
            ->map(function ($proker) {
                $imagePath = "img/proker/{$proker->id}.webp";
                if (!file_exists(public_path($imagePath))) {
                    $imagePath = "img/proker/{$proker->id}.png";
                }
                if (!file_exists(public_path($imagePath))) {
                    $imagePath = "img/fotbar.webp";
                }
                $proker->image_url = '/' . $imagePath;
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
