<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class BenefitBeasiswa extends Model
{
    public const CREATED_AT = 'createdAt';
    public const UPDATED_AT = 'updatedAt';
    protected $table = 'scholarshipBenefits';
    protected $fillable = ['scholarshipId', 'benefit', 'description'];

    public function beasiswa()
    {
        return $this->belongsTo(InformasiBeasiswa::class, 'scholarshipId');
    }
}
