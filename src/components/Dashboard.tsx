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
  CheckCircle2,
  Layers,
  ArrowRight,
  Clock
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
      {/* Executive Welcome & Context Header */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200">
              Governed Control Center
            </span>
            <span className="text-xs text-slate-500">10,000 Shipments • 25 Suppliers • 10 Plants</span>
          </div>
          <h1 className="text-xl font-bold text-slate-900 mt-1">Enterprise Supply Chain Executive Overview</h1>
          <p className="text-sm text-slate-600 mt-0.5">
            Single governed source of truth unifying ERP order requisitions, freight logistics, and inventory telemetry.
          </p>
        </div>

        <div className="flex items-center space-x-2.5">
          <button
            onClick={() => onNavigateToTab('consistency')}
            className="px-3.5 py-2 text-xs font-semibold rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 transition-colors flex items-center space-x-1.5"
          >
            <span>Consistency Lab</span>
            <ArrowUpRight className="w-3.5 h-3.5 text-emerald-600" />
          </button>
          <button
            onClick={() => onNavigateToTab('ask')}
            className="px-3.5 py-2 text-xs font-semibold rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs transition-colors"
          >
            Ask Questions
          </button>
        </div>
      </div>

      {/* Top 4 Required KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* 1. On-Time Delivery */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs hover:border-slate-300 transition-all">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
            <span className="font-semibold text-slate-700 uppercase tracking-wider text-[11px]">On-Time Delivery (OTD)</span>
            <span className="p-1.5 rounded-md bg-indigo-50 text-indigo-600">
              <Percent className="w-4 h-4" />
            </span>
          </div>
          <div className="text-3xl font-extrabold text-slate-900 tracking-tight font-mono">{metrics.otd}%</div>
          <div className="text-xs text-slate-500 mt-1">
            Delivered on or before promised date
          </div>
          <div className="mt-3 pt-3 border-t border-slate-100 text-[11px] flex items-center justify-between">
            <span className="inline-flex items-center text-emerald-700 font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1.5"></span>
              Canonical SLA v1.0
            </span>
            <span className="text-slate-400 font-mono">10,000 Total</span>
          </div>
        </div>

        {/* 2. Order Fill Rate */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs hover:border-slate-300 transition-all">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
            <span className="font-semibold text-slate-700 uppercase tracking-wider text-[11px]">Order Fill Rate</span>
            <span className="p-1.5 rounded-md bg-emerald-50 text-emerald-600">
              <TrendingUp className="w-4 h-4" />
            </span>
          </div>
          <div className="text-3xl font-extrabold text-slate-900 tracking-tight font-mono">{metrics.fillRate}%</div>
          <div className="text-xs text-slate-500 mt-1">
            Quantity delivered / quantity ordered
          </div>
          <div className="mt-3 pt-3 border-t border-slate-100 text-[11px] flex items-center justify-between">
            <span className="inline-flex items-center text-emerald-700 font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1.5"></span>
              High Fulfillment
            </span>
            <span className="text-slate-400 font-mono">96.4% Fleet Avg</span>
          </div>
        </div>

        {/* 3. Days of Inventory */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs hover:border-slate-300 transition-all">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
            <span className="font-semibold text-slate-700 uppercase tracking-wider text-[11px]">Days of Inventory</span>
            <span className="p-1.5 rounded-md bg-amber-50 text-amber-600">
              <Calendar className="w-4 h-4" />
            </span>
          </div>
          <div className="text-3xl font-extrabold text-slate-900 tracking-tight font-mono">{metrics.daysOfInventory} <span className="text-base font-medium text-slate-500">days</span></div>
          <div className="text-xs text-slate-500 mt-1">
            On-hand stock / 90-day daily demand
          </div>
          <div className="mt-3 pt-3 border-t border-slate-100 text-[11px] flex items-center justify-between">
            <span className="inline-flex items-center text-amber-700 font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mr-1.5"></span>
              Healthy Buffer Range
            </span>
            <span className="text-slate-400 font-mono">10 Plants</span>
          </div>
        </div>

        {/* 4. Total Landed Cost */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs hover:border-slate-300 transition-all">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
            <span className="font-semibold text-slate-700 uppercase tracking-wider text-[11px]">Total Landed Cost</span>
            <span className="p-1.5 rounded-md bg-cyan-50 text-cyan-600">
              <DollarSign className="w-4 h-4" />
            </span>
          </div>
          <div className="text-3xl font-extrabold text-slate-900 tracking-tight font-mono">${(metrics.landedCostTotal / 1000000).toFixed(1)}M</div>
          <div className="text-xs text-slate-500 mt-1">
            Purchase + freight + duties + insurance + handling
          </div>
          <div className="mt-3 pt-3 border-t border-slate-100 text-[11px] flex items-center justify-between">
            <span className="inline-flex items-center text-cyan-700 font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-500 mr-1.5"></span>
              Configurable v1.2
            </span>
            <span className="text-slate-400 font-mono">5 Components</span>
          </div>
        </div>
      </div>

      {/* Risk Signals Alert Banner */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <AlertTriangle className="w-4 h-4 text-amber-600" />
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-800">
              Active Supply Chain Risk Signals
            </h2>
          </div>
          <span className="text-xs text-slate-500 font-medium">Q3 2026 Exceptions</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
          <div className="p-3 rounded-lg bg-rose-50 border border-rose-200">
            <div className="font-bold text-rose-800 flex items-center justify-between">
              <span>{metrics.atRiskSuppliersCount} At-Risk Suppliers Flagged</span>
              <span className="text-[10px] font-mono uppercase bg-rose-100 text-rose-700 px-1.5 py-0.5 rounded">High Risk</span>
            </div>
            <p className="text-rose-700 mt-1 text-[11px] leading-relaxed">
              Suppliers with OTD &lt;90% or High Risk classification (e.g. S005 Shenzhen FastOptics, S007 Taipei Fabworks).
            </p>
          </div>

          <div className="p-3 rounded-lg bg-amber-50 border border-amber-200">
            <div className="font-bold text-amber-800 flex items-center justify-between">
              <span>Carrier CAR04 Rail Delay Rate</span>
              <span className="text-[10px] font-mono uppercase bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded">16.7% Late</span>
            </div>
            <p className="text-amber-700 mt-1 text-[11px] leading-relaxed">
              Union Pacific Intermodal Rail recorded higher delay rates impacting Midwestern destination plants (PL01 Detroit).
            </p>
          </div>

          <div className="p-3 rounded-lg bg-indigo-50 border border-indigo-200">
            <div className="font-bold text-indigo-800 flex items-center justify-between">
              <span>Plant PL01 Detroit Coverage</span>
              <span className="text-[10px] font-mono uppercase bg-indigo-100 text-indigo-700 px-1.5 py-0.5 rounded">18.7 Days DOI</span>
            </div>
            <p className="text-indigo-700 mt-1 text-[11px] leading-relaxed">
              Assembly lines buffered with 18.7 days of inventory against microelectronics SKU-P100 delays.
            </p>
          </div>
        </div>
      </div>

      {/* Charts Row: Shipment Performance (OTD Trend) & Delays by Carrier */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Shipment Performance Trend */}
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-100 gap-2">
            <div>
              <h2 className="text-sm font-bold text-slate-900">Shipment Performance (Trailing OTD & Fill Rate)</h2>
              <p className="text-xs text-slate-500">Monthly trailing metrics aggregated strictly via canonical formulas</p>
            </div>
            <div className="flex items-center space-x-4 text-xs">
              <div className="flex items-center space-x-1.5">
                <span className="w-3 h-1 bg-indigo-600 rounded"></span>
                <span className="text-slate-600 font-medium">On-Time Delivery %</span>
              </div>
              <div className="flex items-center space-x-1.5">
                <span className="w-3 h-1 bg-emerald-500 rounded"></span>
                <span className="text-slate-600 font-medium">Fill Rate %</span>
              </div>
            </div>
          </div>

          <div className="h-64 w-full mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={metrics.otdTrend} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="period" stroke="#64748b" fontSize={11} tickLine={false} />
                <YAxis domain={[85, 100]} stroke="#64748b" fontSize={11} unit="%" tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#ffffff',
                    borderColor: '#cbd5e1',
                    borderRadius: '8px',
                    fontSize: '12px',
                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                    color: '#0f172a'
                  }}
                />
                <Line type="monotone" dataKey="otd" stroke="#4f46e5" strokeWidth={2.5} dot={{ r: 4, fill: '#4f46e5' }} name="OTD %" />
                <Line type="monotone" dataKey="fillRate" stroke="#10b981" strokeWidth={2} strokeDasharray="4 4" dot={{ r: 3, fill: '#10b981' }} name="Fill Rate %" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Carrier Performance Bar Chart */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h2 className="text-sm font-bold text-slate-900">Late Deliveries by Carrier</h2>
              <p className="text-xs text-slate-500">Delays by freight logistics provider</p>
            </div>
            <Truck className="w-4 h-4 text-slate-400" />
          </div>

          <div className="h-64 w-full mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={metrics.lateShipmentByCarrier} layout="vertical" margin={{ top: 10, right: 20, left: 10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" horizontal={false} />
                <XAxis type="number" stroke="#64748b" fontSize={11} tickLine={false} />
                <YAxis dataKey="name" type="category" stroke="#64748b" fontSize={11} width={80} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#ffffff',
                    borderColor: '#cbd5e1',
                    borderRadius: '8px',
                    fontSize: '12px',
                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                    color: '#0f172a'
                  }}
                  formatter={(val: any) => [`${val} delayed shipments`, 'Late Count']}
                />
                <Bar dataKey="lateCount" radius={[0, 4, 4, 0]}>
                  {metrics.lateShipmentByCarrier.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={entry.name.includes('Union') ? '#f43f5e' : '#4f46e5'}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Secondary Row: Supplier Health Table & Inventory by Plant */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Supplier Health */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h2 className="text-sm font-bold text-slate-900">Supplier Health & SLA Performance</h2>
              <p className="text-xs text-slate-500">Top vendors evaluated on canonical OTD and risk tier</p>
            </div>
            <button
              onClick={() => onNavigateToTab('risk')}
              className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 flex items-center space-x-1"
            >
              <span>Risk Matrix</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="overflow-x-auto mt-3">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="text-slate-400 border-b border-slate-200">
                  <th className="py-2.5 font-medium">Supplier</th>
                  <th className="py-2.5 font-medium text-right">Shipments</th>
                  <th className="py-2.5 font-medium text-right">OTD %</th>
                  <th className="py-2.5 font-medium text-right">Fill Rate</th>
                  <th className="py-2.5 font-medium text-right">Risk Level</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {metrics.supplierPerformance.slice(0, 5).map((s) => (
                  <tr key={s.supplier_id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-2.5">
                      <div className="font-semibold text-slate-800">{s.name}</div>
                      <div className="text-[11px] font-mono text-slate-500">{s.supplier_id}</div>
                    </td>
                    <td className="py-2.5 text-right font-mono text-slate-700">{s.volume.toLocaleString()}</td>
                    <td className="py-2.5 text-right font-mono font-bold text-emerald-700">{s.otd}%</td>
                    <td className="py-2.5 text-right font-mono text-slate-700">{s.fillRate}%</td>
                    <td className="py-2.5 text-right">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                        s.risk === 'High' ? 'bg-rose-50 text-rose-700 border border-rose-200' :
                        s.risk === 'Medium' ? 'bg-amber-50 text-amber-700 border border-amber-200' :
                        'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      }`}>
                        {s.risk}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Inventory by Plant */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h2 className="text-sm font-bold text-slate-900">Inventory Distribution by Plant</h2>
              <p className="text-xs text-slate-500">On-hand parts quantity & asset valuation</p>
            </div>
            <span className="text-xs font-mono text-slate-500">10 Facilities</span>
          </div>

          <div className="space-y-2.5 mt-3">
            {metrics.inventoryByPlant.slice(0, 5).map((plant) => (
              <div
                key={plant.plant_id}
                className="flex items-center justify-between text-xs p-2.5 rounded-lg bg-slate-50 border border-slate-200 hover:bg-slate-100/60 transition-colors"
              >
                <div className="flex items-center space-x-2.5">
                  <div className="w-7 h-7 rounded-md bg-indigo-50 text-indigo-700 border border-indigo-200 flex items-center justify-center font-bold text-[10px]">
                    {plant.plant_id}
                  </div>
                  <div>
                    <div className="font-semibold text-slate-900">{plant.plant_name}</div>
                    <div className="text-[11px] text-slate-500">{plant.quantity.toLocaleString()} units stocked</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-mono font-semibold text-slate-900">${(plant.value / 1000).toFixed(0)}k</div>
                  <div className="text-[10px] text-emerald-700 font-medium">Governed Stock</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
