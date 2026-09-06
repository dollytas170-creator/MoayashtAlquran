import React, { useState, useEffect } from 'react';
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
  const {
    currentRole,
    setCurrentRole,
    activeParent,
    setActiveStudentId,
    isCheckoutActive,
    setIsCheckoutActive,
    goBack,
  } = useApp();

  // Navigation / Modal States
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isAddChildOpen, setIsAddChildOpen] = useState(false);
  const [editingChild, setEditingChild] = useState<StudentUser | null>(null);
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

  const handleGoToHome = () => {
    setIsCheckoutActive(false);
    setShowLanding(false);
    setCurrentRole('public');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Ensure checkout is closed and landing is shown whenever switching to public role
  useEffect(() => {
    if (currentRole === 'public') {
      setIsCheckoutActive(false);
      setShowLanding(false);
    }
  }, [currentRole]);

  const handleStartJourney = () => {
    if (activeParent) {
      setCurrentRole('parent');
      setShowLanding(false);
      setIsCheckoutActive(false);
      handleOpenAddChild();
    } else {
      setIsRegisterOpen(true);
    }
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
            onBackToHome={handleGoToHome}
            onGoToStudentDashboard={() => {
              setIsCheckoutActive(false);
              setCurrentRole('student');
            }}
          />
        ) : showLanding ? (
          <LandingPage
            onOpenRegister={handleStartJourney}
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
            onOpenRegister={handleStartJourney}
            onOpenLogin={() => setIsLoginOpen(true)}
            onGoToParentPortal={handleGoToParentPortal}
          />
        )}
      </main>

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
          setIsAddChildOpen(true);
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
