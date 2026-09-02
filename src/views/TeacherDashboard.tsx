import React, { useState } from 'react';
import {
  Users,
  Calendar,
  Mic,
  CheckCircle2,
  Clock,
  Star,
  Plus,
  Video,
  FileText,
  Sparkles,
  BookOpen,
  MessageSquare,
  AlertCircle,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { EmptyState } from '../components/common/EmptyState';
import { TaskCategory } from '../types';

export const TeacherDashboard: React.FC = () => {
  const {
    activeTeacher,
    students,
    groups,
    sessions,
    audioSubmissions,
    reviewAudioSubmission,
    tasks,
    assignStudentTask,
    assessmentCriteria,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'students' | 'audios' | 'sessions' | 'assign_task'>('audios');

  // Review state
  const [selectedAudioId, setSelectedAudioId] = useState<string | null>(null);
  const [reviewScore, setReviewScore] = useState<number>(90);
  const [reviewFeedback, setReviewFeedback] = useState<string>('');

  // Assign Task Form State
  const [taskStudentId, setTaskStudentId] = useState<string>('');
  const [taskTitle, setTaskTitle] = useState<string>('تسميع سورة العلق (الآيات 1 - 5)');
  const [taskCategory, setTaskCategory] = useState<TaskCategory>('memorization');
  const [taskWeek, setTaskWeek] = useState<number>(1);
  const [taskPoints, setTaskPoints] = useState<number>(30);
  const [taskDesc, setTaskDesc] = useState<string>('تلاوة الآيات بحفظ متقن ومراعاة أحكام النون الساكنة والمدود.');

  const teacherStudents = students.filter(
    (s) => s.assignedTeacherId === activeTeacher?.id || activeTeacher === null || s.assignedTeacherId === undefined
  );

  const pendingAudios = audioSubmissions.filter((a) => a.status === 'pending_review');
  const reviewedAudios = audioSubmissions.filter((a) => a.status === 'reviewed');

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAudioId) return;

    reviewAudioSubmission(selectedAudioId, {
      score: reviewScore,
      tajweedRating: 'excellent',
      feedback: reviewFeedback.trim() || 'بارك الله فيك، تلاوة طيبة ومتقنة.',
    });

    setSelectedAudioId(null);
    setReviewFeedback('');
  };

  const handleAssignTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskStudentId && teacherStudents.length > 0) {
      alert('يرجى تحديد الطالب');
      return;
    }

    assignStudentTask({
      studentId: taskStudentId || (teacherStudents[0]?.id ?? 's-1'),
      programId: 'moayasha-3months',
      title: taskTitle.trim(),
      description: taskDesc.trim(),
      category: taskCategory,
      weekNumber: taskWeek,
      points: taskPoints,
      status: 'not_started',
    });

    alert('تم إسناد المهمة بنجاح وإشعار الطالب وولي الأمر');
    setActiveTab('students');
  };

  return (
    <div className="min-h-screen bg-stone-50 text-stone-900 pb-16">
      {/* Teacher Top Header */}
      <div className="bg-white border-b border-stone-200 py-6 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-teal-800 bg-teal-50 px-2.5 py-0.5 rounded-md">
                لوحة المعلم والمحفظ
              </span>
              <h1 className="text-xl sm:text-2xl font-black text-stone-900">
                {activeTeacher ? `مرحباً أستاذ / ${activeTeacher.fullName}` : 'لوحة معلم التحفيظ والتجويد'}
              </h1>
            </div>
            <p className="text-xs text-stone-500 mt-1">
              إدارة التسميع الصوتي، متابعة الحفظ، وتسجيل درجات الطلاب وملاحظات التجويد
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setActiveTab('assign_task')}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-teal-700 hover:bg-teal-800 text-white text-xs font-bold shadow-xs transition-colors cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>إسناد مهمة جديدة للطلاب</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 border-b border-stone-200 mb-8 overflow-x-auto pb-2">
          {[
            { id: 'audios', label: `سجل التسميع الصوتي (${pendingAudios.length})`, icon: Mic },
            { id: 'students', label: `طلابي (${teacherStudents.length})`, icon: Users },
            { id: 'sessions', label: 'حلقاتي المباشرة', icon: Calendar },
            { id: 'assign_task', label: 'إسناد وتكليف مهام', icon: BookOpen },
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
                    ? 'bg-teal-700 text-white shadow-xs'
                    : 'bg-white border border-stone-200 text-stone-600 hover:bg-stone-100'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab 1: Audio Submissions Review Area */}
        {activeTab === 'audios' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-stone-900">تسجيلات التسميع الصوتي في انتظار المراجعة</h3>
                <p className="text-xs text-stone-500">الاستماع لتلاوة الطالب وإعطاء التقييم والملاحظات الصوتية / النصية</p>
              </div>
            </div>

            {audioSubmissions.length === 0 ? (
              <EmptyState
                icon={Mic}
                title="لا توجد تسجيلات تسميع صوتية حتى الآن"
                description="عندما يقوم الطلاب برفع تلاواتهم ستظهر هنا مباشرة للتقييم والتوجيه."
              />
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* List of Submissions */}
                <div className="lg:col-span-7 space-y-3">
                  {audioSubmissions.map((aud) => {
                    const student = students.find((s) => s.id === aud.studentId);
                    const isSelected = selectedAudioId === aud.id;
                    return (
                      <div
                        key={aud.id}
                        onClick={() => {
                          setSelectedAudioId(aud.id);
                          setReviewScore(aud.score || 90);
                          setReviewFeedback(aud.teacherFeedback || '');
                        }}
                        className={`p-5 rounded-2xl border transition-all cursor-pointer ${
                          isSelected
                            ? 'border-teal-600 bg-teal-50/70 shadow-xs'
                            : 'border-stone-200 bg-white hover:border-teal-300'
                        }`}
                      >
                        <div className="flex items-start justify-between">
                          <div>
                            <div className="flex items-center gap-2">
                              <h4 className="font-bold text-stone-900 text-sm">
                                {student?.fullName || 'طالب مسجل'}
                              </h4>
                              <span className="text-xs text-stone-500 font-semibold">
                                • {aud.surahName} ({aud.versesRange})
                              </span>
                            </div>
                            <p className="text-[11px] text-stone-400 mt-1">
                              تاريخ الإرسال: {new Date(aud.submittedAt).toLocaleDateString('ar-EG')} • المدة: {aud.audioDurationSeconds} ثانية
                            </p>
                          </div>

                          <span
                            className={`px-2.5 py-1 rounded-md text-xs font-bold ${
                              aud.status === 'reviewed'
                                ? 'bg-emerald-100 text-emerald-800'
                                : 'bg-amber-100 text-amber-900 animate-pulse'
                            }`}
                          >
                            {aud.status === 'reviewed' ? `تم التقييم (${aud.score})` : 'في الانتظار'}
                          </span>
                        </div>

                        {/* Audio Player preview */}
                        <div className="mt-3 pt-3 border-t border-stone-100 flex items-center justify-between text-xs text-teal-800 font-medium">
                          <span>🎧 الملف الصوتي جاهز للاستماع والتقييم</span>
                          <span className="underline">انقر للتقييم ←</span>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Review Form Box */}
                <div className="lg:col-span-5">
                  {selectedAudioId ? (
                    <div className="bg-white rounded-2xl p-6 border border-teal-300 shadow-sm sticky top-24 space-y-4">
                      <h4 className="font-bold text-stone-900 text-base pb-2 border-b border-stone-100">
                        نموذج تقييم التسميع والتجويد
                      </h4>

                      <form onSubmit={handleReviewSubmit} className="space-y-4">
                        <div>
                          <label className="block text-xs font-bold text-stone-700 mb-1">
                            الدرجة الكلية (من 100):
                          </label>
                          <input
                            type="number"
                            min={0}
                            max={100}
                            value={reviewScore}
                            onChange={(e) => setReviewScore(parseInt(e.target.value) || 0)}
                            className="w-full px-3.5 py-2 rounded-xl border border-stone-300 text-sm font-bold text-teal-900 focus:ring-2 focus:ring-teal-600 outline-hidden"
                            required
                          />
                        </div>

                        <div className="p-3 bg-stone-50 rounded-xl space-y-2 text-xs">
                          <span className="font-bold text-stone-700 block">معايير التقييم:</span>
                          {assessmentCriteria.slice(0, 3).map((c) => (
                            <div key={c.id} className="flex justify-between text-stone-600">
                              <span>{c.title}</span>
                              <span className="font-bold text-stone-900">الدرجة القصوى: {c.maxScore}</span>
                            </div>
                          ))}
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-stone-700 mb-1">
                            ملاحظات المحفظ وتوجيهات التجويد للطالب:
                          </label>
                          <textarea
                            value={reviewFeedback}
                            onChange={(e) => setReviewFeedback(e.target.value)}
                            placeholder="ما شاء الله تلاوة ممتازة، انتبه لغنة الإخفاء في قوله تعالى..."
                            className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs focus:ring-2 focus:ring-teal-600 outline-hidden"
                            rows={3}
                          />
                        </div>

                        <div className="flex items-center gap-2 pt-2">
                          <button
                            type="button"
                            onClick={() => setSelectedAudioId(null)}
                            className="px-3 py-2 rounded-xl border border-stone-200 text-stone-600 text-xs font-medium cursor-pointer"
                          >
                            إلغاء
                          </button>
                          <button
                            type="submit"
                            className="flex-1 py-2 rounded-xl bg-teal-700 hover:bg-teal-800 text-white font-bold text-xs shadow-xs transition-colors cursor-pointer"
                          >
                            حفظ واعتماد التقييم
                          </button>
                        </div>
                      </form>
                    </div>
                  ) : (
                    <div className="bg-stone-50 rounded-2xl p-8 border border-stone-200 text-center text-xs text-stone-500">
                      حدد تسجيلاً صوتياً من القائمة للبدء في الاستماع والتقييم.
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Students List */}
        {activeTab === 'students' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-stone-900">الطلاب المسندون لمتابعتك</h3>
                <p className="text-xs text-stone-500">قائمة الطلاب وتفاصيل حفظهم وحضورهم</p>
              </div>
            </div>

            {teacherStudents.length === 0 ? (
              <EmptyState
                icon={Users}
                title="لا يوجد طلاب مسندون حتى الآن"
                description="سيتم إسناد الطلاب لمجموعتك فور تسجيلهم من قبل المشرف التربوي."
              />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {teacherStudents.map((child) => (
                  <div
                    key={child.id}
                    className="bg-white rounded-2xl p-6 border border-stone-200 shadow-xs flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <div className="w-10 h-10 rounded-xl bg-teal-100 text-teal-800 font-black flex items-center justify-center text-sm">
                          {child.fullName.charAt(0)}
                        </div>
                        <span className="text-[11px] px-2 py-0.5 rounded-md bg-stone-100 text-stone-600 font-bold">
                          {child.age} سنوات
                        </span>
                      </div>
                      <h4 className="font-bold text-stone-900 text-base mb-1">{child.fullName}</h4>
                      <p className="text-xs text-stone-500">الخطة: سورة العلق (حفظ وتدبر)</p>
                    </div>

                    <div className="mt-6 pt-4 border-t border-stone-100 flex items-center justify-between">
                      <button
                        type="button"
                        onClick={() => {
                          setTaskStudentId(child.id);
                          setActiveTab('assign_task');
                        }}
                        className="px-3 py-1.5 rounded-lg bg-teal-50 text-teal-800 hover:bg-teal-100 text-xs font-bold transition-colors cursor-pointer"
                      >
                        إسناد مهمة
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 3: Sessions */}
        {activeTab === 'sessions' && (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-bold text-stone-900">جدول الحلقات المباشرة</h3>
              <p className="text-xs text-stone-500">مواعيد جلسات التحفيظ والتجويد المقررة</p>
            </div>

            {sessions.length === 0 ? (
              <EmptyState
                icon={Calendar}
                title="لا توجد جلسات مجدولة حالياً"
                description="سيتم إدراج الجلسات فور اعتماد التقويم الأسبوعي."
              />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {sessions.map((ses) => (
                  <div
                    key={ses.id}
                    className="bg-white rounded-2xl p-6 border border-stone-200 shadow-xs flex flex-col justify-between"
                  >
                    <div>
                      <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-teal-50 text-teal-800">
                        حلقة تحفيظ
                      </span>
                      <h4 className="font-bold text-base text-stone-900 mt-2 mb-1">{ses.title}</h4>
                      <p className="text-xs text-stone-500">
                        {ses.date} • {ses.time} ({ses.durationMinutes} دقيقة)
                      </p>
                    </div>

                    <div className="mt-6 pt-4 border-t border-stone-100">
                      <a
                        href={ses.meetingLink || '#'}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-teal-700 hover:bg-teal-800 text-white text-xs font-bold transition-colors"
                      >
                        <Video className="w-4 h-4" />
                        <span>دخول الغرفة (المحفظ)</span>
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 4: Assign Task Form */}
        {activeTab === 'assign_task' && (
          <div className="bg-white rounded-2xl p-8 border border-stone-200 shadow-xs max-w-2xl mx-auto space-y-6">
            <div>
              <h3 className="text-lg font-bold text-stone-900">إسناد وتكليف مهمة أسبوعية للطالب</h3>
              <p className="text-xs text-stone-500">
                إضافة تكليف بالحفظ أو المراجعة أو التدبر يظهر فوراً في لوحة الطالب وولي الأمر
              </p>
            </div>

            <form onSubmit={handleAssignTask} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">تحديد الطالب *</label>
                {teacherStudents.length === 0 ? (
                  <p className="text-xs text-rose-600">لا يوجد طلاب مسجلون لإسناد المهمة إليهم.</p>
                ) : (
                  <select
                    value={taskStudentId}
                    onChange={(e) => setTaskStudentId(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-stone-300 text-sm focus:ring-2 focus:ring-teal-600 outline-hidden"
                    required
                  >
                    <option value="">-- اختر الطالب --</option>
                    {teacherStudents.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.fullName} ({s.age} سنة)
                      </option>
                    ))}
                  </select>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">عنوان المهمة *</label>
                <input
                  type="text"
                  value={taskTitle}
                  onChange={(e) => setTaskTitle(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-stone-300 text-sm focus:ring-2 focus:ring-teal-600 outline-hidden"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">نوع المهمة</label>
                  <select
                    value={taskCategory}
                    onChange={(e) => setTaskCategory(e.target.value as any)}
                    className="w-full px-3.5 py-2 rounded-xl border border-stone-300 text-sm focus:ring-2 focus:ring-teal-600 outline-hidden"
                  >
                    <option value="memorization">حفظ جديد</option>
                    <option value="review">مراجعة وتثبيت</option>
                    <option value="tadabbur">تدبر وتفكر</option>
                    <option value="family_activity">نشاط أسري</option>
                    <option value="challenge">تحدي أسبوعي</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">الأسبوع</label>
                  <input
                    type="number"
                    min={1}
                    max={12}
                    value={taskWeek}
                    onChange={(e) => setTaskWeek(parseInt(e.target.value) || 1)}
                    className="w-full px-3.5 py-2 rounded-xl border border-stone-300 text-sm focus:ring-2 focus:ring-teal-600 outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">نقاط الإنجاز المكافئة</label>
                <input
                  type="number"
                  min={5}
                  max={100}
                  value={taskPoints}
                  onChange={(e) => setTaskPoints(parseInt(e.target.value) || 30)}
                  className="w-full px-3.5 py-2 rounded-xl border border-stone-300 text-sm focus:ring-2 focus:ring-teal-600 outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">تفاصيل وتعليمات المهمة</label>
                <textarea
                  value={taskDesc}
                  onChange={(e) => setTaskDesc(e.target.value)}
                  rows={3}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs focus:ring-2 focus:ring-teal-600 outline-hidden"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={teacherStudents.length === 0}
                  className="w-full py-3 rounded-xl bg-teal-700 hover:bg-teal-800 disabled:opacity-50 text-white font-bold text-sm shadow-xs transition-colors cursor-pointer"
                >
                  إسناد المهمة وإرسال الإشعار
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

interface TeacherDashboardProps {}
