<?php

namespace App\Http\Controllers;

use App\Models\Informasi;
use App\Models\InformationImage;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class InformasiController extends Controller
{
    public function show(string $identifier): Response
    {
        $information = Informasi::query()
            ->select(Informasi::PUBLIC_COLUMNS)
            ->visibleInNews()
            ->where(function ($query) use ($identifier): void {
                $query->where('slug', $identifier);
                if (ctype_digit($identifier)) {
                    $query->orWhere('id', (int) $identifier);
                }
            })
            ->with([
                'birdept:unitId,name,abbreviation',
                'units:unitId,name,abbreviation',
                'images:id,informationId,sortOrder',
                'beasiswa:id,organizer,opensOn,closesOn,registrationUrl,posterUrl,instagramUrl',
                'beasiswa.scholarshipRequirements:id,scholarshipId,requirement,description',
                'beasiswa.scholarshipBenefits:id,scholarshipId,benefit,description',
                'lomba:id,organizer,registrationUrl,opensOn,closesOn',
            ])
            ->firstOrFail();

        $detailTable = [
            'kegiatan' => 'activities',
            'alumni' => 'alumni',
            'wisuda' => 'graduations',
            'magang' => 'internships',
        ][$information->category] ?? null;
        $information->setAttribute('detail', $detailTable
            ? DB::table($detailTable)->where('id', $information->id)->first()
            : null);

        $information->images->each(function ($image): void {
            $image->url = route('information.image', $image->id, false);
        });

        return Inertia::render('Informasi/Show', ['information' => $information]);
    }

    public function image(int $id): \Symfony\Component\HttpFoundation\BinaryFileResponse
    {
        $image = InformationImage::findOrFail($id);
        abort_unless(Informasi::visibleInNews()->whereKey($image->informationId)->exists(), 404);
        abort_unless(Storage::disk('informationMedia')->exists($image->storagePath), 404);

        return response()->file(Storage::disk('informationMedia')->path($image->storagePath), [
            'Content-Type' => 'image/webp',
            'X-Content-Type-Options' => 'nosniff',
            'Cache-Control' => 'no-store',
        ]);
    }
}
