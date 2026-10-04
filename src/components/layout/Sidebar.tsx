// SCIP Layout - Enterprise Light Sidebar Navigation
import React from 'react';
import { useAuth } from '../../context/AuthContext.ts';
import {
  Home,
  Info,
  LayoutDashboard,
  PlusCircle,
  ListOrdered,
  Radio,
  AlertOctagon,
  Search,
  MapPin,
  TrendingUp,
  Cpu,
  ShieldCheck,
  CheckCircle2,
  X
} from 'lucide-react';

interface SidebarProps {
  currentTab: string;
  onNavigate: (tab: string) => void;
  isOpenMobile: boolean;
  onCloseMobile: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  onNavigate,
  isOpenMobile,
  onCloseMobile
}) => {
  const { role, hasPermission } = useAuth();

  const handleNav = (tab: string) => {
    onNavigate(tab);
    onCloseMobile();
  };

  const isOfficerOrAbove = role === 'officer' || role === 'authority' || role === 'admin';
  const isAuthorityOrAbove = role === 'authority' || role === 'admin';

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpenMobile && (
        <div
          className="fixed inset-0 bg-slate-900/30 z-40 lg:hidden backdrop-blur-xs"
          onClick={onCloseMobile}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed lg:static top-0 left-0 z-40 h-full w-64 bg-white border-r border-slate-200 flex flex-col transition-transform duration-200 ease-in-out ${
          isOpenMobile ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Mobile Header */}
        <div className="lg:hidden h-16 flex items-center justify-between px-4 border-b border-slate-200">
          <div className="font-semibold text-slate-900 text-sm">Navigation Menu</div>
          <button onClick={onCloseMobile} className="p-1 text-slate-500 hover:text-slate-800">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Sections */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
          {/* Public Group */}
          <div>
            <div className="px-3 text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
              General
            </div>
            <nav className="space-y-0.5">
              <button
                onClick={() => handleNav('home')}
                className={`w-full flex items-center gap-3 px-3 py-2 text-xs font-medium rounded-md transition-colors ${
                  currentTab === 'home'
                    ? 'bg-indigo-50 text-indigo-700 font-semibold'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <Home className="w-4 h-4 shrink-0" />
                <span>Public Portal</span>
              </button>
              <button
                onClick={() => handleNav('about')}
                className={`w-full flex items-center gap-3 px-3 py-2 text-xs font-medium rounded-md transition-colors ${
                  currentTab === 'about'
                    ? 'bg-indigo-50 text-indigo-700 font-semibold'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <Info className="w-4 h-4 shrink-0" />
                <span>About & Responsible AI</span>
              </button>
            </nav>
          </div>

          {/* Citizen Portal Group */}
          <div>
            <div className="px-3 text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
              Citizen Reporting
            </div>
            <nav className="space-y-0.5">
              <button
                onClick={() => handleNav('citizen-dashboard')}
                className={`w-full flex items-center gap-3 px-3 py-2 text-xs font-medium rounded-md transition-colors ${
                  currentTab === 'citizen-dashboard'
                    ? 'bg-indigo-50 text-indigo-700 font-semibold'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <LayoutDashboard className="w-4 h-4 shrink-0" />
                <span>Citizen Dashboard</span>
              </button>
              <button
                onClick={() => handleNav('submit-report')}
                className={`w-full flex items-center gap-3 px-3 py-2 text-xs font-medium rounded-md transition-colors ${
                  currentTab === 'submit-report'
                    ? 'bg-indigo-50 text-indigo-700 font-semibold'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <PlusCircle className="w-4 h-4 shrink-0 text-indigo-600" />
                <span className="font-medium text-indigo-700">Submit New Report</span>
              </button>
              <button
                onClick={() => handleNav('my-reports')}
                className={`w-full flex items-center gap-3 px-3 py-2 text-xs font-medium rounded-md transition-colors ${
                  currentTab === 'my-reports'
                    ? 'bg-indigo-50 text-indigo-700 font-semibold'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <ListOrdered className="w-4 h-4 shrink-0" />
                <span>My Submitted Reports</span>
              </button>
            </nav>
          </div>

          {/* Operations & Intelligence (Accessible to officer, authority, admin, or for review) */}
          <div>
            <div className="px-3 text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1 flex items-center justify-between">
              <span>Operations & Intel</span>
              {!isOfficerOrAbove && (
                <span className="text-[10px] text-amber-600 font-normal lowercase">(officer preview)</span>
              )}
            </div>
            <nav className="space-y-0.5">
              <button
                onClick={() => handleNav('intel-dashboard')}
                className={`w-full flex items-center gap-3 px-3 py-2 text-xs font-medium rounded-md transition-colors ${
                  currentTab === 'intel-dashboard'
                    ? 'bg-indigo-50 text-indigo-700 font-semibold'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <Radio className="w-4 h-4 shrink-0" />
                <span>Intelligence Command</span>
              </button>
              <button
                onClick={() => handleNav('incidents')}
                className={`w-full flex items-center gap-3 px-3 py-2 text-xs font-medium rounded-md transition-colors ${
                  currentTab === 'incidents'
                    ? 'bg-indigo-50 text-indigo-700 font-semibold'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <AlertOctagon className="w-4 h-4 shrink-0" />
                <span>Incident Queue & Review</span>
              </button>
              <button
                onClick={() => handleNav('investigation')}
                className={`w-full flex items-center gap-3 px-3 py-2 text-xs font-medium rounded-md transition-colors ${
                  currentTab === 'investigation'
                    ? 'bg-indigo-50 text-indigo-700 font-semibold'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <Search className="w-4 h-4 shrink-0" />
                <span>Report Investigation</span>
              </button>
              <button
                onClick={() => handleNav('map')}
                className={`w-full flex items-center gap-3 px-3 py-2 text-xs font-medium rounded-md transition-colors ${
                  currentTab === 'map'
                    ? 'bg-indigo-50 text-indigo-700 font-semibold'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <MapPin className="w-4 h-4 shrink-0" />
                <span>Geospatial Intelligence</span>
              </button>
              <button
                onClick={() => handleNav('trends')}
                className={`w-full flex items-center gap-3 px-3 py-2 text-xs font-medium rounded-md transition-colors ${
                  currentTab === 'trends'
                    ? 'bg-indigo-50 text-indigo-700 font-semibold'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <TrendingUp className="w-4 h-4 shrink-0" />
                <span>Trends & Recurrence</span>
              </button>
            </nav>
          </div>

          {/* SCIP Agent Console */}
          <div>
            <div className="px-3 text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
              AI Decision Support
            </div>
            <nav className="space-y-0.5">
              <button
                onClick={() => handleNav('agent')}
                className={`w-full flex items-center gap-3 px-3 py-2 text-xs font-medium rounded-md transition-colors ${
                  currentTab === 'agent'
                    ? 'bg-indigo-50 text-indigo-700 font-semibold'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <Cpu className="w-4 h-4 shrink-0 text-indigo-600" />
                <span>SCIP Intelligence Agent</span>
              </button>
            </nav>
          </div>

          {/* Governance & Administration */}
          <div>
            <div className="px-3 text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1 flex items-center justify-between">
              <span>Governance</span>
              {!isAuthorityOrAbove && (
                <span className="text-[10px] text-amber-600 font-normal lowercase">(admin preview)</span>
              )}
            </div>
            <nav className="space-y-0.5">
              <button
                onClick={() => handleNav('admin-panel')}
                className={`w-full flex items-center gap-3 px-3 py-2 text-xs font-medium rounded-md transition-colors ${
                  currentTab === 'admin-panel'
                    ? 'bg-indigo-50 text-indigo-700 font-semibold'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <ShieldCheck className="w-4 h-4 shrink-0" />
                <span>Admin & Audit Trail</span>
              </button>
            </nav>
          </div>

          {/* Verification & Quality Audit */}
          <div>
            <div className="px-3 text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
              Verification
            </div>
            <nav className="space-y-0.5">
              <button
                onClick={() => handleNav('tests')}
                className={`w-full flex items-center gap-3 px-3 py-2 text-xs font-medium rounded-md transition-colors ${
                  currentTab === 'tests'
                    ? 'bg-indigo-50 text-indigo-700 font-semibold'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
                <span>22-Point Audit Suite</span>
              </button>
            </nav>
          </div>
        </div>

        {/* Footer info */}
        <div className="p-3 border-t border-slate-200 text-[11px] text-slate-500">
          <div className="font-medium text-slate-700">SCIP Master v1.0</div>
          <div className="text-[10px] text-slate-400 mt-0.5">Responsible Municipal AI</div>
        </div>
      </aside>
    </>
  );
};
