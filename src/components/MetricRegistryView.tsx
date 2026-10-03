import React, { useState } from 'react';
import {
  BookOpenCheck,
  ShieldCheck,
  Code2,
  Sliders,
  CheckCircle2,
  Search,
  Layers,
  ArrowRight,
  Database
} from 'lucide-react';
import { CANONICAL_METRICS, CanonicalMetric } from '../metrics/registry';

interface MetricRegistryViewProps {
  onOpenLineageForMetric?: (metricId: string) => void;
}

export const MetricRegistryView: React.FC<MetricRegistryViewProps> = ({ onOpenLineageForMetric }) => {
  const [selectedMetric, setSelectedMetric] = useState<CanonicalMetric>(CANONICAL_METRICS['OTD']);
  const [searchTerm, setSearchTerm] = useState('');

  // Configurable Landed Cost components simulator
  const [landedComponents, setLandedComponents] = useState(
    CANONICAL_METRICS['LANDED_COST'].configurable_components || []
  );

  const toggleComponent = (key: string) => {
    setLandedComponents(prev =>
      prev.map(c => c.key === key ? { ...c, included: !c.included } : c)
    );
  };

  const metricsList = Object.values(CANONICAL_METRICS).filter((m) =>
    m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    m.metric_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    m.short_code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    m.owner.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-16">
      {/* Header */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-0.5 rounded text-[11px] font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200 flex items-center gap-1">
              <BookOpenCheck className="w-3.5 h-3.5 text-indigo-600" /> Governed Catalog
            </span>
            <span className="text-xs text-slate-500">Corporate Governance Council Certified</span>
          </div>
          <h1 className="text-xl font-bold text-slate-900 mt-1">Canonical Metric Registry</h1>
          <p className="text-sm text-slate-600 mt-0.5">
            Central repository of immutable SLA definitions, mathematical expressions, dimensional grains, and data lineage owners.
          </p>
        </div>

        <div className="flex items-center space-x-2 text-xs text-emerald-800 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span className="font-semibold">All Metrics Approved & Governed</span>
        </div>
      </div>

      {/* Search / Filter Input */}
      <div className="flex items-center bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 shadow-xs">
        <Search className="w-4 h-4 text-slate-400 mr-2.5" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Filter canonical metrics by name, ID, short code, or owner..."
          className="bg-transparent flex-1 text-xs text-slate-900 placeholder-slate-400 focus:outline-none"
        />
      </div>

      {/* Metrics Catalog Table */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs">
        <div className="p-4 border-b border-slate-200 flex items-center justify-between">
          <h2 className="text-sm font-bold text-slate-900">Registered Canonical Metrics ({metricsList.length})</h2>
          <span className="text-xs text-slate-500">Click any row to inspect complete specification</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 border-b border-slate-200">
              <tr>
                <th className="py-3 px-4 font-semibold">Metric ID</th>
                <th className="py-3 px-4 font-semibold">Metric Name</th>
                <th className="py-3 px-4 font-semibold">Short Code</th>
                <th className="py-3 px-4 font-semibold">Business Definition</th>
                <th className="py-3 px-4 font-semibold">Formula</th>
                <th className="py-3 px-4 font-semibold">Owner</th>
                <th className="py-3 px-4 font-semibold">Version</th>
                <th className="py-3 px-4 font-semibold">Status</th>
                <th className="py-3 px-4 font-semibold">Source Entities</th>
                <th className="py-3 px-4 font-semibold">Source Tables</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {metricsList.map((m) => {
                const isSelected = selectedMetric.metric_id === m.metric_id;
                return (
                  <tr
                    key={m.metric_id}
                    onClick={() => setSelectedMetric(m)}
                    className={`cursor-pointer transition-colors ${
                      isSelected
                        ? 'bg-indigo-50/70 text-slate-900'
                        : 'hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <td className="py-3 px-4 font-mono font-bold text-indigo-700">{m.metric_id}</td>
                    <td className="py-3 px-4 font-semibold text-slate-900">{m.name}</td>
                    <td className="py-3 px-4 font-mono font-bold text-slate-800">{m.short_code}</td>
                    <td className="py-3 px-4 text-slate-600 max-w-xs truncate">{m.description}</td>
                    <td className="py-3 px-4 font-mono text-slate-800 text-[11px]">{m.formula}</td>
                    <td className="py-3 px-4 text-slate-600 text-[11px]">{m.owner}</td>
                    <td className="py-3 px-4 font-mono text-slate-600">v{m.version}</td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        {m.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-600 text-[11px]">{m.source_entities.join(', ')}</td>
                    <td className="py-3 px-4 font-mono text-slate-500 text-[11px]">{m.source_tables.join(', ')}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Selected Metric Deep Dive & Configurable Landed Cost Simulator */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-xl p-5 space-y-4 shadow-xs">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <div className="text-[10px] font-bold text-indigo-700 uppercase tracking-wider">
                Specification Deep Dive
              </div>
              <h3 className="text-lg font-bold text-slate-900 mt-0.5">{selectedMetric.name} ({selectedMetric.short_code})</h3>
            </div>
            <span className="font-mono text-xs px-2.5 py-1 rounded bg-slate-100 text-slate-800 border border-slate-200 font-semibold">
              {selectedMetric.metric_id}
            </span>
          </div>

          <div className="space-y-3 text-xs">
            <div>
              <div className="text-slate-500 font-semibold mb-1">Business Definition:</div>
              <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 text-slate-800 leading-relaxed font-medium">
                {selectedMetric.business_definition}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <div className="text-slate-500 font-semibold mb-1">Canonical Formula:</div>
                <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 font-mono text-indigo-700 font-semibold text-[11px]">
                  {selectedMetric.formula}
                </div>
              </div>
              <div>
                <div className="text-slate-500 font-semibold mb-1">Unit of Measure:</div>
                <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 font-mono text-slate-800 font-semibold text-[11px]">
                  {selectedMetric.unit}
                </div>
              </div>
            </div>

            <div>
              <div className="text-slate-500 font-semibold mb-1">Governed SQL Expression:</div>
              <div className="p-3 rounded-lg bg-slate-900 text-emerald-300 font-mono text-[11px] overflow-x-auto whitespace-pre-wrap rounded-lg">
                {selectedMetric.sql_expression}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-1">
              <div>
                <div className="text-slate-500 font-semibold mb-1">Allowed Dimensional Grains:</div>
                <div className="flex flex-wrap gap-1">
                  {selectedMetric.dimensions.map(d => (
                    <span key={d} className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 text-[10px] font-mono border border-slate-200">
                      {d}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <div className="text-slate-500 font-semibold mb-1">Source Entities:</div>
                <div className="flex flex-wrap gap-1">
                  {selectedMetric.source_entities.map(e => (
                    <span key={e} className="px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 text-[10px] font-semibold border border-indigo-200">
                      {e}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Configurable Formula Simulator */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-4 shadow-xs">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center space-x-2">
              <Sliders className="w-4 h-4 text-indigo-600" />
              <h3 className="font-bold text-slate-900 text-sm">Configurable Cost Components</h3>
            </div>
            <span className="text-[10px] font-mono text-indigo-700 font-bold bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200">
              Landed Cost
            </span>
          </div>

          <p className="text-xs text-slate-600 leading-relaxed">
            The Landed Cost metric allows corporate finance & procurement administrators to configure active cost elements:
          </p>

          <div className="space-y-2">
            {landedComponents.map((comp) => (
              <div
                key={comp.key}
                onClick={() => toggleComponent(comp.key)}
                className={`p-2.5 rounded-lg border text-xs cursor-pointer transition-all flex items-center justify-between ${
                  comp.included
                    ? 'bg-indigo-50/60 border-indigo-200 text-slate-900'
                    : 'bg-slate-50 border-slate-200 text-slate-400 opacity-60'
                }`}
              >
                <div>
                  <div className="font-semibold text-slate-800">{comp.label}</div>
                  <div className="text-[10px] text-slate-500">{comp.description}</div>
                </div>
                <div className={`w-4 h-4 rounded flex items-center justify-center text-xs font-bold ${
                  comp.included ? 'bg-indigo-600 text-white' : 'border border-slate-300'
                }`}>
                  {comp.included ? '✓' : ''}
                </div>
              </div>
            ))}
          </div>

          <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-700">
            <div className="font-semibold text-slate-900 mb-1">Active Formula Expression:</div>
            <code className="text-indigo-700 font-mono text-[11px] break-all">
              {landedComponents.filter(c => c.included).map(c => c.key).join(' + ') || '0'}
            </code>
          </div>
        </div>
      </div>
    </div>
  );
};
