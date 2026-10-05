import { useState } from 'react';

export type VisitPoint = { key: string; label: string; views: number; visitors: number };
export type VisitSeries = { day: VisitPoint[]; week: VisitPoint[]; month: VisitPoint[] };

const periods = [
    { key: 'day', label: 'Harian', description: '7 hari terakhir' },
    { key: 'week', label: 'Mingguan', description: '8 minggu terakhir' },
    { key: 'month', label: 'Bulanan', description: '12 bulan terakhir' },
] as const;

export function VisitChart({ series }: { series: VisitSeries }) {
    const [period, setPeriod] = useState<keyof VisitSeries>('day');
    const points = series[period];
    const maximum = Math.max(1, ...points.map((point) => point.views));
    const currentPeriod = periods.find((item) => item.key === period)!;

    return (
        <section className="mt-7 rounded-2xl border border-white/20 bg-[#253657] p-5 text-white shadow-sm sm:p-7" aria-label="Grafik kunjungan situs publik">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div>
                    <h2 className="text-xl font-black text-[#f4e06d]">Kunjungan situs publik</h2>
                    <p className="mt-1 text-sm text-white/70">{currentPeriod.description} · berdasarkan waktu Jakarta</p>
                </div>
                <div className="inline-flex self-start rounded-xl bg-white/10 p-1" role="group" aria-label="Periode grafik">
                    {periods.map((item) => (
                        <button key={item.key} type="button" onClick={() => setPeriod(item.key)} aria-pressed={period === item.key}
                            className={`rounded-lg px-3 py-2 text-xs font-bold transition sm:text-sm ${period === item.key ? 'bg-[#f4e06d] text-[#19243a]' : 'text-white/75 hover:bg-white/10 hover:text-white'}`}>
                            {item.label}
                        </button>
                    ))}
                </div>
            </div>
            <div className="mt-5 flex flex-wrap gap-5 text-xs font-semibold text-white/80">
                <span className="flex items-center gap-2"><span className="h-3 w-3 rounded-sm bg-[#f4e06d]" />Tayangan halaman</span>
                <span className="flex items-center gap-2"><span className="h-3 w-3 rounded-sm bg-[#74b9ff]" />Pengunjung unik</span>
            </div>
            <div className="mt-6 overflow-x-auto pb-2">
                <div className="flex h-64 min-w-[560px] items-end gap-3 border-b border-white/20 pb-2" role="img" aria-label={`Grafik batang kunjungan ${currentPeriod.label.toLowerCase()}`}>
                    {points.map((point) => (
                        <div key={point.key} className="flex h-full min-w-0 flex-1 flex-col items-center justify-end gap-2" title={`${point.label}: ${point.views} tayangan, ${point.visitors} pengunjung unik`}>
                            <span className="text-xs font-bold tabular-nums text-white/85">{point.views}</span>
                            <div className="flex h-44 w-full max-w-16 items-end justify-center gap-1">
                                <div className="w-1/2 rounded-t-md bg-[#f4e06d] transition-all duration-300" style={{ height: `${point.views ? Math.max(3, point.views / maximum * 100) : 0}%` }} />
                                <div className="w-1/2 rounded-t-md bg-[#74b9ff] transition-all duration-300" style={{ height: `${point.visitors ? Math.max(3, point.visitors / maximum * 100) : 0}%` }} />
                            </div>
                            <span className="h-6 text-center text-[10px] font-medium text-white/70 sm:text-xs">{point.label}</span>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
