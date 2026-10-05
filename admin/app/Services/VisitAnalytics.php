<?php

namespace App\Services;

use Carbon\CarbonInterface;
use Illuminate\Support\Facades\DB;

class VisitAnalytics
{
    public function totals(): array
    {
        return [
            'visitors' => DB::table('sitevisits')->distinct()->count('visitorId'),
            'views' => DB::table('sitevisits')->count(),
            'visitorsToday' => DB::table('sitevisits')->where('visitedAt', '>=', today())->distinct()->count('visitorId'),
        ];
    }

    public function series(): array
    {
        return [
            'day' => $this->bucketSeries('day', today()->subDays(6), 7),
            'week' => $this->bucketSeries('week', today()->startOfWeek()->subWeeks(7), 8),
            'month' => $this->bucketSeries('month', today()->startOfMonth()->subMonths(11), 12),
        ];
    }

    public function topInformation(): array
    {
        $counts = DB::table('sitevisits')
            ->whereNotNull('informationId')
            ->selectRaw('informationId, COUNT(*) AS views, COUNT(DISTINCT visitorId) AS visitors')
            ->groupBy('informationId');

        return DB::table('information')
            ->joinSub($counts, 'visits', 'information.id', '=', 'visits.informationId')
            ->whereNull('information.deletedAt')
            ->select('information.id', 'information.title', 'information.category', 'visits.views', 'visits.visitors')
            ->orderByDesc('visits.views')->orderBy('information.id')
            ->limit(5)->get()->toArray();
    }

    public function topUnits(): array
    {
        $counts = DB::table('sitevisits')
            ->whereNotNull('unitId')
            ->selectRaw('unitId, COUNT(*) AS views, COUNT(DISTINCT visitorId) AS visitors')
            ->groupBy('unitId');

        return DB::table('units')
            ->joinSub($counts, 'visits', 'units.unitId', '=', 'visits.unitId')
            ->select('units.unitId', 'units.name', 'units.abbreviation', 'visits.views', 'visits.visitors')
            ->orderByDesc('visits.views')->orderBy('units.unitId')
            ->limit(5)->get()->toArray();
    }

    private function bucketSeries(string $period, CarbonInterface $start, int $length): array
    {
        $sqlite = DB::getDriverName() === 'sqlite';
        $expression = match ($period) {
            'day' => $sqlite ? 'date(visitedAt)' : 'DATE(visitedAt)',
            'week' => $sqlite
                ? "date(visitedAt, '-' || ((CAST(strftime('%w', visitedAt) AS integer) + 6) % 7) || ' days')"
                : 'DATE_SUB(DATE(visitedAt), INTERVAL WEEKDAY(visitedAt) DAY)',
            'month' => $sqlite ? "strftime('%Y-%m-01', visitedAt)" : "DATE_FORMAT(visitedAt, '%Y-%m-01')",
        };

        $counts = DB::table('sitevisits')
            ->where('visitedAt', '>=', $start)
            ->selectRaw("{$expression} AS bucket, COUNT(*) AS views, COUNT(DISTINCT visitorId) AS visitors")
            ->groupByRaw($expression)
            ->get()->keyBy('bucket');

        $series = [];
        for ($index = 0; $index < $length; $index++) {
            $date = $start->copy();
            $date = match ($period) {
                'day' => $date->addDays($index),
                'week' => $date->addWeeks($index),
                'month' => $date->addMonths($index),
            };
            $bucket = $date->format('Y-m-d');
            $row = $counts->get($bucket);
            $series[] = [
                'key' => $bucket,
                'label' => $date->locale('id')->translatedFormat($period === 'month' ? 'M Y' : 'd M'),
                'views' => (int) ($row->views ?? 0),
                'visitors' => (int) ($row->visitors ?? 0),
            ];
        }

        return $series;
    }
}
