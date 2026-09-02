import React, { useState, useEffect } from 'react';
import { X, UserPlus, Sparkles, Calendar, User, Heart } from 'lucide-react';
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
  const { addChild, updateChild, ageGroups, activeParent } = useApp();

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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs animate-fade-in">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-xl border border-stone-200 overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 bg-stone-50 border-b border-stone-200 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
              <UserPlus className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-stone-900 text-base">
                {editingChild ? 'تعديل بيانات الابن / الابنة' : 'إضافة ابن / ابنة إلى رحلة المعايشة'}
              </h3>
              <p className="text-xs text-stone-500">
                {activeParent ? `الحساب التابع لـ: ${activeParent.fullName}` : 'إضافة ملف الطفل التعليمي'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white border border-stone-200 text-stone-400 hover:text-stone-700 flex items-center justify-center cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1">
              اسم الابن / الابنة كاملاً *
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-stone-400 absolute right-3 top-3" />
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="مثال: يوسف أحمد"
                className="w-full pr-9 pl-3.5 py-2.5 rounded-xl border border-stone-300 text-sm focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600 outline-hidden"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">العمر (بالسنوات) *</label>
              <input
                type="number"
                min={6}
                max={15}
                value={age}
                onChange={(e) => handleAgeChange(parseInt(e.target.value) || 6)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600 outline-hidden"
                required
              />
              <span className="text-[10px] text-stone-400 mt-1 block">الفئة المتاحة: 6 إلى 15 سنة</span>
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">الجنس *</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setGender('male')}
                  className={`py-2 text-xs font-bold rounded-xl border transition-all cursor-pointer ${
                    gender === 'male'
                      ? 'border-emerald-600 bg-emerald-50 text-emerald-800 ring-2 ring-emerald-600/20'
                      : 'border-stone-200 text-stone-600 hover:bg-stone-50'
                  }`}
                >
                  ذكر
                </button>
                <button
                  type="button"
                  onClick={() => setGender('female')}
                  className={`py-2 text-xs font-bold rounded-xl border transition-all cursor-pointer ${
                    gender === 'female'
                      ? 'border-emerald-600 bg-emerald-50 text-emerald-800 ring-2 ring-emerald-600/20'
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
              <Calendar className="w-4 h-4 text-stone-400 absolute right-3 top-3" />
              <input
                type="date"
                value={birthDate}
                onChange={(e) => setBirthDate(e.target.value)}
                className="w-full pr-9 pl-3.5 py-2.5 rounded-xl border border-stone-300 text-sm focus:ring-2 focus:ring-emerald-600 outline-hidden"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1.5">الفئة العمرية والمسار المخصص:</label>
            <div className="space-y-2">
              {ageGroups.map((ag) => {
                const isSelected = ageGroupId === ag.id;
                return (
                  <label
                    key={ag.id}
                    onClick={() => setAgeGroupId(ag.id)}
                    className={`block p-3 rounded-xl border transition-all cursor-pointer ${
                      isSelected
                        ? 'border-emerald-600 bg-emerald-50/70 ring-1 ring-emerald-600/30'
                        : 'border-stone-200 hover:border-stone-300 bg-white'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-stone-900">{ag.name}</span>
                      <span className="text-[11px] px-2 py-0.5 rounded-full bg-stone-100 text-stone-600 font-semibold">
                        {ag.minAge} - {ag.maxAge} سنة
                      </span>
                    </div>
                    <p className="text-[11px] text-stone-500 mt-1 leading-normal">{ag.description}</p>
                  </label>
                );
              })}
            </div>
          </div>

          <div className="pt-2 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-stone-200 text-stone-600 text-sm font-medium hover:bg-stone-50 cursor-pointer"
            >
              إلغاء
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-sm shadow-xs transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <Sparkles className="w-4 h-4" />
              <span>{editingChild ? 'حفظ التعديلات' : 'إضافة الابن وبدء الرحلة'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
