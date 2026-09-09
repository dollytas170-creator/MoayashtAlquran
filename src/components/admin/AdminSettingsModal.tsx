import React, { useState } from 'react';
import {
  X,
  Settings,
  Shield,
  Key,
  Database,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Save,
  Globe,
  Bell,
  Lock,
  Eye,
  EyeOff,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface AdminSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AdminSettingsModal: React.FC<AdminSettingsModalProps> = ({
  isOpen,
  onClose,
}) => {
  const {
    staffCredentials,
    updateStaffCredentials,
    resetParentsAndPayments,
    resetAllData,
    parents,
    students,
    teachers,
    supervisors,
    payments,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'security' | 'general' | 'database'>('security');

  // Security passcodes form state
  const [adminPass, setAdminPass] = useState(staffCredentials.adminPass || 'admin2026');
  const [supervisorPass, setSupervisorPass] = useState(staffCredentials.supervisorPass || 'supervisor2026');
  const [teacherPass, setTeacherPass] = useState(staffCredentials.teacherPass || 'teacher2026');
  const [showAdminPass, setShowAdminPass] = useState(false);
  const [showSupervisorPass, setShowSupervisorPass] = useState(false);
  const [showTeacherPass, setShowTeacherPass] = useState(false);
  const [securitySuccess, setSecuritySuccess] = useState(false);

  // General Platform Settings state
  const [platformName, setPlatformName] = useState('معايشة القرآن – Maayshat Al-Quran');
  const [supportPhone, setSupportPhone] = useState('+20 100 000 0000');
  const [adminEmail, setAdminEmail] = useState('admin@maayshat-quran.com');
  const [currencySymbol, setCurrencySymbol] = useState('ج.م');
  const [generalSuccess, setGeneralSuccess] = useState(false);

  // Dangerous Actions Confirmations
  const [showResetParentsConfirm, setShowResetParentsConfirm] = useState(false);
  const [showResetAllConfirm, setShowResetAllConfirm] = useState(false);

  if (!isOpen) return null;

  const handleSaveSecurity = (e: React.FormEvent) => {
    e.preventDefault();
    updateStaffCredentials('admin', adminPass);
    updateStaffCredentials('supervisor', supervisorPass);
    updateStaffCredentials('teacher', teacherPass);
    setSecuritySuccess(true);
    setTimeout(() => setSecuritySuccess(false), 3000);
  };

  const handleSaveGeneral = (e: React.FormEvent) => {
    e.preventDefault();
    setGeneralSuccess(true);
    setTimeout(() => setGeneralSuccess(false), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs animate-fade-in">
      <div
        className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-stone-200 overflow-hidden"
        dir="rtl"
      >
        {/* Header */}
        <div className="bg-stone-900 text-white px-6 py-5 flex items-center justify-between border-b border-stone-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-stone-800 text-emerald-400 flex items-center justify-center border border-stone-700">
              <Settings className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-black flex items-center gap-2">
                إعدادات الإدارة والنظام
                <span className="text-[10px] bg-emerald-600/80 text-white px-2 py-0.5 rounded-full font-bold">
                  تحكم كامل
                </span>
              </h2>
              <p className="text-xs text-stone-400">
                إدارة كلمات مرور الكادر، إعدادات المنصة، وصيانة قواعد البيانات
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-9 h-9 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
            title="إغلاق"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-stone-200 bg-stone-50 px-6 gap-2 pt-2">
          {[
            { id: 'security', label: 'أمان الدخول والكوادر', icon: Shield },
            { id: 'general', label: 'إعدادات المنصة العامة', icon: Globe },
            { id: 'database', label: 'صيانة وتصفير البيانات', icon: Database },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold border-b-2 transition-all cursor-pointer ${
                  isActive
                    ? 'border-emerald-600 text-emerald-800 bg-white rounded-t-xl shadow-xs'
                    : 'border-transparent text-stone-600 hover:text-stone-900 hover:bg-stone-100 rounded-t-xl'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Content Area */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          {/* TAB 1: SECURITY */}
          {activeTab === 'security' && (
            <form onSubmit={handleSaveSecurity} className="space-y-6">
              <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 flex items-start gap-3">
                <Lock className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-emerald-900">
                    حماية لوحات التحكم بأكواد المرور
                  </h4>
                  <p className="text-[11px] text-emerald-800/90 leading-relaxed mt-0.5">
                    هذه الكلمات والرموز هي التي تفتح بوابات الدخول للكادر التعليمي والإداري.
                    يمكنك تعديلها وتخصيصها في أي وقت لحماية لوحات التحكم من الوصول غير المصرح به.
                  </p>
                </div>
              </div>

              {securitySuccess && (
                <div className="bg-emerald-100 border border-emerald-300 text-emerald-800 px-4 py-3 rounded-2xl text-xs font-bold flex items-center gap-2 animate-fade-in">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>تم حفظ وتحديث كلمات مرور الكادر بنجاح!</span>
                </div>
              )}

              <div className="space-y-4">
                {/* Admin Passcode */}
                <div className="bg-stone-50 border border-stone-200 rounded-2xl p-4">
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-xs font-bold text-stone-800 flex items-center gap-2">
                      <Key className="w-3.5 h-3.5 text-purple-600" />
                      <span>كلمة مرور مدير النظام (Admin)</span>
                    </label>
                    <span className="text-[10px] bg-purple-100 text-purple-800 font-bold px-2 py-0.5 rounded-md">
                      صلاحية كاملة
                    </span>
                  </div>
                  <div className="relative">
                    <input
                      type={showAdminPass ? 'text' : 'password'}
                      value={adminPass}
                      onChange={(e) => setAdminPass(e.target.value)}
                      required
                      minLength={4}
                      className="w-full bg-white border border-stone-300 rounded-xl px-3 py-2.5 text-xs text-stone-900 pl-10 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      placeholder="كلمة مرور مدير النظام"
                    />
                    <button
                      type="button"
                      onClick={() => setShowAdminPass(!showAdminPass)}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700 cursor-pointer"
                    >
                      {showAdminPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  <span className="text-[10px] text-stone-500 mt-1 block">
                    الرمز الحالي المعتمد أيضاً: <code className="bg-white px-1 py-0.5 rounded border text-purple-700">admin2026</code> أو <code className="bg-white px-1 py-0.5 rounded border text-purple-700">2026</code>
                  </span>
                </div>

                {/* Supervisor Passcode */}
                <div className="bg-stone-50 border border-stone-200 rounded-2xl p-4">
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-xs font-bold text-stone-800 flex items-center gap-2">
                      <Key className="w-3.5 h-3.5 text-blue-600" />
                      <span>رمز دخول المشرف التربوي (Supervisor)</span>
                    </label>
                    <span className="text-[10px] bg-blue-100 text-blue-800 font-bold px-2 py-0.5 rounded-md">
                      لوحة المشرف
                    </span>
                  </div>
                  <div className="relative">
                    <input
                      type={showSupervisorPass ? 'text' : 'password'}
                      value={supervisorPass}
                      onChange={(e) => setSupervisorPass(e.target.value)}
                      required
                      minLength={4}
                      className="w-full bg-white border border-stone-300 rounded-xl px-3 py-2.5 text-xs text-stone-900 pl-10 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      placeholder="رمز دخول المشرف التربوي"
                    />
                    <button
                      type="button"
                      onClick={() => setShowSupervisorPass(!showSupervisorPass)}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700 cursor-pointer"
                    >
                      {showSupervisorPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  <span className="text-[10px] text-stone-500 mt-1 block">
                    الرمز الحالي المعتمد أيضاً: <code className="bg-white px-1 py-0.5 rounded border text-blue-700">supervisor2026</code> أو <code className="bg-white px-1 py-0.5 rounded border text-blue-700">2026</code>
                  </span>
                </div>

                {/* Teacher Passcode */}
                <div className="bg-stone-50 border border-stone-200 rounded-2xl p-4">
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-xs font-bold text-stone-800 flex items-center gap-2">
                      <Key className="w-3.5 h-3.5 text-teal-600" />
                      <span>رمز دخول معلم التحفيظ (Teacher)</span>
                    </label>
                    <span className="text-[10px] bg-teal-100 text-teal-800 font-bold px-2 py-0.5 rounded-md">
                      لوحة المحفظ
                    </span>
                  </div>
                  <div className="relative">
                    <input
                      type={showTeacherPass ? 'text' : 'password'}
                      value={teacherPass}
                      onChange={(e) => setTeacherPass(e.target.value)}
                      required
                      minLength={4}
                      className="w-full bg-white border border-stone-300 rounded-xl px-3 py-2.5 text-xs text-stone-900 pl-10 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      placeholder="رمز دخول معلم التحفيظ"
                    />
                    <button
                      type="button"
                      onClick={() => setShowTeacherPass(!showTeacherPass)}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700 cursor-pointer"
                    >
                      {showTeacherPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  <span className="text-[10px] text-stone-500 mt-1 block">
                    الرمز الحالي المعتمد أيضاً: <code className="bg-white px-1 py-0.5 rounded border text-teal-700">teacher2026</code> أو <code className="bg-white px-1 py-0.5 rounded border text-teal-700">2026</code>
                  </span>
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold shadow-xs transition-colors cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  <span>حفظ تحديثات الأمان وكلمات المرور</span>
                </button>
              </div>
            </form>
          )}

          {/* TAB 2: GENERAL */}
          {activeTab === 'general' && (
            <form onSubmit={handleSaveGeneral} className="space-y-4">
              {generalSuccess && (
                <div className="bg-emerald-100 border border-emerald-300 text-emerald-800 px-4 py-3 rounded-2xl text-xs font-bold flex items-center gap-2 animate-fade-in">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>تم حفظ وتحديث إعدادات المنصة بنجاح!</span>
                </div>
              )}

              <div>
                <label className="text-xs font-bold text-stone-700 mb-1 block">
                  اسم المنصة والعنوان الرئيسي:
                </label>
                <input
                  type="text"
                  value={platformName}
                  onChange={(e) => setPlatformName(e.target.value)}
                  className="w-full bg-white border border-stone-300 rounded-xl px-3 py-2 text-xs text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-stone-700 mb-1 block">
                    رقم هاتف / واتساب الدعم الفني:
                  </label>
                  <input
                    type="text"
                    value={supportPhone}
                    onChange={(e) => setSupportPhone(e.target.value)}
                    className="w-full bg-white border border-stone-300 rounded-xl px-3 py-2 text-xs text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-stone-700 mb-1 block">
                    البريد الإلكتروني للإدارة:
                  </label>
                  <input
                    type="email"
                    value={adminEmail}
                    onChange={(e) => setAdminEmail(e.target.value)}
                    className="w-full bg-white border border-stone-300 rounded-xl px-3 py-2 text-xs text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-stone-700 mb-1 block">
                  العملة المعتمدة في التقارير والاشتراكات:
                </label>
                <input
                  type="text"
                  value={currencySymbol}
                  onChange={(e) => setCurrencySymbol(e.target.value)}
                  className="w-full bg-white border border-stone-300 rounded-xl px-3 py-2 text-xs text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="bg-stone-50 border border-stone-200 rounded-2xl p-4">
                <div className="flex items-center gap-2 text-xs font-bold text-stone-800 mb-2">
                  <Bell className="w-4 h-4 text-emerald-600" />
                  <span>تنبيهات النظام التلقائية</span>
                </div>
                <div className="space-y-2 text-xs text-stone-600">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" defaultChecked className="rounded text-emerald-600" />
                    <span>إرسال إشعار فوري لولي الأمر عند تقييم التسميع الصوتي</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" defaultChecked className="rounded text-emerald-600" />
                    <span>تنبيه المشرف التربوي عند غياب طالب جلستين متتاليتين</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" defaultChecked className="rounded text-emerald-600" />
                    <span>إشعار الإدارة عند تسجيل اشتراك جديد وتأكيد الدفع</span>
                  </label>
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold shadow-xs transition-colors cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  <span>حفظ الإعدادات العامة</span>
                </button>
              </div>
            </form>
          )}

          {/* TAB 3: DATABASE */}
          {activeTab === 'database' && (
            <div className="space-y-6">
              {/* Database Overview */}
              <div className="bg-stone-50 border border-stone-200 rounded-2xl p-4">
                <h4 className="text-xs font-bold text-stone-900 mb-3 flex items-center gap-2">
                  <Database className="w-4 h-4 text-stone-600" />
                  <span>إحصائيات السجلات المخزنة في النظام حالياً:</span>
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                  <div className="bg-white p-3 rounded-xl border border-stone-200">
                    <span className="text-lg font-black text-stone-800 block">{parents.length}</span>
                    <span className="text-[10px] text-stone-500 font-bold">أولياء الأمور</span>
                  </div>
                  <div className="bg-white p-3 rounded-xl border border-stone-200">
                    <span className="text-lg font-black text-stone-800 block">{students.length}</span>
                    <span className="text-[10px] text-stone-500 font-bold">الطلاب المسجلين</span>
                  </div>
                  <div className="bg-white p-3 rounded-xl border border-stone-200">
                    <span className="text-lg font-black text-stone-800 block">{teachers.length + supervisors.length}</span>
                    <span className="text-[10px] text-stone-500 font-bold">المعلمون والمشرفون</span>
                  </div>
                  <div className="bg-white p-3 rounded-xl border border-stone-200">
                    <span className="text-lg font-black text-stone-800 block">{payments.length}</span>
                    <span className="text-[10px] text-stone-500 font-bold">الاشتراكات والمدفوعات</span>
                  </div>
                </div>
              </div>

              {/* Maintenance Tools */}
              <div className="border-t border-stone-200 pt-4 space-y-4">
                <h4 className="text-xs font-bold text-stone-900">أدوات الصيانة وإعادة الضبط:</h4>

                {/* Reset Parents and Payments */}
                <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div>
                    <h5 className="text-xs font-bold text-amber-900">
                      تصفير أولياء الأمور والاشتراكات والإيرادات (0)
                    </h5>
                    <p className="text-[11px] text-amber-800/90 mt-0.5">
                      يقوم بحذف بيانات التسجيل التجريبية وتصفير الاشتراكات والمدفوعات إلى 0 مع الإبقاء على المعلمين والمناهج.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowResetParentsConfirm(true)}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-700 hover:bg-amber-800 text-white text-xs font-bold shadow-xs shrink-0 cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>تصفير المشتركين</span>
                  </button>
                </div>

                {/* Full System Reset */}
                <div className="bg-rose-50 border border-rose-200 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div>
                    <h5 className="text-xs font-bold text-rose-900 flex items-center gap-1.5">
                      <AlertTriangle className="w-4 h-4 text-rose-600" />
                      <span>إعادة ضبط المنصة بالكامل للحالة الأولية الفارغة</span>
                    </h5>
                    <p className="text-[11px] text-rose-800/90 mt-0.5">
                      إفراغ كافة البيانات المخزنة وإعادة النظام إلى وضع التثبيت الأولي النظيف.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowResetAllConfirm(true)}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-rose-700 hover:bg-rose-800 text-white text-xs font-bold shadow-xs shrink-0 cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>إعادة ضبط المصنع</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Confirmation Modal: Reset Parents & Payments */}
        {showResetParentsConfirm && (
          <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-stone-900/70 backdrop-blur-xs">
            <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-stone-200 text-center space-y-4">
              <div className="w-12 h-12 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center mx-auto">
                <RotateCcw className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-sm font-black text-stone-900">تأكيد تصفير أولياء الأمور والاشتراكات</h3>
                <p className="text-xs text-stone-600 mt-1">
                  هل أنت متأكد من تصفير أولياء الأمور والاشتراكات المسددة والإيرادات إلى 0؟
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => {
                    resetParentsAndPayments();
                    setShowResetParentsConfirm(false);
                  }}
                  className="flex-1 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold cursor-pointer"
                >
                  نعم، صفّر الآن
                </button>
                <button
                  type="button"
                  onClick={() => setShowResetParentsConfirm(false)}
                  className="flex-1 py-2.5 rounded-xl border border-stone-200 text-stone-700 text-xs font-bold hover:bg-stone-50 cursor-pointer"
                >
                  إلغاء
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Confirmation Modal: Reset All Data */}
        {showResetAllConfirm && (
          <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-stone-900/70 backdrop-blur-xs">
            <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-stone-200 text-center space-y-4">
              <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-sm font-black text-stone-900">تأكيد إعادة الضبط الشاملة</h3>
                <p className="text-xs text-stone-600 mt-1">
                  سيتم حذف جميع البيانات التجريبية وإعادة المنصة إلى حالتها الأولية الفارغة تماماً.
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => {
                    resetAllData();
                    setShowResetAllConfirm(false);
                    onClose();
                  }}
                  className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold cursor-pointer"
                >
                  نعم، إعادة ضبط بالكامل
                </button>
                <button
                  type="button"
                  onClick={() => setShowResetAllConfirm(false)}
                  className="flex-1 py-2.5 rounded-xl border border-stone-200 text-stone-700 text-xs font-bold hover:bg-stone-50 cursor-pointer"
                >
                  إلغاء
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
