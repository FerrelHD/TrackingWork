import React, { useState, useMemo } from 'react';
import { Application, FilterState, MainStatus } from './types';
import { getStoredApplications, saveStoredApplications } from './utils/storage';
import { calculateRemainingDays } from './utils/date';
import { Navbar } from './components/Navbar';
import { MetricsStrip } from './components/MetricsStrip';
import { FilterBar } from './components/FilterBar';
import { TableView } from './components/TableView';
import { KanbanView } from './components/KanbanView';
import { DetailDrawer } from './components/DetailDrawer';
import { ApplicationModal } from './components/ApplicationModal';

export const App: React.FC = () => {
  const [applications, setApplications] = useState<Application[]>(() => getStoredApplications());
  const [viewMode, setViewMode] = useState<'table' | 'kanban'>('table');
  const [selectedApp, setSelectedApp] = useState<Application | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingApp, setEditingApp] = useState<Application | null>(null);

  const [filter, setFilter] = useState<FilterState>({
    search: '',
    workMode: 'ALL',
    status: 'ALL',
    sortBy: 'deadline_asc',
  });

  // Persist applications helper
  const updateApplications = (newApps: Application[]) => {
    setApplications(newApps);
    saveStoredApplications(newApps);
    // Keep selectedApp in sync if drawer is open
    if (selectedApp) {
      const match = newApps.find((a) => a.id === selectedApp.id);
      setSelectedApp(match || null);
    }
  };

  // Add / Save
  const handleSaveApplication = (appToSave: Application) => {
    const exists = applications.some((a) => a.id === appToSave.id);
    let next: Application[];
    if (exists) {
      next = applications.map((a) => (a.id === appToSave.id ? appToSave : a));
    } else {
      next = [appToSave, ...applications];
    }
    updateApplications(next);
  };

  // Delete
  const handleDeleteApplication = (id: string) => {
    const next = applications.filter((a) => a.id !== id);
    updateApplications(next);
    if (selectedApp?.id === id) {
      setSelectedApp(null);
    }
  };

  // Quick Status Updater (for Kanban drag & drop or quick select)
  const handleUpdateStatus = (id: string, newStatus: MainStatus) => {
    const next = applications.map((app) => {
      if (app.id === id) {
        return {
          ...app,
          mainStatus: newStatus,
          updatedAt: new Date().toISOString(),
        };
      }
      return app;
    });
    updateApplications(next);
  };

  // Filter & Sort Logic
  const filteredAndSortedApplications = useMemo(() => {
    return applications
      .filter((app) => {
        // Search
        if (filter.search.trim()) {
          const q = filter.search.toLowerCase();
          const matchCompany = app.companyName.toLowerCase().includes(q);
          const matchPosition = app.position.toLowerCase().includes(q);
          const matchCity = app.locationCity.toLowerCase().includes(q);
          if (!matchCompany && !matchPosition && !matchCity) return false;
        }

        // Work Mode
        if (filter.workMode !== 'ALL' && app.workMode !== filter.workMode) {
          return false;
        }

        // Status
        if (filter.status !== 'ALL' && app.mainStatus !== filter.status) {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (filter.sortBy === 'deadline_asc') {
          return calculateRemainingDays(a.deadlineDate) - calculateRemainingDays(b.deadlineDate);
        }
        if (filter.sortBy === 'deadline_desc') {
          return calculateRemainingDays(b.deadlineDate) - calculateRemainingDays(a.deadlineDate);
        }
        if (filter.sortBy === 'created_desc') {
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        }
        return 0;
      });
  }, [applications, filter]);

  return (
    <div className="min-h-screen bg-spidey-canvas flex flex-col font-['Plus_Jakarta_Sans',sans-serif]">
      {/* Top Navbar */}
      <Navbar
        viewMode={viewMode}
        setViewMode={setViewMode}
        onOpenAddModal={() => {
          setEditingApp(null);
          setIsModalOpen(true);
        }}
        applications={applications}
        onDataReload={updateApplications}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
        {/* Bento Strip */}
        <MetricsStrip applications={applications} />

        {/* Filter & Search Bar */}
        <FilterBar
          filter={filter}
          setFilter={setFilter}
          totalResults={filteredAndSortedApplications.length}
        />

        {/* Views: Table or Kanban */}
        {viewMode === 'table' ? (
          <TableView
            applications={filteredAndSortedApplications}
            onSelectApplication={(app) => setSelectedApp(app)}
            onEditApplication={(app) => {
              setEditingApp(app);
              setIsModalOpen(true);
            }}
            onDeleteApplication={handleDeleteApplication}
          />
        ) : (
          <KanbanView
            applications={filteredAndSortedApplications}
            onSelectApplication={(app) => setSelectedApp(app)}
            onUpdateStatus={handleUpdateStatus}
          />
        )}
      </main>

      {/* Slide-over Detail Drawer */}
      <DetailDrawer
        application={selectedApp}
        onClose={() => setSelectedApp(null)}
        onSave={handleSaveApplication}
        onDelete={handleDeleteApplication}
      />

      {/* Add / Edit Modal */}
      <ApplicationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveApplication}
        initialData={editingApp}
      />

      {/* Footer */}
      <footer className="mt-auto border-t-2 border-slate-200 bg-white py-4 text-center text-xs text-slate-500 font-semibold">
        <p>
          MagangHub Tracker &bull; Dirancang untuk pencari magang mandiri &bull; Data tersimpan aman di browser Anda
        </p>
      </footer>
    </div>
  );
};
