<?php

namespace App\Http\Controllers;

use App\Models\Informasi;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class CategoryInformationController extends Controller
{
    public function kegiatan(): Response
    {
        return $this->index('kegiatan', 'activities', 'Kegiatan');
    }

    public function alumni(): Response
    {
        return $this->index('alumni', 'alumni', 'Alumni');
    }

    public function wisuda(): Response
    {
        return $this->index('wisuda', 'graduations', 'Wisuda');
    }

    public function magang(): Response
    {
        return $this->index('magang', 'internships', 'Magang');
    }

    private function index(string $category, string $detailTable, string $page): Response
    {
        $information = Informasi::published()
            ->active()
            ->select(Informasi::PUBLIC_COLUMNS)
            ->where('category', $category)
            ->with('birdept:unitId,name,abbreviation')
            ->orderByDesc('publishedAt')
            ->get();

        $details = DB::table($detailTable)
            ->whereIn('id', $information->pluck('id'))
            ->get()
            ->keyBy('id');

        $items = $information->map(fn (Informasi $item): array => [
            'id' => $item->id,
            'title' => $item->title,
            'description' => $item->description,
            'publishedAt' => $item->publishedAt,
            'expiresAt' => $item->expiresAt,
            'birdept' => $item->birdept?->name,
            'detailUrl' => route('informasi.show', $item->slug ?: $item->id, false),
            'detail' => $details->get($item->id),
        ]);

        return Inertia::render("{$page}/Index", ['items' => $items]);
    }
}
