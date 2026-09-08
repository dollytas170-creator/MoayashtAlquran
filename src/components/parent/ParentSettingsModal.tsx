import React, { useState } from 'react';
import { 
  X, 
  User, 
  Phone, 
  Mail, 
  ShieldCheck, 
  CreditCard, 
  AlertTriangle, 
  CheckCircle2, 
  Save, 
  Send, 
  Users, 
  RefreshCw,
  Clock,
  AlertCircle,
  LogOut,
  UserX,
  Trash2
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface ParentSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onGoToCheckout?: () => void;
}

export const ParentSettingsModal: React.FC<ParentSettingsModalProps> = ({
  isOpen,
  onClose,
  onGoToCheckout,
}) => {
  const { 
    activeParent, 
    updateParentProfile, 
    students, 
    cancelSubscription,
    verifyParent,
    logoutParent,
    deleteParentAccount,
    setToastMessage 
  } = useApp();

  const [activeSubTab, setActiveSubTab] = useState<'profile' | 'subscriptions'>('profile');
  
  // Profile edit state
  const [name, setName] = useState(activeParent?.fullName || '');
  const [phone, setPhone] = useState(activeParent?.phone || '');
  const [email, setEmail] = useState(activeParent?.email || '');
  const [isSaved, setIsSaved] = useState(false);

  // Cancel subscription state
  const [confirmCancelChildId, setConfirmCancelChildId] = useState<string | null>(null);
  const [cancelReason, setCancelReason] = useState('ظروف عائلية مؤقتة');
  const [customReason, setCustomReason] = useState('');

  // Logout & Delete account confirmation modals
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  if (!isOpen || !activeParent) return null;

  const parentChildren = students.filter(s => s.parentId === activeParent.id);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) {
      alert('يرجى كتابة الاسم ورقم الهاتف على الأقل');
      return;
    }
    updateParentProfile({
      fullName: name.trim(),
      phone: phone.trim(),
      email: email.trim(),
    });
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  const handleExecuteLogout = () => {
    setShowLogoutConfirm(false);
    onClose();
    logoutParent();
  };

  const handleExecuteDeleteAccount = () => {
    setShowDeleteConfirm(false);
    onClose();
    deleteParentAccount(activeParent.id);
  };

  const handleExecuteCancelSubscription = (childId: string) => {
    const finalReason = cancelReason === 'أخرى' ? (customReason.trim() || 'سبب آخر') : cancelReason;
    cancelSubscription(childId, finalReason);
    setConfirmCancelChildId(null);
    setCustomReason('');
  };

  const handleSendVerificationNotice = () => {
    verifyParent(activeParent.id);
    setToastMessage(`تم إرسال رسالة التفعيل والتأكيد لرقم الواتساب والهاتف: ${activeParent.phone}`);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="bg-white rounded-3xl max-w-xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-stone-200"
        dir="rtl"
      >
        {/* Modal Header */}
        <div className="sticky top-0 bg-white/95 backdrop-blur-sm border-b border-stone-100 p-5 flex items-center justify-between z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base sm:text-lg text-stone-900">إعدادات حساب ولي الأمر</h3>
              <p className="text-xs text-stone-500">{activeParent.fullName} • {activeParent.phone}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Sub Navigation Tabs */}
        <div className="flex items-center border-b border-stone-100 px-5 pt-3 gap-2 bg-stone-50/70">
          <button
            type="button"
            onClick={() => setActiveSubTab('profile')}
            className={`pb-2.5 px-3 text-xs font-bold border-b-2 transition-all cursor-pointer flex items-center gap-1.5 ${
              activeSubTab === 'profile'
                ? 'border-emerald-600 text-emerald-800'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            <User className="w-3.5 h-3.5" />
            <span>البيانات والحساب</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveSubTab('subscriptions')}
            className={`pb-2.5 px-3 text-xs font-bold border-b-2 transition-all cursor-pointer flex items-center gap-1.5 ${
              activeSubTab === 'subscriptions'
                ? 'border-emerald-600 text-emerald-800'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            <CreditCard className="w-3.5 h-3.5" />
            <span>الاشتراكات وإلغاء الاشتراك</span>
            {parentChildren.length > 0 && (
              <span className="text-[10px] px-1.5 py-0.2 bg-emerald-100 text-emerald-800 rounded-full font-mono">
                {parentChildren.length}
              </span>
            )}
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 space-y-5">
          {/* TAB 1: Profile & Account */}
          {activeSubTab === 'profile' && (
            <div className="space-y-4">
              {/* Account Status Card */}
              <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200/80 flex items-start justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-stone-900">حالة توثيق وتأكيد الحساب:</span>
                    {activeParent.verified ? (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-bold bg-emerald-100 text-emerald-800">
                        <CheckCircle2 className="w-3 h-3" />
                        حساب مفعل ومؤكد
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-bold bg-amber-100 text-amber-900">
                        <Clock className="w-3 h-3" />
                        بانتظار تأكيد التفعيل
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-stone-500 leading-relaxed">
                    تم إرسال رسائل التأكيد والإشعارات إلى رقم الجوال والواتساب المسجل.
                  </p>
                </div>
                {!activeParent.verified && (
                  <button
                    type="button"
                    onClick={handleSendVerificationNotice}
                    className="shrink-0 px-3 py-1.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold transition-colors cursor-pointer flex items-center gap-1 shadow-2xs"
                  >
                    <Send className="w-3 h-3" />
                    <span>تأكيد الآن</span>
                  </button>
                )}
              </div>

              {/* Edit Details Form */}
              <form onSubmit={handleSaveProfile} className="space-y-3">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">الاسم الكامل لولي الأمر</label>
                  <div className="relative">
                    <User className="w-4 h-4 text-stone-400 absolute right-3 top-2.5" />
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full pr-9 pl-3 py-2 rounded-xl border border-stone-300 text-xs sm:text-sm focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600 outline-hidden"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">رقم الهاتف (الواتساب)</label>
                    <div className="relative">
                      <Phone className="w-4 h-4 text-stone-400 absolute right-3 top-2.5" />
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full pr-9 pl-3 py-2 rounded-xl border border-stone-300 text-xs sm:text-sm focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600 outline-hidden text-left"
                        dir="ltr"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">البريد الإلكتروني</label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-stone-400 absolute right-3 top-2.5" />
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full pr-9 pl-3 py-2 rounded-xl border border-stone-300 text-xs sm:text-sm focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600 outline-hidden text-left"
                        dir="ltr"
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-2 flex items-center justify-between">
                  <button
                    type="submit"
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold transition-all shadow-xs cursor-pointer"
                  >
                    <Save className="w-3.5 h-3.5" />
                    <span>حفظ التعديلات</span>
                  </button>

                  {isSaved && (
                    <span className="text-xs text-emerald-700 font-bold flex items-center gap-1 animate-in fade-in">
                      <CheckCircle2 className="w-4 h-4" />
                      تم حفظ البيانات بنجاح!
                    </span>
                  )}
                </div>
              </form>

              {/* Account Actions Section: Logout & Delete Account */}
              <div className="pt-4 border-t border-stone-200/80 space-y-3">
                <h4 className="text-xs font-bold text-stone-800 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-stone-500" />
                  <span>إجراءات وأمان الحساب</span>
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* Logout Button */}
                  <div className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200/80 flex flex-col justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2 text-stone-800 font-bold text-xs">
                        <LogOut className="w-4 h-4 text-stone-600" />
                        <span>تسجيل الخروج</span>
                      </div>
                      <p className="text-[11px] text-stone-500 mt-1 leading-relaxed">
                        الخروج من الحساب الحالي على هذا الجهاز مع إمكانية تسجيل الدخول مجدداً في أي وقت.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setShowLogoutConfirm(true)}
                      className="w-full py-2 px-3 rounded-xl bg-white border border-stone-300 text-stone-700 hover:bg-stone-100 hover:text-stone-900 text-xs font-bold transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                    >
                      <LogOut className="w-3.5 h-3.5 text-stone-600" />
                      <span>تسجيل خروج</span>
                    </button>
                  </div>

                  {/* Delete Account Button */}
                  <div className="p-3.5 rounded-2xl bg-rose-50/60 border border-rose-200 flex flex-col justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2 text-rose-800 font-bold text-xs">
                        <Trash2 className="w-4 h-4 text-rose-600" />
                        <span>إلغاء وحذف الحساب</span>
                      </div>
                      <p className="text-[11px] text-rose-600/90 mt-1 leading-relaxed">
                        حذف حساب ولي الأمر نهائياً وجميع بيانات الأبناء والاشتراكات وسجلات التقدم.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setShowDeleteConfirm(true)}
                      className="w-full py-2 px-3 rounded-xl bg-white border border-rose-300 text-rose-700 hover:bg-rose-100 hover:text-rose-800 text-xs font-bold transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                    >
                      <UserX className="w-3.5 h-3.5 text-rose-600" />
                      <span>إلغاء الحساب</span>
                    </button>
                  </div>
                </div>

                {/* Logout Confirmation Prompt */}
                {showLogoutConfirm && (
                  <div className="p-4 rounded-2xl bg-stone-100 border border-stone-300 space-y-3 animate-in fade-in">
                    <div className="flex items-start gap-2.5">
                      <LogOut className="w-5 h-5 text-stone-700 shrink-0 mt-0.5" />
                      <div>
                        <h5 className="font-bold text-xs sm:text-sm text-stone-900">تأكيد تسجيل الخروج</h5>
                        <p className="text-[11px] text-stone-600 mt-0.5 leading-relaxed">
                          هل ترغب في تسجيل الخروج الآن من حسابك؟ يمكنك العودة وتسجيل الدخول برقم هاتفك في أي وقت.
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center justify-end gap-2 pt-1">
                      <button
                        type="button"
                        onClick={() => setShowLogoutConfirm(false)}
                        className="px-3 py-1.5 rounded-xl border border-stone-300 bg-white text-stone-700 text-xs font-bold hover:bg-stone-50 cursor-pointer"
                      >
                        إلغاء
                      </button>
                      <button
                        type="button"
                        onClick={handleExecuteLogout}
                        className="px-4 py-1.5 rounded-xl bg-stone-800 hover:bg-stone-900 text-white text-xs font-bold shadow-xs cursor-pointer flex items-center gap-1.5"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        <span>تأكيد تسجيل الخروج</span>
                      </button>
                    </div>
                  </div>
                )}

                {/* Delete Account Confirmation Prompt */}
                {showDeleteConfirm && (
                  <div className="p-4 rounded-2xl bg-rose-50 border border-rose-300 space-y-3 animate-in fade-in">
                    <div className="flex items-start gap-2.5">
                      <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                      <div>
                        <h5 className="font-bold text-xs sm:text-sm text-rose-900">تحذير: إلغاء وحذف الحساب نهائياً</h5>
                        <p className="text-[11px] text-rose-700 mt-0.5 leading-relaxed">
                          هذا الإجراء سيقوم بحذف حسابك بالكامل وإزالة ملفات جميع الأبناء المرتبطين به وسجلات التلاوة وتقارير الإنجاز بشكل نهائي. لا يمكن التراجع عن هذه الخطوة.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center justify-end gap-2 pt-2 border-t border-rose-200">
                      <button
                        type="button"
                        onClick={() => setShowDeleteConfirm(false)}
                        className="px-3.5 py-2 rounded-xl border border-stone-300 bg-white text-stone-700 text-xs font-bold hover:bg-stone-50 transition-colors cursor-pointer"
                      >
                        تراجع وإلغاء
                      </button>
                      <button
                        type="button"
                        onClick={handleExecuteDeleteAccount}
                        className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-xs transition-colors cursor-pointer flex items-center gap-1.5"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>تأكيد الحذف النهائي</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 2: Subscriptions & Cancellation */}
          {activeSubTab === 'subscriptions' && (
            <div className="space-y-4">
              <div className="p-3.5 rounded-2xl bg-amber-50/80 border border-amber-200 text-amber-900 text-xs leading-relaxed flex items-start gap-2.5">
                <AlertCircle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                <div>
                  <strong className="font-bold">سياسة الاشتراكات والحفظ:</strong>
                  <p className="mt-0.5 text-amber-800 text-[11px]">
                    يمكنك إلغاء الاشتراك في أي وقت. إلغاء الاشتراك يوقف الاستقطاع المستقبلي مع الاحتفاظ الكامل بملف الطفل وإنجازاته وتلاواته المسجلة للرجوع إليها لاحقاً.
                  </p>
                </div>
              </div>

              {parentChildren.length === 0 ? (
                <div className="text-center py-6 text-stone-500 text-xs">
                  لم يتم تسجيل أي أبناء بعد في هذا الحساب.
                </div>
              ) : (
                <div className="space-y-3">
                  {parentChildren.map((child) => {
                    const isCancelled = child.subscriptionCancelled;
                    const isActive = !isCancelled && (child.status === 'active' || child.enrollmentStatus === 'active');
                    
                    return (
                      <div 
                        key={child.id}
                        className="p-4 rounded-2xl border border-stone-200 bg-white hover:border-stone-300 transition-all space-y-3"
                      >
                        <div className="flex items-center justify-between flex-wrap gap-2">
                          <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-800 flex items-center justify-center font-bold text-xs">
                              {child.fullName[0]}
                            </div>
                            <div>
                              <h4 className="text-xs sm:text-sm font-bold text-stone-900">{child.fullName}</h4>
                              <p className="text-[11px] text-stone-500">
                                {child.gender === 'male' ? 'ابن' : 'ابنة'} • العمر {child.age} سنة
                              </p>
                            </div>
                          </div>

                          <div>
                            {isCancelled ? (
                              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-rose-100 text-rose-800">
                                تم إلغاء الاشتراك
                              </span>
                            ) : isActive ? (
                              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800">
                                <CheckCircle2 className="w-3 h-3" />
                                اشتراك نشط
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-stone-100 text-stone-700">
                                بانتظار الدفع / التفعيل
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Additional status details */}
                        {isCancelled && child.subscriptionCancelReason && (
                          <div className="text-[11px] text-rose-700 bg-rose-50/70 p-2 rounded-xl border border-rose-100">
                            <strong>سبب الإلغاء المسجل:</strong> {child.subscriptionCancelReason}
                          </div>
                        )}

                        {/* Action buttons */}
                        <div className="flex items-center justify-between pt-2 border-t border-stone-100 flex-wrap gap-2">
                          {!isCancelled ? (
                            <button
                              type="button"
                              onClick={() => setConfirmCancelChildId(child.id)}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-rose-200 text-rose-700 hover:bg-rose-50 text-xs font-bold transition-colors cursor-pointer"
                            >
                              <AlertTriangle className="w-3.5 h-3.5" />
                              <span>إلغاء الاشتراك</span>
                            </button>
                          ) : (
                            <button
                              type="button"
                              onClick={() => {
                                if (onGoToCheckout) {
                                  onClose();
                                  onGoToCheckout();
                                }
                              }}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold transition-colors cursor-pointer"
                            >
                              <RefreshCw className="w-3.5 h-3.5" />
                              <span>إعادة تفعيل الاشتراك</span>
                            </button>
                          )}

                          <span className="text-[10px] text-stone-400">
                            بيانات وإنجازات الطفل محفوظة في سجل الحفظ والتقارير
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Cancel Confirmation Prompt Sub-Dialog */}
              {confirmCancelChildId && (
                <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 space-y-3 animate-in fade-in">
                  <div className="flex items-start gap-2.5 text-rose-900">
                    <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-bold text-xs sm:text-sm">تأكيد طلب إلغاء الاشتراك</h4>
                      <p className="text-[11px] text-rose-700 mt-0.5 leading-relaxed">
                        هل أنت متأكد من رغبتك في إلغاء الاشتراك لهذا الطفل؟ ستتوقف الجلسات المباشرة القادمة، مع بقاء سجل إنجازاته وتلاواته محفوظاً دائماً في حسابك.
                      </p>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-stone-700 mb-1">سبب الإلغاء (اختياري لمساعدتنا على تحسين الخدمة):</label>
                    <select
                      value={cancelReason}
                      onChange={(e) => setCancelReason(e.target.value)}
                      className="w-full px-3 py-1.5 rounded-xl border border-rose-200 bg-white text-xs focus:ring-2 focus:ring-rose-500 outline-hidden"
                    >
                      <option value="ظروف عائلية مؤقتة">ظروف عائلية مؤقتة</option>
                      <option value="تغيير جدول مواعيد الطالب">تغيير جدول مواعيد الطالب</option>
                      <option value="السفر أو الإجازة">السفر أو الإجازة</option>
                      <option value="أخرى">سبب آخر (يرجى التوضيح)</option>
                    </select>

                    {cancelReason === 'أخرى' && (
                      <input
                        type="text"
                        value={customReason}
                        onChange={(e) => setCustomReason(e.target.value)}
                        placeholder="اكتب سبب الإلغاء هنا..."
                        className="mt-2 w-full px-3 py-1.5 rounded-xl border border-rose-200 bg-white text-xs focus:ring-2 focus:ring-rose-500 outline-hidden"
                      />
                    )}
                  </div>

                  <div className="flex items-center justify-end gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => setConfirmCancelChildId(null)}
                      className="px-3 py-1.5 rounded-xl border border-stone-300 bg-white text-stone-700 text-xs font-bold hover:bg-stone-50 cursor-pointer"
                    >
                      تراجع
                    </button>
                    <button
                      type="button"
                      onClick={() => handleExecuteCancelSubscription(confirmCancelChildId)}
                      className="px-4 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-xs cursor-pointer"
                    >
                      تأكيد إلغاء الاشتراك
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-stone-100 bg-stone-50/80 flex items-center justify-between flex-wrap gap-2 rounded-b-3xl">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setShowLogoutConfirm(true)}
              className="px-3 py-1.5 rounded-xl border border-stone-300 bg-white hover:bg-stone-100 text-stone-700 text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <LogOut className="w-3.5 h-3.5 text-stone-500" />
              <span>تسجيل خروج</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setShowDeleteConfirm(true);
                setActiveSubTab('profile');
              }}
              className="px-3 py-1.5 rounded-xl border border-rose-200 bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <UserX className="w-3.5 h-3.5 text-rose-600" />
              <span>إلغاء الحساب</span>
            </button>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-stone-200 hover:bg-stone-300 text-stone-800 text-xs font-bold transition-colors cursor-pointer"
          >
            إغلاق
          </button>
        </div>
      </div>
    </div>
  );
};
