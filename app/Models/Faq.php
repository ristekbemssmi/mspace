<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Faq extends Model
{
    public const CREATED_AT = 'createdAt';
    public const UPDATED_AT = 'updatedAt';
    protected $table = 'faqs';

    protected $primaryKey = 'id';

    protected $fillable = [
        'question',
        'answer',
        'sortOrder',
        'isActive',
    ];

}
