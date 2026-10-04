// SCIP Citizen Portal - My Submitted Reports List
import React, { useState, useEffect } from 'react';
import { Report } from '../../types/scip.js';
import { api } from '../../services/apiClient.js';
import { useAuth } from '../../context/AuthContext.js';
import { ReportDetailModal } from './ReportDetailModal.js';
import {
  ListFilter,
  Search,
  ExternalLink,
  MapPin,
  Clock,
  PlusCircle,
  FileCheck
} from 'lucide-react';

interface MyReportsViewProps {
  onNavigateToSubmit: () => void;
  onOpenIncident?: (incidentId: string) => void;
}

export const MyReportsView: React.FC<MyReportsViewProps> = ({
  onNavigateToSubmit,
  onOpenIncident
}) => {
  const { user } = useAuth();
  const [reports, setReports] = useState<Report[]>([]);
  const [selectedReportId, setSelectedReportId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadReports();
  }, [user]);

  const loadReports = async () => {
    setIsLoading(true);
    try {
      // If citizen, filter by their own reports
      const res = await api.getReports({ myOnly: user?.role === 'citizen' });
      setReports(res);
    } catch {
      // Ignore
    } finally {
      setIsLoading(false);
    }
  };

  const filtered = reports.filter(r => {
    if (categoryFilter !== 'ALL' && r.category !== categoryFilter) return false;
    if (statusFilter !== 'ALL' && r.status !== statusFilter) return false;
    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      return (
        r.title.toLowerCase().includes(q) ||
        r.locationName.toLowerCase().includes(q) ||
        r.id.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'resolved':
        return 'text-emerald-700 bg-emerald-50 border-emerald-200';
      case 'assigned':
      case 'linked':
      case 'under_review':
        return 'text-indigo-700 bg-indigo-50 border-indigo-200';
      default:
        return 'text-slate-700 bg-slate-50 border-slate-200';
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto py-4">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900">My Community Observations</h1>
          <p className="text-xs text-slate-500 mt-1">
            Track submitted reports, view automated AI analysis results, and review municipal action status.
          </p>
        </div>

        <button
          onClick={onNavigateToSubmit}
          className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-md shadow-xs flex items-center gap-1.5 transition-colors"
        >
          <PlusCircle className="w-4 h-4" />
          <span>New Report</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-3.5 rounded-lg border border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 flex-1 min-w-[200px]">
          <Search className="w-4 h-4 text-slate-400 shrink-0" />
          <input
            type="text"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder="Search by title, location, or REP ID..."
            className="w-full bg-transparent text-xs text-slate-900 focus:outline-hidden placeholder:text-slate-400"
          />
        </div>

        <div className="flex items-center gap-3">
          <select
            value={categoryFilter}
            onChange={e => setCategoryFilter(e.target.value)}
            className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-md text-slate-700 text-xs focus:outline-hidden"
          >
            <option value="ALL">All Categories</option>
            <option value="Water & Drainage">Water & Drainage</option>
            <option value="Roads & Traffic">Roads & Traffic</option>
            <option value="Public Sanitation">Public Sanitation</option>
            <option value="Power & Lighting">Power & Lighting</option>
            <option value="Structural Safety">Structural Safety</option>
          </select>

          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-md text-slate-700 text-xs focus:outline-hidden"
          >
            <option value="ALL">All Statuses</option>
            <option value="submitted">Submitted</option>
            <option value="analyzed">Analyzed</option>
            <option value="linked">Linked to Incident</option>
            <option value="assigned">Assigned</option>
            <option value="resolved">Resolved</option>
          </select>
        </div>
      </div>

      {/* Reports Table */}
      <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
        {isLoading ? (
          <div className="py-16 text-center text-xs text-slate-400">Loading your reports...</div>
        ) : filtered.length === 0 ? (
          <div className="py-16 text-center text-xs text-slate-500 space-y-3">
            <FileCheck className="w-8 h-8 text-slate-300 mx-auto" />
            <div>No matching reports found.</div>
            <button
              onClick={onNavigateToSubmit}
              className="text-xs text-indigo-600 hover:text-indigo-800 font-medium"
            >
              Submit your first report
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold">
                <tr>
                  <th className="p-3">Reference ID</th>
                  <th className="p-3">Title & Observation</th>
                  <th className="p-3">Category</th>
                  <th className="p-3">Location</th>
                  <th className="p-3">Status</th>
                  <th className="p-3 text-right">Date</th>
                  <th className="p-3 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {filtered.map(report => (
                  <tr
                    key={report.id}
                    className="hover:bg-slate-50/80 transition-colors cursor-pointer"
                    onClick={() => setSelectedReportId(report.id)}
                  >
                    <td className="p-3 font-mono text-[11px] font-semibold text-indigo-600 whitespace-nowrap">
                      {report.id}
                    </td>
                    <td className="p-3 font-medium text-slate-900 max-w-xs truncate">
                      {report.title}
                    </td>
                    <td className="p-3 text-slate-600 whitespace-nowrap">
                      {report.category}
                    </td>
                    <td className="p-3 text-slate-500 max-w-xs truncate">
                      {report.locationName}
                    </td>
                    <td className="p-3 whitespace-nowrap">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-semibold border ${getStatusBadge(report.status)}`}>
                        {report.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="p-3 text-right font-mono text-[11px] text-slate-400 whitespace-nowrap tabular-nums">
                      {new Date(report.createdAt).toLocaleDateString()}
                    </td>
                    <td className="p-3 text-center whitespace-nowrap">
                      <button
                        onClick={e => {
                          e.stopPropagation();
                          setSelectedReportId(report.id);
                        }}
                        className="p-1 text-slate-400 hover:text-indigo-600 transition-colors"
                        title="View details & AI transparency"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal Inspector */}
      {selectedReportId && (
        <ReportDetailModal
          reportId={selectedReportId}
          onClose={() => setSelectedReportId(null)}
          onOpenIncident={onOpenIncident}
        />
      )}
    </div>
  );
};
