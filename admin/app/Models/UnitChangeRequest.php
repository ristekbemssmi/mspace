<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class UnitChangeRequest extends Model
{
    protected $table = 'unitrequests';

    protected $fillable = ['userId', 'requestedUnitId', 'requestedPosition', 'status', 'reviewedBy'];

    public function user()
    {
        return $this->belongsTo(User::class, 'userId');
    }

    public function requestedUnit()
    {
        return $this->belongsTo(Birdept::class, 'requestedUnitId', 'unitId');
    }
}
