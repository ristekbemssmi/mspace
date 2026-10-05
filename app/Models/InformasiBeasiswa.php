<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class InformasiBeasiswa extends Model
{
    public static $snakeAttributes = false;

    public const CREATED_AT = 'createdAt';
    public const UPDATED_AT = 'updatedAt';
    protected $table = 'scholarships';
    protected $primaryKey = 'id';
    public $incrementing = false; // Because id is a foreign key to information table

    protected $fillable = [
        'id',
        'organizer',
        'opensOn',
        'closesOn',
        'posterUrl',
        'instagramUrl',
        'registrationUrl'
    ];

    public function parent()
    {
        return $this->belongsTo(Informasi::class, 'id');
    }

    public function scholarshipRequirements()
    {
        return $this->hasMany(SyaratBeasiswa::class, 'scholarshipId');
    }

    public function scholarshipBenefits()
    {
        return $this->hasMany(BenefitBeasiswa::class, 'scholarshipId');
    }
}
