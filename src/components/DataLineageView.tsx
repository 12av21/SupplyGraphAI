import React, { useState } from 'react';
import {
  GitFork,
  Database,
  Layers,
  ArrowDown,
  CheckCircle2,
  Code2,
  Table,
  Cpu,
  ShieldCheck
} from 'lucide-react';
import { CANONICAL_METRICS, CanonicalMetric } from '../metrics/registry';

export const DataLineageView: React.FC = () => {
  const [selectedMetricKey, setSelectedMetricKey] = useState<string>('OTD');
  const metric: CanonicalMetric = CANONICAL_METRICS[selectedMetricKey] || CANONICAL_METRICS['OTD'];

  const metricResults: Record<string, string> = {
    OTD: '93.2%',
    FILL_RATE: '96.4%',
    DAYS_OF_INVENTORY: '18.7 days',
    LANDED_COST: '$12.4M',
    LATE_SHIPMENTS: '184 consignments',
    AT_RISK_SUPPLIERS: '7 suppliers'
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-16">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-0.5 rounded text-[11px] font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 flex items-center gap-1">
              <GitFork className="w-3.5 h-3.5" /> End-to-End Traceability
            </span>
            <span className="text-xs text-slate-400">Deterministic Lineage Graph</span>
          </div>
          <h1 className="text-xl font-bold text-white mt-1">Data & Metric Lineage Graph</h1>
          <p className="text-sm text-slate-400 mt-0.5">
            Trace calculation logic backwards from final dashboard KPI to semantic concepts, ontology entities, and raw relational tables.
          </p>
        </div>

        {/* Metric Switcher */}
        <div className="flex items-center space-x-2">
          <span className="text-xs text-slate-400">Select Metric:</span>
          <select
            value={selectedMetricKey}
            onChange={(e) => setSelectedMetricKey(e.target.value)}
            className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-1.5 text-xs font-semibold text-white focus:outline-none focus:border-indigo-500"
          >
            {Object.keys(CANONICAL_METRICS).map((key) => (
              <option key={key} value={key}>
                {CANONICAL_METRICS[key].short_code} ({CANONICAL_METRICS[key].metric_id})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Visual Vertical Lineage Flow (Section 10 Verbatim) */}
      <div className="space-y-4">
        {/* Node 1: Canonical Metric */}
        <div className="p-5 rounded-xl bg-slate-900 border border-slate-800 relative">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 rounded-lg bg-indigo-500/15 text-indigo-400 flex items-center justify-center font-bold text-sm">
                1
              </div>
              <div>
                <div className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider">LEVEL 1: CANONICAL METRIC</div>
                <h3 className="text-base font-bold text-white mt-0.5">{metric.name} ({metric.short_code})</h3>
              </div>
            </div>
            <span className="px-2.5 py-1 rounded bg-slate-800 font-mono text-xs text-slate-300 border border-slate-700">
              {metric.metric_id}
            </span>
          </div>
          <p className="text-xs text-slate-300 mt-3 leading-relaxed">{metric.description}</p>
        </div>

        <div className="flex justify-center text-slate-500">
          <ArrowDown className="w-5 h-5 animate-bounce" />
        </div>

        {/* Node 2: Semantic Definition */}
        <div className="p-5 rounded-xl bg-slate-900 border border-slate-800 relative">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 rounded-lg bg-cyan-500/15 text-cyan-400 flex items-center justify-center font-bold text-sm">
                2
              </div>
              <div>
                <div className="text-[10px] font-bold text-cyan-400 uppercase tracking-wider">LEVEL 2: SEMANTIC DEFINITION</div>
                <h3 className="text-base font-bold text-white mt-0.5">Governed Business Rule & SLA</h3>
              </div>
            </div>
            <span className="px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-400 text-xs font-semibold">
              {metric.status} v{metric.version}
            </span>
          </div>
          <p className="text-xs text-slate-300 mt-3 p-3 rounded-lg bg-slate-800/40 border border-slate-800 leading-relaxed font-medium">
            "{metric.business_definition}"
          </p>
        </div>

        <div className="flex justify-center text-slate-500">
          <ArrowDown className="w-5 h-5" />
        </div>

        {/* Node 3: Ontology Entities */}
        <div className="p-5 rounded-xl bg-slate-900 border border-slate-800 relative">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 rounded-lg bg-purple-500/15 text-purple-400 flex items-center justify-center font-bold text-sm">
                3
              </div>
              <div>
                <div className="text-[10px] font-bold text-purple-400 uppercase tracking-wider">LEVEL 3: ONTOLOGY ENTITIES</div>
                <h3 className="text-base font-bold text-white mt-0.5">Participating Business Objects</h3>
              </div>
            </div>
            <span className="text-xs text-slate-400 font-mono">{metric.source_entities.length} Linked Objects</span>
          </div>

          <div className="flex flex-wrap gap-2 mt-2">
            {metric.source_entities.map((ent) => (
              <span key={ent} className="px-3 py-1.5 rounded-lg bg-slate-800 text-slate-200 border border-slate-700 text-xs font-semibold flex items-center space-x-1.5">
                <Layers className="w-3.5 h-3.5 text-purple-400" />
                <span>{ent}</span>
              </span>
            ))}
          </div>
        </div>

        <div className="flex justify-center text-slate-500">
          <ArrowDown className="w-5 h-5" />
        </div>

        {/* Node 4: Source Tables */}
        <div className="p-5 rounded-xl bg-slate-900 border border-slate-800 relative">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 rounded-lg bg-amber-500/15 text-amber-400 flex items-center justify-center font-bold text-sm">
                4
              </div>
              <div>
                <div className="text-[10px] font-bold text-amber-400 uppercase tracking-wider">LEVEL 4: PHYSICAL STORAGE</div>
                <h3 className="text-base font-bold text-white mt-0.5">Relational Tables & Foreign Keys</h3>
              </div>
            </div>
            <span className="text-xs text-slate-400 font-mono">SQLite / SQL DDL</span>
          </div>

          <div className="flex flex-wrap gap-2">
            {metric.source_tables.map((tbl) => (
              <span key={tbl} className="px-3 py-1.5 rounded-lg bg-slate-950 font-mono text-amber-300 border border-slate-800 text-xs flex items-center space-x-1.5">
                <Table className="w-3.5 h-3.5 text-amber-400" />
                <span>{tbl}</span>
              </span>
            ))}
          </div>
        </div>

        <div className="flex justify-center text-slate-500">
          <ArrowDown className="w-5 h-5" />
        </div>

        {/* Node 5: Calculation Expression */}
        <div className="p-5 rounded-xl bg-slate-900 border border-slate-800 relative">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 rounded-lg bg-blue-500/15 text-blue-400 flex items-center justify-center font-bold text-sm">
                5
              </div>
              <div>
                <div className="text-[10px] font-bold text-blue-400 uppercase tracking-wider">LEVEL 5: MATHEMATICAL ENGINE</div>
                <h3 className="text-base font-bold text-white mt-0.5">Formula Evaluation & SQL Aggregation</h3>
              </div>
            </div>
            <span className="text-xs font-mono text-indigo-400">Formula: {metric.formula}</span>
          </div>

          <pre className="p-3 bg-slate-950 rounded-lg border border-slate-800 font-mono text-emerald-400 text-xs overflow-x-auto whitespace-pre-wrap">
            {metric.sql_expression}
          </pre>
        </div>

        <div className="flex justify-center text-slate-500">
          <ArrowDown className="w-5 h-5" />
        </div>

        {/* Node 6: Governed Result */}
        <div className="p-6 rounded-xl bg-gradient-to-r from-emerald-950/40 via-slate-900 to-indigo-950/40 border border-emerald-500/40 shadow-lg">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-sm">
                6
              </div>
              <div>
                <div className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider">LEVEL 6: GOVERNED TRUTH OUTCOME</div>
                <h3 className="text-base font-bold text-white mt-0.5">Deterministic Database Value</h3>
              </div>
            </div>
            <div className="text-left sm:text-right">
              <div className="text-xs text-slate-400">Verified Output</div>
              <div className="text-3xl font-black text-white font-mono mt-0.5">
                {metricResults[selectedMetricKey] || '93.2%'}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
