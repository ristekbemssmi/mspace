<?php

namespace App\Http\Controllers;

use App\Models\Faq;
use Inertia\Inertia;
use Inertia\Response;

class FaqController extends Controller
{
    public function index(): Response
    {
        $faqs = Faq::query()
            ->where('isActive', true)
            ->orderBy('sortOrder', 'asc')
            ->get(['id', 'question', 'answer']);

        return Inertia::render('Faq/Index', [
            'faqs' => $faqs,
        ]);
    }
}
