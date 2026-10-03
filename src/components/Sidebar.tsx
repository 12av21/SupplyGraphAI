import React from 'react';
import {
  LayoutDashboard,
  MessageSquareCode,
  Network,
  BookOpenCheck,
  Scale,
  ShieldAlert,
  GitFork,
  ClipboardList,
  CheckCircle2
} from 'lucide-react';

export type ActiveTab =
  | 'dashboard'
  | 'ask'
  | 'consistency'
  | 'ontology'
  | 'registry'
  | 'risk'
  | 'lineage'
  | 'audit'
  | 'tests';

interface SidebarProps {
  activeTab: ActiveTab;
  onSelectTab: (tab: ActiveTab) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, onSelectTab }) => {
  const navItems: { id: ActiveTab; label: string; icon: React.ReactNode; badge?: string }[] = [
    { id: 'dashboard', label: 'Executive Dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
    { id: 'ask', label: 'Ask SupplyGraph', icon: <MessageSquareCode className="w-4 h-4" />, badge: 'AI Governed' },
    { id: 'consistency', label: 'Consistency Lab', icon: <Scale className="w-4 h-4" />, badge: 'Core Demo' },
    { id: 'ontology', label: 'Ontology Explorer', icon: <Network className="w-4 h-4" /> },
    { id: 'registry', label: 'Metric Registry', icon: <BookOpenCheck className="w-4 h-4" /> },
    { id: 'risk', label: 'Supplier Risk Matrix', icon: <ShieldAlert className="w-4 h-4" /> },
    { id: 'lineage', label: 'Data Lineage', icon: <GitFork className="w-4 h-4" /> },
    { id: 'audit', label: 'Audit Trail & Governance', icon: <ClipboardList className="w-4 h-4" /> },
    { id: 'tests', label: 'Automated Test Runner', icon: <CheckCircle2 className="w-4 h-4" />, badge: '100% Pass' }
  ];

  return (
    <aside className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col flex-shrink-0 select-none">
      <div className="p-4 flex-1 space-y-1">
        <div className="px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
          Governed Analytics
        </div>

        {navItems.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSelectTab(item.id)}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-all group ${
                isActive
                  ? 'bg-indigo-600/15 text-indigo-300 border border-indigo-500/30 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/70 border border-transparent'
              }`}
            >
              <div className="flex items-center space-x-3">
                <span className={`${isActive ? 'text-indigo-400' : 'text-slate-400 group-hover:text-slate-300'}`}>
                  {item.icon}
                </span>
                <span>{item.label}</span>
              </div>
              {item.badge && (
                <span
                  className={`text-[10px] px-1.5 py-0.5 rounded font-semibold ${
                    item.badge === 'Core Demo'
                      ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                      : item.badge === '100% Pass'
                      ? 'bg-cyan-500/15 text-cyan-400 border border-cyan-500/30'
                      : 'bg-indigo-500/15 text-indigo-400 border border-indigo-500/30'
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Footer Info Box */}
      <div className="p-4 border-t border-slate-800/80 bg-slate-950/40">
        <div className="rounded-lg p-3 bg-slate-800/50 border border-slate-800">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs font-semibold text-slate-200">Governance Engine</span>
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
          </div>
          <p className="text-[11px] text-slate-400 leading-relaxed">
            Strict read-only queries with enforced canonical semantic views. Direct SQL writing disabled.
          </p>
        </div>
      </div>
    </aside>
  );
};
