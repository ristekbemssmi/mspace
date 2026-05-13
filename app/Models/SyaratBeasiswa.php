<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SyaratBeasiswa extends Model
{
    protected $table = 'syarat_beasiswa';
    protected $fillable = ['id_beasiswa', 'nama_syarat', 'keterangan'];

    public function beasiswa()
    {
        return $this->belongsTo(InformasiBeasiswa::class, 'id_beasiswa');
    }
}
