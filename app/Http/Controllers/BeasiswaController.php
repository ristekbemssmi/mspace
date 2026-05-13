<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Models\Informasi;
use Inertia\Inertia;

class BeasiswaController extends Controller
{
    public function index()
    {
        $beasiswa = Informasi::published()
            ->whereIn('jenis_informasi', ['beasiswa'])
            ->with(['beasiswa.syaratBeasiswa', 'beasiswa.benefitBeasiswa'])
            ->orderBy('created_at', 'desc')
            ->get();

        return Inertia::render('beasiswa', [
            'beasiswaData' => $beasiswa
        ]);
    }
}
