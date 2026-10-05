<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PanitiaProker extends Model
{
    public const CREATED_AT = 'createdAt';
    public const UPDATED_AT = 'updatedAt';
    use HasFactory;

    protected $table = 'workprogramcommittees';
    public $timestamps = false;
    public $incrementing = false;

    protected $fillable = [
        'workProgramId',
        'userId',
        'position',
        'division',
    ];

    public function proker()
    {
        return $this->belongsTo(InformasiProker::class, 'workProgramId', 'id');
    }

    public function user()
    {
        return $this->belongsTo(User::class, 'userId', 'id');
    }
}
