import React, { useState } from 'react';
import {
  Settings,
  Users,
  GraduationCap,
  ShieldCheck,
  CreditCard,
  Calendar,
  BookOpen,
  Plus,
  DollarSign,
  TrendingUp,
  Tag,
  CheckCircle2,
  Trash2,
  Edit,
  Video,
  Award,
  Layers,
  Sparkles,
  X,
  Clock,
  UserCheck,
  Check,
  ArrowRight,
  Home,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { SessionType } from '../types';

export const AdminDashboard: React.FC = () => {
  const {
    parents,
    students,
    teachers,
    supervisors,
    programs,
    groups,
    sessions,
    payments,
    pricing,
    updatePricing,
    addCoupon,
    addTeacher,
    addSupervisor,
    addGroup,
    addSession,
    ageGroups,
    surahs,
    activateChildByAdmin,
    setCurrentRole,
    goBack,
    goHome,
    previousScreenTitle,
  } = useApp();

  const [activeTab, setActiveTab] = useState<
    'overview' | 'curriculum' | 'staff' | 'groups' | 'pricing' | 'sessions'
  >('overview');

  // Teacher Form State
  const [teacherName, setTeacherName] = useState('');
  const [teacherEmail, setTeacherEmail] = useState('');
  const [teacherPhone, setTeacherPhone] = useState('');

  // Supervisor Form State
  const [supervisorName, setSupervisorName] = useState('');
  const [supervisorEmail, setSupervisorEmail] = useState('');

  // Group Form State
  const [groupName, setGroupName] = useState('مجموعة أشبال القرآن (6 - 9 سنوات)');
  const [groupAgeId, setGroupAgeId] = useState('ag-6-9');
  const [groupTeacherId, setGroupTeacherId] = useState('');

  // Session Form State
  const [sessionTitle, setSessionTitle] = useState('جلسة تدبر سورة العلق التفاعلية (مع الكوتش)');
  const [sessionType, setSessionType] = useState<SessionType>('tadabbur');
  const [sessionDate, setSessionDate] = useState('السبت 15 أكتوبر');
  const [sessionTime, setSessionTime] = useState('06:00 مساءً');
  const [sessionLink, setSessionLink] = useState('https://zoom.us/j/123456789');

  // Pricing Form State
  const [regularPrice, setRegularPrice] = useState(pricing.regularMonthlyEGP);
  const [promoPrice, setPromoPrice] = useState(pricing.promotionalMonthlyEGP);
  const [siblingPrice, setSiblingPrice] = useState(pricing.siblingMonthlyEGP);
  const [promoCap, setPromoCap] = useState(pricing.promoCapacity);

  // New Coupon Form State
  const [couponCode, setCouponCode] = useState('');
  const [couponDiscount, setCouponDiscount] = useState(15);

  // Stats calculation
  const totalRevenue = payments.reduce((acc, p) => acc + p.amount, 0);

  const handleAddTeacher = (e: React.FormEvent) => {
    e.preventDefault();
    if (!teacherName.trim()) return;
    addTeacher({
      fullName: teacherName.trim(),
      email: teacherEmail.trim(),
      phone: teacherPhone.trim(),
      specialization: 'تحفيظ وتجويد',
      assignedGroups: [],
      active: true,
    });
    setTeacherName('');
    setTeacherEmail('');
    setTeacherPhone('');
    alert('تمت إضافة المعلم بنجاح');
  };

  const handleAddSupervisor = (e: React.FormEvent) => {
    e.preventDefault();
    if (!supervisorName.trim()) return;
    addSupervisor({
      fullName: supervisorName.trim(),
      email: supervisorEmail.trim(),
      phone: '',
      roleTitle: 'مشرف تربوي',
      assignedGroups: [],
      active: true,
    });
    setSupervisorName('');
    setSupervisorEmail('');
    alert('تمت إضافة المشرف بنجاح');
  };

  const handleAddGroup = (e: React.FormEvent) => {
    e.preventDefault();
    addGroup({
      name: groupName.trim(),
      programId: programs[0]?.id ?? 'moayasha-3months',
      ageGroupId: groupAgeId,
      teacherId: groupTeacherId || undefined,
      capacity: 12,
      scheduleText: 'السبت والثلاثاء 6:00 م',
      status: 'active',
    });
    alert('تم إنشاء المجموعة التعليمية بنجاح');
  };

  const handleAddSession = (e: React.FormEvent) => {
    e.preventDefault();
    addSession({
      programId: programs[0]?.id ?? 'moayasha-3months',
      groupId: groups[0]?.id ?? 'g-1',
      title: sessionTitle.trim(),
      sessionType,
      date: sessionDate,
      time: sessionTime,
      durationMinutes: 45,
      meetingLink: sessionLink.trim(),
      platform: 'zoom',
      status: 'scheduled',
    });
    alert('تمت جدولة الجلسة ونشرها في تقويم الطلاب وأولياء الأمور');
  };

  const handleSavePricing = (e: React.FormEvent) => {
    e.preventDefault();
    updatePricing({
      regularMonthlyEGP: regularPrice,
      promotionalMonthlyEGP: promoPrice,
      siblingMonthlyEGP: siblingPrice,
      promoCapacity: promoCap,
    });
    alert('تم تحديث إعدادات الأسعار وعروض الانطلاق بنجاح');
  };

  const handleAddCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponCode.trim()) return;
    addCoupon({
      code: couponCode.trim().toUpperCase(),
      discountPercent: couponDiscount,
      active: true,
    });
    setCouponCode('');
    alert('تمت إضافة كوبون الخصم بنجاح');
  };

  return (
    <div className="min-h-screen bg-stone-50 text-stone-900 pb-20">
      {/* Admin Top Header */}
      <div className="bg-stone-900 text-white py-6 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2 flex-wrap">
            <button
              type="button"
              onClick={goBack}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 hover:text-white border border-stone-700 text-xs font-bold transition-all cursor-pointer shadow-2xs group"
              title={`الرجوع للشاشة السابقة: ${previousScreenTitle || 'الرئيسية'}`}
              aria-label="الرجوع للشاشة السابقة"
            >
              <ArrowRight className="w-4 h-4 text-emerald-400 group-hover:translate-x-0.5 transition-transform" />
              <span>رجوع للخلف</span>
            </button>

            <button
              type="button"
              onClick={goHome}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 hover:text-white border border-stone-700 text-xs font-bold transition-all cursor-pointer shadow-2xs group"
              title="العودة للواجهة الرئيسية"
              aria-label="الرئيسية"
            >
              <Home className="w-4 h-4 text-emerald-400 group-hover:scale-110 transition-transform" />
              <span>الرئيسية</span>
            </button>

            <div className="w-10 h-10 rounded-xl bg-stone-800 text-emerald-400 flex items-center justify-center mr-1">
              <Settings className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-black">لوحة الإدارة والتحكم الشاملة</h1>
                <span className="text-[10px] bg-emerald-700 text-white px-2 py-0.5 rounded-sm font-bold">
                  مدير النظام (Admin)
                </span>
              </div>
              <p className="text-xs text-stone-400 mt-0.5">
                إدارة المناهج، الكوادر التعليمية، المجموعات، التسعير، والجلسات المباشرة
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        {/* Navigation Tabs */}
        <div className="flex flex-wrap items-center justify-between border-b border-stone-200 mb-8 pb-2 gap-4">
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            {[
              { id: 'overview', label: 'نظرة عامة وإحصائيات', icon: TrendingUp },
              { id: 'curriculum', label: 'المنهج والخطة التعليمية', icon: BookOpen },
              { id: 'staff', label: 'المعلمون والمشرفون', icon: GraduationCap },
              { id: 'groups', label: 'المجموعات والفئات العمرية', icon: Layers },
              { id: 'pricing', label: 'التسعير والكوبونات', icon: DollarSign },
              { id: 'sessions', label: 'جدول الجلسات المباشرة', icon: Calendar },
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
                      ? 'bg-stone-900 text-white shadow-xs'
                      : 'bg-white border border-stone-200 text-stone-600 hover:bg-stone-100'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                  {isActive && activeTab !== 'overview' && (
                    <span
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveTab('overview');
                      }}
                      title="إغلاق التبويب والعودة للنظرة العامة"
                      className="mr-1 p-0.5 rounded-full hover:bg-stone-800 text-stone-300 cursor-pointer"
                    >
                      <X className="w-3.5 h-3.5" />
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {activeTab !== 'overview' && (
            <button
              type="button"
              onClick={() => setActiveTab('overview')}
              className="shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-stone-300 bg-white hover:bg-stone-50 text-stone-700 text-xs font-bold transition-colors cursor-pointer shadow-2xs"
              title="إغلاق التبويب والعودة للنظرة العامة"
            >
              <X className="w-3.5 h-3.5 text-stone-500" />
              <span>إغلاق التبويب</span>
            </button>
          )}
        </div>

        {/* Tab 1: Overview & High-Level Stats */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
              <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs">
                <span className="text-[11px] font-bold text-stone-400 block mb-1">أولياء الأمور</span>
                <span className="text-2xl font-black text-stone-900">{parents.length}</span>
              </div>
              <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs">
                <span className="text-[11px] font-bold text-stone-400 block mb-1">الطلاب المسجلون</span>
                <span className="text-2xl font-black text-emerald-800">{students.length}</span>
              </div>
              <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs">
                <span className="text-[11px] font-bold text-stone-400 block mb-1">المعلمون</span>
                <span className="text-2xl font-black text-teal-800">{teachers.length}</span>
              </div>
              <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs">
                <span className="text-[11px] font-bold text-stone-400 block mb-1">المشرفون</span>
                <span className="text-2xl font-black text-purple-800">{supervisors.length}</span>
              </div>
              <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs">
                <span className="text-[11px] font-bold text-stone-400 block mb-1">الاشتراكات المسددة</span>
                <span className="text-2xl font-black text-amber-800">{payments.length}</span>
              </div>
              <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs">
                <span className="text-[11px] font-bold text-stone-400 block mb-1">إجمالي الإيرادات</span>
                <span className="text-2xl font-black text-emerald-900 font-mono">
                  {totalRevenue} <small className="text-[10px]">{pricing.currency}</small>
                </span>
              </div>
            </div>

            {/* Zero-Users Rule Banner */}
            <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-950 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-amber-700 shrink-0" />
                <span>
                  <strong>سياسة البيانات الحقيقية:</strong> المنصة لا تحتوي على أي حسابات مستخدمين وهمية. كافة الحسابات والبيانات المسجلة تبدأ من الصفر تماماً.
                </span>
              </div>
            </div>

            {/* Admin Child Activation Section */}
            <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-xs">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-base font-black text-stone-900 flex items-center gap-2">
                    <UserCheck className="w-5 h-5 text-emerald-700" />
                    <span>إدارة طلبات الالتحاق وتفعيل اشتراكات الأبناء</span>
                  </h3>
                  <p className="text-xs text-stone-500 mt-0.5">
                    الطلبات بانتظار التفعيل من الإدارة لنقل الطفل تلقائياً إلى تبويب "الأبناء النشطون" بحساب ولي الأمر
                  </p>
                </div>
                <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-stone-100 text-stone-700 border border-stone-200">
                  إجمالي الطلاب: {students.length}
                </span>
              </div>

              {students.filter(s => s.status !== 'archived' && s.status !== 'graduated').length === 0 ? (
                <div className="p-6 text-center text-xs text-stone-500 bg-stone-50 rounded-xl border border-stone-200">
                  لا يوجد أطفال مسجلون حالياً. عند قيام أي ولي أمر بتسجيل طفل، سيظهر هنا لمتابعة وتفعيل اشتراكه فوراً.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-right text-xs">
                    <thead>
                      <tr className="border-b border-stone-200 text-stone-500 font-bold">
                        <th className="pb-3 pr-2">اسم الطفل</th>
                        <th className="pb-3 px-3">العمر</th>
                        <th className="pb-3 px-3">البرنامج</th>
                        <th className="pb-3 px-3">حالة الالتحاق</th>
                        <th className="pb-3 pl-2 text-left">إجراء الإدارة</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-100">
                      {students
                        .filter(s => s.status !== 'archived' && s.status !== 'graduated')
                        .map((student) => {
                          const isPendingAct = student.enrollmentStatus === 'pending_activation';
                          const isPendingSub = student.enrollmentStatus === 'pending_subscription';
                          const isPendingPay = student.enrollmentStatus === 'pending_payment';
                          const isAlreadyActive = student.enrollmentStatus === 'active' || student.status === 'active';
                          const prog = programs.find(p => p.id === student.currentProgramId);

                          return (
                            <tr key={student.id} className="hover:bg-stone-50/50 transition-colors">
                              <td className="py-3.5 pr-2 font-bold text-stone-900">
                                {student.fullName}
                              </td>
                              <td className="py-3.5 px-3 text-stone-600">
                                {student.age} سنة
                              </td>
                              <td className="py-3.5 px-3 text-stone-600">
                                {prog?.name || 'برنامج معايشة القرآن'}
                              </td>
                              <td className="py-3.5 px-3">
                                {isPendingSub && (
                                  <span className="px-2.5 py-1 rounded-md text-[11px] font-bold bg-blue-100 text-blue-900 border border-blue-200 inline-flex items-center gap-1">
                                    <Clock className="w-3 h-3 text-blue-700" />
                                    بانتظار الاشتراك
                                  </span>
                                )}
                                {isPendingPay && (
                                  <span className="px-2.5 py-1 rounded-md text-[11px] font-bold bg-amber-100 text-amber-900 border border-amber-200 inline-flex items-center gap-1">
                                    <CreditCard className="w-3 h-3 text-amber-700" />
                                    بانتظار السداد
                                  </span>
                                )}
                                {isPendingAct && (
                                  <span className="px-2.5 py-1 rounded-md text-[11px] font-bold bg-orange-100 text-orange-900 border border-orange-200 inline-flex items-center gap-1 animate-pulse">
                                    <Clock className="w-3 h-3 text-orange-700" />
                                    بانتظار التفعيل من الإدارة
                                  </span>
                                )}
                                {isAlreadyActive && (
                                  <span className="px-2.5 py-1 rounded-md text-[11px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200 inline-flex items-center gap-1">
                                    <CheckCircle2 className="w-3 h-3 text-emerald-700" />
                                    مفعّل في الأبناء النشطين
                                  </span>
                                )}
                              </td>
                              <td className="py-3.5 pl-2 text-left">
                                {isPendingAct ? (
                                  <button
                                    type="button"
                                    onClick={() => activateChildByAdmin(student.id)}
                                    className="px-3 py-1.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs shadow-xs transition-colors cursor-pointer inline-flex items-center gap-1"
                                  >
                                    <Check className="w-3.5 h-3.5" />
                                    <span>موافقة وتفعيل الاشتراك</span>
                                  </button>
                                ) : isPendingSub || isPendingPay ? (
                                  <button
                                    type="button"
                                    onClick={() => activateChildByAdmin(student.id)}
                                    className="px-2.5 py-1 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 font-medium text-[11px] border border-stone-200 transition-colors cursor-pointer inline-flex items-center gap-1"
                                    title="تفعيل مباشر من الإدارة"
                                  >
                                    <Check className="w-3 h-3 text-stone-500" />
                                    <span>تفعيل يدوي</span>
                                  </button>
                                ) : (
                                  <span className="text-[11px] text-emerald-700 font-bold inline-flex items-center gap-1">
                                    <CheckCircle2 className="w-3.5 h-3.5" />
                                    <span>نشط</span>
                                  </span>
                                )}
                              </td>
                            </tr>
                          );
                        })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Tab 2: Curriculum & Content Configuration */}
        {activeTab === 'curriculum' && (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-xs">
              <h3 className="text-lg font-bold text-stone-900 mb-1">
                البرنامج الحالي: {programs[0]?.name}
              </h3>
              <p className="text-xs text-stone-500 mb-4">
                المدرب التربوي: <strong>{programs[0]?.coachName}</strong> • المدة: 3 أشهر (12 أسبوعاً)
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {surahs.map((s) => (
                  <div key={s.id} className="p-4 rounded-xl border border-stone-200 bg-stone-50/70 space-y-2">
                    <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-sm">
                      الشهر {s.monthNumber}
                    </span>
                    <h4 className="font-bold text-stone-900 text-base">{s.surahName}</h4>
                    <p className="text-xs text-stone-600 font-medium">الخطة الشهرية للمعايشة</p>
                    <p className="text-[11px] text-stone-500 leading-relaxed">{s.notes || 'حفظ وتدبر وتطبيق عملي مستمر'}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Staff Management */}
        {activeTab === 'staff' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Add Teacher */}
            <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-xs space-y-4">
              <h3 className="text-base font-bold text-stone-900 flex items-center gap-2">
                <GraduationCap className="w-5 h-5 text-teal-700" />
                <span>إضافة معلم تحفيظ وتجويد</span>
              </h3>

              <form onSubmit={handleAddTeacher} className="space-y-3">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">اسم المعلم *</label>
                  <input
                    type="text"
                    value={teacherName}
                    onChange={(e) => setTeacherName(e.target.value)}
                    placeholder="مثال: الشيخ أحمد محمود"
                    className="w-full px-3.5 py-2 rounded-xl border border-stone-300 text-sm outline-hidden"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">البريد الإلكتروني</label>
                  <input
                    type="email"
                    value={teacherEmail}
                    onChange={(e) => setTeacherEmail(e.target.value)}
                    placeholder="teacher@moayasha.com"
                    className="w-full px-3.5 py-2 rounded-xl border border-stone-300 text-sm outline-hidden"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">رقم الهاتف / واتساب</label>
                  <input
                    type="tel"
                    value={teacherPhone}
                    onChange={(e) => setTeacherPhone(e.target.value)}
                    placeholder="010XXXXXXXX"
                    className="w-full px-3.5 py-2 rounded-xl border border-stone-300 text-sm outline-hidden"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl bg-teal-700 hover:bg-teal-800 text-white text-xs font-bold transition-colors cursor-pointer"
                >
                  حفظ وإضافة المعلم
                </button>
              </form>

              {/* Existing Teachers List */}
              <div className="pt-4 border-t border-stone-100">
                <h4 className="text-xs font-bold text-stone-700 mb-2">المعلمون الحاليون ({teachers.length})</h4>
                {teachers.length === 0 ? (
                  <p className="text-xs text-stone-400">لا يوجد معلمون مسجلون بعد.</p>
                ) : (
                  <div className="space-y-1.5">
                    {teachers.map((t) => (
                      <div key={t.id} className="p-2.5 rounded-lg bg-stone-50 border border-stone-200 text-xs flex justify-between">
                        <span className="font-bold">{t.fullName}</span>
                        <span className="text-stone-500">{t.phone || t.email}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Add Supervisor */}
            <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-xs space-y-4">
              <h3 className="text-base font-bold text-stone-900 flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-purple-700" />
                <span>إضافة مشرف تربوي</span>
              </h3>

              <form onSubmit={handleAddSupervisor} className="space-y-3">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">اسم المشرف التربوي *</label>
                  <input
                    type="text"
                    value={supervisorName}
                    onChange={(e) => setSupervisorName(e.target.value)}
                    placeholder="مثال: د. محمود عبد الوهاب"
                    className="w-full px-3.5 py-2 rounded-xl border border-stone-300 text-sm outline-hidden"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">البريد الإلكتروني</label>
                  <input
                    type="email"
                    value={supervisorEmail}
                    onChange={(e) => setSupervisorEmail(e.target.value)}
                    placeholder="supervisor@moayasha.com"
                    className="w-full px-3.5 py-2 rounded-xl border border-stone-300 text-sm outline-hidden"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl bg-purple-700 hover:bg-purple-800 text-white text-xs font-bold transition-colors cursor-pointer"
                >
                  حفظ وإضافة المشرف
                </button>
              </form>

              {/* Existing Supervisors List */}
              <div className="pt-4 border-t border-stone-100">
                <h4 className="text-xs font-bold text-stone-700 mb-2">المشرفون الحاليون ({supervisors.length})</h4>
                {supervisors.length === 0 ? (
                  <p className="text-xs text-stone-400">لا يوجد مشرفون مسجلون بعد.</p>
                ) : (
                  <div className="space-y-1.5">
                    {supervisors.map((s) => (
                      <div key={s.id} className="p-2.5 rounded-lg bg-stone-50 border border-stone-200 text-xs flex justify-between">
                        <span className="font-bold">{s.fullName}</span>
                        <span className="text-stone-500">{s.email}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Tab 4: Groups Management */}
        {activeTab === 'groups' && (
          <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-xs space-y-6">
            <h3 className="text-lg font-bold text-stone-900">إدارة المجموعات والحلقات الدراسية</h3>

            <form onSubmit={handleAddGroup} className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">اسم المجموعة</label>
                <input
                  type="text"
                  value={groupName}
                  onChange={(e) => setGroupName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 text-sm outline-hidden"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">الفئة العمرية</label>
                <select
                  value={groupAgeId}
                  onChange={(e) => setGroupAgeId(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 text-sm outline-hidden"
                >
                  {ageGroups.map((ag) => (
                    <option key={ag.id} value={ag.id}>
                      {ag.name} ({ag.minAge}-{ag.maxAge} سنة)
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex items-end">
                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-white text-xs font-bold transition-colors cursor-pointer"
                >
                  إنشاء المجموعة
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Tab 5: Pricing & Coupons */}
        {activeTab === 'pricing' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Pricing Settings */}
            <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-xs space-y-4">
              <h3 className="text-base font-bold text-stone-900 flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-emerald-700" />
                <span>إعدادات التسعير والخصومات (بالجنيه المصري)</span>
              </h3>

              <form onSubmit={handleSavePricing} className="space-y-3">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    السعر الشهري الأساسي (EGP)
                  </label>
                  <input
                    type="number"
                    value={regularPrice}
                    onChange={(e) => setRegularPrice(parseInt(e.target.value) || 0)}
                    className="w-full px-3.5 py-2 rounded-xl border border-stone-300 text-sm font-bold"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    سعر عرض الانطلاق (خصم 25%)
                  </label>
                  <input
                    type="number"
                    value={promoPrice}
                    onChange={(e) => setPromoPrice(parseInt(e.target.value) || 0)}
                    className="w-full px-3.5 py-2 rounded-xl border border-stone-300 text-sm font-bold"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    سعر الأخوة (للابن الثاني وما بعده)
                  </label>
                  <input
                    type="number"
                    value={siblingPrice}
                    onChange={(e) => setSiblingPrice(parseInt(e.target.value) || 0)}
                    className="w-full px-3.5 py-2 rounded-xl border border-stone-300 text-sm font-bold"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    سعة عرض الانطلاق (عدد المشتركين)
                  </label>
                  <input
                    type="number"
                    value={promoCap}
                    onChange={(e) => setPromoCap(parseInt(e.target.value) || 15)}
                    className="w-full px-3.5 py-2 rounded-xl border border-stone-300 text-sm font-bold"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold transition-colors cursor-pointer"
                >
                  حفظ وتحديث الأسعار
                </button>
              </form>
            </div>

            {/* Coupons Management */}
            <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-xs space-y-4">
              <h3 className="text-base font-bold text-stone-900 flex items-center gap-2">
                <Tag className="w-5 h-5 text-amber-700" />
                <span>إدارة كوبونات الخصم الترويجية</span>
              </h3>

              <form onSubmit={handleAddCoupon} className="space-y-3">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">كود الكوبون</label>
                  <input
                    type="text"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    placeholder="مثال: RAMADAN20"
                    className="w-full px-3.5 py-2 rounded-xl border border-stone-300 text-sm uppercase font-mono"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">نسبة الخصم (%)</label>
                  <input
                    type="number"
                    min={1}
                    max={100}
                    value={couponDiscount}
                    onChange={(e) => setCouponDiscount(parseInt(e.target.value) || 10)}
                    className="w-full px-3.5 py-2 rounded-xl border border-stone-300 text-sm font-bold"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold transition-colors cursor-pointer"
                >
                  إضافة الكوبون
                </button>
              </form>

              {/* Active Coupons */}
              <div className="pt-3 border-t border-stone-100">
                <h4 className="text-xs font-bold text-stone-700 mb-2">الكوبونات النشطة:</h4>
                <div className="space-y-1.5">
                  {pricing.coupons.map((c, i) => (
                    <div key={i} className="p-2.5 rounded-lg bg-stone-50 border border-stone-200 text-xs flex justify-between items-center">
                      <span className="font-mono font-bold text-emerald-800">{c.code}</span>
                      <span className="font-semibold text-stone-600">خصم {c.discountPercent}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 6: Live Sessions Scheduler */}
        {activeTab === 'sessions' && (
          <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-xs space-y-6">
            <h3 className="text-lg font-bold text-stone-900">جدولة ونشر الجلسات المباشرة (Zoom / Google Meet)</h3>

            <form onSubmit={handleAddSession} className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl">
              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-stone-700 mb-1">عنوان الجلسة *</label>
                <input
                  type="text"
                  value={sessionTitle}
                  onChange={(e) => setSessionTitle(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-stone-300 text-sm outline-hidden"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">نوع الجلسة</label>
                <select
                  value={sessionType}
                  onChange={(e) => setSessionType(e.target.value as any)}
                  className="w-full px-3.5 py-2 rounded-xl border border-stone-300 text-sm outline-hidden"
                >
                  <option value="tadabbur">جلسة تدبر مع الكوتش (أسبوعية)</option>
                  <option value="memorization">حلقة متابعة حفظ وتجويد</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">التاريخ</label>
                <input
                  type="text"
                  value={sessionDate}
                  onChange={(e) => setSessionDate(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-stone-300 text-sm outline-hidden"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">الوقت</label>
                <input
                  type="text"
                  value={sessionTime}
                  onChange={(e) => setSessionTime(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-stone-300 text-sm outline-hidden"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">رابط الاجتماع (Zoom/Meet)</label>
                <input
                  type="url"
                  value={sessionLink}
                  onChange={(e) => setSessionLink(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-stone-300 text-sm outline-hidden text-left font-mono text-xs"
                />
              </div>
              <div className="sm:col-span-2 pt-2">
                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-stone-900 hover:bg-stone-800 text-white font-bold text-xs shadow-xs transition-colors cursor-pointer"
                >
                  جدولة الجلسة ونشرها فوراً
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
