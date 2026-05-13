<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class BenefitBeasiswa extends Model
{
    protected $table = 'benefit_beasiswa';
    protected $fillable = ['id_beasiswa', 'nama_benefit', 'keterangan'];

    public function beasiswa()
    {
        return $this->belongsTo(InformasiBeasiswa::class, 'id_beasiswa');
    }
}
