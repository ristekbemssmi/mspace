<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Informasi extends Model
{
    public const CREATED_AT = 'createdAt';
    public const UPDATED_AT = 'updatedAt';
    public const DELETED_AT = 'deletedAt';
    use SoftDeletes;

    public const PUBLIC_COLUMNS = [
        'id', 'unitId', 'slug', 'title', 'description', 'source',
        'category', 'publishedAt', 'expiresAt',
    ];

    protected $table = 'information';

    protected $primaryKey = 'id';

    protected $fillable = [
        'unitId',
        'userId',
        'title',
        'description',
        'source',
        'status',
        'viewCount',
        'publishedAt',
        'category',
        'expiresAt',
    ];

    protected $casts = [
        'publishedAt' => 'datetime',
        'expiresAt' => 'datetime',
    ];

    public function beasiswa()
    {
        return $this->hasOne(InformasiBeasiswa::class, 'id');
    }

    public function birdept()
    {
        return $this->belongsTo(Birdept::class, 'unitId', 'unitId');
    }

    public function units()
    {
        return $this->belongsToMany(Birdept::class, 'informationunits', 'informationId', 'unitId', 'id', 'unitId');
    }

    public function proker()
    {
        return $this->hasOne(InformasiProker::class, 'id');
    }

    public function lomba()
    {
        return $this->hasOne(InformasiLomba::class, 'id');
    }

    public function images()
    {
        return $this->hasMany(InformationImage::class, 'informationId')->orderBy('sortOrder')->orderBy('id');
    }

    public function scopePublished($query)
    {
        return $query->where('status', 'published')
            ->whereNotNull('publishedAt')
            ->where('publishedAt', '<=', now());
    }

    public function scopeActive($query)
    {
        return $query->where(function ($q) {
            $q->whereNull('expiresAt')
                ->orWhere('expiresAt', '>=', now());
        });
    }

    public function scopeVisibleInNews($query)
    {
        $now = now();

        return $query->where('status', 'published')
            ->whereNotNull('publishedAt')
            ->where(function ($query) use ($now) {
                $query->where(function ($query) use ($now) {
                    $query->whereIn('category', ['proker', 'kegiatan', 'wisuda', 'beasiswa'])
                        ->where('publishedAt', '<=', $now->copy()->addWeek());
                })->orWhere(function ($query) use ($now) {
                    $query->whereNotIn('category', ['proker', 'kegiatan', 'wisuda', 'beasiswa'])
                        ->where('publishedAt', '<=', $now);
                });
            })
            ->where(function ($query) use ($now) {
                $query->whereNull('expiresAt')
                    ->orWhere(function ($query) use ($now) {
                        $query->where('category', 'proker')
                            ->where('expiresAt', '>=', $now->copy()->subDays(5));
                    })->orWhere(function ($query) use ($now) {
                        $query->whereIn('category', ['kegiatan', 'wisuda'])
                            ->where('expiresAt', '>=', $now->copy()->subDay());
                    })->orWhere(function ($query) use ($now) {
                        $query->whereNotIn('category', ['proker', 'kegiatan', 'wisuda'])
                            ->where('expiresAt', '>=', $now);
                    });
            });
    }
}
