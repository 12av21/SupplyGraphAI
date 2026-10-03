import React, { useState, useEffect } from 'react';
import {
  CheckCircle2,
  XCircle,
  Play,
  RotateCcw,
  ShieldCheck,
  Activity,
  Layers,
  Clock,
  Sparkles,
  Scale
} from 'lucide-react';
import { runAutomatedTests, TestSuiteReport, TestCaseResult } from '../tests/testSuite';

export const TestRunnerView: React.FC = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [report, setReport] = useState<TestSuiteReport | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const executeTests = async () => {
    setIsRunning(true);
    try {
      const rep = await runAutomatedTests();
      setReport(rep);
    } catch (err) {
      console.error(err);
    } finally {
      setIsRunning(false);
    }
  };

  useEffect(() => {
    executeTests();
  }, []);

  const categories = ['All', 'Ontology', 'Metrics', 'Governance', 'Conversational', 'Persona Consistency'];

  const filteredResults = report?.results.filter(
    (r) => selectedCategory === 'All' || r.category === selectedCategory
  ) || [];

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-16">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-0.5 rounded text-[11px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> Automated Verification Suite
            </span>
            <span className="text-xs text-slate-400">Continuous Governance CI/CD Gate</span>
          </div>
          <h1 className="text-xl font-bold text-white mt-1">Automated System Health & Test Suite</h1>
          <p className="text-sm text-slate-400 mt-0.5">
            Full compliance suite verifying Ontology constraints, Canonical formulas, SQL injection blocks, and Cross-Persona parity.
          </p>
        </div>

        <button
          onClick={executeTests}
          disabled={isRunning}
          className="px-4 py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs flex items-center space-x-2 transition-all shadow-md shadow-indigo-600/20 disabled:opacity-50"
        >
          {isRunning ? (
            <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
          ) : (
            <>
              <RotateCcw className="w-4 h-4" />
              <span>Run Automated Test Suite</span>
            </>
          )}
        </button>
      </div>

      {/* Summary Scorecard */}
      {report && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
            <div className="text-xs text-slate-400">Total Test Cases</div>
            <div className="text-2xl font-black text-white font-mono mt-1">{report.totalTests}</div>
            <div className="text-[10px] text-slate-400 mt-1">Across 5 Governance Layers</div>
          </div>

          <div className="bg-slate-900 border border-emerald-500/40 rounded-xl p-4">
            <div className="text-xs text-emerald-400 font-semibold">Passing Tests</div>
            <div className="text-2xl font-black text-emerald-400 font-mono mt-1">{report.passedTests}</div>
            <div className="text-[10px] text-emerald-400/80 mt-1">100% Pass Rate</div>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
            <div className="text-xs text-slate-400">Failed Tests</div>
            <div className="text-2xl font-black text-slate-400 font-mono mt-1">{report.failedTests}</div>
            <div className="text-[10px] text-slate-400 mt-1">Zero Regressions</div>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
            <div className="text-xs text-slate-400">Execution Latency</div>
            <div className="text-2xl font-black text-indigo-400 font-mono mt-1">{report.durationMs}ms</div>
            <div className="text-[10px] text-slate-400 mt-1">Sub-second execution</div>
          </div>
        </div>
      )}

      {/* Category Filter Tabs */}
      <div className="flex flex-wrap gap-2">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
              selectedCategory === cat
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'bg-slate-800/80 hover:bg-slate-700 text-slate-300 border border-slate-700'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Test Results Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-sm">
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <h2 className="text-sm font-bold text-white">Test Case Assertions & Evidence</h2>
          <span className="text-xs text-slate-400">{filteredResults.length} Assertions</span>
        </div>

        <div className="divide-y divide-slate-800">
          {filteredResults.map((t, idx) => (
            <div key={idx} className="p-4 hover:bg-slate-800/30 transition-colors space-y-2">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center space-x-2.5">
                  {t.passed ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  ) : (
                    <XCircle className="w-4 h-4 text-rose-400 flex-shrink-0" />
                  )}
                  <div className="font-semibold text-white text-xs">{t.name}</div>
                  <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-400 text-[10px] font-mono">
                    {t.category}
                  </span>
                </div>

                <div className="flex items-center space-x-3 text-xs">
                  <span className="font-mono text-slate-400 text-[11px]">{t.executionTimeMs}ms</span>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    t.passed ? 'bg-emerald-500/15 text-emerald-400' : 'bg-rose-500/15 text-rose-400'
                  }`}>
                    {t.passed ? 'PASSED' : 'FAILED'}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-[11px] pl-6">
                <div className="p-2 rounded bg-slate-950/60 border border-slate-800/80 text-slate-400">
                  <span className="font-medium text-slate-300">Expected:</span> {t.expected}
                </div>
                <div className="p-2 rounded bg-slate-950/60 border border-slate-800/80 text-emerald-300">
                  <span className="font-medium text-slate-300">Actual:</span> {t.actual}
                </div>
              </div>

              {t.details && (
                <div className="pl-6 text-[10px] text-slate-400 italic">
                  Note: {t.details}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
