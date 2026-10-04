// Smart Community Intelligence Platform (SCIP) - Master Application Shell
import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext.ts';
import { TopBar } from './components/layout/TopBar.ts';
import { Sidebar } from './components/layout/Sidebar.ts';
import { LandingPage } from './components/views/LandingPage.ts';
import { AboutPage } from './components/views/AboutPage.ts';
import { CitizenDashboard } from './components/views/CitizenDashboard.ts';
import { SubmitReportView } from './components/views/SubmitReportView.ts';
import { MyReportsView } from './components/views/MyReportsView.ts';
import { IntelligenceDashboard } from './components/views/IntelligenceDashboard.ts';
import { IncidentManagementView } from './components/views/IncidentManagementView.ts';
import { ReportInvestigationView } from './components/views/ReportInvestigationView.ts';
import { GeospatialIntelligenceView } from './components/views/GeospatialIntelligenceView.ts';
import { TrendAnalysisView } from './components/views/TrendAnalysisView.ts';
import { AgentConsoleView } from './components/views/AgentConsoleView.ts';
import { AdminPanelView } from './components/views/AdminPanelView.ts';
import { TestRunnerView } from './components/views/TestRunnerView.ts';
import { ReportDetailModal } from './components/views/ReportDetailModal.ts';
import { Report, Incident } from './types/scip.ts';

function SCIPMainLayout() {
  const { role } = useAuth();
  const [currentTab, setCurrentTab] = useState<string>('home');
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [activeModalReportId, setActiveModalReportId] = useState<string | null>(null);

  const handleSelectReport = (report: Report) => {
    setActiveModalReportId(report.id);
  };

  const handleSelectIncident = (incident: Incident) => {
    setCurrentTab('incidents');
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans antialiased selection:bg-indigo-600 selection:text-white">
      {/* Top Navigation Bar */}
      <TopBar
        currentTab={currentTab}
        onNavigate={setCurrentTab}
        onToggleMobileSidebar={() => setIsMobileSidebarOpen(prev => !prev)}
      />

      {/* Main Body */}
      <div className="flex-1 flex overflow-hidden">
        {/* Navigation Sidebar */}
        <Sidebar
          currentTab={currentTab}
          onNavigate={setCurrentTab}
          isOpenMobile={isMobileSidebarOpen}
          onCloseMobile={() => setIsMobileSidebarOpen(false)}
        />

        {/* Dynamic Content Viewport */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8 bg-slate-50">
          {currentTab === 'home' && (
            <LandingPage onNavigate={setCurrentTab} />
          )}

          {currentTab === 'about' && (
            <AboutPage />
          )}

          {currentTab === 'citizen-dashboard' && (
            <CitizenDashboard
              onNavigateToSubmit={() => setCurrentTab('submit-report')}
              onNavigateToMyReports={() => setCurrentTab('my-reports')}
              onOpenIncident={() => setCurrentTab('incidents')}
            />
          )}

          {currentTab === 'submit-report' && (
            <SubmitReportView
              onReportCreated={() => {}}
              onNavigateToMyReports={() => setCurrentTab('my-reports')}
            />
          )}

          {currentTab === 'my-reports' && (
            <MyReportsView
              onNavigateToSubmit={() => setCurrentTab('submit-report')}
              onOpenIncident={() => setCurrentTab('incidents')}
            />
          )}

          {currentTab === 'intel-dashboard' && (
            <IntelligenceDashboard
              onNavigateToIncidents={() => setCurrentTab('incidents')}
              onNavigateToInvestigation={() => setCurrentTab('investigation')}
              onNavigateToMap={() => setCurrentTab('map')}
              onSelectIncident={handleSelectIncident}
              onSelectReport={handleSelectReport}
            />
          )}

          {currentTab === 'incidents' && (
            <IncidentManagementView
              onOpenReport={reportId => setActiveModalReportId(reportId)}
            />
          )}

          {currentTab === 'investigation' && (
            <ReportInvestigationView />
          )}

          {currentTab === 'map' && (
            <GeospatialIntelligenceView />
          )}

          {currentTab === 'trends' && (
            <TrendAnalysisView />
          )}

          {currentTab === 'agent' && (
            <AgentConsoleView />
          )}

          {currentTab === 'admin-panel' && (
            <AdminPanelView />
          )}

          {currentTab === 'tests' && (
            <TestRunnerView />
          )}
        </main>
      </div>

      {/* Global Report Detail Inspector */}
      {activeModalReportId && (
        <ReportDetailModal
          reportId={activeModalReportId}
          onClose={() => setActiveModalReportId(null)}
          onOpenIncident={() => {
            setActiveModalReportId(null);
            setCurrentTab('incidents');
          }}
        />
      )}
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <SCIPMainLayout />
    </AuthProvider>
  );
}
