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
  Plus,
  Play,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { EmptyState } from '../components/common/EmptyState';
import { StudentUser } from '../types';

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
  } = useApp();

  const [activeTab, setActiveTab] = useState<
    'children' | 'progress' | 'family_activities' | 'sessions' | 'reports' | 'payments'
  >('children');

  const [familyNoteInput, setFamilyNoteInput] = useState<{ [id: string]: string }>({});

  const parentChildren = students.filter(
    (s) => s.parentId === activeParent?.id || activeParent === null
  );

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

  const handleConfirmActivity = (activityId: string) => {
    const note = familyNoteInput[activityId] || '';
    confirmFamilyActivityByParent(activityId, note);
  };

  return (
    <div className="min-h-screen bg-stone-50 text-stone-900 pb-16">
      {/* Top Banner with Parent Info */}
      <div className="bg-white border-b border-stone-200 py-6 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-md">
                لوحة ولي الأمر
              </span>
              <h1 className="text-xl sm:text-2xl font-black text-stone-900">
                {activeParent ? `أهلاً بك، ${activeParent.fullName}` : 'لوحة متابعة ولي الأمر'}
              </h1>
            </div>
            <p className="text-xs text-stone-500 mt-1">
              متابعة حفظ وتدبر وتطبيق الأبناء، والأنشطة الأسرية المشتركة
            </p>
          </div>

          {/* Top Actions */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onOpenAddChild}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold shadow-xs transition-colors cursor-pointer"
            >
              <UserPlus className="w-4 h-4" />
              <span>إضافة طفل جديد</span>
            </button>

            {parentChildren.length > 0 && (
              <button
                type="button"
                onClick={onGoToCheckout}
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-white text-xs font-bold transition-colors cursor-pointer"
              >
                <CreditCard className="w-4 h-4" />
                <span>إدارة الاشتراكات والدفع</span>
              </button>
            )}
          </div>
        </div>

        {/* Child Selector Tabs Bar if children exist */}
        {parentChildren.length > 0 && (
          <div className="max-w-7xl mx-auto mt-6 pt-4 border-t border-stone-100 flex items-center justify-between">
            <div className="flex items-center gap-2 overflow-x-auto pb-1">
              <span className="text-xs font-bold text-stone-400 shrink-0">الأبناء:</span>
              {parentChildren.map((child) => {
                const isSelected = currentChild?.id === child.id;
                return (
                  <button
                    key={child.id}
                    type="button"
                    onClick={() => setActiveStudentId(child.id)}
                    className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer flex items-center gap-2 ${
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
                  </button>
                );
              })}
            </div>

            {currentChild && (
              <button
                type="button"
                onClick={() => onGoToStudentView(currentChild.id)}
                className="text-xs font-bold text-emerald-700 hover:text-emerald-900 hover:underline flex items-center gap-1 shrink-0"
              >
                <span>دخول بوابة الابن «رحلتي»</span>
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        )}
      </div>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        {/* Navigation Tabs */}
        <div className="flex items-center gap-1 sm:gap-2 border-b border-stone-200 mb-8 overflow-x-auto pb-2">
          {[
            { id: 'children', label: 'أطفالي المسجلون', icon: Users },
            { id: 'progress', label: 'التقدم والحفظ والتدبر', icon: TreeDeciduous },
            { id: 'family_activities', label: 'مع الأسرة (الأنشطة الأسرية)', icon: HeartHandshake },
            { id: 'sessions', label: 'الجلسات والتقويم', icon: Calendar },
            { id: 'reports', label: 'تقارير المتابعة التربوية', icon: FileText },
            { id: 'payments', label: 'الاشتراكات والفواتير', icon: CreditCard },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all shrink-0 flex items-center gap-2 cursor-pointer ${
                  isActive
                    ? 'bg-emerald-700 text-white shadow-xs'
                    : 'bg-white border border-stone-200 text-stone-600 hover:bg-stone-100'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab 1: Children List */}
        {activeTab === 'children' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-stone-900">الأطفال المسجلون في حسابك</h3>
                <p className="text-xs text-stone-500">إدارة ملفات الأبناء ومساراتهم العمرية والاشتراكات</p>
              </div>
              <button
                type="button"
                onClick={onOpenAddChild}
                className="px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold cursor-pointer flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                <span>إضافة طفل</span>
              </button>
            </div>

            {parentChildren.length === 0 ? (
              <EmptyState
                icon={Users}
                title="لا يوجد أطفال مضافون حتى الآن"
                description="ابدأ بإضافة طفلك الأول لاختيار الفئة العمرية وتخصيص رحلته مع القرآن الكريم."
                actionText="إضافة طفل"
                onAction={onOpenAddChild}
              />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {parentChildren.map((child) => (
                  <div
                    key={child.id}
                    className="bg-white rounded-2xl p-6 border border-stone-200 shadow-xs hover:border-emerald-300 transition-all flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-start justify-between mb-4">
                        <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-black text-lg">
                          {child.fullName.charAt(0)}
                        </div>
                        <span
                          className={`px-2.5 py-1 rounded-md text-[11px] font-bold ${
                            child.status === 'active'
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-amber-100 text-amber-900'
                          }`}
                        >
                          {child.status === 'active' ? 'مشترك ونشط ✓' : 'في انتظار سداد الاشتراك'}
                        </span>
                      </div>

                      <h4 className="text-lg font-bold text-stone-900 mb-1">{child.fullName}</h4>
                      <div className="space-y-1 text-xs text-stone-500">
                        <p>العمر: <strong className="text-stone-800">{child.age} سنة</strong> ({child.gender === 'male' ? 'ذكر' : 'أنثى'})</p>
                        <p>البرنامج: <strong className="text-stone-800">برنامج التربية بالمعايشة القرآنية</strong></p>
                      </div>
                    </div>

                    <div className="mt-6 pt-4 border-t border-stone-100 flex items-center justify-between gap-2">
                      <button
                        type="button"
                        onClick={() => onGoToStudentView(child.id)}
                        className="px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-800 hover:bg-emerald-100 text-xs font-bold transition-colors cursor-pointer"
                      >
                        دخول رحلتي
                      </button>
                      <button
                        type="button"
                        onClick={() => onEditChild(child)}
                        className="px-3 py-1.5 rounded-lg border border-stone-200 text-stone-600 hover:bg-stone-50 text-xs font-medium cursor-pointer"
                      >
                        تعديل البيانات
                      </button>
                    </div>
                  </div>
                ))}
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
                    <span className="text-base font-black text-purple-900">منتظم 100%</span>
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
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-stone-900">الاشتراكات وسجل الفواتير</h3>
                <p className="text-xs text-stone-500">تفاصيل المدفوعات والإيصالات المعتمدة</p>
              </div>
              <button
                type="button"
                onClick={onGoToCheckout}
                className="px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold cursor-pointer"
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
              <div className="space-y-4">
                {payments.map((p) => (
                  <div
                    key={p.id}
                    className="bg-white rounded-2xl p-6 border border-stone-200 shadow-xs flex flex-wrap items-center justify-between gap-4"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-stone-900 text-sm">فاتورة رقم: {p.invoiceNumber}</span>
                        <span className="text-xs text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded-md">
                          ناجحة ✓
                        </span>
                      </div>
                      <p className="text-xs text-stone-500 mt-1">
                        تاريخ الدفع: {new Date(p.paidAt).toLocaleDateString('ar-EG')} • الطلاب: {p.receiptDetails.studentNames.join('، ')}
                      </p>
                    </div>

                    <div className="flex items-center gap-4">
                      <span className="text-lg font-black text-emerald-900">
                        {p.amount} {p.currency}
                      </span>
                      <button
                        type="button"
                        onClick={onGoToCheckout}
                        className="px-3.5 py-1.5 rounded-xl border border-stone-300 text-stone-700 text-xs font-bold hover:bg-stone-50 cursor-pointer"
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
    </div>
  );
};
