import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  UserRole,
  ParentUser,
  StudentUser,
  TeacherUser,
  SupervisorUser,
  QuranProgram,
  AgeGroupConfig,
  SurahPlan,
  StudentGroup,
  ScheduledSession,
  StudentTask,
  FamilyActivity,
  AudioSubmission,
  StudentReport,
  PaymentRecord,
  AppNotification,
  PricingConfig,
  AssessmentCriterion,
  BadgeItem,
  WeeklySurahDivision,
} from '../types';
import {
  INITIAL_AGE_GROUPS,
  INITIAL_PROGRAM,
  INITIAL_PROGRAMS,
  INITIAL_SURAHS,
  INITIAL_PRICING,
  INITIAL_ASSESSMENT_CRITERIA,
  INITIAL_BADGES,
} from '../data/initialData';

interface AppContextType {
  // Navigation & Role State
  currentRole: UserRole | 'public';
  setCurrentRole: (role: UserRole | 'public') => void;
  isCheckoutActive: boolean;
  setIsCheckoutActive: (active: boolean) => void;
  canGoBack: boolean;
  previousScreenTitle: string | null;
  goBack: () => void;
  goHome: () => void;
  activeParent: ParentUser | null;
  activeStudent: StudentUser | null;
  activeTeacher: TeacherUser | null;
  activeSupervisor: SupervisorUser | null;
  setActiveStudentId: (studentId: string | null) => void;
  
  // Data Collections (Zero fake users initially)
  parents: ParentUser[];
  students: StudentUser[];
  teachers: TeacherUser[];
  supervisors: SupervisorUser[];
  programs: QuranProgram[];
  ageGroups: AgeGroupConfig[];
  surahs: SurahPlan[];
  groups: StudentGroup[];
  sessions: ScheduledSession[];
  tasks: StudentTask[];
  familyActivities: FamilyActivity[];
  audioSubmissions: AudioSubmission[];
  reports: StudentReport[];
  payments: PaymentRecord[];
  notifications: AppNotification[];
  pricing: PricingConfig;
  assessmentCriteria: AssessmentCriterion[];
  badges: BadgeItem[];

  // Action Methods
  registerParent: (data: { fullName: string; phone: string; email: string; parentalConsent: boolean; verified?: boolean }) => ParentUser;
  verifyParent: (parentId?: string) => void;
  loginParent: (emailOrPhone: string) => boolean;
  logoutParent: () => void;
  leaveApp: () => void;
  updateParentProfile: (updates: { fullName?: string; phone?: string; email?: string }) => void;
  cancelSubscription: (childId: string, reason?: string) => void;
  addChild: (childData: { fullName: string; age: number; gender: 'male' | 'female'; ageGroupId: string; birthDate?: string }) => StudentUser;
  updateChild: (id: string, updates: Partial<StudentUser>) => void;
  deleteChild: (id: string) => void;
  archiveChild: (id: string) => void;
  restoreChild: (id: string) => void;
  graduateChild: (id: string, programId?: string, note?: string) => void;
  activateChildByAdmin: (studentId: string) => void;
  
  // Enrollment & Payments
  enrollChildInProgram: (studentId: string, programId: string) => void;
  processPayment: (data: {
    studentIds: string[];
    planType: 'monthly' | 'full_program';
    paymentMethod: 'fawry' | 'vodafone_cash' | 'credit_card';
    couponCode?: string;
  }) => PaymentRecord;

  // Student Actions
  submitStudentAudio: (data: { studentId: string; surahName: string; versesRange: string; audioUrl?: string; audioDurationSeconds?: number; taskId?: string }) => AudioSubmission;
  submitTaskCompletion: (taskId: string) => void;
  confirmFamilyActivityByParent: (activityId: string, notes?: string) => void;

  // Teacher Actions
  recordSessionAttendance: (sessionId: string, studentId: string, status: 'present' | 'absent' | 'excused') => void;
  reviewAudioSubmission: (submissionId: string, data: { score: number; tajweedRating: 'excellent' | 'good' | 'needs_practice'; feedback: string; nextTask?: string }) => void;
  assignStudentTask: (task: Omit<StudentTask, 'id'>) => StudentTask;

  // Supervisor Actions
  createStudentReport: (report: Omit<StudentReport, 'id' | 'createdAt'>) => StudentReport;
  addSupervisorTaskFeedback: (taskId: string, feedback: string) => void;

  // Admin Actions
  addTeacher: (data: Omit<TeacherUser, 'id' | 'createdAt'>) => TeacherUser;
  updateTeacher: (id: string, updates: Partial<TeacherUser>) => void;
  deleteTeacher: (id: string) => void;
  
  addSupervisor: (data: Omit<SupervisorUser, 'id' | 'createdAt'>) => SupervisorUser;
  updateSupervisor: (id: string, updates: Partial<SupervisorUser>) => void;
  deleteSupervisor: (id: string) => void;

  addGroup: (group: Omit<StudentGroup, 'id'>) => StudentGroup;
  updateGroup: (id: string, updates: Partial<StudentGroup>) => void;
  deleteGroup: (id: string) => void;

  addSession: (session: Omit<ScheduledSession, 'id' | 'attendance'>) => ScheduledSession;
  updateSession: (id: string, updates: Partial<ScheduledSession>) => void;
  deleteSession: (id: string) => void;

  addSurahDivision: (surahId: string, division: Omit<WeeklySurahDivision, 'id'>) => void;
  updateSurahPlan: (surahId: string, updates: Partial<SurahPlan>) => void;

  addAgeGroup: (ageGroup: Omit<AgeGroupConfig, 'id'>) => AgeGroupConfig;
  updateAgeGroup: (id: string, updates: Partial<AgeGroupConfig>) => void;
  deleteAgeGroup: (id: string) => void;

  addProgram: (program: Omit<QuranProgram, 'id'>) => QuranProgram;
  updateProgram: (id: string, updates: Partial<QuranProgram>) => void;

  updatePricing: (updates: Partial<PricingConfig>) => void;
  addCoupon: (coupon: { code: string; discountPercent: number; active: boolean }) => void;
  toggleCoupon: (code: string) => void;

  addAssessmentCriterion: (crit: Omit<AssessmentCriterion, 'id'>) => AssessmentCriterion;
  updateAssessmentCriterion: (id: string, updates: Partial<AssessmentCriterion>) => void;
  deleteAssessmentCriterion: (id: string) => void;

  addNotification: (notif: Omit<AppNotification, 'id' | 'createdAt' | 'read'>) => void;
  markNotificationRead: (id: string) => void;

  // Utilities
  resetAllData: () => void;
  toastMessage: string | null;
  setToastMessage: (msg: string | null) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_PREFIX = 'moayasha_platform_v2_';

function getStorage<T>(key: string, defaultValue: T): T {
  try {
    const saved = localStorage.getItem(STORAGE_PREFIX + key);
    if (saved) return JSON.parse(saved);
  } catch (e) {
    console.error('Failed to load storage for key:', key, e);
  }
  return defaultValue;
}

function setStorage<T>(key: string, value: T) {
  try {
    localStorage.setItem(STORAGE_PREFIX + key, JSON.stringify(value));
  } catch (e) {
    console.error('Failed to save storage for key:', key, e);
  }
}

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // User & Role State
  const [currentRole, setCurrentRoleState] = useState<UserRole | 'public'>(() => 
    getStorage<UserRole | 'public'>('current_role', 'public')
  );
  
  const [activeParentId, setActiveParentId] = useState<string | null>(() => 
    getStorage<string | null>('active_parent_id', null)
  );
  
  const [activeStudentId, setActiveStudentIdState] = useState<string | null>(() => 
    getStorage<string | null>('active_student_id', null)
  );
  
  const [activeTeacherId, setActiveTeacherId] = useState<string | null>(() => 
    getStorage<string | null>('active_teacher_id', null)
  );
  
  const [activeSupervisorId, setActiveSupervisorId] = useState<string | null>(() => 
    getStorage<string | null>('active_supervisor_id', null)
  );

  // Navigation History & Back Arrow State
  const [isCheckoutActive, setIsCheckoutActiveState] = useState<boolean>(false);
  const [navigationHistory, setNavigationHistory] = useState<Array<{
    role: UserRole | 'public';
    studentId?: string | null;
    isCheckout?: boolean;
    title: string;
  }>>([]);

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Collections (All user data starts STRICTLY EMPTY)
  const [parents, setParents] = useState<ParentUser[]>(() => getStorage<ParentUser[]>('parents', []));
  const [students, setStudents] = useState<StudentUser[]>(() => getStorage<StudentUser[]>('students', []));
  const [teachers, setTeachers] = useState<TeacherUser[]>(() => getStorage<TeacherUser[]>('teachers', []));
  const [supervisors, setSupervisors] = useState<SupervisorUser[]>(() => getStorage<SupervisorUser[]>('supervisors', []));
  const [groups, setGroups] = useState<StudentGroup[]>(() => getStorage<StudentGroup[]>('groups', []));
  const [sessions, setSessions] = useState<ScheduledSession[]>(() => getStorage<ScheduledSession[]>('sessions', []));
  const [tasks, setTasks] = useState<StudentTask[]>(() => getStorage<StudentTask[]>('tasks', []));
  const [familyActivities, setFamilyActivities] = useState<FamilyActivity[]>(() => getStorage<FamilyActivity[]>('family_activities', []));
  const [audioSubmissions, setAudioSubmissions] = useState<AudioSubmission[]>(() => getStorage<AudioSubmission[]>('audio_submissions', []));
  const [reports, setReports] = useState<StudentReport[]>(() => getStorage<StudentReport[]>('reports', []));
  const [payments, setPayments] = useState<PaymentRecord[]>(() => getStorage<PaymentRecord[]>('payments', []));
  const [notifications, setNotifications] = useState<AppNotification[]>(() => getStorage<AppNotification[]>('notifications', []));

  // Configurable System Entities
  const [programs, setPrograms] = useState<QuranProgram[]>(() => {
    const stored = getStorage<QuranProgram[]>('programs', []);
    return stored && stored.length >= INITIAL_PROGRAMS.length ? stored : INITIAL_PROGRAMS;
  });
  const [ageGroups, setAgeGroups] = useState<AgeGroupConfig[]>(() => getStorage<AgeGroupConfig[]>('age_groups', INITIAL_AGE_GROUPS));
  const [surahs, setSurahs] = useState<SurahPlan[]>(() => getStorage<SurahPlan[]>('surahs', INITIAL_SURAHS));
  const [pricing, setPricing] = useState<PricingConfig>(() => getStorage<PricingConfig>('pricing', INITIAL_PRICING));
  const [assessmentCriteria, setAssessmentCriteria] = useState<AssessmentCriterion[]>(() => getStorage<AssessmentCriterion[]>('assessment_criteria', INITIAL_ASSESSMENT_CRITERIA));
  const [badges, setBadges] = useState<BadgeItem[]>(() => getStorage<BadgeItem[]>('badges', INITIAL_BADGES));

  // Sync to localStorage
  useEffect(() => setStorage('current_role', currentRole), [currentRole]);
  useEffect(() => setStorage('active_parent_id', activeParentId), [activeParentId]);
  useEffect(() => setStorage('active_student_id', activeStudentId), [activeStudentId]);
  useEffect(() => setStorage('active_teacher_id', activeTeacherId), [activeTeacherId]);
  useEffect(() => setStorage('active_supervisor_id', activeSupervisorId), [activeSupervisorId]);

  useEffect(() => setStorage('parents', parents), [parents]);
  useEffect(() => setStorage('students', students), [students]);
  useEffect(() => setStorage('teachers', teachers), [teachers]);
  useEffect(() => setStorage('supervisors', supervisors), [supervisors]);
  useEffect(() => setStorage('groups', groups), [groups]);
  useEffect(() => setStorage('sessions', sessions), [sessions]);
  useEffect(() => setStorage('tasks', tasks), [tasks]);
  useEffect(() => setStorage('family_activities', familyActivities), [familyActivities]);
  useEffect(() => setStorage('audio_submissions', audioSubmissions), [audioSubmissions]);
  useEffect(() => setStorage('reports', reports), [reports]);
  useEffect(() => setStorage('payments', payments), [payments]);
  useEffect(() => setStorage('notifications', notifications), [notifications]);
  useEffect(() => setStorage('programs', programs), [programs]);
  useEffect(() => setStorage('ageGroups', ageGroups), [ageGroups]);
  useEffect(() => setStorage('surahs', surahs), [surahs]);
  useEffect(() => setStorage('pricing', pricing), [pricing]);
  useEffect(() => setStorage('assessment_criteria', assessmentCriteria), [assessmentCriteria]);
  useEffect(() => setStorage('badges', badges), [badges]);

  // Derived Active Objects
  const activeParent = activeParentId ? (parents.find(p => p.id === activeParentId) || null) : null;
  const activeStudent = activeStudentId ? (students.find(s => s.id === activeStudentId) || null) : (students.length > 0 ? students[0] : null);
  const activeTeacher = teachers.find(t => t.id === activeTeacherId) || (teachers.length > 0 ? teachers[0] : null);
  const activeSupervisor = supervisors.find(s => s.id === activeSupervisorId) || (supervisors.length > 0 ? supervisors[0] : null);

  const getScreenTitle = (role: UserRole | 'public', checkout?: boolean): string => {
    if (checkout) return 'الاشتراكات والدفع';
    switch (role) {
      case 'parent': return 'لوحة ولي الأمر';
      case 'student': return 'لوحة الطالب';
      case 'teacher': return 'لوحة المحفظ';
      case 'supervisor': return 'لوحة المشرف';
      case 'admin': return 'لوحة الإدارة';
      case 'public':
      default:
        return 'الرئيسية';
    }
  };

  const setCurrentRole = (role: UserRole | 'public') => {
    if (role !== currentRole || isCheckoutActive) {
      setNavigationHistory(prev => [
        ...prev.slice(-15),
        {
          role: currentRole,
          studentId: activeStudentId,
          isCheckout: isCheckoutActive,
          title: getScreenTitle(currentRole, isCheckoutActive),
        }
      ]);
      if (isCheckoutActive) setIsCheckoutActiveState(false);
      setCurrentRoleState(role);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const setIsCheckoutActive = (active: boolean) => {
    if (active && !isCheckoutActive) {
      setNavigationHistory(prev => [
        ...prev.slice(-15),
        {
          role: currentRole,
          studentId: activeStudentId,
          isCheckout: false,
          title: getScreenTitle(currentRole, false),
        }
      ]);
      setIsCheckoutActiveState(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (!active && isCheckoutActive) {
      setIsCheckoutActiveState(false);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const goBack = () => {
    // If checkout view is active, closing it takes user back to previous view (e.g. parent)
    if (isCheckoutActive) {
      setIsCheckoutActiveState(false);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    if (navigationHistory.length > 0) {
      const prevItem = navigationHistory[navigationHistory.length - 1];
      setNavigationHistory(prev => prev.slice(0, -1));

      if (prevItem.isCheckout) {
        setIsCheckoutActiveState(true);
      } else {
        setIsCheckoutActiveState(false);
      }

      if (prevItem.studentId !== undefined) {
        setActiveStudentIdState(prevItem.studentId);
      }
      setCurrentRoleState(prevItem.role);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    // Smart fallback if history is empty
    if (currentRole === 'student') {
      setCurrentRoleState('parent');
    } else if (currentRole !== 'public') {
      setCurrentRoleState('public');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const goHome = () => {
    if (currentRole !== 'public' || isCheckoutActive) {
      setNavigationHistory(prev => [
        ...prev.slice(-15),
        {
          role: currentRole,
          studentId: activeStudentId,
          isCheckout: isCheckoutActive,
          title: getScreenTitle(currentRole, isCheckoutActive),
        }
      ]);
      if (isCheckoutActive) {
        setIsCheckoutActiveState(false);
      }
      setCurrentRoleState('public');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const canGoBack = Boolean(
    isCheckoutActive ||
    currentRole !== 'public' ||
    navigationHistory.length > 0
  );

  const previousScreenTitle = (() => {
    if (isCheckoutActive) {
      return 'لوحة ولي الأمر';
    }
    if (navigationHistory.length > 0) {
      return navigationHistory[navigationHistory.length - 1].title;
    }
    if (currentRole === 'student') {
      return 'لوحة ولي الأمر';
    }
    if (currentRole !== 'public') {
      return 'الرئيسية';
    }
    return null;
  })();

  const setActiveStudentId = (id: string | null) => {
    setActiveStudentIdState(id);
  };

  const notifyToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((current) => (current === msg ? null : current));
    }, 4000);
  };

  // Auth & Parent
  const registerParent = (data: { fullName: string; phone: string; email: string; parentalConsent: boolean; verified?: boolean }): ParentUser => {
    const isVerified = data.verified ?? false;
    const newParent: ParentUser = {
      id: 'p-' + Date.now(),
      fullName: data.fullName,
      phone: data.phone,
      email: data.email,
      verified: isVerified,
      parentalConsent: data.parentalConsent,
      createdAt: new Date().toISOString(),
    };
    setParents(prev => [...prev, newParent]);
    setActiveParentId(newParent.id);
    setCurrentRoleState('parent');
    return newParent;
  };

  const verifyParent = (parentId?: string) => {
    const targetId = parentId || activeParentId;
    if (targetId) {
      setParents(prev => prev.map(p => p.id === targetId ? { ...p, verified: true } : p));
      notifyToast('تم تفعيل وتأكيد حساب ولي الأمر بنجاح!');
      const newNotif: AppNotification = {
        id: 'notif-' + Date.now(),
        recipientId: targetId,
        role: 'parent',
        title: 'تم تفعيل وتأكيد الحساب بنجاح',
        message: 'تم تفعيل وتأكيد حساب ولي الأمر بنجاح، يمكنك الآن إدارة رحلة المعايشة وإضافة ومتابعة الأبناء.',
        type: 'system',
        createdAt: new Date().toISOString(),
        read: false,
      };
      setNotifications(prev => [newNotif, ...prev]);
    }
  };

  const loginParent = (emailOrPhone: string): boolean => {
    const found = parents.find(p => p.email.toLowerCase() === emailOrPhone.toLowerCase() || p.phone === emailOrPhone);
    if (found) {
      setActiveParentId(found.id);
      setCurrentRoleState('parent');
      notifyToast(`أهلاً بك مجدداً ${found.fullName}`);
      return true;
    }
    return false;
  };

  const logoutParent = () => {
    setActiveParentId(null);
    setActiveStudentIdState(null);
    setIsCheckoutActiveState(false);
    setNavigationHistory([]);
    setCurrentRoleState('public');
    notifyToast('تم تسجيل الخروج من حساب ولي الأمر بنجاح');
  };

  const leaveApp = () => {
    setActiveParentId(null);
    setActiveStudentIdState(null);
    setIsCheckoutActiveState(false);
    setNavigationHistory([]);
    setCurrentRoleState('public');
    notifyToast('تمت مغادرة حساب ولي الأمر والعودة إلى الواجهة الرئيسية');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const updateParentProfile = (updates: { fullName?: string; phone?: string; email?: string }) => {
    if (!activeParentId) return;
    setParents(prev => prev.map(p => p.id === activeParentId ? { ...p, ...updates } : p));
    notifyToast('تم حفظ تحديثات بيانات حساب ولي الأمر بنجاح');
  };

  const cancelSubscription = (childId: string, reason?: string) => {
    const child = students.find(s => s.id === childId);
    if (!child) return;

    setStudents(prev => prev.map(s => {
      if (s.id === childId) {
        return {
          ...s,
          status: 'inactive' as const,
          enrollmentStatus: 'pending_subscription' as const,
          subscriptionCancelled: true,
          subscriptionCancelledAt: new Date().toISOString(),
          subscriptionCancelReason: reason || 'طلب ولي الأمر إلغاء الاشتراك',
        };
      }
      return s;
    }));

    const notif: AppNotification = {
      id: 'notif-' + Date.now(),
      recipientId: child.parentId,
      role: 'parent',
      title: `تم إلغاء الاشتراك للابن/الابنة "${child.fullName}"`,
      message: `تم إلغاء الاشتراك بنجاح. بيانات وتقدم الطفل وتلاواته المسجلة محفوظة بالكامل ويمكنك إعادة التفعيل في أي وقت.`,
      type: 'payment',
      createdAt: new Date().toISOString(),
      read: false,
    };
    setNotifications(prev => [notif, ...prev]);

    notifyToast(`تم إلغاء اشتراك "${child.fullName}" بنجاح، وتقدمه محفوظ`);
  };

  const addChild = (childData: { fullName: string; age: number; gender: 'male' | 'female'; ageGroupId: string; birthDate?: string }): StudentUser => {
    const parentId = activeParent?.id || (parents[0]?.id ?? 'p-demo');
    const newChild: StudentUser = {
      id: 's-' + Date.now(),
      parentId,
      fullName: childData.fullName,
      age: childData.age,
      gender: childData.gender,
      ageGroupId: childData.ageGroupId,
      birthDate: childData.birthDate,
      status: 'pending_payment',
      enrollmentStatus: 'pending_subscription',
      currentProgramId: 'moayasha-3months',
    };
    setStudents(prev => [...prev, newChild]);
    setActiveStudentIdState(newChild.id);
    notifyToast(`تمت إضافة الابن/الابنة "${childData.fullName}" بنجاح، وتم إرسال رسالة تأكيد وتفعيل لولي الأمر.`);

    const notif: AppNotification = {
      id: 'notif-' + Date.now(),
      recipientId: parentId,
      role: 'parent',
      title: 'إرسال رسالة تأكيد وتفعيل حساب الابن',
      message: `تم إرسال رسالة تفعيل وتأكيد إضافة حساب الابن/الابنة "${childData.fullName}" عبر الواتساب والرسائل القصيرة إلى هاتف ولي الأمر.`,
      type: 'system',
      createdAt: new Date().toISOString(),
      read: false,
    };
    setNotifications(prev => [notif, ...prev]);

    return newChild;
  };

  const updateChild = (id: string, updates: Partial<StudentUser>) => {
    setStudents(prev => prev.map(s => s.id === id ? { ...s, ...updates } : s));
    notifyToast('تم تحديث بيانات الطفل بنجاح');
  };

  const deleteChild = (id: string) => {
    setStudents(prev => prev.filter(s => s.id !== id));
    setTasks(prev => prev.filter(t => t.studentId !== id));
    setAudioSubmissions(prev => prev.filter(a => a.studentId !== id));
    setFamilyActivities(prev => prev.filter(fa => fa.studentId !== id));
    setReports(prev => prev.filter(r => r.studentId !== id));
    if (activeStudentId === id) {
      setActiveStudentIdState(null);
    }
    notifyToast('تم حذف ملف الطفل المُضاف بالخطأ بنجاح');
  };

  const archiveChild = (id: string) => {
    setStudents(prev => prev.map(s => {
      if (s.id === id) {
        return {
          ...s,
          status: 'archived' as const,
          archivedAt: new Date().toISOString(),
        };
      }
      return s;
    }));
    if (activeStudentId === id) {
      setActiveStudentIdState(null);
    }
    notifyToast('تمت أرشفة ملف الطفل وحفظ كامل بياناته وسجلاته ومدفوعاته بأمان');
  };

  const restoreChild = (id: string) => {
    setStudents(prev => prev.map(s => {
      if (s.id === id) {
        return {
          ...s,
          status: 'active' as const,
          archivedAt: undefined,
        };
      }
      return s;
    }));
    notifyToast('تمت استعادة ملف الطفل وإعادته إلى قائمة الأبناء النشطين بنجاح');
  };

  const graduateChild = (id: string, programId?: string, note?: string) => {
    let childName = '';
    setStudents(prev => prev.map(s => {
      if (s.id === id) {
        childName = s.fullName;
        const progId = programId || s.currentProgramId || 'moayasha-3months';
        const existingCompleted = s.completedProgramIds || [];
        const completedProgramIds = existingCompleted.includes(progId) ? existingCompleted : [...existingCompleted, progId];
        return {
          ...s,
          status: 'graduated' as const,
          graduatedAt: new Date().toISOString(),
          completedProgramIds,
          graduationNote: note || 'أتم برنامج معايشة القرآن الكريم بنجاح ومستعد للمرحلة التالية',
        };
      }
      return s;
    }));

    // Add congratulatory notification for graduation
    const targetStudent = students.find(s => s.id === id);
    if (targetStudent) {
      const gradNotif: AppNotification = {
        id: `notif-grad-${Date.now()}`,
        recipientId: targetStudent.parentId,
        role: 'parent',
        title: `🎓 مبارك تخرج ${targetStudent.fullName}!`,
        message: `تم توثيق إتمام برنامج معايشة القرآن الكريم بنجاح! ملف الطفل محفوظ بالكامل ويمكنكم تسجيله في برنامج متقدم آخر في أي وقت.`,
        type: 'system',
        read: false,
        createdAt: new Date().toISOString(),
      };
      setNotifications(prev => [gradNotif, ...prev]);
    }

    notifyToast(`مبارك! تم توثيق إتمام البرنامج وتخرج ${childName || 'الطفل'} بنجاح 🎓`);
  };

  const activateChildByAdmin = (studentId: string) => {
    let studentName = '';
    setStudents(prev => prev.map(s => {
      if (s.id === studentId) {
        studentName = s.fullName;
        return {
          ...s,
          status: 'active' as const,
          enrollmentStatus: 'active' as const,
          enrolledAt: s.enrolledAt || new Date().toISOString(),
        };
      }
      return s;
    }));

    const targetStudent = students.find(s => s.id === studentId);
    if (targetStudent) {
      addNotification({
        recipientId: targetStudent.parentId,
        role: 'parent',
        title: `✅ تم تفعيل اشتراك ${targetStudent.fullName} رسمياً!`,
        message: `تم اعتماد وتفعيل اشتراك ${targetStudent.fullName} من قبل الإدارة. انتقل الطفل الآن تلقائياً إلى قائمة «الأبناء النشطون» ويمكنه بدء رحلة الحفظ والتدبر فوراً.`,
        type: 'system',
      });
    }

    notifyToast(`تم تفعيل اشتراك الطالب "${studentName || 'الطفل'}" ونقله للأبناء النشطين بنجاح`);
  };

  const enrollChildInProgram = (studentId: string, programId: string) => {
    const selectedProgram = programs.find(p => p.id === programId);
    setStudents(prev => prev.map(s => {
      if (s.id === studentId) {
        return {
          ...s,
          currentProgramId: programId,
          status: 'pending_payment' as const,
          enrollmentStatus: 'pending_payment' as const,
          enrolledAt: new Date().toISOString(),
        };
      }
      return s;
    }));
    notifyToast(`تم اختيار ${selectedProgram ? selectedProgram.name : 'البرنامج القرآني'} للطفل — يرجى استكمال الدفع`);
  };

  // Payment Processing
  const processPayment = (data: {
    studentIds: string[];
    planType: 'monthly' | 'full_program';
    paymentMethod: 'fawry' | 'vodafone_cash' | 'credit_card';
    couponCode?: string;
  }): PaymentRecord => {
    const enrolledStudents = students.filter(s => data.studentIds.includes(s.id));
    const parent = activeParent || { id: 'p-guest', fullName: 'ولي أمر', phone: '', email: '', verified: true, parentalConsent: true, createdAt: '' };
    
    // Sibling pricing logic:
    // 1st student: Promo price (1500 EGP) if promo slots available, else standard (2000 EGP)
    // 2nd+ student: Sibling price (1250 EGP)
    let total = 0;
    const breakdown: { item: string; amount: number }[] = [];

    enrolledStudents.forEach((student, index) => {
      let baseRate = pricing.promotionalMonthlyEGP;
      let label = `اشتراك شهري: ${student.fullName}`;
      if (index > 0) {
        baseRate = pricing.siblingMonthlyEGP;
        label += ' (خصم الأخوة)';
      } else if (pricing.promoSubscribersCount >= pricing.promoCapacity) {
        baseRate = pricing.regularMonthlyEGP;
      } else {
        label += ' (عرض الانطلاق - خصم 25%)';
      }

      if (data.planType === 'full_program') {
        const fullAmount = baseRate * 3 * 0.9; // 10% extra discount for 3 months upfront
        total += fullAmount;
        breakdown.push({ item: `${label} - البرنامج كاملاً (3 أشهر مع خصم إضافي)`, amount: fullAmount });
      } else {
        total += baseRate;
        breakdown.push({ item: label, amount: baseRate });
      }
    });

    let discountApplied: string | undefined;
    if (data.couponCode) {
      const coupon = pricing.coupons.find(c => c.code.toUpperCase() === data.couponCode?.toUpperCase() && c.active);
      if (coupon) {
        const discountVal = (total * coupon.discountPercent) / 100;
        total = Math.max(0, total - discountVal);
        discountApplied = `كوبون ${coupon.code} (${coupon.discountPercent}%)`;
        breakdown.push({ item: `خصم الكوبون (${coupon.code})`, amount: -discountVal });
      }
    }

    const newPayment: PaymentRecord = {
      id: 'pay-' + Date.now(),
      parentId: parent.id,
      studentIds: data.studentIds,
      programId: 'moayasha-3months',
      amount: total,
      currency: pricing.currency,
      planType: data.planType,
      paymentMethod: data.paymentMethod,
      status: 'successful',
      invoiceNumber: 'INV-' + Math.floor(100000 + Math.random() * 900000),
      paidAt: new Date().toISOString(),
      discountApplied,
      receiptDetails: {
        payerName: parent.fullName,
        phone: parent.phone,
        studentNames: enrolledStudents.map(s => s.fullName),
        breakdown,
      },
    };

    setPayments(prev => [newPayment, ...prev]);

    // Update students to pending_activation status upon payment (awaiting admin activation)
    setStudents(prev => prev.map(s => data.studentIds.includes(s.id) ? { 
      ...s, 
      status: 'pending_payment', 
      enrollmentStatus: 'pending_activation', 
      enrolledAt: new Date().toISOString() 
    } : s));

    // Update promo capacity count
    setPricing(prev => ({
      ...prev,
      promoSubscribersCount: Math.min(prev.promoCapacity, prev.promoSubscribersCount + data.studentIds.length)
    }));

    // Add notification
    addNotification({
      recipientId: parent.id,
      role: 'parent',
      title: 'تم تأكيد الاشتراك بنجاح',
      message: `تم سداد مبلغ ${total} ${pricing.currency} وإصدار الفاتورة رقم ${newPayment.invoiceNumber}. يمكنك الآن متابعة رحلة أبنائك.`,
      type: 'payment',
    });

    notifyToast(`تم تأكيد الدفع وإصدار الإيصال رقم ${newPayment.invoiceNumber}`);
    return newPayment;
  };

  // Student Submissions
  const submitStudentAudio = (data: { studentId: string; surahName: string; versesRange: string; audioUrl?: string; audioDurationSeconds?: number; taskId?: string }): AudioSubmission => {
    const newSubmission: AudioSubmission = {
      id: 'aud-' + Date.now(),
      studentId: data.studentId,
      taskId: data.taskId,
      surahName: data.surahName,
      versesRange: data.versesRange,
      audioUrl: data.audioUrl || 'recording_blob_simulated',
      audioDurationSeconds: data.audioDurationSeconds || 45,
      submittedAt: new Date().toISOString(),
      status: 'pending_review',
    };
    setAudioSubmissions(prev => [newSubmission, ...prev]);

    if (data.taskId) {
      setTasks(prev => prev.map(t => t.id === data.taskId ? { ...t, status: 'in_progress', audioSubmissionId: newSubmission.id } : t));
    }

    notifyToast('تم رفع تسجيل التسميع بنجاح! سيقوم المحفظ بمراجعته والتقييم.');
    return newSubmission;
  };

  const submitTaskCompletion = (taskId: string) => {
    setTasks(prev => prev.map(t => t.id === taskId ? { ...t, status: 'completed', completedAt: new Date().toISOString() } : t));
    notifyToast('تم إكمال المهمة وإضافتها إلى شجرة المعايشة!');
  };

  const confirmFamilyActivityByParent = (activityId: string, notes?: string) => {
    setFamilyActivities(prev => prev.map(a => a.id === activityId ? {
      ...a,
      completed: true,
      parentConfirmation: true,
      completedAt: new Date().toISOString(),
      parentNotes: notes || a.parentNotes,
    } : a));
    notifyToast('تم تأكيد إنجاز النشاط الأسري بنجاح');
  };

  // Teacher Reviews
  const recordSessionAttendance = (sessionId: string, studentId: string, status: 'present' | 'absent' | 'excused') => {
    setSessions(prev => prev.map(s => {
      if (s.id === sessionId) {
        return {
          ...s,
          attendance: { ...s.attendance, [studentId]: status }
        };
      }
      return s;
    }));
    notifyToast(`تم تسجيل الحضور: ${status === 'present' ? 'حاضر' : status === 'absent' ? 'غائب' : 'معذور'}`);
  };

  const reviewAudioSubmission = (submissionId: string, data: { score: number; tajweedRating: 'excellent' | 'good' | 'needs_practice'; feedback: string; nextTask?: string }) => {
    setAudioSubmissions(prev => prev.map(sub => {
      if (sub.id === submissionId) {
        return {
          ...sub,
          status: 'reviewed',
          score: data.score,
          tajweedRating: data.tajweedRating,
          teacherFeedback: data.feedback,
          assignedNextTask: data.nextTask,
          reviewedAt: new Date().toISOString(),
          reviewedByTeacherId: activeTeacher?.id,
        };
      }
      return sub;
    }));

    // Update associated task if any
    const sub = audioSubmissions.find(s => s.id === submissionId);
    if (sub?.taskId) {
      setTasks(prev => prev.map(t => t.id === sub.taskId ? {
        ...t,
        status: 'completed',
        teacherFeedback: data.feedback,
      } : t));
    }

    notifyToast('تم حفظ تقييم التسميع وإرسال الملاحظات للطالب وولي الأمر.');
  };

  const assignStudentTask = (taskData: Omit<StudentTask, 'id'>): StudentTask => {
    const newTask: StudentTask = {
      id: 'tsk-' + Date.now(),
      ...taskData,
    };
    setTasks(prev => [newTask, ...prev]);
    notifyToast(`تم إسناد المهمة: "${taskData.title}"`);
    return newTask;
  };

  // Supervisor Actions
  const createStudentReport = (reportData: Omit<StudentReport, 'id' | 'createdAt'>): StudentReport => {
    const newReport: StudentReport = {
      id: 'rep-' + Date.now(),
      ...reportData,
      createdAt: new Date().toISOString(),
    };
    setReports(prev => [newReport, ...prev]);
    notifyToast('تم إصدار تقرير المتابعة التربوية للابن');
    return newReport;
  };

  const addSupervisorTaskFeedback = (taskId: string, feedback: string) => {
    setTasks(prev => prev.map(t => t.id === taskId ? { ...t, supervisorFeedback: feedback } : t));
    notifyToast('تمت إضافة ملاحظة المشرف التربوي');
  };

  // Staff Management (Admin)
  const addTeacher = (data: Omit<TeacherUser, 'id' | 'createdAt'>): TeacherUser => {
    const newTeacher: TeacherUser = {
      id: 'tch-' + Date.now(),
      ...data,
      createdAt: new Date().toISOString(),
    };
    setTeachers(prev => [...prev, newTeacher]);
    notifyToast(`تمت إضافة المحفظ: ${data.fullName}`);
    return newTeacher;
  };

  const updateTeacher = (id: string, updates: Partial<TeacherUser>) => {
    setTeachers(prev => prev.map(t => t.id === id ? { ...t, ...updates } : t));
    notifyToast('تم تحديث بيانات المحفظ');
  };

  const deleteTeacher = (id: string) => {
    setTeachers(prev => prev.filter(t => t.id !== id));
    notifyToast('تم حذف المحفظ');
  };

  const addSupervisor = (data: Omit<SupervisorUser, 'id' | 'createdAt'>): SupervisorUser => {
    const newSup: SupervisorUser = {
      id: 'sup-' + Date.now(),
      ...data,
      createdAt: new Date().toISOString(),
    };
    setSupervisors(prev => [...prev, newSup]);
    notifyToast(`تمت إضافة المشرف/الكوتش: ${data.fullName}`);
    return newSup;
  };

  const updateSupervisor = (id: string, updates: Partial<SupervisorUser>) => {
    setSupervisors(prev => prev.map(s => s.id === id ? { ...s, ...updates } : s));
    notifyToast('تم تحديث بيانات المشرف');
  };

  const deleteSupervisor = (id: string) => {
    setSupervisors(prev => prev.filter(s => s.id !== id));
    notifyToast('تم حذف المشرف');
  };

  // Group & Session Management
  const addGroup = (groupData: Omit<StudentGroup, 'id'>): StudentGroup => {
    const newGroup: StudentGroup = {
      id: 'grp-' + Date.now(),
      ...groupData,
    };
    setGroups(prev => [...prev, newGroup]);
    notifyToast(`تم إنشاء المجموعة: ${groupData.name}`);
    return newGroup;
  };

  const updateGroup = (id: string, updates: Partial<StudentGroup>) => {
    setGroups(prev => prev.map(g => g.id === id ? { ...g, ...updates } : g));
    notifyToast('تم تحديث المجموعة');
  };

  const deleteGroup = (id: string) => {
    setGroups(prev => prev.filter(g => g.id !== id));
    notifyToast('تم حذف المجموعة');
  };

  const addSession = (sessionData: Omit<ScheduledSession, 'id' | 'attendance'>): ScheduledSession => {
    const newSession: ScheduledSession = {
      id: 'ses-' + Date.now(),
      ...sessionData,
      attendance: {},
    };
    setSessions(prev => [newSession, ...prev]);
    notifyToast(`تمت جدولة الجلسة: ${sessionData.title}`);
    return newSession;
  };

  const updateSession = (id: string, updates: Partial<ScheduledSession>) => {
    setSessions(prev => prev.map(s => s.id === id ? { ...s, ...updates } : s));
    notifyToast('تم تحديث بيانات الجلسة');
  };

  const deleteSession = (id: string) => {
    setSessions(prev => prev.filter(s => s.id !== id));
    notifyToast('تم إلغاء الجلسة');
  };

  // Surah Plans & Content
  const addSurahDivision = (surahId: string, divisionData: Omit<WeeklySurahDivision, 'id'>) => {
    const newDiv: WeeklySurahDivision = {
      id: 'div-' + Date.now(),
      ...divisionData,
    };
    setSurahs(prev => prev.map(s => {
      if (s.id === surahId) {
        return {
          ...s,
          weeklyDivisions: [...s.weeklyDivisions, newDiv],
        };
      }
      return s;
    }));
    notifyToast(`تمت إضافة الخطة للأسبوع ${divisionData.weekNumber}`);
  };

  const updateSurahPlan = (surahId: string, updates: Partial<SurahPlan>) => {
    setSurahs(prev => prev.map(s => s.id === surahId ? { ...s, ...updates } : s));
    notifyToast('تم تحديث خطة السورة');
  };

  // Age Groups & Programs
  const addAgeGroup = (data: Omit<AgeGroupConfig, 'id'>): AgeGroupConfig => {
    const newAg: AgeGroupConfig = {
      id: 'ag-' + Date.now(),
      ...data,
    };
    setAgeGroups(prev => [...prev, newAg]);
    notifyToast(`تمت إضافة الفئة العمرية: ${data.name}`);
    return newAg;
  };

  const updateAgeGroup = (id: string, updates: Partial<AgeGroupConfig>) => {
    setAgeGroups(prev => prev.map(a => a.id === id ? { ...a, ...updates } : a));
    notifyToast('تم تحديث الفئة العمرية');
  };

  const deleteAgeGroup = (id: string) => {
    setAgeGroups(prev => prev.filter(a => a.id !== id));
    notifyToast('تم حذف الفئة العمرية');
  };

  const addProgram = (data: Omit<QuranProgram, 'id'>): QuranProgram => {
    const newProg: QuranProgram = {
      id: 'prog-' + Date.now(),
      ...data,
    };
    setPrograms(prev => [...prev, newProg]);
    notifyToast(`تمت إضافة البرنامج: ${data.name}`);
    return newProg;
  };

  const updateProgram = (id: string, updates: Partial<QuranProgram>) => {
    setPrograms(prev => prev.map(p => p.id === id ? { ...p, ...updates } : p));
    notifyToast('تم تحديث البرنامج');
  };

  // Pricing & Assessment
  const updatePricing = (updates: Partial<PricingConfig>) => {
    setPricing(prev => ({ ...prev, ...updates }));
    notifyToast('تم تحديث إعدادات الأسعار والخصومات');
  };

  const addCoupon = (coupon: { code: string; discountPercent: number; active: boolean }) => {
    setPricing(prev => ({ ...prev, coupons: [...prev.coupons, coupon] }));
    notifyToast(`تمت إضافة كوبون الخصم: ${coupon.code}`);
  };

  const toggleCoupon = (code: string) => {
    setPricing(prev => ({
      ...prev,
      coupons: prev.coupons.map(c => c.code === code ? { ...c, active: !c.active } : c)
    }));
  };

  const addAssessmentCriterion = (crit: Omit<AssessmentCriterion, 'id'>): AssessmentCriterion => {
    const newCrit: AssessmentCriterion = {
      id: 'crit-' + Date.now(),
      ...crit,
    };
    setAssessmentCriteria(prev => [...prev, newCrit]);
    notifyToast(`تمت إضافة معيار التقييم: ${crit.title}`);
    return newCrit;
  };

  const updateAssessmentCriterion = (id: string, updates: Partial<AssessmentCriterion>) => {
    setAssessmentCriteria(prev => prev.map(c => c.id === id ? { ...c, ...updates } : c));
    notifyToast('تم تحديث معيار التقييم');
  };

  const deleteAssessmentCriterion = (id: string) => {
    setAssessmentCriteria(prev => prev.filter(c => c.id !== id));
    notifyToast('تم حذف معيار التقييم');
  };

  // Notifications
  const addNotification = (notif: Omit<AppNotification, 'id' | 'createdAt' | 'read'>) => {
    const newNotif: AppNotification = {
      id: 'notif-' + Date.now(),
      ...notif,
      createdAt: new Date().toISOString(),
      read: false,
    };
    setNotifications(prev => [newNotif, ...prev]);
  };

  const markNotificationRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const resetAllData = () => {
    Object.keys(localStorage).forEach(key => {
      if (key.startsWith(STORAGE_PREFIX)) {
        localStorage.removeItem(key);
      }
    });
    setParents([]);
    setStudents([]);
    setTeachers([]);
    setSupervisors([]);
    setGroups([]);
    setSessions([]);
    setTasks([]);
    setFamilyActivities([]);
    setAudioSubmissions([]);
    setReports([]);
    setPayments([]);
    setNotifications([]);
    setPrograms([INITIAL_PROGRAM]);
    setAgeGroups(INITIAL_AGE_GROUPS);
    setSurahs(INITIAL_SURAHS);
    setPricing(INITIAL_PRICING);
    setAssessmentCriteria(INITIAL_ASSESSMENT_CRITERIA);
    setBadges(INITIAL_BADGES);
    setActiveParentId(null);
    setActiveStudentIdState(null);
    setActiveTeacherId(null);
    setActiveSupervisorId(null);
    setIsCheckoutActiveState(false);
    setNavigationHistory([]);
    setCurrentRoleState('public');
    notifyToast('تمت إعادة ضبط المنصة إلى الحالة الأولية (صفر مستخدمين)');
  };

  return (
    <AppContext.Provider
      value={{
        currentRole,
        setCurrentRole,
        isCheckoutActive,
        setIsCheckoutActive,
        canGoBack,
        previousScreenTitle,
        goBack,
        goHome,
        activeParent,
        activeStudent,
        activeTeacher,
        activeSupervisor,
        setActiveStudentId,
        parents,
        students,
        teachers,
        supervisors,
        programs,
        ageGroups,
        surahs,
        groups,
        sessions,
        tasks,
        familyActivities,
        audioSubmissions,
        reports,
        payments,
        notifications,
        pricing,
        assessmentCriteria,
        badges,
        registerParent,
        verifyParent,
        loginParent,
        logoutParent,
        leaveApp,
        updateParentProfile,
        cancelSubscription,
        addChild,
        updateChild,
        deleteChild,
        archiveChild,
        restoreChild,
        graduateChild,
        activateChildByAdmin,
        enrollChildInProgram,
        processPayment,
        submitStudentAudio,
        submitTaskCompletion,
        confirmFamilyActivityByParent,
        recordSessionAttendance,
        reviewAudioSubmission,
        assignStudentTask,
        createStudentReport,
        addSupervisorTaskFeedback,
        addTeacher,
        updateTeacher,
        deleteTeacher,
        addSupervisor,
        updateSupervisor,
        deleteSupervisor,
        addGroup,
        updateGroup,
        deleteGroup,
        addSession,
        updateSession,
        deleteSession,
        addSurahDivision,
        updateSurahPlan,
        addAgeGroup,
        updateAgeGroup,
        deleteAgeGroup,
        addProgram,
        updateProgram,
        updatePricing,
        addCoupon,
        toggleCoupon,
        addAssessmentCriterion,
        updateAssessmentCriterion,
        deleteAssessmentCriterion,
        addNotification,
        markNotificationRead,
        resetAllData,
        toastMessage,
        setToastMessage,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
