<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Informasi extends Model
{
    public const CREATED_AT = 'createdAt';
    public const UPDATED_AT = 'updatedAt';
    public const DELETED_AT = 'deletedAt';
    use HasFactory, SoftDeletes;

    protected $table = 'information';

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

    protected function casts(): array
    {
        return [
            'publishedAt' => 'datetime',
            'expiresAt' => 'datetime',
            'viewCount' => 'integer',
        ];
    }

    public function birdept()
    {
        return $this->belongsTo(Birdept::class, 'unitId', 'unitId');
    }

    public function units()
    {
        return $this->belongsToMany(Birdept::class, 'informationUnits', 'informationId', 'unitId', 'id', 'unitId');
    }

    public function user()
    {
        return $this->belongsTo(User::class, 'userId', 'id');
    }

    public function beasiswa()
    {
        return $this->hasOne(InformasiBeasiswa::class, 'id', 'id');
    }

    public function kegiatan()
    {
        return $this->hasOne(InformasiKegiatan::class, 'id', 'id');
    }

    public function himpunan()
    {
        return $this->hasOne(InformasiHimpunan::class, 'id', 'id');
    }

    public function wisuda()
    {
        return $this->hasOne(InformasiWisuda::class, 'id', 'id');
    }

    public function alumni()
    {
        return $this->hasOne(InformasiAlumni::class, 'id', 'id');
    }

    public function magang()
    {
        return $this->hasOne(InformasiMagang::class, 'id', 'id');
    }

    public function proker()
    {
        return $this->hasOne(InformasiProker::class, 'id', 'id');
    }
}
