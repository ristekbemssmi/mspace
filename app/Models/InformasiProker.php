<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class InformasiProker extends Model
{
    protected $table = 'informasi_proker';
    protected $primaryKey = 'id';
    public $incrementing = false;
    public $timestamps = false;

    protected $fillable = [
        'id',
        'tujuan',
        'sasaran',
        'waktu_mulai',
        'waktu_selesai'
    ];

    public function parent()
    {
        return $this->belongsTo(Informasi::class, 'id');
    }
}
