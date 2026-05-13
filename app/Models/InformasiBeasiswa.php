<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class InformasiBeasiswa extends Model
{
    protected $table = 'informasi_beasiswa';
    protected $primaryKey = 'id';
    public $incrementing = false; // Because id is a foreign key to informasi table

    protected $fillable = [
        'id',
        'penyelenggara',
        'tanggal_buka',
        'tanggal_tutup',
        'link_poster',
        'link_instagram',
        'link_pendaftaran'
    ];

    public function parent()
    {
        return $this->belongsTo(Informasi::class, 'id');
    }

    public function syaratBeasiswa()
    {
        return $this->hasMany(SyaratBeasiswa::class, 'id_beasiswa');
    }

    public function benefitBeasiswa()
    {
        return $this->hasMany(BenefitBeasiswa::class, 'id_beasiswa');
    }
}
