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
            ->get();

        $scholarships = Informasi::published()
            ->active()
            ->whereIn('jenis_informasi', ['beasiswa'])
            ->with('beasiswa')
            ->orderBy('tanggal_kadaluarsa', 'asc')
            ->get();

        $faqs = Faq::where('is_active', true)->take(3)->get();

        $prokers = InformasiProker::with('parent')->get();

        return Inertia::render('home', [
            'news' => $news,
            'scholarships' => $scholarships,
            'faqs' => $faqs,
            'prokers' => $prokers
        ]);
    }
}
