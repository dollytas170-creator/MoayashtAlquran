import React, { useState, useEffect } from 'react';
import { X, UserPlus, Sparkles, Calendar, User, Heart, Trash2, Archive, GraduationCap, AlertCircle } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { StudentUser } from '../../types';

interface AddChildModalProps {
  isOpen: boolean;
  onClose: () => void;
  editingChild?: StudentUser | null;
}

export const AddChildModal: React.FC<AddChildModalProps> = ({
  isOpen,
  onClose,
  editingChild,
}) => {
  const { addChild, updateChild, deleteChild, archiveChild, graduateChild, ageGroups, activeParent } = useApp();

  const [fullName, setFullName] = useState(editingChild?.fullName || '');
  const [age, setAge] = useState<number>(editingChild?.age || 8);
  const [gender, setGender] = useState<'male' | 'female'>(editingChild?.gender || 'male');
  const [birthDate, setBirthDate] = useState(editingChild?.birthDate || '');
  const [ageGroupId, setAgeGroupId] = useState(editingChild?.ageGroupId || 'ag-6-9');

  useEffect(() => {
    if (isOpen) {
      setFullName(editingChild?.fullName || '');
      setAge(editingChild?.age || 8);
      setGender(editingChild?.gender || 'male');
      setBirthDate(editingChild?.birthDate || '');
      setAgeGroupId(editingChild?.ageGroupId || 'ag-6-9');
    }
  }, [isOpen, editingChild]);

  if (!isOpen) return null;

  // Auto-match age group if age changes
  const handleAgeChange = (newAge: number) => {
    setAge(newAge);
    const matched = ageGroups.find((ag) => newAge >= ag.minAge && newAge <= ag.maxAge);
    if (matched) {
      setAgeGroupId(matched.id);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim()) {
      alert('يرجى إدخال اسم الابن أو الابنة');
      return;
    }

    if (editingChild) {
      updateChild(editingChild.id, {
        fullName: fullName.trim(),
        age,
        gender,
        birthDate,
        ageGroupId,
      });
    } else {
      addChild({
        fullName: fullName.trim(),
        age,
        gender,
        birthDate,
        ageGroupId,
      });
    }

    onClose();
  };

  return (
    <div
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-stone-900/60 backdrop-blur-xs animate-fade-in"
    >
      <div className="bg-white w-full max-w-md rounded-2xl shadow-xl border border-stone-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-4 py-3 bg-stone-50 border-b border-stone-200 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
              <UserPlus className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-stone-900 text-sm">
                {editingChild ? 'تعديل بيانات الابن / الابنة' : 'إضافة ابن / ابنة إلى رحلة المعايشة'}
              </h3>
              <p className="text-[11px] text-stone-500">
                {activeParent ? `الحساب التابع لـ: ${activeParent.fullName}` : 'إضافة ملف الطفل التعليمي'}
              </p>
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

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-4 sm:p-5 space-y-3 overflow-y-auto">
          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1">
              اسم الابن / الابنة كاملاً *
            </label>
            <div className="relative">
              <User className="w-3.5 h-3.5 text-stone-400 absolute right-3 top-2.5" />
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="مثال: يوسف أحمد"
                className="w-full pr-8 pl-3 py-2 rounded-xl border border-stone-300 text-xs sm:text-sm focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600 outline-hidden"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">العمر (بالسنوات) *</label>
              <input
                type="number"
                min={6}
                max={15}
                value={age}
                onChange={(e) => handleAgeChange(parseInt(e.target.value) || 6)}
                className="w-full px-3 py-1.5 rounded-xl border border-stone-300 text-xs sm:text-sm focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600 outline-hidden"
                required
              />
              <span className="text-[10px] text-stone-400 mt-0.5 block">من 6 إلى 15 سنة</span>
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">الجنس *</label>
              <div className="grid grid-cols-2 gap-1.5">
                <button
                  type="button"
                  onClick={() => setGender('male')}
                  className={`py-1.5 text-xs font-bold rounded-xl border transition-all cursor-pointer ${
                    gender === 'male'
                      ? 'border-emerald-600 bg-emerald-50 text-emerald-800 ring-1 ring-emerald-600/30'
                      : 'border-stone-200 text-stone-600 hover:bg-stone-50'
                  }`}
                >
                  ذكر
                </button>
                <button
                  type="button"
                  onClick={() => setGender('female')}
                  className={`py-1.5 text-xs font-bold rounded-xl border transition-all cursor-pointer ${
                    gender === 'female'
                      ? 'border-emerald-600 bg-emerald-50 text-emerald-800 ring-1 ring-emerald-600/30'
                      : 'border-stone-200 text-stone-600 hover:bg-stone-50'
                  }`}
                >
                  أنثى
                </button>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1">تاريخ الميلاد (اختياري)</label>
            <div className="relative">
              <Calendar className="w-3.5 h-3.5 text-stone-400 absolute right-3 top-2.5" />
              <input
                type="date"
                value={birthDate}
                onChange={(e) => setBirthDate(e.target.value)}
                className="w-full pr-8 pl-3 py-1.5 rounded-xl border border-stone-300 text-xs focus:ring-2 focus:ring-emerald-600 outline-hidden"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-bold text-stone-700">الفئة العمرية والمسار:</label>
              <span className="text-[10px] text-stone-400">تلقائي حسب العمر</span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {ageGroups.map((ag) => {
                const isSelected = ageGroupId === ag.id;
                return (
                  <button
                    key={ag.id}
                    type="button"
                    onClick={() => setAgeGroupId(ag.id)}
                    className={`p-2 rounded-xl border text-center transition-all cursor-pointer ${
                      isSelected
                        ? 'border-emerald-600 bg-emerald-50 text-emerald-900 ring-1 ring-emerald-600 font-bold shadow-2xs'
                        : 'border-stone-200 hover:border-stone-300 bg-stone-50/60 text-stone-700'
                    }`}
                  >
                    <span className="text-xs font-bold block">{ag.name.replace(/\(.*?\)/, '').trim()}</span>
                    <span className="text-[10px] text-stone-500 block">{ag.minAge} - {ag.maxAge} سنة</span>
                  </button>
                );
              })}
            </div>
          </div>

          {editingChild && (
            <div className="p-2.5 bg-stone-50 rounded-xl border border-stone-200 text-right space-y-2">
              <span className="text-[11px] font-bold text-stone-700 block">إدارة ملف الطفل:</span>
              <div className="flex flex-wrap items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => {
                    if (window.confirm(`هل ترغب في أرشفة ملف "${editingChild.fullName}"؟ سيتم إخفاء الملف مع الاحتفاظ بكامل السجلات والمدفوعات والتلاوات بأمان.`)) {
                      archiveChild(editingChild.id);
                      onClose();
                    }
                  }}
                  className="px-2.5 py-1 rounded-lg border border-stone-200 text-stone-700 bg-white hover:bg-stone-100 text-[11px] font-semibold transition-colors cursor-pointer flex items-center gap-1"
                  title="إخفاء الملف القديم مع الاحتفاظ ببياناته"
                >
                  <Archive className="w-3 h-3 text-stone-500" />
                  <span>أرشفة</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    graduateChild(editingChild.id);
                    onClose();
                  }}
                  className="px-2.5 py-1 rounded-lg border border-purple-200 text-purple-800 bg-purple-50 hover:bg-purple-100 text-[11px] font-semibold transition-colors cursor-pointer flex items-center gap-1"
                  title="توثيق إنهاء الطفل للدورة مع بقائه في النظام"
                >
                  <GraduationCap className="w-3 h-3 text-purple-600" />
                  <span>تخرج 🎓</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    if (window.confirm(`هل أنت متأكد من حذف ملف "${editingChild.fullName}"؟\nملاحظة: خيار الحذف مخصص للطفل الذي أُضيف بالخطأ ولم يبدأ أي شيء.`)) {
                      deleteChild(editingChild.id);
                      onClose();
                    }
                  }}
                  className="px-2.5 py-1 rounded-lg border border-rose-200 text-rose-700 bg-rose-50 hover:bg-rose-100 text-[11px] font-semibold transition-colors cursor-pointer flex items-center gap-1 mr-auto"
                  title="مخصص للأطفال المضافين بالخطأ"
                >
                  <Trash2 className="w-3 h-3" />
                  <span>حذف (أُضيف بالخطأ)</span>
                </button>
              </div>
            </div>
          )}

          <div className="pt-2 flex items-center justify-end gap-2 shrink-0 border-t border-stone-100">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-2 rounded-xl border border-stone-200 text-stone-600 text-xs font-medium hover:bg-stone-50 cursor-pointer"
            >
              إلغاء
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs shadow-xs transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>{editingChild ? 'حفظ التعديل' : 'إضافة الابن وبدء الرحلة'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
