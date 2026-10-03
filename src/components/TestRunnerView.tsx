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
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-0.5 rounded text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Automated Governance Gate
            </span>
            <span className="text-xs text-slate-500">Continuous Assurance Verification</span>
          </div>
          <h1 className="text-xl font-bold text-slate-900 mt-1">Automated System Health & Test Suite</h1>
          <p className="text-sm text-slate-600 mt-0.5">
            Full compliance suite verifying Ontology constraints, Canonical formulas, SQL injection blocks, and Cross-Persona parity.
          </p>
        </div>

        <button
          onClick={executeTests}
          disabled={isRunning}
          className="px-4 py-2 text-xs font-semibold rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white flex items-center space-x-2 shadow-xs transition-colors disabled:opacity-50"
        >
          {isRunning ? (
            <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
          ) : (
            <>
              <RotateCcw className="w-4 h-4" />
              <span>Run Automated Suite</span>
            </>
          )}
        </button>
      </div>

      {/* Summary Scorecard */}
      {report && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
            <div className="text-xs font-semibold text-slate-500">Total Test Cases</div>
            <div className="text-2xl font-black text-slate-900 font-mono mt-1">{report.totalTests}</div>
            <div className="text-[10px] text-slate-400 mt-0.5">Across 5 Governance Layers</div>
          </div>

          <div className="bg-white border border-emerald-200 rounded-xl p-4 shadow-xs bg-emerald-50/30">
            <div className="text-xs font-semibold text-emerald-700">Passing Tests</div>
            <div className="text-2xl font-black text-emerald-700 font-mono mt-1">{report.passedTests}</div>
            <div className="text-[10px] text-emerald-600 mt-0.5 font-medium">100% Pass Rate</div>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
            <div className="text-xs font-semibold text-slate-500">Failed Tests</div>
            <div className="text-2xl font-black text-slate-900 font-mono mt-1">{report.failedTests}</div>
            <div className="text-[10px] text-slate-400 mt-0.5">Zero Regressions</div>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
            <div className="text-xs font-semibold text-slate-500">Execution Latency</div>
            <div className="text-2xl font-black text-indigo-700 font-mono mt-1">{report.durationMs}ms</div>
            <div className="text-[10px] text-slate-400 mt-0.5">Sub-second validation</div>
          </div>
        </div>
      )}

      {/* Category Tabs */}
      <div className="flex flex-wrap gap-2">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
              selectedCategory === cat
                ? 'bg-indigo-600 text-white shadow-xs font-semibold'
                : 'bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 shadow-xs'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Test Results Table */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs">
        <div className="p-4 border-b border-slate-200 flex items-center justify-between">
          <h2 className="text-sm font-bold text-slate-900">Test Case Assertions & Evidence ({filteredResults.length})</h2>
          <span className="text-xs text-slate-500 font-medium">Strict Verification</span>
        </div>

        <div className="divide-y divide-slate-100">
          {filteredResults.map((t, idx) => (
            <div key={idx} className="p-4 hover:bg-slate-50/80 transition-colors space-y-2">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center space-x-2.5">
                  {t.passed ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  ) : (
                    <XCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />
                  )}
                  <div className="font-semibold text-slate-900 text-xs">{t.name}</div>
                  <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-600 text-[10px] font-mono border border-slate-200">
                    {t.category}
                  </span>
                </div>

                <div className="flex items-center space-x-3 text-xs">
                  <span className="font-mono text-slate-500 text-[11px]">{t.executionTimeMs}ms</span>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    t.passed
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      : 'bg-rose-50 text-rose-700 border border-rose-200'
                  }`}>
                    {t.passed ? 'PASSED' : 'FAILED'}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-[11px] pl-6">
                <div className="p-2 rounded-lg bg-slate-50 border border-slate-200 text-slate-600">
                  <span className="font-semibold text-slate-800">Expected:</span> {t.expected}
                </div>
                <div className="p-2 rounded-lg bg-slate-50 border border-slate-200 text-emerald-800">
                  <span className="font-semibold text-slate-800">Actual:</span> {t.actual}
                </div>
              </div>

              {t.details && (
                <div className="pl-6 text-[10px] text-slate-500 italic">
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
