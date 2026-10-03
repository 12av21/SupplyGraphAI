import React, { useState } from 'react';
import {
  Sparkles,
  X,
  ChevronRight,
  ChevronLeft,
  CheckCircle2,
  ArrowRight,
  Layers,
  Scale,
  MessageSquareCode,
  BookOpenCheck,
  GitFork,
  HelpCircle
} from 'lucide-react';
import { ActiveTab } from './Sidebar';
import { PersonaType } from './TopBar';

interface DemoGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateToTab: (tab: ActiveTab) => void;
  onSetPersona: (persona: PersonaType) => void;
}

interface DemoStep {
  stepNumber: number;
  title: string;
  tab: ActiveTab;
  persona?: PersonaType;
  promptQuestion?: string;
  narration: string;
  keyHighlight: string;
}

const DEMO_STEPS: DemoStep[] = [
  {
    stepNumber: 1,
    title: 'Open Executive Dashboard',
    tab: 'dashboard',
    narration: 'Begin by showing the unified executive telemetry: OTD (93.2%), Fill Rate (96.4%), Days Inventory (18.7), and Landed Cost ($12.4M). Explain that each number is computed directly from 10,000 real database records, not hardcoded mock numbers.',
    keyHighlight: 'One live operational dashboard driven entirely by the governed semantic layer.'
  },
  {
    stepNumber: 2,
    title: 'Explore Supply Chain Ontology',
    tab: 'ontology',
    narration: 'Navigate to the Ontology Explorer. Walk the judges through the 9 core entities: Supplier → Part → Plant → Shipment → Order → Customer, Carrier, Inventory, and IoT Events. Click Supplier to highlight concrete instance S001.',
    keyHighlight: 'The ontology is an active application metadata model that governs semantic joins.'
  },
  {
    stepNumber: 3,
    title: 'Inspect Metric Registry (OTD Definition)',
    tab: 'registry',
    narration: 'Open the Metric Registry and click into OTD (On-Time Delivery). Show its canonical formula (on_time_shipments / eligible_shipments), dimension grain, SLA owner, and version 1.0 approval.',
    keyHighlight: 'Guarantees the LLM never invents business definitions on the fly.'
  },
  {
    stepNumber: 4,
    title: 'Ask SupplyGraph: Late Deliveries Analysis',
    tab: 'ask',
    promptQuestion: 'Which suppliers caused the most late deliveries to PL01?',
    narration: 'Open Ask SupplyGraph and click "Late Deliveries". Show the complete explainability card: Governed Answer, Canonical Metric, Applied Filters, and expandable Safe Read-Only SQL.',
    keyHighlight: 'Natural language mapped into structured AST, validated, and safely executed.'
  },
  {
    stepNumber: 5,
    title: 'Change Persona to Procurement',
    tab: 'ask',
    persona: 'Procurement',
    promptQuestion: 'How reliable was Supplier S001 for Plant PL01?',
    narration: 'Switch the active Persona to Procurement and ask: “How reliable was Supplier S001 for Plant PL01?”. Observe how the system resolves "reliable" to the exact same canonical OTD metric (93.2%).',
    keyHighlight: 'Different domain vocabulary resolves to the identical governed SLA.'
  },
  {
    stepNumber: 6,
    title: 'Metric Consistency Lab (The Climax)',
    tab: 'consistency',
    narration: 'Open the Consistency Lab. Demonstrate Planning (93.2%) == Procurement (93.2%) == Logistics (93.2%). Show all 5 green checkmarks: Same concept, Same metric ID, Same formula, Same tables, Same result.',
    keyHighlight: 'Proves mathematical consistency across all enterprise organizational silos.'
  },
  {
    stepNumber: 7,
    title: 'Why Did OTD Fall? Root-Cause Analytics',
    tab: 'ask',
    promptQuestion: 'Why did Plant PL01 OTD decrease?',
    narration: 'Ask "Why did OTD fall at PL01?". Show the calculated root-cause factor decomposition: Supplier S001 (38 late), Carrier C004 (21 late), and Part P100 (17 late), distinguishing database evidence from AI narrative.',
    keyHighlight: 'Causal factor decomposition across suppliers, carriers, and SKUs.'
  },
  {
    stepNumber: 8,
    title: 'Inspect Data Lineage & Conclude',
    tab: 'lineage',
    narration: 'Conclude at the Data Lineage panel. Walk down the 6 vertical tiers: Question → Metric → Semantic Definition → Ontology Entities → Source Tables → Calculation → 93.2% Result. End with the thesis: "Different questions. Different teams. One governed supply-chain truth."',
    keyHighlight: 'Complete backward auditable trace from final answer to database table.'
  }
];

export const DemoGuideModal: React.FC<DemoGuideModalProps> = ({
  isOpen,
  onClose,
  onNavigateToTab,
  onSetPersona
}) => {
  const [currentStepIdx, setCurrentStepIdx] = useState(0);

  if (!isOpen) return null;

  const currentStep = DEMO_STEPS[currentStepIdx];

  const handleApplyStep = () => {
    onNavigateToTab(currentStep.tab);
    if (currentStep.persona) {
      onSetPersona(currentStep.persona);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-2xl w-full p-6 shadow-2xl relative space-y-5 animate-in fade-in zoom-in-95 duration-200">
        {/* Top Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center space-x-2">
            <span className="p-1.5 rounded-lg bg-indigo-500/15 text-indigo-400">
              <Sparkles className="w-5 h-5" />
            </span>
            <div>
              <h2 className="text-base font-bold text-white">3–5 Minute Hackathon Presentation Walkthrough</h2>
              <div className="text-xs text-slate-400">
                Step {currentStep.stepNumber} of {DEMO_STEPS.length}: {currentStep.title}
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step Content */}
        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider">
                Stage {currentStep.stepNumber}: {currentStep.tab.toUpperCase()} VIEW
              </span>
              {currentStep.persona && (
                <span className="text-[11px] px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 font-semibold">
                  Switch Persona: {currentStep.persona}
                </span>
              )}
            </div>

            <p className="text-sm text-slate-200 leading-relaxed font-medium">
              {currentStep.narration}
            </p>

            <div className="p-3 rounded-lg bg-slate-900/90 border border-indigo-500/30 text-xs text-indigo-300 flex items-start space-x-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
              <div>
                <strong className="text-white">Core Judging Takeaway:</strong> {currentStep.keyHighlight}
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between border-t border-slate-800 pt-4">
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setCurrentStepIdx(prev => Math.max(0, prev - 1))}
              disabled={currentStepIdx === 0}
              className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 disabled:opacity-40 flex items-center space-x-1"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Previous</span>
            </button>
            <button
              onClick={() => setCurrentStepIdx(prev => Math.min(DEMO_STEPS.length - 1, prev + 1))}
              disabled={currentStepIdx === DEMO_STEPS.length - 1}
              className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 disabled:opacity-40 flex items-center space-x-1"
            >
              <span>Next</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handleApplyStep}
              className="px-4 py-2 text-xs font-semibold rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white flex items-center space-x-2 shadow-md shadow-indigo-600/20"
            >
              <span>Jump to this Step ({currentStep.tab})</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
