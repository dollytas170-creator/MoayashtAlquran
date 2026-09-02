import React, { useState } from 'react';
import {
  TreeDeciduous,
  Sparkles,
  BookOpen,
  HeartHandshake,
  CheckCircle2,
  Calendar,
  Users,
  ShieldCheck,
  Award,
  ChevronDown,
  ArrowLeft,
  ArrowRight,
  Flame,
  MessageCircle,
  HelpCircle,
  Clock,
  Coins,
  Sparkle,
  Layers,
  GraduationCap,
} from 'lucide-react';
import { useApp } from '../context/AppContext';

interface LandingPageProps {
  onOpenRegister: () => void;
  onOpenLogin: () => void;
  onGoToParentPortal: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onOpenRegister,
  onOpenLogin,
  onGoToParentPortal,
}) => {
  const { pricing, programs, activeParent, setCurrentRole } = useApp();
  const program = programs[0];

  // Sibling calculator state
  const [childrenCount, setChildrenCount] = useState<number>(2);
  const [faqOpenIndex, setFaqOpenIndex] = useState<number | null>(0);
  const [selectedAgeTab, setSelectedAgeTab] = useState<'6-9' | '10-12' | '13-15'>('6-9');

  // Pricing calculations
  const calculateTotalMonthly = (count: number) => {
    if (count <= 0) return 0;
    const firstChild = pricing.promotionalMonthlyEGP;
    const additionalChildren = (count - 1) * pricing.siblingMonthlyEGP;
    return firstChild + additionalChildren;
  };

  const calculateSavings = (count: number) => {
    const regularTotal = count * pricing.regularMonthlyEGP;
    const discountedTotal = calculateTotalMonthly(count);
    return regularTotal - discountedTotal;
  };

  const faqs = [
    {
      q: 'ما الذي يميز برنامج "معايشة القرآن" عن حلقات التحفيظ التقليدية؟',
      a: 'البرنامج لا يقتصر على الحفظ والتلقين المجرد، بل ينطلق من رحلة تربوية خماسية متكاملة (يحفظ ← يفهم ← يتدبر ← يطبق ← يعيش مع القرآن)، حيث يربط كل آية بالواقع اليومي للطفل وبناء قيمه وسلوكه وشخصيته وعلاقته بأسرته.',
    },
    {
      q: 'كيف تتوزع الجلسات المباشرة خلال الشهر؟',
      a: 'يتضمن البرنامج شهرياً 4 جلسات تدبر تفاعلية مركزة مع الكوتش، بالإضافة إلى 8 جلسات متابعة وتسميع وإتقان للتجويد مع معلمي التحفيظ، فضلاً عن المتابعة الصوتية الفردية المستمرة عبر المنصة.',
    },
    {
      q: 'هل تناسب المنصة الأعمار المختلفة من 6 إلى 15 سنة؟',
      a: 'نعم، تم تصميم المنصة بتجربة بصرية ومنهجية مكيفة بحسب الفئة العمرية (6-9 سنوات، 10-12 سنة، 13-15 سنة)، لتناسب النضج الإدراكي والاهتمامات وتمنح اليافعين بيئة ناضجة ومستقلة بينما تدعم الأطفال الصغار بمرافقة والدية وألعاب تفاعلية.',
    },
    {
      q: 'ما هو دور ولي الأمر في البرنامج؟',
      a: 'ولي الأمر شريك أصيل في الرحلة؛ حيث توفر المنصة قسماً مخصصاً بعنوان "مع الأسرة" يتضمن أنشطة بسيطة وممتعة لتطبيق الآيات منزلياً، فضلاً عن تقارير متابعة دورية وملاحظات مباشرة من المشرف التربوي.',
    },
    {
      q: 'ما هي السور المقررة في دورة الـ 3 أشهر الحالية؟',
      a: 'البرنامج الحالي يركز على ثلاث سور قرآنية تأسيسية عظيمة: الشهر الأول: سورة العلق (بداية الوحي وبناء الوعي بالقراءة والتعلم)، الشهر الثاني: سورة المزمل (القيام والزاد الروحي)، الشهر الثالث: سورة المدثر (الانطلاق والمسؤولية والعمل).',
    },
    {
      q: 'كيف يعمل خصم الأخوة وعرض الانطلاق؟',
      a: 'يحصل أول 15 مشتركاً على خصم 25% (1500 ج.م بدلاً من 2000 ج.م)، ويحصل كل ابن إضافي من نفس الأسرة على سعر الأخوة المخفض تلقائياً (1250 ج.م شهرياً).',
    },
  ];

  const journeySteps = [
    {
      step: '1',
      title: 'يحفظ',
      desc: 'إتقان الحفظ والتجويد بأحدث الوسائل التفاعلية والتسميع الصوتي المباشر.',
      color: 'bg-emerald-100 text-emerald-800 border-emerald-300',
    },
    {
      step: '2',
      title: 'يفهم',
      desc: 'إدراك معاني الكلمات وسياق الآيات بلغة سهلة تناسب عمر المتعلم.',
      color: 'bg-teal-100 text-teal-800 border-teal-300',
    },
    {
      step: '3',
      title: 'يتدبر',
      desc: 'استخراج الرسائل الربانية والخواطر العميقة في جلسات حوارية ملهمة.',
      color: 'bg-amber-100 text-amber-800 border-amber-300',
    },
    {
      step: '4',
      title: 'يطبق',
      desc: 'تحويل معاني الآيات إلى سلوكيات ومواقف يومية وأنشطة أسرية عملية.',
      color: 'bg-blue-100 text-blue-800 border-blue-300',
    },
    {
      step: '5',
      title: 'يعيش مع القرآن',
      desc: 'بناء هوية قرآنية متكاملة تصاحب ابنك في تفكيره واختياراته وحياته.',
      color: 'bg-purple-100 text-purple-800 border-purple-300',
    },
  ];

  return (
    <div className="min-h-screen bg-stone-50 text-stone-900 pb-20">
      {/* 1. Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 lg:pt-20 lg:pb-28 border-b border-stone-200 bg-gradient-to-b from-emerald-50/70 via-stone-50 to-stone-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-4xl mx-auto space-y-6">
            {/* Coach & Program Badge */}
            <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-emerald-100/80 border border-emerald-300/80 text-emerald-900 text-xs sm:text-sm font-bold shadow-xs animate-fade-in">
              <span className="w-2 h-2 rounded-full bg-emerald-600 animate-ping"></span>
              <span>{program.name}</span>
              <span className="text-emerald-700 font-semibold">• مع {program.coachName}</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-stone-900 leading-[1.25] tracking-tight">
              مش بس يحفظ القرآن…
              <br />
              <span className="text-emerald-800 underline decoration-emerald-400/50 decoration-wavy underline-offset-8">
                يفهمه، يتدبره، ويبدأ يعيشه
              </span>
            </h1>

            {/* Subheadline & Tagline */}
            <p className="text-lg sm:text-xl text-stone-600 font-medium max-w-2xl mx-auto leading-relaxed">
              رحلة تربوية قرآنية متكاملة للأبناء من <strong className="text-stone-900 font-bold">6 إلى 15 سنة</strong> تنقلهم من التسميع الآلي إلى الارتباط القلبي والسلوكي بكلام الله تعالى.
            </p>

            {/* Core Brand Quote */}
            <div className="py-2">
              <p className="text-sm sm:text-base font-bold text-emerald-900 bg-emerald-50/80 border border-emerald-200 inline-block px-5 py-2.5 rounded-2xl">
                « كل آية نزرعها اليوم… تكبر مع ابنك غدًا »
              </p>
            </div>

            {/* CTAs */}
            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={onOpenRegister}
                className="px-8 py-4 rounded-2xl bg-emerald-700 hover:bg-emerald-800 text-white font-black text-base shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5 cursor-pointer flex items-center gap-2"
              >
                <span>ابدأ رحلة ابنك مع القرآن</span>
                <ArrowLeft className="w-5 h-5" />
              </button>

              <a
                href="#concept"
                className="px-6 py-4 rounded-2xl bg-white hover:bg-stone-100 border border-stone-300 text-stone-800 font-bold text-base transition-colors cursor-pointer"
              >
                تعرف على البرنامج
              </a>

              {activeParent && (
                <button
                  type="button"
                  onClick={onGoToParentPortal}
                  className="px-6 py-4 rounded-2xl bg-stone-900 hover:bg-stone-800 text-white font-bold text-base transition-colors cursor-pointer"
                >
                  لوحة ولي الأمر
                </button>
              )}
            </div>

            {/* Promo Live Banner */}
            <div className="pt-4 flex items-center justify-center">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-50 border border-amber-300 text-amber-950 text-xs sm:text-sm font-bold">
                <Flame className="w-4 h-4 text-amber-600 animate-bounce" />
                <span>عرض الانطلاق: خصم 25% لأول 15 مشتركاً فقط ({pricing.promotionalMonthlyEGP} ج.م بدلاً من {pricing.regularMonthlyEGP} ج.م)</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Core Journey Visualizer */}
      <section id="journey" className="py-16 bg-white border-b border-stone-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-xs font-black uppercase text-emerald-700 tracking-wider mb-2">
              المنهجية التربوية
            </h2>
            <h3 className="text-2xl sm:text-3xl font-black text-stone-900">
              رحلة المعايشة الخماسية للطفل واليافع
            </h3>
            <p className="text-stone-600 text-sm mt-2">
              نتدرج مع ابنك خطوة بخطوة حتى تصبح الآية جزءاً من حياته وتفكيره
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 relative">
            {journeySteps.map((s, idx) => (
              <div
                key={s.step}
                className="relative bg-stone-50/80 rounded-2xl p-5 border border-stone-200 flex flex-col items-center text-center hover:bg-white hover:shadow-md transition-all group"
              >
                <div
                  className={`w-12 h-12 rounded-2xl border flex items-center justify-center font-black text-lg mb-3 ${s.color}`}
                >
                  {s.step}
                </div>
                <h4 className="text-lg font-black text-stone-900 mb-2">{s.title}</h4>
                <p className="text-xs text-stone-600 leading-relaxed">{s.desc}</p>

                {idx < journeySteps.length - 1 && (
                  <div className="hidden md:block absolute -left-3 top-1/2 -translate-y-1/2 z-10 text-stone-300">
                    ←
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. Concept & Why Mo'ayasha */}
      <section id="concept" className="py-16 bg-stone-50 border-b border-stone-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="inline-block px-3 py-1 rounded-lg bg-emerald-100 text-emerald-800 text-xs font-bold">
                لماذا معايشة القرآن؟
              </div>
              <h3 className="text-2xl sm:text-4xl font-black text-stone-900 leading-tight">
                نعيد للقرآن مكانته في قلب وعقل وسلوك ابنك
              </h3>
              <p className="text-stone-600 text-sm sm:text-base leading-relaxed">
                كثير من أبنائنا يحفظون القرآن دون أن يلامس قلوبهم أو ينعكس على أخلاقهم، وسرعان ما يتفلت الحفظ. في برنامج «معايشة القرآن»، نصحب الابن في بيئة تفاعلية دافئة تربط المعنى بالسلوك، وتغرس فيه حب كتاب الله تعالى ليكون دليله في الحياة.
              </p>

              <div className="space-y-3 pt-2">
                {[
                  'تثبيت الحفظ عبر التكرار الفاهم لا الآلي فقط',
                  'غرس قيم بر الوالدين، الصدق، الأمانة، والهمة العالية من سياق الآيات',
                  'إشراك الأسرة بأنشطة تطبيقية منزلية ممتعة تعزز الترابط العائلي',
                  'جلسات حوارية آمنة تطرح فيها تساؤلات الأبناء ويجاب عنها بحكمة',
                ].map((pt, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
                    <span className="text-sm font-semibold text-stone-800">{pt}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Visual Highlight Box */}
            <div className="bg-white rounded-3xl p-8 border border-stone-200 shadow-sm relative overflow-hidden">
              <div className="flex items-center gap-3 mb-6 pb-4 border-b border-stone-100">
                <div className="w-12 h-12 rounded-2xl bg-emerald-700 text-white flex items-center justify-center">
                  <TreeDeciduous className="w-6 h-6 text-emerald-200" />
                </div>
                <div>
                  <h4 className="font-bold text-stone-900 text-base">مفهوم «شجرة المعايشة» التفاعلية</h4>
                  <p className="text-xs text-stone-500">تحفيز ذاتي قائم على الإنجاز الفردي دون مقارنات سلبية</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-200/80">
                  <div className="flex items-center justify-between text-xs font-bold text-emerald-900 mb-1">
                    <span>مراحل نمو شجرة الابن:</span>
                    <span>بذرة ← غرسة ← شجرة مثمرة</span>
                  </div>
                  <p className="text-xs text-stone-600 leading-relaxed">
                    مع كل مهمة تسميع مكتملة، وخواطر تدبرية يسجلها، ومشاركة أسرية ينفذها، تنمو شجرته وتتفتح أوراقها وثمارها وأوسمتها الخاصة.
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="p-3 rounded-xl bg-stone-50 border border-stone-200">
                    <span className="font-bold text-stone-800 block mb-0.5">🌱 وسام بذرة الخير</span>
                    <span className="text-stone-500 text-[11px]">عند بداية الحفظ والانطلاق</span>
                  </div>
                  <div className="p-3 rounded-xl bg-stone-50 border border-stone-200">
                    <span className="font-bold text-stone-800 block mb-0.5">❤️ وسام عشت الآية</span>
                    <span className="text-stone-500 text-[11px]">عند التطبيق السلوكي مع الأسرة</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Age-Adaptive Experience Preview */}
      <section id="ages" className="py-16 bg-white border-b border-stone-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-10">
            <h2 className="text-xs font-black uppercase text-emerald-700 tracking-wider mb-2">
              تنوع الفئات العمرية
            </h2>
            <h3 className="text-2xl sm:text-3xl font-black text-stone-900">
              واجهة ومنهجية مخصصة لكل مرحلة عمرية
            </h3>
            <p className="text-stone-600 text-sm mt-2">
              لا نعامل اليافع ابن 14 سنة كالطفل ابن 7 سنوات؛ فلكل عمر لغته واحتياجه ونضجه
            </p>
          </div>

          {/* Age Tab Selector */}
          <div className="flex justify-center mb-8">
            <div className="inline-flex p-1 rounded-2xl bg-stone-100 border border-stone-200">
              {[
                { key: '6-9', label: '6 - 9 سنوات (الطفولة المبكرة)' },
                { key: '10-12', label: '10 - 12 سنة (الناشئة والمرحلة المتوسطة)' },
                { key: '13-15', label: '13 - 15 سنة (اليافعون والفتيان)' },
              ].map((tab) => (
                <button
                  key={tab.key}
                  type="button"
                  onClick={() => setSelectedAgeTab(tab.key as any)}
                  className={`px-4 sm:px-6 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                    selectedAgeTab === tab.key
                      ? 'bg-white text-emerald-900 shadow-xs border border-stone-200'
                      : 'text-stone-600 hover:text-stone-900'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Age Group Content Box */}
          <div className="bg-stone-50 rounded-3xl p-6 sm:p-10 border border-stone-200 max-w-4xl mx-auto">
            {selectedAgeTab === '6-9' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center animate-fade-in">
                <div className="space-y-4">
                  <div className="inline-block px-3 py-1 rounded-lg bg-emerald-100 text-emerald-800 text-xs font-bold">
                    تجربة بصرية تفاعلية محفزة
                  </div>
                  <h4 className="text-xl font-bold text-stone-900">الفئة العمرية (6 - 9 سنوات)</h4>
                  <ul className="space-y-2 text-sm text-stone-700">
                    <li className="flex items-center gap-2">
                      <span className="text-emerald-600 font-bold">✓</span>
                      <span>أزرار كبيرة وعناصر بصرية ورسومات مبهجة ومحببة.</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-emerald-600 font-bold">✓</span>
                      <span>تعليمات قصيرة ومباشرة تناسب مدارك الطفل.</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-emerald-600 font-bold">✓</span>
                      <span>مرافقة وإشراف وثيق من الوالدين لتنفيذ الأنشطة.</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-emerald-600 font-bold">✓</span>
                      <span>تحفيز مستمر بأوسمة شجرة المعايشة الملونة.</span>
                    </li>
                  </ul>
                </div>
                <div className="bg-white p-6 rounded-2xl border border-stone-200 text-center shadow-xs">
                  <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto mb-3">
                    <Sparkle className="w-8 h-8" />
                  </div>
                  <h5 className="font-bold text-stone-900 text-sm">شجرة المعايشة التفاعلية الصديقة</h5>
                  <p className="text-xs text-stone-500 mt-1">تنمو الشجرة وتكتمل أوراقها مع كل آية يتقنها الطفل ويفهمها</p>
                </div>
              </div>
            )}

            {selectedAgeTab === '10-12' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center animate-fade-in">
                <div className="space-y-4">
                  <div className="inline-block px-3 py-1 rounded-lg bg-teal-100 text-teal-800 text-xs font-bold">
                    بناء الاستقلالية والمسؤولية
                  </div>
                  <h4 className="text-xl font-bold text-stone-900">الفئة العمرية (10 - 12 سنة)</h4>
                  <ul className="space-y-2 text-sm text-stone-700">
                    <li className="flex items-center gap-2">
                      <span className="text-teal-600 font-bold">✓</span>
                      <span>لغة بصرية أكثر نضجاً وإدارة أهداف ذاتية واضحة.</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-teal-600 font-bold">✓</span>
                      <span>تحديات أسبوعية وتفكير نقدي في معاني الآيات.</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-teal-600 font-bold">✓</span>
                      <span>متابعة إنجاز المهام والتسميع الصوتي المباشر.</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-teal-600 font-bold">✓</span>
                      <span>توازن دقيق بين استقلالية الطالب وإشراف الوالدين.</span>
                    </li>
                  </ul>
                </div>
                <div className="bg-white p-6 rounded-2xl border border-stone-200 text-center shadow-xs">
                  <div className="w-16 h-16 rounded-full bg-teal-100 text-teal-700 flex items-center justify-center mx-auto mb-3">
                    <Award className="w-8 h-8" />
                  </div>
                  <h5 className="font-bold text-stone-900 text-sm">لوحة الإنجاز والتحديات</h5>
                  <p className="text-xs text-stone-500 mt-1">بطاقات تفاعلية لتنظيم خطط الحفظ وجداول المهام الأسبوعية</p>
                </div>
              </div>
            )}

            {selectedAgeTab === '13-15' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center animate-fade-in">
                <div className="space-y-4">
                  <div className="inline-block px-3 py-1 rounded-lg bg-purple-100 text-purple-800 text-xs font-bold">
                    بيئة ناضجة وراقية لليافعين
                  </div>
                  <h4 className="text-xl font-bold text-stone-900">الفئة العمرية (13 - 15 سنة)</h4>
                  <ul className="space-y-2 text-sm text-stone-700">
                    <li className="flex items-center gap-2">
                      <span className="text-purple-600 font-bold">✓</span>
                      <span>تصميم أنيق وعصري يخلو من الطابع الطفولي تماماً.</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-purple-600 font-bold">✓</span>
                      <span>مساحة للتأمل وتدوين الخواطر والتساؤلات الفكرية والتربوية.</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-purple-600 font-bold">✓</span>
                      <span>أهداف تعليمية واضحة ومسار شخصي لبناء الهوية بالقرآن.</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-purple-600 font-bold">✓</span>
                      <span>تواصل محترم مع المحفظ والكوتش كمرشدين وناصحين.</span>
                    </li>
                  </ul>
                </div>
                <div className="bg-white p-6 rounded-2xl border border-stone-200 text-center shadow-xs">
                  <div className="w-16 h-16 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center mx-auto mb-3">
                    <BookOpen className="w-8 h-8" />
                  </div>
                  <h5 className="font-bold text-stone-900 text-sm">سجل الخواطر والتدبر الشخصي</h5>
                  <p className="text-xs text-stone-500 mt-1">مساحة خاصة لليافع لتوثيق أثر الآيات في حياته وقراراته</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* 5. What the Learner Receives */}
      <section className="py-16 bg-stone-50 border-b border-stone-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-xs font-black uppercase text-emerald-700 tracking-wider mb-2">
              محتويات ومزايا البرنامج
            </h2>
            <h3 className="text-2xl sm:text-3xl font-black text-stone-900">
              ماذا يحصل ابنك خلال الشهر في معايشة القرآن؟
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: Calendar,
                title: '4 جلسات تدبر تفاعلية',
                desc: 'جلسة تدبر أسبوعية مباشرة أونلاين يقودها الكوتش لتفكيك معاني الآيات الحياتية.',
                color: 'text-emerald-700 bg-emerald-50',
              },
              {
                icon: GraduationCap,
                title: '8 جلسات متابعة حفظ',
                desc: 'جلستان أسبوعياً مع معلم التحفيظ لإتقان التلاوة وضبط مخارج الحروف والتجويد.',
                color: 'text-teal-700 bg-teal-50',
              },
              {
                icon: BookOpen,
                title: 'كتيب الأنشطة التفاعلية',
                desc: 'أوراق عمل وأسئلة تدبرية وتحديات أسبوعية تثبت المعنى في ذهن الطفل.',
                color: 'text-amber-700 bg-amber-50',
              },
              {
                icon: HeartHandshake,
                title: 'تطبيقات مع الأسرة',
                desc: 'مهمات عائلية تربط الابن بوالديه وإخوانه لتطبيق وصايا الآيات في البيت.',
                color: 'text-purple-700 bg-purple-50',
              },
            ].map((item, i) => {
              const Icon = item.icon;
              return (
                <div
                  key={i}
                  className="bg-white rounded-2xl p-6 border border-stone-200 shadow-xs hover:border-emerald-300 transition-all flex flex-col items-start"
                >
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${item.color}`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <h4 className="font-bold text-stone-900 text-base mb-2">{item.title}</h4>
                  <p className="text-xs text-stone-600 leading-relaxed">{item.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 6. Current 3-Month Surahs */}
      <section className="py-16 bg-white border-b border-stone-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <div className="inline-block px-3 py-1 rounded-lg bg-emerald-100 text-emerald-800 text-xs font-bold mb-2">
              الخطة الزمنية الحالية (3 أشهر)
            </div>
            <h3 className="text-2xl sm:text-3xl font-black text-stone-900">
              السور المقررة في دورة المعايشة
            </h3>
            <p className="text-stone-600 text-sm mt-2">
              ثلاث سور تأسيسية تبني عقل وقلب وسلوك الابن وتنقله في مسار إيماني متدرج
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {[
              {
                month: 'الشهر الأول',
                surah: 'سورة العلق',
                theme: 'بناء الوعي والتعلم ومعرفة الله',
                desc: '«اقرأ باسم ربك الذي خلق» — غرس حب القراءة والعلم والتواضع أمام عظمة الخالق سبحانه.',
                color: 'border-emerald-300 bg-emerald-50/50',
              },
              {
                month: 'الشهر الثاني',
                surah: 'سورة المزمل',
                theme: 'الزاد الروحي وقيام الليل والترتيل',
                desc: '«ورتل القرآن ترتيلا» — ترسيخ حب الصلاة والقرآن وبناء القوة الداخلية التي تعين على مواجهة الحياة.',
                color: 'border-teal-300 bg-teal-50/50',
              },
              {
                month: 'الشهر الثالث',
                surah: 'سورة المدثر',
                theme: 'الانطلاق والدعوة والمسؤولية الإيجابية',
                desc: '«قم فأنذر» — استشعار المسؤولية وبناء الشخصية الإيجابية المبادر بالخير في أسرته ومجتمعه.',
                color: 'border-amber-300 bg-amber-50/50',
              },
            ].map((s, idx) => (
              <div
                key={idx}
                className={`rounded-3xl p-6 border-2 transition-all hover:shadow-md flex flex-col justify-between ${s.color}`}
              >
                <div>
                  <span className="text-xs font-bold text-stone-500 block mb-1">{s.month}</span>
                  <h4 className="text-2xl font-black text-stone-900 mb-2">{s.surah}</h4>
                  <div className="inline-block px-2.5 py-1 rounded-md bg-white text-stone-800 text-xs font-bold mb-3 border border-stone-200">
                    {s.theme}
                  </div>
                  <p className="text-xs text-stone-600 leading-relaxed">{s.desc}</p>
                </div>
                <div className="mt-6 pt-4 border-t border-stone-200/60 flex items-center justify-between text-xs font-semibold text-emerald-800">
                  <span>المراحل: أتعلم ← أحفظ ← أفهم ← أتدبر ← أطبق</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. Pricing & Sibling Calculator */}
      <section id="pricing" className="py-16 bg-stone-50 border-b border-stone-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-xs font-black uppercase text-emerald-700 tracking-wider mb-2">
              الاستثمار في ابنك
            </h2>
            <h3 className="text-2xl sm:text-3xl font-black text-stone-900">
              خطط الاشتراك وعروض الأخوة
            </h3>
            <p className="text-stone-600 text-sm mt-2">
              استثمار حقيقي في بناء شخصية ابنك القرآنية مع خصومات عائلية خاصة
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start max-w-5xl mx-auto">
            {/* Standard vs Promo Card */}
            <div className="lg:col-span-6 bg-white rounded-3xl p-8 border-2 border-emerald-600 shadow-lg relative overflow-hidden">
              <div className="absolute top-0 left-0 bg-emerald-600 text-white px-5 py-1.5 text-xs font-black rounded-br-2xl shadow-xs">
                عرض الانطلاق (خصم 25%)
              </div>

              <div className="mb-6 pt-2">
                <h4 className="text-xl font-bold text-stone-900">الاشتراك الشهري للابن</h4>
                <p className="text-xs text-stone-500 mt-1">متاح لأول 15 مشتركاً فقط في هذه الدورة</p>
              </div>

              <div className="flex items-baseline gap-3 mb-6">
                <span className="text-4xl sm:text-5xl font-black text-emerald-800">
                  {pricing.promotionalMonthlyEGP}
                </span>
                <span className="text-sm font-bold text-stone-600">{pricing.currency} / شهرياً</span>
                <span className="text-sm text-stone-400 line-through mr-2">
                  {pricing.regularMonthlyEGP} {pricing.currency}
                </span>
              </div>

              <ul className="space-y-3 text-xs sm:text-sm text-stone-700 mb-8 pb-6 border-b border-stone-100">
                <li className="flex items-center gap-2 font-medium">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>4 جلسات تدبر شهرية مباشرة مع الكوتش</span>
                </li>
                <li className="flex items-center gap-2 font-medium">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>8 جلسات متابعة حفظ وتجويد فردي وجماعي</span>
                </li>
                <li className="flex items-center gap-2 font-medium">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>نظام التسميع الصوتي والملاحظات المستمرة</span>
                </li>
                <li className="flex items-center gap-2 font-medium">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>كتيب الأنشطة والأنشطة الأسرية وشجرة المعايشة</span>
                </li>
                <li className="flex items-center gap-2 font-medium">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>تقارير شهرية مفصلة لولي الأمر</span>
                </li>
              </ul>

              <button
                type="button"
                onClick={onOpenRegister}
                className="w-full py-3.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-sm shadow-md transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <span>اشترك الآن واستفد من الخصم</span>
                <ArrowLeft className="w-4 h-4" />
              </button>
            </div>

            {/* Sibling Dynamic Calculator */}
            <div className="lg:col-span-6 bg-white rounded-3xl p-8 border border-stone-200 shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <Users className="w-5 h-5 text-emerald-700" />
                <h4 className="text-lg font-bold text-stone-900">حاسبة اشتراك الأخوة</h4>
              </div>
              <p className="text-xs text-stone-500 mb-6 leading-relaxed">
                هل لديك أكثر من ابن؟ يحصل الابن الثاني وما بعده على سعر الأخوة المخفض (
                <strong className="text-emerald-800 font-bold">{pricing.siblingMonthlyEGP} {pricing.currency}</strong>) تلقائياً!
              </p>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-2">
                    عدد الأبناء المراد تسجيلهم:
                  </label>
                  <div className="flex items-center gap-3">
                    {[1, 2, 3, 4].map((num) => (
                      <button
                        key={num}
                        type="button"
                        onClick={() => setChildrenCount(num)}
                        className={`flex-1 py-2.5 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                          childrenCount === num
                            ? 'bg-emerald-700 text-white border-emerald-700 shadow-xs'
                            : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100'
                        }`}
                      >
                        {num === 1 && 'ابن واحد'}
                        {num === 2 && 'ابنان (أخوة)'}
                        {num === 3 && '3 أبناء'}
                        {num === 4 && '4 أبناء'}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Calculation Output Box */}
                <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200 space-y-2">
                  <div className="flex justify-between items-center text-xs text-stone-700">
                    <span>الابن الأول (عرض الانطلاق):</span>
                    <span className="font-bold">{pricing.promotionalMonthlyEGP} {pricing.currency}</span>
                  </div>

                  {childrenCount > 1 && (
                    <div className="flex justify-between items-center text-xs text-stone-700">
                      <span>الأخوة الإضافيون ({childrenCount - 1} × {pricing.siblingMonthlyEGP}):</span>
                      <span className="font-bold text-emerald-800">
                        {(childrenCount - 1) * pricing.siblingMonthlyEGP} {pricing.currency}
                      </span>
                    </div>
                  )}

                  <div className="pt-2 border-t border-emerald-200 flex justify-between items-center">
                    <span className="text-sm font-bold text-stone-900">الإجمالي الشهري للأسرة:</span>
                    <span className="text-xl font-black text-emerald-900">
                      {calculateTotalMonthly(childrenCount)} {pricing.currency}
                    </span>
                  </div>

                  {calculateSavings(childrenCount) > 0 && (
                    <div className="text-[11px] text-emerald-700 font-bold text-left pt-1">
                      🎉 وفرت مع هذا العرض: {calculateSavings(childrenCount)} {pricing.currency} شهرياً
                    </div>
                  )}
                </div>

                <button
                  type="button"
                  onClick={onOpenRegister}
                  className="w-full py-3 rounded-xl bg-stone-900 hover:bg-stone-800 text-white font-bold text-xs transition-colors cursor-pointer"
                >
                  تسجيل الأبناء والاستفادة من خصم الأخوة
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 8. Mandatory Testimonials Rule Section */}
      <section className="py-14 bg-white border-b border-stone-200">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h3 className="text-lg font-bold text-stone-900 mb-2">تجارب وآراء أولياء الأمور</h3>
          <div className="p-8 rounded-2xl bg-stone-50 border border-stone-200 text-stone-500 text-sm">
            <MessageCircle className="w-8 h-8 text-stone-400 mx-auto mb-2 opacity-60" />
            <p className="font-semibold text-stone-700">
              آراء أولياء الأمور ستظهر هنا بعد إضافتها
            </p>
            <p className="text-xs text-stone-400 mt-1">
              نلتزم بعدم وضع أي تقييمات مصطنعة أو وهمية حرصاً على الصدق والأمانة.
            </p>
          </div>
        </div>
      </section>

      {/* 9. FAQ Section */}
      <section className="py-16 bg-stone-50 border-b border-stone-200">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-xs font-black uppercase text-emerald-700 tracking-wider mb-2">
              الأسئلة المتكررة
            </h2>
            <h3 className="text-2xl font-black text-stone-900">كل ما تود معرفته عن المنصة</h3>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, i) => {
              const isOpen = faqOpenIndex === i;
              return (
                <div
                  key={i}
                  className="bg-white rounded-2xl border border-stone-200 overflow-hidden transition-all shadow-2xs"
                >
                  <button
                    type="button"
                    onClick={() => setFaqOpenIndex(isOpen ? null : i)}
                    className="w-full px-6 py-4 text-right flex items-center justify-between font-bold text-sm sm:text-base text-stone-900 hover:text-emerald-800 transition-colors cursor-pointer"
                  >
                    <span>{faq.q}</span>
                    <ChevronDown
                      className={`w-5 h-5 text-stone-400 transition-transform ${
                        isOpen ? 'rotate-180 text-emerald-700' : ''
                      }`}
                    />
                  </button>
                  {isOpen && (
                    <div className="px-6 pb-5 pt-1 text-xs sm:text-sm text-stone-600 leading-relaxed border-t border-stone-100 animate-fade-in">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 10. Bottom Registration CTA Bar */}
      <section className="py-16 bg-emerald-900 text-white text-center relative overflow-hidden">
        <div className="max-w-4xl mx-auto px-4 relative z-10 space-y-6">
          <div className="w-14 h-14 rounded-2xl bg-emerald-800/80 text-emerald-200 flex items-center justify-center mx-auto">
            <TreeDeciduous className="w-7 h-7" />
          </div>
          <h2 className="text-3xl sm:text-4xl font-black leading-tight">
            هل أنت مستعد لتبدأ مع ابنك رحلة المعايشة مع القرآن؟
          </h2>
          <p className="text-emerald-100 text-sm sm:text-base max-w-xl mx-auto leading-relaxed">
            سجل حسابك كولي أمر في دقائق، أضف أبناءك، وابدأ متابعة جلساتهم وإنجازاتهم لحظة بلحظة.
          </p>

          <div className="pt-2 flex flex-wrap items-center justify-center gap-4">
            <button
              type="button"
              onClick={onOpenRegister}
              className="px-8 py-4 rounded-2xl bg-white text-emerald-950 hover:bg-emerald-50 font-black text-base shadow-lg transition-all transform hover:scale-105 cursor-pointer flex items-center gap-2"
            >
              <span>ابدأ رحلة ابنك مع القرآن الآن</span>
              <ArrowLeft className="w-5 h-5" />
            </button>

            <button
              type="button"
              onClick={onOpenLogin}
              className="px-6 py-4 rounded-2xl bg-emerald-800/80 hover:bg-emerald-800 text-emerald-100 font-bold text-sm border border-emerald-700 transition-colors cursor-pointer"
            >
              تسجيل دخول ولي الأمر
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
