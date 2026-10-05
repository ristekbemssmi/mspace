<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Faq extends Model
{
    public const CREATED_AT = 'createdAt';
    public const UPDATED_AT = 'updatedAt';
    use HasFactory;

    protected $table = 'faqs';

    protected $fillable = [
        'question',
        'answer',
        'sortOrder',
        'isActive',
    ];

    protected function casts(): array
    {
        return [
            'isActive' => 'boolean',
            'sortOrder' => 'integer',
        ];
    }
}
