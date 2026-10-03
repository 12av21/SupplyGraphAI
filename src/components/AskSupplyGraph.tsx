import React, { useState } from 'react';
import {
  Send,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  AlertTriangle,
  Code2,
  Layers,
  HelpCircle,
  Clock,
  ArrowRight,
  Database,
  BarChart3
} from 'lucide-react';
import { conversationalEngine, ConversationalResponse } from '../ai/conversationalEngine';
import { PersonaType } from './TopBar';

interface AskSupplyGraphProps {
  currentPersona: PersonaType;
  onOpenLineageForMetric?: (metricId: string) => void;
}

export const AskSupplyGraph: React.FC<AskSupplyGraphProps> = ({ currentPersona, onOpenLineageForMetric }) => {
  const [inputQuery, setInputQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [history, setHistory] = useState<ConversationalResponse[]>([]);
  const [expandedQueryId, setExpandedQueryId] = useState<string | null>(null);

  // Preconfigured Demo Mode Buttons
  const demoButtons = [
    { label: 'Supplier Performance', query: 'What is the OTD for Supplier S001 at Plant PL01?' },
    { label: 'Late Deliveries', query: 'Which suppliers caused the most late deliveries to PL01?' },
    { label: 'Inventory Risk', query: 'How many days of inventory does Plant PL01 have?' },
    { label: 'Landed Cost', query: 'What is the landed cost of Part P100?' },
    { label: 'Carrier Delay Rates', query: 'Which carrier has the highest delay rate?' },
    { label: 'Why did OTD fall?', query: 'Why did Plant PL01 OTD decrease?' }
  ];

  const handleExecuteQuestion = async (queryText: string) => {
    if (!queryText.trim() || isLoading) return;
    setIsLoading(true);
    try {
      const response = await conversationalEngine.processQuestion(queryText, currentPersona);
      setHistory((prev) => [response, ...prev]);
      setInputQuery('');
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-16">
      {/* Header Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-indigo-500/15 text-indigo-300 border border-indigo-500/30 flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-indigo-400" /> Governed NL Pipeline
              </span>
              <span className="text-xs text-slate-400">Persona: <strong className="text-slate-200">{currentPersona}</strong></span>
            </div>
            <h1 className="text-xl font-bold text-white mt-1">Ask SupplyGraph Conversational Analytics</h1>
            <p className="text-sm text-slate-400 mt-0.5">
              Natural language translated strictly through Ontology → Metric Registry → Safe SQL. No unverified hallucinated definitions.
            </p>
          </div>

          <div className="flex items-center space-x-2 text-xs text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1.5 rounded-lg">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>AI Safety Gate Active</span>
          </div>
        </div>

        {/* Demo Mode Action Buttons */}
        <div className="mt-4 pt-4 border-t border-slate-800">
          <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2">
            Demo Mode Quick-Run Scenarios:
          </div>
          <div className="flex flex-wrap gap-2">
            {demoButtons.map((btn, idx) => (
              <button
                key={idx}
                onClick={() => handleExecuteQuestion(btn.query)}
                className="px-3 py-1.5 text-xs font-medium rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-200 border border-slate-700 hover:border-indigo-500/50 transition-all flex items-center space-x-1"
              >
                <span>{btn.label}</span>
                <ArrowRight className="w-3 h-3 text-slate-400" />
              </button>
            ))}
            <button
              onClick={() => handleExecuteQuestion('What is supplier happiness?')}
              className="px-3 py-1.5 text-xs font-medium rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 transition-all flex items-center space-x-1"
              title="Test Governance rejection of unapproved metric"
            >
              <span>Test Unapproved Metric</span>
            </button>
          </div>
        </div>
      </div>

      {/* Query Input Bar */}
      <div className="relative">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleExecuteQuestion(inputQuery);
          }}
          className="flex items-center space-x-2 bg-slate-900 border border-slate-700 rounded-xl p-2 shadow-lg focus-within:border-indigo-500 transition-all"
        >
          <input
            type="text"
            value={inputQuery}
            onChange={(e) => setInputQuery(e.target.value)}
            placeholder={`Ask a supply chain question as ${currentPersona} (e.g. "What is the OTD for Supplier S001?", "Why did OTD fall at PL01?")...`}
            className="flex-1 bg-transparent px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none"
          />
          <button
            type="submit"
            disabled={isLoading || !inputQuery.trim()}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-xs font-semibold rounded-lg flex items-center space-x-2 transition-colors"
          >
            {isLoading ? (
              <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
            ) : (
              <>
                <span>Run Governed Query</span>
                <Send className="w-3.5 h-3.5" />
              </>
            )}
          </button>
        </form>
      </div>

      {/* Answers Feed */}
      <div className="space-y-6">
        {history.length === 0 && (
          <div className="text-center py-12 border border-dashed border-slate-800 rounded-xl bg-slate-900/30">
            <div className="w-12 h-12 rounded-xl bg-slate-800 text-indigo-400 mx-auto flex items-center justify-center mb-3">
              <Layers className="w-6 h-6" />
            </div>
            <h3 className="text-base font-semibold text-slate-200">No questions asked yet</h3>
            <p className="text-xs text-slate-400 max-w-md mx-auto mt-1">
              Select one of the Demo Mode buttons above or type a natural language inquiry to see the governed semantic translation in action.
            </p>
          </div>
        )}

        {history.map((resp, index) => {
          const isExpanded = expandedQueryId === `${index}`;
          const isWhyAnalysis = !!resp.whyFactors && resp.whyFactors.length > 0;

          return (
            <div
              key={index}
              className={`rounded-xl border transition-all ${
                resp.success
                  ? 'bg-slate-900/90 border-slate-800 shadow-sm'
                  : 'bg-rose-950/20 border-rose-900/40'
              }`}
            >
              {/* Question Header */}
              <div className="p-5 border-b border-slate-800/80 flex items-start justify-between gap-4">
                <div>
                  <div className="flex items-center space-x-2 text-xs text-slate-400 mb-1">
                    <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-medium">
                      {resp.persona} Persona
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1 font-mono">
                      <Clock className="w-3 h-3 text-slate-400" /> {resp.executionTimeMs}ms
                    </span>
                  </div>
                  <h3 className="text-base font-semibold text-white">“{resp.question}”</h3>
                </div>

                {resp.success ? (
                  <div className="flex items-center space-x-1.5 px-2.5 py-1 rounded bg-emerald-500/10 text-emerald-400 text-xs font-medium border border-emerald-500/20">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Governed</span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-1.5 px-2.5 py-1 rounded bg-rose-500/10 text-rose-400 text-xs font-medium border border-rose-500/20">
                    <AlertTriangle className="w-3.5 h-3.5" />
                    <span>Unapproved Metric</span>
                  </div>
                )}
              </div>

              {/* Trust & Explainability Body */}
              <div className="p-5 space-y-4">
                {/* 1. Answer Highlight */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-lg bg-slate-800/40 border border-slate-700/60 gap-4">
                  <div>
                    <div className="text-[11px] font-semibold text-indigo-400 uppercase tracking-wider">
                      Governed Answer
                    </div>
                    <p className="text-sm font-medium text-slate-200 mt-1 leading-relaxed">
                      {resp.answerSummary}
                    </p>
                  </div>
                  <div className="text-left sm:text-right flex-shrink-0">
                    <div className="text-[11px] text-slate-400">Canonical Result</div>
                    <div className="text-2xl font-black text-white font-mono mt-0.5">
                      {resp.metricResultFormatted}
                    </div>
                  </div>
                </div>

                {/* 2. Why Analysis: Contributing Factors Evidence */}
                {isWhyAnalysis && resp.whyFactors && (
                  <div className="space-y-3 pt-2">
                    <div className="flex items-center justify-between">
                      <div className="text-xs font-bold text-slate-200 flex items-center space-x-2">
                        <BarChart3 className="w-4 h-4 text-rose-400" />
                        <span>Calculated Root-Cause Contributing Factors (Database Evidence)</span>
                      </div>
                      <span className="text-[11px] text-slate-400">Target Plant: PL01</span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      {resp.whyFactors.slice(0, 3).map((f, i) => (
                        <div key={i} className="p-3 rounded-lg bg-slate-800/60 border border-slate-700 text-xs space-y-1">
                          <div className="flex items-center justify-between text-slate-400 text-[11px]">
                            <span className="font-semibold text-slate-300">{f.factor_category || f.category}</span>
                            <span className="px-1.5 py-0.5 rounded bg-rose-500/10 text-rose-400 font-mono">
                              {f.late_shipments || f.lateCount} Late
                            </span>
                          </div>
                          <div className="font-bold text-white truncate text-sm">
                            {f.factor_name || f.name}
                          </div>
                          <div className="text-slate-400 text-[11px]">
                            ID: <span className="font-mono text-slate-300">{f.factor_id || f.id}</span>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="p-3 rounded-lg bg-slate-800/20 border border-slate-800 text-[11px] text-slate-400">
                      <strong className="text-slate-300">Governance Note:</strong> Contributing factors are mathematically determined from foreign-key relationships across <code className="text-indigo-300">shipments</code>, <code className="text-indigo-300">suppliers</code>, <code className="text-indigo-300">carriers</code>, and <code className="text-indigo-300">parts</code> tables.
                    </div>
                  </div>
                )}

                {/* 3. Multi-row Data Table if grouped query */}
                {resp.tableData && resp.tableData.length > 0 && !isWhyAnalysis && (
                  <div className="border border-slate-800 rounded-lg overflow-hidden mt-3">
                    <div className="px-3 py-2 bg-slate-800/60 text-xs font-semibold text-slate-300 border-b border-slate-800 flex justify-between">
                      <span>Query Result Set ({resp.tableData.length} records)</span>
                      <span className="text-slate-400 font-mono text-[11px]">Validated Read-Only</span>
                    </div>
                    <div className="overflow-x-auto max-h-56">
                      <table className="w-full text-left text-xs">
                        <thead className="bg-slate-800/40 text-slate-400 sticky top-0">
                          <tr>
                            {Object.keys(resp.tableData[0]).map((col) => (
                              <th key={col} className="p-2 font-medium">{col}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800/60">
                          {resp.tableData.slice(0, 10).map((row, rIdx) => (
                            <tr key={rIdx} className="hover:bg-slate-800/20">
                              {Object.values(row).map((val: any, cIdx) => (
                                <td key={cIdx} className="p-2 text-slate-300 font-mono text-[11px]">
                                  {typeof val === 'number' ? val.toLocaleString() : String(val)}
                                </td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* 4. Metric Metadata & Governance Cards (Trust / Explainability Spec) */}
                {resp.canonicalMetric && (
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-xs pt-1">
                    <div className="p-3 rounded-lg bg-slate-800/30 border border-slate-800">
                      <div className="text-[10px] text-slate-400 font-medium uppercase">Metric ID & Name</div>
                      <div className="font-bold text-white mt-0.5 truncate">{resp.canonicalMetric.name}</div>
                      <div className="text-[11px] text-slate-400 font-mono">{resp.canonicalMetric.metric_id}</div>
                    </div>

                    <div className="p-3 rounded-lg bg-slate-800/30 border border-slate-800">
                      <div className="text-[10px] text-slate-400 font-medium uppercase">Canonical Formula</div>
                      <div className="font-mono text-indigo-300 mt-0.5 text-[11px] truncate">
                        {resp.canonicalMetric.formula}
                      </div>
                      <div className="text-[10px] text-slate-400">Unit: {resp.canonicalMetric.unit}</div>
                    </div>

                    <div className="p-3 rounded-lg bg-slate-800/30 border border-slate-800">
                      <div className="text-[10px] text-slate-400 font-medium uppercase">Data Scope & Filters</div>
                      <div className="text-slate-300 mt-0.5 text-[11px]">
                        Period: {resp.dataUsed.period}
                      </div>
                      <div className="text-[10px] text-slate-400">
                        {Object.entries(resp.dataUsed.filters).map(([k, v]) => `${k}: ${v}`).join(' | ') || 'Full Fleet'}
                      </div>
                    </div>

                    <div className="p-3 rounded-lg bg-slate-800/30 border border-slate-800">
                      <div className="text-[10px] text-slate-400 font-medium uppercase">Governance Status</div>
                      <div className="text-emerald-400 font-semibold mt-0.5 flex items-center gap-1">
                        <ShieldCheck className="w-3.5 h-3.5" /> Approved v{resp.canonicalMetric.version}
                      </div>
                      <div className="text-[10px] text-slate-400 truncate">Owner: {resp.canonicalMetric.owner}</div>
                    </div>
                  </div>
                )}

                {/* 5. Error & Suggestions for Unapproved Metric */}
                {!resp.success && resp.suggestions && (
                  <div className="p-4 rounded-lg bg-rose-950/30 border border-rose-800/50 space-y-2">
                    <div className="text-xs font-semibold text-rose-300">
                      Approved Canonical Metrics You Can Ask:
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {resp.suggestions.map((s, i) => (
                        <button
                          key={i}
                          onClick={() => handleExecuteQuestion(`What is ${s}?`)}
                          className="px-2.5 py-1 text-xs rounded bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700"
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* 6. Expandable Technical Query & SQL Panel */}
                {resp.success && (
                  <div className="border border-slate-800 rounded-lg overflow-hidden">
                    <button
                      onClick={() => setExpandedQueryId(isExpanded ? null : `${index}`)}
                      className="w-full px-4 py-2.5 bg-slate-800/30 hover:bg-slate-800/50 text-xs font-medium text-slate-300 flex items-center justify-between transition-colors"
                    >
                      <div className="flex items-center space-x-2">
                        <Code2 className="w-4 h-4 text-indigo-400" />
                        <span>Inspect Governed Query & Lineage (Semantic JSON & Safe SQL)</span>
                      </div>
                      {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </button>

                    {isExpanded && (
                      <div className="p-4 bg-slate-950/70 border-t border-slate-800 space-y-3 text-xs">
                        <div>
                          <div className="text-[10px] font-semibold uppercase text-slate-400 mb-1">
                            Intermediate Governed Semantic Representation:
                          </div>
                          <pre className="p-3 bg-slate-900 rounded border border-slate-800 text-indigo-300 font-mono text-[11px] overflow-x-auto">
                            {JSON.stringify(resp.compilationResult.semanticQuery, null, 2)}
                          </pre>
                        </div>

                        <div>
                          <div className="text-[10px] font-semibold uppercase text-slate-400 mb-1">
                            Validated Read-Only SQL Generated:
                          </div>
                          <pre className="p-3 bg-slate-900 rounded border border-slate-800 text-emerald-300 font-mono text-[11px] overflow-x-auto whitespace-pre-wrap">
                            {resp.compilationResult.generatedSql}
                          </pre>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
