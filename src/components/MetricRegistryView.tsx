import React, { useState } from 'react';
import {
  BookOpenCheck,
  ShieldCheck,
  Code2,
  Sliders,
  CheckCircle2,
  Info,
  Layers,
  ArrowRight,
  Database,
  ExternalLink
} from 'lucide-react';
import { CANONICAL_METRICS, CanonicalMetric } from '../metrics/registry';

interface MetricRegistryViewProps {
  onOpenLineageForMetric?: (metricId: string) => void;
}

export const MetricRegistryView: React.FC<MetricRegistryViewProps> = ({ onOpenLineageForMetric }) => {
  const [selectedMetric, setSelectedMetric] = useState<CanonicalMetric>(CANONICAL_METRICS['OTD']);
  
  // Landed cost simulator state
  const [landedComponents, setLandedComponents] = useState(
    CANONICAL_METRICS['LANDED_COST'].configurable_components || []
  );

  const toggleComponent = (key: string) => {
    setLandedComponents(prev =>
      prev.map(c => c.key === key ? { ...c, included: !c.included } : c)
    );
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-16">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-0.5 rounded text-[11px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
              <BookOpenCheck className="w-3.5 h-3.5" /> Governed Source of Truth
            </span>
            <span className="text-xs text-slate-400">Enterprise Metric Catalog</span>
          </div>
          <h1 className="text-xl font-bold text-white mt-1">Centralized Canonical Metric Registry</h1>
          <p className="text-sm text-slate-400 mt-0.5">
            Strict business definitions, mathematical formulas, dimensional grain, and data ownership governance.
          </p>
        </div>

        <div className="flex items-center space-x-2 text-xs text-emerald-400 bg-emerald-500/10 px-3 py-1.5 rounded-lg border border-emerald-500/20">
          <ShieldCheck className="w-4 h-4" />
          <span>Council Approved v1.0 - v1.2</span>
        </div>
      </div>

      {/* Main Table: Metric Catalog (Matches Section 20 Verbatim) */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-sm">
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <h2 className="text-sm font-bold text-white">Governed Metric Catalog</h2>
          <span className="text-xs text-slate-400">Click any row to inspect complete definition & lineage</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-800/60 text-slate-400 border-b border-slate-800">
              <tr>
                <th className="py-3 px-4 font-semibold">Metric</th>
                <th className="py-3 px-4 font-semibold">Definition</th>
                <th className="py-3 px-4 font-semibold">Formula</th>
                <th className="py-3 px-4 font-semibold">Owner</th>
                <th className="py-3 px-4 font-semibold">Version</th>
                <th className="py-3 px-4 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {Object.values(CANONICAL_METRICS).map((m) => {
                const isSelected = selectedMetric.metric_id === m.metric_id;
                return (
                  <tr
                    key={m.metric_id}
                    onClick={() => setSelectedMetric(m)}
                    className={`cursor-pointer transition-colors ${
                      isSelected
                        ? 'bg-indigo-600/15 text-white'
                        : 'hover:bg-slate-800/40 text-slate-300'
                    }`}
                  >
                    <td className="py-3 px-4 font-bold text-white flex items-center space-x-2">
                      <span className="font-mono text-indigo-400">{m.short_code}</span>
                      <span className="text-slate-400 text-[11px] font-normal">({m.metric_id})</span>
                    </td>
                    <td className="py-3 px-4 text-slate-300 max-w-xs truncate">{m.description}</td>
                    <td className="py-3 px-4 font-mono text-indigo-300 text-[11px]">{m.formula}</td>
                    <td className="py-3 px-4 text-slate-400">{m.owner}</td>
                    <td className="py-3 px-4 font-mono text-slate-400">v{m.version}</td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                        {m.status}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Selected Metric Deep Dive Card */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div>
              <div className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider">
                Inspection & Governance Specification
              </div>
              <h3 className="text-lg font-bold text-white mt-0.5">{selectedMetric.name} ({selectedMetric.short_code})</h3>
            </div>
            <span className="font-mono text-xs px-2.5 py-1 rounded bg-slate-800 text-slate-300 border border-slate-700">
              {selectedMetric.metric_id}
            </span>
          </div>

          <div className="space-y-3 text-xs">
            <div>
              <div className="text-slate-400 font-medium mb-1">Business Definition:</div>
              <div className="p-3 rounded-lg bg-slate-800/40 border border-slate-800 text-slate-200 leading-relaxed">
                {selectedMetric.business_definition}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <div className="text-slate-400 font-medium mb-1">Canonical Formula:</div>
                <div className="p-2.5 rounded-lg bg-slate-800/40 border border-slate-800 font-mono text-indigo-300 text-[11px]">
                  {selectedMetric.formula}
                </div>
              </div>
              <div>
                <div className="text-slate-400 font-medium mb-1">Unit of Measurement:</div>
                <div className="p-2.5 rounded-lg bg-slate-800/40 border border-slate-800 font-mono text-slate-200 text-[11px]">
                  {selectedMetric.unit}
                </div>
              </div>
            </div>

            <div>
              <div className="text-slate-400 font-medium mb-1">Governed SQL Expression:</div>
              <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 font-mono text-emerald-400 text-[11px] overflow-x-auto whitespace-pre-wrap">
                {selectedMetric.sql_expression}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-1">
              <div>
                <div className="text-slate-400 font-medium mb-1">Allowed Dimensions:</div>
                <div className="flex flex-wrap gap-1">
                  {selectedMetric.dimensions.map(d => (
                    <span key={d} className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 text-[10px] font-mono">
                      {d}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <div className="text-slate-400 font-medium mb-1">Source Entities:</div>
                <div className="flex flex-wrap gap-1">
                  {selectedMetric.source_entities.map(e => (
                    <span key={e} className="px-2 py-0.5 rounded bg-indigo-500/15 text-indigo-300 text-[10px]">
                      {e}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Configurable Formula Simulator (for Landed Cost) */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center space-x-2">
              <Sliders className="w-4 h-4 text-cyan-400" />
              <h3 className="font-bold text-white text-sm">Configurable Formula Components</h3>
            </div>
            <span className="text-[10px] text-cyan-400 font-mono">Landed Cost</span>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed">
            As mandated by Section 4, the Landed Cost metric allows governance administrators to configure active cost elements:
          </p>

          <div className="space-y-2">
            {landedComponents.map((comp) => (
              <div
                key={comp.key}
                onClick={() => toggleComponent(comp.key)}
                className={`p-3 rounded-lg border text-xs cursor-pointer transition-all flex items-center justify-between ${
                  comp.included
                    ? 'bg-slate-800/80 border-cyan-500/40 text-white'
                    : 'bg-slate-900/50 border-slate-800 text-slate-400 opacity-60'
                }`}
              >
                <div>
                  <div className="font-semibold">{comp.label}</div>
                  <div className="text-[10px] text-slate-400">{comp.description}</div>
                </div>
                <div className={`w-4 h-4 rounded flex items-center justify-center ${
                  comp.included ? 'bg-cyan-500 text-slate-950 font-bold' : 'border border-slate-600'
                }`}>
                  {comp.included ? '✓' : ''}
                </div>
              </div>
            ))}
          </div>

          <div className="p-3 rounded-lg bg-cyan-950/20 border border-cyan-500/30 text-xs text-cyan-300">
            Active Formula: <code className="text-white font-mono text-[11px]">
              {landedComponents.filter(c => c.included).map(c => c.key).join(' + ') || '0'}
            </code>
          </div>
        </div>
      </div>
    </div>
  );
};
