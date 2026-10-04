// SCIP Operations - Trend & Recurrence Analysis View
import React, { useState, useEffect } from 'react';
import { api } from '../../services/apiClient.js';
import {
  TrendingUp,
  BarChart3,
  PieChart,
  Calendar,
  AlertCircle,
  Clock,
  CheckCircle2
} from 'lucide-react';

export const TrendAnalysisView: React.FC = () => {
  const [trends, setTrends] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadTrends();
  }, []);

  const loadTrends = async () => {
    setIsLoading(true);
    try {
      const data = await api.getTrends();
      setTrends(data);
    } catch {
      // Ignore
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading || !trends) {
    return <div className="py-24 text-center text-xs text-slate-400">Loading trend analytics...</div>;
  }

  const categoryEntries = Object.entries(trends.categoryCounts || {}).sort((a: any, b: any) => b[1] - a[1]);
  const statusEntries = Object.entries(trends.statusCounts || {});
  const dailyEntries = Object.entries(trends.dailyVolume || {});

  return (
    <div className="space-y-6 max-w-7xl mx-auto py-4">
      {/* Title */}
      <div className="border-b border-slate-200 pb-4">
        <h1 className="text-xl font-bold text-slate-900">Trend & Recurrence Intelligence</h1>
        <p className="text-xs text-slate-500 mt-1">
          Longitudinal analysis of community hazard patterns, repeat choke points, and municipal resolution velocity.
        </p>
      </div>

      {/* Summary KPI Banner */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg border border-slate-200">
          <div className="text-xs text-slate-500 font-medium">Cumulative Reports Intake</div>
          <div className="text-2xl font-bold text-slate-900 mt-1 font-mono tabular-nums">{trends.totalReports}</div>
          <div className="text-[10px] text-slate-400 mt-1">Across 8 municipal categories</div>
        </div>

        <div className="bg-white p-4 rounded-lg border border-slate-200">
          <div className="text-xs text-slate-500 font-medium">Active Incidents</div>
          <div className="text-2xl font-bold text-indigo-700 mt-1 font-mono tabular-nums">{trends.activeIncidents}</div>
          <div className="text-[10px] text-indigo-600/80 mt-1">Under investigation or resolution</div>
        </div>

        <div className="bg-white p-4 rounded-lg border border-slate-200">
          <div className="text-xs text-slate-500 font-medium">Potential Incident Clusters</div>
          <div className="text-2xl font-bold text-amber-600 mt-1 font-mono tabular-nums">{trends.potentialIncidents}</div>
          <div className="text-[10px] text-amber-600/80 mt-1">Requiring human confirmation</div>
        </div>

        <div className="bg-white p-4 rounded-lg border border-slate-200">
          <div className="text-xs text-slate-500 font-medium">Top Category Volume</div>
          <div className="text-2xl font-bold text-slate-900 mt-1 truncate">
            {String(categoryEntries[0]?.[0] || 'Water & Drainage')}
          </div>
          <div className="text-[10px] text-slate-400 mt-1 font-mono tabular-nums">
            {Number(categoryEntries[0]?.[1] || 0)} observations ({(((Number(categoryEntries[0]?.[1] || 0)) / (trends.totalReports || 1)) * 100).toFixed(0)}%)
          </div>
        </div>
      </div>

      {/* Category Breakdown & Daily Volume Grids */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Category Breakdown */}
        <div className="bg-white rounded-lg border border-slate-200 p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-200 pb-3">
            <div className="flex items-center gap-2">
              <PieChart className="w-4 h-4 text-indigo-600" />
              <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Category Distribution
              </h2>
            </div>
            <span className="text-[11px] text-slate-400 font-mono">Normalized</span>
          </div>

          <div className="space-y-3">
            {categoryEntries.map(([cat, count]: [string, any]) => {
              const pct = Math.round((count / trends.totalReports) * 100);
              return (
                <div key={cat} className="space-y-1 text-xs">
                  <div className="flex items-center justify-between font-medium">
                    <span className="text-slate-800">{cat}</span>
                    <span className="font-mono text-slate-500 tabular-nums">
                      {count} ({pct}%)
                    </span>
                  </div>
                  <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-indigo-600 rounded-full"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Daily Volume Trends */}
        <div className="bg-white rounded-lg border border-slate-200 p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-200 pb-3">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-indigo-600" />
              <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Daily Report Submissions
              </h2>
            </div>
            <span className="text-[11px] text-slate-400 font-mono">Last 7 Days</span>
          </div>

          <div className="space-y-3">
            {dailyEntries.map(([date, count]: [string, any]) => {
              const maxVol = Math.max(...dailyEntries.map(e => e[1] as number), 1);
              const barWidth = Math.round((count / maxVol) * 100);
              return (
                <div key={date} className="space-y-1 text-xs">
                  <div className="flex items-center justify-between font-medium">
                    <span className="text-slate-700 font-mono text-[11px]">{date}</span>
                    <span className="font-mono text-slate-900 font-semibold tabular-nums">
                      {count} reports
                    </span>
                  </div>
                  <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-blue-500 rounded-full"
                      style={{ width: `${barWidth}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
