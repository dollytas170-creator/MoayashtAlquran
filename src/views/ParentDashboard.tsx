import React, { useState } from 'react';
import {
  Users,
  UserPlus,
  TreeDeciduous,
  BookOpen,
  Calendar,
  HeartHandshake,
  Award,
  FileText,
  CreditCard,
  Bell,
  CheckCircle2,
  Clock,
  Video,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Sparkles,
  MessageSquare,
  AlertCircle,
  Play,
  Trash2,
  AlertTriangle,
  Archive,
  GraduationCap,
  RotateCcw,
  ShieldCheck,
  Check,
  Info,
  BookOpenCheck,
  X,
  Eye,
  HelpCircle,
  Lock,
  Settings,
  LogOut,
  ArrowRight,
  Home,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { EmptyState } from '../components/common/EmptyState';
import { StudentUser } from '../types';
import { ParentSettingsModal } from '../components/parent/ParentSettingsModal';

interface ParentDashboardProps {
  onOpenAddChild: () => void;
  onEditChild: (child: StudentUser) => void;
  onGoToCheckout: () => void;
  onGoToStudentView: (childId: string) => void;
}

export const ParentDashboard: React.FC<ParentDashboardProps> = ({
  onOpenAddChild,
  onEditChild,
  onGoToCheckout,
  onGoToStudentView,
}) => {
  const {
    activeParent,
    students,
    activeStudent,
    setActiveStudentId,
    programs,
    sessions,
    tasks,
    familyActivities,
    confirmFamilyActivityByParent,
    reports,
    payments,
    notifications,
    audioSubmissions,
    deleteChild,
    archiveChild,
    restoreChild,
    graduateChild,
    enrollChildInProgram,
    logoutParent,
    leaveApp,
    cancelSubscription,
    setCurrentRole,
    goBack,
    goHome,
    previousScreenTitle,
  } = useApp();

  const [activeTab, setActiveTab] = useState<
    'children' | 'progress' | 'family_activities' | 'sessions' | 'reports' | 'payments'
  >('children');

  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const [familyNoteInput, setFamilyNoteInput] = useState<{ [id: string]: string }>({});
  
  // Child Lifecycle Modal States - defaults to 'all' so all registered children appear immediately
  const [childFilter, setChildFilter] = useState<'all' | 'active' | 'pending' | 'graduated' | 'archived'>('all');
  const [childToDelete, setChildToDelete] = useState<StudentUser | null>(null);
  const [childToArchive, setChildToArchive] = useState<StudentUser | null>(null);
  const [childToGraduate, setChildToGraduate] = useState<StudentUser | null>(null);
  const [childToEnroll, setChildToEnroll] = useState<StudentUser | null>(null);
  const [childToViewStatus, setChildToViewStatus] = useState<StudentUser | null>(null);
  const [selectedNewProgramId, setSelectedNewProgramId] = useState<string>('');
  const [gradNote, setGradNote] = useState<string>('');

  const parentChildren = students.filter(
    (s) => s.parentId === activeParent?.id || activeParent === null
  );

  // Active children: children who have completed activation and are fully active in program
  // (Or if someone still has legacy status active or no pending enrollment status)
  const isChildActive = (c: StudentUser) => {
    if (c.status === 'graduated' || c.status === 'archived' || c.status === 'inactive') return false;
    if (c.enrollmentStatus) {
      return c.enrollmentStatus === 'active';
    }
    return c.status === 'active';
  };

  const isChildPending = (c: StudentUser) => {
    if (c.status === 'graduated' || c.status === 'archived' || c.status === 'inactive') return false;
    return (
      c.enrollmentStatus === 'pending_subscription' ||
      c.enrollmentStatus === 'pending_payment' ||
      c.enrollmentStatus === 'pending_activation'
    );
  };

  const activeChildren = parentChildren.filter(isChildActive);
  const pendingChildren = parentChildren.filter(isChildPending);
  const graduatedChildren = parentChildren.filter((c) => c.status === 'graduated');
  const archivedChildren = parentChildren.filter((c) => c.status === 'archived');

  const displayedChildren = parentChildren.filter((child) => {
    if (childFilter === 'all') return child.status !== 'archived';
    if (childFilter === 'active') return isChildActive(child);
    if (childFilter === 'pending') return isChildPending(child);
    if (childFilter === 'graduated') return child.status === 'graduated';
    if (childFilter === 'archived') return child.status === 'archived';
    return true;
  });

  const getChildHistoryStats = (childId: string) => {
    const tasksCount = tasks.filter((t) => t.studentId === childId).length;
    const audiosCount = audioSubmissions.filter((a) => a.studentId === childId).length;
    const reportsCount = reports.filter((r) => r.studentId === childId).length;
    const familyActivitiesCount = familyActivities.filter((a) => a.studentId === childId).length;
    const paymentsCount = payments.filter((p) => p.studentIds.includes(childId)).length;
    const total = tasksCount + audiosCount + reportsCount + familyActivitiesCount + paymentsCount;
    return {
      hasHistory: total > 0,
      tasksCount,
      audiosCount,
      reportsCount,
      familyActivitiesCount,
      paymentsCount,
      total,
    };
  };

  const currentChild = activeStudent || (parentChildren.length > 0 ? parentChildren[0] : null);

  // Child-specific items
  const childTasks = currentChild ? tasks.filter((t) => t.studentId === currentChild.id) : [];
  const childActivities = currentChild
    ? familyActivities.filter((a) => a.studentId === currentChild.id)
    : [];
  const childReports = currentChild ? reports.filter((r) => r.studentId === currentChild.id) : [];
  const childAudios = currentChild
    ? audioSubmissions.filter((a) => a.studentId === currentChild.id)
    : [];

  const latestChildReport = childReports.length > 0 ? childReports[0] : null;
  const childRecordedSessions = currentChild
    ? sessions.filter((s) => s.attendance && s.attendance[currentChild.id])
    : [];
  const presentSessionsCount = currentChild
    ? childRecordedSessions.filter((s) => s.attendance[currentChild.id] === 'present').length
    : 0;

  const handleConfirmActivity = (activityId: string) => {
    const note = familyNoteInput[activityId] || '';
    confirmFamilyActivityByParent(activityId, note);
  };

  return (
    <div className="min-h-screen bg-stone-50 text-stone-900 pb-16">
      {/* Top Banner with Parent Info */}
      <div className="bg-white border-b border-stone-200 py-3.5 sm:py-4 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <button
                type="button"
                onClick={goBack}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-stone-100 hover:bg-emerald-50 hover:text-emerald-900 border border-stone-200 hover:border-emerald-300 text-stone-700 text-xs font-bold transition-all cursor-pointer shadow-2xs group"
                title={`الرجوع للشاشة السابقة: ${previousScreenTitle || 'الرئيسية'}`}
                aria-label="الرجوع للشاشة السابقة"
              >
                <ArrowRight className="w-4 h-4 text-stone-600 group-hover:text-emerald-700 group-hover:translate-x-0.5 transition-transform" />
                <span>رجوع للخلف</span>
              </button>

              <button
                type="button"
                onClick={goHome}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-stone-100 hover:bg-emerald-50 hover:text-emerald-900 border border-stone-200 hover:border-emerald-300 text-stone-700 text-xs font-bold transition-all cursor-pointer shadow-2xs group"
                title="العودة للواجهة الرئيسية"
                aria-label="الرئيسية"
              >
                <Home className="w-4 h-4 text-emerald-700 group-hover:scale-110 transition-transform" />
                <span>الرئيسية</span>
              </button>

              <span className="text-[11px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md mr-1">
                لوحة ولي الأمر
              </span>
              <h1 className="text-lg sm:text-xl font-black text-stone-900">
                {activeParent ? `أهلاً بك، ${activeParent.fullName}` : 'لوحة متابعة ولي الأمر'}
              </h1>

              {/* Action buttons directly next to Parent's name */}
              {activeParent && (
                <div className="inline-flex items-center gap-1.5 mr-1 flex-wrap">
                  <button
                    type="button"
                    onClick={logoutParent}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl border border-rose-200 bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold transition-colors cursor-pointer"
                    title="تسجيل خروج من حساب ولي الأمر"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>تسجيل خروج</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setIsSettingsOpen(true)}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl border border-stone-200 bg-stone-50 hover:bg-stone-100 text-stone-700 text-xs font-semibold transition-colors cursor-pointer"
                    title="إعدادات حساب ولي الأمر والاشتراكات"
                  >
                    <Settings className="w-3.5 h-3.5 text-stone-600" />
                    <span>إعدادات الحساب</span>
                  </button>

                  <button
                    type="button"
                    onClick={leaveApp}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl border border-stone-200 bg-white hover:bg-stone-50 text-stone-600 text-xs font-medium transition-colors cursor-pointer"
                    title="مغادرة التطبيق والعودة إلى الواجهة الرئيسية"
                  >
                    <ExternalLink className="w-3.5 h-3.5 text-stone-500" />
                    <span>مغادرة التطبيق</span>
                  </button>
                </div>
              )}
            </div>
            <p className="text-[11px] text-stone-500 mt-0.5">
              متابعة حفظ وتدبر وتطبيق الأبناء، والأنشطة الأسرية المشتركة
            </p>
          </div>

          {/* Top Actions */}
          <div className="flex items-center gap-2 flex-wrap">
            <button
              type="button"
              onClick={onOpenAddChild}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold shadow-xs transition-colors cursor-pointer"
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>إضافة طفل</span>
            </button>

            {parentChildren.length > 0 && (
              <button
                type="button"
                onClick={onGoToCheckout}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-white text-xs font-bold transition-colors cursor-pointer"
              >
                <CreditCard className="w-3.5 h-3.5" />
                <span>الاشتراكات والدفع</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-5">
        {/* Navigation Tabs */}
        <div className="flex flex-wrap items-center justify-between border-b border-stone-200 mb-5 pb-2 gap-3">
          <div className="flex items-center gap-1 sm:gap-1.5 overflow-x-auto pb-1 max-w-full">
            {[
              { id: 'children', label: 'أطفالي المسجلون', icon: Users },
              { id: 'progress', label: 'التقدم والحفظ والتدبر', icon: TreeDeciduous },
              { id: 'family_activities', label: 'مع الأسرة', icon: HeartHandshake },
              { id: 'sessions', label: 'الجلسات والتقويم', icon: Calendar },
              { id: 'reports', label: 'تقارير المتابعة', icon: FileText },
              { id: 'payments', label: 'الاشتراكات والفواتير', icon: CreditCard },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 flex items-center gap-1.5 cursor-pointer ${
                    isActive
                      ? 'bg-emerald-700 text-white shadow-xs'
                      : 'bg-white border border-stone-200 text-stone-600 hover:bg-stone-100'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{tab.label}</span>
                  {isActive && activeTab !== 'children' && (
                    <span
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveTab('children');
                      }}
                      title="إغلاق هذا التبويب والعودة لقائمة الأطفال"
                      className="mr-0.5 p-0.5 rounded-full hover:bg-emerald-800 text-emerald-100 cursor-pointer"
                    >
                      <X className="w-3 h-3" />
                    </span>
                  )}
                </button>
              );
            })}

            <button
              type="button"
              onClick={() => setIsSettingsOpen(true)}
              className="px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 flex items-center gap-1.5 cursor-pointer bg-white border border-stone-200 text-stone-700 hover:bg-stone-100 hover:text-emerald-800"
              title="فتح إعدادات حساب ولي الأمر والاشتراكات"
            >
              <Settings className="w-3.5 h-3.5 text-stone-500" />
              <span>إعدادات الحساب</span>
            </button>
          </div>

          {activeTab !== 'children' && (
            <button
              type="button"
              onClick={() => setActiveTab('children')}
              className="shrink-0 inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl border border-stone-300 bg-white hover:bg-stone-50 text-stone-700 text-xs font-bold transition-colors cursor-pointer shadow-2xs"
              title="إغلاق التبويب والعودة لقائمة الأطفال"
            >
              <X className="w-3.5 h-3.5 text-stone-500" />
              <span>إغلاق التبويب</span>
            </button>
          )}
        </div>

        {/* Tab 1: Children List */}
        {activeTab === 'children' && (
          <div className="space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h3 className="text-xl font-black text-stone-900 flex items-center gap-2">
                  <Users className="w-5 h-5 text-emerald-700" />
                  <span>قائمة أطفالي المسجلون</span>
                </h3>
                <p className="text-xs text-stone-500 mt-1">
                  عرض ومتابعة الأبناء المسجلين وحالة التحاقهم بالبرنامج (انتظار الاشتراك، بانتظار السداد، بانتظار التفعيل، أو مشترك ونشط)
                </p>
              </div>
            </div>

            {/* Child Selector Tabs Bar with "دخول بوابة الابن «رحلتي»" directly under قائمة أطفالي المسجلون */}
            {parentChildren.length > 0 && (
              <div className="bg-white rounded-xl p-3 border border-stone-200 shadow-2xs flex flex-wrap items-center justify-between gap-2.5">
                <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5 max-w-full">
                  <span className="text-xs font-bold text-stone-500 shrink-0">الأبناء:</span>
                  {parentChildren.map((child) => {
                    const isSelected = currentChild?.id === child.id;
                    return (
                      <button
                        key={child.id}
                        type="button"
                        onClick={() => setActiveStudentId(child.id)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all shrink-0 cursor-pointer flex items-center gap-1.5 ${
                          isSelected
                            ? 'bg-emerald-700 text-white shadow-xs'
                            : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                        }`}
                      >
                        <span>{child.fullName}</span>
                        <span
                          className={`text-[10px] px-1.5 py-0.2 rounded-md ${
                            isSelected ? 'bg-emerald-800 text-emerald-100' : 'bg-stone-200 text-stone-600'
                          }`}
                        >
                          {child.age} سنة
                        </span>
                        <span
                          className={`text-[9px] px-1.5 py-0.2 rounded-md font-normal ${
                            isSelected
                              ? 'bg-emerald-900/60 text-emerald-100'
                              : child.enrollmentStatus === 'pending_subscription'
                              ? 'bg-blue-100 text-blue-800'
                              : child.enrollmentStatus === 'pending_payment'
                              ? 'bg-amber-100 text-amber-800'
                              : child.enrollmentStatus === 'pending_activation'
                              ? 'bg-orange-100 text-orange-800'
                              : 'bg-emerald-100 text-emerald-800'
                          }`}
                        >
                          {child.status === 'graduated'
                            ? 'خريج'
                            : child.status === 'archived'
                            ? 'مؤرشف'
                            : child.enrollmentStatus === 'pending_subscription'
                            ? 'انتظار الاشتراك'
                            : child.enrollmentStatus === 'pending_payment'
                            ? 'بانتظار السداد'
                            : child.enrollmentStatus === 'pending_activation'
                            ? 'بانتظار التفعيل'
                            : 'مشترك ونشط'}
                        </span>
                      </button>
                    );
                  })}
                </div>

                {currentChild && (
                  isChildActive(currentChild) ? (
                    <button
                      type="button"
                      onClick={() => onGoToStudentView(currentChild.id)}
                      className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 text-xs font-bold transition-all cursor-pointer shrink-0 shadow-2xs"
                    >
                      <span>دخول بوابة الابن «رحلتي»</span>
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => {
                        alert(`بوابة الابن «رحلتي» معطلة حالياً لحين اكتمال الاشتراك واعتماد الإدارة.\n\nالطفل: ${currentChild.fullName}\nالحالة الحالية: ${
                          currentChild.enrollmentStatus === 'pending_subscription'
                            ? 'بانتظار الاشتراك'
                            : currentChild.enrollmentStatus === 'pending_payment'
                            ? 'بانتظار السداد'
                            : 'بانتظار التفعيل واعتماد الإدارة بعد دفع الرسوم'
                        }\n\nسيصلك إشعار فوري وسيتم فتح البوابة تلقائياً فور اعتماد الإدارة.`);
                      }}
                      className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-stone-100 hover:bg-stone-200/80 text-stone-500 border border-stone-200 text-xs font-bold transition-all cursor-pointer shrink-0 shadow-2xs"
                      title="بوابة الابن معطلة لحين إكمال الاشتراك"
                    >
                      <Lock className="w-4 h-4 text-stone-400" />
                      <span>دخول «رحلتي» (معطل لحين الاشتراك)</span>
                    </button>
                  )
                )}
              </div>
            )}

            {/* Lifecycle Semantic Guide Banner */}
            <div className="bg-emerald-50/60 border border-emerald-100 rounded-2xl p-4 text-xs">
              <div className="flex items-center gap-2 font-bold text-emerald-950 mb-2">
                <Info className="w-4 h-4 text-emerald-700 shrink-0" />
                <span>دليل إدارة ملفات الأبناء وتتبع حالة الالتحاق:</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-stone-700">
                <div className="bg-white/80 rounded-xl p-2.5 border border-emerald-100/60">
                  <span className="font-bold text-blue-800 block mb-0.5">⏳ مراحل الالتحاق:</span>
                  <span>يبدأ الطفل بـ (انتظار الاشتراك) ثم (بانتظار السداد) ثم (بانتظار التفعيل) حتى اعتماده.</span>
                </div>
                <div className="bg-white/80 rounded-xl p-2.5 border border-emerald-100/60">
                  <span className="font-bold text-stone-800 block mb-0.5">📦 أرشفة:</span>
                  <span>إخفاء ملف الطفل مع الاحتفاظ الكامل بتاريخه وتلاواته ومدفوعاته بأمان.</span>
                </div>
                <div className="bg-white/80 rounded-xl p-2.5 border border-emerald-100/60">
                  <span className="font-bold text-purple-800 block mb-0.5">🎓 تخرج / إكمال برنامج:</span>
                  <span>الطفل أنهى الدورة بنجاح ومؤهل للانتقال للمستوى القرآني التالي مباشرة.</span>
                </div>
              </div>
            </div>

            {/* Status Filter Tabs */}
            <div className="flex flex-wrap items-center gap-2 border-b border-stone-200 pb-3">
              <button
                type="button"
                onClick={() => setChildFilter('all')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5 ${
                  childFilter === 'all'
                    ? 'bg-stone-900 text-white shadow-xs'
                    : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                }`}
              >
                <span>جميع أطفالي المسجلون</span>
                <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                  childFilter === 'all' ? 'bg-stone-800 text-stone-100' : 'bg-stone-200 text-stone-700'
                }`}>
                  {parentChildren.filter(c => c.status !== 'archived').length}
                </span>
              </button>

              <button
                type="button"
                onClick={() => setChildFilter('pending')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5 ${
                  childFilter === 'pending'
                    ? 'bg-amber-600 text-white shadow-xs'
                    : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                }`}
              >
                <span>انتظار الاشتراك / السداد / التفعيل ⏳</span>
                <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                  childFilter === 'pending' ? 'bg-amber-700 text-amber-100' : 'bg-stone-200 text-stone-700'
                }`}>
                  {pendingChildren.length}
                </span>
              </button>

              <button
                type="button"
                onClick={() => setChildFilter('active')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5 ${
                  childFilter === 'active'
                    ? 'bg-emerald-700 text-white shadow-xs'
                    : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                }`}
              >
                <span>المشتركون والنشطون ✓</span>
                <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                  childFilter === 'active' ? 'bg-emerald-800 text-emerald-100' : 'bg-stone-200 text-stone-700'
                }`}>
                  {activeChildren.length}
                </span>
              </button>

              <button
                type="button"
                onClick={() => setChildFilter('graduated')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5 ${
                  childFilter === 'graduated'
                    ? 'bg-purple-700 text-white shadow-xs'
                    : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                }`}
              >
                <span>المتخرجون 🎓</span>
                <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                  childFilter === 'graduated' ? 'bg-purple-800 text-purple-100' : 'bg-stone-200 text-stone-700'
                }`}>
                  {graduatedChildren.length}
                </span>
              </button>

              <button
                type="button"
                onClick={() => setChildFilter('archived')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5 ${
                  childFilter === 'archived'
                    ? 'bg-stone-800 text-white shadow-xs'
                    : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                }`}
              >
                <span>الأرشيف 📦</span>
                <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                  childFilter === 'archived' ? 'bg-stone-900 text-stone-200' : 'bg-stone-200 text-stone-700'
                }`}>
                  {archivedChildren.length}
                </span>
              </button>

              {childFilter !== 'all' && (
                <button
                  type="button"
                  onClick={() => setChildFilter('all')}
                  className="px-2.5 py-1.5 rounded-xl text-xs font-bold text-stone-600 hover:text-stone-900 bg-stone-100 hover:bg-stone-200 flex items-center gap-1 cursor-pointer transition-colors"
                  title="إغلاق التصفية وعرض جميع الأطفال"
                >
                  <X className="w-3.5 h-3.5" />
                  <span>إغلاق التصفية</span>
                </button>
              )}
            </div>

            {displayedChildren.length === 0 ? (
              <EmptyState
                icon={childFilter === 'archived' ? Archive : childFilter === 'graduated' ? GraduationCap : Users}
                title={
                  childFilter === 'archived'
                    ? 'الأرشيف فارغ'
                    : childFilter === 'graduated'
                    ? 'لا يوجد خريجون حتى الآن'
                    : 'لا يوجد أطفال مسجلون في هذه القائمة'
                }
                description={
                  childFilter === 'archived'
                    ? 'الملفات التي تقوم بأرشفتها لحفظ تاريخها ستظهر هنا.'
                    : childFilter === 'graduated'
                    ? 'الأطفال الذين يتمون برامجهم القرآنية سيوثق تخرجهم هنا ويمكنهم الالتحاق ببرامج متقدمة.'
                    : 'يمكنك إضافة طفل جديد واختيار برنامجه ومتابعة خطوات تفعيله وسداده بسهولة.'
                }
                actionText={childFilter !== 'archived' && childFilter !== 'graduated' ? 'إضافة طفل' : undefined}
                onAction={childFilter !== 'archived' && childFilter !== 'graduated' ? onOpenAddChild : undefined}
              />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {displayedChildren.map((child) => {
                  const currentProg = programs.find((p) => p.id === child.currentProgramId) || programs[0];
                  const isGraduated = child.status === 'graduated';
                  const isArchived = child.status === 'archived';
                  const stats = getChildHistoryStats(child.id);
                  const enrollmentStatus = child.enrollmentStatus || (isChildActive(child) ? 'active' : 'pending_subscription');

                  return (
                    <div
                      key={child.id}
                      className={`bg-white rounded-2xl p-6 border shadow-xs transition-all flex flex-col justify-between ${
                        isGraduated
                          ? 'border-purple-200 bg-linear-to-b from-purple-50/30 to-white'
                          : isArchived
                          ? 'border-stone-300 bg-stone-50/50 opacity-90'
                          : 'border-stone-200 hover:border-emerald-300'
                      }`}
                    >
                      <div>
                        <div className="flex items-start justify-between mb-4">
                          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-lg ${
                            isGraduated
                              ? 'bg-purple-100 text-purple-800'
                              : isArchived
                              ? 'bg-stone-200 text-stone-700'
                              : 'bg-emerald-100 text-emerald-800'
                          }`}>
                            {child.fullName.charAt(0)}
                          </div>
                          
                          {/* Semantic Status Badge & Lifecycle */}
                          {isGraduated ? (
                            <span className="px-2.5 py-1 rounded-md text-[11px] font-bold bg-purple-100 text-purple-900 flex items-center gap-1 border border-purple-200">
                              <GraduationCap className="w-3.5 h-3.5" />
                              <span>خريج البرنامج 🎓</span>
                            </span>
                          ) : isArchived ? (
                            <span className="px-2.5 py-1 rounded-md text-[11px] font-bold bg-stone-200 text-stone-800 flex items-center gap-1 border border-stone-300">
                              <Archive className="w-3.5 h-3.5" />
                              <span>ملف مؤرشف 📦</span>
                            </span>
                          ) : enrollmentStatus === 'pending_subscription' ? (
                            <span className="px-2.5 py-1 rounded-md text-[11px] font-bold bg-blue-100 text-blue-900 border border-blue-200 flex items-center gap-1 shadow-2xs">
                              <Clock className="w-3 h-3 text-blue-700" />
                              <span>انتظار الاشتراك</span>
                            </span>
                          ) : enrollmentStatus === 'pending_payment' ? (
                            <span className="px-2.5 py-1 rounded-md text-[11px] font-bold bg-amber-100 text-amber-900 border border-amber-200 flex items-center gap-1 shadow-2xs">
                              <CreditCard className="w-3 h-3 text-amber-700" />
                              <span>بانتظار السداد</span>
                            </span>
                          ) : enrollmentStatus === 'pending_activation' ? (
                            <span className="px-2.5 py-1 rounded-md text-[11px] font-bold bg-orange-100 text-orange-900 border border-orange-200 flex items-center gap-1 shadow-2xs">
                              <Clock className="w-3 h-3 text-orange-700 animate-pulse" />
                              <span>بانتظار التفعيل</span>
                            </span>
                          ) : (
                            <span className="px-2.5 py-1 rounded-md text-[11px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200 flex items-center gap-1 shadow-2xs">
                              <CheckCircle2 className="w-3 h-3 text-emerald-700" />
                              <span>مشترك ونشط ✓</span>
                            </span>
                          )}
                        </div>

                        <h4 className="text-lg font-bold text-stone-900 mb-1">{child.fullName}</h4>
                        
                        <div className="space-y-1.5 text-xs text-stone-600 mb-4">
                          <p>العمر: <strong className="text-stone-800">{child.age} سنة</strong> ({child.gender === 'male' ? 'ذكر' : 'أنثى'})</p>
                          <p>البرنامج الحالي: <strong className="text-stone-800">{currentProg?.name || 'برنامج معايشة القرآن'}</strong></p>
                          
                          {/* Specific Enrollment Status Helper Bar */}
                          {!isGraduated && !isArchived && (
                            <div className={`mt-3 p-2.5 rounded-xl border text-[11px] flex items-center justify-between gap-2 ${
                              enrollmentStatus === 'pending_subscription'
                                ? 'bg-blue-50/80 border-blue-200 text-blue-950'
                                : enrollmentStatus === 'pending_payment'
                                ? 'bg-amber-50/80 border-amber-200 text-amber-950'
                                : enrollmentStatus === 'pending_activation'
                                ? 'bg-orange-50/80 border-orange-200 text-orange-950'
                                : 'bg-emerald-50/80 border-emerald-200 text-emerald-950'
                            }`}>
                              <div className="flex items-center gap-1.5 flex-wrap">
                                <span className="font-bold text-stone-900">حالة الالتحاق:</span>
                                {enrollmentStatus === 'pending_subscription' && (
                                  <span className="text-blue-700 font-bold inline-flex items-center gap-1">
                                    <Clock className="w-3 h-3" />
                                    <span>انتظار الاشتراك</span>
                                  </span>
                                )}
                                {enrollmentStatus === 'pending_payment' && (
                                  <span className="text-amber-700 font-bold inline-flex items-center gap-1">
                                    <CreditCard className="w-3 h-3" />
                                    <span>بانتظار السداد</span>
                                  </span>
                                )}
                                {enrollmentStatus === 'pending_activation' && (
                                  <div className="flex flex-col">
                                    <span className="text-orange-700 font-bold inline-flex items-center gap-1">
                                      <Clock className="w-3 h-3 animate-pulse" />
                                      <span>بانتظار التفعيل</span>
                                    </span>
                                    <span className="text-[10px] text-orange-900 font-semibold">
                                      (الحالة تقررها الإدارة بعد دفع الرسوم)
                                    </span>
                                  </div>
                                )}
                                {enrollmentStatus === 'active' && (
                                  <span className="text-emerald-700 font-bold inline-flex items-center gap-1">
                                    <CheckCircle2 className="w-3 h-3" />
                                    <span>مشترك ونشط في الحلقات</span>
                                  </span>
                                )}
                              </div>
                              <button
                                type="button"
                                onClick={() => setChildToViewStatus(child)}
                                className="text-[10px] font-bold text-stone-600 hover:text-stone-900 underline flex items-center gap-0.5 cursor-pointer shrink-0"
                                title="عرض مسار وتفاصيل حالة الطلب"
                              >
                                <Eye className="w-3 h-3" />
                                <span>عرض حالة الطلب</span>
                              </button>
                            </div>
                          )}

                          {isGraduated && (
                            <div className="mt-2 p-2.5 bg-purple-50 rounded-xl border border-purple-100 text-[11px] text-purple-900">
                              <p className="font-bold flex items-center gap-1 mb-1">
                                <CheckCircle2 className="w-3.5 h-3.5 text-purple-700" />
                                <span>أتم الدورة بنجاح ومستعد لبرنامج متقدم</span>
                              </p>
                              {child.graduationNote && (
                                <p className="text-purple-700 italic">"{child.graduationNote}"</p>
                              )}
                            </div>
                          )}

                          {isArchived && (
                            <div className="mt-2 p-2.5 bg-stone-100 rounded-xl border border-stone-200 text-[11px] text-stone-700">
                              <p className="font-semibold flex items-center gap-1">
                                <ShieldCheck className="w-3.5 h-3.5 text-stone-600" />
                                <span>سجل التلاوات والمهام والمدفوعات محفوظ بالكامل</span>
                              </p>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Card Action Buttons */}
                      <div className="mt-4 pt-4 border-t border-stone-100 space-y-2.5">
                        {/* Context-aware buttons according to enrollment status */}
                        {!isGraduated && !isArchived && enrollmentStatus === 'pending_subscription' && (
                          <button
                            type="button"
                            onClick={() => {
                              enrollChildInProgram(child.id, child.currentProgramId || programs[0].id);
                              onGoToCheckout();
                            }}
                            className="w-full py-2.5 px-3 rounded-xl bg-blue-700 hover:bg-blue-800 text-white text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-1.5 cursor-pointer"
                          >
                            <Sparkles className="w-3.5 h-3.5" />
                            <span>اشترك الآن</span>
                          </button>
                        )}

                        {!isGraduated && !isArchived && enrollmentStatus === 'pending_payment' && (
                          <button
                            type="button"
                            onClick={() => {
                              setActiveStudentId(child.id);
                              onGoToCheckout();
                            }}
                            className="w-full py-2.5 px-3 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-1.5 cursor-pointer"
                          >
                            <CreditCard className="w-3.5 h-3.5" />
                            <span>استكمال الدفع</span>
                          </button>
                        )}

                        {!isGraduated && !isArchived && enrollmentStatus === 'pending_activation' && (
                          <div className="space-y-1.5">
                            <button
                              type="button"
                              onClick={() => setChildToViewStatus(child)}
                              className="w-full py-2.5 px-3 rounded-xl bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-1.5 cursor-pointer"
                            >
                              <Clock className="w-3.5 h-3.5" />
                              <span>عرض حالة الطلب</span>
                            </button>
                            <div className="flex items-center justify-center gap-1 text-[11px] text-orange-950 font-medium bg-orange-50/90 py-1 px-2 rounded-lg border border-orange-200/80 text-center">
                              <Info className="w-3 h-3 text-orange-700 shrink-0" />
                              <span>الحالة تقررها الإدارة بعد دفع الرسوم</span>
                            </div>
                          </div>
                        )}

                        {/* If graduated, highlight Enroll in Next Program button */}
                        {isGraduated && (
                          <button
                            type="button"
                            onClick={() => {
                              setChildToEnroll(child);
                              setSelectedNewProgramId(programs.find(p => p.id !== child.currentProgramId)?.id || programs[0].id);
                            }}
                            className="w-full py-2 px-3 rounded-xl bg-purple-700 hover:bg-purple-800 text-white text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-1.5 cursor-pointer"
                          >
                            <BookOpenCheck className="w-3.5 h-3.5" />
                            <span>الالتحاق ببرنامج قرآني جديد 🚀</span>
                          </button>
                        )}

                        {/* If archived, highlight Restore button */}
                        {isArchived && (
                          <button
                            type="button"
                            onClick={() => restoreChild(child.id)}
                            className="w-full py-2 px-3 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-1.5 cursor-pointer"
                          >
                            <RotateCcw className="w-3.5 h-3.5" />
                            <span>استعادة الملف إلى القائمة النشطة</span>
                          </button>
                        )}

                        <div className="flex items-center justify-between gap-1.5 flex-wrap">
                          <div className="flex items-center gap-1.5">
                            {enrollmentStatus === 'active' ? (
                              <button
                                type="button"
                                onClick={() => onGoToStudentView(child.id)}
                                className="px-2.5 py-1.5 rounded-lg bg-emerald-50 text-emerald-800 hover:bg-emerald-100 text-xs font-bold transition-colors cursor-pointer"
                                title="فتح بوابة رحلتي للطالب"
                              >
                                دخول رحلتي
                              </button>
                            ) : (
                              <button
                                type="button"
                                onClick={() => {
                                  alert(`بوابة الابن «رحلتي» معطلة حالياً لحين إكمال التفعيل والاعتماد من الإدارة.\n\nالطفل: ${child.fullName}\nحالة الطلب: ${
                                    enrollmentStatus === 'pending_subscription'
                                      ? 'بانتظار الاشتراك'
                                      : enrollmentStatus === 'pending_payment'
                                      ? 'بانتظار السداد'
                                      : 'بانتظار التفعيل واعتماد الإدارة'
                                  }\n\nسيصلك إشعار فوري وسيتم فتح البوابة تلقائياً فور اعتماد الإدارة.`);
                                }}
                                className="px-2.5 py-1.5 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-400 border border-stone-200 text-xs font-medium cursor-pointer flex items-center gap-1"
                                title="البوابة معطلة لحين اكتمال التفعيل من الإدارة"
                              >
                                <Lock className="w-3 h-3 text-stone-400" />
                                <span>رحلتي (معطل)</span>
                              </button>
                            )}
                            <button
                              type="button"
                              onClick={() => onEditChild(child)}
                              className="px-2.5 py-1.5 rounded-lg border border-stone-200 text-stone-600 hover:bg-stone-50 text-xs font-medium cursor-pointer"
                              title="تعديل بيانات الطفل"
                            >
                              تعديل
                            </button>
                            {!isGraduated && !isArchived && (
                              <button
                                type="button"
                                onClick={() => setChildToViewStatus(child)}
                                className="px-2 py-1.5 rounded-lg border border-stone-200 text-stone-600 hover:bg-stone-50 text-xs font-medium cursor-pointer"
                                title="عرض حالة الطلب"
                              >
                                عرض حالة الطلب
                              </button>
                            )}
                          </div>

                          <div className="flex items-center gap-1">
                            {/* Graduation button for active students */}
                            {!isGraduated && !isArchived && (
                              <button
                                type="button"
                                onClick={() => {
                                  setChildToGraduate(child);
                                  setGradNote('أتم الدورة القرآنية بنجاح واجتاز تقييمات الحفظ والتدبر بتفوق');
                                }}
                                className="p-1.5 rounded-lg border border-purple-200 bg-purple-50 text-purple-700 hover:bg-purple-100 text-xs font-medium transition-colors cursor-pointer"
                                title="إكمال البرنامج والتخرج 🎓"
                              >
                                <GraduationCap className="w-3.5 h-3.5" />
                              </button>
                            )}

                            {/* Archive button */}
                            {!isArchived && (
                              <button
                                type="button"
                                onClick={() => setChildToArchive(child)}
                                className="p-1.5 rounded-lg border border-stone-200 bg-stone-50 text-stone-600 hover:bg-stone-100 text-xs font-medium transition-colors cursor-pointer"
                                title="أرشفة الملف (لحفظ تاريخه وإخفائه) 📦"
                              >
                                <Archive className="w-3.5 h-3.5" />
                              </button>
                            )}

                            {/* Delete button (specifically for accidentally added children) */}
                            <button
                              type="button"
                              onClick={() => setChildToDelete(child)}
                              className="p-1.5 rounded-lg border border-rose-200 bg-rose-50 text-rose-700 hover:bg-rose-100 text-xs font-medium transition-colors cursor-pointer"
                              title="حذف (مخصص للأطفال المضافين بالخطأ)"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Progress & Memorization & Tadabbur */}
        {activeTab === 'progress' && (
          <div className="space-y-6">
            {!currentChild ? (
              <EmptyState
                icon={TreeDeciduous}
                title="لا توجد بيانات متابعة حتى الآن"
                description="يرجى إضافة طفل أولاً لعرض تقارير تقدمه وإنجازاته في الحفظ والتدبر."
                actionText="إضافة طفل"
                onAction={onOpenAddChild}
              />
            ) : (
              <div className="space-y-6">
                {parentChildren.length > 1 && (
                  <div className="flex items-center gap-2 overflow-x-auto pb-1 bg-white p-3 rounded-2xl border border-stone-200">
                    <span className="text-xs font-bold text-stone-500 shrink-0">عرض تقدم الابن:</span>
                    {parentChildren.map((c) => (
                      <button
                        key={c.id}
                        type="button"
                        onClick={() => setActiveStudentId(c.id)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                          currentChild.id === c.id
                            ? 'bg-emerald-700 text-white shadow-xs'
                            : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                        }`}
                      >
                        {c.fullName} ({c.age} سنة)
                      </button>
                    ))}
                  </div>
                )}
                {/* Child Summary Stats */}
                <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-xs grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div className="text-center p-3 rounded-xl bg-emerald-50/60 border border-emerald-100">
                    <span className="text-[11px] text-stone-500 block mb-1">السورة المقررة</span>
                    <span className="text-base font-black text-emerald-900">سورة العلق</span>
                  </div>
                  <div className="text-center p-3 rounded-xl bg-teal-50/60 border border-teal-100">
                    <span className="text-[11px] text-stone-500 block mb-1">تسجيلات التسميع</span>
                    <span className="text-base font-black text-teal-900">{childAudios.length} تسجيل</span>
                  </div>
                  <div className="text-center p-3 rounded-xl bg-amber-50/60 border border-amber-100">
                    <span className="text-[11px] text-stone-500 block mb-1">الأنشطة المكتملة</span>
                    <span className="text-base font-black text-amber-900">
                      {childTasks.filter((t) => t.status === 'completed').length} مهمة
                    </span>
                  </div>
                  <div className="text-center p-3 rounded-xl bg-purple-50/60 border border-purple-100">
                    <span className="text-[11px] text-stone-500 block mb-1">حالة الحضور</span>
                    {latestChildReport ? (
                      <div>
                        <span className="text-base font-black text-purple-900">{latestChildReport.attendanceRate}%</span>
                        <span className="text-[10px] text-purple-700 block mt-0.5">معتمد من المشرف التربوي</span>
                      </div>
                    ) : childRecordedSessions.length > 0 ? (
                      <div>
                        <span className="text-base font-black text-purple-900">
                          {Math.round((presentSessionsCount / childRecordedSessions.length) * 100)}%
                        </span>
                        <span className="text-[10px] text-purple-700 block mt-0.5">
                          رصد المحفظ ({presentSessionsCount}/{childRecordedSessions.length} جلسة)
                        </span>
                      </div>
                    ) : (
                      <span className="text-base font-black text-stone-400">—</span>
                    )}
                  </div>
                </div>

                {/* Audio Submissions Status */}
                <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-xs">
                  <h4 className="text-base font-bold text-stone-900 mb-4">سجل التسميع الصوتي وتقييمات المحفظ</h4>
                  {childAudios.length === 0 ? (
                    <div className="p-8 text-center bg-stone-50 rounded-xl border border-stone-200 text-xs text-stone-500">
                      لم يتم تسجيل أي تسميع صوتي بعد. يمكن للابن الدخول على «رحلتي مع القرآن» لتسجيل صوته ورفعه للمحفظ.
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {childAudios.map((aud) => (
                        <div
                          key={aud.id}
                          className="p-4 rounded-xl border border-stone-200 flex flex-wrap items-center justify-between gap-3"
                        >
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-stone-900 text-sm">{aud.surahName}</span>
                              <span className="text-xs text-stone-500">• {aud.versesRange}</span>
                            </div>
                            <p className="text-[11px] text-stone-400 mt-0.5">
                              تم الرفع: {new Date(aud.submittedAt).toLocaleDateString('ar-EG')}
                            </p>
                          </div>

                          <div className="flex items-center gap-3">
                            <span
                              className={`px-2.5 py-1 rounded-md text-xs font-bold ${
                                aud.status === 'reviewed'
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : 'bg-amber-100 text-amber-900'
                              }`}
                            >
                              {aud.status === 'reviewed' ? `تم التقييم: ${aud.score}/100` : 'في انتظار مراجعة المحفظ'}
                            </span>
                            {aud.teacherFeedback && (
                              <p className="text-xs text-stone-600 bg-stone-50 px-3 py-1.5 rounded-lg border border-stone-200">
                                ملاحظة المحفظ: {aud.teacherFeedback}
                              </p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Tab 3: Family Activities "مع الأسرة" */}
        {activeTab === 'family_activities' && (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-bold text-stone-900">قسم «مع الأسرة» — التطبيقات المنزلية المشتركة</h3>
              <p className="text-xs text-stone-500">
                أنشطة وتطبيقات بسيطة لربط معاني الآيات بالبيت ومشاركتها مع الأبناء
              </p>
            </div>

            {parentChildren.length > 1 && currentChild && (
              <div className="flex items-center gap-2 overflow-x-auto pb-1 bg-white p-3 rounded-2xl border border-stone-200">
                <span className="text-xs font-bold text-stone-500 shrink-0">عرض أنشطة الابن:</span>
                {parentChildren.map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => setActiveStudentId(c.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      currentChild.id === c.id
                        ? 'bg-emerald-700 text-white shadow-xs'
                        : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                    }`}
                  >
                    {c.fullName} ({c.age} سنة)
                  </button>
                ))}
              </div>
            )}

            {childActivities.length === 0 ? (
              <EmptyState
                icon={HeartHandshake}
                title="لا توجد أنشطة أسرية مجدولة حالياً"
                description="سيقوم المشرف التربوي بإسناد الأنشطة الأسرية الأسبوعية فور انطلاق الجلسات."
              />
            ) : (
              <div className="space-y-4">
                {childActivities.map((act) => (
                  <div
                    key={act.id}
                    className="bg-white rounded-2xl p-6 border border-stone-200 shadow-xs space-y-4"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <span className="text-[11px] font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded-md">
                          الأسبوع {act.weekNumber}
                        </span>
                        <h4 className="text-base font-bold text-stone-900 mt-1">{act.title}</h4>
                      </div>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-bold ${
                          act.completed
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-stone-100 text-stone-600'
                        }`}
                      >
                        {act.completed ? 'تم التنفيذ والتأكيد ✓' : 'في انتظار التنفيذ'}
                      </span>
                    </div>

                    <p className="text-xs sm:text-sm text-stone-700 leading-relaxed bg-stone-50 p-3.5 rounded-xl border border-stone-100">
                      {act.instructions}
                    </p>

                    {!act.completed && (
                      <div className="space-y-3 pt-2">
                        <textarea
                          placeholder="ملاحظاتك وانطباعك كولي أمر عند تنفيذ النشاط مع الابن..."
                          value={familyNoteInput[act.id] || ''}
                          onChange={(e) =>
                            setFamilyNoteInput({ ...familyNoteInput, [act.id]: e.target.value })
                          }
                          className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs focus:ring-2 focus:ring-emerald-600 outline-hidden"
                          rows={2}
                        />
                        <button
                          type="button"
                          onClick={() => handleConfirmActivity(act.id)}
                          className="px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold transition-colors cursor-pointer"
                        >
                          تأكيد تنفيذ النشاط الأسري
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 4: Scheduled Sessions */}
        {activeTab === 'sessions' && (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-bold text-stone-900">الجلسات المباشرة والتقويم</h3>
              <p className="text-xs text-stone-500">مواعيد جلسات التدبر وحلقات متابعة التحفيظ والتجويد</p>
            </div>

            {sessions.length === 0 ? (
              <EmptyState
                icon={Calendar}
                title="لا توجد جلسات مجدولة حتى الآن"
                description="سيتم إرسال مواعيد جلسات الزووم وجوجل ميت وإضافتها هنا فور تحديد موعد مجموعتك."
              />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {sessions.map((ses) => (
                  <div
                    key={ses.id}
                    className="bg-white rounded-2xl p-6 border border-stone-200 shadow-xs flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span
                          className={`text-[11px] font-bold px-2 py-0.5 rounded-md ${
                            ses.sessionType === 'tadabbur'
                              ? 'bg-purple-50 text-purple-800'
                              : 'bg-emerald-50 text-emerald-800'
                          }`}
                        >
                          {ses.sessionType === 'tadabbur' ? 'جلسة تدبر مع الكوتش' : 'متابعة حفظ وتجويد'}
                        </span>
                        <span className="text-xs text-stone-500 flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" />
                          {ses.time} ({ses.durationMinutes} دقيقة)
                        </span>
                      </div>

                      <h4 className="text-base font-bold text-stone-900 mb-1">{ses.title}</h4>
                      <p className="text-xs text-stone-500">التاريخ: {ses.date}</p>
                    </div>

                    <div className="mt-6 pt-4 border-t border-stone-100 flex items-center justify-between">
                      <a
                        href={ses.meetingLink || '#'}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold transition-colors cursor-pointer"
                      >
                        <Video className="w-4 h-4" />
                        <span>دخول الجلسة (Zoom / Meet)</span>
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 5: Parent Reports */}
        {activeTab === 'reports' && (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-bold text-stone-900">تقارير المتابعة التربوية الدورية</h3>
              <p className="text-xs text-stone-500">تقارير مفصلة يصدرها المشرف التربوي لولي الأمر</p>
            </div>

            {childReports.length === 0 ? (
              <EmptyState
                icon={FileText}
                title="لا توجد تقارير متاحة حتى الآن"
                description="يتم إصدار التقارير التربوية الدورية في نهاية كل سورة وشهر من البرنامج."
              />
            ) : (
              <div className="space-y-4">
                {childReports.map((rep) => (
                  <div
                    key={rep.id}
                    className="bg-white rounded-2xl p-6 border border-stone-200 shadow-xs space-y-4"
                  >
                    <div className="flex items-center justify-between pb-3 border-b border-stone-100">
                      <div>
                        <h4 className="text-base font-bold text-stone-900">{rep.periodTitle}</h4>
                        <p className="text-xs text-stone-500">
                          تاريخ التقرير: {new Date(rep.createdAt).toLocaleDateString('ar-EG')}
                        </p>
                      </div>
                      <span className="px-2.5 py-1 rounded-md bg-emerald-100 text-emerald-800 text-xs font-bold">
                        معتمد من المشرف التربوي ✓
                      </span>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                      <div className="p-3 rounded-xl bg-stone-50 border border-stone-200">
                        <span className="text-[10px] text-stone-500 block">الحضور والالتزام</span>
                        <span className="text-base font-black text-emerald-800">{rep.attendanceRate}%</span>
                      </div>
                      <div className="p-3 rounded-xl bg-stone-50 border border-stone-200">
                        <span className="text-[10px] text-stone-500 block">إتقان الحفظ</span>
                        <span className="text-base font-black text-teal-800">{rep.memorizationScore}%</span>
                      </div>
                      <div className="p-3 rounded-xl bg-stone-50 border border-stone-200">
                        <span className="text-[10px] text-stone-500 block">التدبر والتفاعل</span>
                        <span className="text-base font-black text-purple-800">{rep.tadabburScore}%</span>
                      </div>
                      <div className="p-3 rounded-xl bg-stone-50 border border-stone-200">
                        <span className="text-[10px] text-stone-500 block">المشاركة الأسرية</span>
                        <span className="text-base font-black text-amber-800">
                          {rep.familyParticipationScore}%
                        </span>
                      </div>
                    </div>

                    <div className="space-y-2 text-xs text-stone-700 bg-stone-50 p-4 rounded-xl border border-stone-100">
                      <p>
                        <strong className="font-bold text-stone-900">ملاحظات المشرف: </strong>
                        {rep.generalNotes}
                      </p>
                      <p>
                        <strong className="font-bold text-stone-900">توصيات للأسرة: </strong>
                        {rep.recommendations}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 6: Payments & Invoices */}
        {activeTab === 'payments' && (
          <div className="space-y-5">
            {/* Active Subscriptions & Cancellation Management */}
            <div className="bg-white rounded-2xl p-4 sm:p-5 border border-stone-200 shadow-xs space-y-3">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div>
                  <h3 className="text-sm sm:text-base font-bold text-stone-900 flex items-center gap-1.5">
                    <CreditCard className="w-4 h-4 text-emerald-700" />
                    <span>إدارة خطط واشتراكات الأبناء</span>
                  </h3>
                  <p className="text-[11px] text-stone-500">متابعة حالة اشتراك كل طفل، وخيار إلغاء الاشتراك في أي وقت</p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsSettingsOpen(true)}
                  className="px-3 py-1.5 rounded-xl border border-stone-200 bg-stone-50 hover:bg-stone-100 text-stone-700 text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-colors"
                >
                  <Settings className="w-3.5 h-3.5 text-stone-600" />
                  <span>إعدادات الاشتراكات بالحساب</span>
                </button>
              </div>

              {parentChildren.length === 0 ? (
                <p className="text-xs text-stone-500 py-2">لا يوجد أبناء مسجلون بعد لإدارة اشتراكاتهم.</p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
                  {parentChildren.map((child) => {
                    const isCancelled = child.subscriptionCancelled;
                    const isActive = !isCancelled && (child.status === 'active' || child.enrollmentStatus === 'active');
                    return (
                      <div
                        key={child.id}
                        className="p-3.5 rounded-xl border border-stone-200 bg-stone-50/50 flex flex-col justify-between gap-2.5"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <h4 className="font-bold text-xs sm:text-sm text-stone-900">{child.fullName}</h4>
                            <p className="text-[11px] text-stone-500">
                              {child.gender === 'male' ? 'الابن' : 'الابنة'} • {child.age} سنة
                            </p>
                          </div>
                          <div>
                            {isCancelled ? (
                              <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-rose-100 text-rose-800">
                                تم إلغاء الاشتراك
                              </span>
                            ) : isActive ? (
                              <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-100 text-emerald-800">
                                اشتراك نشط
                              </span>
                            ) : (
                              <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-amber-100 text-amber-800">
                                بانتظار السداد
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center justify-between pt-2 border-t border-stone-200/60 text-xs">
                          {!isCancelled ? (
                            <button
                              type="button"
                              onClick={() => setIsSettingsOpen(true)}
                              className="text-rose-700 hover:text-rose-900 font-bold hover:underline cursor-pointer text-[11px] flex items-center gap-1"
                            >
                              <AlertTriangle className="w-3 h-3" />
                              <span>خيار إلغاء الاشتراك</span>
                            </button>
                          ) : (
                            <button
                              type="button"
                              onClick={onGoToCheckout}
                              className="text-emerald-700 hover:text-emerald-900 font-bold hover:underline cursor-pointer text-[11px]"
                            >
                              إعادة تفعيل وسداد الاشتراك ←
                            </button>
                          )}

                          <span className="text-[10px] text-stone-400">سجل الإنجاز محفوظ</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            <div className="flex items-center justify-between flex-wrap gap-2 pt-1">
              <div>
                <h3 className="text-sm sm:text-base font-bold text-stone-900">سجل الفواتير والإيصالات</h3>
                <p className="text-[11px] text-stone-500">تفاصيل المدفوعات والإيصالات المعتمدة</p>
              </div>
              <button
                type="button"
                onClick={onGoToCheckout}
                className="px-3 py-1.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold cursor-pointer transition-colors shadow-2xs"
              >
                تجديد أو سداد اشتراك جديد
              </button>
            </div>

            {payments.length === 0 ? (
              <EmptyState
                icon={CreditCard}
                title="لا توجد مدفوعات مسجلة حتى الآن"
                description="سجل اشتراك أبنائك للحصول على الفاتورة والإيصال الفوري."
                actionText="سداد الاشتراك الآن"
                onAction={onGoToCheckout}
              />
            ) : (
              <div className="space-y-2.5">
                {payments.map((p) => (
                  <div
                    key={p.id}
                    className="bg-white rounded-xl p-3.5 sm:p-4 border border-stone-200 shadow-2xs flex flex-wrap items-center justify-between gap-3"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-stone-900 text-xs sm:text-sm">فاتورة رقم: {p.invoiceNumber}</span>
                        <span className="text-[10px] text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded-md">
                          ناجحة ✓
                        </span>
                      </div>
                      <p className="text-[11px] text-stone-500 mt-0.5">
                        تاريخ الدفع: {new Date(p.paidAt).toLocaleDateString('ar-EG')} • الطلاب: {p.receiptDetails.studentNames.join('، ')}
                      </p>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="text-base font-black text-emerald-900">
                        {p.amount} {p.currency}
                      </span>
                      <button
                        type="button"
                        onClick={onGoToCheckout}
                        className="px-3 py-1.2 rounded-lg border border-stone-300 text-stone-700 text-xs font-bold hover:bg-stone-50 cursor-pointer transition-colors"
                      >
                        عرض الإيصال
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Modal 1: Intelligent Delete Child Confirmation Modal */}
      {childToDelete && (() => {
        const stats = getChildHistoryStats(childToDelete.id);
        return (
          <div
            onClick={(e) => {
              if (e.target === e.currentTarget) setChildToDelete(null);
            }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs"
          >
            <div className="relative bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl border border-stone-200 text-right animate-in fade-in zoom-in-95 duration-150">
              {/* Close Button */}
              <button
                type="button"
                onClick={() => setChildToDelete(null)}
                className="absolute top-5 left-5 w-8 h-8 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-500 hover:text-stone-800 flex items-center justify-center transition-colors cursor-pointer"
                title="إغلاق النافذة"
                aria-label="إغلاق"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-700 flex items-center justify-center mb-4">
                <AlertTriangle className="w-6 h-6" />
              </div>
              
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-bold text-rose-800 bg-rose-50 px-2 py-0.5 rounded-md border border-rose-200">
                  حذف = طفل أُضيف بالخطأ ولم يبدأ أي شيء
                </span>
              </div>

              <h3 className="text-lg font-black text-stone-900 mb-2">
                حذف ملف الطفل ({childToDelete.fullName})
              </h3>

              {stats.hasHistory ? (
                <div className="space-y-4 mb-6">
                  <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-2xl text-xs text-amber-950 space-y-2">
                    <p className="font-bold flex items-center gap-1.5 text-amber-900 text-sm">
                      <AlertCircle className="w-4 h-4 text-amber-700 shrink-0" />
                      <span>تنبيه هام للحفاظ على بيانات الطفل وعمليات الدفع!</span>
                    </p>
                    <p className="leading-relaxed">
                      هذا الملف يحتوي على سجلات حقيقية تم حفظها في النظام:
                    </p>
                    <ul className="list-disc list-inside space-y-1 font-semibold text-amber-900 pr-1">
                      {stats.audiosCount > 0 && <li>{stats.audiosCount} تسجيلات وتلاوات صوتية مسجلة</li>}
                      {stats.tasksCount > 0 && <li>{stats.tasksCount} مهام قرآنية وتطبيقات عملية</li>}
                      {stats.reportsCount > 0 && <li>{stats.reportsCount} تقارير تقييم دورية من المعلم والمشرف</li>}
                      {stats.paymentsCount > 0 && <li>{stats.paymentsCount} عمليات اشتراك ودفع مسجلة</li>}
                    </ul>
                    <p className="leading-relaxed pt-1 text-stone-700 border-t border-amber-200/60">
                      لحماية هذا الجهد وسجل المدفوعات من الضياع، يُرجى استخدام <strong>«الأرشفة»</strong> (لحفظ التاريخ وإخفائه) أو <strong>«إكمال البرنامج»</strong> (إذا أتم دورته). زر الحذف مخصص فقط للطفل المُضاف بالخطأ.
                    </p>
                  </div>

                  <div className="flex flex-col gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        const targetId = childToDelete.id;
                        setChildToDelete(null);
                        archiveChild(targetId);
                      }}
                      className="w-full py-3 px-4 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <Archive className="w-4 h-4" />
                      <span>أرشفة الملف بدلاً من الحذف (موصى به - حفظ كامل السجل)</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        const targetChild = childToDelete;
                        setChildToDelete(null);
                        setChildToGraduate(targetChild);
                      }}
                      className="w-full py-2.5 px-4 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-900 border border-purple-200 text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <GraduationCap className="w-4 h-4 text-purple-700" />
                      <span>توثيق تخرج وإكمال البرنامج</span>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-3 mb-6 text-sm text-stone-600 leading-relaxed">
                  <p>
                    هذا الطفل أُضيف إلى حسابك ولم يبدأ أي جلسات أو تلاوات أو عمليات دفع مسجلة.
                  </p>
                  <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 text-xs text-stone-600">
                    ✓ يمكنك حذف هذا الملف بأمان دون التأثير على أي سجلات أو اشتراكات أخرى.
                  </div>
                </div>
              )}

              <div className="flex items-center justify-between gap-3 pt-4 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => setChildToDelete(null)}
                  className="px-4 py-2.5 rounded-xl border border-stone-200 text-stone-700 hover:bg-stone-50 text-xs font-bold transition-colors cursor-pointer"
                >
                  إلغاء وإغلاق
                </button>
                
                <button
                  type="button"
                  onClick={() => {
                    deleteChild(childToDelete.id);
                    setChildToDelete(null);
                  }}
                  className="px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-xs transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>{stats.hasHistory ? 'تأكيد الحذف النهائي على أي حال' : 'نعم، حذف الملف المضاف بالخطأ'}</span>
                </button>
              </div>
            </div>
          </div>
        );
      })()}

      {/* Modal 2: Archive Child Confirmation Modal */}
      {childToArchive && (
        <div
          onClick={(e) => {
            if (e.target === e.currentTarget) setChildToArchive(null);
          }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs"
        >
          <div className="relative bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-stone-200 text-right animate-in fade-in zoom-in-95 duration-150">
            {/* Close Button */}
            <button
              type="button"
              onClick={() => setChildToArchive(null)}
              className="absolute top-5 left-5 w-8 h-8 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-500 hover:text-stone-800 flex items-center justify-center transition-colors cursor-pointer"
              title="إغلاق النافذة"
              aria-label="إغلاق"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="w-12 h-12 rounded-2xl bg-stone-100 text-stone-700 flex items-center justify-center mb-4">
              <Archive className="w-6 h-6" />
            </div>
            
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-bold text-stone-800 bg-stone-100 px-2 py-0.5 rounded-md border border-stone-200">
                أرشفة = ملف قديم نريد إخفاءه مع الاحتفاظ بتاريخه
              </span>
            </div>

            <h3 className="text-lg font-black text-stone-900 mb-2">
              أرشفة ملف ({childToArchive.fullName})
            </h3>
            
            <p className="text-xs sm:text-sm text-stone-600 leading-relaxed mb-6">
              سيتم نقل هذا الملف إلى قسم <strong>«الأرشيف»</strong> وإخفاؤه من القائمة اليومية النشطة، مع الحفاظ الكامل على:
              <br />
              <span className="block mt-2 font-medium text-emerald-800 space-y-1">
                ✓ جميع التلاوات والتسجيلات الصوتية السابقة.<br />
                ✓ كافة المهام والأنشطة الأسرية المكتملة.<br />
                ✓ التقارير التقييمية وسجل عمليات الدفع والاشتراك.<br />
                ✓ إمكانية استعادة الملف إلى القائمة النشطة بنقرة واحدة في أي وقت.
              </span>
            </p>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-stone-100">
              <button
                type="button"
                onClick={() => setChildToArchive(null)}
                className="px-4 py-2.5 rounded-xl border border-stone-200 text-stone-700 hover:bg-stone-50 text-xs font-bold transition-colors cursor-pointer"
              >
                إلغاء وإغلاق
              </button>
              <button
                type="button"
                onClick={() => {
                  archiveChild(childToArchive.id);
                  setChildToArchive(null);
                }}
                className="px-5 py-2.5 rounded-xl bg-stone-800 hover:bg-stone-900 text-white text-xs font-bold shadow-xs transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <Archive className="w-4 h-4" />
                <span>تأكيد الأرشفة الآمنة</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal 3: Graduate / Complete Program Modal */}
      {childToGraduate && (
        <div
          onClick={(e) => {
            if (e.target === e.currentTarget) setChildToGraduate(null);
          }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs"
        >
          <div className="relative bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl border border-stone-200 text-right animate-in fade-in zoom-in-95 duration-150">
            {/* Close Button */}
            <button
              type="button"
              onClick={() => setChildToGraduate(null)}
              className="absolute top-5 left-5 w-8 h-8 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-500 hover:text-stone-800 flex items-center justify-center transition-colors cursor-pointer"
              title="إغلاق النافذة"
              aria-label="إغلاق"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="w-12 h-12 rounded-2xl bg-purple-100 text-purple-800 flex items-center justify-center mb-4">
              <GraduationCap className="w-6 h-6" />
            </div>
            
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-bold text-purple-900 bg-purple-50 px-2.5 py-0.5 rounded-md border border-purple-200">
                تخرج/إكمال برنامج = أنهى الدورة ويظل موجودًا ويمكنه الالتحاق ببرنامج آخر
              </span>
            </div>

            <h3 className="text-lg font-black text-stone-900 mb-2">
              توثيق تخرج وإكمال البرنامج ({childToGraduate.fullName}) 🎓
            </h3>
            
            <p className="text-xs sm:text-sm text-stone-600 leading-relaxed mb-4">
              مبارك! سيتم توثيق إتمام <strong className="text-stone-900 font-bold">{childToGraduate.fullName}</strong> للبرنامج القرآني بنجاح، مع بقائه في النظام وإمكانية التسجيل في مسار أو مستوى متقدم في أي وقت.
            </p>

            <div className="space-y-3 mb-6">
              <label className="block text-xs font-bold text-stone-700">
                ملاحظة التخرج / تهنئة الإتمام:
              </label>
              <textarea
                rows={2}
                value={gradNote}
                onChange={(e) => setGradNote(e.target.value)}
                placeholder="أتم الدورة القرآنية بنجاح واجتاز تقييمات الحفظ والتدبر..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 focus:border-purple-600 focus:ring-1 focus:ring-purple-600 text-xs text-stone-800 outline-none resize-none"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-stone-100">
              <button
                type="button"
                onClick={() => setChildToGraduate(null)}
                className="px-4 py-2.5 rounded-xl border border-stone-200 text-stone-700 hover:bg-stone-50 text-xs font-bold transition-colors cursor-pointer"
              >
                إلغاء وإغلاق
              </button>
              <button
                type="button"
                onClick={() => {
                  graduateChild(childToGraduate.id, childToGraduate.currentProgramId, gradNote);
                  const graduated = childToGraduate;
                  setChildToGraduate(null);
                  setChildFilter('graduated');
                }}
                className="px-5 py-2.5 rounded-xl bg-purple-700 hover:bg-purple-800 text-white text-xs font-bold shadow-xs transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <GraduationCap className="w-4 h-4" />
                <span>توثيق التخرج وإتمام البرنامج</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal 4: Enroll Graduated or Active Child in Another Program */}
      {childToEnroll && (
        <div
          onClick={(e) => {
            if (e.target === e.currentTarget) setChildToEnroll(null);
          }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs"
        >
          <div className="relative bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl border border-stone-200 text-right animate-in fade-in zoom-in-95 duration-150">
            {/* Close Button */}
            <button
              type="button"
              onClick={() => setChildToEnroll(null)}
              className="absolute top-5 left-5 w-8 h-8 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-500 hover:text-stone-800 flex items-center justify-center transition-colors cursor-pointer"
              title="إغلاق النافذة"
              aria-label="إغلاق"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="w-12 h-12 rounded-2xl bg-purple-100 text-purple-800 flex items-center justify-center mb-4">
              <BookOpenCheck className="w-6 h-6" />
            </div>
            
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-bold text-purple-900 bg-purple-50 px-2.5 py-0.5 rounded-md border border-purple-200">
                الالتحاق ببرنامج جديد
              </span>
            </div>

            <h3 className="text-lg font-black text-stone-900 mb-2">
              تسجيل {childToEnroll.fullName} في مسار قرآني جديد
            </h3>
            
            <p className="text-xs text-stone-600 leading-relaxed mb-4">
              اختر البرنامج القرآني المناسب للمرحلة التالية من رحلة الابن:
            </p>

            <div className="space-y-3 mb-6 max-h-60 overflow-y-auto pr-1">
              {programs.map((prog) => {
                const isCurrent = prog.id === childToEnroll.currentProgramId;
                const isSelected = (selectedNewProgramId || programs[0].id) === prog.id;
                return (
                  <div
                    key={prog.id}
                    onClick={() => setSelectedNewProgramId(prog.id)}
                    className={`p-3.5 rounded-2xl border transition-all cursor-pointer text-right ${
                      isSelected
                        ? 'border-purple-600 bg-purple-50/50 shadow-xs ring-1 ring-purple-600'
                        : 'border-stone-200 hover:border-purple-200 bg-white'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-stone-900">{prog.name}</span>
                        {isCurrent && (
                          <span className="text-[10px] bg-stone-100 text-stone-600 px-2 py-0.5 rounded-full font-bold">
                            البرنامج الحالي
                          </span>
                        )}
                      </div>
                      <span className="text-[11px] font-semibold text-purple-800">
                        {prog.durationMonths} أشهر
                      </span>
                    </div>
                    <p className="text-xs text-stone-500 leading-normal">{prog.description}</p>
                  </div>
                );
              })}
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-stone-100">
              <button
                type="button"
                onClick={() => setChildToEnroll(null)}
                className="px-4 py-2.5 rounded-xl border border-stone-200 text-stone-700 hover:bg-stone-50 text-xs font-bold transition-colors cursor-pointer"
              >
                إلغاء وإغلاق
              </button>
              <button
                type="button"
                onClick={() => {
                  const progId = selectedNewProgramId || programs[0].id;
                  enrollChildInProgram(childToEnroll.id, progId);
                  setChildToEnroll(null);
                  setChildFilter('active');
                }}
                className="px-5 py-2.5 rounded-xl bg-purple-700 hover:bg-purple-800 text-white text-xs font-bold shadow-xs transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <Check className="w-4 h-4" />
                <span>تأكيد التسجيل وبدء البرنامج</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal 5: Child Enrollment Status & Progress Flow (عرض حالة الطلب) */}
      {childToViewStatus && (
        <div
          onClick={(e) => {
            if (e.target === e.currentTarget) setChildToViewStatus(null);
          }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs"
        >
          <div className="relative bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl border border-stone-200 text-right animate-in fade-in zoom-in-95 duration-150">
            {/* Close Button */}
            <button
              type="button"
              onClick={() => setChildToViewStatus(null)}
              className="absolute top-5 left-5 w-8 h-8 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-500 hover:text-stone-800 flex items-center justify-center transition-colors cursor-pointer"
              title="إغلاق النافذة"
              aria-label="إغلاق"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-800 flex items-center justify-center mb-4">
              <Clock className="w-6 h-6" />
            </div>

            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-bold text-blue-900 bg-blue-50 px-2.5 py-0.5 rounded-md border border-blue-200">
                متابعة حالة الطلب والاشتراك
              </span>
            </div>

            <h3 className="text-lg font-black text-stone-900 mb-1">
              طلب التحاق: {childToViewStatus.fullName}
            </h3>
            <p className="text-xs text-stone-500 mb-6">
              مسار الالتحاق بالبرنامج القرآني وتفعيله من الإدارة
            </p>

            {/* Stepper Steps */}
            <div className="space-y-4 mb-6 relative pr-2">
              {/* Step 1: Child Registered */}
              <div className="flex items-start gap-3">
                <div className="w-7 h-7 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0 mt-0.5 font-bold text-xs">
                  <Check className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-stone-900">1. تسجيل بيانات الطفل</h4>
                  <p className="text-[11px] text-stone-500">تم تسجيل بيانات الطفل وتحديد الفئة العمرية بنجاح.</p>
                </div>
              </div>

              {/* Step 2: Subscription choice */}
              <div className="flex items-start gap-3">
                <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 mt-0.5 font-bold text-xs ${
                  childToViewStatus.enrollmentStatus !== 'pending_subscription'
                    ? 'bg-emerald-100 text-emerald-800'
                    : 'bg-blue-600 text-white ring-4 ring-blue-100'
                }`}>
                  {childToViewStatus.enrollmentStatus !== 'pending_subscription' ? <Check className="w-4 h-4" /> : '2'}
                </div>
                <div>
                  <h4 className="text-xs font-bold text-stone-900">2. اختيار برنامج الاشتراك</h4>
                  <p className="text-[11px] text-stone-500">
                    {childToViewStatus.enrollmentStatus === 'pending_subscription'
                      ? 'الطفل بانتظار اختيار باقة الاشتراك والمتابعة للدفع.'
                      : 'تم اختيار البرنامج وتحديد مسار الدورة.'}
                  </p>
                </div>
              </div>

              {/* Step 3: Payment */}
              <div className="flex items-start gap-3">
                <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 mt-0.5 font-bold text-xs ${
                  childToViewStatus.enrollmentStatus === 'pending_activation' || childToViewStatus.enrollmentStatus === 'active' || isChildActive(childToViewStatus)
                    ? 'bg-emerald-100 text-emerald-800'
                    : childToViewStatus.enrollmentStatus === 'pending_payment'
                    ? 'bg-amber-500 text-white ring-4 ring-amber-100'
                    : 'bg-stone-100 text-stone-400'
                }`}>
                  {childToViewStatus.enrollmentStatus === 'pending_activation' || childToViewStatus.enrollmentStatus === 'active' || isChildActive(childToViewStatus) ? (
                    <Check className="w-4 h-4" />
                  ) : (
                    '3'
                  )}
                </div>
                <div>
                  <h4 className="text-xs font-bold text-stone-900">3. سداد رسوم الاشتراك</h4>
                  <p className="text-[11px] text-stone-500">
                    {childToViewStatus.enrollmentStatus === 'pending_activation' || childToViewStatus.enrollmentStatus === 'active' || isChildActive(childToViewStatus)
                      ? 'تم سداد الرسوم عبر بوابة الدفع المعتمدة.'
                      : childToViewStatus.enrollmentStatus === 'pending_payment'
                      ? 'بانتظار سداد الاشتراك عبر فوري أو فودافون كاش أو البطاقة.'
                      : 'يتم السداد بعد اختيار البرنامج.'}
                  </p>
                </div>
              </div>

              {/* Step 4: Admin Activation */}
              <div className="flex items-start gap-3">
                <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 mt-0.5 font-bold text-xs ${
                  childToViewStatus.enrollmentStatus === 'active' || isChildActive(childToViewStatus)
                    ? 'bg-emerald-100 text-emerald-800'
                    : childToViewStatus.enrollmentStatus === 'pending_activation'
                    ? 'bg-orange-500 text-white ring-4 ring-orange-100 animate-pulse'
                    : 'bg-stone-100 text-stone-400'
                }`}>
                  {childToViewStatus.enrollmentStatus === 'active' || isChildActive(childToViewStatus) ? (
                    <Check className="w-4 h-4" />
                  ) : (
                    '4'
                  )}
                </div>
                <div>
                  <h4 className="text-xs font-bold text-stone-900">4. مراجعة وتفعيل الإدارة</h4>
                  <p className="text-[11px] text-stone-500">
                    {childToViewStatus.enrollmentStatus === 'active' || isChildActive(childToViewStatus)
                      ? 'تم تفعيل حساب الطفل بنجاح ونقله إلى تبويب الأبناء النشطين.'
                      : childToViewStatus.enrollmentStatus === 'pending_activation'
                      ? 'الطلب قيد مراجعة فريق الإدارة لتسكين الطفل في المجموعة المناسبة.'
                      : 'تفعيل الحساب وتسكين الحلقة فور إتمام الدفع.'}
                  </p>
                </div>
              </div>
            </div>

            {/* Current Status Box */}
            <div className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200 text-xs text-stone-700 mb-6">
              <span className="font-bold block text-stone-900 mb-1">الوضع الحالي:</span>
              {childToViewStatus.enrollmentStatus === 'pending_subscription' && (
                <p>الطفل مسجل وبانتظار بدء الاشتراك للالتحاق بالبرنامج القرآني.</p>
              )}
              {childToViewStatus.enrollmentStatus === 'pending_payment' && (
                <p>تم تسجيل طلب الاشتراك وبانتظار استكمال عملية الدفع لتأكيد المقعد.</p>
              )}
              {childToViewStatus.enrollmentStatus === 'pending_activation' && (
                <div className="space-y-1.5 text-orange-950">
                  <p className="font-bold flex items-center gap-1.5 text-orange-900">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>تم استلام رسوم الاشتراك بنجاح</span>
                  </p>
                  <p className="bg-orange-100/70 p-2.5 rounded-xl border border-orange-200 text-xs font-semibold text-orange-900">
                    ℹ️ الحالة تقررها الإدارة بعد دفع الرسوم: جاري المراجعة الإدارية وتسكين الطفل في الحلقة والمعلم المناسب، وسيتم نقله تلقائياً إلى تبويب "الأبناء النشطون".
                  </p>
                </div>
              )}
              {(childToViewStatus.enrollmentStatus === 'active' || isChildActive(childToViewStatus)) && (
                <p className="text-emerald-900">
                  حساب الطفل مفعّل وجاهز في تبويب <strong>"الأبناء النشطون"</strong> وبإمكانه حضور الجلسات وتسليم التلاوات.
                </p>
              )}
            </div>

            {/* Action Buttons in Modal */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-stone-100">
              <button
                type="button"
                onClick={() => setChildToViewStatus(null)}
                className="px-4 py-2 rounded-xl border border-stone-200 text-stone-700 hover:bg-stone-50 text-xs font-bold transition-colors cursor-pointer"
              >
                إغلاق
              </button>

              {childToViewStatus.enrollmentStatus === 'pending_subscription' && (
                <button
                  type="button"
                  onClick={() => {
                    setChildToViewStatus(null);
                    enrollChildInProgram(childToViewStatus.id, childToViewStatus.currentProgramId || programs[0].id);
                    onGoToCheckout();
                  }}
                  className="px-4 py-2 rounded-xl bg-blue-700 hover:bg-blue-800 text-white text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>اشترك الآن</span>
                </button>
              )}

              {childToViewStatus.enrollmentStatus === 'pending_payment' && (
                <button
                  type="button"
                  onClick={() => {
                    setChildToViewStatus(null);
                    setActiveStudentId(childToViewStatus.id);
                    onGoToCheckout();
                  }}
                  className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <CreditCard className="w-3.5 h-3.5" />
                  <span>استكمال الدفع</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Parent Account Settings Modal */}
      <ParentSettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        onGoToCheckout={onGoToCheckout}
      />
    </div>
  );
};
