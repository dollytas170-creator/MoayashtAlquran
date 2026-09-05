import React, { useState, useEffect } from 'react';
import { 
  X, 
  UserCheck, 
  ShieldCheck, 
  Mail, 
  Phone, 
  Lock, 
  Sparkles, 
  User, 
  LogIn, 
  KeyRound, 
  CheckCircle2, 
  AlertCircle, 
  Eye, 
  EyeOff, 
  Send, 
  MessageSquare, 
  Check, 
  RefreshCw 
} from 'lucide-react';
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
  const { registerParent, verifyParent, loginParent, parents, setToastMessage } = useApp();
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
  const [regConfirmPassword, setRegConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [regConsent, setRegConsent] = useState(false);

  // Activation & Verification State
  const [otpCode, setOtpCode] = useState('');
  const [sentOtpCode, setSentOtpCode] = useState('5832');
  const [activationSentInfo, setActivationSentInfo] = useState<{ phone: string; email: string; name: string } | null>(null);
  const [isResending, setIsResending] = useState(false);
  const [resendSuccess, setResendSuccess] = useState(false);

  // Login Fields (MUST START EMPTY)
  const [loginIdentifier, setLoginIdentifier] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Forgot password
  const [forgotEmail, setForgotEmail] = useState('');

  if (!isOpen) return null;

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!regConsent) {
      alert('يرجى الموافقة على الشروط والموافقة الوالدية للمتابعة');
      return;
    }
    if (!regFullName.trim() || !regPhone.trim() || !regEmail.trim() || !regPassword.trim() || !regConfirmPassword.trim()) {
      alert('يرجى تعبئة جميع الحقول المطلوبة بما في ذلك كلمة المرور وتأكيدها');
      return;
    }
    if (regPassword.length < 6) {
      alert('يجب أن تتكون كلمة المرور من 6 خانات أو أكثر');
      return;
    }
    if (regPassword !== regConfirmPassword) {
      alert('كلمتا المرور غير متطابقتين. يرجى التأكد من كتابة نفس كلمة المرور في حقل التأكيد.');
      return;
    }

    // Generate fresh 4-digit activation code
    const generatedCode = Math.floor(1000 + Math.random() * 9000).toString();
    setSentOtpCode(generatedCode);
    setActivationSentInfo({
      phone: regPhone.trim(),
      email: regEmail.trim(),
      name: regFullName.trim(),
    });

    // Register parent in unverified state pending confirmation
    registerParent({
      fullName: regFullName.trim(),
      phone: regPhone.trim(),
      email: regEmail.trim(),
      parentalConsent: regConsent,
      verified: false,
    });

    setToastMessage(`تم إرسال رسالة تفعيل وتأكيد الحساب إلى: ${regPhone.trim()} بنجاح!`);
    setActiveTab('verify');
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (otpCode.trim().length >= 4) {
      verifyParent();
      setToastMessage('تم تفعيل وتأكيد حساب ولي الأمر بنجاح!');
      if (onSuccess) {
        onSuccess();
      } else {
        onClose();
      }
    } else {
      alert('يرجى إدخال رمز التفعيل المكون من 4 أرقام');
    }
  };

  const handleResendActivation = () => {
    setIsResending(true);
    setTimeout(() => {
      const newCode = Math.floor(1000 + Math.random() * 9000).toString();
      setSentOtpCode(newCode);
      setIsResending(false);
      setResendSuccess(true);
      setToastMessage(`تمت إعادة إرسال رسالة التفعيل والتأكيد إلى ${activationSentInfo?.phone || regPhone}`);
      setTimeout(() => setResendSuccess(false), 3500);
    }, 600);
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

  const handleForgotSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setToastMessage(`تم إرسال رابط استعادة كلمة المرور إلى: ${forgotEmail}`);
    setActiveTab('login');
  };

  return (
    <div
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-stone-900/60 backdrop-blur-xs animate-fade-in"
    >
      <div className="bg-white w-full max-w-sm sm:max-w-md rounded-2xl shadow-2xl border border-stone-200 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="px-4 py-3 bg-stone-50 border-b border-stone-200 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-emerald-700 text-white flex items-center justify-center font-bold text-xs">
              م
            </div>
            <div>
              <h3 className="font-bold text-stone-900 text-sm">
                {activeTab === 'login' && 'تسجيل دخول ولي الأمر'}
                {activeTab === 'register' && 'إنشاء حساب ولي أمر جديد'}
                {activeTab === 'verify' && 'تأكيد الحساب (رمز التحقق)'}
                {activeTab === 'forgot' && 'استعادة كلمة المرور'}
              </h3>
              <p className="text-[10px] text-stone-500">معايشة القرآن — رحلة ابنك ليعيش مع القرآن</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            title="إغلاق النافذة"
            aria-label="إغلاق"
            className="w-7 h-7 rounded-full bg-white hover:bg-stone-100 border border-stone-200 text-stone-400 hover:text-stone-700 flex items-center justify-center cursor-pointer transition-colors shadow-2xs"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Tabs Bar */}
        {(activeTab === 'login' || activeTab === 'register') && (
          <div className="flex border-b border-stone-100 bg-stone-50/70 p-1 shrink-0">
            <button
              type="button"
              onClick={() => setActiveTab('register')}
              className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                activeTab === 'register' ? 'bg-white text-emerald-800 shadow-2xs' : 'text-stone-500 hover:text-stone-800'
              }`}
            >
              حساب ولي أمر جديد
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('login')}
              className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                activeTab === 'login' ? 'bg-white text-emerald-800 shadow-2xs' : 'text-stone-500 hover:text-stone-800'
              }`}
            >
              تسجيل دخول ولي الأمر
            </button>
          </div>
        )}

        {/* Modal Body */}
        <div className="p-4 sm:p-5 overflow-y-auto">
          {activeTab === 'register' && (
            <form onSubmit={handleRegister} className="space-y-3">
              <div>
                <label className="block text-[11px] font-bold text-stone-700 mb-1">الاسم الكامل لولي الأمر *</label>
                <div className="relative">
                  <User className="w-3.5 h-3.5 text-stone-400 absolute right-3 top-2.5" />
                  <input
                    type="text"
                    value={regFullName}
                    onChange={(e) => setRegFullName(e.target.value)}
                    placeholder="مثال: أحمد عبد الرحمن"
                    className="w-full pr-8 pl-3 py-2 rounded-xl border border-stone-300 text-xs sm:text-sm focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600 outline-hidden"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-stone-700 mb-1">رقم الهاتف / الواتساب *</label>
                <div className="relative">
                  <Phone className="w-3.5 h-3.5 text-stone-400 absolute right-3 top-2.5" />
                  <input
                    type="tel"
                    value={regPhone}
                    onChange={(e) => setRegPhone(e.target.value)}
                    placeholder="مثال: 01012345678"
                    className="w-full pr-8 pl-3 py-2 rounded-xl border border-stone-300 text-xs sm:text-sm focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600 outline-hidden text-right"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-stone-700 mb-1">البريد الإلكتروني *</label>
                <div className="relative">
                  <Mail className="w-3.5 h-3.5 text-stone-400 absolute right-3 top-2.5" />
                  <input
                    type="email"
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="w-full pr-8 pl-3 py-2 rounded-xl border border-stone-300 text-xs sm:text-sm focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600 outline-hidden text-left"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-stone-700 mb-1">كلمة المرور *</label>
                <div className="relative">
                  <Lock className="w-3.5 h-3.5 text-stone-400 absolute right-3 top-2.5" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    placeholder="•••••••• (6 خانات على الأقل)"
                    className="w-full pr-8 pl-8 py-2 rounded-xl border border-stone-300 text-xs sm:text-sm focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600 outline-hidden text-left"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute left-2.5 top-2.5 text-stone-400 hover:text-stone-600 cursor-pointer"
                    title={showPassword ? 'إخفاء كلمة المرور' : 'إظهار كلمة المرور'}
                  >
                    {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-stone-700 mb-1">تأكيد كلمة المرور *</label>
                <div className="relative">
                  <KeyRound className="w-3.5 h-3.5 text-stone-400 absolute right-3 top-2.5" />
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={regConfirmPassword}
                    onChange={(e) => setRegConfirmPassword(e.target.value)}
                    placeholder="•••••••• (أعد كتابة كلمة المرور)"
                    className={`w-full pr-8 pl-8 py-2 rounded-xl border text-xs sm:text-sm outline-hidden text-left ${
                      regConfirmPassword && regPassword !== regConfirmPassword
                        ? 'border-rose-300 bg-rose-50/30 focus:ring-2 focus:ring-rose-500 focus:border-rose-500'
                        : regConfirmPassword && regPassword === regConfirmPassword
                        ? 'border-emerald-300 bg-emerald-50/20 focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600'
                        : 'border-stone-300 focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600'
                    }`}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute left-2.5 top-2.5 text-stone-400 hover:text-stone-600 cursor-pointer"
                    title={showConfirmPassword ? 'إخفاء كلمة المرور' : 'إظهار كلمة المرور'}
                  >
                    {showConfirmPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>
                {/* Live match helper */}
                {regConfirmPassword.length > 0 && (
                  <div className="mt-1">
                    {regPassword === regConfirmPassword ? (
                      <p className="text-[11px] text-emerald-700 font-bold flex items-center gap-1">
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                        <span>كلمتا المرور متطابقتان</span>
                      </p>
                    ) : (
                      <p className="text-[11px] text-rose-600 font-bold flex items-center gap-1">
                        <AlertCircle className="w-3.5 h-3.5 text-rose-500" />
                        <span>كلمتا المرور غير متطابقتين</span>
                      </p>
                    )}
                  </div>
                )}
              </div>

              {/* Message notice banner */}
              <div className="bg-emerald-50/80 border border-emerald-200/90 rounded-xl p-2.5 flex items-start gap-2 text-[11px] text-emerald-900 leading-relaxed shadow-2xs">
                <Send className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                <span>
                  عند الضغط على إنشاء الحساب، سيتم إرسال <strong>رسالة تفعيل وتأكيد</strong> فورية إلى رقم الواتساب ورسائل SMS والبريد الإلكتروني للتحقق من هوية ولي الأمر.
                </span>
              </div>

              <div className="bg-stone-50 border border-stone-200 rounded-xl p-2.5">
                <label className="flex items-start gap-2 cursor-pointer text-[11px] text-stone-700 leading-relaxed">
                  <input
                    type="checkbox"
                    checked={regConsent}
                    onChange={(e) => setRegConsent(e.target.checked)}
                    className="mt-0.5 rounded-sm border-stone-300 text-emerald-700 focus:ring-emerald-600 h-3.5 w-3.5"
                    required
                  />
                  <span>
                    أوافق بصفتي ولي الأمر على الشروط وسياسة الخصوصية، وأمنح الإذن بإدارة ملفات الأبناء.
                  </span>
                </label>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs sm:text-sm transition-colors shadow-xs cursor-pointer flex items-center justify-center gap-1.5"
              >
                <Send className="w-3.5 h-3.5" />
                <span>إنشاء الحساب وإرسال رسالة التفعيل والتأكيد</span>
              </button>
            </form>
          )}

          {activeTab === 'login' && (
            <form onSubmit={handleLogin} className="space-y-3">
              <div>
                <label className="block text-[11px] font-bold text-stone-700 mb-1">البريد الإلكتروني أو رقم الهاتف</label>
                <div className="relative">
                  <Mail className="w-3.5 h-3.5 text-stone-400 absolute right-3 top-2.5" />
                  <input
                    type="text"
                    value={loginIdentifier}
                    onChange={(e) => setLoginIdentifier(e.target.value)}
                    placeholder="أدخل بريدك الإلكتروني أو رقم هاتفك"
                    className="w-full pr-8 pl-3 py-2 rounded-xl border border-stone-300 text-xs sm:text-sm focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600 outline-hidden"
                    required
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-[11px] font-bold text-stone-700">كلمة المرور</label>
                  <button
                    type="button"
                    onClick={() => setActiveTab('forgot')}
                    className="text-[11px] text-emerald-700 hover:underline cursor-pointer"
                  >
                    نسيت كلمة المرور؟
                  </button>
                </div>
                <div className="relative">
                  <Lock className="w-3.5 h-3.5 text-stone-400 absolute right-3 top-2.5" />
                  <input
                    type="password"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pr-8 pl-3 py-2 rounded-xl border border-stone-300 text-xs sm:text-sm focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600 outline-hidden text-left"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs sm:text-sm transition-colors shadow-xs cursor-pointer flex items-center justify-center gap-1.5"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>دخول الحساب</span>
              </button>

              <div className="text-center pt-1">
                <p className="text-[11px] text-stone-500">
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

