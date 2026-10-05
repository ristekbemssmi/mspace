<?php

namespace App\Http\Controllers;

use App\Models\Faq;
use App\Models\Informasi;
use Inertia\Inertia;

class HomeController extends Controller
{
    public function index()
    {
        $newsCandidates = Informasi::visibleInNews()
            ->select(Informasi::PUBLIC_COLUMNS)
            ->with(['images:id,informationId,sortOrder', 'beasiswa:id,posterUrl', 'proker:id,priority'])
            ->orderByRaw('CASE WHEN expiresAt IS NULL THEN 1 ELSE 0 END')
            ->orderBy('expiresAt')
            ->orderByDesc('publishedAt')
            ->orderByDesc('id')
            ->get();

        $rankedProkers = $newsCandidates->where('category', 'proker')
            ->sortBy(fn ($item) => $item->proker?->priority ?? PHP_INT_MAX)->values();
        $categoryLimits = ['proker' => 2, 'kegiatan' => 2, 'wisuda' => 1, 'beasiswa' => 2, 'lomba' => 2];
        $selected = collect();
        foreach ($categoryLimits as $category => $limit) {
            $candidates = $category === 'proker' ? $rankedProkers : $newsCandidates->where('category', $category);
            $selected = $selected->concat($candidates->take($limit));
        }
        foreach (array_keys($categoryLimits) as $category) {
            $candidates = $category === 'proker' ? $rankedProkers : $newsCandidates->where('category', $category);
            $selected = $selected->concat($candidates
                ->whereNotIn('id', $selected->pluck('id'))->take(9 - $selected->count()));
        }
        $selected = $selected->concat($newsCandidates
            ->whereNotIn('category', array_keys($categoryLimits))
            ->take(9 - $selected->count()));

        $news = $selected->take(9)->values()
            ->map(function ($item) {
                $image = $item->images->first();
                $imageUrl = $image ? route('information.image', $image->id, false) : $item->beasiswa?->posterUrl;
                if (! $imageUrl) {
                    foreach (['webp', 'png'] as $extension) {
                        $path = "img/informasi/{$item->id}.{$extension}";
                        if (file_exists(public_path($path))) {
                            $imageUrl = '/'.$path;
                            break;
                        }
                    }
                }
                $item->imageUrl = $imageUrl;
                $item->unsetRelation('images');
                $item->unsetRelation('beasiswa');
                $item->unsetRelation('proker');

                return $item;
            });

        $faqs = Faq::where('isActive', true)->orderBy('sortOrder')->take(3)->get(['id', 'question', 'answer']);

        $prokersList = Informasi::published()
            ->active()
            ->select(Informasi::PUBLIC_COLUMNS)
            ->where('category', 'proker')
            ->with(['birdept', 'units:unitId,name,abbreviation,type', 'proker', 'images:id,informationId,sortOrder'])
            ->orderByDesc('publishedAt')
            ->orderByDesc('id')
            ->get();

        $prokers = $prokersList->sortBy(fn ($item) => $item->proker?->priority ?? PHP_INT_MAX)
            ->take(6)->values()->map(function ($proker, $index) {
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

            $image = $proker->images->first();
            $img = $image ? route('information.image', $image->id, false) : ($imageMap[$proker->title] ?? null);
            if (! $img) {
                $imagePath = "img/proker/{$proker->id}.webp";
                if (! file_exists(public_path($imagePath))) {
                    $imagePath = "img/proker/{$proker->id}.png";
                }
                if (! file_exists(public_path($imagePath))) {
                    $imgNumber = ($index % 6) + 1;
                    $imagePath = "img/proker/{$imgNumber}.png";
                }
                $img = '/'.$imagePath;
            }
            $proker->image_url = $img;
            $proker->unsetRelation('images');

            return $proker;
        });

        return Inertia::render('Home/Index', [
            'news' => $news,
            'faqs' => $faqs,
            'prokers' => $prokers,
        ]);
    }
}
