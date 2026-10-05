<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class InformasiAlumni extends Model
{
    public const CREATED_AT = 'createdAt';
    public const UPDATED_AT = 'updatedAt';
    use HasFactory;

    protected $table = 'alumni';
    public $timestamps = false;
    public $incrementing = false;

    protected $fillable = [
        'id',
        'name',
        'cohort',
        'topic',
    ];

    public function information()
    {
        return $this->belongsTo(Informasi::class, 'id', 'id');
    }
}
