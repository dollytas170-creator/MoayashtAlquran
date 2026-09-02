import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { ErrorBoundary } from './components/common/ErrorBoundary';
import { Navbar } from './components/common/Navbar';
import { RegisterModal, LoginModal } from './components/auth/AuthModals';
import { AddChildModal } from './components/parent/AddChildModal';
import { LandingPage } from './views/LandingPage';
import { ParentDashboard } from './views/ParentDashboard';
import { StudentDashboard } from './views/StudentDashboard';
import { TeacherDashboard } from './views/TeacherDashboard';
import { SupervisorDashboard } from './views/SupervisorDashboard';
import { AdminDashboard } from './views/AdminDashboard';
import { CheckoutView } from './views/CheckoutView';
import { StudentUser } from './types';

function MainLayout() {
  const { currentRole, setCurrentRole, activeParent, setActiveStudentId } = useApp();

  // Navigation / Modal States
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isAddChildOpen, setIsAddChildOpen] = useState(false);
  const [editingChild, setEditingChild] = useState<StudentUser | null>(null);
  const [isCheckoutActive, setIsCheckoutActive] = useState(false);
  const [showLanding, setShowLanding] = useState(false);

  const handleOpenAddChild = () => {
    setEditingChild(null);
    setIsAddChildOpen(true);
  };

  const handleEditChild = (child: StudentUser) => {
    setEditingChild(child);
    setIsAddChildOpen(true);
  };

  const handleGoToStudentView = (childId: string) => {
    setActiveStudentId(childId);
    setCurrentRole('student');
    setShowLanding(false);
    setIsCheckoutActive(false);
  };

  const handleGoToParentPortal = () => {
    setCurrentRole('parent');
    setShowLanding(false);
    setIsCheckoutActive(false);
  };

  return (
    <div className="min-h-screen flex flex-col bg-stone-50 text-stone-900 font-sans antialiased selection:bg-emerald-200 selection:text-emerald-950">
      {/* Top Main Navbar */}
      <Navbar
        onOpenRegister={() => setIsRegisterOpen(true)}
        onOpenLogin={() => setIsLoginOpen(true)}
        onOpenAddChild={handleOpenAddChild}
      />

      {/* Main View Router */}
      <main className="flex-1">
        {isCheckoutActive ? (
          <CheckoutView
            onBackToParent={() => setIsCheckoutActive(false)}
            onGoToStudentDashboard={() => {
              setIsCheckoutActive(false);
              setCurrentRole('student');
            }}
          />
        ) : showLanding ? (
          <LandingPage
            onOpenRegister={() => setIsRegisterOpen(true)}
            onOpenLogin={() => setIsLoginOpen(true)}
            onGoToParentPortal={handleGoToParentPortal}
          />
        ) : currentRole === 'parent' ? (
          <ParentDashboard
            onOpenAddChild={handleOpenAddChild}
            onEditChild={handleEditChild}
            onGoToCheckout={() => setIsCheckoutActive(true)}
            onGoToStudentView={handleGoToStudentView}
          />
        ) : currentRole === 'student' ? (
          <StudentDashboard
            onBackToParent={() => setCurrentRole('parent')}
            onOpenAddChild={handleOpenAddChild}
          />
        ) : currentRole === 'teacher' ? (
          <TeacherDashboard />
        ) : currentRole === 'supervisor' ? (
          <SupervisorDashboard />
        ) : currentRole === 'admin' ? (
          <AdminDashboard />
        ) : (
          <LandingPage
            onOpenRegister={() => setIsRegisterOpen(true)}
            onOpenLogin={() => setIsLoginOpen(true)}
            onGoToParentPortal={handleGoToParentPortal}
          />
        )}
      </main>

      {/* Floating Landing / Portal toggle helper */}
      <aside aria-label="أدوات المساعدة السريعة" className="fixed bottom-4 left-4 z-40 flex items-center gap-2 bg-stone-900/90 backdrop-blur-xs text-white p-1.5 rounded-2xl shadow-xl border border-stone-800 text-xs font-bold">
        <button
          type="button"
          onClick={() => {
            setShowLanding((prev) => !prev);
            setIsCheckoutActive(false);
          }}
          className="px-3 py-1.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-emerald-300 transition-colors cursor-pointer"
        >
          {showLanding ? 'الدخول إلى المنصة واللوحات' : 'معاينة الصفحة التعريفية العامة'}
        </button>
      </aside>

      {/* Global Modals */}
      <RegisterModal
        isOpen={isRegisterOpen}
        onClose={() => setIsRegisterOpen(false)}
        onSwitchToLogin={() => {
          setIsRegisterOpen(false);
          setIsLoginOpen(true);
        }}
        onSuccess={() => {
          setIsRegisterOpen(false);
          setShowLanding(false);
          setCurrentRole('parent');
        }}
      />

      <LoginModal
        isOpen={isLoginOpen}
        onClose={() => setIsLoginOpen(false)}
        onSwitchToRegister={() => {
          setIsLoginOpen(false);
          setIsRegisterOpen(true);
        }}
        onSuccess={() => {
          setIsLoginOpen(false);
          setShowLanding(false);
          setCurrentRole('parent');
        }}
      />

      <AddChildModal
        isOpen={isAddChildOpen}
        onClose={() => setIsAddChildOpen(false)}
        editingChild={editingChild}
      />
    </div>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <AppProvider>
        <MainLayout />
      </AppProvider>
    </ErrorBoundary>
  );
}
