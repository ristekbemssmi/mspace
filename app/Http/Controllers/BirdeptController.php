<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Birdept;
use Inertia\Inertia;
use Inertia\Response;

class BirdeptController extends Controller
{
    /**
     * Menampilkan daftar semua Biro dan Departemen
     */
    public function index(): Response
    {
        $birdepts = Birdept::all();

        return Inertia::render('Birdept/Index', [
            'birdepts' => $birdepts
        ]);
    }

    /**
     * Menampilkan halaman BEM SSMI dengan data Birdept
     */
    public function bemssmi(): Response
    {
        $birdepts = Birdept::all();

        return Inertia::render('Bemssmi/Index', [
            'birdepts' => $birdepts
        ]);
    }

    /**
     * Menampilkan detail satu Biro/Departemen
     */
    public function show($slug): Response
    {
        $birdept = Birdept::with([
            'informasi' => function ($query) {
                $query->where('jenis_informasi', 'proker')
                      ->where('status', 'published')
                      ->orderBy('created_at', 'desc');
            }
        ])->where('nama_panggilan', $slug)->firstOrFail();

        return Inertia::render('Birdept/Show', [
            'birdept' => $birdept
        ]);
    }
}
