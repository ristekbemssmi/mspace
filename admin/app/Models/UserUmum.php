<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class UserUmum extends Model
{
    public const CREATED_AT = 'createdAt';
    public const UPDATED_AT = 'updatedAt';
    use HasFactory;

    protected $table = 'generalusers';
    public $timestamps = false;
    public $incrementing = false;

    protected $fillable = [
        'id',
    ];

    public function user()
    {
        return $this->belongsTo(User::class, 'id', 'id');
    }
}
