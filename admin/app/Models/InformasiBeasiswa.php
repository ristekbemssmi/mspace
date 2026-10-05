<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class InformasiBeasiswa extends Model
{
    public const CREATED_AT = 'createdAt';
    public const UPDATED_AT = 'updatedAt';
    use HasFactory;

    protected $table = 'scholarships';
    public $timestamps = false;
    public $incrementing = false;

    protected $fillable = [
        'id',
        'organizer',
        'opensOn',
        'closesOn',
        'posterUrl',
        'instagramUrl',
        'registrationUrl',
    ];

    public function information()
    {
        return $this->belongsTo(Informasi::class, 'id', 'id');
    }

    public function syarat()
    {
        return $this->hasMany(SyaratBeasiswa::class, 'scholarshipId', 'id');
    }

    public function benefit()
    {
        return $this->hasMany(BenefitBeasiswa::class, 'scholarshipId', 'id');
    }
}
