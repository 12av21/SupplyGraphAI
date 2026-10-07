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

  const criticalSuppliers = data.filter(s => s.flaggedAtRisk);

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-16">
      {/* Header */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-0.5 rounded text-[11px] font-semibold bg-rose-50 text-rose-700 border border-rose-200 flex items-center gap-1">
              <ShieldAlert className="w-3.5 h-3.5 text-rose-600" /> Operational Risk Dashboard
            </span>
            <span className="text-xs text-slate-500">25 Governed Suppliers Analyzed</span>
          </div>
          <h1 className="text-xl font-bold text-slate-900 mt-1">Supplier Operational Risk Matrix</h1>
          <p className="text-sm text-slate-600 mt-0.5">
            X-Axis: On-Time Delivery (OTD %) • Y-Axis: Fill Rate % • Bubble Radius: Shipment Volume. Critical exposure zone highlighted in lower-left quadrant.
          </p>
        </div>

        <div className="flex items-center space-x-2 text-xs text-rose-800 bg-rose-50 px-3 py-1.5 rounded-lg border border-rose-200 font-semibold">
          <AlertTriangle className="w-4 h-4 text-rose-600" />
          <span>{criticalSuppliers.length} Suppliers in Critical Risk Zone</span>
        </div>
      </div>

      {/* Grid: Scatter Plot on Left, Selected Supplier on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <div>
              <h2 className="text-sm font-bold text-slate-900">Scatter Correlation: OTD vs. Order Fill Rate</h2>
              <p className="text-xs text-slate-500">Click any bubble node to open supplier inspection card</p>
            </div>
            <div className="flex items-center space-x-4 text-xs">
              <div className="flex items-center space-x-1.5">
                <span className="w-3 h-3 rounded-full bg-rose-500"></span>
                <span className="text-slate-600 font-medium">Critical Risk</span>
              </div>
              <div className="flex items-center space-x-1.5">
                <span className="w-3 h-3 rounded-full bg-emerald-500"></span>
                <span className="text-slate-600 font-medium">Performing Fleet</span>
              </div>
            </div>
          </div>

          <div className="h-80 w-full relative">
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: -10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis
                  type="number"
                  dataKey="otd"
                  name="OTD %"
                  unit="%"
                  domain={[75, 100]}
                  stroke="#64748b"
                  fontSize={11}
                  tickLine={false}
                  label={{ value: 'On-Time Delivery (OTD %)', position: 'insideBottom', offset: -10, fill: '#64748b', fontSize: 11 }}
                />
                <YAxis
                  type="number"
                  dataKey="fillRate"
                  name="Fill Rate %"
                  unit="%"
                  domain={[80, 100]}
                  stroke="#64748b"
                  fontSize={11}
                  tickLine={false}
                  label={{ value: 'Order Fill Rate %', angle: -90, position: 'insideLeft', fill: '#64748b', fontSize: 11 }}
                />
                <ZAxis type="number" dataKey="shipmentVolume" range={[80, 400]} />
                <Tooltip
                  cursor={{ strokeDasharray: '3 3' }}
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload as SupplierRiskNode;
                      return (
                        <div className="bg-white p-3 rounded-lg border border-slate-200 text-xs shadow-md space-y-1 text-slate-800">
                          <div className="font-bold text-slate-900 text-sm">{data.supplier_name}</div>
                          <div className="text-slate-500 font-mono text-[11px]">ID: {data.supplier_id} • Region: {data.region}</div>
                          <div className="text-emerald-700 font-semibold font-mono">OTD: {data.otd}%</div>
                          <div className="text-indigo-700 font-semibold font-mono">Fill Rate: {data.fillRate}%</div>
                          <div className="text-slate-600 font-mono">Shipments: {data.shipmentVolume}</div>
                          <div className={`font-bold ${data.flaggedAtRisk ? 'text-rose-700' : 'text-emerald-700'}`}>
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
                      fill={entry.flaggedAtRisk ? '#e11d48' : (entry.supplier_id === 'S001' ? '#4f46e5' : '#10b981')}
                      stroke="#ffffff"
                      strokeWidth={1.5}
                    />
                  ))}
                </Scatter>
              </ScatterChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Selected Supplier Inspector Card */}
        <div className="lg:col-span-4 bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h2 className="text-sm font-bold text-slate-900">Supplier Risk Detail</h2>
            {selectedSupplier && (
              <button
                onClick={() => setSelectedSupplier(null)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-md"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {selectedSupplier ? (
            <div className="space-y-4">
              <div>
                <div className="flex items-center space-x-2">
                  <span className="font-mono text-xs px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 font-semibold border border-indigo-200">
                    {selectedSupplier.supplier_id}
                  </span>
                  <span className="text-xs text-slate-500">{selectedSupplier.tier} • {selectedSupplier.region}</span>
                </div>
                <h3 className="text-base font-bold text-slate-900 mt-1">{selectedSupplier.supplier_name}</h3>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                  <div className="text-slate-500 text-[10px] uppercase font-semibold">Canonical OTD</div>
                  <div className={`text-xl font-bold font-mono mt-0.5 ${
                    selectedSupplier.otd < 90 ? 'text-rose-700' : 'text-emerald-700'
                  }`}>
                    {selectedSupplier.otd}%
                  </div>
                </div>

                <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                  <div className="text-slate-500 text-[10px] uppercase font-semibold">Order Fill Rate</div>
                  <div className="text-xl font-bold text-indigo-700 font-mono mt-0.5">
                    {selectedSupplier.fillRate}%
                  </div>
                </div>
              </div>

              <div className="space-y-2 text-xs border-t border-slate-100 pt-3">
                <div className="flex justify-between text-slate-600">
                  <span>Shipment Volume:</span>
                  <span className="font-mono font-bold text-slate-900">{selectedSupplier.shipmentVolume}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Late Consignments:</span>
                  <span className="font-mono font-bold text-rose-700">{selectedSupplier.lateShipments}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Total Incurred Freight:</span>
                  <span className="font-mono font-semibold text-slate-800">${selectedSupplier.totalLogisticsCost.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Risk Classification:</span>
                  <span className={`font-semibold ${
                    selectedSupplier.risk_level === 'High' ? 'text-rose-700' : 'text-emerald-700'
                  }`}>
                    {selectedSupplier.risk_level} Risk
                  </span>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-8 text-slate-400 text-xs space-y-2">
              <Building className="w-8 h-8 text-slate-300 mx-auto" />
              <p>Click on any supplier in the scatter matrix or table below to inspect its governed telemetry metrics.</p>
            </div>
          )}
        </div>
      </div>

      {/* Flagged Suppliers Table */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs">
        <div className="p-4 border-b border-slate-200 flex items-center justify-between">
          <h2 className="text-sm font-bold text-slate-900">Flagged At-Risk Suppliers (Action Required)</h2>
          <span className="text-xs text-rose-700 font-semibold">{criticalSuppliers.length} Flagged</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 border-b border-slate-200">
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
            <tbody className="divide-y divide-slate-100">
              {criticalSuppliers.map((s) => (
                <tr
                  key={s.supplier_id}
                  onClick={() => setSelectedSupplier(s)}
                  className="hover:bg-slate-50 cursor-pointer transition-colors"
                >
                  <td className="py-2.5 px-4 font-mono font-bold text-indigo-700">{s.supplier_id}</td>
                  <td className="py-2.5 px-4 text-slate-900 font-medium">{s.supplier_name}</td>
                  <td className="py-2.5 px-4 text-slate-500">{s.region}</td>
                  <td className="py-2.5 px-4 text-right font-mono font-bold text-rose-700">{s.otd}%</td>
                  <td className="py-2.5 px-4 text-right font-mono text-slate-700">{s.fillRate}%</td>
                  <td className="py-2.5 px-4 text-right font-mono text-slate-500">{s.shipmentVolume}</td>
                  <td className="py-2.5 px-4">
                    <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-rose-50 text-rose-700 border border-rose-200">
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
