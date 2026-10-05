<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class InformationImage extends Model
{
    public const CREATED_AT = 'createdAt';
    public const UPDATED_AT = 'updatedAt';

    protected $table = 'informationimages';

    protected $fillable = ['informationId', 'storagePath', 'originalName', 'mimeType', 'sizeBytes', 'width', 'height', 'sortOrder'];

    public function information()
    {
        return $this->belongsTo(Informasi::class, 'informationId');
    }
}
