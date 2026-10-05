<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class InformasiLomba extends Model
{
    protected $table = 'competitions';

    public $timestamps = false;

    public $incrementing = false;

    protected $fillable = ['id', 'organizer', 'registrationUrl', 'opensOn', 'closesOn'];

    public function information()
    {
        return $this->belongsTo(Informasi::class, 'id', 'id');
    }
}
