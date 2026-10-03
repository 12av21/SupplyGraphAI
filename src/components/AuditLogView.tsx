import React, { useState } from 'react';
import {
  ClipboardList,
  ShieldCheck,
  Clock,
  Code2,
  CheckCircle2,
  AlertTriangle,
  FileText,
  Search,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { dbEngine } from '../database/sqlEngine';

export const AuditLogView: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedAuditId, setSelectedAuditId] = useState<string | null>(null);

  const logs = dbEngine.getAuditLogs();

  const filteredLogs = logs.filter(
    (l) =>
      l.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.metric.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.persona.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-16">
      {/* Header */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-0.5 rounded text-[11px] font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200 flex items-center gap-1">
              <ClipboardList className="w-3.5 h-3.5 text-indigo-600" /> Immutable Governance Console
            </span>
            <span className="text-xs text-slate-500">Security & Regulatory Compliance Trail</span>
          </div>
          <h1 className="text-xl font-bold text-slate-900 mt-1">Audit Log & Query Verification Trail</h1>
          <p className="text-sm text-slate-600 mt-0.5">
            Every natural-language question, compiled semantic AST, execution latency, and security validation status recorded here.
          </p>
        </div>

        <div className="flex items-center space-x-2 text-xs text-slate-600 bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200">
          <Clock className="w-3.5 h-3.5 text-indigo-600" />
          <span>Total Inquiries Logged: <strong className="text-slate-900 font-mono">{logs.length}</strong></span>
        </div>
      </div>

      {/* Search Input */}
      <div className="flex items-center bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs shadow-xs">
        <Search className="w-4 h-4 text-slate-400 mr-2.5" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Filter audit logs by persona, metric, or question text..."
          className="bg-transparent flex-1 text-slate-900 placeholder-slate-400 focus:outline-none"
        />
      </div>

      {/* Audit Log Table */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs">
        {filteredLogs.length === 0 ? (
          <div className="text-center py-12 text-slate-400 text-xs">
            <FileText className="w-8 h-8 text-slate-300 mx-auto mb-2" />
            No audit records match your search criteria. Inquiries generated via "Ask SupplyGraph" or "Consistency Lab" appear here automatically.
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {filteredLogs.map((log) => {
              const isExpanded = selectedAuditId === log.audit_id;
              return (
                <div key={log.audit_id} className="p-4 hover:bg-slate-50/80 transition-colors">
                  <div
                    onClick={() => setSelectedAuditId(isExpanded ? null : log.audit_id)}
                    className="flex flex-col md:flex-row md:items-center justify-between gap-3 cursor-pointer"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2 text-xs">
                        <span className="font-mono text-slate-500 text-[11px] font-medium">
                          {new Date(log.timestamp).toLocaleTimeString()}
                        </span>
                        <span>•</span>
                        <span className="px-2 py-0.5 rounded bg-slate-100 font-semibold text-slate-700 text-[10px] border border-slate-200">
                          {log.persona}
                        </span>
                        <span>•</span>
                        <span className="font-semibold text-indigo-700 text-xs">{log.metric}</span>
                      </div>
                      <div className="text-sm font-semibold text-slate-900">“{log.question}”</div>
                    </div>

                    <div className="flex items-center space-x-4 text-xs">
                      <div className="text-right">
                        <div className="font-mono font-bold text-slate-900 text-sm">{log.result}</div>
                        <div className="text-[10px] text-slate-500 font-mono">{log.executionTimeMs}ms</div>
                      </div>
                      <div className="flex items-center space-x-1 px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-semibold">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        <span className="hidden sm:inline">Approved</span>
                      </div>
                      {isExpanded ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                    </div>
                  </div>

                  {/* Expanded Detail Panel */}
                  {isExpanded && (
                    <div className="mt-4 pt-4 border-t border-slate-100 space-y-3 text-xs bg-slate-50 p-4 rounded-xl">
                      <div className="text-[11px] text-slate-600">
                        <strong className="text-slate-800">Validation Trace:</strong> {log.validationTrace}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                            Semantic Query AST (JSON):
                          </div>
                          <pre className="p-3 bg-slate-900 text-indigo-300 rounded-lg border border-slate-800 font-mono text-[11px] overflow-x-auto">
                            {JSON.stringify(log.semanticQuery, null, 2)}
                          </pre>
                        </div>

                        <div>
                          <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                            Executed Read-Only SQL:
                          </div>
                          <pre className="p-3 bg-slate-900 text-emerald-300 rounded-lg border border-slate-800 font-mono text-[11px] overflow-x-auto whitespace-pre-wrap">
                            {log.generatedSql}
                          </pre>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
