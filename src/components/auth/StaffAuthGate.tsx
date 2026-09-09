import React, { useState } from 'react';
import {
  Lock,
  ShieldCheck,
  UserCheck,
  GraduationCap,
  KeyRound,
  Eye,
  EyeOff,
  ArrowRight,
  AlertCircle,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { UserRole } from '../../types';

interface StaffAuthGateProps {
  requiredRole: 'admin' | 'supervisor' | 'teacher';
  onBackToHome?: () => void;
}

export const StaffAuthGate: React.FC<StaffAuthGateProps> = ({
  requiredRole,
  onBackToHome,
}) => {
  const {
    loginStaff,
    supervisors,
    teachers,
    setCurrentRole,
    goHome,
  } = useApp();

  const [selectedRole, setSelectedRole] = useState<'admin' | 'supervisor' | 'teacher'>(requiredRole);
  const [passkey, setPasskey] = useState('');
  const [selectedStaffId, setSelectedStaffId] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const roleMeta = {
    admin: {
      title: 'لوحة الإدارة والتحكم الشاملة',
      roleLabel: 'مدير النظام (Admin)',
      icon: ShieldCheck,
      badgeColor: 'bg-purple-100 text-purple-800 border-purple-200',
      btnColor: 'bg-purple-800 hover:bg-purple-900',
      description: 'هذه المنطقة مخصصة لإدارة المنصة، المناهج، الكوادر والأسعار وتتطلب صلاحية معتمدة.',
      defaultHint: 'admin2026 أو 2026',
    },
    supervisor: {
      title: 'لوحة المشرف التربوي',
      roleLabel: 'المشرف التربوي (Supervisor)',
      icon: UserCheck,
      badgeColor: 'bg-blue-100 text-blue-800 border-blue-200',
      btnColor: 'bg-blue-700 hover:bg-blue-800',
      description: 'هذه المنطقة مخصصة لمتابعة جودة التدريس واعتماد التقارير التربوية الدورية للطلاب.',
      defaultHint: 'supervisor2026 أو 2026',
    },
    teacher: {
      title: 'لوحة معلم التحفيظ والتجويد',
      roleLabel: 'معلم التحفيظ (Teacher)',
      icon: GraduationCap,
      badgeColor: 'bg-teal-100 text-teal-800 border-teal-200',
      btnColor: 'bg-teal-700 hover:bg-teal-800',
      description: 'هذه المنطقة مخصصة لتقييم التسميع الصوتي ورصد الحضور وإسناد المهام القرآنية.',
      defaultHint: 'teacher2026 أو 2026',
    },
  };

  const currentMeta = roleMeta[selectedRole];
  const Icon = currentMeta.icon;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!passkey.trim()) {
      setErrorMsg('يرجى إدخال كلمة المرور أو رمز الدخول السري');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      const res = loginStaff(selectedRole, passkey.trim(), selectedStaffId || undefined);
      setIsSubmitting(false);

      if (!res.success) {
        setErrorMsg(res.error || 'رمز الدخول غير صحيح، يرجى إعادة المحاولة');
      }
    }, 200);
  };

  const handleBack = () => {
    if (onBackToHome) {
      onBackToHome();
    } else {
      goHome();
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-stone-100/80 via-stone-50 to-white">
      <div className="max-w-md w-full space-y-6">
        {/* Back Link */}
        <button
          type="button"
          onClick={handleBack}
          className="inline-flex items-center gap-2 text-xs font-bold text-stone-600 hover:text-stone-900 transition-colors cursor-pointer"
        >
          <ArrowRight className="w-4 h-4" />
          <span>العودة إلى الواجهة العامة</span>
        </button>

        {/* Security Card */}
        <div className="bg-white rounded-3xl p-8 border border-stone-200 shadow-xl space-y-6 relative overflow-hidden">
          {/* Subtle Top Accent */}
          <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-emerald-600 via-teal-500 to-purple-600"></div>

          {/* Role Header */}
          <div className="text-center space-y-3 pt-2">
            <div className="w-16 h-16 rounded-2xl bg-stone-900 text-white flex items-center justify-center mx-auto shadow-md">
              <Lock className="w-8 h-8 text-emerald-400" />
            </div>

            <div>
              <span className={`inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-full border ${currentMeta.badgeColor}`}>
                <Icon className="w-3.5 h-3.5" />
                <span>{currentMeta.roleLabel}</span>
              </span>
              <h2 className="text-xl font-black text-stone-900 mt-2">
                بوابة الدخول والتحقق الأمني
              </h2>
              <p className="text-xs text-stone-500 mt-1 max-w-sm mx-auto leading-relaxed">
                {currentMeta.description}
              </p>
            </div>
          </div>

          {/* Role Selection Tabs */}
          <div className="grid grid-cols-3 gap-1.5 p-1 bg-stone-100 rounded-2xl">
            {(['admin', 'supervisor', 'teacher'] as const).map((r) => {
              const meta = roleMeta[r];
              const isSelected = selectedRole === r;
              return (
                <button
                  key={r}
                  type="button"
                  onClick={() => {
                    setSelectedRole(r);
                    setErrorMsg(null);
                    setPasskey('');
                  }}
                  className={`py-2 px-1 text-[11px] font-bold rounded-xl transition-all cursor-pointer flex flex-col items-center gap-1 ${
                    isSelected
                      ? 'bg-white text-stone-900 shadow-xs ring-1 ring-stone-200'
                      : 'text-stone-500 hover:text-stone-800'
                  }`}
                >
                  <meta.icon className="w-3.5 h-3.5" />
                  <span>{r === 'admin' ? 'الإدارة' : r === 'supervisor' ? 'المشرف' : 'المحفظ'}</span>
                </button>
              );
            })}
          </div>

          {/* Error Alert */}
          {errorMsg && (
            <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-2.5 animate-shake">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Optional Staff Member Picker for Supervisor / Teacher */}
            {selectedRole === 'supervisor' && supervisors.length > 0 && (
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1.5">
                  اختر اسم المشرف (اختياري):
                </label>
                <select
                  value={selectedStaffId}
                  onChange={(e) => setSelectedStaffId(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-stone-300 text-xs bg-stone-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">دخول عام بصلاحية المشرف التربوي</option>
                  {supervisors.map((sup) => (
                    <option key={sup.id} value={sup.id}>
                      {sup.fullName} ({sup.roleTitle || 'مشرف'})
                    </option>
                  ))}
                </select>
              </div>
            )}

            {selectedRole === 'teacher' && teachers.length > 0 && (
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1.5">
                  اختر اسم المعلم (اختياري):
                </label>
                <select
                  value={selectedStaffId}
                  onChange={(e) => setSelectedStaffId(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-stone-300 text-xs bg-stone-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                >
                  <option value="">دخول عام بصلاحية معلم التحفيظ</option>
                  {teachers.map((tch) => (
                    <option key={tch.id} value={tch.id}>
                      {tch.fullName} ({tch.specialization || 'معلم قرآن'})
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Passkey Input */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-bold text-stone-800">
                  كلمة المرور أو رمز الدخول السري:
                </label>
                <span className="text-[10px] text-stone-400">
                  رمز أمان مشفر
                </span>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={passkey}
                  onChange={(e) => setPasskey(e.target.value)}
                  placeholder="أدخل رمز الدخول المعتمد..."
                  autoFocus
                  required
                  className="w-full pr-10 pl-10 py-3 rounded-xl border border-stone-300 text-sm focus:outline-none focus:ring-2 focus:ring-stone-900 bg-stone-50 focus:bg-white transition-all"
                />
                <KeyRound className="w-4 h-4 text-stone-400 absolute right-3.5 top-3.5" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute left-3 top-3 text-stone-400 hover:text-stone-700 p-0.5 cursor-pointer"
                  title={showPassword ? 'إخفاء كلمة المرور' : 'إظهار كلمة المرور'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Quick helper note for platform authorized staff */}
            <div className="p-3 rounded-xl bg-stone-50 border border-stone-200/80 text-[11px] text-stone-600 flex items-start gap-2">
              <Sparkles className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-stone-800 block mb-0.5">رمز الاعتماد الافتراضي:</span>
                <span>
                  يمكنك استخدام الرمز الافتراضي: <code className="font-mono font-bold bg-white px-1.5 py-0.5 rounded border border-stone-200 text-stone-900">{currentMeta.defaultHint}</code> (يمكن للمدير تعديله من إعدادات النظام لاحقاً).
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-2 space-y-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full py-3 rounded-xl text-white text-xs font-bold transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer ${currentMeta.btnColor} disabled:opacity-50`}
              >
                <Lock className="w-4 h-4" />
                <span>{isSubmitting ? 'جارٍ التحقق...' : 'التحقق وتسجيل الدخول الآمن'}</span>
              </button>

              <button
                type="button"
                onClick={handleBack}
                className="w-full py-2.5 rounded-xl border border-stone-200 text-stone-700 hover:bg-stone-50 text-xs font-bold transition-colors cursor-pointer"
              >
                إلغاء والعودة للرئيسية
              </button>
            </div>
          </form>
        </div>

        {/* Protection Notice */}
        <p className="text-center text-[11px] text-stone-400">
          منصة معايشة القرآن — نظام حماية الوصول المقيد للكوادر الإدارية والتربوية
        </p>
      </div>
    </div>
  );
};
