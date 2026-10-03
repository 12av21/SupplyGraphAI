import React, { useMemo } from 'react';
import {
  TrendingUp,
  Percent,
  Calendar,
  DollarSign,
  AlertTriangle,
  Building2,
  Truck,
  ArrowUpRight,
  ShieldCheck,
  CheckCircle,
  HelpCircle
} from 'lucide-react';
import { dbEngine } from '../database/sqlEngine';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  BarChart,
  Bar,
  Cell
} from 'recharts';

interface DashboardProps {
  onNavigateToTab: (tab: any) => void;
  onSelectSupplierForRisk?: (suppId: string) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ onNavigateToTab }) => {
  const metrics = useMemo(() => dbEngine.getExecutiveDashboardMetrics(), []);

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Top Banner / Problem Statement Resolution */}
      <div className="rounded-xl p-5 bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border border-indigo-900/40 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
              SupplyGraph Live Telemetry
            </span>
            <span className="text-xs text-slate-400">Deterministic Governed Database</span>
          </div>
          <h1 className="text-xl font-bold text-white mt-1">Enterprise Supply Chain Executive Overview</h1>
          <p className="text-sm text-slate-300 mt-0.5">
            Single unified source of truth aggregating 10,000 shipments, 25 suppliers, and 10 manufacturing plants.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={() => onNavigateToTab('consistency')}
            className="px-3.5 py-2 text-xs font-semibold rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white shadow-sm transition-colors flex items-center space-x-1.5"
          >
            <span>Launch Consistency Lab</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => onNavigateToTab('ask')}
            className="px-3.5 py-2 text-xs font-semibold rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors"
          >
            Ask Questions
          </button>
        </div>
      </div>

      {/* KPI Cards Grid (Matches Requirements Exactly) */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {/* 1. OTD Card */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 relative overflow-hidden group hover:border-slate-700 transition-all">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span className="font-semibold text-slate-300">OTD</span>
            <span className="p-1 rounded bg-indigo-500/10 text-indigo-400">
              <Percent className="w-3.5 h-3.5" />
            </span>
          </div>
          <div className="text-2xl font-extrabold text-white tracking-tight">{metrics.otd}%</div>
          <div className="text-[11px] text-slate-400 mt-1 flex items-center">
            <span className="text-emerald-400 font-medium">On-Time Delivery</span>
          </div>
          <div className="mt-2 pt-2 border-t border-slate-800/80 text-[10px] text-slate-400 flex items-center justify-between">
            <span>Canonical SLA</span>
            <span className="text-slate-300 font-mono">v1.0</span>
          </div>
        </div>

        {/* 2. Fill Rate Card */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 relative overflow-hidden group hover:border-slate-700 transition-all">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span className="font-semibold text-slate-300">Fill Rate</span>
            <span className="p-1 rounded bg-emerald-500/10 text-emerald-400">
              <TrendingUp className="w-3.5 h-3.5" />
            </span>
          </div>
          <div className="text-2xl font-extrabold text-white tracking-tight">{metrics.fillRate}%</div>
          <div className="text-[11px] text-slate-400 mt-1 flex items-center">
            <span className="text-emerald-400 font-medium">Quantity Fulfilled</span>
          </div>
          <div className="mt-2 pt-2 border-t border-slate-800/80 text-[10px] text-slate-400 flex items-center justify-between">
            <span>Delivered / Ordered</span>
            <span className="text-slate-300 font-mono">v1.0</span>
          </div>
        </div>

        {/* 3. Days of Inventory Card */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 relative overflow-hidden group hover:border-slate-700 transition-all">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span className="font-semibold text-slate-300">Days Inventory</span>
            <span className="p-1 rounded bg-amber-500/10 text-amber-400">
              <Calendar className="w-3.5 h-3.5" />
            </span>
          </div>
          <div className="text-2xl font-extrabold text-white tracking-tight">{metrics.daysOfInventory}</div>
          <div className="text-[11px] text-slate-400 mt-1 flex items-center">
            <span className="text-amber-400 font-medium">Coverage Days</span>
          </div>
          <div className="mt-2 pt-2 border-t border-slate-800/80 text-[10px] text-slate-400 flex items-center justify-between">
            <span>Burn Runway</span>
            <span className="text-slate-300 font-mono">90-Day Base</span>
          </div>
        </div>

        {/* 4. Landed Cost Card */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 relative overflow-hidden group hover:border-slate-700 transition-all">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span className="font-semibold text-slate-300">Landed Cost</span>
            <span className="p-1 rounded bg-cyan-500/10 text-cyan-400">
              <DollarSign className="w-3.5 h-3.5" />
            </span>
          </div>
          <div className="text-2xl font-extrabold text-white tracking-tight">
            ${(metrics.landedCostTotal / 1000000).toFixed(1)}M
          </div>
          <div className="text-[11px] text-slate-400 mt-1 flex items-center">
            <span className="text-cyan-400 font-medium">Total Acquisition</span>
          </div>
          <div className="mt-2 pt-2 border-t border-slate-800/80 text-[10px] text-slate-400 flex items-center justify-between">
            <span>5 Components</span>
            <span className="text-slate-300 font-mono">v1.2</span>
          </div>
        </div>

        {/* 5. Late Shipments Card */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 relative overflow-hidden group hover:border-slate-700 transition-all">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span className="font-semibold text-slate-300">Late Shipments</span>
            <span className="p-1 rounded bg-rose-500/10 text-rose-400">
              <AlertTriangle className="w-3.5 h-3.5" />
            </span>
          </div>
          <div className="text-2xl font-extrabold text-rose-400 tracking-tight">{metrics.lateShipmentsCount}</div>
          <div className="text-[11px] text-slate-400 mt-1 flex items-center">
            <span className="text-rose-400/90 font-medium">Variance &gt; Promise</span>
          </div>
          <div className="mt-2 pt-2 border-t border-slate-800/80 text-[10px] text-slate-400 flex items-center justify-between">
            <span>Q3 Delayed</span>
            <span className="text-rose-400 font-mono">Action Req</span>
          </div>
        </div>

        {/* 6. At-Risk Suppliers Card */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 relative overflow-hidden group hover:border-slate-700 transition-all">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span className="font-semibold text-slate-300">At-Risk Suppliers</span>
            <span className="p-1 rounded bg-purple-500/10 text-purple-400">
              <Building2 className="w-3.5 h-3.5" />
            </span>
          </div>
          <div className="text-2xl font-extrabold text-purple-300 tracking-tight">{metrics.atRiskSuppliersCount}</div>
          <div className="text-[11px] text-slate-400 mt-1 flex items-center">
            <span className="text-purple-400 font-medium">Risk High / OTD &lt;90%</span>
          </div>
          <div className="mt-2 pt-2 border-t border-slate-800/80 text-[10px] text-slate-400 flex items-center justify-between">
            <span>Active Vendors</span>
            <span className="text-purple-300 font-mono">7 of 25</span>
          </div>
        </div>
      </div>

      {/* Main Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart 1: OTD & Fill Rate Trend */}
        <div className="lg:col-span-2 bg-slate-900/90 border border-slate-800 rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-sm font-bold text-white">Governed Performance Trends (OTD vs Fill Rate)</h2>
              <p className="text-xs text-slate-400">Monthly trailing metrics aggregated strictly via canonical formulas</p>
            </div>
            <div className="flex items-center space-x-4 text-xs">
              <div className="flex items-center space-x-1.5">
                <span className="w-3 h-0.5 bg-indigo-500"></span>
                <span className="text-slate-300">On-Time Delivery %</span>
              </div>
              <div className="flex items-center space-x-1.5">
                <span className="w-3 h-0.5 bg-emerald-400"></span>
                <span className="text-slate-300">Fill Rate %</span>
              </div>
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={metrics.otdTrend} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.5} />
                <XAxis dataKey="period" stroke="#94a3b8" fontSize={11} />
                <YAxis domain={[85, 100]} stroke="#94a3b8" fontSize={11} unit="%" />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', fontSize: '12px' }}
                />
                <Line type="monotone" dataKey="otd" stroke="#6366f1" strokeWidth={2.5} dot={{ r: 4, fill: '#6366f1' }} name="OTD %" />
                <Line type="monotone" dataKey="fillRate" stroke="#34d399" strokeWidth={2} strokeDasharray="4 4" dot={{ r: 3, fill: '#34d399' }} name="Fill Rate %" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Late Shipments by Carrier */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-sm font-bold text-white">Delays by Logistics Carrier</h2>
              <p className="text-xs text-slate-400">Attribution across transport service providers</p>
            </div>
            <Truck className="w-4 h-4 text-slate-400" />
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={metrics.lateShipmentByCarrier} layout="vertical" margin={{ top: 10, right: 20, left: 10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.4} />
                <XAxis type="number" stroke="#94a3b8" fontSize={11} />
                <YAxis dataKey="name" type="category" stroke="#94a3b8" fontSize={11} width={80} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', fontSize: '12px' }}
                  formatter={(val: any) => [`${val} late shipments`, 'Delayed Consignments']}
                />
                <Bar dataKey="lateCount" radius={[0, 4, 4, 0]}>
                  {metrics.lateShipmentByCarrier.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={entry.name.includes('Union') ? '#f43f5e' : '#6366f1'}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Secondary Row: Inventory by Plant & Top Suppliers Performance */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Plant Inventory Runways */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h2 className="text-sm font-bold text-white">Plant Inventory Distribution</h2>
              <p className="text-xs text-slate-400">On-hand physical stock quantity & valuation by facility</p>
            </div>
            <span className="text-xs text-slate-400">10 Plants</span>
          </div>

          <div className="space-y-3 mt-4">
            {metrics.inventoryByPlant.slice(0, 5).map((plant) => (
              <div key={plant.plant_id} className="flex items-center justify-between text-xs p-2.5 rounded-lg bg-slate-800/40 border border-slate-800">
                <div className="flex items-center space-x-2.5">
                  <div className="w-7 h-7 rounded bg-indigo-500/10 text-indigo-400 flex items-center justify-center font-bold text-[10px]">
                    {plant.plant_id}
                  </div>
                  <div>
                    <div className="font-semibold text-slate-200">{plant.plant_name}</div>
                    <div className="text-[11px] text-slate-400">{plant.quantity.toLocaleString()} units stocked</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-mono font-medium text-slate-200">${(plant.value / 1000).toFixed(0)}k</div>
                  <div className="text-[10px] text-emerald-400">Governed Buffer</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Carrier Performance Table */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h2 className="text-sm font-bold text-white">Carrier Reliability Benchmarks</h2>
              <p className="text-xs text-slate-400">OTD % calculated through canonical metric registry</p>
            </div>
            <button
              onClick={() => onNavigateToTab('ask')}
              className="text-xs text-indigo-400 hover:text-indigo-300 font-medium"
            >
              Analyze Delay Rates →
            </button>
          </div>

          <div className="overflow-x-auto mt-2">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="text-slate-400 border-b border-slate-800 pb-2">
                  <th className="py-2 font-medium">Carrier</th>
                  <th className="py-2 font-medium">Mode</th>
                  <th className="py-2 font-medium text-right">Shipments</th>
                  <th className="py-2 font-medium text-right">OTD %</th>
                  <th className="py-2 font-medium text-right">Delay Rate</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {metrics.carrierPerformance.map((c) => (
                  <tr key={c.carrier_id} className="hover:bg-slate-800/30">
                    <td className="py-2.5 font-medium text-slate-200">{c.name}</td>
                    <td className="py-2.5 text-slate-400">{c.mode}</td>
                    <td className="py-2.5 text-right font-mono text-slate-300">{c.volume.toLocaleString()}</td>
                    <td className="py-2.5 text-right font-mono font-semibold text-emerald-400">{c.otd}%</td>
                    <td className="py-2.5 text-right font-mono text-rose-400">{c.delayRate}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
