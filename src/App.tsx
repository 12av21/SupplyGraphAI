import React, { useState } from 'react';
import { TopBar, PersonaType } from './components/TopBar';
import { Sidebar, ActiveTab } from './components/Sidebar';
import { Dashboard } from './components/Dashboard';
import { AskSupplyGraph } from './components/AskSupplyGraph';
import { ConsistencyLab } from './components/ConsistencyLab';
import { OntologyExplorer } from './components/OntologyExplorer';
import { MetricRegistryView } from './components/MetricRegistryView';
import { SupplierRiskMatrix } from './components/SupplierRiskMatrix';
import { DataLineageView } from './components/DataLineageView';
import { AuditLogView } from './components/AuditLogView';
import { TestRunnerView } from './components/TestRunnerView';
import { DemoGuideModal } from './components/DemoGuideModal';

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');
  const [currentPersona, setCurrentPersona] = useState<PersonaType>('Planning');
  const [isDemoModalOpen, setIsDemoModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
      {/* Top Bar */}
      <TopBar
        currentPersona={currentPersona}
        onSelectPersona={setCurrentPersona}
        onOpenDemoTour={() => setIsDemoModalOpen(true)}
        onRunQuickConsistencyTest={() => setActiveTab('consistency')}
      />

      {/* Main Body */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar Navigation */}
        <Sidebar activeTab={activeTab} onSelectTab={setActiveTab} />

        {/* Dynamic Content Area */}
        <main className="flex-1 overflow-y-auto p-6 md:p-8 bg-slate-950">
          {activeTab === 'dashboard' && (
            <Dashboard onNavigateToTab={setActiveTab} />
          )}

          {activeTab === 'ask' && (
            <AskSupplyGraph
              currentPersona={currentPersona}
              onOpenLineageForMetric={() => setActiveTab('lineage')}
            />
          )}

          {activeTab === 'consistency' && (
            <ConsistencyLab />
          )}

          {activeTab === 'ontology' && (
            <OntologyExplorer />
          )}

          {activeTab === 'registry' && (
            <MetricRegistryView
              onOpenLineageForMetric={() => setActiveTab('lineage')}
            />
          )}

          {activeTab === 'risk' && (
            <SupplierRiskMatrix />
          )}

          {activeTab === 'lineage' && (
            <DataLineageView />
          )}

          {activeTab === 'audit' && (
            <AuditLogView />
          )}

          {activeTab === 'tests' && (
            <TestRunnerView />
          )}
        </main>
      </div>

      {/* 3-5 Minute Presentation Walkthrough Guide Modal */}
      <DemoGuideModal
        isOpen={isDemoModalOpen}
        onClose={() => setIsDemoModalOpen(false)}
        onNavigateToTab={(tab) => {
          setActiveTab(tab);
          setIsDemoModalOpen(false);
        }}
        onSetPersona={setCurrentPersona}
      />
    </div>
  );
}
