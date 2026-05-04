<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Faq extends Model
{
    protected $table = 'faqs';

    protected $primaryKey = 'id';

    protected $fillable = [
        'pertanyaan',
        'jawaban',
        'urutan',
        'is_active',
    ];

}
