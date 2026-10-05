<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class InformasiProker extends Model
{
    public const CREATED_AT = 'createdAt';
    public const UPDATED_AT = 'updatedAt';
    use HasFactory;

    protected $table = 'workprograms';
    public $timestamps = false;
    public $incrementing = false;

    protected $fillable = [
        'id',
        'purpose',
        'audience',
        'startsOn',
        'endsOn',
        'priority',
    ];

    protected $casts = [
        'priority' => 'integer',
    ];

    public function information()
    {
        return $this->belongsTo(Informasi::class, 'id', 'id');
    }

    public function panitia()
    {
        return $this->hasMany(PanitiaProker::class, 'workProgramId', 'id');
    }
}
