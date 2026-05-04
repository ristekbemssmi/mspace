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

        return Inertia::render('bemssmi', [
            'birdepts' => $birdepts
        ]);
    }

    /**
     * Menampilkan detail satu Biro/Departemen
     */
    public function show($id): Response
    {
        $birdept = Birdept::with(['users', 'informasi'])->findOrFail($id);

        return Inertia::render('Birdept/Show', [
            'birdept' => $birdept
        ]);
    }
}
