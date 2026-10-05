<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Birdept extends Model
{
    public const CREATED_AT = 'createdAt';
    public const UPDATED_AT = 'updatedAt';
    // Karena name tabel bukan 'units' (jika Anda pakai jamak)
    // atau jika Anda ingin memastikan konsistensi:
    protected $table = 'units';

    // Mendefinisikan Primary Key kustom
    protected $primaryKey = 'unitId';

    // Kolom yang boleh diisi (Mass Assignment)
    protected $fillable = [
        'name',
        'abbreviation',
        'type',
        'description',
        'instagram',
    ];

    /**
     * Relasi ke User (Satu Birdept punya banyak anggota BEM)
     */
    public function users(): HasMany
    {
        return $this->hasMany(User::class, 'unitId', 'unitId');
    }

    /**
     * Relasi ke Informasi
     */
    public function information(): HasMany
    {
        return $this->hasMany(Informasi::class, 'unitId', 'unitId');
    }
}
