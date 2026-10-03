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
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-0.5 rounded text-[11px] font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 flex items-center gap-1">
              <ClipboardList className="w-3.5 h-3.5" /> Immutable Audit Trail
            </span>
            <span className="text-xs text-slate-400">Enterprise AI Governance Compliance</span>
          </div>
          <h1 className="text-xl font-bold text-white mt-1">Audit Log & Query Verification Trail</h1>
          <p className="text-sm text-slate-400 mt-0.5">
            Every natural-language question, compiled semantic AST, execution latency, and security validation status recorded here.
          </p>
        </div>

        <div className="flex items-center space-x-2 text-xs text-slate-400 bg-slate-800/80 px-3 py-1.5 rounded-lg border border-slate-700">
          <Clock className="w-3.5 h-3.5 text-indigo-400" />
          <span>Total Logged Inquiries: <strong className="text-white">{logs.length}</strong></span>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="flex items-center bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs shadow-sm">
        <Search className="w-4 h-4 text-slate-400 mr-2" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Filter audit logs by persona, metric, or question text..."
          className="bg-transparent flex-1 text-white placeholder-slate-500 focus:outline-none"
        />
      </div>

      {/* Audit Logs Table / Feed */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-sm">
        {filteredLogs.length === 0 ? (
          <div className="text-center py-12 text-slate-400 text-xs">
            <FileText className="w-8 h-8 text-slate-600 mx-auto mb-2" />
            No audit records match your search criteria. Inquiries generated via "Ask SupplyGraph" will appear here automatically.
          </div>
        ) : (
          <div className="divide-y divide-slate-800">
            {filteredLogs.map((log) => {
              const isExpanded = selectedAuditId === log.audit_id;
              return (
                <div key={log.audit_id} className="p-4 hover:bg-slate-800/30 transition-colors">
                  <div
                    onClick={() => setSelectedAuditId(isExpanded ? null : log.audit_id)}
                    className="flex flex-col md:flex-row md:items-center justify-between gap-3 cursor-pointer"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2 text-xs">
                        <span className="font-mono text-slate-400 text-[11px]">{new Date(log.timestamp).toLocaleTimeString()}</span>
                        <span>•</span>
                        <span className="px-2 py-0.5 rounded bg-slate-800 font-semibold text-slate-200 text-[10px]">
                          {log.persona}
                        </span>
                        <span>•</span>
                        <span className="font-semibold text-indigo-400 text-xs">{log.metric}</span>
                      </div>
                      <div className="text-sm font-semibold text-white">“{log.question}”</div>
                    </div>

                    <div className="flex items-center space-x-4 text-xs">
                      <div className="text-right">
                        <div className="font-mono font-bold text-emerald-400 text-sm">{log.result}</div>
                        <div className="text-[10px] text-slate-400 font-mono">{log.executionTimeMs}ms</div>
                      </div>
                      <div className="flex items-center space-x-1 text-emerald-400 font-medium">
                        <CheckCircle2 className="w-4 h-4" />
                        <span className="hidden sm:inline">Approved</span>
                      </div>
                      {isExpanded ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                    </div>
                  </div>

                  {/* Expanded Detail Panel */}
                  {isExpanded && (
                    <div className="mt-4 pt-4 border-t border-slate-800/80 space-y-3 text-xs">
                      <div className="text-[11px] text-slate-400">
                        <strong>Validation Trace:</strong> {log.validationTrace}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <div className="text-[10px] font-semibold text-slate-400 uppercase mb-1">
                            Semantic Query JSON:
                          </div>
                          <pre className="p-3 bg-slate-950 rounded-lg border border-slate-800 text-indigo-300 font-mono text-[11px] overflow-x-auto">
                            {JSON.stringify(log.semanticQuery, null, 2)}
                          </pre>
                        </div>

                        <div>
                          <div className="text-[10px] font-semibold text-slate-400 uppercase mb-1">
                            Executed Governed SQL:
                          </div>
                          <pre className="p-3 bg-slate-950 rounded-lg border border-slate-800 text-emerald-300 font-mono text-[11px] overflow-x-auto whitespace-pre-wrap">
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
