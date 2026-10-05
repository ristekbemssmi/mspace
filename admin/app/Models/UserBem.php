<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class UserBem extends Model
{
    public const CREATED_AT = 'createdAt';
    public const UPDATED_AT = 'updatedAt';
    use HasFactory;

    protected $table = 'organizationmembers';
    public $timestamps = false;
    public $incrementing = false;

    protected $fillable = [
        'id',
        'unitId',
        'position',
    ];

    public function user()
    {
        return $this->belongsTo(User::class, 'id', 'id');
    }

    public function birdept()
    {
        return $this->belongsTo(Birdept::class, 'unitId', 'unitId');
    }
}
