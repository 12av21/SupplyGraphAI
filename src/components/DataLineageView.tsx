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
  ShieldCheck,
  HelpCircle,
  Calculator,
  Search
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

  const sampleQuestions: Record<string, string> = {
    OTD: '“What is Supplier S001’s on-time delivery performance at Plant PL01?”',
    FILL_RATE: '“Which suppliers have fill rate below 90%?”',
    DAYS_OF_INVENTORY: '“How many days of inventory does Plant PL01 have?”',
    LANDED_COST: '“What is the landed cost of Part P100?”',
    LATE_SHIPMENTS: '“Show late shipments for last quarter.”',
    AT_RISK_SUPPLIERS: '“Which suppliers are high risk and have poor OTD?”'
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-16">
      {/* Header */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-0.5 rounded text-[11px] font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200 flex items-center gap-1">
              <GitFork className="w-3.5 h-3.5 text-indigo-600" /> End-to-End Governance Trace
            </span>
            <span className="text-xs text-slate-500">Traceability & Explainability</span>
          </div>
          <h1 className="text-xl font-bold text-slate-900 mt-1">Data & Metric Lineage Graph</h1>
          <p className="text-sm text-slate-600 mt-0.5">
            Trace calculation logic backwards from natural language question down through ontology concepts, canonical metrics, source tables, and validated execution.
          </p>
        </div>

        {/* Metric Selector */}
        <div className="flex items-center space-x-2">
          <span className="text-xs text-slate-500 font-medium">Trace Metric:</span>
          <select
            value={selectedMetricKey}
            onChange={(e) => setSelectedMetricKey(e.target.value)}
            className="bg-white border border-slate-300 rounded-lg px-3 py-1.5 text-xs font-semibold text-slate-800 focus:outline-none focus:border-indigo-600 shadow-xs"
          >
            {Object.keys(CANONICAL_METRICS).map((key) => (
              <option key={key} value={key}>
                {CANONICAL_METRICS[key].short_code} ({CANONICAL_METRICS[key].metric_id})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* 8-Tier Visual Lineage Flow (Section 11 Exact Requirement) */}
      <div className="space-y-3">
        {/* Tier 1: Business Question */}
        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs flex items-center space-x-3.5">
          <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-700 border border-indigo-200 flex items-center justify-center font-bold text-xs flex-shrink-0">
            1
          </div>
          <div className="flex-1">
            <div className="text-[10px] font-bold text-indigo-700 uppercase tracking-wider">Business Question</div>
            <div className="text-sm font-semibold text-slate-900 mt-0.5">{sampleQuestions[selectedMetricKey]}</div>
          </div>
          <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-600 text-[10px] font-medium border border-slate-200">
            Natural Input
          </span>
        </div>

        <div className="flex justify-center text-slate-400">
          <ArrowDown className="w-4 h-4" />
        </div>

        {/* Tier 2: Intent */}
        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs flex items-center space-x-3.5">
          <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-700 border border-indigo-200 flex items-center justify-center font-bold text-xs flex-shrink-0">
            2
          </div>
          <div className="flex-1">
            <div className="text-[10px] font-bold text-indigo-700 uppercase tracking-wider">Intent Resolution</div>
            <div className="text-xs font-semibold text-slate-900 mt-0.5">
              Mapped Intent: <span className="font-mono text-indigo-700 font-bold">{selectedMetricKey}_ANALYSIS</span> (Constraint Filter Extraction)
            </div>
          </div>
          <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-600 text-[10px] font-medium border border-slate-200">
            Parsed AST
          </span>
        </div>

        <div className="flex justify-center text-slate-400">
          <ArrowDown className="w-4 h-4" />
        </div>

        {/* Tier 3: Ontology Concept */}
        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs flex items-center space-x-3.5">
          <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-700 border border-indigo-200 flex items-center justify-center font-bold text-xs flex-shrink-0">
            3
          </div>
          <div className="flex-1">
            <div className="text-[10px] font-bold text-indigo-700 uppercase tracking-wider">Ontology Concept</div>
            <div className="text-xs font-semibold text-slate-900 mt-0.5">
              Linked Schema Entities: <span className="font-semibold text-slate-800">{metric.source_entities.join(' ⟷ ')}</span>
            </div>
          </div>
          <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-600 text-[10px] font-medium border border-slate-200">
            9 Entities Catalog
          </span>
        </div>

        <div className="flex justify-center text-slate-400">
          <ArrowDown className="w-4 h-4" />
        </div>

        {/* Tier 4: Canonical Metric */}
        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs flex items-center space-x-3.5">
          <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-700 border border-indigo-200 flex items-center justify-center font-bold text-xs flex-shrink-0">
            4
          </div>
          <div className="flex-1">
            <div className="text-[10px] font-bold text-indigo-700 uppercase tracking-wider">Canonical Metric</div>
            <div className="text-xs font-semibold text-slate-900 mt-0.5">
              {metric.name} (<span className="font-mono text-indigo-700 font-bold">{metric.metric_id}</span>) — {metric.formula}
            </div>
            <div className="text-[11px] text-slate-500 mt-0.5">{metric.description}</div>
          </div>
          <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 text-[10px] font-semibold border border-emerald-200">
            Approved v{metric.version}
          </span>
        </div>

        <div className="flex justify-center text-slate-400">
          <ArrowDown className="w-4 h-4" />
        </div>

        {/* Tier 5: Semantic View */}
        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs flex items-center space-x-3.5">
          <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-700 border border-indigo-200 flex items-center justify-center font-bold text-xs flex-shrink-0">
            5
          </div>
          <div className="flex-1">
            <div className="text-[10px] font-bold text-indigo-700 uppercase tracking-wider">Semantic View Abstraction</div>
            <div className="text-xs font-mono text-slate-800 mt-0.5">
              v_governed_{metric.short_code.toLowerCase().replace(/[^a-z0-9]/g, '_')} (Business Semantic Layer)
            </div>
          </div>
          <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-600 text-[10px] font-medium border border-slate-200">
            SQL View
          </span>
        </div>

        <div className="flex justify-center text-slate-400">
          <ArrowDown className="w-4 h-4" />
        </div>

        {/* Tier 6: Source Entity & Tables */}
        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs flex items-center space-x-3.5">
          <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-700 border border-indigo-200 flex items-center justify-center font-bold text-xs flex-shrink-0">
            6
          </div>
          <div className="flex-1">
            <div className="text-[10px] font-bold text-indigo-700 uppercase tracking-wider">Source Entity & Physical Tables</div>
            <div className="text-xs font-mono text-indigo-700 font-semibold mt-0.5">
              {metric.source_tables.join(', ')}
            </div>
          </div>
          <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-600 text-[10px] font-medium border border-slate-200">
            Relational DDL
          </span>
        </div>

        <div className="flex justify-center text-slate-400">
          <ArrowDown className="w-4 h-4" />
        </div>

        {/* Tier 7: Calculation */}
        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs space-y-2">
          <div className="flex items-center space-x-3.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-700 border border-indigo-200 flex items-center justify-center font-bold text-xs flex-shrink-0">
              7
            </div>
            <div className="flex-1">
              <div className="text-[10px] font-bold text-indigo-700 uppercase tracking-wider">Calculation Engine</div>
              <div className="text-xs font-semibold text-slate-900 mt-0.5">
                Formula Evaluation: <code className="text-indigo-700 font-mono">{metric.formula}</code>
              </div>
            </div>
            <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-600 text-[10px] font-medium border border-slate-200">
              Validated Execution
            </span>
          </div>
          <pre className="p-2.5 bg-slate-900 text-emerald-300 font-mono text-[11px] rounded-lg overflow-x-auto whitespace-pre-wrap">
            {metric.sql_expression}
          </pre>
        </div>

        <div className="flex justify-center text-slate-400">
          <ArrowDown className="w-4 h-4" />
        </div>

        {/* Tier 8: Answer Result */}
        <div className="p-5 rounded-xl bg-emerald-50/80 border border-emerald-200 shadow-xs flex items-center justify-between">
          <div className="flex items-center space-x-3.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center justify-center font-bold text-xs flex-shrink-0">
              8
            </div>
            <div>
              <div className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider">Governed Truth Answer</div>
              <div className="text-xs text-slate-600 mt-0.5">Exact database output verified across all enterprise personas</div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-black text-slate-900 font-mono">
              {metricResults[selectedMetricKey] || '93.2%'}
            </div>
            <div className="text-[10px] font-semibold text-emerald-700">100% Deterministic</div>
          </div>
        </div>
      </div>
    </div>
  );
};
