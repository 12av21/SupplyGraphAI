import React from 'react';
import { 
  ShieldCheck, 
  Sparkles, 
  Clock, 
  UserCircle2, 
  Activity, 
  Layers, 
  HelpCircle,
  Database
} from 'lucide-react';

export type PersonaType = 'Planning' | 'Procurement' | 'Logistics';

interface TopBarProps {
  currentPersona: PersonaType;
  onSelectPersona: (persona: PersonaType) => void;
  onOpenDemoTour: () => void;
  onRunQuickConsistencyTest: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({
  currentPersona,
  onSelectPersona,
  onOpenDemoTour,
  onRunQuickConsistencyTest
}) => {
  return (
    <header className="h-16 bg-slate-900 border-b border-slate-800 px-6 flex items-center justify-between sticky top-0 z-30 select-none">
      {/* Left: Brand & Semantic Governed Badge */}
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-indigo-500 to-cyan-400 flex items-center justify-center shadow-lg shadow-indigo-500/25">
            <Layers className="w-4 h-4 text-white" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-bold text-white tracking-tight text-base">SupplyGraph AI</span>
              <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
                <ShieldCheck className="w-3 h-3" /> Governed Semantic Layer
              </span>
            </div>
            <p className="text-[11px] text-slate-400">One governed source of truth across enterprise silos</p>
          </div>
        </div>
      </div>

      {/* Middle: System Freshness & Database Mode */}
      <div className="hidden xl:flex items-center space-x-6 text-xs text-slate-400">
        <div className="flex items-center space-x-2 px-3 py-1.5 rounded-full bg-slate-800/80 border border-slate-700/60">
          <Database className="w-3.5 h-3.5 text-indigo-400" />
          <span>Active Warehouse: <strong className="text-slate-200">10,000 Shipments</strong></span>
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse ml-1" />
        </div>
        <div className="flex items-center space-x-2">
          <Clock className="w-3.5 h-3.5 text-slate-400" />
          <span>Data Snapshot: <strong className="text-slate-300">Q3 2026 (Governed)</strong></span>
        </div>
      </div>

      {/* Right: Persona Switcher & Demo Tour */}
      <div className="flex items-center space-x-3">
        {/* Persona Selector */}
        <div className="flex items-center bg-slate-800/90 rounded-lg p-1 border border-slate-700">
          <div className="px-2 py-1 flex items-center text-xs text-slate-400 border-r border-slate-700/80 mr-1">
            <UserCircle2 className="w-3.5 h-3.5 mr-1 text-slate-400" />
            <span className="hidden sm:inline font-medium">Persona:</span>
          </div>
          {(['Planning', 'Procurement', 'Logistics'] as PersonaType[]).map((p) => {
            const isActive = currentPersona === p;
            return (
              <button
                key={p}
                onClick={() => onSelectPersona(p)}
                className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-sm font-semibold'
                    : 'text-slate-300 hover:text-white hover:bg-slate-700/60'
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
          className="hidden md:flex items-center space-x-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 border border-emerald-500/30 transition-colors"
          title="Verify identical 93.2% OTD outcome across Planning, Procurement & Logistics"
        >
          <Activity className="w-3.5 h-3.5 text-emerald-400" />
          <span>Check Consistency</span>
        </button>

        {/* Demo Tour Guide Trigger */}
        <button
          onClick={onOpenDemoTour}
          className="flex items-center space-x-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-md shadow-indigo-600/20 hover:brightness-110 transition-all"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>3-Min Demo Tour</span>
        </button>
      </div>
    </header>
  );
};
