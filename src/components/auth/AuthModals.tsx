import React, { useState, useEffect } from 'react';
import { X, UserCheck, ShieldCheck, Mail, Phone, Lock, Sparkles, User, LogIn, KeyRound } from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: 'login' | 'register' | 'verify' | 'forgot';
  onSwitchTab?: () => void;
  onSuccess?: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  initialTab = 'login',
  onSwitchTab,
  onSuccess,
}) => {
  const { registerParent, loginParent, parents, setToastMessage } = useApp();
  const [activeTab, setActiveTab] = useState<'login' | 'register' | 'verify' | 'forgot'>(initialTab);

  useEffect(() => {
    if (isOpen) {
      setActiveTab(initialTab);
    }
  }, [isOpen, initialTab]);

  // Registration Fields (MUST START EMPTY)
  const [regFullName, setRegFullName] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConsent, setRegConsent] = useState(false);

  // Login Fields (MUST START EMPTY)
  const [loginIdentifier, setLoginIdentifier] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // OTP Verification Fields
  const [otpCode, setOtpCode] = useState('');

  // Forgot password
  const [forgotEmail, setForgotEmail] = useState('');

  if (!isOpen) return null;

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!regConsent) {
      alert('يرجى الموافقة على الشروط والموافقة الوالدية للمتابعة');
      return;
    }
    if (!regFullName.trim() || !regPhone.trim() || !regEmail.trim()) {
      alert('يرجى تعبئة جميع الحقول المطلوبة');
      return;
    }

    registerParent({
      fullName: regFullName.trim(),
      phone: regPhone.trim(),
      email: regEmail.trim(),
      parentalConsent: regConsent,
    });

    if (onSuccess) {
      onSuccess();
    } else {
      onClose();
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginIdentifier.trim()) {
      alert('يرجى إدخال البريد الإلكتروني أو رقم الهاتف');
      return;
    }

    const success = loginParent(loginIdentifier.trim());
    if (success) {
      if (onSuccess) {
        onSuccess();
      } else {
        onClose();
      }
    } else {
      if (parents.length === 0) {
        alert('لا توجد حسابات مسجلة بعد. يرجى إنشاء حساب ولي أمر جديد أولاً.');
        setActiveTab('register');
      } else {
        alert('البيانات غير مطابقة. تأكد من البريد الإلكتروني أو الهاتف المسجل.');
      }
    }
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (otpCode.length >= 4) {
      setToastMessage('تم التحقق من الحساب بنجاح!');
      if (onSuccess) {
        onSuccess();
      } else {
        onClose();
      }
    } else {
      alert('يرجى إدخال رمز التحقق المكون من 4 أرقام');
    }
  };

  const handleForgotSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setToastMessage(`تم إرسال رابط استعادة كلمة المرور إلى: ${forgotEmail}`);
    setActiveTab('login');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs animate-fade-in">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl border border-stone-200 overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 bg-stone-50 border-b border-stone-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-700 text-white flex items-center justify-center font-bold text-sm">
              م
            </div>
            <div>
              <h3 className="font-bold text-stone-900 text-base">
                {activeTab === 'login' && 'تسجيل الدخول'}
                {activeTab === 'register' && 'إنشاء حساب ولي أمر جديد'}
                {activeTab === 'verify' && 'تأكيد الحساب (رمز التحقق)'}
                {activeTab === 'forgot' && 'استعادة كلمة المرور'}
              </h3>
              <p className="text-xs text-stone-500">معايشة القرآن — رحلة ابنك ليعيش مع القرآن</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white border border-stone-200 text-stone-400 hover:text-stone-700 flex items-center justify-center cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tabs Bar */}
        {(activeTab === 'login' || activeTab === 'register') && (
          <div className="flex border-b border-stone-100 bg-stone-50/50 p-1">
            <button
              type="button"
              onClick={() => setActiveTab('register')}
              className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                activeTab === 'register' ? 'bg-white text-emerald-800 shadow-xs' : 'text-stone-500 hover:text-stone-800'
              }`}
            >
              حساب ولي أمر جديد
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('login')}
              className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                activeTab === 'login' ? 'bg-white text-emerald-800 shadow-xs' : 'text-stone-500 hover:text-stone-800'
              }`}
            >
              تسجيل الدخول
            </button>
          </div>
        )}

        {/* Modal Body */}
        <div className="p-6">
          {activeTab === 'register' && (
            <form onSubmit={handleRegister} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">الاسم الكامل لولي الأمر</label>
                <div className="relative">
                  <User className="w-4 h-4 text-stone-400 absolute right-3 top-3" />
                  <input
                    type="text"
                    value={regFullName}
                    onChange={(e) => setRegFullName(e.target.value)}
                    placeholder="مثال: أحمد عبد الرحمن"
                    className="w-full pr-9 pl-3.5 py-2.5 rounded-xl border border-stone-300 text-sm focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600 outline-hidden"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">رقم الهاتف / الواتساب</label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-stone-400 absolute right-3 top-3" />
                  <input
                    type="tel"
                    value={regPhone}
                    onChange={(e) => setRegPhone(e.target.value)}
                    placeholder="مثال: 01012345678"
                    className="w-full pr-9 pl-3.5 py-2.5 rounded-xl border border-stone-300 text-sm focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600 outline-hidden text-right"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">البريد الإلكتروني</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-stone-400 absolute right-3 top-3" />
                  <input
                    type="email"
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="w-full pr-9 pl-3.5 py-2.5 rounded-xl border border-stone-300 text-sm focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600 outline-hidden text-left"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">كلمة المرور</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-stone-400 absolute right-3 top-3" />
                  <input
                    type="password"
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pr-9 pl-3.5 py-2.5 rounded-xl border border-stone-300 text-sm focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600 outline-hidden text-left"
                    required
                  />
                </div>
              </div>

              <div className="bg-emerald-50/70 border border-emerald-200 rounded-xl p-3">
                <label className="flex items-start gap-2.5 cursor-pointer text-xs text-stone-700 leading-relaxed">
                  <input
                    type="checkbox"
                    checked={regConsent}
                    onChange={(e) => setRegConsent(e.target.checked)}
                    className="mt-0.5 rounded-sm border-stone-300 text-emerald-700 focus:ring-emerald-600 h-4 w-4"
                    required
                  />
                  <span>
                    أوافق بصفتي ولي الأمر على شروط الاستخدام وسياسة حماية خصوصية الأبناء، وأمنح الإذن بإدارة ملفاتهم التعليمية.
                  </span>
                </label>
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-sm transition-colors shadow-xs cursor-pointer flex items-center justify-center gap-2"
              >
                <Sparkles className="w-4 h-4" />
                <span>إنشاء الحساب ومتابعة إضافة الأبناء</span>
              </button>
            </form>
          )}

          {activeTab === 'login' && (
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">البريد الإلكتروني أو رقم الهاتف</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-stone-400 absolute right-3 top-3" />
                  <input
                    type="text"
                    value={loginIdentifier}
                    onChange={(e) => setLoginIdentifier(e.target.value)}
                    placeholder="أدخل بريدك الإلكتروني أو رقم هاتفك"
                    className="w-full pr-9 pl-3.5 py-2.5 rounded-xl border border-stone-300 text-sm focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600 outline-hidden"
                    required
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-semibold text-stone-700">كلمة المرور</label>
                  <button
                    type="button"
                    onClick={() => setActiveTab('forgot')}
                    className="text-xs text-emerald-700 hover:underline cursor-pointer"
                  >
                    نسيت كلمة المرور؟
                  </button>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-stone-400 absolute right-3 top-3" />
                  <input
                    type="password"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pr-9 pl-3.5 py-2.5 rounded-xl border border-stone-300 text-sm focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600 outline-hidden text-left"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-sm transition-colors shadow-xs cursor-pointer flex items-center justify-center gap-2"
              >
                <LogIn className="w-4 h-4" />
                <span>دخول الحساب</span>
              </button>

              <div className="text-center pt-2">
                <p className="text-xs text-stone-500">
                  ليس لديك حساب ولي أمر بعد؟{' '}
                  <button
                    type="button"
                    onClick={() => setActiveTab('register')}
                    className="text-emerald-700 font-bold hover:underline cursor-pointer"
                  >
                    سجل الآن
                  </button>
                </p>
              </div>
            </form>
          )}

          {activeTab === 'forgot' && (
            <form onSubmit={handleForgotSubmit} className="space-y-4">
              <p className="text-xs text-stone-600 leading-relaxed">
                أدخل بريدك الإلكتروني المسجل وسنرسل لك رابطاً آمناً لإعادة تعيين كلمة المرور فوراً.
              </p>
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">البريد الإلكتروني</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-stone-400 absolute right-3 top-3" />
                  <input
                    type="email"
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="w-full pr-9 pl-3.5 py-2.5 rounded-xl border border-stone-300 text-sm focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600 outline-hidden text-left"
                    required
                  />
                </div>
              </div>
              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-sm transition-colors cursor-pointer"
              >
                إرسال رابط الاستعادة
              </button>
              <div className="text-center">
                <button
                  type="button"
                  onClick={() => setActiveTab('login')}
                  className="text-xs text-stone-500 hover:text-stone-800 cursor-pointer"
                >
                  العودة لتسجيل الدخول
                </button>
              </div>
            </form>
          )}

          {activeTab === 'verify' && (
            <form onSubmit={handleVerifyOtp} className="space-y-4 text-center">
              <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-700 flex items-center justify-center mx-auto mb-2">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h4 className="text-sm font-bold text-stone-800">أدخل رمز التحقق (OTP)</h4>
              <p className="text-xs text-stone-500">تم إرسال رمز تحقق مكون من 4 أرقام لهاتفك المسجل</p>
              <input
                type="text"
                maxLength={4}
                value={otpCode}
                onChange={(e) => setOtpCode(e.target.value)}
                placeholder="0000"
                className="w-32 mx-auto text-center tracking-widest text-2xl font-mono py-2 rounded-xl border border-stone-300 focus:ring-2 focus:ring-emerald-600 outline-hidden"
              />
              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-sm cursor-pointer"
              >
                تأكيد ومتابعة
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export const RegisterModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onSwitchToLogin?: () => void;
  onSuccess?: () => void;
}> = ({ isOpen, onClose, onSwitchToLogin, onSuccess }) => (
  <AuthModal
    isOpen={isOpen}
    onClose={onClose}
    initialTab="register"
    onSwitchTab={onSwitchToLogin}
    onSuccess={onSuccess}
  />
);

export const LoginModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onSwitchToRegister?: () => void;
  onSuccess?: () => void;
}> = ({ isOpen, onClose, onSwitchToRegister, onSuccess }) => (
  <AuthModal
    isOpen={isOpen}
    onClose={onClose}
    initialTab="login"
    onSwitchTab={onSwitchToRegister}
    onSuccess={onSuccess}
  />
);

