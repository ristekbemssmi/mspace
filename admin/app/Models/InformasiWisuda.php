<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class InformasiWisuda extends Model
{
    public const CREATED_AT = 'createdAt';
    public const UPDATED_AT = 'updatedAt';
    use HasFactory;

    protected $table = 'graduations';
    public $timestamps = false;
    public $incrementing = false;

    protected $fillable = [
        'id',
        'graduationPeriod',
        'registrationSteps',
    ];

    public function information()
    {
        return $this->belongsTo(Informasi::class, 'id', 'id');
    }
}
