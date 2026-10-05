<?php

namespace App\Http\Controllers;

use App\Models\Informasi;
use Inertia\Inertia;

class BeasiswaController extends Controller
{
    public function index()
    {
        $beasiswa = Informasi::published()
            ->active()
            ->select(Informasi::PUBLIC_COLUMNS)
            ->where('category', 'beasiswa')
            ->with(['birdept:unitId,name,abbreviation', 'beasiswa'])
            ->orderByDesc('publishedAt')
            ->get()
            ->map(fn (Informasi $item): array => [
                'id' => $item->id,
                'title' => $item->title,
                'description' => $item->description,
                'publishedAt' => $item->publishedAt,
                'expiresAt' => $item->expiresAt,
                'birdept' => $item->birdept?->name,
                'detailUrl' => route('informasi.show', $item->slug ?: $item->id, false),
                'detail' => $item->beasiswa?->only(['organizer', 'opensOn', 'closesOn']),
            ]);

        return Inertia::render('Beasiswa/Index', [
            'items' => $beasiswa,
        ]);
    }
}
