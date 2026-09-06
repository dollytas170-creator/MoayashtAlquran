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
  X,
  Compass,
  Target,
  Smile,
  Gamepad2,
  Lightbulb,
  Eye,
  Mic,
  UserCheck,
  FileText,
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
  const [ageViewMode, setAgeViewMode] = useState<'tabs' | 'compare'>('tabs');
  const [selectedDeliverable, setSelectedDeliverable] = useState<number | null>(null);
  const [selectedFollowUpTab, setSelectedFollowUpTab] = useState<number>(0);
  const [followUpViewMode, setFollowUpViewMode] = useState<'tabs' | 'timeline' | 'grid'>('tabs');
  const [selectedJourneyIndex, setSelectedJourneyIndex] = useState<number>(0);
  const [journeyViewMode, setJourneyViewMode] = useState<'tabs' | 'grid'>('tabs');

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
      shortTitle: '1. الحفظ والترتيل',
      subtitle: 'ضبط الألفاظ ومخارج الحروف والتجويد الرصين',
      desc: 'انطلاق الرحلة من إتقان النص القرآني وضبط مخارج الحروف وأحكام التجويد بأحدث الوسائل التفاعلية والتسميع الصوتي المباشر الفردي، مع محفظين مجازين يراعون قدرة كل طفل وسرعته الاستيعابية دون أي ضغط أو مقارنات سلبية.',
      color: 'bg-emerald-100 text-emerald-800 border-emerald-300',
      activeColor: 'bg-emerald-700 text-white',
      badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-200',
      icon: BookOpen,
      tools: ['تسميع صوتي تفاعلي', 'جلستان أسبوعياً', 'تصحيح فردي', 'متابعة الإتقان'],
      elements: [
        'تسميع صوتي مباشر ومسجل عبر المنصة مع تغذية راجعة وتصحيح فوري من المحفظ.',
        'جلستان أسبوعياً فردية أو ثنائية (25-30 دقيقة) مع نخبة من المحفظين المجازين والمؤهلين تربوياً.',
        'التركيز على صحة التلاوة، ضبط مخارج الحروف السليمة، والترتيل المتأني الهادئ.',
        'تقارير فورية لولي الأمر تسجل درجات الإتقان وعدد الآيات المنجزة وملاحظات المعلم.',
      ],
      practicalExample: {
        surah: 'سورة العلق (الآيات 1 - 5)',
        text: '﴿اقْرَأْ بِاسْمِ رَبِّكَ الَّذِي خَلَقَ ۝ خَلَقَ الْإِنسَانَ مِنْ عَلَقٍ ۝ اقْرَأْ وَرَبُّكَ الْأَكْرَمُ﴾',
        action: 'تسجيل التلاوة وضبط قلقلة القاف في ﴿اقْرَأْ﴾ وترقيق الراء في ﴿وَرَبُّكَ﴾ مع المحفظ.',
      },
      outcome: 'إتقان نطق الآيات برصانة وثقة، وانطلاق لسان الابن بالقرآن بطلاقة دون تلعثم أو تردد.',
    },
    {
      step: '2',
      title: 'يفهم',
      shortTitle: '2. الفهم والمعاني',
      subtitle: 'إدراك معاني المفردات والسياق القرآني بلغة ميسرة',
      desc: 'الانتقال من الحفظ المجرد إلى فتح أبواب المعرفة؛ حيث يتعرف الابن على معاني الكلمات الغريبة وسياق نزول السورة بأسلوب تفاعلي مشوق وخرائط ذهنية ميسرة تناسب نضجه الإدراكي وفئته العمرية.',
      color: 'bg-teal-100 text-teal-800 border-teal-300',
      activeColor: 'bg-teal-700 text-white',
      badgeColor: 'bg-teal-100 text-teal-800 border-teal-200',
      icon: Compass,
      tools: ['خرائط ذهنية مصورة', 'كتيب الأنشطة', 'قصة السورة', 'معجم الصغار'],
      elements: [
        'خرائط مفاهيمية ورسوم إيضاحية جذابة داخل كتيب الأنشطة التفاعلي الشهري.',
        'شرح ميسر لأسباب النزول وقصص السور بما يعمق التعلق بكلمات الوحي.',
        'تفكيك الألفاظ القرآنية غير المألوفة وربطها باللغة الحية التي يفهمها الابن.',
        'اختبارات ممتعة وألغاز استنباطية سريعة تثبت المعنى في الذاكرة دون تلقين جاف.',
      ],
      practicalExample: {
        surah: 'سورة العلق — معاني الآيات',
        text: 'معرفة قصة أول لقاء بين النبي ﷺ وجبريل عليه السلام في غار حراء ونزول الوحي.',
        action: 'توضيح معنى كلمة ﴿عَلَق﴾ (مراحل خلق الجنين) ومعنى ﴿عَلَّمَ بِالْقَلَمِ﴾ وقيمة تدوين العلم.',
      },
      outcome: 'تحول الآيات من مجرد ألفاظ صماء إلى معانٍ مضيئة واضحة ومفهومة في عقل الابن ووجدانه.',
    },
    {
      step: '3',
      title: 'يتدبر',
      shortTitle: '3. التدبر والتأمل',
      subtitle: 'استخراج الرسائل الإلهية والخواطر القلبية في جلسات ملهمة',
      desc: 'جلسات تدبر أسبوعية مباشرة يقودها الكوتش التربوي في مجموعات حوارية صغيرة وآمنة، يطرح فيها الطلاب تساؤلاتهم ويستنبطون الرسائل الموجهة لحياتهم اليومية وكيف يخاطبنا الله عز وجل في كل آية.',
      color: 'bg-amber-100 text-amber-800 border-amber-300',
      activeColor: 'bg-amber-700 text-white',
      badgeColor: 'bg-amber-100 text-amber-800 border-amber-200',
      icon: Flame,
      tools: ['جلسة تدبر أسبوعية', 'حوار الكوتش', 'دفتر الخواطر', 'مجموعات صغيرة'],
      elements: [
        'جلسة تدبر جماعية أسبوعية (45 دقيقة) مع الكوتش في مجموعات حوارية صغيرة (5-8 طلاب).',
        'طرح أسئلة تأملية عميقة تحرك المشاعر والعقل (لماذا أمرنا الله بهذا؟ كيف نرى أثره في واقعنا؟).',
        'بيئة آمنة تتقبل تساؤلات الأبناء وتجيب عنها باحتواء وحكمة تربوية بالغة.',
        'تسجيل «خاطرة تدبرية» خاصة بكل ابن داخل حسابه تضاف مباشرة إلى شجرة المعايشة.',
      ],
      practicalExample: {
        surah: 'سورة العلق — التدبر الحي',
        text: '﴿اقْرَأْ بِاسْمِ رَبِّكَ الَّذِي خَلَقَ﴾ — لماذا كانت أول كلمة نزلت هي «اقرأ»؟',
        action: 'تأمل الابن في كيف أن العلم هو سلاح المؤمن للتغلب على الجهل، وربط القراءة والتعلم بذكر الله.',
      },
      outcome: 'بناء عقلية ناقدة ومفكرة، وغرس علاقة حب عميقة وشوق وجداني مستمر لكتاب الله تعالى.',
    },
    {
      step: '4',
      title: 'يطبق',
      shortTitle: '4. التطبيق والعمل',
      subtitle: 'تحويل معاني الآيات إلى سلوكيات ومواقف يومية وأنشطة أسرية',
      desc: 'القرآن نزل ليعمل به؛ لذلك نوفر بطاقات «عشت الآية» ومهام أسرية أسبوعية محددة وقابلة للتنفيذ المباشر داخل البيت ومع الأصدقاء، بإشراف وتأكيد ومشاركة مباشرة من ولي الأمر.',
      color: 'bg-blue-100 text-blue-800 border-blue-300',
      activeColor: 'bg-blue-700 text-white',
      badgeColor: 'bg-blue-100 text-blue-800 border-blue-200',
      icon: HeartHandshake,
      tools: ['بطاقات عشت الآية', 'مهمات منزلية', 'تطبيق أسري', 'تأكيد الوالدين'],
      elements: [
        'بطاقات أسبوعية بعنوان «عشت الآية» تترجم هداية السورة إلى موقف سلوكي عملي محدد.',
        'جلسات حوارية عائلية قصيرة (10-15 دقيقة) ينفذها الابن مع والديه وإخوانه في المنزل.',
        'إشراك ولي الأمر في توثيق إنجاز النشاط بضغطة زر داخل لوحة التحكم مع إضافة ملاحظاته.',
        'منح الابن وسام «عشت الآية» ونقاط مميزة فور إتمام التطبيق العملي ونمو أوراق شجرته.',
      ],
      practicalExample: {
        surah: 'سورة العلق — التطبيق الأسري',
        text: 'تطبيق عملي لأمر ﴿اقْرَأْ﴾ و﴿عَلَّمَ بِالْقَلَمِ﴾ في محيط الأسرة.',
        action: 'مهمة الابن: قراءة قصة نافعة مع الوالدين، أو كتابة ملخص لمعلومة قيمة وتعليمها لأخيه الأصغر.',
      },
      outcome: 'ظهور أثر القرآن في بر الوالدين، وصدق الحديث، وحسن الخلق، وتحمل المسؤولية الأسرية.',
    },
    {
      step: '5',
      title: 'يعيش مع القرآن',
      shortTitle: '5. المعايشة والهوية',
      subtitle: 'بناء هوية قرآنية متكاملة تصاحب الابن في تفكيره واختياراته وحياته',
      desc: 'غاية البرنامج الكبرى: أن يصبح القرآن دليلاً ذاتياً يحرك اختيارات الابن ويوجه بوصلته الأخلاقية، وتنمو شجرة المعايشة الخاصة به لتصبح شجرة باسقة مثمرة تظلل حياته بالبركة والهدى.',
      color: 'bg-purple-100 text-purple-800 border-purple-300',
      activeColor: 'bg-purple-700 text-white',
      badgeColor: 'bg-purple-100 text-purple-800 border-purple-200',
      icon: TreeDeciduous,
      tools: ['شجرة المعايشة', 'أوسمة التميز', 'استدامة الأثر', 'شخصية قيادية'],
      elements: [
        'اكتمال نمو «شجرة المعايشة» التفاعلية الخاصة بالطالب وظهور ثمار إنجازاته وأوسمته.',
        'الاحتكام للقرآن كمرجعية ذاتية في مواجهة التحديات والأفكار والمواقف اليومية.',
        'حفلات تكريم دورية وشهادات إتمام واحتفاء مجتمعي ملهم يرسخ الفخر بالهوية الإسلامية.',
        'استمرار الأثر التربوي بعد انتهاء الدورة وتحول السلوك القرآني إلى نمط حياة أصيل.',
      ],
      practicalExample: {
        surah: 'أثر معايشة سورة العلق في الحياة',
        text: 'أن يرى الابن نفسه طالباً للعلم دائماً، متواضعاً لعظمة الخالق ﴿كَلَّا إِنَّ الْإِنسَانَ لَيَطْغَىٰ ۝ أَن رَّآهُ اسْتَغْنَىٰ﴾.',
        action: 'استحضار التواضع الدائم، وعدم الغرور بالمهارات أو الإنجازات، واللجوء لله تعالى في كل أمر.',
      },
      outcome: 'شخصية مسلمة واعية، معتزة بدينها وقرآنها، مؤهلة لقيادة المستقبل بأخلاق وقيم راسخة.',
    },
  ];

  return (
    <div className="min-h-screen bg-stone-50 text-stone-900 pb-20 select-none cursor-default">
      {/* 1. Hero Section */}
      <section className="relative overflow-hidden min-h-[calc(100vh-6.5rem)] flex flex-col justify-center py-6 sm:py-8 lg:py-10 border-b border-stone-200 bg-gradient-to-b from-emerald-50/70 via-stone-50 to-stone-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full my-auto">
          <div className="text-center max-w-3xl mx-auto space-y-3 sm:space-y-3.5">
            {/* Main Headline */}
            <h1 className="text-xl sm:text-2.5xl lg:text-3.5xl font-black text-stone-900 leading-[1.2] tracking-tight">
              مش بس يحفظ القرآن...
              <br />
              <span className="text-emerald-800">
                يفهمه، يتدبره، ويبدأ يعيشه
              </span>
            </h1>

            {/* Wavy line decoration matching screenshot */}
            <div className="flex justify-center -mt-1 mb-0.5">
              <svg className="w-56 sm:w-72 h-4 sm:h-4.5 text-emerald-400" viewBox="0 0 320 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M5 8 Q 15 1, 25 8 T 45 8 T 65 8 T 85 8 T 105 8 T 125 8 T 145 8 T 165 8 T 185 8 T 205 8 T 225 8 T 245 8 T 265 8 T 285 8 T 305 8" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" />
                <path d="M12 14 Q 22 7, 32 14 T 52 14 T 72 14 T 92 14 T 112 14 T 132 14 T 152 14 T 172 14 T 192 14 T 212 14 T 232 14 T 252 14 T 272 14 T 292 14" stroke="currentColor" strokeWidth="3" strokeLinecap="round" opacity="0.8" />
              </svg>
            </div>

            {/* Subheadline & Tagline */}
            <p className="text-xs sm:text-sm md:text-base text-stone-600 font-medium max-w-xl mx-auto leading-relaxed">
              رحلة تربوية متكاملة للأبناء من 6 إلى 15 سنة تنقلهم من التسميع الآلي إلى الارتباط القلبي والسلوكي بكلام الله تعالى.
            </p>

            {/* Core Brand Quote */}
            <div className="py-0.5 sm:py-1">
              <p className="text-xs sm:text-sm font-bold text-emerald-800 bg-emerald-50/90 border border-emerald-300 inline-flex items-center gap-1.5 px-5 py-1.5 rounded-xl shadow-2xs">
                <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                <span>« كل آية نزرعها اليوم... تكبر مع ابنك غدًا »</span>
              </p>
            </div>

            {/* CTAs */}
            <div className="flex flex-wrap items-center justify-center gap-2.5 sm:gap-3 pt-0.5 sm:pt-1">
              <a
                href="#about-program"
                className="px-5 sm:px-6 py-2.5 rounded-xl bg-white hover:bg-stone-50 border border-stone-200 text-stone-800 font-bold text-xs sm:text-sm transition-colors cursor-pointer flex items-center gap-2 whitespace-nowrap shadow-2xs hover:shadow-xs"
              >
                <BookOpen className="w-3.5 h-3.5 text-stone-600" />
                <span>تعرف على البرنامج</span>
              </a>

              <button
                type="button"
                onClick={onOpenRegister}
                className="px-6 sm:px-7 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs sm:text-sm shadow-sm hover:shadow-md transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap hover:scale-102 active:scale-98"
              >
                <span>ابدأ رحلة ابنك مع القرآن</span>
                <ArrowLeft className="w-4 h-4" />
              </button>
            </div>

            {/* Promo Live Banner */}
            <div className="pt-1 sm:pt-1.5 flex items-center justify-center">
              <div className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-amber-50/90 border border-amber-300 text-amber-950 text-[11px] sm:text-xs font-bold shadow-2xs">
                <Flame className="w-3.5 h-3.5 text-amber-600 animate-bounce" />
                <span>عرض الانطلاق: خصم 25% لأول 15 مشتركاً فقط ({pricing.promotionalMonthlyEGP} ج.م بدلاً من {pricing.regularMonthlyEGP} ج.م)</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. About Program Comprehensive Section (Concept, Methodology, Ages, and Follow-up) */}
      <section id="about-program" className="scroll-mt-16 py-16 bg-white border-b border-stone-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <div className="inline-block px-3 py-1 rounded-lg bg-emerald-100 text-emerald-800 text-xs font-bold mb-2">
              عن البرنامج وآلية العمل
            </div>
            <h2 className="text-2xl sm:text-4xl font-black text-stone-900">
              برنامج متكامل يجمع بين الحفظ الرصين وبناء الشخصية بالقرآن
            </h2>
            <p className="text-stone-600 text-sm sm:text-base mt-3 leading-relaxed">
              صُمم برنامج «معايشة القرآن» ليعالج مشكلة الحفظ السريع المنفصل عن الفهم والسلوك، عبر الجمع بين حلقات التسميع وضبط التجويد الفردية، وجلسات التدبر التفاعلية، والأنشطة الأسرية اليومية.
            </p>
          </div>

          {/* 3 Pillars Overview Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
            <div className="p-6 rounded-2xl bg-emerald-50/70 border border-emerald-200/90 text-center flex flex-col justify-between hover:shadow-md transition-all">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-emerald-700 text-white flex items-center justify-center mx-auto mb-3 shadow-xs">
                  <BookOpen className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-stone-900 text-base mb-1.5">1. المنهجية الخماسية</h3>
                <p className="text-xs text-stone-600 leading-relaxed mb-3">
                  التدرج التربوي المتكامل من ضبط الألفاظ والتلاوة، إلى فهم المعاني، ثم التدبر واستخراج الرسائل، والتطبيق العملي، حتى يعيش الابن مع القرآن منهجاً وهوية.
                </p>

                {/* Mini Steps Flow Badges */}
                <div className="flex flex-wrap items-center justify-center gap-1.5 mb-4">
                  {journeySteps.map((st, i) => (
                    <button
                      key={st.step}
                      type="button"
                      onClick={() => {
                        setSelectedJourneyIndex(i);
                        setJourneyViewMode('tabs');
                        const el = document.getElementById('journey');
                        if (el) el.scrollIntoView({ behavior: 'smooth' });
                      }}
                      className={`text-[11px] font-bold px-2 py-1 rounded-lg border transition-all cursor-pointer ${
                        selectedJourneyIndex === i
                          ? 'bg-emerald-700 text-white border-emerald-700 shadow-xs'
                          : 'bg-white text-stone-700 border-stone-200 hover:bg-emerald-50'
                      }`}
                    >
                      {st.shortTitle}
                    </button>
                  ))}
                </div>
              </div>

              <a
                href="#journey"
                onClick={(e) => {
                  e.preventDefault();
                  setJourneyViewMode('tabs');
                  const el = document.getElementById('journey');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
                className="inline-flex items-center justify-center gap-1.5 mt-2 py-2 px-3 rounded-xl bg-emerald-100/80 hover:bg-emerald-200 text-xs font-bold text-emerald-900 transition-colors cursor-pointer"
              >
                <span>استعراض تبويب المنهجية وعناصرها</span>
                <ArrowLeft className="w-3.5 h-3.5" />
              </a>
            </div>

            <div className="p-6 rounded-2xl bg-teal-50/60 border border-teal-200/80 text-center flex flex-col justify-between hover:shadow-md transition-all">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-teal-700 text-white flex items-center justify-center mx-auto mb-3 shadow-xs">
                  <Users className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-stone-900 text-base mb-1.5">2. فئات عمرية مخصصة (6 - 15 سنة)</h3>
                <p className="text-xs text-stone-600 leading-relaxed mb-3">
                  مراعاة كاملة للخصائص النمائية للطفل واليافع؛ فلا يعامل اليافع كالطفل، بل لكل سن أسلوبه وأنشطته ولغته التربوية المحببة.
                </p>

                {/* Quick Age Group Badges */}
                <div className="flex flex-wrap items-center justify-center gap-1.5 mb-3">
                  {[
                    { key: '6-9', label: '6 - 9 سنوات (الطفولة)' },
                    { key: '10-12', label: '10 - 12 سنة (الناشئة)' },
                    { key: '13-15', label: '13 - 15 سنة (اليافعون)' },
                  ].map((tab) => (
                    <button
                      key={tab.key}
                      type="button"
                      onClick={() => {
                        setSelectedAgeTab(tab.key as any);
                        setAgeViewMode('tabs');
                        const el = document.getElementById('ages');
                        if (el) el.scrollIntoView({ behavior: 'smooth' });
                      }}
                      className={`text-[11px] font-bold px-2 py-1 rounded-lg border transition-all cursor-pointer ${
                        selectedAgeTab === tab.key
                          ? 'bg-teal-700 text-white border-teal-700 shadow-xs'
                          : 'bg-white text-stone-700 border-stone-200 hover:bg-teal-50'
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>
              </div>
              <a
                href="#ages"
                onClick={(e) => {
                  e.preventDefault();
                  setAgeViewMode('tabs');
                  const el = document.getElementById('ages');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
                className="inline-flex items-center justify-center gap-1.5 mt-2 py-2 px-3 rounded-xl bg-teal-100/80 hover:bg-teal-200 text-xs font-bold text-teal-900 transition-colors cursor-pointer"
              >
                <span>استعراض تبويب الفئات وعناصرها</span>
                <ArrowLeft className="w-3.5 h-3.5" />
              </a>
            </div>

            <div className="p-6 rounded-2xl bg-amber-50/60 border border-amber-200/80 text-center flex flex-col justify-between hover:shadow-md transition-all">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-amber-700 text-white flex items-center justify-center mx-auto mb-3 shadow-xs">
                  <Calendar className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-stone-900 text-base mb-1.5">3. آلية متابعة شهرية شاملة</h3>
                <p className="text-xs text-stone-600 leading-relaxed mb-3">
                  4 جلسات تدبر جماعية، 8 جلسات متابعة حفظ وتجويد فردية، كتيب أنشطة تفاعلي، مهمات أسرية، وتقارير دورية تتاح لولي الأمر.
                </p>

                {/* Quick Pillar 3 Tab Selector Badges */}
                <div className="flex flex-wrap items-center justify-center gap-1.5 mb-3">
                  {[
                    { idx: 0, label: '4 تدبر' },
                    { idx: 1, label: '8 حفظ فردي' },
                    { idx: 2, label: 'كتيب الأنشطة' },
                    { idx: 3, label: 'عشت الآية' },
                    { idx: 4, label: 'تقارير ولي الأمر' },
                  ].map((tab) => (
                    <button
                      key={tab.idx}
                      type="button"
                      onClick={() => {
                        setSelectedFollowUpTab(tab.idx);
                        setFollowUpViewMode('tabs');
                        const el = document.getElementById('deliverables');
                        if (el) el.scrollIntoView({ behavior: 'smooth' });
                      }}
                      className={`text-[11px] font-bold px-2 py-1 rounded-lg border transition-all cursor-pointer ${
                        selectedFollowUpTab === tab.idx
                          ? 'bg-amber-700 text-white border-amber-700 shadow-xs'
                          : 'bg-white text-stone-700 border-stone-200 hover:bg-amber-50'
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>
              </div>
              <a
                href="#deliverables"
                onClick={(e) => {
                  e.preventDefault();
                  setFollowUpViewMode('tabs');
                  const el = document.getElementById('deliverables');
                  if (el) {
                    el.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
                className="inline-flex items-center justify-center gap-1.5 mt-2 px-3.5 py-1.5 rounded-xl bg-amber-100 hover:bg-amber-200 text-amber-900 text-xs font-bold transition-all cursor-pointer shadow-2xs hover:scale-105 active:scale-95"
              >
                <span>استعراض تبويب آلية المتابعة وعناصرها</span>
                <ArrowLeft className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Core Five-Fold Methodology Section (تبويب المنهجية الخماسية الموسع) */}
      <section id="journey" className="py-16 sm:py-20 lg:py-24 bg-stone-50 border-b border-stone-200 scroll-mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-12">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold border border-emerald-200 mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              <span>المنهجية التربوية المعتمدة</span>
            </div>
            <h3 className="text-2xl sm:text-3.5xl font-black text-stone-900 tracking-tight">
              رحلة المعايشة الخماسية للطفل واليافع
            </h3>
            <p className="text-stone-600 text-sm sm:text-base mt-2.5 leading-relaxed">
              نتدرج مع ابنك خطوة بخطوة من إتقان وضبط حروف القرآن إلى فهم معانيه، وتدبر رسائله، وتطبيقه في واقعه الأسري، حتى تصبح الآية جزءاً أصيلاً من هويته وسلوكه اليومي.
            </p>

            {/* View Mode Toggle Controls */}
            <div className="mt-6 inline-flex p-1 rounded-2xl bg-stone-200/80 border border-stone-300">
              <button
                type="button"
                onClick={() => setJourneyViewMode('tabs')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                  journeyViewMode === 'tabs'
                    ? 'bg-white text-stone-900 shadow-xs'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                <span>عرض التبويب المفصل الموسّع</span>
              </button>
              <button
                type="button"
                onClick={() => setJourneyViewMode('grid')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                  journeyViewMode === 'grid'
                    ? 'bg-white text-stone-900 shadow-xs'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>عرض المسار الخماسي الكامل</span>
              </button>
            </div>
          </div>

          {/* TAB VIEW MODE */}
          {journeyViewMode === 'tabs' ? (
            <div className="space-y-6">
              {/* 5 Stage Tab Buttons Strip */}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5 sm:gap-3">
                {journeySteps.map((s, idx) => {
                  const Icon = s.icon;
                  const isActive = selectedJourneyIndex === idx;
                  return (
                    <button
                      key={s.step}
                      type="button"
                      onClick={() => setSelectedJourneyIndex(idx)}
                      className={`p-3.5 sm:p-4 rounded-2xl border text-right transition-all flex flex-col justify-between cursor-pointer relative ${
                        isActive
                          ? 'bg-white border-emerald-600 shadow-md ring-2 ring-emerald-600/30'
                          : 'bg-stone-100/90 border-stone-200 hover:bg-white hover:border-stone-300 text-stone-600'
                      }`}
                    >
                      <div className="flex items-center justify-between w-full mb-2">
                        <div
                          className={`w-8 h-8 rounded-xl flex items-center justify-center font-black text-xs ${
                            isActive ? s.activeColor : s.color
                          }`}
                        >
                          {s.step}
                        </div>
                        <Icon
                          className={`w-4 h-4 ${
                            isActive ? 'text-emerald-700' : 'text-stone-400'
                          }`}
                        />
                      </div>

                      <div>
                        <h4
                          className={`font-black text-base sm:text-lg mb-0.5 ${
                            isActive ? 'text-stone-900' : 'text-stone-700'
                          }`}
                        >
                          {s.title}
                        </h4>
                        <p className="text-[11px] text-stone-500 font-medium truncate">
                          {s.shortTitle}
                        </p>
                      </div>

                      {isActive && (
                        <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-8 h-1 bg-emerald-600 rounded-full" />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Active Step Detailed Content & Elements Showcase */}
              {(() => {
                const current = journeySteps[selectedJourneyIndex];
                const Icon = current.icon;

                return (
                  <div className="bg-white rounded-3xl p-6 sm:p-8 lg:p-10 border border-stone-200 shadow-sm space-y-8 animate-fade-in">
                    {/* Header of Active Step */}
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-stone-100">
                      <div className="flex items-start sm:items-center gap-4">
                        <div
                          className={`w-14 h-14 sm:w-16 sm:h-16 rounded-2xl flex items-center justify-center font-black text-2xl shadow-xs shrink-0 ${current.activeColor}`}
                        >
                          <Icon className="w-7 h-7" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-xs font-black uppercase text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full border border-emerald-200">
                              المرحلة {current.step} من 5
                            </span>
                            <span className="text-xs font-bold text-stone-500">
                              {current.shortTitle}
                            </span>
                          </div>
                          <h4 className="text-2xl sm:text-3xl font-black text-stone-900">
                            {current.title}
                          </h4>
                          <p className="text-xs sm:text-sm font-semibold text-emerald-700 mt-1">
                            {current.subtitle}
                          </p>
                        </div>
                      </div>

                      {/* Navigation Prev / Next Controls */}
                      <div className="flex items-center gap-2 self-end md:self-center">
                        <button
                          type="button"
                          disabled={selectedJourneyIndex === 0}
                          onClick={() => setSelectedJourneyIndex(prev => Math.max(0, prev - 1))}
                          className={`px-3.5 py-2 rounded-xl text-xs font-bold border transition-colors inline-flex items-center gap-1 cursor-pointer ${
                            selectedJourneyIndex === 0
                              ? 'bg-stone-100 text-stone-400 border-stone-200 cursor-not-allowed'
                              : 'bg-white text-stone-700 border-stone-300 hover:bg-stone-50'
                          }`}
                        >
                          <ArrowRight className="w-3.5 h-3.5" />
                          <span>السابق</span>
                        </button>
                        <span className="text-xs font-bold text-stone-500 px-1">
                          {selectedJourneyIndex + 1} / 5
                        </span>
                        <button
                          type="button"
                          disabled={selectedJourneyIndex === journeySteps.length - 1}
                          onClick={() => setSelectedJourneyIndex(prev => Math.min(journeySteps.length - 1, prev + 1))}
                          className={`px-3.5 py-2 rounded-xl text-xs font-bold border transition-colors inline-flex items-center gap-1 cursor-pointer ${
                            selectedJourneyIndex === journeySteps.length - 1
                              ? 'bg-stone-100 text-stone-400 border-stone-200 cursor-not-allowed'
                              : 'bg-emerald-700 text-white border-emerald-700 hover:bg-emerald-800 shadow-xs'
                          }`}
                        >
                          <span>التالي</span>
                          <ArrowLeft className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Detailed Description */}
                    <div>
                      <h5 className="text-xs font-black uppercase text-stone-400 tracking-wider mb-2">
                        فلسفة المرحلة ودورها في بناء الابن
                      </h5>
                      <p className="text-sm sm:text-base text-stone-700 leading-relaxed bg-stone-50/70 p-4 sm:p-5 rounded-2xl border border-stone-200">
                        {current.desc}
                      </p>
                    </div>

                    {/* Tools & Tags */}
                    <div>
                      <h5 className="text-xs font-black uppercase text-stone-400 tracking-wider mb-2.5">
                        الأدوات والوسائل المعتمدة في المرحلة
                      </h5>
                      <div className="flex flex-wrap gap-2">
                        {current.tools.map((t) => (
                          <span
                            key={t}
                            className="px-3 py-1.5 rounded-xl bg-stone-100 border border-stone-200 text-stone-800 text-xs font-bold flex items-center gap-1.5"
                          >
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Core Elements (عناصر المرحلة بالتفصيل) */}
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <h5 className="text-sm sm:text-base font-bold text-stone-900 flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                          <span>عناصر المرحلة وآلية التطبيق في المنصة:</span>
                        </h5>
                        <span className="text-xs text-stone-500 font-medium">
                          4 عناصر رئيسية
                        </span>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                        {current.elements.map((el, i) => (
                          <div
                            key={i}
                            className="p-4 rounded-2xl border border-stone-200 bg-stone-50/60 hover:bg-white hover:border-emerald-200 transition-all flex items-start gap-3"
                          >
                            <div className="w-6 h-6 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                              {i + 1}
                            </div>
                            <p className="text-xs sm:text-sm text-stone-700 leading-relaxed font-medium">
                              {el}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Two-Column Showcase: Practical Example & Behavior Outcome */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-2">
                      {/* Practical Example */}
                      <div className="p-5 sm:p-6 rounded-2xl bg-amber-50/70 border border-amber-200 space-y-3">
                        <div className="flex items-center gap-2 text-amber-900 font-bold text-xs">
                          <BookOpen className="w-4 h-4 text-amber-700" />
                          <span>مثال تطبيقي حي من المنهج ({current.practicalExample.surah}):</span>
                        </div>
                        <p className="text-xs sm:text-sm font-serif font-bold text-stone-900 leading-relaxed bg-white/80 p-3 rounded-xl border border-amber-200/60">
                          {current.practicalExample.text}
                        </p>
                        <div className="text-xs text-stone-700 leading-relaxed">
                          <strong className="text-amber-950 block mb-1">المهمة المباشرة للابن:</strong>
                          {current.practicalExample.action}
                        </div>
                      </div>

                      {/* Character Outcome */}
                      <div className="p-5 sm:p-6 rounded-2xl bg-emerald-50/70 border border-emerald-200 space-y-3 flex flex-col justify-between">
                        <div className="space-y-2">
                          <div className="flex items-center gap-2 text-emerald-900 font-bold text-xs">
                            <Target className="w-4 h-4 text-emerald-700" />
                            <span>المخرج السلوكي وبناء الشخصية:</span>
                          </div>
                          <h6 className="font-bold text-stone-900 text-sm sm:text-base">
                            الأثر المستدام في حياة الابن
                          </h6>
                          <p className="text-xs sm:text-sm text-stone-700 leading-relaxed">
                            {current.outcome}
                          </p>
                        </div>
                        <div className="pt-2 border-t border-emerald-200/60 flex items-center justify-between text-[11px] text-emerald-800 font-bold">
                          <span>توثيق الأثر في شجرة المعايشة</span>
                          <span>✓ وسام المرحلة</span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })()}
            </div>
          ) : (
            /* FULL 5-STAGE EXPANDED GRID VIEW */
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 sm:gap-5 relative">
              {journeySteps.map((s, idx) => {
                const Icon = s.icon;
                return (
                  <div
                    key={s.step}
                    className="relative bg-white rounded-3xl p-5 sm:p-6 border border-stone-200 flex flex-col justify-between hover:shadow-lg hover:border-emerald-300 transition-all group"
                  >
                    <div>
                      {/* Step Header */}
                      <div className="flex items-center justify-between mb-3">
                        <div
                          className={`w-11 h-11 rounded-2xl border flex items-center justify-center font-black text-lg ${s.color}`}
                        >
                          {s.step}
                        </div>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-stone-100 text-stone-600 border border-stone-200">
                          {s.shortTitle}
                        </span>
                      </div>

                      <div className="mb-3">
                        <h4 className="text-xl font-black text-stone-900 mb-1 flex items-center gap-1.5">
                          <Icon className="w-4 h-4 text-emerald-700" />
                          <span>{s.title}</span>
                        </h4>
                        <p className="text-xs font-bold text-emerald-700">
                          {s.subtitle}
                        </p>
                      </div>

                      <p className="text-xs text-stone-600 leading-relaxed mb-4">
                        {s.desc}
                      </p>

                      {/* Elements List */}
                      <div className="space-y-1.5 pt-3 border-t border-stone-100 mb-4">
                        <span className="text-[11px] font-bold text-stone-800 block">
                          أبرز عناصر المرحلة:
                        </span>
                        {s.elements.slice(0, 3).map((el, i) => (
                          <div key={i} className="text-[11px] text-stone-600 flex items-start gap-1.5">
                            <span className="text-emerald-700 font-bold shrink-0">•</span>
                            <span>{el}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Bottom Action */}
                    <div className="pt-3 border-t border-stone-100">
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedJourneyIndex(idx);
                          setJourneyViewMode('tabs');
                        }}
                        className="w-full py-2 rounded-xl bg-stone-100 hover:bg-emerald-700 hover:text-white text-stone-700 text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1"
                      >
                        <span>استعراض في التبويب الموسع</span>
                        <ArrowLeft className="w-3 h-3" />
                      </button>
                    </div>

                    {idx < journeySteps.length - 1 && (
                      <div className="hidden lg:block absolute -left-3 top-1/3 -translate-y-1/2 z-10 text-stone-300 font-black text-base">
                        ←
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
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
      <section id="ages" className="py-16 bg-white border-b border-stone-200 scroll-mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          {/* Section Title & Philosophy Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-stone-200 pb-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-100 text-teal-900 text-xs font-bold mb-2">
                <Users className="w-3.5 h-3.5" />
                <span>فئات عمرية مخصصة (6 - 15 سنة)</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-stone-900">
                واجهة ومنهجية مكيفة لكل مرحلة عمرية ونمائية
              </h2>
              <p className="text-stone-600 text-sm mt-2 max-w-3xl leading-relaxed">
                لا نعامل اليافع ابن 14 سنة كالطفل ابن 7 سنوات؛ فلكل عمر لغته واحتياجه ونضجه الإدراكي وأسلوب تفاعله المحبب ومستوى المرافقة الوالدية الملائم له.
              </p>
            </div>

            {/* View Mode Switcher */}
            <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-stone-100 border border-stone-200 self-start md:self-auto shrink-0">
              <button
                type="button"
                onClick={() => setAgeViewMode('tabs')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                  ageViewMode === 'tabs'
                    ? 'bg-white text-stone-900 shadow-xs border border-stone-200'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                <Layers className="w-3.5 h-3.5 text-teal-700" />
                <span>عرض التبويب المفصل الموسّع</span>
              </button>
              <button
                type="button"
                onClick={() => setAgeViewMode('compare')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                  ageViewMode === 'compare'
                    ? 'bg-white text-stone-900 shadow-xs border border-stone-200'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                <Users className="w-3.5 h-3.5 text-teal-700" />
                <span>مقارنة الفئات جنباً إلى جنب</span>
              </button>
            </div>
          </div>

          {/* TABBED VIEW MODE */}
          {ageViewMode === 'tabs' && (
            <div className="space-y-8 animate-fade-in">
              {/* Top Age Tab Selector Buttons (Full Width 3 Columns) */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {[
                  {
                    key: '6-9',
                    age: '6 - 9 سنوات',
                    title: 'الطفولة المبكرة والتأسيس',
                    tagline: 'تجربة بصرية مرحة ولعب هادف ومرافقة والدية وثيقة',
                    badge: 'تأسيس وجداني',
                    icon: Smile,
                    accentColor: 'emerald',
                    activeClass: 'bg-emerald-50/80 border-emerald-500 ring-2 ring-emerald-500/20 text-emerald-950',
                    badgeClass: 'bg-emerald-100 text-emerald-800',
                  },
                  {
                    key: '10-12',
                    age: '10 - 12 سنة',
                    title: 'الناشئة وبناء الاستقلالية',
                    tagline: 'إدارة أهداف وتحديات تدبرية تنمي المسؤولية الذاتية',
                    badge: 'استقلالية ومسؤولية',
                    icon: Compass,
                    accentColor: 'teal',
                    activeClass: 'bg-teal-50/80 border-teal-500 ring-2 ring-teal-500/20 text-teal-950',
                    badgeClass: 'bg-teal-100 text-teal-800',
                  },
                  {
                    key: '13-15',
                    age: '13 - 15 سنة',
                    title: 'اليافعون وترسيخ الهوية والقيادة',
                    tagline: 'بيئة راقية ناضجة، صالون تدبر فكري، وبوصلة قيمية',
                    badge: 'هوية وبصيرة',
                    icon: GraduationCap,
                    accentColor: 'purple',
                    activeClass: 'bg-purple-50/80 border-purple-500 ring-2 ring-purple-500/20 text-purple-950',
                    badgeClass: 'bg-purple-100 text-purple-800',
                  },
                ].map((tab) => {
                  const isSelected = selectedAgeTab === tab.key;
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.key}
                      type="button"
                      onClick={() => setSelectedAgeTab(tab.key as any)}
                      className={`p-4 sm:p-5 rounded-2xl border text-right transition-all cursor-pointer relative overflow-hidden flex flex-col justify-between ${
                        isSelected
                          ? tab.activeClass
                          : 'bg-stone-50 border-stone-200 text-stone-600 hover:bg-stone-100/80 hover:border-stone-300'
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between gap-2 mb-2">
                          <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full ${tab.badgeClass}`}>
                            {tab.badge}
                          </span>
                          <span className="text-xs font-bold text-stone-500">{tab.age}</span>
                        </div>
                        <div className="flex items-center gap-2.5">
                          <div
                            className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                              isSelected
                                ? tab.key === '6-9'
                                  ? 'bg-emerald-700 text-white'
                                  : tab.key === '10-12'
                                  ? 'bg-teal-700 text-white'
                                  : 'bg-purple-700 text-white'
                                : 'bg-stone-200 text-stone-600'
                            }`}
                          >
                            <Icon className="w-5 h-5" />
                          </div>
                          <div>
                            <h4 className="font-black text-stone-900 text-sm sm:text-base">{tab.title}</h4>
                          </div>
                        </div>
                      </div>
                      <p className="text-xs text-stone-600 mt-2.5 line-clamp-2 leading-relaxed">{tab.tagline}</p>
                    </button>
                  );
                })}
              </div>

              {/* Detailed Active Age Group Full Content & Elements Container */}
              {selectedAgeTab === '6-9' && (
                <div className="space-y-6 animate-fade-in">
                  {/* Age Group Header Banner */}
                  <div className="p-6 sm:p-8 rounded-3xl bg-linear-to-l from-emerald-50 via-teal-50/50 to-white border border-emerald-200">
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                      <div className="space-y-2">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold">
                          <Smile className="w-4 h-4 text-emerald-700" />
                          <span>الفئة الأولى: 6 - 9 سنوات (الطفولة المبكرة والتأسيس)</span>
                        </div>
                        <h3 className="text-2xl sm:text-3xl font-black text-stone-900">
                          غرس محبة القرآن باللعب الهادف والشجرة التفاعلية والمرافقة الدافئة
                        </h3>
                        <p className="text-sm text-stone-600 max-w-3xl leading-relaxed">
                          في هذا العمر الغض، لا نرهق عقل الطفل بالتجريد أو الواجبات الجافة؛ بل نبني رابطة وجدانية راسخة تجعل وقت القرآن أجمل لحظات يومه بصحبة والديه ومحفظه الصبور.
                        </p>
                      </div>

                      <div className="flex flex-wrap sm:flex-nowrap gap-3 shrink-0">
                        <div className="p-4 rounded-2xl bg-white border border-emerald-200 text-center min-w-[130px] shadow-xs">
                          <span className="text-xs text-stone-500 font-semibold block">مستوى الإشراف</span>
                          <span className="text-sm font-black text-emerald-800 mt-0.5 block">مرافقة والدية وثيقة</span>
                        </div>
                        <div className="p-4 rounded-2xl bg-white border border-emerald-200 text-center min-w-[130px] shadow-xs">
                          <span className="text-xs text-stone-500 font-semibold block">أسلوب التفاعل</span>
                          <span className="text-sm font-black text-emerald-800 mt-0.5 block">بصري ومرح وتحفيزي</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* 4 Core Dimensions of this Age Group */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {/* Dimension 1: Cognitive Traits */}
                    <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs space-y-3">
                      <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
                        <Lightbulb className="w-5 h-5" />
                      </div>
                      <h4 className="font-bold text-stone-900 text-sm">الخصائص النمائية والإدراكية</h4>
                      <ul className="space-y-2 text-xs text-stone-600 leading-relaxed">
                        <li className="flex items-start gap-1.5">
                          <span className="text-emerald-600 font-bold">✓</span>
                          <span>التفكير الحسي الملموس وفهم المعاني عبر القصص المصورة.</span>
                        </li>
                        <li className="flex items-start gap-1.5">
                          <span className="text-emerald-600 font-bold">✓</span>
                          <span>مدى انتباه من 15 إلى 20 دقيقة يحتاج تنوعاً وحيوية مستمرة.</span>
                        </li>
                        <li className="flex items-start gap-1.5">
                          <span className="text-emerald-600 font-bold">✓</span>
                          <span>التحفيز السريع بالألوان والملصقات وأوسمة الشجرة.</span>
                        </li>
                      </ul>
                    </div>

                    {/* Dimension 2: Visual Interface & UX */}
                    <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs space-y-3">
                      <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
                        <Eye className="w-5 h-5" />
                      </div>
                      <h4 className="font-bold text-stone-900 text-sm">التجربة البصرية وواجهة الطالب</h4>
                      <ul className="space-y-2 text-xs text-stone-600 leading-relaxed">
                        <li className="flex items-start gap-1.5">
                          <span className="text-emerald-600 font-bold">✓</span>
                          <span>أزرار لمس كبيرة وألوان مرحة مبهجة وخطوط واضحة مشكولة.</span>
                        </li>
                        <li className="flex items-start gap-1.5">
                          <span className="text-emerald-600 font-bold">✓</span>
                          <span>شجرة معايشة تنمو وتتفتح أزهارها مع كل آية يتقنها الطفل.</span>
                        </li>
                        <li className="flex items-start gap-1.5">
                          <span className="text-emerald-600 font-bold">✓</span>
                          <span>زر تسجيل صوتي واضح ومحبب يستمع فيه الطفل لتلاوته بصوته.</span>
                        </li>
                      </ul>
                    </div>

                    {/* Dimension 3: Weekly Materials */}
                    <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs space-y-3">
                      <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
                        <BookOpen className="w-5 h-5" />
                      </div>
                      <h4 className="font-bold text-stone-900 text-sm">المواد والمخرجات المخصصة</h4>
                      <ul className="space-y-2 text-xs text-stone-600 leading-relaxed">
                        <li className="flex items-start gap-1.5">
                          <span className="text-emerald-600 font-bold">✓</span>
                          <span>كتيب التلوين والأنشطة التفاعلية الشهري يربط الآيات بالرسم.</span>
                        </li>
                        <li className="flex items-start gap-1.5">
                          <span className="text-emerald-600 font-bold">✓</span>
                          <span>بطاقات «عشت الآية» العائلية تثبت على الثلاجة أو غرفة الطفل.</span>
                        </li>
                        <li className="flex items-start gap-1.5">
                          <span className="text-emerald-600 font-bold">✓</span>
                          <span>ملصقات أوسمة شجرة المعايشة المادية والرقمية.</span>
                        </li>
                      </ul>
                    </div>

                    {/* Dimension 4: Parent Supervision */}
                    <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs space-y-3">
                      <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
                        <HeartHandshake className="w-5 h-5" />
                      </div>
                      <h4 className="font-bold text-stone-900 text-sm">الدور الوالدي وشراكة الأسرة</h4>
                      <ul className="space-y-2 text-xs text-stone-600 leading-relaxed">
                        <li className="flex items-start gap-1.5">
                          <span className="text-emerald-600 font-bold">✓</span>
                          <span>جلسة استماع وتسميع مشتركة تعزز الترابط العاطفي.</span>
                        </li>
                        <li className="flex items-start gap-1.5">
                          <span className="text-emerald-600 font-bold">✓</span>
                          <span>تأكيد ولي الأمر لتنفيذ المهمة السلوكية بنقرة واحدة في بوابته.</span>
                        </li>
                        <li className="flex items-start gap-1.5">
                          <span className="text-emerald-600 font-bold">✓</span>
                          <span>رسائل توجيهية أسبوعية بأفكار سهلة لتطبيق معاني السورة في البيت.</span>
                        </li>
                      </ul>
                    </div>
                  </div>

                  {/* 5 Steps Adaptation & Live Interactive UI Preview */}
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    {/* Left/Main Column: 5 Steps Adaptation Table */}
                    <div className="lg:col-span-7 bg-white rounded-3xl p-6 border border-stone-200 shadow-xs space-y-4">
                      <div className="flex items-center justify-between border-b border-stone-100 pb-3">
                        <h4 className="font-black text-base text-stone-900">
                          كيف تُطبّق المنهجية الخماسية على الفئة (6 - 9 سنوات)؟
                        </h4>
                        <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full">
                          نموذج عملي
                        </span>
                      </div>

                      <div className="space-y-3">
                        {[
                          {
                            step: '1. يحفظ',
                            title: 'تلقين صبور وتكرار هادئ',
                            desc: 'جلسات قصيرة فردية مع المحفظ، التركيز على تصحيح مخارج الحروف وقصار الآيات دون إجهاد، مع تشجيع دائم بصوت ودود.',
                          },
                          {
                            step: '2. يفهم',
                            title: 'قصة مصورة ومعجم الصغار',
                            desc: 'تفسير الكلمات الغريبة عبر معجم الصور في كتيب الأنشطة، ورواية قصة السورة (مثل قصة غار حراء وأول لقاء بالوحي) بأسلوب شيق.',
                          },
                          {
                            step: '3. يتدبر',
                            title: 'سؤال الدهشة الوجدانية',
                            desc: 'طرح أسئلة وجدانية بسيطة: «ماذا شعرت حين علمت أن الله خلقك ورعاك؟»، وتحفيز الطفل ليعبر بعفويته في جلسة التدبر.',
                          },
                          {
                            step: '4. يطبق',
                            title: 'مهام سلوكية أسرية محببة',
                            desc: 'بطاقة «عشت الآية»: تقبيل رأس الوالدين، إطعام قطة، ترتيب الألعاب، أو شكر معلم — تطبيق عملي مباشر يراه الطفل بعينيه.',
                          },
                          {
                            step: '5. يعيش',
                            title: 'احتفال الشجرة والهوية',
                            desc: 'إتمام شجرة المعايشة واكتمال أوراقها، وارتداء وسام السورة في احتفال عائلي صغير يرسخ في ذاكرته فخر الانتماء لكتاب الله.',
                          },
                        ].map((m, i) => (
                          <div key={i} className="p-3.5 rounded-xl bg-stone-50 border border-stone-200/80 flex items-start gap-3">
                            <span className="px-2 py-1 rounded-lg bg-emerald-700 text-white text-xs font-black shrink-0">
                              {m.step}
                            </span>
                            <div>
                              <h5 className="font-bold text-xs text-stone-900">{m.title}</h5>
                              <p className="text-xs text-stone-600 mt-0.5 leading-relaxed">{m.desc}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Right Column: Live Mockup of Student Interface */}
                    <div className="lg:col-span-5 bg-linear-to-b from-emerald-900 to-emerald-950 rounded-3xl p-6 text-white shadow-md flex flex-col justify-between space-y-4">
                      <div className="space-y-3">
                        <div className="flex items-center justify-between border-b border-emerald-800/80 pb-3">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-emerald-500/30 flex items-center justify-center text-emerald-300">
                              <Smile className="w-4 h-4" />
                            </div>
                            <div>
                              <span className="text-xs text-emerald-300 block font-medium">معاينة واجهة الابن</span>
                              <span className="text-sm font-black">عمر (7 سنوات) - سورة العلق</span>
                            </div>
                          </div>
                          <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-200 border border-emerald-500/30">
                            مظهر تفاعلي مرح
                          </span>
                        </div>

                        {/* Visual Mockup Body */}
                        <div className="bg-emerald-800/40 rounded-2xl p-4 border border-emerald-700/50 space-y-3">
                          <div className="text-center py-2">
                            <div className="w-14 h-14 mx-auto rounded-full bg-emerald-500/20 text-emerald-300 flex items-center justify-center mb-2 animate-bounce">
                              <TreeDeciduous className="w-8 h-8 text-emerald-400" />
                            </div>
                            <h5 className="font-black text-sm text-emerald-100">شجرة المعايشة تنمو معك! 🌳</h5>
                            <p className="text-[11px] text-emerald-300/80">أتممت تلاوة الآيات 1 - 5 وأزهرت 3 أوراق جديدة</p>
                          </div>

                          <div className="p-3 rounded-xl bg-emerald-950/60 border border-emerald-700/40 space-y-2">
                            <div className="flex items-center justify-between text-xs">
                              <span className="font-bold text-emerald-200">مهمة اليوم مع ماما:</span>
                              <span className="text-[10px] bg-amber-400/20 text-amber-300 px-1.5 py-0.5 rounded font-bold">
                                عشت الآية
                              </span>
                            </div>
                            <p className="text-[11px] text-emerald-100">«علم بالقلم»: اقرأ قصة مفيدة مع والدتك واكتب كلمة جميلة</p>
                          </div>

                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              className="flex-1 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-emerald-950 font-black text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-xs"
                            >
                              <Mic className="w-3.5 h-3.5" />
                              <span>اسمعني صوتك يا بطل! 🎙️</span>
                            </button>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-2 text-center text-xs">
                          <div className="p-2.5 rounded-xl bg-emerald-800/30 border border-emerald-700/30">
                            <span className="text-amber-300 font-bold block text-sm">⭐ 120 نقطة</span>
                            <span className="text-[10px] text-emerald-300">رصيد الشجرة</span>
                          </div>
                          <div className="p-2.5 rounded-xl bg-emerald-800/30 border border-emerald-700/30">
                            <span className="text-emerald-300 font-bold block text-sm">🏅 وسام البر</span>
                            <span className="text-[10px] text-emerald-300">معتمد من الأب</span>
                          </div>
                        </div>
                      </div>

                      <div className="pt-2 border-t border-emerald-800/80 flex items-center justify-between text-xs">
                        <span className="text-emerald-300 text-[11px]">مظهر خاص بالطفولة يجمع بين المتعة والسكينة</span>
                        <button
                          type="button"
                          onClick={() => setSelectedAgeTab('10-12')}
                          className="font-bold text-emerald-200 hover:text-white flex items-center gap-1 cursor-pointer text-xs"
                        >
                          <span>الفئة التالية (10 - 12)</span>
                          <ArrowLeft className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {selectedAgeTab === '10-12' && (
                <div className="space-y-6 animate-fade-in">
                  {/* Age Group Header Banner */}
                  <div className="p-6 sm:p-8 rounded-3xl bg-linear-to-l from-teal-50 via-cyan-50/50 to-white border border-teal-200">
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                      <div className="space-y-2">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-100 text-teal-800 text-xs font-bold">
                          <Compass className="w-4 h-4 text-teal-700" />
                          <span>الفئة الثانية: 10 - 12 سنة (الناشئة وبناء الاستقلالية)</span>
                        </div>
                        <h3 className="text-2xl sm:text-3xl font-black text-stone-900">
                          بناء المسؤولية الذاتية والتفكير الحواري وإدارة أهداف الحفظ
                        </h3>
                        <p className="text-sm text-stone-600 max-w-3xl leading-relaxed">
                          في هذه المرحلة الذهبية، ينتقل الطالب من التلقين إلى الاستكشاف والتفكير السببي؛ لذا نمنحه واجهة تنظم وقته، وتحديات تفكير تثري عقله، ومساحة مسؤولية يثبت بها جدارته.
                        </p>
                      </div>

                      <div className="flex flex-wrap sm:flex-nowrap gap-3 shrink-0">
                        <div className="p-4 rounded-2xl bg-white border border-teal-200 text-center min-w-[130px] shadow-xs">
                          <span className="text-xs text-stone-500 font-semibold block">مستوى الإشراف</span>
                          <span className="text-sm font-black text-teal-800 mt-0.5 block">إشراف وتوجيه متوازن</span>
                        </div>
                        <div className="p-4 rounded-2xl bg-white border border-teal-200 text-center min-w-[130px] shadow-xs">
                          <span className="text-xs text-stone-500 font-semibold block">أسلوب التفاعل</span>
                          <span className="text-sm font-black text-teal-800 mt-0.5 block">أهداف وتحديات وإنجاز</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* 4 Core Dimensions of this Age Group */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {/* Dimension 1: Cognitive Traits */}
                    <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs space-y-3">
                      <div className="w-10 h-10 rounded-xl bg-teal-100 text-teal-700 flex items-center justify-center">
                        <Lightbulb className="w-5 h-5" />
                      </div>
                      <h4 className="font-bold text-stone-900 text-sm">الخصائص النمائية والإدراكية</h4>
                      <ul className="space-y-2 text-xs text-stone-600 leading-relaxed">
                        <li className="flex items-start gap-1.5">
                          <span className="text-teal-600 font-bold">✓</span>
                          <span>بداية التفكير المنطقي والسببي والبحث عن علل وتفاسير الأحكام.</span>
                        </li>
                        <li className="flex items-start gap-1.5">
                          <span className="text-teal-600 font-bold">✓</span>
                          <span>حب المنافسة الإيجابية وإثبات الذات وتحقيق الأرقام القياسية.</span>
                        </li>
                        <li className="flex items-start gap-1.5">
                          <span className="text-teal-600 font-bold">✓</span>
                          <span>الرغبة في الاستقلال عن الوالدين مع التقدير لثقتهم وتشجيعهم.</span>
                        </li>
                      </ul>
                    </div>

                    {/* Dimension 2: Visual Interface & UX */}
                    <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs space-y-3">
                      <div className="w-10 h-10 rounded-xl bg-teal-100 text-teal-700 flex items-center justify-center">
                        <Award className="w-5 h-5" />
                      </div>
                      <h4 className="font-bold text-stone-900 text-sm">التجربة البصرية وواجهة الطالب</h4>
                      <ul className="space-y-2 text-xs text-stone-600 leading-relaxed">
                        <li className="flex items-start gap-1.5">
                          <span className="text-teal-600 font-bold">✓</span>
                          <span>تصميم متوازن يجمع بين الحيوية والرصانة وخالٍ من الطابع الطفولي.</span>
                        </li>
                        <li className="flex items-start gap-1.5">
                          <span className="text-teal-600 font-bold">✓</span>
                          <span>لوحة إنجاز أسبوعية، مؤشرات تقدم، وأشرطة إتقان دقيقة.</span>
                        </li>
                        <li className="flex items-start gap-1.5">
                          <span className="text-teal-600 font-bold">✓</span>
                          <span>أداة تسجيل متقدمة تتيح إعادة الاستماع ومقارنة الأداء الصوتي.</span>
                        </li>
                      </ul>
                    </div>

                    {/* Dimension 3: Weekly Materials */}
                    <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs space-y-3">
                      <div className="w-10 h-10 rounded-xl bg-teal-100 text-teal-700 flex items-center justify-center">
                        <BookOpen className="w-5 h-5" />
                      </div>
                      <h4 className="font-bold text-stone-900 text-sm">المواد والمخرجات المخصصة</h4>
                      <ul className="space-y-2 text-xs text-stone-600 leading-relaxed">
                        <li className="flex items-start gap-1.5">
                          <span className="text-teal-600 font-bold">✓</span>
                          <span>كتيب التحديات والخرائط المفاهيمية الذكي وألغاز التدبر.</span>
                        </li>
                        <li className="flex items-start gap-1.5">
                          <span className="text-teal-600 font-bold">✓</span>
                          <span>جدول «ميثاق الأسبوع القرآني» لتتبع المهام والصلوات المستمرة.</span>
                        </li>
                        <li className="flex items-start gap-1.5">
                          <span className="text-teal-600 font-bold">✓</span>
                          <span>حلقات تدبر حوارية أسبوعية في مجموعات صغيرة (5-8 طلاب).</span>
                        </li>
                      </ul>
                    </div>

                    {/* Dimension 4: Parent Supervision */}
                    <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs space-y-3">
                      <div className="w-10 h-10 rounded-xl bg-teal-100 text-teal-700 flex items-center justify-center">
                        <UserCheck className="w-5 h-5" />
                      </div>
                      <h4 className="font-bold text-stone-900 text-sm">الدور الوالدي وشراكة الأسرة</h4>
                      <ul className="space-y-2 text-xs text-stone-600 leading-relaxed">
                        <li className="flex items-start gap-1.5">
                          <span className="text-teal-600 font-bold">✓</span>
                          <span>الطالب يسجل المهام بنفسه وولي الأمر يراجع ويشجع بنبرة فخر.</span>
                        </li>
                        <li className="flex items-start gap-1.5">
                          <span className="text-teal-600 font-bold">✓</span>
                          <span>تقرير أداء تفصيلي يوضح نقاط القوة دون حاجة للملاحقة اليومية.</span>
                        </li>
                        <li className="flex items-start gap-1.5">
                          <span className="text-teal-600 font-bold">✓</span>
                          <span>جلسة تدبر أسرية نصف شهرية لتبادل الأفكار وتطبيق المبادرات.</span>
                        </li>
                      </ul>
                    </div>
                  </div>

                  {/* 5 Steps Adaptation & Live Interactive UI Preview */}
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    {/* Left/Main Column: 5 Steps Adaptation Table */}
                    <div className="lg:col-span-7 bg-white rounded-3xl p-6 border border-stone-200 shadow-xs space-y-4">
                      <div className="flex items-center justify-between border-b border-stone-100 pb-3">
                        <h4 className="font-black text-base text-stone-900">
                          كيف تُطبّق المنهجية الخماسية على الفئة (10 - 12 سنة)؟
                        </h4>
                        <span className="text-xs font-bold text-teal-700 bg-teal-50 px-2.5 py-0.5 rounded-full">
                          نموذج عملي
                        </span>
                      </div>

                      <div className="space-y-3">
                        {[
                          {
                            step: '1. يحفظ',
                            title: 'ضبط أحكام التجويد والترتيل',
                            desc: 'تطبيق قواعد النون الساكنة والمدود ومخارج الحروف مع المحفظ المجاز، مع تسميع فردي مباشر واعتماد رسمي لدرجة الإتقان.',
                          },
                          {
                            step: '2. يفهم',
                            title: 'خرائط ذهنية وسياق النزول',
                            desc: 'استكشاف سياق السورة القرآني وأسباب النزول وعلاقة السورة بما قبلها وما بعدها، وحل ألغاز الترابط الموضوعي في الكتيب.',
                          },
                          {
                            step: '3. يتدبر',
                            title: 'حوار الأقران والأسئلة التأملية',
                            desc: 'جلسة تدبر حوارية تفاعلية مع الكوتش لطرح التساؤلات: «لماذا سميت بالعلق؟ ما أثر القراءة بالعلم الصالح؟ وكيف نحمي أنفسنا من الطغيان؟».',
                          },
                          {
                            step: '4. يطبق',
                            title: 'مبادرات مدرسية وأسرية',
                            desc: 'تكليف الابن بمبادرة نافعة: تلخيص كتاب مفيد للأسرة، إعانة زميل في دراسته، أو قيادة عمل خيري صغير يوثقه في بوابته.',
                          },
                          {
                            step: '5. يعيش',
                            title: 'شجرة المعايشة المكتملة والهوية',
                            desc: 'اكتمال بطاقات الإنجاز والمستوى المتقدم في الشجرة، وتقديم عرض مصغر في جلسة الختام يلخص فيه ما تغير في سلوكه وأفكاره.',
                          },
                        ].map((m, i) => (
                          <div key={i} className="p-3.5 rounded-xl bg-stone-50 border border-stone-200/80 flex items-start gap-3">
                            <span className="px-2 py-1 rounded-lg bg-teal-700 text-white text-xs font-black shrink-0">
                              {m.step}
                            </span>
                            <div>
                              <h5 className="font-bold text-xs text-stone-900">{m.title}</h5>
                              <p className="text-xs text-stone-600 mt-0.5 leading-relaxed">{m.desc}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Right Column: Live Mockup of Student Interface */}
                    <div className="lg:col-span-5 bg-linear-to-b from-teal-900 to-teal-950 rounded-3xl p-6 text-white shadow-md flex flex-col justify-between space-y-4">
                      <div className="space-y-3">
                        <div className="flex items-center justify-between border-b border-teal-800/80 pb-3">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-teal-500/30 flex items-center justify-center text-teal-300">
                              <Compass className="w-4 h-4" />
                            </div>
                            <div>
                              <span className="text-xs text-teal-300 block font-medium">معاينة واجهة الناشئ</span>
                              <span className="text-sm font-black">يوسف (11 سنة) - سورة العلق</span>
                            </div>
                          </div>
                          <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-teal-500/20 text-teal-200 border border-teal-500/30">
                            واجهة تحديات وأهداف
                          </span>
                        </div>

                        {/* Visual Mockup Body */}
                        <div className="bg-teal-800/40 rounded-2xl p-4 border border-teal-700/50 space-y-3">
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-teal-200 font-bold">مسار إتقان السورة الشهري:</span>
                            <span className="text-teal-300 font-black">80% منجز</span>
                          </div>

                          {/* Progress Bar */}
                          <div className="w-full bg-teal-950/80 h-2.5 rounded-full overflow-hidden">
                            <div className="bg-teal-400 h-full rounded-full" style={{ width: '80%' }}></div>
                          </div>

                          <div className="p-3 rounded-xl bg-teal-950/60 border border-teal-700/40 space-y-2">
                            <div className="flex items-center justify-between text-xs">
                              <span className="font-bold text-teal-200">تحدي التدبر مع الكوتش:</span>
                              <span className="text-[10px] bg-teal-400/20 text-teal-300 px-1.5 py-0.5 rounded font-bold">
                                الأربعاء 6:00 م
                              </span>
                            </div>
                            <p className="text-[11px] text-teal-100">استخرج 3 رسائل عملية من قوله تعالى ﴿اقْرَأْ وَرَبُّكَ الْأَكْرَمُ﴾ لتطبيقها في المدرسة</p>
                          </div>

                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              className="flex-1 py-2.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-teal-950 font-black text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-xs"
                            >
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              <span>تسجيل التسميع وإرساله للمحفظ</span>
                            </button>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-2 text-center text-xs">
                          <div className="p-2.5 rounded-xl bg-teal-800/30 border border-teal-700/30">
                            <span className="text-amber-300 font-bold block text-sm">🔥 380 نقطة</span>
                            <span className="text-[10px] text-teal-300">المستوى: باحث متدبر</span>
                          </div>
                          <div className="p-2.5 rounded-xl bg-teal-800/30 border border-teal-700/30">
                            <span className="text-teal-300 font-bold block text-sm">🎙️ 10/10 إتقان</span>
                            <span className="text-[10px] text-teal-300">تلاوة معتمدة</span>
                          </div>
                        </div>
                      </div>

                      <div className="pt-2 border-t border-teal-800/80 flex items-center justify-between text-xs">
                        <button
                          type="button"
                          onClick={() => setSelectedAgeTab('6-9')}
                          className="font-bold text-teal-200 hover:text-white flex items-center gap-1 cursor-pointer text-xs"
                        >
                          <ArrowRight className="w-3 h-3" />
                          <span>الفئة السابقة (6 - 9)</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setSelectedAgeTab('13-15')}
                          className="font-bold text-teal-200 hover:text-white flex items-center gap-1 cursor-pointer text-xs"
                        >
                          <span>الفئة التالية (13 - 15)</span>
                          <ArrowLeft className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {selectedAgeTab === '13-15' && (
                <div className="space-y-6 animate-fade-in">
                  {/* Age Group Header Banner */}
                  <div className="p-6 sm:p-8 rounded-3xl bg-linear-to-l from-purple-50 via-indigo-50/50 to-white border border-purple-200">
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                      <div className="space-y-2">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-100 text-purple-800 text-xs font-bold">
                          <GraduationCap className="w-4 h-4 text-purple-700" />
                          <span>الفئة الثالثة: 13 - 15 سنة (اليافعون وترسيخ الهوية والقيادة)</span>
                        </div>
                        <h3 className="text-2xl sm:text-3xl font-black text-stone-900">
                          بيئة راقية وناضجة لبناء الهوية، والتأمل الفكري، والقيادة القرآنية
                        </h3>
                        <p className="text-sm text-stone-600 max-w-3xl leading-relaxed">
                          نخاطب عقل اليافع باحترام ونضج؛ نحاوره كصديق ومستقبل أمة، نفتح له مساحات التساؤل العميق، ونسلحه ببوصلة قرآنية راسخة تحميه من الفتن والشبهات الفكرية المعاصرة.
                        </p>
                      </div>

                      <div className="flex flex-wrap sm:flex-nowrap gap-3 shrink-0">
                        <div className="p-4 rounded-2xl bg-white border border-purple-200 text-center min-w-[130px] shadow-xs">
                          <span className="text-xs text-stone-500 font-semibold block">مستوى الإشراف</span>
                          <span className="text-sm font-black text-purple-800 mt-0.5 block">استقلالية وشراكة ثقة</span>
                        </div>
                        <div className="p-4 rounded-2xl bg-white border border-purple-200 text-center min-w-[130px] shadow-xs">
                          <span className="text-xs text-stone-500 font-semibold block">أسلوب التفاعل</span>
                          <span className="text-sm font-black text-purple-800 mt-0.5 block">فلسفي وفكري وقيادي</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* 4 Core Dimensions of this Age Group */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {/* Dimension 1: Cognitive Traits */}
                    <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs space-y-3">
                      <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center">
                        <Lightbulb className="w-5 h-5" />
                      </div>
                      <h4 className="font-bold text-stone-900 text-sm">الخصائص النمائية والإدراكية</h4>
                      <ul className="space-y-2 text-xs text-stone-600 leading-relaxed">
                        <li className="flex items-start gap-1.5">
                          <span className="text-purple-600 font-bold">✓</span>
                          <span>اكتمال التفكير التجريدي والبحث عن المعنى والهوية والقيمة.</span>
                        </li>
                        <li className="flex items-start gap-1.5">
                          <span className="text-purple-600 font-bold">✓</span>
                          <span>الحساسية تجاه أسلوب الوعظ المباشر أو المعاملة كطفل صغير.</span>
                        </li>
                        <li className="flex items-start gap-1.5">
                          <span className="text-purple-600 font-bold">✓</span>
                          <span>الحاجة لمساحة حوارية آمنة لمناقشة التساؤلات الفكرية والواقعية.</span>
                        </li>
                      </ul>
                    </div>

                    {/* Dimension 2: Visual Interface & UX */}
                    <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs space-y-3">
                      <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center">
                        <Layers className="w-5 h-5" />
                      </div>
                      <h4 className="font-bold text-stone-900 text-sm">التجربة البصرية وواجهة الطالب</h4>
                      <ul className="space-y-2 text-xs text-stone-600 leading-relaxed">
                        <li className="flex items-start gap-1.5">
                          <span className="text-purple-600 font-bold">✓</span>
                          <span>تصميم أنيق وعصري ومينيماليست يليق بنضج وتطلعات اليافع.</span>
                        </li>
                        <li className="flex items-start gap-1.5">
                          <span className="text-purple-600 font-bold">✓</span>
                          <span>سجل الخواطر والتدبر الشخصي (Journal) بخصوصية تامة للطالب.</span>
                        </li>
                        <li className="flex items-start gap-1.5">
                          <span className="text-purple-600 font-bold">✓</span>
                          <span>مساحة للتواصل الرصين مع المحفظ والكوتش كمرشد وناصح.</span>
                        </li>
                      </ul>
                    </div>

                    {/* Dimension 3: Weekly Materials */}
                    <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs space-y-3">
                      <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center">
                        <BookOpen className="w-5 h-5" />
                      </div>
                      <h4 className="font-bold text-stone-900 text-sm">المواد والمخرجات المخصصة</h4>
                      <ul className="space-y-2 text-xs text-stone-600 leading-relaxed">
                        <li className="flex items-start gap-1.5">
                          <span className="text-purple-600 font-bold">✓</span>
                          <span>صالون التدبر الفكري الأسبوعي (45 دقيقة حوار مفتوح ومركّز).</span>
                        </li>
                        <li className="flex items-start gap-1.5">
                          <span className="text-purple-600 font-bold">✓</span>
                          <span>دفتر تأملات اليافع القرآني وتفكيك الشبهات المعاصرة.</span>
                        </li>
                        <li className="flex items-start gap-1.5">
                          <span className="text-purple-600 font-bold">✓</span>
                          <span>مشروع مبادرة نفع عام يقوده اليافع بنفسه لخدمة محيطه.</span>
                        </li>
                      </ul>
                    </div>

                    {/* Dimension 4: Parent Supervision */}
                    <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs space-y-3">
                      <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center">
                        <ShieldCheck className="w-5 h-5" />
                      </div>
                      <h4 className="font-bold text-stone-900 text-sm">الدور الوالدي وشراكة الأسرة</h4>
                      <ul className="space-y-2 text-xs text-stone-600 leading-relaxed">
                        <li className="flex items-start gap-1.5">
                          <span className="text-purple-600 font-bold">✓</span>
                          <span>علاقة صداقة واحترام تمنح اليافع مسؤوليته الكاملة دون تضييق.</span>
                        </li>
                        <li className="flex items-start gap-1.5">
                          <span className="text-purple-600 font-bold">✓</span>
                          <span>لوحة تحكم ولي الأمر تعرض مؤشرات الالتزام والأثر العام باحترام لخصوصيته.</span>
                        </li>
                        <li className="flex items-start gap-1.5">
                          <span className="text-purple-600 font-bold">✓</span>
                          <span>حوارات أسرية مفتوحة تنطلق من الأفكار التي يطرحها اليافع في البيت.</span>
                        </li>
                      </ul>
                    </div>
                  </div>

                  {/* 5 Steps Adaptation & Live Interactive UI Preview */}
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    {/* Left/Main Column: 5 Steps Adaptation Table */}
                    <div className="lg:col-span-7 bg-white rounded-3xl p-6 border border-stone-200 shadow-xs space-y-4">
                      <div className="flex items-center justify-between border-b border-stone-100 pb-3">
                        <h4 className="font-black text-base text-stone-900">
                          كيف تُطبّق المنهجية الخماسية على الفئة (13 - 15 سنة)؟
                        </h4>
                        <span className="text-xs font-bold text-purple-700 bg-purple-50 px-2.5 py-0.5 rounded-full">
                          نموذج عملي
                        </span>
                      </div>

                      <div className="space-y-3">
                        {[
                          {
                            step: '1. يحفظ',
                            title: 'ترتيل رصين وفقه الوقف والابتداء',
                            desc: 'إتقان تلاوة الآيات برواية حفص عن عاصم، وفهم معاني الوقف والابتداء، ومخارج الحروف الدقيقة مع محفظ متخصص في توجيه اليافعين.',
                          },
                          {
                            step: '2. يفهم',
                            title: 'المفاهيم الكبرى واللغة البلاغية',
                            desc: 'تفكيك المفاهيم القرآنية الكبرى في السورة: كبرياء الإنسان واستغناؤه عن ربه، التوحيد، وأثر العلم النافع في مقابل العلم المادي المجرد.',
                          },
                          {
                            step: '3. يتدبر',
                            title: 'صالون فكري: القرآن في عصر الواقع الرقمي',
                            desc: 'نقاشات فكرية مفتوحة: كيف نحمي أنفسنا من وهم الاستغناء ﴿أَن رَّآهُ اسْتَغْنَىٰ﴾ في عصر الشهرة والتواصل الاجتماعي؟',
                          },
                          {
                            step: '4. يطبق',
                            title: 'مشاريع قيادية ومبادرات نفع عام',
                            desc: 'تصميم مبادرة ذاتية: تعليم الصغار، صياغة محتوى نافع، أو قيادة عمل خيري في الأسرة والمحيط يوثق أثره بالبصمة والأفعال.',
                          },
                          {
                            step: '5. يعيش',
                            title: 'بوصلة الهوية والاعتزاز بالقرآن',
                            desc: 'تشكل هوية إيمانية ثابتة وواعية تجعل القرآن المرجع الأساسي في قرارات اليافع وطموحاته واختياراته المستقبلية.',
                          },
                        ].map((m, i) => (
                          <div key={i} className="p-3.5 rounded-xl bg-stone-50 border border-stone-200/80 flex items-start gap-3">
                            <span className="px-2 py-1 rounded-lg bg-purple-700 text-white text-xs font-black shrink-0">
                              {m.step}
                            </span>
                            <div>
                              <h5 className="font-bold text-xs text-stone-900">{m.title}</h5>
                              <p className="text-xs text-stone-600 mt-0.5 leading-relaxed">{m.desc}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Right Column: Live Mockup of Student Interface */}
                    <div className="lg:col-span-5 bg-linear-to-b from-stone-900 via-purple-950 to-stone-950 rounded-3xl p-6 text-white shadow-md flex flex-col justify-between space-y-4">
                      <div className="space-y-3">
                        <div className="flex items-center justify-between border-b border-purple-800/60 pb-3">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-purple-500/30 flex items-center justify-center text-purple-300">
                              <GraduationCap className="w-4 h-4" />
                            </div>
                            <div>
                              <span className="text-xs text-purple-300 block font-medium">معاينة واجهة اليافع</span>
                              <span className="text-sm font-black">أنس (14 سنة) - سورة العلق</span>
                            </div>
                          </div>
                          <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-200 border border-purple-500/30">
                            واجهة راقية وهادئة
                          </span>
                        </div>

                        {/* Visual Mockup Body */}
                        <div className="bg-stone-800/70 rounded-2xl p-4 border border-purple-700/40 space-y-3">
                          <div className="p-3 rounded-xl bg-stone-900/90 border border-purple-800/40 space-y-1.5">
                            <div className="flex items-center justify-between text-xs">
                              <span className="font-bold text-purple-200">دفتر الخواطر والتأمل الشخصي:</span>
                              <span className="text-[10px] text-stone-400">سري وخاص</span>
                            </div>
                            <p className="text-xs text-stone-200 leading-relaxed italic">
                              «حين قرأت ﴿كَلَّا إِنَّ الْإِنسَانَ لَيَطْغَىٰ ۝ أَن رَّآهُ اسْتَغْنَىٰ﴾، أدركت أن مصدر ضياع الإنسان هو وهم استغنائه عن ربه. كيف أترجم هذا الوعي في تعاملي مع إنجازاتي؟»
                            </p>
                          </div>

                          <div className="p-3 rounded-xl bg-purple-950/60 border border-purple-700/30 space-y-1">
                            <div className="flex items-center justify-between text-xs">
                              <span className="font-bold text-purple-200">صالون التدبر الفكري:</span>
                              <span className="text-[10px] bg-purple-400/20 text-purple-300 px-1.5 py-0.5 rounded font-bold">
                                الجمعة 7:30 م
                              </span>
                            </div>
                            <p className="text-[11px] text-purple-100">محور الجلسة: العلم بين التواضع لله والغرور البشري في العصر الحديث</p>
                          </div>

                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              className="flex-1 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-xs"
                            >
                              <BookOpen className="w-3.5 h-3.5" />
                              <span>تدوين خاطرة جديدة في سجلي الخاص</span>
                            </button>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-2 text-center text-xs">
                          <div className="p-2.5 rounded-xl bg-purple-900/30 border border-purple-800/30">
                            <span className="text-purple-200 font-bold block text-sm">🏛️ صالون الفكر</span>
                            <span className="text-[10px] text-stone-400">مشارك فاعل</span>
                          </div>
                          <div className="p-2.5 rounded-xl bg-purple-900/30 border border-purple-800/30">
                            <span className="text-purple-200 font-bold block text-sm">📜 ملف الإنجاز</span>
                            <span className="text-[10px] text-stone-400">شهادة معايشة معتمدة</span>
                          </div>
                        </div>
                      </div>

                      <div className="pt-2 border-t border-purple-800/60 flex items-center justify-between text-xs">
                        <button
                          type="button"
                          onClick={() => setSelectedAgeTab('10-12')}
                          className="font-bold text-purple-200 hover:text-white flex items-center gap-1 cursor-pointer text-xs"
                        >
                          <ArrowRight className="w-3 h-3" />
                          <span>الفئة السابقة (10 - 12)</span>
                        </button>
                        <span className="text-stone-400 text-[11px]">مظهر قيادي يرسخ اعتزاز اليافع بهويته</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* COMPARE ALL 3 GROUPS SIDE-BY-SIDE MODE */}
          {ageViewMode === 'compare' && (
            <div className="space-y-6 animate-fade-in">
              <div className="text-center max-w-2xl mx-auto mb-2">
                <span className="text-xs font-bold text-teal-800 bg-teal-50 px-3 py-1 rounded-full">
                  مقارنة بصرية شاملة
                </span>
                <h4 className="text-xl sm:text-2xl font-black text-stone-900 mt-2">
                  مقارنة الفئات العمرية الثلاث جنباً إلى جنب
                </h4>
                <p className="text-xs text-stone-600 mt-1">
                  نظرة سريعة لأولياء الأمور للتعرف على أوجه التمايز بين الفئات واختيار ما يناسب أبناءهم
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Column 1: 6 - 9 */}
                <div className="bg-white rounded-3xl p-6 border-2 border-emerald-300 shadow-xs flex flex-col justify-between space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-black text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full">
                        6 - 9 سنوات
                      </span>
                      <Smile className="w-6 h-6 text-emerald-600" />
                    </div>
                    <div>
                      <h4 className="text-lg font-black text-stone-900">الطفولة المبكرة والتأسيس</h4>
                      <p className="text-xs text-emerald-700 font-semibold mt-0.5">تجربة بصرية مرحة ولعب هادف</p>
                    </div>

                    <div className="space-y-3 pt-2 border-t border-stone-100 text-xs">
                      <div>
                        <span className="font-bold text-stone-900 block mb-1">النمط النفسي والإدراكي:</span>
                        <p className="text-stone-600 leading-relaxed">
                          تفكير حسي ملموس، مدى انتباه قصير (15 دقيقة)، تعلم بالقصص والرسوم، وشغف بالمكافآت الفورية.
                        </p>
                      </div>

                      <div>
                        <span className="font-bold text-stone-900 block mb-1">الواجهة وتجربة الطالب:</span>
                        <p className="text-stone-600 leading-relaxed">
                          ألوان دافئة مبهجة، شجرة المعايشة الحية، أزرار تسجيل كبيرة، وأوسمة تفاعلية مرحة.
                        </p>
                      </div>

                      <div>
                        <span className="font-bold text-stone-900 block mb-1">تطبيق المنهجية الخماسية:</span>
                        <p className="text-stone-600 leading-relaxed">
                          تلقين هادئ متأنٍ، معجم الصغار المصور، أسئلة وجدانية بسيطة، ومهام سلوكية محببة مع الوالدين.
                        </p>
                      </div>

                      <div>
                        <span className="font-bold text-stone-900 block mb-1">المرافقة الوالدية:</span>
                        <span className="inline-block bg-emerald-50 text-emerald-800 font-bold px-2 py-0.5 rounded text-[11px]">
                          مرافقة مباشرة ولصيقة بنسبة 100%
                        </span>
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setSelectedAgeTab('6-9');
                      setAgeViewMode('tabs');
                    }}
                    className="w-full py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs transition-colors cursor-pointer text-center"
                  >
                    استعراض التبويب المفصل لهذه الفئة
                  </button>
                </div>

                {/* Column 2: 10 - 12 */}
                <div className="bg-white rounded-3xl p-6 border-2 border-teal-400 shadow-xs flex flex-col justify-between space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-black text-teal-800 bg-teal-100 px-3 py-1 rounded-full">
                        10 - 12 سنة
                      </span>
                      <Compass className="w-6 h-6 text-teal-600" />
                    </div>
                    <div>
                      <h4 className="text-lg font-black text-stone-900">الناشئة وبناء الاستقلالية</h4>
                      <p className="text-xs text-teal-700 font-semibold mt-0.5">إدارة أهداف وتحديات تدبرية</p>
                    </div>

                    <div className="space-y-3 pt-2 border-t border-stone-100 text-xs">
                      <div>
                        <span className="font-bold text-stone-900 block mb-1">النمط النفسي والإدراكي:</span>
                        <p className="text-stone-600 leading-relaxed">
                          بداية التفكير السببي والمنطقي، حب المنافسة الإيجابية، الميل للاستقلالية مع الرغبة في التشجيع.
                        </p>
                      </div>

                      <div>
                        <span className="font-bold text-stone-900 block mb-1">الواجهة وتجربة الطالب:</span>
                        <p className="text-stone-600 leading-relaxed">
                          لوحة أهداف وإنجازات أسبوعية، مقياس إتقان رقمي، أداة مقارنة صوتية، وتحديات تفكير نقدي.
                        </p>
                      </div>

                      <div>
                        <span className="font-bold text-stone-900 block mb-1">تطبيق المنهجية الخماسية:</span>
                        <p className="text-stone-600 leading-relaxed">
                          ضبط أحكام التجويد الأساسية، خرائط مفاهيمية، حوارات الأقران مع الكوتش، ومبادرات أسرية.
                        </p>
                      </div>

                      <div>
                        <span className="font-bold text-stone-900 block mb-1">المرافقة الوالدية:</span>
                        <span className="inline-block bg-teal-50 text-teal-800 font-bold px-2 py-0.5 rounded text-[11px]">
                          إشراف متوازن وتشجيع واعٍ بنسبة 50%
                        </span>
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setSelectedAgeTab('10-12');
                      setAgeViewMode('tabs');
                    }}
                    className="w-full py-2.5 rounded-xl bg-teal-700 hover:bg-teal-800 text-white font-bold text-xs transition-colors cursor-pointer text-center"
                  >
                    استعراض التبويب المفصل لهذه الفئة
                  </button>
                </div>

                {/* Column 3: 13 - 15 */}
                <div className="bg-white rounded-3xl p-6 border-2 border-purple-400 shadow-xs flex flex-col justify-between space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-black text-purple-800 bg-purple-100 px-3 py-1 rounded-full">
                        13 - 15 سنة
                      </span>
                      <GraduationCap className="w-6 h-6 text-purple-600" />
                    </div>
                    <div>
                      <h4 className="text-lg font-black text-stone-900">اليافعون وترسيخ الهوية</h4>
                      <p className="text-xs text-purple-700 font-semibold mt-0.5">تأمل فكري وبوصلة قيمية راقية</p>
                    </div>

                    <div className="space-y-3 pt-2 border-t border-stone-100 text-xs">
                      <div>
                        <span className="font-bold text-stone-900 block mb-1">النمط النفسي والإدراكي:</span>
                        <p className="text-stone-600 leading-relaxed">
                          نضج فكري وتجريدي، بحث عن الهوية والمعنى، حساسية تجاه الوعظ السطحي، وتطلع لأثر قيادي.
                        </p>
                      </div>

                      <div>
                        <span className="font-bold text-stone-900 block mb-1">الواجهة وتجربة الطالب:</span>
                        <p className="text-stone-600 leading-relaxed">
                          تصميم مينيماليست حديث وعصري، دفتر الخواطر الخاص (Journal)، ومساحات للنقاش الفكري الرصين.
                        </p>
                      </div>

                      <div>
                        <span className="font-bold text-stone-900 block mb-1">تطبيق المنهجية الخماسية:</span>
                        <p className="text-stone-600 leading-relaxed">
                          ترتيل وإتقان وقوف الآيات، دراسة المفاهيم الكبرى، صالون تدبر أسبوعي، ومشاريع قيادية حقيقية.
                        </p>
                      </div>

                      <div>
                        <span className="font-bold text-stone-900 block mb-1">المرافقة الوالدية:</span>
                        <span className="inline-block bg-purple-50 text-purple-800 font-bold px-2 py-0.5 rounded text-[11px]">
                          شراكة ثقة واحترام استشاري كامل
                        </span>
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setSelectedAgeTab('13-15');
                      setAgeViewMode('tabs');
                    }}
                    className="w-full py-2.5 rounded-xl bg-purple-700 hover:bg-purple-800 text-white font-bold text-xs transition-colors cursor-pointer text-center"
                  >
                    استعراض التبويب المفصل لهذه الفئة
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Bottom Action Card */}
          <div className="p-6 sm:p-8 rounded-3xl bg-stone-50 border border-stone-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h4 className="font-black text-base text-stone-900">
                هل لديك أكثر من ابن في فئات عمرية مختلفة؟
              </h4>
              <p className="text-xs text-stone-600 mt-1 max-w-2xl leading-relaxed">
                تتيح لك المنصة تسجيل جميع أبنائك في حساب ولي أمر موحد، مع تجربة مستقلة ومخصصة لكل ابن بحسب مرحلته العمرية، بالإضافة إلى خصم الأخوة التصاعدي.
              </p>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <a
                href="#pricing"
                className="px-5 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs transition-colors cursor-pointer shadow-xs inline-flex items-center gap-1.5"
              >
                <span>حاسبة اشتراك الأخوة</span>
                <ArrowLeft className="w-3.5 h-3.5" />
              </a>
              <button
                type="button"
                onClick={onOpenRegister}
                className="px-5 py-2.5 rounded-xl bg-white hover:bg-stone-100 text-stone-800 border border-stone-300 font-bold text-xs transition-colors cursor-pointer"
              >
                تسجيل الأبناء الآن
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Comprehensive Monthly Follow-up Mechanism (آلية متابعة شهرية شاملة) */}
      <section id="deliverables" className="py-16 sm:py-20 lg:py-24 bg-stone-50 border-b border-stone-200 scroll-mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          {/* Section Header & Philosophy */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-stone-200 pb-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-bold mb-2">
                <Calendar className="w-3.5 h-3.5 text-amber-700" />
                <span>الركن الثالث: آلية متابعة شهرية شاملة</span>
              </div>
              <h2 className="text-2xl sm:text-3.5xl font-black text-stone-900 tracking-tight">
                ماذا يحصل ابنك خلال الشهر في معايشة القرآن؟
              </h2>
              <p className="text-stone-600 text-sm mt-2 max-w-3xl leading-relaxed">
                منظومة تربوية متكاملة لا تكتفي بالتسميع الآلي الجاف؛ بل تصحب الابن أسبوعاً بأسبوع عبر جلسات التدبر الحوارية، والمتابعة الفردية الدقيقة، والكتيب التفاعلي، والمهام الأسرية، وتقارير المتابعة الدورية لولي الأمر.
              </p>
            </div>

            {/* View Mode Switcher */}
            <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-white border border-stone-200 self-start md:self-auto shrink-0 shadow-2xs">
              <button
                type="button"
                onClick={() => setFollowUpViewMode('tabs')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                  followUpViewMode === 'tabs'
                    ? 'bg-amber-700 text-white shadow-xs'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                <span>عرض التبويب المفصل الموسّع</span>
              </button>
              <button
                type="button"
                onClick={() => setFollowUpViewMode('timeline')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                  followUpViewMode === 'timeline'
                    ? 'bg-amber-700 text-white shadow-xs'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                <Clock className="w-3.5 h-3.5" />
                <span>الجدول الزمني للشهر</span>
              </button>
              <button
                type="button"
                onClick={() => setFollowUpViewMode('grid')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                  followUpViewMode === 'grid'
                    ? 'bg-amber-700 text-white shadow-xs'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                <Users className="w-3.5 h-3.5" />
                <span>شبكة العناصر الشاملة</span>
              </button>
            </div>
          </div>

          {/* TABBED VIEW MODE */}
          {followUpViewMode === 'tabs' && (
            <div className="space-y-8 animate-fade-in">
              {/* 5 Core Elements Tab Buttons (Full Width) */}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
                {[
                  {
                    idx: 0,
                    title: '4 جلسات تدبر',
                    subtitle: 'أسبوعياً • جماعي تفاعلي',
                    icon: Users,
                    badge: 'حوار وبصيرة',
                    activeColor: 'bg-emerald-50 border-emerald-500 ring-2 ring-emerald-500/20 text-emerald-950',
                    badgeColor: 'bg-emerald-100 text-emerald-800',
                    iconBg: 'bg-emerald-700 text-white',
                  },
                  {
                    idx: 1,
                    title: '8 جلسات حفظ',
                    subtitle: 'جلستان أسبوعياً • فردي',
                    icon: Mic,
                    badge: 'تجويد وضبط',
                    activeColor: 'bg-teal-50 border-teal-500 ring-2 ring-teal-500/20 text-teal-950',
                    badgeColor: 'bg-teal-100 text-teal-800',
                    iconBg: 'bg-teal-700 text-white',
                  },
                  {
                    idx: 2,
                    title: 'كتيب الأنشطة',
                    subtitle: 'ملف شهري مطبوع ورقمي',
                    icon: BookOpen,
                    badge: 'خرائط وألغاز',
                    activeColor: 'bg-amber-50 border-amber-500 ring-2 ring-amber-500/20 text-amber-950',
                    badgeColor: 'bg-amber-100 text-amber-800',
                    iconBg: 'bg-amber-700 text-white',
                  },
                  {
                    idx: 3,
                    title: 'مهمات عشت الآية',
                    subtitle: 'تطبيقات أسرية بالمنزل',
                    icon: HeartHandshake,
                    badge: 'سلوك وترابط',
                    activeColor: 'bg-purple-50 border-purple-500 ring-2 ring-purple-500/20 text-purple-950',
                    badgeColor: 'bg-purple-100 text-purple-800',
                    iconBg: 'bg-purple-700 text-white',
                  },
                  {
                    idx: 4,
                    title: 'تقارير ولي الأمر',
                    subtitle: 'متابعة لحظية وتنبيهات',
                    icon: ShieldCheck,
                    badge: 'شفافية وطمأنينة',
                    activeColor: 'bg-blue-50 border-blue-500 ring-2 ring-blue-500/20 text-blue-950',
                    badgeColor: 'bg-blue-100 text-blue-800',
                    iconBg: 'bg-blue-700 text-white',
                  },
                ].map((tab) => {
                  const isSelected = selectedFollowUpTab === tab.idx;
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.idx}
                      type="button"
                      onClick={() => setSelectedFollowUpTab(tab.idx)}
                      className={`p-4 rounded-2xl border text-right transition-all cursor-pointer flex flex-col justify-between relative overflow-hidden ${
                        isSelected
                          ? tab.activeColor
                          : 'bg-white border-stone-200 text-stone-600 hover:bg-stone-50 hover:border-stone-300'
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between gap-1 mb-2">
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${tab.badgeColor}`}>
                            {tab.badge}
                          </span>
                          <span className="text-[11px] font-bold text-stone-400">0{tab.idx + 1}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div
                            className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                              isSelected ? tab.iconBg : 'bg-stone-100 text-stone-600'
                            }`}
                          >
                            <Icon className="w-4 h-4" />
                          </div>
                          <h4 className="font-black text-stone-900 text-xs sm:text-sm">{tab.title}</h4>
                        </div>
                      </div>
                      <p className="text-[11px] text-stone-500 mt-2 font-medium">{tab.subtitle}</p>
                    </button>
                  );
                })}
              </div>

              {/* ACTIVE TAB 0: 4 جلسات تدبر تفاعلية */}
              {selectedFollowUpTab === 0 && (
                <div className="space-y-6 animate-fade-in">
                  {/* Top Banner */}
                  <div className="p-6 sm:p-8 rounded-3xl bg-linear-to-l from-emerald-50 via-teal-50/40 to-white border border-emerald-200">
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                      <div className="space-y-2">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold">
                          <Users className="w-3.5 h-3.5 text-emerald-700" />
                          <span>المحور الأول: 4 جلسات تدبر جماعية تفاعلية شهرياً</span>
                        </div>
                        <h3 className="text-2xl sm:text-3xl font-black text-stone-900">
                          حوار فكري آمن يربط الآيات القرآنية بواقع وتحديات الطفل
                        </h3>
                        <p className="text-sm text-stone-600 max-w-3xl leading-relaxed">
                          جلسة أسبوعية مباشرة أونلاين (45 دقيقة) يقودها كوتش تربوي معتمد في مجموعات صغيرة (5-8 طلاب) متقاربة عمرياً؛ لا نلقن فيها الطفل بل نحاوره ونوقظ تفكيره ونمكنه من استنباط الرسائل القرآنية بنفسه.
                        </p>
                      </div>

                      <div className="flex flex-wrap sm:flex-nowrap gap-3 shrink-0">
                        <div className="p-4 rounded-2xl bg-white border border-emerald-200 text-center min-w-[120px] shadow-xs">
                          <span className="text-[11px] text-stone-500 font-semibold block">المعدل الزمني</span>
                          <span className="text-sm font-black text-emerald-800 mt-0.5 block">أسبوعياً • 45 د</span>
                        </div>
                        <div className="p-4 rounded-2xl bg-white border border-emerald-200 text-center min-w-[120px] shadow-xs">
                          <span className="text-[11px] text-stone-500 font-semibold block">حجم المجموعة</span>
                          <span className="text-sm font-black text-emerald-800 mt-0.5 block">5 - 8 طلاب فقط</span>
                        </div>
                        <div className="p-4 rounded-2xl bg-white border border-emerald-200 text-center min-w-[120px] shadow-xs">
                          <span className="text-[11px] text-stone-500 font-semibold block">الموجه</span>
                          <span className="text-sm font-black text-emerald-800 mt-0.5 block">كوتش تربوي متخصص</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* 4 Core Dimensions */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs space-y-2.5">
                      <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
                        <MessageCircle className="w-4 h-4" />
                      </div>
                      <h4 className="font-bold text-stone-900 text-sm">أسلوب الحوار التفاعلي</h4>
                      <p className="text-xs text-stone-600 leading-relaxed">
                        طرح أسئلة دهشة واستنباط ذكية تفتح مدارك الطفل وتدفعه للتفكير في سبب اختيار الكلمة القرآنية وعلاقتها بسلوكه.
                      </p>
                    </div>

                    <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs space-y-2.5">
                      <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
                        <Users className="w-4 h-4" />
                      </div>
                      <h4 className="font-bold text-stone-900 text-sm">مجموعات الأقران الصغيرة</h4>
                      <p className="text-xs text-stone-600 leading-relaxed">
                        فصول افتراضية مصغرة (5 إلى 8 طلاب) من نفس الشريحة العمرية لتوفير بيئة مشجعة تضمن مشاركة كل طفل بالصوت والصورة.
                      </p>
                    </div>

                    <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs space-y-2.5">
                      <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
                        <HelpCircle className="w-4 h-4" />
                      </div>
                      <h4 className="font-bold text-stone-900 text-sm">مساحة آمنة للتساؤلات</h4>
                      <p className="text-xs text-stone-600 leading-relaxed">
                        الاستماع لتساؤلات الأبناء وشكوكهم الفكرية والتربوية دون لوم أو تسفيه، والإجابة عنها بحكمة ومنطق قرآني سليم.
                      </p>
                    </div>

                    <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs space-y-2.5">
                      <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
                        <Award className="w-4 h-4" />
                      </div>
                      <h4 className="font-bold text-stone-900 text-sm">مخرجات الجلسة الأسبوعية</h4>
                      <p className="text-xs text-stone-600 leading-relaxed">
                        يخرج كل ابن في ختام الجلسة بـ «خاطرة تدبرية مكتوبة» وشعار سلوكي شخصي يوثقه في حسابه ليغذي شجرة المعايشة.
                      </p>
                    </div>
                  </div>

                  {/* Program Breakdown & Interactive UI Preview */}
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    <div className="lg:col-span-7 bg-white rounded-3xl p-6 border border-stone-200 shadow-xs space-y-4">
                      <div className="flex items-center justify-between border-b border-stone-100 pb-3">
                        <h4 className="font-black text-base text-stone-900">
                          البرنامج التفصيلي لجلسة التدبر الأسبوعية (45 دقيقة)
                        </h4>
                        <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full">
                          هيكل الجلسة
                        </span>
                      </div>

                      <div className="space-y-3">
                        {[
                          {
                            time: '00 - 05 د',
                            title: 'الافتتاحية وكسر الجليد ومشاركة أثر الأسبوع السابق',
                            desc: 'استقبال دافئ، مراجعة سريعة لما طبقه الطلاب في بيوتهم من وصايا الأسبوع الماضي والاحتفاء بإنجازاتهم.',
                          },
                          {
                            time: '05 - 20 د',
                            title: 'تلاوة الآيات واستكشاف المفاهيم والقصص القرآنية',
                            desc: 'استماع مشترك لتلاوة ندية، عرض السياق وأسباب النزول والمعاني البلاغية بأسلوب مشوق يناسب مداركهم.',
                          },
                          {
                            time: '20 - 35 د',
                            title: 'حلقة النقاش التفاعلي: «ماذا تقول لي هذه الآية اليوم؟»',
                            desc: 'طرح مواقف حياتية واقعية (في المدرسة، مع الأصدقاء، في المنزل) ومناقشة كيف توجهنا الآية للتصرف الأمثل.',
                          },
                          {
                            time: '35 - 45 د',
                            title: 'صياغة الخاطرة التدبرية وتحديد مهمة عشت الآية',
                            desc: 'تدوين كل طالب لرسالته الشخصية، واختتام الجلسة بدعاء مشترك وإعلان مهمة الأسبوع الأسرية الجديدة.',
                          },
                        ].map((s, i) => (
                          <div key={i} className="p-3 rounded-xl bg-stone-50 border border-stone-200/80 flex items-start gap-3">
                            <span className="px-2 py-1 rounded-lg bg-emerald-700 text-white text-[11px] font-black shrink-0">
                              {s.time}
                            </span>
                            <div>
                              <h5 className="font-bold text-xs text-stone-900">{s.title}</h5>
                              <p className="text-xs text-stone-600 mt-0.5 leading-relaxed">{s.desc}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Mockup Preview of Live Session Room */}
                    <div className="lg:col-span-5 bg-linear-to-b from-stone-900 via-emerald-950 to-stone-950 rounded-3xl p-6 text-white shadow-md flex flex-col justify-between space-y-4">
                      <div className="space-y-3">
                        <div className="flex items-center justify-between border-b border-emerald-800/60 pb-3">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-300 flex items-center justify-center">
                              <Users className="w-4 h-4" />
                            </div>
                            <div>
                              <span className="text-xs text-emerald-300 block font-medium">جلسة التدبر المباشرة</span>
                              <span className="text-sm font-black">غرفة الأبطال • الأسبوع الثاني</span>
                            </div>
                          </div>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                            مباشر الآن 🔴
                          </span>
                        </div>

                        {/* Visual Mockup Stage */}
                        <div className="bg-stone-800/80 rounded-2xl p-4 border border-emerald-700/40 space-y-3">
                          <div className="flex items-center justify-between text-xs text-emerald-200 border-b border-stone-700 pb-2">
                            <span className="font-bold">الموجه: أ. عبد الرحمن (كوتش معتمد)</span>
                            <span className="text-stone-400">6 طلاب متفاعلون</span>
                          </div>

                          <div className="p-3 rounded-xl bg-emerald-950/70 border border-emerald-800/50 space-y-1.5">
                            <span className="text-[10px] text-amber-300 font-bold block">سؤال التدبر المطروح للنقاش:</span>
                            <p className="text-xs text-emerald-100 leading-relaxed font-semibold">
                              «كيف تجعل القراءة والكتابة سبباً لتواضعك وقربك من الله لا لغرورك وتكبرك على الآخرين؟»
                            </p>
                          </div>

                          <div className="space-y-1.5 text-xs">
                            <div className="p-2 rounded-lg bg-stone-900/80 border border-stone-700 flex items-center justify-between">
                              <span className="text-emerald-300 font-medium">يوسف (11 سنة):</span>
                              <span className="text-stone-300 text-[11px]">«العلم الحقيقي يعلمنا كم نحن بحاجة لرحمة ربنا»</span>
                            </div>
                            <div className="p-2 rounded-lg bg-stone-900/80 border border-stone-700 flex items-center justify-between">
                              <span className="text-teal-300 font-medium">عمر (9 سنوات):</span>
                              <span className="text-stone-300 text-[11px]">«سأعلم أخي الصغير القراءة دون أن أسخر من خطئه»</span>
                            </div>
                          </div>

                          <button
                            type="button"
                            className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer shadow-xs transition-colors"
                          >
                            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                            <span>تسجيل خاطرة تدبرية واعتماد النقاط (+30)</span>
                          </button>
                        </div>
                      </div>

                      <div className="pt-2 border-t border-emerald-800/60 flex items-center justify-between text-xs">
                        <span className="text-emerald-300 text-[11px]">جلسات أسبوعية تفاعلية تبني القناعات</span>
                        <button
                          type="button"
                          onClick={() => setSelectedFollowUpTab(1)}
                          className="font-bold text-emerald-200 hover:text-white flex items-center gap-1 cursor-pointer text-xs"
                        >
                          <span>المحور التالي (8 جلسات حفظ)</span>
                          <ArrowLeft className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* ACTIVE TAB 1: 8 جلسات متابعة حفظ وتجويد فردية */}
              {selectedFollowUpTab === 1 && (
                <div className="space-y-6 animate-fade-in">
                  {/* Top Banner */}
                  <div className="p-6 sm:p-8 rounded-3xl bg-linear-to-l from-teal-50 via-cyan-50/40 to-white border border-teal-200">
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                      <div className="space-y-2">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-100 text-teal-800 text-xs font-bold">
                          <Mic className="w-3.5 h-3.5 text-teal-700" />
                          <span>المحور الثاني: 8 جلسات متابعة حفظ وتجويد فردية شهرياً</span>
                        </div>
                        <h3 className="text-2xl sm:text-3xl font-black text-stone-900">
                          تسميع فردي 1-on-1 مع محفظ مجاز لضبط مخارج الحروف والترتيل
                        </h3>
                        <p className="text-sm text-stone-600 max-w-3xl leading-relaxed">
                          جلستان أسبوعياً (25 - 30 دقيقة) تخصصان بالكامل لابنك؛ لا ينتظر دوره في حلقة مزدحمة، بل يتلقى اهتماماً كاملاً من محفظ صبور مجاز بالقراءات يصحح له نطق كل حرف برفق ويشجعه بأسلوب محبب.
                        </p>
                      </div>

                      <div className="flex flex-wrap sm:flex-nowrap gap-3 shrink-0">
                        <div className="p-4 rounded-2xl bg-white border border-teal-200 text-center min-w-[120px] shadow-xs">
                          <span className="text-[11px] text-stone-500 font-semibold block">المعدل الزمني</span>
                          <span className="text-sm font-black text-teal-800 mt-0.5 block">جلستان أسبوعياً</span>
                        </div>
                        <div className="p-4 rounded-2xl bg-white border border-teal-200 text-center min-w-[120px] shadow-xs">
                          <span className="text-[11px] text-stone-500 font-semibold block">نوع الجلسة</span>
                          <span className="text-sm font-black text-teal-800 mt-0.5 block">فردية خاصة 1-on-1</span>
                        </div>
                        <div className="p-4 rounded-2xl bg-white border border-teal-200 text-center min-w-[120px] shadow-xs">
                          <span className="text-[11px] text-stone-500 font-semibold block">المحفظ</span>
                          <span className="text-sm font-black text-teal-800 mt-0.5 block">مجاز بالسند المتصل</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* 4 Core Dimensions */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs space-y-2.5">
                      <div className="w-9 h-9 rounded-xl bg-teal-100 text-teal-700 flex items-center justify-center">
                        <GraduationCap className="w-4 h-4" />
                      </div>
                      <h4 className="font-bold text-stone-900 text-sm">محفظون مؤهلون ومجازون</h4>
                      <p className="text-xs text-stone-600 leading-relaxed">
                        نخبة من معلمي القرآن المجازين بالسند، الذين خضعوا لدورات تربوية في احتواء الأطفال واليافعين والتعامل مع الفروق الفردية.
                      </p>
                    </div>

                    <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs space-y-2.5">
                      <div className="w-9 h-9 rounded-xl bg-teal-100 text-teal-700 flex items-center justify-center">
                        <Sparkles className="w-4 h-4" />
                      </div>
                      <h4 className="font-bold text-stone-900 text-sm">ضبط التجويد والتلقين الصبور</h4>
                      <p className="text-xs text-stone-600 leading-relaxed">
                        التركيز على صحة مخارج الحروف، أحكام النون الساكنة والتنوين والمدود، والترتيل الهادئ المتزن دون أي تسرع أو إجهاد للطفل.
                      </p>
                    </div>

                    <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs space-y-2.5">
                      <div className="w-9 h-9 rounded-xl bg-teal-100 text-teal-700 flex items-center justify-center">
                        <Target className="w-4 h-4" />
                      </div>
                      <h4 className="font-bold text-stone-900 text-sm">مراعاة سرعة استيعاب الابن</h4>
                      <p className="text-xs text-stone-600 leading-relaxed">
                        خطة مرنة تتكيف مع طاقة ابنك؛ إن احتاج وقتاً أطول للتكرار ركزنا على التثبيت بدلاً من مراكمة الآيات دون إتقان.
                      </p>
                    </div>

                    <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs space-y-2.5">
                      <div className="w-9 h-9 rounded-xl bg-teal-100 text-teal-700 flex items-center justify-center">
                        <ShieldCheck className="w-4 h-4" />
                      </div>
                      <h4 className="font-bold text-stone-900 text-sm">تقرير إتقان فوري لولي الأمر</h4>
                      <p className="text-xs text-stone-600 leading-relaxed">
                        بعد كل جلسة مباشرة، يسجل المحفظ تقييماً رقمياً لدرجة الإتقان مع ملاحظة تشجيعية تصل إلى هاتف ولي الأمر.
                      </p>
                    </div>
                  </div>

                  {/* Program Breakdown & Interactive UI Preview */}
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    <div className="lg:col-span-7 bg-white rounded-3xl p-6 border border-stone-200 shadow-xs space-y-4">
                      <div className="flex items-center justify-between border-b border-stone-100 pb-3">
                        <h4 className="font-black text-base text-stone-900">
                          منهجية جلسة التسميع الفردية (30 دقيقة)
                        </h4>
                        <span className="text-xs font-bold text-teal-700 bg-teal-50 px-2.5 py-0.5 rounded-full">
                          تدرج الإتقان
                        </span>
                      </div>

                      <div className="space-y-3">
                        {[
                          {
                            step: '1. المراجعة والتثبيت',
                            title: 'تسميع المحفوظ السابق لضمان عدم التفلت',
                            desc: 'يبدأ الطالب بتسميع الآيات التي حفظها سابقاً، للتأكد من رسوخها قبل الانتقال للمقطع الجديد.',
                          },
                          {
                            step: '2. تصحيح التلاوة',
                            title: 'قراءة المقطع الجديد وضبط المخارج والأحكام',
                            desc: 'يقرأ الطالب الآيات الجديدة على المحفظ ليصحح له الحركات وأحكام التجويد كلمة كلمة دون تردد.',
                          },
                          {
                            step: '3. التلقين والترديد',
                            title: 'ترديد الطالب خلف المحفظ بنغمة ترتيل هادئة',
                            desc: 'يردد الطالب بصوته نغمة التلاوة الصحيحة ليألف لسانه وأذنه الصوت القرآني الجميل.',
                          },
                          {
                            step: '4. الرصد والاعتماد',
                            title: 'تسجيل درجة الإتقان وتحديد واجب المراجعة',
                            desc: 'يقوم المعلم برصد درجة الحفظ في التطبيق وإرسال رسالة تشجيع للابن مع واجب الجلسة التالية.',
                          },
                        ].map((s, i) => (
                          <div key={i} className="p-3 rounded-xl bg-stone-50 border border-stone-200/80 flex items-start gap-3">
                            <span className="px-2 py-1 rounded-lg bg-teal-700 text-white text-[11px] font-black shrink-0">
                              {s.step}
                            </span>
                            <div>
                              <h5 className="font-bold text-xs text-stone-900">{s.title}</h5>
                              <p className="text-xs text-stone-600 mt-0.5 leading-relaxed">{s.desc}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Mockup Preview of Memorization Card */}
                    <div className="lg:col-span-5 bg-linear-to-b from-stone-900 via-teal-950 to-stone-950 rounded-3xl p-6 text-white shadow-md flex flex-col justify-between space-y-4">
                      <div className="space-y-3">
                        <div className="flex items-center justify-between border-b border-teal-800/60 pb-3">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-teal-500/20 text-teal-300 flex items-center justify-center">
                              <Mic className="w-4 h-4" />
                            </div>
                            <div>
                              <span className="text-xs text-teal-300 block font-medium">سجل جلسة التحفيظ الفردية</span>
                              <span className="text-sm font-black">سورة العلق • الآيات 1 - 8</span>
                            </div>
                          </div>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-teal-500/20 text-teal-300 border border-teal-500/40">
                            جلسة فردية معتمدة ✓
                          </span>
                        </div>

                        {/* Visual Mockup Stage */}
                        <div className="bg-stone-800/80 rounded-2xl p-4 border border-teal-700/40 space-y-3">
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-stone-300">المحفظ المجاز: الشيخ أحمد المنشاوي</span>
                            <span className="text-amber-300 font-bold">درجة الإتقان: 10 / 10 ⭐</span>
                          </div>

                          <div className="p-3 rounded-xl bg-teal-950/70 border border-teal-800/50 space-y-2">
                            <span className="text-[10px] text-teal-300 font-bold block">ملاحظات المعلم التربوية:</span>
                            <p className="text-xs text-teal-100 leading-relaxed italic">
                              «ما شاء الله، إتقان ممتاز لمخرج حرف القاف في ﴿اقْرَأْ﴾ وحكم القلقلة، وترتيل متزن يعكس فهم الطالب لعظمة الآيات.»
                            </p>
                          </div>

                          <div className="grid grid-cols-2 gap-2 text-center text-xs">
                            <div className="p-2 rounded-lg bg-stone-900/80 border border-stone-700">
                              <span className="text-teal-300 font-bold block">100%</span>
                              <span className="text-[10px] text-stone-400">صحة الحفظ</span>
                            </div>
                            <div className="p-2 rounded-lg bg-stone-900/80 border border-stone-700">
                              <span className="text-teal-300 font-bold block">ممتاز</span>
                              <span className="text-[10px] text-stone-400">أحكام التجويد</span>
                            </div>
                          </div>

                          <div className="p-2.5 rounded-xl bg-teal-900/40 border border-teal-700/40 flex items-center justify-between text-xs">
                            <span className="text-teal-200">تسجيل التلاوة الصوتي متاح للاستماع</span>
                            <button
                              type="button"
                              className="px-2.5 py-1 rounded-lg bg-teal-600 hover:bg-teal-500 text-white font-bold text-[11px] transition-colors cursor-pointer"
                            >
                              تشغيل 🔊
                            </button>
                          </div>
                        </div>
                      </div>

                      <div className="pt-2 border-t border-teal-800/60 flex items-center justify-between text-xs">
                        <button
                          type="button"
                          onClick={() => setSelectedFollowUpTab(0)}
                          className="font-bold text-teal-200 hover:text-white flex items-center gap-1 cursor-pointer text-xs"
                        >
                          <ArrowRight className="w-3 h-3" />
                          <span>السابق (جلسات التدبر)</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setSelectedFollowUpTab(2)}
                          className="font-bold text-teal-200 hover:text-white flex items-center gap-1 cursor-pointer text-xs"
                        >
                          <span>المحور التالي (كتيب الأنشطة)</span>
                          <ArrowLeft className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* ACTIVE TAB 2: كتيب الأنشطة والخرائط المفاهيمية */}
              {selectedFollowUpTab === 2 && (
                <div className="space-y-6 animate-fade-in">
                  {/* Top Banner */}
                  <div className="p-6 sm:p-8 rounded-3xl bg-linear-to-l from-amber-50 via-orange-50/40 to-white border border-amber-200">
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                      <div className="space-y-2">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100 text-amber-800 text-xs font-bold">
                          <BookOpen className="w-3.5 h-3.5 text-amber-700" />
                          <span>المحور الثالث: كتيب الأنشطة والخرائط المفاهيمية التفاعلي</span>
                        </div>
                        <h3 className="text-2xl sm:text-3xl font-black text-stone-900">
                          حقيبة بصرية ملونة تربط الآيات بالرسم والخرائط الذهنية وألغاز التفكير
                        </h3>
                        <p className="text-sm text-stone-600 max-w-3xl leading-relaxed">
                          كتيب أنشطة شهري مصمم بإتقان بصري فائق، متوفر بنسخة رقمية تفاعلية للحل داخل المنصة ونسخة جاهزة للطباعة المنزلية؛ يثبت حفظ الآيات عبر الربط البصري والمعرفي الممتع.
                        </p>
                      </div>

                      <div className="flex flex-wrap sm:flex-nowrap gap-3 shrink-0">
                        <div className="p-4 rounded-2xl bg-white border border-amber-200 text-center min-w-[120px] shadow-xs">
                          <span className="text-[11px] text-stone-500 font-semibold block">عدد الصفحات</span>
                          <span className="text-sm font-black text-amber-800 mt-0.5 block">+32 صفحة شهرياً</span>
                        </div>
                        <div className="p-4 rounded-2xl bg-white border border-amber-200 text-center min-w-[120px] shadow-xs">
                          <span className="text-[11px] text-stone-500 font-semibold block">الصيغة</span>
                          <span className="text-sm font-black text-amber-800 mt-0.5 block">رقمي + جاهز للطباعة</span>
                        </div>
                        <div className="p-4 rounded-2xl bg-white border border-amber-200 text-center min-w-[120px] shadow-xs">
                          <span className="text-[11px] text-stone-500 font-semibold block">التكييف</span>
                          <span className="text-sm font-black text-amber-800 mt-0.5 block">مخصص لكل فئة عمرية</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* 4 Core Dimensions */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs space-y-2.5">
                      <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center">
                        <Compass className="w-4 h-4" />
                      </div>
                      <h4 className="font-bold text-stone-900 text-sm">خرائط ذهنية بصرية ميسرة</h4>
                      <p className="text-xs text-stone-600 leading-relaxed">
                        رسوم بيانية توضح الموضوعات الرئيسية للسورة وعلاقة الآيات ببعضها لتسهيل استرجاع الحفظ بطريقة فوتوغرافية في عقل الابن.
                      </p>
                    </div>

                    <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs space-y-2.5">
                      <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center">
                        <Gamepad2 className="w-4 h-4" />
                      </div>
                      <h4 className="font-bold text-stone-900 text-sm">ألغاز وأنشطة استنباطية</h4>
                      <p className="text-xs text-stone-600 leading-relaxed">
                        تحديات التوصيل، تلوين الآيات، استخراج الكلمات المفتاحية، وألغاز التدبر التي تزرع الفضول وحب البحث في كتاب الله.
                      </p>
                    </div>

                    <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs space-y-2.5">
                      <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center">
                        <BookOpen className="w-4 h-4" />
                      </div>
                      <h4 className="font-bold text-stone-900 text-sm">معجم الألفاظ القرآنية الفريدة</h4>
                      <p className="text-xs text-stone-600 leading-relaxed">
                        قاموس مصور يبسط معاني الكلمات غير المألوفة (مثل: العلق، ناصية، الزبانية، سندس) بأسلوب شيق يثري الحصيلة اللغوية للطفل.
                      </p>
                    </div>

                    <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs space-y-2.5">
                      <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center">
                        <Award className="w-4 h-4" />
                      </div>
                      <h4 className="font-bold text-stone-900 text-sm">سجل الإنجاز والملصقات</h4>
                      <p className="text-xs text-stone-600 leading-relaxed">
                        صفحات مخصصة لتثبيت ملصقات أوسمة شجرة المعايشة بعد إتمام كل صفحة، ليرى الابن ثمرة جهده ملموسة أمامه كل أسبوع.
                      </p>
                    </div>
                  </div>

                  {/* Program Breakdown & Interactive UI Preview */}
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    <div className="lg:col-span-7 bg-white rounded-3xl p-6 border border-stone-200 shadow-xs space-y-4">
                      <div className="flex items-center justify-between border-b border-stone-100 pb-3">
                        <h4 className="font-black text-base text-stone-900">
                          أقسام كتيب الأنشطة الشهري المعتمد
                        </h4>
                        <span className="text-xs font-bold text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-full">
                          محتويات الملف
                        </span>
                      </div>

                      <div className="space-y-3">
                        {[
                          {
                            section: 'القسم الأول',
                            title: 'المدخل البصري وقصة السورة وسياقها',
                            desc: 'رسوم توضيحية لزمان ومكان نزول السورة وقصتها المركزية وأثرها في تثبيت النبي ﷺ وأصحابه.',
                          },
                          {
                            section: 'القسم الثاني',
                            title: 'الخريطة الذهنية لمقاطع السورة الأربعة',
                            desc: 'تقسيم السورة إلى 4 أجزاء أسبوعية مع تلوين الكلمات وتوضيح الرابط الموضوعي بين كل مقطع والآخر.',
                          },
                          {
                            section: 'القسم الثالث',
                            title: 'تحديات التدبر الأسبوعية وأوراق العمل',
                            desc: 'أسئلة تفكير تطبيقي: ماذا أفعل لو تعرضت لهذا الموقف؟ وكيف أستشعر معية الله في يومي الدراسي؟',
                          },
                          {
                            section: 'القسم الرابع',
                            title: 'صفحات الإنجاز وميثاق «عشت الآية» العائلي',
                            desc: 'جدول متابعة المهام الأسرية المشتركة وختم إتمام السورة تمهيداً لحفل التكريم الشهري.',
                          },
                        ].map((s, i) => (
                          <div key={i} className="p-3 rounded-xl bg-stone-50 border border-stone-200/80 flex items-start gap-3">
                            <span className="px-2 py-1 rounded-lg bg-amber-700 text-white text-[11px] font-black shrink-0">
                              {s.section}
                            </span>
                            <div>
                              <h5 className="font-bold text-xs text-stone-900">{s.title}</h5>
                              <p className="text-xs text-stone-600 mt-0.5 leading-relaxed">{s.desc}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Mockup Preview of Workbook Page */}
                    <div className="lg:col-span-5 bg-linear-to-b from-stone-900 via-amber-950 to-stone-950 rounded-3xl p-6 text-white shadow-md flex flex-col justify-between space-y-4">
                      <div className="space-y-3">
                        <div className="flex items-center justify-between border-b border-amber-800/60 pb-3">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-amber-500/20 text-amber-300 flex items-center justify-center">
                              <BookOpen className="w-4 h-4" />
                            </div>
                            <div>
                              <span className="text-xs text-amber-300 block font-medium">معاينة كتيب الأنشطة التفاعلي</span>
                              <span className="text-sm font-black">سورة العلق • صفحة 14</span>
                            </div>
                          </div>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40">
                            متاح للطباعة والتنزيل
                          </span>
                        </div>

                        {/* Visual Mockup Stage */}
                        <div className="bg-stone-800/80 rounded-2xl p-4 border border-amber-700/40 space-y-3">
                          <div className="p-3 rounded-xl bg-amber-950/70 border border-amber-800/50 space-y-1.5">
                            <div className="flex items-center justify-between text-xs">
                              <span className="font-bold text-amber-200">لغز التدبر البصري:</span>
                              <span className="text-[10px] bg-amber-400/20 text-amber-300 px-1.5 py-0.5 rounded font-bold">
                                +20 نقطة
                              </span>
                            </div>
                            <p className="text-xs text-amber-100 leading-relaxed">
                              «صل بين كل أداة من أدوات العلم في السورة والأثر الذي تحدثه في قلب الإنسان الصالح.»
                            </p>
                          </div>

                          <div className="space-y-2 text-xs">
                            <div className="p-2 rounded-lg bg-stone-900/80 border border-stone-700 flex items-center justify-between">
                              <span className="text-stone-300">القلم والكتابة ✍️</span>
                              <span className="text-emerald-300 text-[11px] font-bold">← حفظ العلم ونفع الناس</span>
                            </div>
                            <div className="p-2 rounded-lg bg-stone-900/80 border border-stone-700 flex items-center justify-between">
                              <span className="text-stone-300">القراءة باسم الله 📖</span>
                              <span className="text-teal-300 text-[11px] font-bold">← بركة الفهم والتواضع</span>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 pt-1">
                            <button
                              type="button"
                              className="flex-1 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
                            >
                              <BookOpen className="w-3.5 h-3.5" />
                              <span>تحميل الكتيب الشهري (PDF)</span>
                            </button>
                          </div>
                        </div>
                      </div>

                      <div className="pt-2 border-t border-amber-800/60 flex items-center justify-between text-xs">
                        <button
                          type="button"
                          onClick={() => setSelectedFollowUpTab(1)}
                          className="font-bold text-amber-200 hover:text-white flex items-center gap-1 cursor-pointer text-xs"
                        >
                          <ArrowRight className="w-3 h-3" />
                          <span>السابق (جلسات الحفظ)</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setSelectedFollowUpTab(3)}
                          className="font-bold text-amber-200 hover:text-white flex items-center gap-1 cursor-pointer text-xs"
                        >
                          <span>المحور التالي (مهمات الأسرة)</span>
                          <ArrowLeft className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* ACTIVE TAB 3: مهمات «عشت الآية» والأسرة */}
              {selectedFollowUpTab === 3 && (
                <div className="space-y-6 animate-fade-in">
                  {/* Top Banner */}
                  <div className="p-6 sm:p-8 rounded-3xl bg-linear-to-l from-purple-50 via-pink-50/40 to-white border border-purple-200">
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                      <div className="space-y-2">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-100 text-purple-800 text-xs font-bold">
                          <HeartHandshake className="w-3.5 h-3.5 text-purple-700" />
                          <span>المحور الرابع: مهمات «عشت الآية» والتطبيقات الأسرية</span>
                        </div>
                        <h3 className="text-2xl sm:text-3xl font-black text-stone-900">
                          تحويل معاني القرآن إلى ممارسات سلوكية تعزز الترابط العائلي
                        </h3>
                        <p className="text-sm text-stone-600 max-w-3xl leading-relaxed">
                          لا ينتهي وقت القرآن بانتهاء الجلسة؛ بل ينتقل نوره إلى صميم البيت. مهمة عائلية أسبوعية محببة يشارك فيها الابن والديه وإخوانه، تثبت الآية في السلوك، ويعتمدها ولي الأمر بنقرة زر في بوابته.
                        </p>
                      </div>

                      <div className="flex flex-wrap sm:flex-nowrap gap-3 shrink-0">
                        <div className="p-4 rounded-2xl bg-white border border-purple-200 text-center min-w-[120px] shadow-xs">
                          <span className="text-[11px] text-stone-500 font-semibold block">المعدل</span>
                          <span className="text-sm font-black text-purple-800 mt-0.5 block">مهمة أسرية أسبوعياً</span>
                        </div>
                        <div className="p-4 rounded-2xl bg-white border border-purple-200 text-center min-w-[120px] shadow-xs">
                          <span className="text-[11px] text-stone-500 font-semibold block">الأداة</span>
                          <span className="text-sm font-black text-purple-800 mt-0.5 block">بطاقات مادية + رقمية</span>
                        </div>
                        <div className="p-4 rounded-2xl bg-white border border-purple-200 text-center min-w-[120px] shadow-xs">
                          <span className="text-[11px] text-stone-500 font-semibold block">الاعتماد</span>
                          <span className="text-sm font-black text-purple-800 mt-0.5 block">بنقرة من ولي الأمر</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* 4 Core Dimensions */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs space-y-2.5">
                      <div className="w-9 h-9 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center">
                        <CheckCircle2 className="w-4 h-4" />
                      </div>
                      <h4 className="font-bold text-stone-900 text-sm">تطبيق سلوكي ملموس</h4>
                      <p className="text-xs text-stone-600 leading-relaxed">
                        تحويل المعنى المجرد إلى فعل يراه الطفل: تقبيل رأس الأم، التصدق من مصروفه، جبر خاطر أخيه، أو تنظيف غرفته إحساناً.
                      </p>
                    </div>

                    <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs space-y-2.5">
                      <div className="w-9 h-9 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center">
                        <HeartHandshake className="w-4 h-4" />
                      </div>
                      <h4 className="font-bold text-stone-900 text-sm">جلسة حوار أسري (10 دقائق)</h4>
                      <p className="text-xs text-stone-600 leading-relaxed">
                        جلسة عائلية أسبوعية دافئة حول مائدة الطعام أو غرفة المعيشة، يعرض فيها الابن ما تعلمه ويفسر الآية لوالديه بعفويته.
                      </p>
                    </div>

                    <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs space-y-2.5">
                      <div className="w-9 h-9 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center">
                        <Award className="w-4 h-4" />
                      </div>
                      <h4 className="font-bold text-stone-900 text-sm">ثمار شجرة المعايشة</h4>
                      <p className="text-xs text-stone-600 leading-relaxed">
                        كل مهمة أسرية تكتمل تمنح شجرة الابن أوراقاً خضراء وثماراً ذهبية إضافية وتفتح له وسام «عشت الآية» في حسابه.
                      </p>
                    </div>

                    <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs space-y-2.5">
                      <div className="w-9 h-9 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center">
                        <ShieldCheck className="w-4 h-4" />
                      </div>
                      <h4 className="font-bold text-stone-900 text-sm">شراكة حقيقية مع الوالدين</h4>
                      <p className="text-xs text-stone-600 leading-relaxed">
                        نزيل عن كاهل الوالدين عبء الملاحقة والخصام، ونحول وقت القرآن إلى فرصة للتقارب والثناء والتشجيع المتبادل.
                      </p>
                    </div>
                  </div>

                  {/* Program Breakdown & Interactive UI Preview */}
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    <div className="lg:col-span-7 bg-white rounded-3xl p-6 border border-stone-200 shadow-xs space-y-4">
                      <div className="flex items-center justify-between border-b border-stone-100 pb-3">
                        <h4 className="font-black text-base text-stone-900">
                          أمثلة عملية لمهام «عشت الآية» لشهر سورة العلق
                        </h4>
                        <span className="text-xs font-bold text-purple-700 bg-purple-50 px-2.5 py-0.5 rounded-full">
                          تطبيقات منزلية
                        </span>
                      </div>

                      <div className="space-y-3">
                        {[
                          {
                            week: 'الأسبوع 1',
                            ayah: '﴿اقْرَأْ بِاسْمِ رَبِّكَ الَّذِي خَلَقَ﴾',
                            task: '«جلسة القراءة الأسرية»: يختار الابن كتاباً نافعاً أو قصة نبوية ويقرأ منها صفحة على والديه بصوت جهوري جميل.',
                          },
                          {
                            week: 'الأسبوع 2',
                            ayah: '﴿الَّذِي عَلَّمَ بِالْقَلَمِ ۝ عَلَّمَ الْإِنسَانَ مَا لَمْ يَعْلَمْ﴾',
                            task: '«رسالة الامتنان»: كتابة رسالة شكر بخط يده إلى معلمه في المدرسة أو والديه تقديراً لجهدهم في تعليمه.',
                          },
                          {
                            week: 'الأسبوع 3',
                            ayah: '﴿كَلَّا إِنَّ الْإِنسَانَ لَيَطْغَىٰ ۝ أَن رَّآهُ اسْتَغْنَىٰ﴾',
                            task: '«مهمة التواضع والإنفاق»: يفرز الابن جزءاً من ألعابه أو ملابسه الفائضة للتبرع بها لصالح أطفال محتاجين.',
                          },
                          {
                            week: 'الأسبوع 4',
                            ayah: '﴿كَلَّا لَا تُطِعْهُ وَاسْجُدْ وَاقْتَرِب ۩﴾',
                            task: '«سجدة الشكر العائلية»: قيام الابن بالدعاء لوالديه في سجوده وتقديم هدية رمزية صنعها بنفسه في ختام السورة.',
                          },
                        ].map((s, i) => (
                          <div key={i} className="p-3 rounded-xl bg-stone-50 border border-stone-200/80 flex items-start gap-3">
                            <span className="px-2 py-1 rounded-lg bg-purple-700 text-white text-[11px] font-black shrink-0">
                              {s.week}
                            </span>
                            <div>
                              <span className="text-[11px] font-bold text-purple-900 block">{s.ayah}</span>
                              <p className="text-xs text-stone-600 mt-0.5 leading-relaxed">{s.task}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Mockup Preview of Family Task Card */}
                    <div className="lg:col-span-5 bg-linear-to-b from-stone-900 via-purple-950 to-stone-950 rounded-3xl p-6 text-white shadow-md flex flex-col justify-between space-y-4">
                      <div className="space-y-3">
                        <div className="flex items-center justify-between border-b border-purple-800/60 pb-3">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-purple-500/20 text-purple-300 flex items-center justify-center">
                              <HeartHandshake className="w-4 h-4" />
                            </div>
                            <div>
                              <span className="text-xs text-purple-300 block font-medium">بطاقة عشت الآية الأسبوعية</span>
                              <span className="text-sm font-black">مهمة الأسبوع الثاني • الأسرة</span>
                            </div>
                          </div>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/40">
                            في انتظار اعتماد الأب ⏳
                          </span>
                        </div>

                        {/* Visual Mockup Stage */}
                        <div className="bg-stone-800/80 rounded-2xl p-4 border border-purple-700/40 space-y-3">
                          <div className="p-3 rounded-xl bg-purple-950/70 border border-purple-800/50 space-y-1.5">
                            <span className="text-[10px] text-amber-300 font-bold block">مهمة اليوم: «رسالة الامتنان والمحبة»</span>
                            <p className="text-xs text-purple-100 leading-relaxed font-semibold">
                              «كتب عمر رسالة شكر لوالدته وعانقها وقرأ عليها الآيات بتأثر بالغ.»
                            </p>
                          </div>

                          <div className="p-3 rounded-xl bg-stone-900/90 border border-stone-700 space-y-2 text-xs">
                            <div className="flex items-center justify-between">
                              <span className="text-stone-300 font-bold">اعتماد ولي الأمر:</span>
                              <span className="text-amber-300 font-black">+50 نقطة شجرة</span>
                            </div>
                            <p className="text-[11px] text-stone-400">
                              بمجرد النقر، تضاف النقاط فوراً وتنمو شجرة المعايشة للابن.
                            </p>
                          </div>

                          <button
                            type="button"
                            className="w-full py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer transition-colors shadow-xs"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>اعتماد إنجاز الابن للمهمة بنجاح ✓</span>
                          </button>
                        </div>
                      </div>

                      <div className="pt-2 border-t border-purple-800/60 flex items-center justify-between text-xs">
                        <button
                          type="button"
                          onClick={() => setSelectedFollowUpTab(2)}
                          className="font-bold text-purple-200 hover:text-white flex items-center gap-1 cursor-pointer text-xs"
                        >
                          <ArrowRight className="w-3 h-3" />
                          <span>السابق (كتيب الأنشطة)</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setSelectedFollowUpTab(4)}
                          className="font-bold text-purple-200 hover:text-white flex items-center gap-1 cursor-pointer text-xs"
                        >
                          <span>المحور التالي (تقارير ولي الأمر)</span>
                          <ArrowLeft className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* ACTIVE TAB 4: تقارير الأداء وبوابة ولي الأمر */}
              {selectedFollowUpTab === 4 && (
                <div className="space-y-6 animate-fade-in">
                  {/* Top Banner */}
                  <div className="p-6 sm:p-8 rounded-3xl bg-linear-to-l from-blue-50 via-indigo-50/40 to-white border border-blue-200">
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                      <div className="space-y-2">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-xs font-bold">
                          <ShieldCheck className="w-3.5 h-3.5 text-blue-700" />
                          <span>المحور الخامس: تقارير الأداء وبوابة ولي الأمر اللحظية</span>
                        </div>
                        <h3 className="text-2xl sm:text-3xl font-black text-stone-900">
                          لوحة تحكم ذكية تمنحك طمأنينة كاملة واطلاعاً فورياً دون ملاحقة
                        </h3>
                        <p className="text-sm text-stone-600 max-w-3xl leading-relaxed">
                          نضع بين يديك تقارير نوعية شفافة توضح حضور ابنك، درجات إتقانه في الحفظ والتجويد، مشاركاته في جلسات التدبر، وتطبيقه للمهام الأسرية، مع إشعارات واتساب تضعك دائماً في الصورة.
                        </p>
                      </div>

                      <div className="flex flex-wrap sm:flex-nowrap gap-3 shrink-0">
                        <div className="p-4 rounded-2xl bg-white border border-blue-200 text-center min-w-[120px] shadow-xs">
                          <span className="text-[11px] text-stone-500 font-semibold block">سرعة التقارير</span>
                          <span className="text-sm font-black text-blue-800 mt-0.5 block">فورية بعد كل جلسة</span>
                        </div>
                        <div className="p-4 rounded-2xl bg-white border border-blue-200 text-center min-w-[120px] shadow-xs">
                          <span className="text-[11px] text-stone-500 font-semibold block">التقرير الشهري</span>
                          <span className="text-sm font-black text-blue-800 mt-0.5 block">تحليلي شامل معتمد</span>
                        </div>
                        <div className="p-4 rounded-2xl bg-white border border-blue-200 text-center min-w-[120px] shadow-xs">
                          <span className="text-[11px] text-stone-500 font-semibold block">قناة التنبيهات</span>
                          <span className="text-sm font-black text-blue-800 mt-0.5 block">واتساب + البوابة</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* 4 Core Dimensions */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs space-y-2.5">
                      <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center">
                        <MessageCircle className="w-4 h-4" />
                      </div>
                      <h4 className="font-bold text-stone-900 text-sm">تنبيهات فورية عبر واتساب</h4>
                      <p className="text-xs text-stone-600 leading-relaxed">
                        تذكير قبل موعد الجلسة بـ 15 دقيقة، وإشعار فوري بعد انتهاء الجلسة بملخص إنجاز الابن وملاحظة المعلم.
                      </p>
                    </div>

                    <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs space-y-2.5">
                      <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center">
                        <TreeDeciduous className="w-4 h-4" />
                      </div>
                      <h4 className="font-bold text-stone-900 text-sm">رصد شجرة المعايشة الحية</h4>
                      <p className="text-xs text-stone-600 leading-relaxed">
                        متابعة نمو أوراق الشجرة وثمارها ورصيد النقاط والأوسمة التي حققها كل ابن في حسابه المستقل.
                      </p>
                    </div>

                    <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs space-y-2.5">
                      <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center">
                        <FileText className="w-4 h-4" />
                      </div>
                      <h4 className="font-bold text-stone-900 text-sm">التقرير الشهري التحليلي</h4>
                      <p className="text-xs text-stone-600 leading-relaxed">
                        ملف تحليلي شامل يصدر نهاية الشهر يتضمن توصيات المحفظ والكوتش ونقاط القوة وخطة الشهر التالي.
                      </p>
                    </div>

                    <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs space-y-2.5">
                      <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center">
                        <HeartHandshake className="w-4 h-4" />
                      </div>
                      <h4 className="font-bold text-stone-900 text-sm">استشارة تربوية دورية</h4>
                      <p className="text-xs text-stone-600 leading-relaxed">
                        إمكانية التواصل المباشر مع الكوتش التربوي لحل أي تحدٍ يواجه الابن في التزامه أو علاقته بالقرآن.
                      </p>
                    </div>
                  </div>

                  {/* Program Breakdown & Interactive UI Preview */}
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    <div className="lg:col-span-7 bg-white rounded-3xl p-6 border border-stone-200 shadow-xs space-y-4">
                      <div className="flex items-center justify-between border-b border-stone-100 pb-3">
                        <h4 className="font-black text-base text-stone-900">
                          عناصر التقرير الشهري الشامل لولي الأمر
                        </h4>
                        <span className="text-xs font-bold text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded-full">
                          محتويات التقرير
                        </span>
                      </div>

                      <div className="space-y-3">
                        {[
                          {
                            indicator: 'مؤشر الحفظ والتجويد',
                            desc: 'رسم بياني يوضح نسبة إتقان الآيات المقررة، ومخارج الحروف، وأحكام الترتيل في الجلسات الثماني.',
                          },
                          {
                            indicator: 'مؤشر التدبر والتفاعل الفكري',
                            desc: 'تقييم الكوتش لمشاركة الابن في صالون التدبر، جودة تساؤلاته، واستنتاجه للرسائل القيمية.',
                          },
                          {
                            indicator: 'مؤشر الالتزام بالسلوك والمهام الأسرية',
                            desc: 'سجل مهمات «عشت الآية» المنجزة داخل المنزل بنسبة مئوية واضحة تؤكد أثر القرآن العملي.',
                          },
                          {
                            indicator: 'توصيات الكوتش والمحفظ للمرحلة القادمة',
                            desc: 'فقرة نوعية يكتبها الفريق التربوي تسلط الضوء على مكامن النبوغ وسبل تنميتها في الدورة التالية.',
                          },
                        ].map((s, i) => (
                          <div key={i} className="p-3 rounded-xl bg-stone-50 border border-stone-200/80 flex items-start gap-3">
                            <span className="px-2 py-1 rounded-lg bg-blue-700 text-white text-[11px] font-black shrink-0">
                              0{i + 1}
                            </span>
                            <div>
                              <h5 className="font-bold text-xs text-stone-900">{s.indicator}</h5>
                              <p className="text-xs text-stone-600 mt-0.5 leading-relaxed">{s.desc}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Mockup Preview of Parent Report */}
                    <div className="lg:col-span-5 bg-linear-to-b from-stone-900 via-blue-950 to-stone-950 rounded-3xl p-6 text-white shadow-md flex flex-col justify-between space-y-4">
                      <div className="space-y-3">
                        <div className="flex items-center justify-between border-b border-blue-800/60 pb-3">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-blue-500/20 text-blue-300 flex items-center justify-center">
                              <ShieldCheck className="w-4 h-4" />
                            </div>
                            <div>
                              <span className="text-xs text-blue-300 block font-medium">لوحة متابعة ولي الأمر</span>
                              <span className="text-sm font-black">تقرير الشهر الأول • عمر (7 سنوات)</span>
                            </div>
                          </div>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                            مستوى إتقان: متميز 🌟
                          </span>
                        </div>

                        {/* Visual Mockup Stage */}
                        <div className="bg-stone-800/80 rounded-2xl p-4 border border-blue-700/40 space-y-3">
                          <div className="grid grid-cols-3 gap-2 text-center text-xs">
                            <div className="p-2 rounded-xl bg-stone-900/90 border border-stone-700">
                              <span className="text-emerald-400 font-bold block text-sm">100%</span>
                              <span className="text-[10px] text-stone-400">نسبة الحضور</span>
                            </div>
                            <div className="p-2 rounded-xl bg-stone-900/90 border border-stone-700">
                              <span className="text-teal-400 font-bold block text-sm">9.8/10</span>
                              <span className="text-[10px] text-stone-400">إتقان الحفظ</span>
                            </div>
                            <div className="p-2 rounded-xl bg-stone-900/90 border border-stone-700">
                              <span className="text-amber-400 font-bold block text-sm">4 / 4</span>
                              <span className="text-[10px] text-stone-400">مهام الأسرة</span>
                            </div>
                          </div>

                          <div className="p-3 rounded-xl bg-blue-950/70 border border-blue-800/50 space-y-1 text-xs">
                            <span className="text-[10px] text-blue-300 font-bold block">ملاحظة الكوتش لولي الأمر:</span>
                            <p className="text-[11px] text-blue-100 leading-relaxed italic">
                              «عمر يظهر شغفاً لافتاً في ربط الآيات ببر الوالدين؛ تشجيعه العائلي المستمر يصنع منه نموذجاً ملهماً لأقرانه.»
                            </p>
                          </div>

                          <button
                            type="button"
                            onClick={onOpenLogin}
                            className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer transition-colors shadow-xs"
                          >
                            <ShieldCheck className="w-3.5 h-3.5" />
                            <span>دخول لوحة تحكم ولي الأمر الآن</span>
                          </button>
                        </div>
                      </div>

                      <div className="pt-2 border-t border-blue-800/60 flex items-center justify-between text-xs">
                        <button
                          type="button"
                          onClick={() => setSelectedFollowUpTab(3)}
                          className="font-bold text-blue-200 hover:text-white flex items-center gap-1 cursor-pointer text-xs"
                        >
                          <ArrowRight className="w-3 h-3" />
                          <span>السابق (مهمات الأسرة)</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setSelectedFollowUpTab(0)}
                          className="font-bold text-blue-200 hover:text-white flex items-center gap-1 cursor-pointer text-xs"
                        >
                          <span>العودة للمحور الأول (جلسات التدبر)</span>
                          <ArrowLeft className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TIMELINE VIEW MODE (Weekly Rhythm Timeline) */}
          {followUpViewMode === 'timeline' && (
            <div className="space-y-6 animate-fade-in">
              <div className="text-center max-w-2xl mx-auto mb-4">
                <span className="text-xs font-bold text-amber-800 bg-amber-100 px-3 py-1 rounded-full">
                  التوزيع الزمني الدقيق
                </span>
                <h4 className="text-xl sm:text-2xl font-black text-stone-900 mt-2">
                  الجدول الزمني الأسبوعي لرحلة المعايشة خلال الشهر
                </h4>
                <p className="text-xs text-stone-600 mt-1">
                  كيف تتوزع جلسات التدبر والحفظ والكتيب والتطبيقات المنزلية على مدار أسابيع الشهر الأربعة
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  {
                    week: 'الأسبوع الأول',
                    title: 'انطلاق السورة وغرس الحب',
                    color: 'border-emerald-300 bg-emerald-50/50',
                    badgeColor: 'bg-emerald-100 text-emerald-800',
                    items: [
                      'جلسة التدبر 1: مدخل السورة وقصتها وسياق النزول.',
                      'جلسة الحفظ 1: تصحيح وضبط تلاوة المقطع الأول.',
                      'جلسة الحفظ 2: تلقين وحفظ المقطع الأول مع المحفظ.',
                      'كتيب الأنشطة: حل الخريطة الذهنية التأسيسية.',
                      'مهمة الأسرة 1: بطاقة عشت الآية (القراءة المشتركة).',
                      'التقرير: إشعار ترحيبي وتقييم أول جلستين.',
                    ],
                  },
                  {
                    week: 'الأسبوع الثاني',
                    title: 'تعميق المعنى وإتقان الترتيل',
                    color: 'border-teal-300 bg-teal-50/50',
                    badgeColor: 'bg-teal-100 text-teal-800',
                    items: [
                      'جلسة التدبر 2: تفكيك المفاهيم الأخلاقية في الآيات.',
                      'جلسة الحفظ 3: تصحيح تلاوة المقطع الثاني وضبط أحكامه.',
                      'جلسة الحفظ 4: تثبيت المقطعين 1 و 2 معاً دون خطأ.',
                      'كتيب الأنشطة: حل لغز المفردات القرآنية وأنشطة الرسم.',
                      'مهمة الأسرة 2: بطاقة عشت الآية (رسالة الامتنان).',
                      'التقرير: تقرير نصف شهري أولي بنسبة الإتقان.',
                    ],
                  },
                  {
                    week: 'الأسبوع الثالث',
                    title: 'الربط بالواقع والمبادرة العملية',
                    color: 'border-amber-300 bg-amber-50/50',
                    badgeColor: 'bg-amber-100 text-amber-800',
                    items: [
                      'جلسة التدبر 3: نقاش التحديات المعاصرة والاعتزاز بالدين.',
                      'جلسة الحفظ 5: تصحيح تلاوة المقطع الثالث وضبط المدود.',
                      'جلسة الحفظ 6: الربط بين مقاطع السورة وتثبيت الحفظ.',
                      'كتيب الأنشطة: استكمال التحدي الفكري وألغاز الاستنباط.',
                      'مهمة الأسرة 3: بطاقة عشت الآية (مبادرة التواضع والإنفاق).',
                      'التقرير: رصد ثمار شجرة المعايشة ورصيد النقاط.',
                    ],
                  },
                  {
                    week: 'الأسبوع الرابع',
                    title: 'ختام السورة والاحتفال بالهوية',
                    color: 'border-purple-300 bg-purple-50/50',
                    badgeColor: 'bg-purple-100 text-purple-800',
                    items: [
                      'جلسة التدبر 4: عرض الطلاب لخواطرهم وسجدة الشكر.',
                      'جلسة الحفظ 7: سرد السورة كاملة على المحفظ بالسند.',
                      'جلسة الحفظ 8: اختبار الإتقان النهائي واعتماد النتيجة.',
                      'كتيب الأنشطة: إتمام صفحات الكتيب وختم الميثاق.',
                      'مهمة الأسرة 4: احتفال عائلي صغير بارتداء وسام السورة.',
                      'التقرير: إصدار التقرير الشهري التحليلي والشهادة المعتمدة.',
                    ],
                  },
                ].map((w, i) => (
                  <div
                    key={i}
                    className={`bg-white rounded-3xl p-5 border-2 ${w.color} shadow-xs flex flex-col justify-between space-y-4`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <span className={`text-xs font-black px-2.5 py-0.5 rounded-full ${w.badgeColor}`}>
                          {w.week}
                        </span>
                        <span className="text-xs font-bold text-stone-400">المرحلة {i + 1}</span>
                      </div>
                      <h4 className="font-black text-stone-900 text-base mb-3">{w.title}</h4>

                      <div className="space-y-2 border-t border-stone-100 pt-3">
                        {w.items.map((it, idx) => (
                          <div key={idx} className="flex items-start gap-2 text-xs text-stone-700 leading-relaxed">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                            <span>{it}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        setSelectedFollowUpTab(i < 4 ? i : 0);
                        setFollowUpViewMode('tabs');
                      }}
                      className="w-full py-2 rounded-xl bg-stone-50 hover:bg-stone-100 text-stone-700 text-xs font-bold border border-stone-200 transition-colors cursor-pointer text-center"
                    >
                      استعراض تفاصيل عناصر هذا الأسبوع
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ALL ELEMENTS GRID VIEW MODE */}
          {followUpViewMode === 'grid' && (
            <div className="space-y-6 animate-fade-in">
              <div className="text-center max-w-2xl mx-auto mb-4">
                <span className="text-xs font-bold text-amber-800 bg-amber-100 px-3 py-1 rounded-full">
                  شبكة العناصر الكاملة
                </span>
                <h4 className="text-xl sm:text-2xl font-black text-stone-900 mt-2">
                  الركائز الخمس لآلية المتابعة الشهرية الشاملة
                </h4>
                <p className="text-xs text-stone-600 mt-1">
                  نظرة موحدة تضم جميع المحتويات التي يحصل عليها الابن شهرياً في مكان واحد
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[
                  {
                    idx: 0,
                    icon: Users,
                    title: '4 جلسات تدبر جماعية',
                    badge: 'أسبوعياً • 45 دقيقة',
                    desc: 'حوار مفتوح في مجموعات صغيرة يقودها الكوتش لتفكيك معاني الآيات وبناء القناعات الأخلاقية.',
                    color: 'border-emerald-300 bg-white',
                    iconBg: 'bg-emerald-100 text-emerald-800',
                    points: [
                      'مجموعات صغيرة (5-8 طلاب) متقاربة عمرياً.',
                      'ربط الآيات بالسلوكيات والتحديات الواقعية.',
                      'صياغة خاطرة تدبرية شخصية بنهاية كل جلسة.',
                    ],
                  },
                  {
                    idx: 1,
                    icon: Mic,
                    title: '8 جلسات متابعة حفظ فردية',
                    badge: 'جلستان أسبوعياً • 1-on-1',
                    desc: 'تسميع فردي مخصص مع محفظ مجاز لضبط مخارج الحروف وأحكام الترتيل دون تسرع.',
                    color: 'border-teal-300 bg-white',
                    iconBg: 'bg-teal-100 text-teal-800',
                    points: [
                      'جلسات فردية خاصة بالكامل مع المحفظ.',
                      'تصحيح دقيق للنون والمدود ومخارج الحروف.',
                      'تقييم فوري لكل جلسة يصل لهاتف ولي الأمر.',
                    ],
                  },
                  {
                    idx: 2,
                    icon: BookOpen,
                    title: 'كتيب الأنشطة والخرائط المفاهيمية',
                    badge: 'ملف شهري مطبوع ورقمي',
                    desc: 'حقيبة بصرية ملونة +32 صفحة تثبت معاني السورة عبر الخرائط الذهنية وألغاز التدبر.',
                    color: 'border-amber-300 bg-white',
                    iconBg: 'bg-amber-100 text-amber-800',
                    points: [
                      'خرائط ذهنية بصرية تربط مقاطع السورة.',
                      'ألغاز وتحديات تناسب الفئة العمرية للابن.',
                      'معجم مصور للمفردات القرآنية الفريدة.',
                    ],
                  },
                  {
                    idx: 3,
                    icon: HeartHandshake,
                    title: 'مهمات «عشت الآية» والأسرة',
                    badge: 'تطبيقات منزلية أسبوعية',
                    desc: 'واجبات عائلية تربط الابن بوالديه وإخوانه لتطبيق وصايا الآيات عملياً في البيت.',
                    color: 'border-purple-300 bg-white',
                    iconBg: 'bg-purple-100 text-purple-800',
                    points: [
                      'بطاقات ملموسة تثبت على الثلاجة بالمنزل.',
                      'جلسة حوار أسري دافئة (10 دقائق) أسبوعياً.',
                      'اعتماد إنجاز المهمة بنقرة واحدة من الأب أو الأم.',
                    ],
                  },
                  {
                    idx: 4,
                    icon: ShieldCheck,
                    title: 'تقارير الأداء وبوابة ولي الأمر',
                    badge: 'شفافية ومتابعة مستمرة',
                    desc: 'لوحة تحكم ذكية وإشعارات واتساب فورية تطلعك على كل خطوة يخطوها ابنك في رحلته.',
                    color: 'border-blue-300 bg-white',
                    iconBg: 'bg-blue-100 text-blue-800',
                    points: [
                      'إشعار فوري بعد كل جلسة بدرجة الإتقان.',
                      'تقرير تحليلي شهري شامل يحدد نقاط القوة.',
                      'استشارات تربوية مباشرة مع الكوتش والمحفظ.',
                    ],
                  },
                ].map((item) => {
                  const Icon = item.icon;
                  return (
                    <div
                      key={item.idx}
                      className={`rounded-3xl p-6 border-2 ${item.color} shadow-xs flex flex-col justify-between space-y-4 hover:shadow-md transition-all`}
                    >
                      <div>
                        <div className="flex items-center justify-between mb-3">
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${item.iconBg}`}>
                            <Icon className="w-5 h-5" />
                          </div>
                          <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-stone-100 text-stone-700">
                            {item.badge}
                          </span>
                        </div>
                        <h4 className="font-black text-stone-900 text-base mb-1.5">{item.title}</h4>
                        <p className="text-xs text-stone-600 leading-relaxed mb-4">{item.desc}</p>

                        <div className="space-y-1.5 border-t border-stone-100 pt-3">
                          {item.points.map((pt, pIdx) => (
                            <div key={pIdx} className="flex items-start gap-1.5 text-xs text-stone-700">
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                              <span>{pt}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          setSelectedFollowUpTab(item.idx);
                          setFollowUpViewMode('tabs');
                        }}
                        className="w-full py-2.5 rounded-xl bg-stone-50 hover:bg-stone-100 text-stone-800 font-bold text-xs border border-stone-200 transition-colors cursor-pointer text-center"
                      >
                        عرض التبويب المفصل الموسع لهذا المحور
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Bottom Action Strip */}
          <div className="p-6 sm:p-8 rounded-3xl bg-white border border-stone-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs">
            <div>
              <h4 className="font-black text-base text-stone-900">
                تريد تجربة جلسة تدبر استطلاعية والتعرف على فريق المعايشة؟
              </h4>
              <p className="text-xs text-stone-600 mt-1 max-w-2xl leading-relaxed">
                سجل بيانات ابنك الآن لحجز مقعد في الدورة القادمة، واطلع على نموذج من كتيب الأنشطة وبوابة ولي الأمر التجريبية.
              </p>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <button
                type="button"
                onClick={onOpenRegister}
                className="px-5 py-2.5 rounded-xl bg-amber-700 hover:bg-amber-800 text-white font-bold text-xs transition-colors cursor-pointer shadow-xs inline-flex items-center gap-1.5"
              >
                <span>تسجيل الأبناء الآن</span>
                <ArrowLeft className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={onOpenLogin}
                className="px-5 py-2.5 rounded-xl bg-stone-50 hover:bg-stone-100 text-stone-800 border border-stone-200 font-bold text-xs transition-colors cursor-pointer"
              >
                بوابة ولي الأمر
              </button>
            </div>
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

      {/* Deliverable Details Modal */}
      {selectedDeliverable !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs animate-fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-stone-200 relative text-right animate-scale-up">
            <button
              type="button"
              onClick={() => setSelectedDeliverable(null)}
              className="absolute left-4 top-4 w-8 h-8 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-600 flex items-center justify-center cursor-pointer transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            {(() => {
              const items = [
                {
                  title: '4 جلسات تدبر تفاعلية',
                  badge: 'أسبوعياً • 45 دقيقة',
                  desc: 'جلسة تدبر أسبوعية مباشرة أونلاين يقودها الكوتش لتفكيك معاني الآيات الحياتية.',
                  fullDetails: [
                    'توزيع الطلاب في مجموعات حوارية صغيرة (5-8 طلاب) متقاربة عمرياً لضمان تفاعل كل ابن.',
                    'أسلوب تربوي مشوق يربط الآيات بمواقف الحياة اليومية (بر الوالدين، الصدق، التغلب على التحديات، حفظ اللسان).',
                    'حوار آمن يسمح للابن بطرح تساؤلاته وفهم الحكمة من الأوامر والنواهي الإلهية.',
                    'خروج الابن في نهاية كل جلسة بـ «خاطرة تدبرية» يسجلها في حسابه لتغذي شجرة المعايشة.',
                  ],
                },
                {
                  title: '8 جلسات متابعة حفظ',
                  badge: 'جلستان أسبوعياً • 25-30 دقيقة',
                  desc: 'جلستان أسبوعياً مع معلم التحفيظ لإتقان التلاوة وضبط مخارج الحروف والتجويد.',
                  fullDetails: [
                    'جلسات تحفيظ ومراجعة فردية أو ثنائية مع نخبة من المحفظين المجازين والمؤهلين تربوياً.',
                    'التركيز على صحة التلاوة، مخارج الحروف الصحيحة، والترتيل الهادئ دون تسرع.',
                    'مراعاة قدرات كل ابن وسرعته الاستيعابية بدون أي ضغط أو مقارنات سلبية.',
                    'تسجيل تقرير فوري لكل جلسة يتضمن درجات الإتقان والملاحظات التربوية التي تصل لولي الأمر.',
                  ],
                },
                {
                  title: 'كتيب الأنشطة التفاعلية',
                  badge: 'ملف شهري مطبوع ورقمي',
                  desc: 'أوراق عمل وأسئلة تدبرية وتحديات أسبوعية تثبت المعنى في ذهن الطفل.',
                  fullDetails: [
                    'كتيب مصمم بصرياً بجاذبية عالية يرسل رقمياً ومتاح للطباعة المنزلية.',
                    'خرائط مفاهيمية مبسطة تربط آيات السورة وموضوعاتها بأسلوب بصري ذكي.',
                    'أنشطة وألغاز استنباطية وتلوين للأطفال الصغار، ومساحات كتابة تأملية لليافعين.',
                    'مهمات بحثية خفيفة تحفز الابن على استكشاف معاني الكلمات القرآنية الفريدة.',
                  ],
                },
                {
                  title: 'تطبيقات مع الأسرة',
                  badge: 'مهمات عائلية أسبوعية',
                  desc: 'مهمات عائلية تربط الابن بوالديه وإخوانه لتطبيق وصايا الآيات في البيت.',
                  fullDetails: [
                    'بطاقات «عشت الآية» تحول المعنى النظري إلى سلوك عملي ملموس داخل المنزل.',
                    'مهمات تجمع الأسرة كجلسة حوارية عائلية قصيرة (10 دقائق) يعرض فيها الابن ما تعلمه.',
                    'تأكيد إنجاز المهمة بضغطة زر من ولي الأمر داخل لوحة التحكم.',
                    'منح الابن وسام «عشت الآية» وإضافة ثمار جديدة لشجرة المعايشة الخاصة به.',
                  ],
                },
              ];
              const cur = items[selectedDeliverable];
              if (!cur) return null;
              return (
                <div className="space-y-4 pt-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-100 text-emerald-800">
                      {cur.badge}
                    </span>
                  </div>
                  <h3 className="text-xl font-black text-stone-900">{cur.title}</h3>
                  <p className="text-xs text-stone-600 leading-relaxed bg-stone-50 p-3 rounded-xl border border-stone-200">
                    {cur.desc}
                  </p>

                  <div className="space-y-2 pt-2">
                    <h4 className="text-xs font-bold text-stone-800">ما يشمله هذا المحور بالتفصيل:</h4>
                    {cur.fullDetails.map((point, idx) => (
                      <div key={idx} className="flex items-start gap-2 text-xs text-stone-700 leading-relaxed">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        <span>{point}</span>
                      </div>
                    ))}
                  </div>

                  <div className="pt-4 border-t border-stone-100 flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedDeliverable(null);
                        onOpenRegister();
                      }}
                      className="flex-1 py-3 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs transition-colors shadow-xs cursor-pointer flex items-center justify-center gap-2"
                    >
                      <span>ابدأ رحلة ابنك الآن</span>
                      <ArrowLeft className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setSelectedDeliverable(null)}
                      className="px-4 py-3 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold text-xs transition-colors cursor-pointer"
                    >
                      إغلاق
                    </button>
                  </div>
                </div>
              );
            })()}
          </div>
        </div>
      )}
    </div>
  );
};
