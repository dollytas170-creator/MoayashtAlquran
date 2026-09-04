import React, { useState } from 'react';
import {
  TreeDeciduous,
  BookOpen,
  Mic,
  Heart,
  Sparkles,
  Award,
  Calendar,
  CheckCircle2,
  Clock,
  Video,
  Play,
  RotateCcw,
  ArrowRight,
  Flame,
  Star,
  ChevronLeft,
  Lock,
  Plus,
  X,
  Home,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { EmptyState } from '../components/common/EmptyState';
import { AudioRecorderModal } from '../components/common/AudioRecorderModal';

interface StudentDashboardProps {
  onBackToParent?: () => void;
  onOpenAddChild?: () => void;
}

export const StudentDashboard: React.FC<StudentDashboardProps> = ({
  onBackToParent,
  onOpenAddChild,
}) => {
  const {
    activeStudent,
    students,
    setActiveStudentId,
    tasks,
    submitTaskCompletion,
    audioSubmissions,
    sessions,
    familyActivities,
    badges,
    setCurrentRole,
  } = useApp();

  const [activeTab, setActiveTab] = useState<
    'journey' | 'tasks' | 'memorization' | 'tadabbur' | 'family' | 'sessions' | 'achievements'
  >('journey');

  const [isAudioModalOpen, setIsAudioModalOpen] = useState(false);
  const [selectedSurahForAudio, setSelectedSurahForAudio] = useState('سورة العلق');
  const [selectedVersesForAudio, setSelectedVersesForAudio] = useState('الآيات 1 - 5');

  // Age group theme determination
  const age = activeStudent?.age || 8;
  const ageTheme = age <= 9 ? 'playful' : age <= 12 ? 'balanced' : 'mature';

  // Filter student-specific items
  const studentTasks = activeStudent ? tasks.filter((t) => t.studentId === activeStudent.id) : [];
  const studentAudios = activeStudent
    ? audioSubmissions.filter((a) => a.studentId === activeStudent.id)
    : [];
  const studentActivities = activeStudent
    ? familyActivities.filter((a) => a.studentId === activeStudent.id)
    : [];

  // Gamification score computation
  const completedTasksCount = studentTasks.filter((t) => t.status === 'completed').length;
  const totalScore = completedTasksCount * 40 + studentAudios.length * 50;

  const currentJourneyStageIndex = 2; // e.g. at "يتدبر" stage

  const journeyStages = [
    { title: 'يحفظ', desc: 'تلاوة سليمة وحفظ متقن', status: 'completed' },
    { title: 'يفهم', desc: 'إدراك معاني الكلمات', status: 'completed' },
    { title: 'يتدبر', desc: 'استخراج رسائل الآيات', status: 'current' },
    { title: 'يطبق', desc: 'تحويل الآية إلى سلوك', status: 'upcoming' },
    { title: 'يعيش', desc: 'القرآن منهج حياة', status: 'upcoming' },
  ];

  const handleOpenRecorder = (surah: string = 'سورة العلق', verses: string = 'الآيات 1 - 5') => {
    setSelectedSurahForAudio(surah);
    setSelectedVersesForAudio(verses);
    setIsAudioModalOpen(true);
  };

  return (
    <div className={`min-h-screen pb-20 ${
      ageTheme === 'playful'
        ? 'bg-emerald-50/40 text-stone-900'
        : ageTheme === 'balanced'
        ? 'bg-stone-50 text-stone-900'
        : 'bg-stone-100/70 text-stone-900'
    }`}>
      {/* Learner Header Bar */}
      <div className={`border-b ${
        ageTheme === 'playful'
          ? 'bg-white border-emerald-200 py-6'
          : ageTheme === 'balanced'
          ? 'bg-white border-stone-200 py-5'
          : 'bg-white border-stone-200 py-5'
      } px-4 sm:px-6 lg:px-8`}>
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black ${
              ageTheme === 'playful'
                ? 'bg-emerald-600 text-white shadow-md ring-4 ring-emerald-100'
                : ageTheme === 'balanced'
                ? 'bg-teal-700 text-white'
                : 'bg-stone-800 text-white'
            }`}>
              <TreeDeciduous className="w-6 h-6 text-emerald-200" />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-black text-stone-900">
                  {activeStudent ? `رحلتي مع القرآن — ${activeStudent.fullName}` : 'رحلتي مع القرآن'}
                </h1>
                <span className={`text-xs px-2.5 py-0.5 rounded-full font-bold ${
                  ageTheme === 'playful'
                    ? 'bg-emerald-100 text-emerald-800'
                    : ageTheme === 'balanced'
                    ? 'bg-teal-100 text-teal-800'
                    : 'bg-stone-100 text-stone-700'
                }`}>
                  الفئة: {age <= 9 ? '6-9 سنوات' : age <= 12 ? '10-12 سنة' : '13-15 سنة'}
                </span>
              </div>
              <p className="text-xs text-stone-500 mt-0.5 font-medium">
                «يحفظ ← يفهم ← يتدبر ← يطبق ← يعيش مع القرآن»
              </p>
            </div>
          </div>

          {/* Gamification Points Capsule */}
          <div className="flex items-center gap-3">
            <div className="bg-amber-50 border border-amber-200 px-4 py-2 rounded-2xl flex items-center gap-2 shadow-2xs">
              <Sparkles className="w-5 h-5 text-amber-600" />
              <div>
                <span className="text-[10px] text-amber-800 font-bold block">نقاط شجرة المعايشة</span>
                <span className="text-sm font-black text-amber-950">{totalScore} نقطة</span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setCurrentRole('public')}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white border border-stone-200 hover:bg-emerald-50 hover:text-emerald-800 text-stone-700 text-xs font-bold transition-colors cursor-pointer shadow-2xs"
              title="العودة إلى الواجهة الرئيسية للمنصة"
            >
              <Home className="w-4 h-4 text-emerald-700" />
              <span>الواجهة الرئيسية</span>
            </button>

            {onBackToParent && (
              <button
                type="button"
                onClick={onBackToParent}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-bold transition-colors cursor-pointer shadow-2xs"
                title="إغلاق بوابة الطالب والعودة للوحة ولي الأمر"
                aria-label="إغلاق بوابة الطالب"
              >
                <X className="w-4 h-4 text-stone-500" />
                <span>إغلاق والعودة لولي الأمر</span>
              </button>
            )}
          </div>
        </div>

        {/* Student Switcher if multiple children exist */}
        {students.length > 1 && (
          <div className="max-w-7xl mx-auto mt-4 pt-3 border-t border-stone-100 flex items-center gap-2">
            <span className="text-xs text-stone-400 font-semibold">تبديل حساب الطالب:</span>
            {students.map((s) => (
              <button
                key={s.id}
                type="button"
                onClick={() => setActiveStudentId(s.id)}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                  activeStudent?.id === s.id
                    ? 'bg-emerald-700 text-white'
                    : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                }`}
              >
                {s.fullName} ({s.age} سنة)
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        {/* Navigation Tabs */}
        <div className="flex flex-wrap items-center justify-between border-b border-stone-200 mb-6 pb-2 gap-4">
          <div className="flex items-center gap-1 sm:gap-2 overflow-x-auto pb-1">
            {[
              { id: 'journey', label: 'رحلتي وشجرة المعايشة', icon: TreeDeciduous },
              { id: 'tasks', label: 'مهامي الأسبوعية', icon: BookOpen },
              { id: 'memorization', label: 'الحفظ والتسميع الصوتي', icon: Mic },
              { id: 'tadabbur', label: 'التدبر والخواطر', icon: Heart },
              { id: 'family', label: 'أنشطتي مع الأسرة', icon: Heart },
              { id: 'sessions', label: 'جلستي القادمة', icon: Calendar },
              { id: 'achievements', label: 'أوسمتي وإنجازاتي', icon: Award },
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
                      : 'bg-white border border-stone-200 text-stone-700 hover:bg-stone-100'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                  {isActive && activeTab !== 'journey' && (
                    <span
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveTab('journey');
                      }}
                      title="إغلاق التبويب والعودة لخريطة الرحلة"
                      className="mr-1 p-0.5 rounded-full hover:bg-emerald-800 text-emerald-100 cursor-pointer"
                    >
                      <X className="w-3.5 h-3.5" />
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {activeTab !== 'journey' && (
            <button
              type="button"
              onClick={() => setActiveTab('journey')}
              className="shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-stone-300 bg-white hover:bg-stone-50 text-stone-700 text-xs font-bold transition-colors cursor-pointer shadow-2xs"
              title="إغلاق التبويب الحالي والعودة لخريطة الرحلة"
            >
              <X className="w-3.5 h-3.5 text-stone-500" />
              <span>إغلاق التبويب</span>
            </button>
          )}
        </div>

        {/* Tab 1: Journey & Interactive Tree */}
        {activeTab === 'journey' && (
          <div className="space-y-6">
            {/* Core Journey Progression Bar */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-xs">
              <div className="text-center max-w-2xl mx-auto mb-8">
                <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full">
                  السورة الحالية: سورة العلق (الشهر الأول)
                </span>
                <h3 className="text-xl sm:text-2xl font-black text-stone-900 mt-2">
                  مسار المعايشة القرآنية
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 relative">
                {journeyStages.map((st, i) => (
                  <div
                    key={st.title}
                    className={`p-4 rounded-2xl border text-center transition-all flex flex-col items-center justify-between ${
                      st.status === 'completed'
                        ? 'bg-emerald-50 border-emerald-300 text-emerald-950'
                        : st.status === 'current'
                        ? 'bg-amber-50 border-amber-400 text-amber-950 ring-2 ring-amber-400/50'
                        : 'bg-stone-50 border-stone-200 text-stone-400 opacity-70'
                    }`}
                  >
                    <div className="mb-2">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center mx-auto text-xs font-bold ${
                        st.status === 'completed'
                          ? 'bg-emerald-700 text-white'
                          : st.status === 'current'
                          ? 'bg-amber-600 text-white animate-pulse'
                          : 'bg-stone-300 text-stone-600'
                      }`}>
                        {st.status === 'completed' ? '✓' : i + 1}
                      </div>
                      <h4 className="font-bold text-sm mt-1.5">{st.title}</h4>
                    </div>
                    <p className="text-[11px] leading-tight">{st.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Tree of Living with Quran (Gamified Concept) */}
            <div className="bg-white rounded-3xl p-6 sm:p-10 border border-stone-200 shadow-xs text-center space-y-6">
              <div className="max-w-xl mx-auto">
                <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto mb-3 shadow-inner">
                  <TreeDeciduous className="w-9 h-9" />
                </div>
                <h3 className="text-2xl font-black text-stone-900">شجرة المعايشة الخاصة بك</h3>
                <p className="text-xs sm:text-sm text-stone-500 mt-1">
                  كل مهمة تنجزها وتسميع ترفعه وتطبيق أسري تؤديه، يجعل شجرتك تكبر وتورق وتثمر!
                </p>
              </div>

              {/* Visual Tree Growth Canvas */}
              <div className="p-8 rounded-2xl bg-gradient-to-b from-emerald-50/70 to-emerald-100/50 border border-emerald-200 max-w-2xl mx-auto flex flex-col items-center justify-center">
                <div className="relative">
                  <TreeDeciduous className="w-32 h-32 sm:w-40 sm:h-40 text-emerald-700 animate-pulse" />
                  <div className="absolute top-2 right-2 bg-amber-400 text-amber-950 text-[10px] font-black px-2 py-0.5 rounded-full shadow-xs">
                    مرحلة: الغرسة النامية 🌱
                  </div>
                </div>

                <div className="w-full max-w-md mt-6 space-y-2">
                  <div className="flex justify-between text-xs font-bold text-stone-700">
                    <span>مستوى نمو الشجرة</span>
                    <span>{Math.min(100, Math.round((totalScore / 500) * 100))}%</span>
                  </div>
                  <div className="h-3 w-full bg-emerald-200/70 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-emerald-700 rounded-full transition-all duration-500"
                      style={{ width: `${Math.min(100, (totalScore / 500) * 100)}%` }}
                    />
                  </div>
                  <p className="text-[11px] text-stone-500">
                    متبقي {Math.max(0, 500 - totalScore)} نقطة للوصول إلى مرتبة «الشجرة المثمرة»
                  </p>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => handleOpenRecorder('سورة العلق', 'الآيات 1 - 5')}
                  className="px-6 py-3 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold shadow-xs transition-colors cursor-pointer flex items-center gap-2"
                >
                  <Mic className="w-4 h-4" />
                  <span>تسجيل تسميع سورة العلق</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('tasks')}
                  className="px-6 py-3 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-bold transition-colors cursor-pointer"
                >
                  عرض مهام الأسبوع
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Weekly Tasks */}
        {activeTab === 'tasks' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-stone-900">مهامي الأسبوعية</h3>
                <p className="text-xs text-stone-500">جدول الحفظ والمراجعة والتدبر والتطبيقات</p>
              </div>
              <button
                type="button"
                onClick={() => handleOpenRecorder()}
                className="px-4 py-2 rounded-xl bg-emerald-700 text-white text-xs font-bold cursor-pointer flex items-center gap-1.5"
              >
                <Mic className="w-4 h-4" />
                <span>تسميع صوتي</span>
              </button>
            </div>

            {studentTasks.length === 0 ? (
              <EmptyState
                icon={BookOpen}
                title="لا توجد مهام مسندة حالياً"
                description="سيقوم المحفظ والمشرف بإسناد مهام الأسبوع الجديد فور موعد الجلسة."
              />
            ) : (
              <div className="space-y-3">
                {studentTasks.map((t) => {
                  const isDone = t.status === 'completed';
                  return (
                    <div
                      key={t.id}
                      className={`p-5 rounded-2xl border transition-all flex flex-wrap items-center justify-between gap-4 ${
                        isDone
                          ? 'bg-emerald-50/50 border-emerald-200'
                          : 'bg-white border-stone-200 hover:border-emerald-300'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <button
                          type="button"
                          onClick={() => submitTaskCompletion(t.id)}
                          className={`w-6 h-6 rounded-lg border flex items-center justify-center cursor-pointer transition-colors mt-0.5 ${
                            isDone
                              ? 'bg-emerald-700 border-emerald-700 text-white'
                              : 'border-stone-300 hover:border-emerald-600 bg-white'
                          }`}
                        >
                          {isDone && <CheckCircle2 className="w-4 h-4" />}
                        </button>
                        <div>
                          <div className="flex items-center gap-2">
                            <h4
                              className={`text-sm font-bold ${
                                isDone ? 'line-through text-stone-400' : 'text-stone-900'
                              }`}
                            >
                              {t.title}
                            </h4>
                            <span className="text-[10px] px-2 py-0.5 rounded-md bg-stone-100 text-stone-600 font-semibold">
                              الأسبوع {t.weekNumber}
                            </span>
                          </div>
                          {t.description && (
                            <p className="text-xs text-stone-500 mt-1">{t.description}</p>
                          )}
                          {t.teacherFeedback && (
                            <p className="text-xs text-emerald-800 bg-emerald-100/60 p-2 rounded-lg mt-2 font-medium">
                              ملاحظة المحفظ: {t.teacherFeedback}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <span className="text-xs font-bold text-amber-800 bg-amber-50 px-2.5 py-1 rounded-md">
                          +{t.points} نقطة
                        </span>
                        {!isDone && (
                          <button
                            type="button"
                            onClick={() => submitTaskCompletion(t.id)}
                            className="px-3.5 py-1.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold cursor-pointer"
                          >
                            تحديد كمكتمل
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Tab 3: Memorization & Audio Submissions */}
        {activeTab === 'memorization' && (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-xs flex flex-wrap items-center justify-between gap-4">
              <div>
                <h3 className="text-lg font-bold text-stone-900">منطقة التسميع الصوتي المباشر</h3>
                <p className="text-xs text-stone-500 mt-1">
                  سجل صوتك بآيات سورة العلق واستمع له قبل الإرسال للمحفظ للتقييم والتجويد
                </p>
              </div>

              <button
                type="button"
                onClick={() => handleOpenRecorder('سورة العلق', 'الآيات 1 - 5')}
                className="px-6 py-3 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold shadow-xs transition-colors cursor-pointer flex items-center gap-2"
              >
                <Mic className="w-4 h-4" />
                <span>تسجيل / رفع التسميع الآن</span>
              </button>
            </div>

            {studentAudios.length === 0 ? (
              <EmptyState
                icon={Mic}
                title="لا توجد تسجيلات تسميع مرفوعة حتى الآن"
                description="اضغط على زر التسجيل بالأعلى لتسجيل تلاوتك بصوتك وإرسالها للمحفظ."
                actionText="تسجيل التسميع الآن"
                onAction={() => handleOpenRecorder()}
              />
            ) : (
              <div className="space-y-3">
                {studentAudios.map((aud) => (
                  <div
                    key={aud.id}
                    className="bg-white rounded-2xl p-5 border border-stone-200 shadow-xs flex flex-wrap items-center justify-between gap-4"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-stone-900 text-sm">{aud.surahName}</span>
                        <span className="text-xs text-stone-500">({aud.versesRange})</span>
                      </div>
                      <p className="text-[11px] text-stone-400 mt-1">
                        تاريخ التسجيل: {new Date(aud.submittedAt).toLocaleDateString('ar-EG')} • المدة: {aud.audioDurationSeconds} ثانية
                      </p>
                    </div>

                    <div className="flex items-center gap-3">
                      {aud.status === 'reviewed' ? (
                        <div className="text-left">
                          <span className="px-3 py-1 rounded-md bg-emerald-100 text-emerald-800 text-xs font-bold block mb-1">
                            تقييم المحفظ: {aud.score} / 100 ✓
                          </span>
                          {aud.teacherFeedback && (
                            <p className="text-xs text-stone-600 bg-stone-50 p-2 rounded-lg border border-stone-200">
                              {aud.teacherFeedback}
                            </p>
                          )}
                        </div>
                      ) : (
                        <span className="px-3 py-1 rounded-md bg-amber-100 text-amber-900 text-xs font-bold">
                          في انتظار مراجعة المحفظ ⏳
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 4: Tadabbur & Reflections */}
        {activeTab === 'tadabbur' && (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-xs">
              <h3 className="text-lg font-bold text-stone-900 mb-2">خواطري وتأملاتي مع الآيات</h3>
              <p className="text-xs text-stone-500 mb-4">
                ما الذي تعلمته من سورة العلق اليوم؟ كيف تشعر عندما تقرأ «اقرأ باسم ربك الذي خلق»؟
              </p>

              <div className="p-4 rounded-xl bg-emerald-50/70 border border-emerald-200 text-xs text-stone-700 leading-relaxed space-y-2">
                <span className="font-bold text-emerald-950 block">💡 سؤال الأسبوع التدبري:</span>
                <p>
                  الله سبحانه علمنا بالقلم وما لم نكن نعلم.. اذكر نعمة واحدة من نعم العلم تشكر الله عليها اليوم.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Tab 5: Family Activities */}
        {activeTab === 'family' && (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-xs">
              <h3 className="text-lg font-bold text-stone-900 mb-1">أنشطتي مع أسرتي («مع الأسرة»)</h3>
              <p className="text-xs text-stone-500">
                نفذ هذه الأنشطة مع والديك وإخوانك لتربح وسام «عشت الآية»
              </p>
            </div>

            {studentActivities.length === 0 ? (
              <EmptyState
                icon={Heart}
                title="لا توجد أنشطة أسرية حالياً"
                description="سيتم إدراج الأنشطة الأسرية الأسبوعية بالتعاون مع المشرف التربوي وولي الأمر."
              />
            ) : (
              <div className="space-y-3">
                {studentActivities.map((act) => (
                  <div
                    key={act.id}
                    className="bg-white rounded-2xl p-6 border border-stone-200 shadow-xs space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <h4 className="font-bold text-stone-900 text-sm">{act.title}</h4>
                      <span
                        className={`text-xs font-bold px-2.5 py-1 rounded-md ${
                          act.completed
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-stone-100 text-stone-600'
                        }`}
                      >
                        {act.completed ? 'تم التنفيذ مع الأسرة ✓' : 'مهمة قادمة'}
                      </span>
                    </div>
                    <p className="text-xs text-stone-600">{act.instructions}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 6: Next Session */}
        {activeTab === 'sessions' && (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-xs">
              <h3 className="text-lg font-bold text-stone-900 mb-1">جلساتي المباشرة القادمة</h3>
              <p className="text-xs text-stone-500">مواعيد جلسات التدبر وحلقات التحفيظ عبر الإنترنت</p>
            </div>

            {sessions.length === 0 ? (
              <EmptyState
                icon={Calendar}
                title="لا توجد جلسات مجدولة حتى الآن"
                description="سيرسل لك المحفظ والكوتش رابط الجلسة المباشرة قبل موعدها."
              />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {sessions.map((ses) => (
                  <div
                    key={ses.id}
                    className="bg-white rounded-2xl p-6 border border-stone-200 shadow-xs flex flex-col justify-between"
                  >
                    <div>
                      <span
                        className={`text-[11px] font-bold px-2 py-0.5 rounded-md ${
                          ses.sessionType === 'tadabbur'
                            ? 'bg-purple-50 text-purple-800'
                            : 'bg-emerald-50 text-emerald-800'
                        }`}
                      >
                        {ses.sessionType === 'tadabbur' ? 'جلسة تدبر' : 'حلقة تسميع وتجويد'}
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
                        className="w-full py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold transition-colors flex items-center justify-center gap-2"
                      >
                        <Video className="w-4 h-4" />
                        <span>دخول الجلسة الآن</span>
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 7: Achievements & Badges */}
        {activeTab === 'achievements' && (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-xs">
              <h3 className="text-lg font-bold text-stone-900 mb-1">أوسمة شجرة المعايشة وإنجازاتي</h3>
              <p className="text-xs text-stone-500">
                إنجازاتك الشخصية لتقدير جهدك والتزامك (دون منافسة أو مقارنة مع الآخرين)
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {badges.map((b) => {
                const isEarned = totalScore >= b.requiredPoints;
                return (
                  <div
                    key={b.id}
                    className={`p-6 rounded-2xl border text-center transition-all ${
                      isEarned
                        ? 'bg-white border-emerald-300 shadow-xs'
                        : 'bg-stone-50 border-stone-200 opacity-60'
                    }`}
                  >
                    <div
                      className={`w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-3 ${
                        isEarned
                          ? 'bg-emerald-100 text-emerald-800 ring-4 ring-emerald-50'
                          : 'bg-stone-200 text-stone-400'
                      }`}
                    >
                      <Award className="w-7 h-7" />
                    </div>
                    <h4 className="font-bold text-base text-stone-900 mb-1">{b.title}</h4>
                    <p className="text-xs text-stone-500 leading-relaxed mb-3">{b.description}</p>
                    <span
                      className={`text-[11px] px-2.5 py-0.5 rounded-full font-bold ${
                        isEarned ? 'bg-emerald-100 text-emerald-800' : 'bg-stone-200 text-stone-600'
                      }`}
                    >
                      {isEarned ? 'تم الحصول عليه ✓' : `مطلوب ${b.requiredPoints} نقطة`}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Audio Recorder Dialog */}
      <AudioRecorderModal
        isOpen={isAudioModalOpen}
        onClose={() => setIsAudioModalOpen(false)}
        defaultSurahName={selectedSurahForAudio}
        defaultVerses={selectedVersesForAudio}
      />
    </div>
  );
};
