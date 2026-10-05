<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SyaratBeasiswa extends Model
{
    public const CREATED_AT = 'createdAt';
    public const UPDATED_AT = 'updatedAt';
    use HasFactory;

    protected $table = 'scholarshiprequirements';
    public $timestamps = false;

    protected $fillable = [
        'scholarshipId',
        'requirement',
        'description',
    ];

    public function beasiswa()
    {
        return $this->belongsTo(InformasiBeasiswa::class, 'scholarshipId', 'id');
    }
}
