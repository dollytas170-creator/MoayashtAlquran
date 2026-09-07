import React, { useState } from 'react';
import {
  ShieldCheck,
  Users,
  GraduationCap,
  Calendar,
  FileText,
  CheckCircle2,
  TrendingUp,
  Plus,
  Sparkles,
  Award,
  AlertCircle,
  Clock,
  Layers,
  X,
  ArrowRight,
  Home,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { EmptyState } from '../components/common/EmptyState';

export const SupervisorDashboard: React.FC = () => {
  const {
    activeSupervisor,
    teachers,
    students,
    groups,
    reports,
    createStudentReport,
    programs,
    setCurrentRole,
    goBack,
    goHome,
    previousScreenTitle,
  } = useApp();

  const [activeTab, setActiveTab] = useState<
    'teachers' | 'students' | 'generate_report' | 'reports_archive'
  >('teachers');

  // Report Creation Form State
  const [repStudentId, setRepStudentId] = useState('');
  const [repPeriod, setRepPeriod] = useState('تقرير نهاية الشهر الأول — سورة العلق');
  const [attendanceRate, setAttendanceRate] = useState(100);
  const [memorizationScore, setMemorizationScore] = useState(92);
  const [tadabburScore, setTadabburScore] = useState(95);
  const [familyScore, setFamilyScore] = useState(90);
  const [notes, setNotes] = useState(
    'طالب متميز ومبادر، يظهر تفاعلاً إيجابياً في جلسات التدبر والتزاماً طيباً بالتسميع.'
  );
  const [recommendations, setRecommendations] = useState(
    'الاستمرار في تشجيع الابن على أداء الأنشطة الأسرية الأسبوعية ومراجعته المستمرة للمد الطبيعي.'
  );

  const handleGenerateReport = (e: React.FormEvent) => {
    e.preventDefault();
    if (!repStudentId && students.length > 0) {
      alert('يرجى اختيار الطالب');
      return;
    }

    createStudentReport({
      studentId: repStudentId || (students[0]?.id ?? 's-1'),
      periodTitle: repPeriod,
      attendanceRate,
      memorizationScore,
      tadabburScore,
      familyParticipationScore: familyScore,
      generalNotes: notes,
      recommendations,
      supervisorId: activeSupervisor?.id || 'supervisor-1',
      published: true,
    });

    alert('تم اعتماد التقرير التربوي وإرساله مباشرة إلى حساب ولي الأمر');
    setActiveTab('reports_archive');
  };

  return (
    <div className="min-h-screen bg-stone-50 text-stone-900 pb-16">
      {/* Top Banner */}
      <div className="bg-white border-b border-stone-200 py-6 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-bold text-purple-800 bg-purple-50 px-2.5 py-0.5 rounded-md">
                لوحة المشرف التربوي
              </span>
              <h1 className="text-xl sm:text-2xl font-black text-stone-900">
                {activeSupervisor ? `مرحباً المشرف / ${activeSupervisor.fullName}` : 'لوحة الإشراف والمتابعة التربوية'}
              </h1>
            </div>
            <p className="text-xs text-stone-500 mt-1">
              متابعة جودة التدريس، أداء المعلمين، وإصدار التقارير التربوية الدورية لأولياء الأمور
            </p>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            <button
              type="button"
              onClick={() => setActiveTab('generate_report')}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-purple-700 hover:bg-purple-800 text-white text-xs font-bold shadow-xs transition-colors cursor-pointer"
            >
              <FileText className="w-4 h-4" />
              <span>إصدار تقرير تربوي لولي أمر</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        {/* Navigation Tabs */}
        <div className="flex flex-wrap items-center justify-between border-b border-stone-200 mb-8 pb-2 gap-4">
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            {[
              { id: 'teachers', label: `المعلمون (${teachers.length})`, icon: GraduationCap },
              { id: 'students', label: `الطلاب والمجموعات (${students.length})`, icon: Users },
              { id: 'generate_report', label: 'إصدار تقرير جديد', icon: FileText },
              { id: 'reports_archive', label: `سجل التقارير المعتمدة (${reports.length})`, icon: Award },
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
                      ? 'bg-purple-700 text-white shadow-xs'
                      : 'bg-white border border-stone-200 text-stone-600 hover:bg-stone-100'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                  {isActive && activeTab !== 'teachers' && (
                    <span
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveTab('teachers');
                      }}
                      title="إغلاق التبويب والعودة لطاقم المعلمين"
                      className="mr-1 p-0.5 rounded-full hover:bg-purple-800 text-purple-100 cursor-pointer"
                    >
                      <X className="w-3.5 h-3.5" />
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {activeTab !== 'teachers' && (
            <button
              type="button"
              onClick={() => setActiveTab('teachers')}
              className="shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-stone-300 bg-white hover:bg-stone-50 text-stone-700 text-xs font-bold transition-colors cursor-pointer shadow-2xs"
              title="إغلاق التبويب والعودة لطاقم المعلمين"
            >
              <X className="w-3.5 h-3.5 text-stone-500" />
              <span>إغلاق التبويب</span>
            </button>
          )}
        </div>

        {/* Tab 1: Teachers List */}
        {activeTab === 'teachers' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-stone-900">طاقم معلمي التحفيظ والتجويد</h3>
                <p className="text-xs text-stone-500">متابعة نصاب الحلقات والتقييمات المسندة للمعلمين</p>
              </div>
            </div>

            {teachers.length === 0 ? (
              <EmptyState
                icon={GraduationCap}
                title="لا يوجد معلمون مسجلون حتى الآن"
                description="يمكن لمدير النظام إضافة وتعيين المعلمين للمجموعات التعليمية."
              />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {teachers.map((teacher) => (
                  <div
                    key={teacher.id}
                    className="bg-white rounded-2xl p-6 border border-stone-200 shadow-xs space-y-4"
                  >
                    <div className="flex items-center justify-between">
                      <div className="w-12 h-12 rounded-2xl bg-purple-100 text-purple-800 font-black flex items-center justify-center text-lg">
                        {teacher.fullName.charAt(0)}
                      </div>
                      <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold">
                        معتمد ✓
                      </span>
                    </div>

                    <div>
                      <h4 className="font-bold text-stone-900 text-base">{teacher.fullName}</h4>
                      <p className="text-xs text-stone-500">{teacher.email || 'معلم قرآن وتجويد'}</p>
                    </div>

                    <div className="pt-3 border-t border-stone-100 flex items-center justify-between text-xs text-stone-600">
                      <span>الطلاب المسندون:</span>
                      <strong className="text-stone-900">
                        {students.filter((s) => s.assignedTeacherId === teacher.id).length} طالب
                      </strong>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Students & Groups Overview */}
        {activeTab === 'students' && (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-bold text-stone-900">متابعة طلاب البرنامج</h3>
              <p className="text-xs text-stone-500">نظرة شاملة على تقدم الطلاب في مختلف الفئات العمرية</p>
            </div>

            {students.length === 0 ? (
              <EmptyState
                icon={Users}
                title="لا يوجد طلاب مسجلون حتى الآن"
                description="ستظهر هنا ملفات الأبناء فور قيام أولياء الأمور بالتسجيل."
              />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {students.map((child) => (
                  <div
                    key={child.id}
                    className="bg-white rounded-2xl p-6 border border-stone-200 shadow-xs space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <h4 className="font-bold text-stone-900 text-base">{child.fullName}</h4>
                      <span className="text-xs px-2 py-0.5 rounded-md bg-stone-100 text-stone-600 font-bold">
                        {child.age} سنة
                      </span>
                    </div>
                    <p className="text-xs text-stone-500">
                      الحالة: <strong className="text-emerald-700 font-semibold">{child.status === 'active' ? 'نشط' : 'قيد التسجيل'}</strong>
                    </p>

                    <button
                      type="button"
                      onClick={() => {
                        setRepStudentId(child.id);
                        setActiveTab('generate_report');
                      }}
                      className="w-full py-2 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-900 text-xs font-bold transition-colors cursor-pointer"
                    >
                      إصدار تقرير تربوي لهذا الطالب
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 3: Report Generator Form */}
        {activeTab === 'generate_report' && (
          <div className="bg-white rounded-2xl p-8 border border-stone-200 shadow-xs max-w-2xl mx-auto space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <div>
                <h3 className="text-lg font-bold text-stone-900">إصدار تقرير متابعة تربوي مفصل</h3>
                <p className="text-xs text-stone-500">
                  تقييم شامل لجهود الطالب في الحفظ والتدبر والمشاركة الأسرية وإرساله لولي الأمر
                </p>
              </div>
              <button
                type="button"
                onClick={() => setActiveTab('teachers')}
                className="w-8 h-8 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-500 hover:text-stone-800 flex items-center justify-center transition-colors cursor-pointer shadow-2xs"
                title="إغلاق نموذج إصدار التقرير والعودة"
                aria-label="إغلاق"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleGenerateReport} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">تحديد الطالب *</label>
                {students.length === 0 ? (
                  <p className="text-xs text-rose-600">لا يوجد طلاب مسجلون لإصدار التقرير لهم.</p>
                ) : (
                  <select
                    value={repStudentId}
                    onChange={(e) => setRepStudentId(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-stone-300 text-sm focus:ring-2 focus:ring-purple-600 outline-hidden"
                    required
                  >
                    <option value="">-- اختر الطالب --</option>
                    {students.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.fullName} ({s.age} سنة)
                      </option>
                    ))}
                  </select>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">عنوان التقرير والفترة *</label>
                <input
                  type="text"
                  value={repPeriod}
                  onChange={(e) => setRepPeriod(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-stone-300 text-sm focus:ring-2 focus:ring-purple-600 outline-hidden"
                  required
                />
              </div>

              {/* Numerical Indicators */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-stone-700 mb-1">نسبة الحضور (%)</label>
                  <input
                    type="number"
                    min={0}
                    max={100}
                    value={attendanceRate}
                    onChange={(e) => setAttendanceRate(parseInt(e.target.value) || 0)}
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs text-center font-bold"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-stone-700 mb-1">إتقان الحفظ (%)</label>
                  <input
                    type="number"
                    min={0}
                    max={100}
                    value={memorizationScore}
                    onChange={(e) => setMemorizationScore(parseInt(e.target.value) || 0)}
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs text-center font-bold"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-stone-700 mb-1">التدبر (%)</label>
                  <input
                    type="number"
                    min={0}
                    max={100}
                    value={tadabburScore}
                    onChange={(e) => setTadabburScore(parseInt(e.target.value) || 0)}
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs text-center font-bold"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-stone-700 mb-1">النشاط الأسري (%)</label>
                  <input
                    type="number"
                    min={0}
                    max={100}
                    value={familyScore}
                    onChange={(e) => setFamilyScore(parseInt(e.target.value) || 0)}
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs text-center font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  الملاحظات التربوية العامة للمشرف:
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={3}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs focus:ring-2 focus:ring-purple-600 outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  التوصيات العملية لولي الأمر والأسرة:
                </label>
                <textarea
                  value={recommendations}
                  onChange={(e) => setRecommendations(e.target.value)}
                  rows={2}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs focus:ring-2 focus:ring-purple-600 outline-hidden"
                />
              </div>

              <div className="pt-2 flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setActiveTab('teachers')}
                  className="px-4 py-3 rounded-xl border border-stone-200 text-stone-600 hover:bg-stone-50 font-bold text-sm transition-colors cursor-pointer"
                >
                  إلغاء وإغلاق
                </button>
                <button
                  type="submit"
                  disabled={students.length === 0}
                  className="flex-1 py-3 rounded-xl bg-purple-700 hover:bg-purple-800 disabled:opacity-50 text-white font-bold text-sm shadow-xs transition-colors cursor-pointer"
                >
                  اعتماد التقرير وإرساله لولي الأمر
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Tab 4: Reports Archive */}
        {activeTab === 'reports_archive' && (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-bold text-stone-900">سجل التقارير التربوية المعتمدة</h3>
              <p className="text-xs text-stone-500">كافة التقارير الصادرة لأولياء الأمور</p>
            </div>

            {reports.length === 0 ? (
              <EmptyState
                icon={FileText}
                title="لا توجد تقارير معتمدة حتى الآن"
                description="استخدم نموذج إصدار التقارير لإنشاء أول تقرير تربوي."
              />
            ) : (
              <div className="space-y-3">
                {reports.map((rep) => {
                  const student = students.find((s) => s.id === rep.studentId);
                  return (
                    <div
                      key={rep.id}
                      className="bg-white rounded-2xl p-6 border border-stone-200 shadow-xs flex flex-wrap items-center justify-between gap-4"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-stone-900 text-base">
                            {student?.fullName || 'طالب مسجل'}
                          </h4>
                          <span className="text-xs text-stone-500">• {rep.periodTitle}</span>
                        </div>
                        <p className="text-xs text-stone-400 mt-1">
                          تاريخ الاعتماد: {new Date(rep.createdAt).toLocaleDateString('ar-EG')}
                        </p>
                      </div>

                      <div className="flex items-center gap-3">
                        <span className="text-xs font-bold text-purple-900 bg-purple-50 px-3 py-1.5 rounded-lg border border-purple-200">
                          متوسط التقييم: {Math.round((rep.attendanceRate + rep.memorizationScore + rep.tadabburScore + rep.familyParticipationScore) / 4)}%
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
