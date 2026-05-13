<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Informasi extends Model
{
    protected $table = 'informasi';
    protected $primaryKey = 'id';

    protected $fillable = [
        'idbirdept',
        'iduser',
        'judul',
        'deskripsi',
        'sumber',
        'status',
        'jumlah_kunjungan',
        'waktu_publikasi',
        'jenis_informasi',
        'tanggal_kadaluarsa'
    ];

    protected $casts = [
        'waktu_publikasi' => 'datetime',
        'tanggal_kadaluarsa' => 'datetime',
    ];

    public function beasiswa()
    {
        return $this->hasOne(InformasiBeasiswa::class, 'id');
    }

    public function scopePublished($query)
    {
        return $query->where('status', 'published');
    }

    public function scopeActive($query)
    {
        return $query->where(function($q) {
            $q->whereNull('tanggal_kadaluarsa')
              ->orWhere('tanggal_kadaluarsa', '>=', now());
        });
    }
}
