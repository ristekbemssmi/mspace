<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class InformasiProker extends Model
{
    public const CREATED_AT = 'createdAt';
    public const UPDATED_AT = 'updatedAt';
    protected $table = 'workprograms';
    protected $primaryKey = 'id';
    public $incrementing = false;
    public $timestamps = false;

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

    public function parent()
    {
        return $this->belongsTo(Informasi::class, 'id');
    }
}
