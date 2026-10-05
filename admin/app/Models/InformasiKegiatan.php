<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class InformasiKegiatan extends Model
{
    public const CREATED_AT = 'createdAt';
    public const UPDATED_AT = 'updatedAt';
    use HasFactory;

    protected $table = 'activities';
    public $timestamps = false;
    public $incrementing = false;

    protected $fillable = [
        'id',
        'eventAt',
        'location',
        'organizer',
    ];

    public function information()
    {
        return $this->belongsTo(Informasi::class, 'id', 'id');
    }
}
