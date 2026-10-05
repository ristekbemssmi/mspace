<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Birdept extends Model
{
    public const CREATED_AT = 'createdAt';
    public const UPDATED_AT = 'updatedAt';
    use HasFactory;

    protected $table = 'units';
    protected $primaryKey = 'unitId';

    protected $fillable = [
        'name',
        'abbreviation',
        'type',
        'description',
        'instagram',
    ];

    public function usersBem()
    {
        return $this->hasMany(UserBem::class, 'unitId', 'unitId');
    }

    public function information()
    {
        return $this->hasMany(Informasi::class, 'unitId', 'unitId');
    }
}
