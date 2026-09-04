import React, { useState } from 'react';
import {
  CreditCard,
  ShieldCheck,
  CheckCircle2,
  Users,
  Sparkles,
  ArrowLeft,
  ArrowRight,
  Printer,
  Download,
  Receipt,
  Smartphone,
  Building,
  Tag,
  AlertCircle,
  X,
  Home,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { PaymentRecord } from '../types';

interface CheckoutViewProps {
  onBackToParent: () => void;
  onGoToStudentDashboard: () => void;
  onBackToHome?: () => void;
}

export const CheckoutView: React.FC<CheckoutViewProps> = ({
  onBackToParent,
  onGoToStudentDashboard,
  onBackToHome,
}) => {
  const {
    students,
    pricing,
    activeParent,
    processPayment,
    payments,
    programs,
    setCurrentRole,
  } = useApp();

  const program = programs[0];
  const parentChildren = students.filter(
    (s) => (s.parentId === activeParent?.id || activeParent === null) && s.status !== 'archived'
  );

  const [selectedStudentIds, setSelectedStudentIds] = useState<string[]>(() =>
    parentChildren.map((c) => c.id)
  );
  const [planType, setPlanType] = useState<'monthly' | 'full_program'>('monthly');
  const [paymentMethod, setPaymentMethod] = useState<'credit_card' | 'vodafone_cash' | 'fawry'>('credit_card');
  const [couponCode, setCouponCode] = useState('');
  const [couponError, setCouponError] = useState<string | null>(null);
  const [completedPayment, setCompletedPayment] = useState<PaymentRecord | null>(null);

  // Card Inputs (Empty by default)
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [vodafoneNumber, setVodafoneNumber] = useState('');

  const toggleStudentSelection = (id: string) => {
    if (selectedStudentIds.includes(id)) {
      if (selectedStudentIds.length === 1) {
        alert('يجب تحديد طالب واحد على الأقل للاشتراك');
        return;
      }
      setSelectedStudentIds((prev) => prev.filter((s) => s !== id));
    } else {
      setSelectedStudentIds((prev) => [...prev, id]);
    }
  };

  // Pricing calculations
  const calculateTotal = () => {
    let subtotal = 0;
    const selected = parentChildren.filter((c) => selectedStudentIds.includes(c.id));

    selected.forEach((student, index) => {
      let baseRate = pricing.promotionalMonthlyEGP;
      if (index > 0) {
        baseRate = pricing.siblingMonthlyEGP;
      } else if (pricing.promoSubscribersCount >= pricing.promoCapacity) {
        baseRate = pricing.regularMonthlyEGP;
      }

      if (planType === 'full_program') {
        subtotal += baseRate * 3 * 0.9;
      } else {
        subtotal += baseRate;
      }
    });

    let discount = 0;
    if (couponCode.trim()) {
      const coupon = pricing.coupons.find(
        (c) => c.code.toUpperCase() === couponCode.trim().toUpperCase() && c.active
      );
      if (coupon) {
        discount = (subtotal * coupon.discountPercent) / 100;
      }
    }

    return Math.max(0, subtotal - discount);
  };

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    const coupon = pricing.coupons.find(
      (c) => c.code.toUpperCase() === couponCode.trim().toUpperCase() && c.active
    );
    if (!coupon) {
      setCouponError('كوبون الخصم غير صالح أو منتهي الصلاحية');
    } else {
      setCouponError(null);
    }
  };

  const handlePay = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedStudentIds.length === 0) {
      alert('يرجى اختيار طالب واحد على الأقل');
      return;
    }

    const rec = processPayment({
      studentIds: selectedStudentIds,
      planType,
      paymentMethod,
      couponCode: couponCode.trim() || undefined,
    });

    setCompletedPayment(rec);
  };

  return (
    <div className="min-h-screen bg-stone-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Navigation / Close Bar */}
        <div className="flex items-center justify-between mb-8 flex-wrap gap-3">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                setCurrentRole('public');
                onBackToHome?.();
              }}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white border border-emerald-300 text-emerald-800 hover:bg-emerald-50 text-sm font-bold transition-colors cursor-pointer shadow-2xs"
              title="العودة إلى الواجهة الرئيسية للمنصة"
            >
              <Home className="w-4 h-4 text-emerald-700" />
              <span>الواجهة الرئيسية</span>
            </button>

            <button
              type="button"
              onClick={onBackToParent}
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white border border-stone-200 text-stone-700 hover:text-stone-900 hover:bg-stone-100 text-sm font-semibold transition-colors cursor-pointer shadow-2xs"
              title="إغلاق والعودة إلى لوحة ولي الأمر"
            >
              <ArrowRight className="w-4 h-4" />
              <span>لوحة ولي الأمر</span>
            </button>
          </div>
          
          <div className="flex items-center gap-3">
            <span className="text-xs font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-full">
              بوابة الدفع الآمنة
            </span>

            <button
              type="button"
              onClick={onBackToParent}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white hover:bg-stone-100 border border-stone-200 text-stone-600 hover:text-stone-900 text-xs font-bold transition-colors cursor-pointer shadow-2xs"
              title="إغلاق نافذة الدفع والعودة"
              aria-label="إغلاق نافذة الدفع"
            >
              <X className="w-4 h-4 text-stone-500" />
              <span>إغلاق النافذة</span>
            </button>
          </div>
        </div>

        {!completedPayment ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left Col: Order Details & Options */}
            <div className="lg:col-span-7 space-y-6">
              {/* Step 1: Children Selection */}
              <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-xs">
                <h3 className="text-base font-bold text-stone-900 mb-1 flex items-center gap-2">
                  <Users className="w-4 h-4 text-emerald-700" />
                  <span>1. تحديد الأبناء للاشتراك في البرنامج</span>
                </h3>
                <p className="text-xs text-stone-500 mb-4">
                  يتم تطبيق خصم الأخوة تلقائياً ابتداءً من الابن الثاني
                </p>

                {parentChildren.length === 0 ? (
                  <div className="p-4 rounded-xl bg-stone-50 border border-stone-200 text-center text-xs text-stone-600">
                    لم تقم بإضافة أبناء بعد.{' '}
                    <button
                      type="button"
                      onClick={onBackToParent}
                      className="text-emerald-700 font-bold underline"
                    >
                      أضف طفلاً الآن
                    </button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {parentChildren.map((child, index) => {
                      const isChecked = selectedStudentIds.includes(child.id);
                      return (
                        <div
                          key={child.id}
                          onClick={() => toggleStudentSelection(child.id)}
                          className={`p-3.5 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                            isChecked
                              ? 'border-emerald-600 bg-emerald-50/70 text-emerald-950'
                              : 'border-stone-200 bg-white text-stone-600'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <input
                              type="checkbox"
                              checked={isChecked}
                              readOnly
                              className="rounded-sm border-stone-300 text-emerald-700 h-4 w-4"
                            />
                            <div>
                              <p className="text-sm font-bold">{child.fullName}</p>
                              <p className="text-[11px] text-stone-500">
                                {child.age} سنوات • {index === 0 ? 'الابن الأول (عرض الانطلاق)' : 'ابن إضافي (خصم الأخوة)'}
                              </p>
                            </div>
                          </div>
                          <span className="text-xs font-bold text-emerald-900">
                            {index === 0 ? pricing.promotionalMonthlyEGP : pricing.siblingMonthlyEGP} {pricing.currency}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Step 2: Duration Plan */}
              <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-xs">
                <h3 className="text-base font-bold text-stone-900 mb-1">
                  2. خطة الدفع
                </h3>
                <div className="grid grid-cols-2 gap-3 mt-4">
                  <button
                    type="button"
                    onClick={() => setPlanType('monthly')}
                    className={`p-4 rounded-xl border text-right transition-all cursor-pointer ${
                      planType === 'monthly'
                        ? 'border-emerald-600 bg-emerald-50 text-emerald-950 ring-2 ring-emerald-600/20'
                        : 'border-stone-200 hover:bg-stone-50'
                    }`}
                  >
                    <span className="text-xs font-bold block mb-1">دفع شهري متجدد</span>
                    <span className="text-[11px] text-stone-500">تجديد تلقائي شهرياً</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPlanType('full_program')}
                    className={`p-4 rounded-xl border text-right transition-all cursor-pointer ${
                      planType === 'full_program'
                        ? 'border-emerald-600 bg-emerald-50 text-emerald-950 ring-2 ring-emerald-600/20'
                        : 'border-stone-200 hover:bg-stone-50'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-bold">دفع كامل (3 أشهر)</span>
                      <span className="text-[10px] bg-emerald-200 text-emerald-900 px-1.5 py-0.5 rounded-sm font-bold">
                        وفر 10% إضافي
                      </span>
                    </div>
                    <span className="text-[11px] text-stone-500">شامل سورة العلق والمزمل والمدثر</span>
                  </button>
                </div>
              </div>

              {/* Step 3: Payment Gateway Selection */}
              <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-xs">
                <h3 className="text-base font-bold text-stone-900 mb-3">
                  3. طريقة الدفع المعتمدة (مصر)
                </h3>

                <div className="grid grid-cols-3 gap-2 mb-4">
                  {[
                    { id: 'credit_card', label: 'بطاقة بنكية', icon: CreditCard },
                    { id: 'vodafone_cash', label: 'فودافون كاش', icon: Smartphone },
                    { id: 'fawry', label: 'فوري باي', icon: Building },
                  ].map((m) => {
                    const Icon = m.icon;
                    const isSelected = paymentMethod === m.id;
                    return (
                      <button
                        key={m.id}
                        type="button"
                        onClick={() => setPaymentMethod(m.id as any)}
                        className={`p-3 rounded-xl border text-center transition-all cursor-pointer flex flex-col items-center gap-1.5 ${
                          isSelected
                            ? 'border-emerald-600 bg-emerald-50 text-emerald-900 font-bold'
                            : 'border-stone-200 text-stone-600 hover:bg-stone-50'
                        }`}
                      >
                        <Icon className="w-5 h-5 text-emerald-700" />
                        <span className="text-xs">{m.label}</span>
                      </button>
                    );
                  })}
                </div>

                {/* Gateway Inputs */}
                {paymentMethod === 'credit_card' && (
                  <div className="space-y-3 pt-2">
                    <div>
                      <label className="block text-xs font-semibold text-stone-700 mb-1">
                        رقم البطاقة الائتمانية / الخصم
                      </label>
                      <input
                        type="text"
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value)}
                        placeholder="•••• •••• •••• ••••"
                        maxLength={19}
                        className="w-full px-3.5 py-2 rounded-xl border border-stone-300 text-sm focus:ring-2 focus:ring-emerald-600 outline-hidden font-mono text-left"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-semibold text-stone-700 mb-1">
                          تاريخ الانتهاء
                        </label>
                        <input
                          type="text"
                          value={cardExpiry}
                          onChange={(e) => setCardExpiry(e.target.value)}
                          placeholder="MM/YY"
                          maxLength={5}
                          className="w-full px-3.5 py-2 rounded-xl border border-stone-300 text-sm focus:ring-2 focus:ring-emerald-600 outline-hidden font-mono text-left"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-stone-700 mb-1">
                          رمز الأمان (CVV)
                        </label>
                        <input
                          type="password"
                          value={cardCvv}
                          onChange={(e) => setCardCvv(e.target.value)}
                          placeholder="•••"
                          maxLength={4}
                          className="w-full px-3.5 py-2 rounded-xl border border-stone-300 text-sm focus:ring-2 focus:ring-emerald-600 outline-hidden font-mono text-left"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {paymentMethod === 'vodafone_cash' && (
                  <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 space-y-2">
                    <p className="font-bold">تعليمات الدفع عبر محفظة فودافون كاش / المحافظ الإلكترونية:</p>
                    <p>أدخل رقم الهاتف المسجل عليه المحفظة وسيصلك إشعار بالدفع الفوري.</p>
                    <input
                      type="tel"
                      value={vodafoneNumber}
                      onChange={(e) => setVodafoneNumber(e.target.value)}
                      placeholder="010XXXXXXXX"
                      className="w-full px-3.5 py-2 rounded-xl bg-white border border-amber-300 text-sm font-mono text-left"
                    />
                  </div>
                )}

                {paymentMethod === 'fawry' && (
                  <div className="p-4 rounded-xl bg-blue-50 border border-blue-200 text-xs text-blue-900">
                    <p className="font-bold mb-1">الدفع عبر فوري Pay:</p>
                    <p>سيتم توليد كود فوري صالح لمدة 48 ساعة للسداد من أي منفذ فوري في مصر.</p>
                  </div>
                )}

                <div className="mt-4 flex items-center gap-2 text-[11px] text-stone-500">
                  <ShieldCheck className="w-4 h-4 text-emerald-700" />
                  <span>معاملات مشفرة 256-bit SSL بدون تخزين أرقام البطاقات الحساسة.</span>
                </div>
              </div>
            </div>

            {/* Right Col: Order Summary */}
            <div className="lg:col-span-5 space-y-6">
              <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-sm sticky top-24">
                <h4 className="text-base font-bold text-stone-900 pb-3 border-b border-stone-100 flex items-center justify-between">
                  <span>ملخص الفاتورة</span>
                  <Receipt className="w-4 h-4 text-stone-400" />
                </h4>

                <div className="py-4 space-y-2.5 text-xs text-stone-600">
                  <div className="flex justify-between">
                    <span>البرنامج:</span>
                    <span className="font-bold text-stone-900">{program.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>عدد الطلاب المحددين:</span>
                    <span className="font-bold text-stone-900">{selectedStudentIds.length} طالب</span>
                  </div>
                  <div className="flex justify-between">
                    <span>خطة الدفع:</span>
                    <span className="font-bold text-stone-900">
                      {planType === 'monthly' ? 'شهري' : 'البرنامج كاملاً (3 أشهر)'}
                    </span>
                  </div>
                </div>

                {/* Coupon Input */}
                <form onSubmit={handleApplyCoupon} className="pt-2 pb-4 border-t border-stone-100">
                  <label className="block text-xs font-semibold text-stone-700 mb-1">كوبون الخصم</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      placeholder="MOAYASHA25"
                      className="flex-1 px-3 py-2 rounded-xl border border-stone-300 text-xs text-left uppercase tracking-wider outline-hidden"
                    />
                    <button
                      type="submit"
                      className="px-3.5 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-bold cursor-pointer"
                    >
                      تطبيق
                    </button>
                  </div>
                  {couponError && (
                    <p className="text-[11px] text-rose-600 mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      <span>{couponError}</span>
                    </p>
                  )}
                </form>

                {/* Total */}
                <div className="pt-4 border-t border-stone-200 flex justify-between items-baseline mb-6">
                  <span className="text-sm font-bold text-stone-900">الإجمالي المستحق:</span>
                  <div className="text-left">
                    <span className="text-2xl font-black text-emerald-800">{calculateTotal()}</span>
                    <span className="text-xs font-bold text-stone-500 mr-1">{pricing.currency}</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handlePay}
                  className="w-full py-3.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-sm shadow-md transition-colors cursor-pointer flex items-center justify-center gap-2"
                >
                  <ShieldCheck className="w-5 h-5" />
                  <span>تأكيد الدفع وإصدار الفاتورة</span>
                </button>
              </div>
            </div>
          </div>
        ) : (
          /* Payment Success & Arabic Official Receipt */
          <div className="bg-white rounded-3xl p-8 border border-emerald-300 shadow-xl max-w-2xl mx-auto space-y-6 animate-fade-in">
            <div className="text-center pb-6 border-b border-stone-200">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto mb-3">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h3 className="text-2xl font-black text-stone-900">تم الدفع وتأكيد الاشتراك بنجاح!</h3>
              <p className="text-xs text-stone-500 mt-1">
                رقم الفاتورة: <strong className="text-stone-800 font-mono">{completedPayment.invoiceNumber}</strong>
              </p>
            </div>

            {/* Official Printable Receipt Card */}
            <div className="bg-stone-50/80 rounded-2xl p-6 border border-stone-200 space-y-4">
              <div className="flex justify-between items-center pb-3 border-b border-stone-200">
                <div>
                  <h4 className="font-bold text-stone-900 text-sm">إيصال سداد إلكتروني معتمد</h4>
                  <p className="text-[11px] text-stone-500">معايشة القرآن — Mo'ayasha Education</p>
                </div>
                <span className="px-2.5 py-1 rounded-md bg-emerald-100 text-emerald-800 font-bold text-xs">
                  مدفوع بالكامل ✓
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4 text-xs">
                <div>
                  <span className="text-stone-400 block mb-0.5">اسم ولي الأمر:</span>
                  <span className="font-bold text-stone-800">{completedPayment.receiptDetails.payerName}</span>
                </div>
                <div>
                  <span className="text-stone-400 block mb-0.5">تاريخ السداد:</span>
                  <span className="font-bold text-stone-800">
                    {new Date(completedPayment.paidAt).toLocaleDateString('ar-EG')}
                  </span>
                </div>
                <div>
                  <span className="text-stone-400 block mb-0.5">الطلاب المشتركون:</span>
                  <span className="font-bold text-emerald-900">
                    {completedPayment.receiptDetails.studentNames.join('، ')}
                  </span>
                </div>
                <div>
                  <span className="text-stone-400 block mb-0.5">طريقة الدفع:</span>
                  <span className="font-bold text-stone-800">
                    {completedPayment.paymentMethod === 'credit_card' && 'بطاقة بنكية'}
                    {completedPayment.paymentMethod === 'vodafone_cash' && 'فودافون كاش'}
                    {completedPayment.paymentMethod === 'fawry' && 'فوري باي'}
                  </span>
                </div>
              </div>

              <div className="pt-3 border-t border-stone-200">
                <div className="space-y-1.5">
                  {completedPayment.receiptDetails.breakdown.map((item, idx) => (
                    <div key={idx} className="flex justify-between text-xs text-stone-600">
                      <span>{item.item}</span>
                      <span className="font-mono font-semibold">
                        {item.amount} {completedPayment.currency}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="pt-3 mt-3 border-t border-stone-300 flex justify-between items-center">
                  <span className="font-bold text-stone-900 text-sm">المبلغ الإجمالي المدفوع:</span>
                  <span className="text-xl font-black text-emerald-800">
                    {completedPayment.amount} {completedPayment.currency}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
              <button
                type="button"
                onClick={() => window.print()}
                className="px-4 py-2.5 rounded-xl border border-stone-300 bg-white hover:bg-stone-50 text-stone-700 text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <Printer className="w-4 h-4" />
                <span>طباعة الإيصال الرسمي</span>
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={onBackToParent}
                  className="px-4 py-2.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-bold transition-colors cursor-pointer"
                >
                  لوحة ولي الأمر
                </button>
                <button
                  type="button"
                  onClick={onGoToStudentDashboard}
                  className="px-5 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold shadow-xs transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <span>دخول بوابة رحلتي مع القرآن</span>
                  <ArrowLeft className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
