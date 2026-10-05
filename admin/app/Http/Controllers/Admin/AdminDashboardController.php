<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Birdept;
use App\Models\Faq;
use App\Models\Informasi;
use App\Models\User;
use App\Models\UserBem;
use App\Services\VisitAnalytics;
use Inertia\Inertia;
use Inertia\Response;

class AdminDashboardController extends Controller
{
    public function index(VisitAnalytics $analytics): Response
    {
        $stats = [
            'total_birdept' => Birdept::count(),
            'total_users' => User::count(),
            'total_users_bem' => UserBem::count(),
            'total_informasi' => Informasi::count(),
            'total_faqs' => Faq::count(),
            ...$analytics->totals(),
        ];

        $recent_informasi = Informasi::with(['birdept', 'user:id,name,username'])
            ->latest()
            ->take(5)
            ->get();

        $recent_users = auth()->user()->hasAdminRole('admin')
            ? User::with('userBem.birdept')->latest()->take(5)->get()
            : collect();

        return Inertia::render('admin/dashboard', [
            'stats' => $stats,
            'recent_informasi' => $recent_informasi,
            'recent_users' => $recent_users,
            'visit_series' => $analytics->series(),
            'top_information' => $analytics->topInformation(),
            'top_units' => $analytics->topUnits(),
        ]);
    }
}
