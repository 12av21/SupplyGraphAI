import React from 'react';
import { 
  ShieldCheck, 
  Sparkles, 
  Layers, 
  Menu,
  Activity,
  Database
} from 'lucide-react';
import { ActiveTab } from './Sidebar';

export type PersonaType = 'Planning' | 'Procurement' | 'Logistics';

interface TopBarProps {
  currentPersona: PersonaType;
  onSelectPersona: (persona: PersonaType) => void;
  onOpenDemoTour: () => void;
  onRunQuickConsistencyTest: () => void;
  activeTab: ActiveTab;
  onToggleMobileSidebar: () => void;
}

const TAB_TITLES: Record<ActiveTab, { title: string; category: string }> = {
  dashboard: { title: 'Executive Dashboard', category: 'Overview' },
  ask: { title: 'Ask SupplyGraph', category: 'Intelligence' },
  risk: { title: 'Supplier Risk Analysis', category: 'Intelligence' },
  consistency: { title: 'Metric Consistency Lab', category: 'Intelligence' },
  ontology: { title: 'Ontology Explorer', category: 'Supply Chain Model' },
  registry: { title: 'Canonical Metric Registry', category: 'Supply Chain Model' },
  lineage: { title: 'Data Lineage & Traceability', category: 'Governance' },
  audit: { title: 'Audit Trail & Compliance', category: 'Governance' },
  tests: { title: 'Automated Test Runner', category: 'Governance' },
};

export const TopBar: React.FC<TopBarProps> = ({
  currentPersona,
  onSelectPersona,
  onOpenDemoTour,
  onRunQuickConsistencyTest,
  activeTab,
  onToggleMobileSidebar
}) => {
  const currentTabInfo = TAB_TITLES[activeTab] || { title: 'Dashboard', category: 'Overview' };

  return (
    <header className="h-16 bg-white border-b border-slate-200 px-4 sm:px-6 flex items-center justify-between sticky top-0 z-30 select-none shadow-xs">
      {/* Left: Mobile Toggle & Breadcrumbs */}
      <div className="flex items-center space-x-3 sm:space-x-4">
        <button
          onClick={onToggleMobileSidebar}
          className="lg:hidden p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
          aria-label="Toggle Navigation Menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div>
          <div className="flex items-center space-x-2 text-xs text-slate-500">
            <span className="font-medium text-slate-500">{currentTabInfo.category}</span>
            <span>/</span>
            <span className="text-slate-800 font-semibold">{currentTabInfo.title}</span>
          </div>
          <h1 className="text-sm sm:text-base font-bold text-slate-900 leading-tight">
            {currentTabInfo.title}
          </h1>
        </div>
      </div>

      {/* Middle: System Data Badge (Hidden on mobile) */}
      <div className="hidden xl:flex items-center space-x-3 text-xs">
        <div className="flex items-center space-x-2 px-2.5 py-1 rounded-md bg-slate-100 border border-slate-200 text-slate-600">
          <Database className="w-3.5 h-3.5 text-indigo-600" />
          <span className="font-medium text-slate-700">10,000 Shipments</span>
          <span className="text-slate-400">•</span>
          <span className="text-slate-600">Q3 2026 Snapshot</span>
        </div>
        <span className="px-2 py-0.5 rounded text-[10px] font-bold tracking-wide uppercase bg-emerald-50 text-emerald-700 border border-emerald-200">
          DEMO DATA
        </span>
      </div>

      {/* Right: Persona Switcher & Actions */}
      <div className="flex items-center space-x-2 sm:space-x-3">
        {/* Persona Selector */}
        <div className="flex items-center bg-slate-100 p-0.5 rounded-lg border border-slate-200">
          <span className="hidden md:inline px-2 py-1 text-[11px] font-semibold text-slate-500">
            Persona:
          </span>
          {(['Planning', 'Procurement', 'Logistics'] as PersonaType[]).map((p) => {
            const isActive = currentPersona === p;
            return (
              <button
                key={p}
                onClick={() => onSelectPersona(p)}
                className={`px-2.5 py-1 text-xs rounded-md transition-all font-medium ${
                  isActive
                    ? 'bg-white text-indigo-700 shadow-xs border border-slate-200 font-semibold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                }`}
              >
                {p}
              </button>
            );
          })}
        </div>

        {/* Consistency Check Shortcut */}
        <button
          onClick={onRunQuickConsistencyTest}
          className="hidden md:flex items-center space-x-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 transition-colors"
          title="Verify identical 93.2% OTD outcome across Planning, Procurement & Logistics"
        >
          <Activity className="w-3.5 h-3.5 text-emerald-600" />
          <span>Consistency Lab</span>
        </button>

        {/* Demo Tour Guide Trigger */}
        <button
          onClick={onOpenDemoTour}
          className="flex items-center space-x-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs transition-colors"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Demo Guide</span>
        </button>
      </div>
    </header>
  );
};
