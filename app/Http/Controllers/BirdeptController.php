<?php

namespace App\Http\Controllers;

use App\Models\Birdept;
use App\Models\Informasi;
use Inertia\Inertia;
use Inertia\Response;

class BirdeptController extends Controller
{
    /**
     * Menampilkan daftar semua Biro dan Departemen
     */
    public function index(): Response
    {
        $units = Birdept::query()->orderBy('unitId')->get(['unitId', 'name', 'abbreviation', 'type', 'description', 'instagram']);

        return Inertia::render('Birdept/Index', [
            'units' => $units,
        ]);
    }

    /**
     * Menampilkan halaman BEM SSMI dengan data Birdept
     */
    public function bemssmi(): Response
    {
        $units = Birdept::query()->orderBy('unitId')->get(['unitId', 'name', 'abbreviation', 'type', 'description', 'instagram']);

        return Inertia::render('Bemssmi/Index', [
            'units' => $units,
        ]);
    }

    /**
     * Menampilkan detail satu Biro/Departemen
     */
    public function show($slug): Response
    {
        $birdept = Birdept::where('abbreviation', $slug)->firstOrFail(['unitId', 'name', 'abbreviation', 'type', 'description', 'instagram']);
        $birdept->setRelation('informasi', Informasi::query()
            ->select(Informasi::PUBLIC_COLUMNS)
            ->where('category', 'proker')
            ->published()
            ->active()
            ->where(fn ($query) => $query->where('unitId', $birdept->unitId)
                ->orWhereHas('units', fn ($members) => $members->whereKey($birdept->unitId)))
            ->with('proker:id,priority')
            ->orderByDesc('createdAt')
            ->get()
            ->sortBy(fn ($item) => $item->proker?->priority ?? PHP_INT_MAX)
            ->values());

        return Inertia::render('Birdept/Show', [
            'birdept' => $birdept,
        ]);
    }
}
