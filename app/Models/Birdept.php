<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Birdept extends Model
{
    // Karena nama tabel bukan 'birdepts' (jika Anda pakai jamak) 
    // atau jika Anda ingin memastikan konsistensi:
    protected $table = 'birdepts';

    // Mendefinisikan Primary Key kustom
    protected $primaryKey = 'idbirdept';

    // Kolom yang boleh diisi (Mass Assignment)
    protected $fillable = [
        'nama_birdept',
        'nama_panggilan',
        'jenis',
        'deskripsi',
        'instagram',
    ];

    /**
     * Relasi ke User (Satu Birdept punya banyak anggota BEM)
     */
    public function users(): HasMany
    {
        return $this->hasMany(User::class, 'idbirdept', 'idbirdept');
    }

    /**
     * Relasi ke Informasi
     */
    public function informasi()
    {
        // return $this->hasMany(Informasi::class, 'idbirdept', 'idbirdept');
    }
}
