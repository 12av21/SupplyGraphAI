import React, { useState, useMemo } from 'react';
import {
  ShieldAlert,
  AlertTriangle,
  CheckCircle2,
  TrendingDown,
  Building,
  DollarSign,
  Truck,
  ArrowRight,
  X
} from 'lucide-react';
import { dbEngine, SupplierRiskNode } from '../database/sqlEngine';
import {
  ResponsiveContainer,
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  ZAxis,
  Tooltip,
  CartesianGrid,
  Cell
} from 'recharts';

export const SupplierRiskMatrix: React.FC = () => {
  const [selectedSupplier, setSelectedSupplier] = useState<SupplierRiskNode | null>(null);
  const data = useMemo(() => dbEngine.getSupplierRiskMatrix(), []);

  // Filter high risk outliers
  const criticalSuppliers = data.filter(s => s.flaggedAtRisk);

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-16">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-0.5 rounded text-[11px] font-semibold bg-rose-500/10 text-rose-400 border border-rose-500/20 flex items-center gap-1">
              <ShieldAlert className="w-3.5 h-3.5" /> Multi-Dimensional Exposure
            </span>
            <span className="text-xs text-slate-400">25 Governed Suppliers Analyzed</span>
          </div>
          <h1 className="text-xl font-bold text-white mt-1">Supplier Operational Risk Matrix</h1>
          <p className="text-sm text-slate-400 mt-0.5">
            X-Axis: On-Time Delivery (OTD %) • Y-Axis: Fill Rate % • Bubble Radius: Consignment Volume. Critical exposure zone highlighted in lower-left.
          </p>
        </div>

        <div className="flex items-center space-x-2 text-xs text-rose-400 bg-rose-500/10 px-3 py-1.5 rounded-lg border border-rose-500/20">
          <AlertTriangle className="w-4 h-4" />
          <span>{criticalSuppliers.length} Suppliers in High Risk Zone</span>
        </div>
      </div>

      {/* Interactive Scatter Plot & Quadrant Map */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <div>
              <h2 className="text-sm font-bold text-white">Scatter Correlation: OTD vs. Order Fill Rate</h2>
              <p className="text-xs text-slate-400">Click any bubble node to open vendor inspection card</p>
            </div>
            <div className="flex items-center space-x-4 text-xs">
              <div className="flex items-center space-x-1.5">
                <span className="w-3 h-3 rounded-full bg-rose-500"></span>
                <span className="text-slate-300">High Risk / Low OTD</span>
              </div>
              <div className="flex items-center space-x-1.5">
                <span className="w-3 h-3 rounded-full bg-emerald-500"></span>
                <span className="text-slate-300">Performing Fleet</span>
              </div>
            </div>
          </div>

          <div className="h-80 w-full relative">
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: -10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.4} />
                <XAxis
                  type="number"
                  dataKey="otd"
                  name="OTD %"
                  unit="%"
                  domain={[75, 100]}
                  stroke="#94a3b8"
                  fontSize={11}
                  label={{ value: 'On-Time Delivery (OTD %)', position: 'insideBottom', offset: -10, fill: '#94a3b8', fontSize: 11 }}
                />
                <YAxis
                  type="number"
                  dataKey="fillRate"
                  name="Fill Rate %"
                  unit="%"
                  domain={[80, 100]}
                  stroke="#94a3b8"
                  fontSize={11}
                  label={{ value: 'Order Fill Rate %', angle: -90, position: 'insideLeft', fill: '#94a3b8', fontSize: 11 }}
                />
                <ZAxis type="number" dataKey="shipmentVolume" range={[80, 400]} />
                <Tooltip
                  cursor={{ strokeDasharray: '3 3' }}
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload as SupplierRiskNode;
                      return (
                        <div className="bg-slate-950 p-3 rounded-lg border border-slate-700 text-xs shadow-xl space-y-1">
                          <div className="font-bold text-white text-sm">{data.supplier_name}</div>
                          <div className="text-slate-400">ID: {data.supplier_id} • Region: {data.region}</div>
                          <div className="text-emerald-400">OTD: {data.otd}%</div>
                          <div className="text-cyan-400">Fill Rate: {data.fillRate}%</div>
                          <div className="text-slate-300">Shipments: {data.shipmentVolume}</div>
                          <div className={`font-semibold ${data.flaggedAtRisk ? 'text-rose-400' : 'text-slate-400'}`}>
                            Status: {data.risk_level} Risk
                          </div>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Scatter
                  data={data}
                  onClick={(node: any) => setSelectedSupplier(node)}
                  className="cursor-pointer"
                >
                  {data.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={entry.flaggedAtRisk ? '#f43f5e' : (entry.supplier_id === 'S001' ? '#6366f1' : '#10b981')}
                      stroke="#0f172a"
                      strokeWidth={1.5}
                    />
                  ))}
                </Scatter>
              </ScatterChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Selected Supplier Inspector Modal / Card */}
        <div className="lg:col-span-4 bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <h2 className="text-sm font-bold text-white">Vendor Risk Profile</h2>
            {selectedSupplier && (
              <button
                onClick={() => setSelectedSupplier(null)}
                className="text-slate-400 hover:text-white p-1"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {selectedSupplier ? (
            <div className="space-y-4">
              <div>
                <div className="flex items-center space-x-2">
                  <span className="font-mono text-xs px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                    {selectedSupplier.supplier_id}
                  </span>
                  <span className="text-xs text-slate-400">{selectedSupplier.tier} • {selectedSupplier.region}</span>
                </div>
                <h3 className="text-base font-bold text-white mt-1">{selectedSupplier.supplier_name}</h3>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-lg bg-slate-800/40 border border-slate-800">
                  <div className="text-slate-400 text-[10px] uppercase">Canonical OTD</div>
                  <div className={`text-xl font-bold font-mono mt-0.5 ${
                    selectedSupplier.otd < 90 ? 'text-rose-400' : 'text-emerald-400'
                  }`}>
                    {selectedSupplier.otd}%
                  </div>
                </div>

                <div className="p-3 rounded-lg bg-slate-800/40 border border-slate-800">
                  <div className="text-slate-400 text-[10px] uppercase">Order Fill Rate</div>
                  <div className="text-xl font-bold text-cyan-400 font-mono mt-0.5">
                    {selectedSupplier.fillRate}%
                  </div>
                </div>
              </div>

              <div className="space-y-2 text-xs border-t border-slate-800 pt-3">
                <div className="flex justify-between text-slate-300">
                  <span>Shipment Volume:</span>
                  <span className="font-mono font-bold text-white">{selectedSupplier.shipmentVolume}</span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span>Late Consignments:</span>
                  <span className="font-mono font-bold text-rose-400">{selectedSupplier.lateShipments}</span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span>Total Incurred Freight:</span>
                  <span className="font-mono text-slate-200">${selectedSupplier.totalLogisticsCost.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span>Risk Classification:</span>
                  <span className={`font-semibold ${
                    selectedSupplier.risk_level === 'High' ? 'text-rose-400' : 'text-emerald-400'
                  }`}>
                    {selectedSupplier.risk_level} Risk
                  </span>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-8 text-slate-400 text-xs space-y-2">
              <Building className="w-8 h-8 text-slate-600 mx-auto" />
              <p>Click on any supplier in the scatter matrix or table below to inspect its governed telemetry metrics.</p>
            </div>
          )}
        </div>
      </div>

      {/* Critical At-Risk Suppliers Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-sm">
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <h2 className="text-sm font-bold text-white">Flagged At-Risk Suppliers (Action Required)</h2>
          <span className="text-xs text-rose-400 font-semibold">{criticalSuppliers.length} Flagged</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-800/60 text-slate-400 border-b border-slate-800">
              <tr>
                <th className="py-2.5 px-4 font-semibold">Supplier ID</th>
                <th className="py-2.5 px-4 font-semibold">Vendor Name</th>
                <th className="py-2.5 px-4 font-semibold">Region</th>
                <th className="py-2.5 px-4 font-semibold text-right">OTD %</th>
                <th className="py-2.5 px-4 font-semibold text-right">Fill Rate %</th>
                <th className="py-2.5 px-4 font-semibold text-right">Shipments</th>
                <th className="py-2.5 px-4 font-semibold">Risk Classification</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {criticalSuppliers.map((s) => (
                <tr
                  key={s.supplier_id}
                  onClick={() => setSelectedSupplier(s)}
                  className="hover:bg-slate-800/40 cursor-pointer"
                >
                  <td className="py-2.5 px-4 font-mono font-bold text-indigo-400">{s.supplier_id}</td>
                  <td className="py-2.5 px-4 text-white font-medium">{s.supplier_name}</td>
                  <td className="py-2.5 px-4 text-slate-400">{s.region}</td>
                  <td className="py-2.5 px-4 text-right font-mono font-bold text-rose-400">{s.otd}%</td>
                  <td className="py-2.5 px-4 text-right font-mono text-slate-300">{s.fillRate}%</td>
                  <td className="py-2.5 px-4 text-right font-mono text-slate-400">{s.shipmentVolume}</td>
                  <td className="py-2.5 px-4">
                    <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-rose-500/15 text-rose-400 border border-rose-500/30">
                      High Risk
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
