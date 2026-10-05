<?php

namespace App\Http\Middleware;

use App\Models\Birdept;
use App\Models\Informasi;
use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Symfony\Component\HttpFoundation\Response;

class TrackPublicVisit
{
    public function handle(Request $request, Closure $next): Response
    {
        $response = $next($request);

        if (! $response->isSuccessful() || $request->headers->has('X-Inertia-Prefetch')
            || str_contains(strtolower($request->header('Purpose', '')), 'prefetch')) {
            return $response;
        }

        $route = $request->route();
        $routeName = $route?->getName();
        if (! $routeName) {
            return $response;
        }

        $visitorId = $request->cookie('mspace_visitor');
        $newVisitor = ! is_string($visitorId) || ! Str::isUuid($visitorId);
        if ($newVisitor) {
            $visitorId = (string) Str::uuid();
        }

        $informationId = $routeName === 'informasi.show'
            ? Informasi::query()->where('slug', $route->parameter('identifier'))
                ->when(ctype_digit((string) $route->parameter('identifier')), fn ($query) => $query->orWhere('id', (int) $route->parameter('identifier')))
                ->value('id')
            : null;
        $unitId = $routeName === 'birdept.show'
            ? Birdept::query()->where('abbreviation', $route->parameter('slug'))->value('unitId')
            : null;

        DB::table('siteVisits')->insert([
            'visitorId' => $visitorId,
            'routeName' => $routeName,
            'informationId' => $informationId,
            'unitId' => $unitId,
            'visitedAt' => now(),
        ]);

        if ($newVisitor) {
            $response->headers->setCookie(cookie('mspace_visitor', $visitorId, 60 * 24 * 365, '/', null, $request->isSecure(), true, false, 'lax'));
        }

        return $response;
    }
}
