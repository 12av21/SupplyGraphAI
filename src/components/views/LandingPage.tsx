// SCIP Public - Landing Page
import React from 'react';
import { useAuth } from '../../context/AuthContext.ts';
import {
  ShieldAlert,
  Cpu,
  UserCheck,
  ArrowRight,
  MapPin,
  TrendingUp,
  FileCheck,
  CheckCircle2
} from 'lucide-react';

interface LandingPageProps {
  onNavigate: (tab: string) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onNavigate }) => {
  const { switchDemoRole } = useAuth();

  return (
    <div className="max-w-6xl mx-auto space-y-12 py-4">
      {/* Hero Section */}
      <section className="bg-white rounded-xl border border-slate-200 p-8 sm:p-12 relative overflow-hidden">
        <div className="max-w-2xl relative z-10 space-y-5">
          <div className="text-xs font-semibold uppercase tracking-wider text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-md inline-block">
            Smart Community Intelligence Platform
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900 text-balance leading-tight">
            Transforming Community Observations into Actionable Municipal Intelligence
          </h1>
          <p className="text-slate-600 text-base leading-relaxed">
            SCIP connects individual citizen reports using explainable NLP and spatio-temporal clustering to identify emerging municipal hazards, eliminate duplicate noise, and empower public authorities with real-time decision support.
          </p>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={() => onNavigate('submit-report')}
              className="px-5 py-2.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-xs transition-colors flex items-center gap-2"
            >
              <span>Submit a Community Report</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => onNavigate('intel-dashboard')}
              className="px-5 py-2.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg border border-slate-200 transition-colors"
            >
              Explore Operations Dashboard
            </button>
            <button
              onClick={() => onNavigate('tests')}
              className="px-4 py-2.5 text-xs font-medium text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded-lg border border-emerald-200 transition-colors flex items-center gap-1.5"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Run Verification Suite</span>
            </button>
          </div>
        </div>

        {/* Subtle Decorative Gradient Mesh */}
        <div className="absolute right-0 bottom-0 top-0 w-1/3 bg-gradient-to-l from-indigo-50/80 to-transparent pointer-events-none hidden md:block" />
      </section>

      {/* The Responsible AI Principle */}
      <section className="bg-slate-50 border border-slate-200 rounded-xl p-6 sm:p-8">
        <div className="border-b border-slate-200 pb-4 mb-6">
          <div className="text-xs font-semibold uppercase tracking-wider text-slate-500">Core Architecture Principle</div>
          <h2 className="text-xl font-bold text-slate-900 mt-1">Responsible AI & The Human-in-the-Loop Safeguard</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-5 rounded-lg border border-slate-200">
            <div className="w-8 h-8 rounded-md bg-blue-50 text-blue-700 font-bold flex items-center justify-center text-sm mb-3">
              01
            </div>
            <h3 className="font-semibold text-slate-900 text-sm">Community Report = Observation</h3>
            <p className="text-xs text-slate-600 mt-2 leading-relaxed">
              Every citizen submission is recorded as a raw ground observation. Citizens observe visible symptoms: stagnant water, road cracks, or flickering lights.
            </p>
          </div>

          <div className="bg-white p-5 rounded-lg border border-slate-200">
            <div className="w-8 h-8 rounded-md bg-indigo-50 text-indigo-700 font-bold flex items-center justify-center text-sm mb-3">
              02
            </div>
            <h3 className="font-semibold text-slate-900 text-sm">AI Incident = Interpretation</h3>
            <p className="text-xs text-slate-600 mt-2 leading-relaxed">
              Algorithms synthesize related observations into a <em>Potential Incident</em> using spatio-temporal clustering and semantic similarity. It suggests correlations, not definitive facts.
            </p>
          </div>

          <div className="bg-white p-5 rounded-lg border border-slate-200">
            <div className="w-8 h-8 rounded-md bg-emerald-50 text-emerald-700 font-bold flex items-center justify-center text-sm mb-3">
              03
            </div>
            <h3 className="font-semibold text-slate-900 text-sm">Administrative Decision = Human Review</h3>
            <p className="text-xs text-slate-600 mt-2 leading-relaxed">
              Public authority officers must inspect evidence, confirm or dismiss incident hypotheses, and assign official municipal work orders. AI never replaces executive accountability.
            </p>
          </div>
        </div>
      </section>

      {/* How It Works Flow */}
      <section className="bg-white rounded-xl border border-slate-200 p-6 sm:p-8">
        <h2 className="text-lg font-bold text-slate-900 mb-6">The SCIP Intelligence Pipeline</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
          <div className="p-4 rounded-lg bg-slate-50 border border-slate-200">
            <div className="w-9 h-9 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center mx-auto mb-2">
              <FileCheck className="w-4 h-4" />
            </div>
            <div className="font-semibold text-slate-900 text-xs">1. Report Ingestion</div>
            <div className="text-[11px] text-slate-500 mt-1">Validation & Geotagging</div>
          </div>

          <div className="p-4 rounded-lg bg-slate-50 border border-slate-200">
            <div className="w-9 h-9 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center mx-auto mb-2">
              <Cpu className="w-4 h-4" />
            </div>
            <div className="font-semibold text-slate-900 text-xs">2. AI/ML Analysis</div>
            <div className="text-[11px] text-slate-500 mt-1">TF-IDF & DBSCAN Clustering</div>
          </div>

          <div className="p-4 rounded-lg bg-slate-50 border border-slate-200">
            <div className="w-9 h-9 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center mx-auto mb-2">
              <MapPin className="w-4 h-4" />
            </div>
            <div className="font-semibold text-slate-900 text-xs">3. Spatial Risk Scoring</div>
            <div className="text-[11px] text-slate-500 mt-1">Density & Infrastructure Impact</div>
          </div>

          <div className="p-4 rounded-lg bg-slate-50 border border-slate-200">
            <div className="w-9 h-9 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center mx-auto mb-2">
              <UserCheck className="w-4 h-4" />
            </div>
            <div className="font-semibold text-slate-900 text-xs">4. Human Review</div>
            <div className="text-[11px] text-slate-500 mt-1">Officer Confirmation & Dispatch</div>
          </div>
        </div>
      </section>

      {/* Quick Test Switcher Bar */}
      <section className="bg-slate-100 rounded-lg p-4 border border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div>
          <span className="font-semibold text-slate-900">Switch Test Persona:</span>
          <span className="text-slate-600 ml-2">Click any role to test authentic permissions across the platform</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => { switchDemoRole('citizen'); onNavigate('citizen-dashboard'); }}
            className="px-3 py-1.5 bg-white hover:bg-slate-50 border border-slate-200 rounded-md font-medium text-slate-700"
          >
            Citizen View
          </button>
          <button
            onClick={() => { switchDemoRole('officer'); onNavigate('incidents'); }}
            className="px-3 py-1.5 bg-white hover:bg-slate-50 border border-slate-200 rounded-md font-medium text-slate-700"
          >
            Officer View
          </button>
          <button
            onClick={() => { switchDemoRole('authority'); onNavigate('intel-dashboard'); }}
            className="px-3 py-1.5 bg-white hover:bg-slate-50 border border-slate-200 rounded-md font-medium text-slate-700"
          >
            Director View
          </button>
          <button
            onClick={() => { switchDemoRole('admin'); onNavigate('admin-panel'); }}
            className="px-3 py-1.5 bg-white hover:bg-slate-50 border border-slate-200 rounded-md font-medium text-slate-700"
          >
            Admin View
          </button>
        </div>
      </section>
    </div>
  );
};
