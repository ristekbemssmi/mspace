<?php

namespace App\Services;

use App\Models\Informasi;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;

class InformationImageService
{
    public function add(Informasi $information, UploadedFile $file): string
    {
        $source = @imagecreatefromstring(file_get_contents($file->getRealPath()));
        if ($source === false) {
            throw ValidationException::withMessages(['images' => 'Gambar tidak dapat dibaca.']);
        }

        try {
            $width = imagesx($source);
            $height = imagesy($source);
            if ($width > 3000 || $height > 3000 || $width < 1 || $height < 1) {
                throw ValidationException::withMessages(['images' => 'Ukuran gambar maksimal 3000 × 3000 piksel.']);
            }

            $scale = min(1, 1600 / $width, 1600 / $height);
            $outputWidth = max(1, (int) round($width * $scale));
            $outputHeight = max(1, (int) round($height * $scale));
            $canvas = imagecreatetruecolor($outputWidth, $outputHeight);
            imagealphablending($canvas, false);
            imagesavealpha($canvas, true);
            imagecopyresampled($canvas, $source, 0, 0, 0, 0, $outputWidth, $outputHeight, $width, $height);

            ob_start();
            $success = imagewebp($canvas, null, 78);
            $webp = ob_get_clean();
            imagedestroy($canvas);
            if (! $success || ! is_string($webp) || $webp === '') {
                throw ValidationException::withMessages(['images' => 'Konversi WebP gagal.']);
            }

            $path = 'information/'.$information->id.'/'.Str::uuid().'.webp';
            Storage::disk('informationMedia')->put($path, $webp);
            try {
                $information->images()->create([
                    'storagePath' => $path,
                    'originalName' => basename($file->getClientOriginalName()),
                    'mimeType' => 'image/webp',
                    'sizeBytes' => strlen($webp),
                    'width' => $outputWidth,
                    'height' => $outputHeight,
                    'sortOrder' => (int) $information->images()->max('sortOrder') + 1,
                ]);
            } catch (\Throwable $e) {
                Storage::disk('informationMedia')->delete($path);
                throw $e;
            }

            return $path;
        } finally {
            imagedestroy($source);
        }
    }
}
