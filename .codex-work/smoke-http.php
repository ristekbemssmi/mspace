<?php

$project = $argv[1] ?? 'public';
$base = $project === 'public' ? 'D:/herd/mspace' : 'D:/herd/admin-mspace';
require $base.'/vendor/autoload.php';
$app = require $base.'/bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();
$kernel = $app->make(Illuminate\Contracts\Http\Kernel::class);

$paths = $project === 'public' ? ['/', '/faq', '/informasi-beasiswa'] : ['/login', '/'];
if ($project === 'public') {
    $item = App\Models\Informasi::published()->active()->whereNotNull('slug')->first();
    if ($item) {
        $paths[] = '/informasi/'.$item->slug;
    }
} else {
    $manager = App\Models\User::whereIn('adminRole', ['admin', 'editor', 'viewer'])->first();
    if ($manager) {
        Illuminate\Support\Facades\Auth::setUser($manager);
        $paths = ['/admin/dashboard', '/admin/informasi', '/admin/birdept', '/admin/faqs', '/admin/users'];
    }
}
foreach ($paths as $path) {
    $request = Illuminate\Http\Request::create($path, 'GET');
    $response = $kernel->handle($request);
    $status = $response->getStatusCode();
    $kernel->terminate($request, $response);
    echo $project, ' ', $path, ' ', $status, PHP_EOL;
    if ($status >= 400) {
        exit(1);
    }
}
