<?php

namespace App\Http\Controllers;

use App\Models\Faq;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class FaqController extends Controller
{
    public function index(): Response
    {
        $faqs = Faq::query()
            ->where('is_active', true)
            ->orderBy('urutan', 'asc')
            ->get();
        return Inertia::render('Faq/Index', [
            'faqs' => $faqs,
        ]);
    }

}
