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
  Clock,
  ArrowRight,
  Database,
  BarChart3,
  UserCircle2,
  GitFork
} from 'lucide-react';
import { conversationalEngine, ConversationalResponse } from '../ai/conversationalEngine';
import { PersonaType } from './TopBar';

interface AskSupplyGraphProps {
  currentPersona: PersonaType;
  onOpenLineageForMetric?: (metricId: string) => void;
}

export const AskSupplyGraph: React.FC<AskSupplyGraphProps> = ({ currentPersona, onOpenLineageForMetric }) => {
  const [selectedPersona, setSelectedPersona] = useState<PersonaType>(currentPersona);
  const [inputQuery, setInputQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [history, setHistory] = useState<ConversationalResponse[]>([]);
  const [expandedQueryId, setExpandedQueryId] = useState<string | null>(null);

  // Sync with prop if it changes
  React.useEffect(() => {
    setSelectedPersona(currentPersona);
  }, [currentPersona]);

  // Suggested enterprise query chips
  const suggestedQueries = [
    { label: 'Supplier S001 OTD', query: 'What is the OTD for Supplier S001 at Plant PL01?' },
    { label: 'Late Deliveries at PL01', query: 'Which suppliers caused the most late deliveries to PL01?' },
    { label: 'Plant Inventory Runway', query: 'How many days of inventory does Plant PL01 have?' },
    { label: 'Landed Cost of P100', query: 'What is the landed cost of Part P100?' },
    { label: 'Carrier Delay Rates', query: 'Which carrier has the highest delay rate?' },
    { label: 'Why did OTD fall?', query: 'Why did Plant PL01 OTD decrease?' }
  ];

  const handleExecute = async (queryText: string) => {
    if (!queryText.trim() || isLoading) return;
    setIsLoading(true);
    try {
      const response = await conversationalEngine.processQuestion(queryText, selectedPersona);
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
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <span className="px-2.5 py-0.5 rounded text-[11px] font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-indigo-600" /> Governed Conversational Layer
              </span>
              <span className="text-xs text-slate-500">Constraint-Driven Semantic Resolution</span>
            </div>
            <h1 className="text-xl font-bold text-slate-900 mt-1">Ask SupplyGraph Analytics</h1>
            <p className="text-sm text-slate-600 mt-0.5">
              Natural language queries are compiled into governed semantic ASTs and executed against canonical metric views.
            </p>
          </div>

          <div className="flex items-center space-x-2 text-xs text-emerald-800 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-lg">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span className="font-semibold">Governance Guardrail Active</span>
          </div>
        </div>

        {/* Persona Selector inside Query Area */}
        <div className="mt-5 pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center space-x-2">
            <span className="text-xs font-semibold text-slate-500 flex items-center gap-1">
              <UserCircle2 className="w-3.5 h-3.5 text-slate-400" /> Asking as:
            </span>
            <div className="inline-flex bg-slate-100 p-0.5 rounded-lg border border-slate-200">
              {(['Planning', 'Procurement', 'Logistics'] as PersonaType[]).map((p) => (
                <button
                  key={p}
                  onClick={() => setSelectedPersona(p)}
                  className={`px-3 py-1 text-xs rounded-md transition-all font-medium ${
                    selectedPersona === p
                      ? 'bg-white text-indigo-700 shadow-xs border border-slate-200 font-semibold'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          <div className="text-[11px] text-slate-400">
            Current Persona Context: <strong className="text-slate-700">{selectedPersona}</strong>
          </div>
        </div>

        {/* Query Input Bar */}
        <div className="mt-3">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleExecute(inputQuery);
            }}
            className="flex items-center space-x-2 bg-slate-50 border border-slate-300 rounded-xl p-2 shadow-xs focus-within:bg-white focus-within:border-indigo-600 focus-within:ring-2 focus-within:ring-indigo-100 transition-all"
          >
            <input
              type="text"
              value={inputQuery}
              onChange={(e) => setInputQuery(e.target.value)}
              placeholder="Ask a supply-chain question (e.g. «What is the on-time delivery rate for Supplier S001 at Plant PL01?»)..."
              className="flex-1 bg-transparent px-3 py-2 text-sm text-slate-900 placeholder-slate-400 focus:outline-none"
            />
            <button
              type="submit"
              disabled={isLoading || !inputQuery.trim()}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white text-xs font-semibold rounded-lg flex items-center space-x-2 transition-colors shadow-xs"
            >
              {isLoading ? (
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
              ) : (
                <>
                  <span>Run Query</span>
                  <Send className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </form>
        </div>

        {/* Suggested Queries */}
        <div className="mt-3 flex flex-wrap items-center gap-1.5">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mr-1">
            Suggested:
          </span>
          {suggestedQueries.map((s, idx) => (
            <button
              key={idx}
              onClick={() => handleExecute(s.query)}
              className="px-2.5 py-1 text-xs rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 hover:border-slate-300 transition-colors"
            >
              {s.label}
            </button>
          ))}
          <button
            onClick={() => handleExecute('What is supplier happiness?')}
            className="px-2.5 py-1 text-xs rounded-md bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 transition-colors"
            title="Demonstrate governance rejection of unapproved metric"
          >
            Test Unapproved Metric
          </button>
        </div>
      </div>

      {/* Answer Stream */}
      <div className="space-y-6">
        {history.length === 0 && (
          <div className="text-center py-12 border border-dashed border-slate-300 rounded-xl bg-white shadow-xs">
            <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 mx-auto flex items-center justify-center mb-3">
              <Layers className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-800">Ask a governed supply chain question</h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto mt-1">
              Select one of the suggested query chips above or type a custom question to inspect the governed AST, validation gate, and SQL lineage.
            </p>
          </div>
        )}

        {history.map((resp, index) => {
          const isExpanded = expandedQueryId === `${index}`;
          const isWhyAnalysis = !!resp.whyFactors && resp.whyFactors.length > 0;

          return (
            <div
              key={index}
              className={`rounded-xl border shadow-xs transition-all ${
                resp.success ? 'bg-white border-slate-200' : 'bg-rose-50/50 border-rose-200'
              }`}
            >
              {/* Question Header */}
              <div className="p-5 border-b border-slate-100 flex items-start justify-between gap-4">
                <div>
                  <div className="flex items-center space-x-2 text-xs text-slate-500 mb-1">
                    <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-semibold text-[11px]">
                      {resp.persona} Persona
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1 font-mono text-[11px] text-slate-500">
                      <Clock className="w-3 h-3 text-slate-400" /> {resp.executionTimeMs}ms
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-slate-900">“{resp.question}”</h3>
                </div>

                {resp.success ? (
                  <span className="px-2.5 py-1 rounded bg-emerald-50 text-emerald-700 text-xs font-semibold border border-emerald-200 flex items-center gap-1.5 flex-shrink-0">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Approved & Governed</span>
                  </span>
                ) : (
                  <span className="px-2.5 py-1 rounded bg-rose-100 text-rose-800 text-xs font-semibold border border-rose-300 flex items-center gap-1.5 flex-shrink-0">
                    <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
                    <span>Unapproved Metric Rejected</span>
                  </span>
                )}
              </div>

              {/* Answer Card Body */}
              <div className="p-5 space-y-4">
                {/* 1. Primary Answer Display */}
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <div className="text-[11px] font-bold text-indigo-700 uppercase tracking-wider">
                      Governed Answer Summary
                    </div>
                    <p className="text-sm font-semibold text-slate-900 mt-1 leading-relaxed">
                      {resp.answerSummary}
                    </p>
                  </div>
                  <div className="text-left sm:text-right flex-shrink-0">
                    <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Canonical Result</div>
                    <div className="text-3xl font-black text-slate-900 font-mono mt-0.5">
                      {resp.metricResultFormatted}
                    </div>
                  </div>
                </div>

                {/* 2. Structured Metadata Grid (Section 6 Requirements) */}
                {resp.canonicalMetric && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
                    <div className="p-3 rounded-lg bg-white border border-slate-200">
                      <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Metric & ID</div>
                      <div className="font-bold text-slate-900 mt-0.5 truncate">{resp.canonicalMetric.name}</div>
                      <div className="font-mono text-indigo-700 text-[11px]">{resp.canonicalMetric.metric_id}</div>
                    </div>

                    <div className="p-3 rounded-lg bg-white border border-slate-200">
                      <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Formula & Unit</div>
                      <div className="font-mono text-slate-800 mt-0.5 truncate text-[11px]">
                        {resp.canonicalMetric.formula}
                      </div>
                      <div className="text-slate-500 text-[11px]">Unit: {resp.canonicalMetric.unit}</div>
                    </div>

                    <div className="p-3 rounded-lg bg-white border border-slate-200">
                      <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Source Entities & Tables</div>
                      <div className="text-slate-800 font-medium mt-0.5 truncate text-[11px]">
                        {resp.canonicalMetric.source_entities.join(', ')}
                      </div>
                      <div className="font-mono text-slate-500 text-[10px]">
                        {resp.canonicalMetric.source_tables.join(', ')}
                      </div>
                    </div>

                    <div className="p-3 rounded-lg bg-white border border-slate-200">
                      <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Governance Status</div>
                      <div className="text-emerald-700 font-bold mt-0.5 flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Approved v{resp.canonicalMetric.version}
                      </div>
                      <div className="text-slate-500 text-[10px] truncate">Owner: {resp.canonicalMetric.owner}</div>
                    </div>
                  </div>
                )}

                {/* 3. Why-Analysis Contributing Factors (Calculated Database Evidence) */}
                {isWhyAnalysis && resp.whyFactors && (
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="text-xs font-bold text-slate-900 flex items-center space-x-2">
                        <BarChart3 className="w-4 h-4 text-rose-600" />
                        <span>Calculated Contributing Factors (Root-Cause Database Evidence)</span>
                      </div>
                      <span className="text-[11px] font-mono text-slate-500">Destination Plant: PL01</span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      {resp.whyFactors.slice(0, 3).map((f, i) => (
                        <div key={i} className="p-3 rounded-lg bg-white border border-slate-200 text-xs space-y-1 shadow-xs">
                          <div className="flex items-center justify-between text-slate-500 text-[11px]">
                            <span className="font-semibold text-slate-700">{f.factor_category || f.category}</span>
                            <span className="px-1.5 py-0.5 rounded bg-rose-50 text-rose-700 font-mono font-bold text-[10px]">
                              {f.late_shipments || f.lateCount} Late
                            </span>
                          </div>
                          <div className="font-bold text-slate-900 truncate">
                            {f.factor_name || f.name}
                          </div>
                          <div className="text-slate-500 text-[11px]">
                            ID: <span className="font-mono text-slate-800 font-semibold">{f.factor_id || f.id}</span>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="p-2.5 rounded-lg bg-white border border-slate-200 text-[11px] text-slate-600 flex items-start gap-2">
                      <ShieldCheck className="w-4 h-4 text-indigo-600 flex-shrink-0 mt-0.5" />
                      <span>
                        <strong className="text-slate-800">Governance Transparency:</strong> Contributing factors are mathematically calculated from foreign-key joins across <code className="text-indigo-700">shipments</code>, <code className="text-indigo-700">suppliers</code>, <code className="text-indigo-700">carriers</code>, and <code className="text-indigo-700">parts</code>.
                      </span>
                    </div>
                  </div>
                )}

                {/* 4. Table Result Set if grouped query */}
                {resp.tableData && resp.tableData.length > 0 && !isWhyAnalysis && (
                  <div className="border border-slate-200 rounded-lg overflow-hidden mt-3 shadow-xs">
                    <div className="px-3 py-2 bg-slate-100/70 text-xs font-semibold text-slate-700 border-b border-slate-200 flex justify-between">
                      <span>Query Result Set ({resp.tableData.length} records)</span>
                      <span className="text-slate-500 font-mono text-[11px]">Validated Read-Only</span>
                    </div>
                    <div className="overflow-x-auto max-h-56">
                      <table className="w-full text-left text-xs">
                        <thead className="bg-slate-50 text-slate-500 sticky top-0 border-b border-slate-200">
                          <tr>
                            {Object.keys(resp.tableData[0]).map((col) => (
                              <th key={col} className="p-2.5 font-semibold">{col}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {resp.tableData.slice(0, 10).map((row, rIdx) => (
                            <tr key={rIdx} className="hover:bg-slate-50/80 transition-colors">
                              {Object.values(row).map((val: any, cIdx) => (
                                <td key={cIdx} className="p-2.5 text-slate-700 font-mono text-[11px]">
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

                {/* 5. Suggestions for Unapproved Metrics */}
                {!resp.success && resp.suggestions && (
                  <div className="p-4 rounded-lg bg-rose-50 border border-rose-200 space-y-2">
                    <div className="text-xs font-semibold text-rose-800">
                      Approved Canonical Metrics You Can Ask:
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {resp.suggestions.map((s, i) => (
                        <button
                          key={i}
                          onClick={() => handleExecute(`What is ${s}?`)}
                          className="px-2.5 py-1 text-xs rounded-md bg-white hover:bg-slate-100 text-slate-800 border border-slate-300 font-medium"
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* 6. Expandable: Evidence & Lineage (Section 6 Requirement) */}
                {resp.success && (
                  <div className="border border-slate-200 rounded-lg overflow-hidden shadow-xs">
                    <button
                      onClick={() => setExpandedQueryId(isExpanded ? null : `${index}`)}
                      className="w-full px-4 py-2.5 bg-slate-50 hover:bg-slate-100 text-xs font-semibold text-slate-700 flex items-center justify-between transition-colors"
                    >
                      <div className="flex items-center space-x-2">
                        <GitFork className="w-4 h-4 text-indigo-600" />
                        <span>Evidence & Lineage (AST Representation & Safe SQL)</span>
                      </div>
                      {isExpanded ? <ChevronUp className="w-4 h-4 text-slate-500" /> : <ChevronDown className="w-4 h-4 text-slate-500" />}
                    </button>

                    {isExpanded && (
                      <div className="p-4 bg-white border-t border-slate-200 space-y-4 text-xs">
                        {/* Lineage Flow Diagram */}
                        <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-center font-mono text-[11px] text-slate-700 overflow-x-auto whitespace-nowrap">
                          <span className="font-semibold text-indigo-700">Question</span> → Intent → Ontology → Metric → Semantic View → Source → Calculation → <span className="font-bold text-emerald-700">Answer</span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                              Semantic Query AST (JSON):
                            </div>
                            <pre className="p-3 bg-slate-900 text-indigo-300 rounded-lg border border-slate-800 font-mono text-[11px] overflow-x-auto">
                              {JSON.stringify(resp.compilationResult.semanticQuery, null, 2)}
                            </pre>
                          </div>

                          <div>
                            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                              Validated Safe Read-Only SQL:
                            </div>
                            <pre className="p-3 bg-slate-900 text-emerald-300 rounded-lg border border-slate-800 font-mono text-[11px] overflow-x-auto whitespace-pre-wrap">
                              {resp.compilationResult.generatedSql}
                            </pre>
                          </div>
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
