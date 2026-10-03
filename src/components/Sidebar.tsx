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
  CheckCircle2,
  Layers,
  X,
  ShieldCheck
} from 'lucide-react';

export type ActiveTab =
  | 'dashboard'
  | 'ask'
  | 'risk'
  | 'consistency'
  | 'ontology'
  | 'registry'
  | 'lineage'
  | 'audit'
  | 'tests';

interface SidebarProps {
  activeTab: ActiveTab;
  onSelectTab: (tab: ActiveTab) => void;
  isOpenMobile: boolean;
  onCloseMobile: () => void;
}

interface NavSection {
  title: string;
  items: {
    id: ActiveTab;
    label: string;
    icon: React.ReactNode;
    badge?: string;
  }[];
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onSelectTab,
  isOpenMobile,
  onCloseMobile
}) => {
  const sections: NavSection[] = [
    {
      title: 'Overview',
      items: [
        { id: 'dashboard', label: 'Executive Dashboard', icon: <LayoutDashboard className="w-4 h-4" /> }
      ]
    },
    {
      title: 'Intelligence',
      items: [
        { id: 'ask', label: 'Ask SupplyGraph', icon: <MessageSquareCode className="w-4 h-4" />, badge: 'AI' },
        { id: 'risk', label: 'Supplier Risk', icon: <ShieldAlert className="w-4 h-4" /> },
        { id: 'consistency', label: 'Consistency Lab', icon: <Scale className="w-4 h-4" />, badge: 'Demo' }
      ]
    },
    {
      title: 'Supply Chain Model',
      items: [
        { id: 'ontology', label: 'Ontology Explorer', icon: <Network className="w-4 h-4" /> },
        { id: 'registry', label: 'Metric Registry', icon: <BookOpenCheck className="w-4 h-4" /> }
      ]
    },
    {
      title: 'Governance',
      items: [
        { id: 'lineage', label: 'Data Lineage', icon: <GitFork className="w-4 h-4" /> },
        { id: 'audit', label: 'Audit Log', icon: <ClipboardList className="w-4 h-4" /> },
        { id: 'tests', label: 'Test Runner', icon: <CheckCircle2 className="w-4 h-4" />, badge: '100%' }
      ]
    }
  ];

  const handleSelect = (id: ActiveTab) => {
    onSelectTab(id);
    onCloseMobile();
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpenMobile && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 bg-slate-900/30 backdrop-blur-xs z-40 lg:hidden"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed lg:static top-0 bottom-0 left-0 w-64 bg-white border-r border-slate-200 z-50 flex flex-col flex-shrink-0 transition-transform duration-200 ease-in-out select-none ${
          isOpenMobile ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Brand Header */}
        <div className="h-16 px-5 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white shadow-xs">
              <Layers className="w-4 h-4" />
            </div>
            <div>
              <div className="font-bold text-slate-900 tracking-tight text-sm flex items-center gap-1.5">
                <span>SupplyGraph AI</span>
              </div>
              <p className="text-[10px] text-slate-500 font-medium">Governed Supply Chain Analytics</p>
            </div>
          </div>

          <button
            onClick={onCloseMobile}
            className="lg:hidden p-1.5 rounded-md text-slate-500 hover:text-slate-900 hover:bg-slate-100"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Navigation Sections */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-5">
          {sections.map((sec, idx) => (
            <div key={idx} className="space-y-1">
              <div className="px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                {sec.title}
              </div>
              {sec.items.map((item) => {
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleSelect(item.id)}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                      isActive
                        ? 'bg-indigo-50 text-indigo-700 font-semibold'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
                    }`}
                  >
                    <div className="flex items-center space-x-2.5">
                      <span className={isActive ? 'text-indigo-600' : 'text-slate-400'}>
                        {item.icon}
                      </span>
                      <span>{item.label}</span>
                    </div>
                    {item.badge && (
                      <span
                        className={`text-[10px] px-1.5 py-0.2 rounded font-semibold ${
                          item.badge === 'Demo'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : item.badge === '100%'
                            ? 'bg-cyan-50 text-cyan-700 border border-cyan-200'
                            : 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          ))}
        </div>

        {/* Footer Governance Badge */}
        <div className="p-3 border-t border-slate-200 bg-slate-50/60">
          <div className="p-2.5 rounded-lg bg-white border border-slate-200 shadow-xs flex items-center space-x-2.5">
            <div className="w-7 h-7 rounded-md bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600 flex-shrink-0">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div className="text-[11px]">
              <div className="font-semibold text-slate-800">Semantic Layer</div>
              <div className="text-slate-500 text-[10px]">Read-only SQL governed</div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};
