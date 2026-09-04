import React, { useState } from 'react';
import {
  BookOpen,
  Sparkles,
  Users,
  GraduationCap,
  ShieldAlert,
  UserCheck,
  Bell,
  LogOut,
  ChevronDown,
  Menu,
  X,
  RotateCcw,
  TreeDeciduous,
  Plus,
  Home,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { UserRole } from '../../types';

interface NavbarProps {
  onOpenAuth?: (tab: 'login' | 'register') => void;
  onOpenRegister?: () => void;
  onOpenLogin?: () => void;
  onOpenAddChild?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenAuth,
  onOpenRegister,
  onOpenLogin,
  onOpenAddChild,
}) => {
  const {
    currentRole,
    setCurrentRole,
    activeParent,
    activeStudent,
    students,
    setActiveStudentId,
    notifications,
    markNotificationRead,
    resetAllData,
    logoutParent,
  } = useApp();

  const handleOpenLogin = () => {
    if (onOpenLogin) {
      onOpenLogin();
    } else if (onOpenAuth) {
      onOpenAuth('login');
    }
  };

  const handleOpenRegister = () => {
    if (onOpenRegister) {
      onOpenRegister();
    } else if (onOpenAuth) {
      onOpenAuth('register');
    }
  };

  const [showRoleMenu, setShowRoleMenu] = useState(false);
  const [showChildMenu, setShowChildMenu] = useState(false);
  const [showNotifMenu, setShowNotifMenu] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const parentChildren = students.filter(
    (s) => (s.parentId === activeParent?.id || activeParent === null) && s.status !== 'archived'
  );

  const roleLabels: { [key: string]: { title: string; icon: any; color: string } } = {
    public: { title: 'الرئيسية العامة', icon: Sparkles, color: 'text-stone-700 bg-stone-100' },
    parent: { title: 'بوابة ولي الأمر', icon: Users, color: 'text-emerald-700 bg-emerald-50' },
    student: { title: 'رحلتي مع القرآن (الطالب)', icon: TreeDeciduous, color: 'text-teal-700 bg-teal-50' },
    teacher: { title: 'لوحة معلم التحفيظ', icon: GraduationCap, color: 'text-amber-700 bg-amber-50' },
    supervisor: { title: 'لوحة المشرف التربوي', icon: UserCheck, color: 'text-blue-700 bg-blue-50' },
    admin: { title: 'لوحة الإدارة الشاملة', icon: ShieldAlert, color: 'text-purple-700 bg-purple-50' },
  };

  const handleRoleChange = (role: UserRole | 'public') => {
    setCurrentRole(role);
    setShowRoleMenu(false);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-stone-200">
      {/* Top Prototype Helper Bar */}
      <div className="bg-stone-900 text-stone-300 text-xs px-4 py-1 flex flex-wrap items-center justify-between border-b border-stone-800">
        <div className="flex items-center gap-2">
          <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span className="font-semibold text-stone-200">منصة معايشة القرآن</span>
          <span className="text-stone-400 hidden sm:inline">| التبديل السريع بين الأدوار للتجربة:</span>
        </div>

        <div className="flex items-center gap-1 sm:gap-1.5 overflow-x-auto">
          <button
            type="button"
            onClick={() => handleRoleChange('public')}
            className={`px-2.5 py-1 rounded-md text-[11px] font-bold transition-colors cursor-pointer flex items-center gap-1 ${
              currentRole === 'public' ? 'bg-emerald-600 text-white shadow-xs' : 'bg-stone-800 text-stone-300 hover:bg-stone-700'
            }`}
          >
            <Home className="w-3 h-3 text-emerald-200" />
            <span>الرئيسية</span>
          </button>
          <button
            type="button"
            onClick={() => handleRoleChange('parent')}
            className={`px-2 py-0.5 rounded-md text-[11px] font-medium transition-colors cursor-pointer flex items-center gap-1 ${
              currentRole === 'parent' ? 'bg-emerald-600 text-white font-bold shadow-xs' : 'bg-stone-800 text-stone-300 hover:bg-stone-700'
            }`}
          >
            <UserCheck className="w-3 h-3 text-emerald-300" />
            <span>ولي الأمر</span>
          </button>
          <button
            type="button"
            onClick={() => handleRoleChange('student')}
            className={`px-2 py-0.5 rounded-md text-[11px] font-medium transition-colors cursor-pointer flex items-center gap-1 ${
              currentRole === 'student' ? 'bg-emerald-600 text-white font-bold shadow-xs' : 'bg-stone-800 text-stone-300 hover:bg-stone-700'
            }`}
          >
            <Sparkles className="w-3 h-3 text-teal-300" />
            <span>الطالب</span>
          </button>
          <button
            type="button"
            onClick={() => handleRoleChange('teacher')}
            className={`px-2 py-0.5 rounded-md text-[11px] font-medium transition-colors cursor-pointer flex items-center gap-1 ${
              currentRole === 'teacher' ? 'bg-emerald-600 text-white font-bold shadow-xs' : 'bg-stone-800 text-stone-300 hover:bg-stone-700'
            }`}
          >
            <BookOpen className="w-3 h-3 text-indigo-300" />
            <span>المحفظ</span>
          </button>
          <button
            type="button"
            onClick={() => handleRoleChange('supervisor')}
            className={`px-2 py-0.5 rounded-md text-[11px] font-medium transition-colors cursor-pointer flex items-center gap-1 ${
              currentRole === 'supervisor' ? 'bg-emerald-600 text-white font-bold shadow-xs' : 'bg-stone-800 text-stone-300 hover:bg-stone-700'
            }`}
          >
            <GraduationCap className="w-3 h-3 text-amber-300" />
            <span>المشرف</span>
          </button>
          <button
            type="button"
            onClick={() => handleRoleChange('admin')}
            className={`px-2 py-0.5 rounded-md text-[11px] font-medium transition-colors cursor-pointer flex items-center gap-1 ${
              currentRole === 'admin' ? 'bg-emerald-600 text-white font-bold shadow-xs' : 'bg-stone-800 text-stone-300 hover:bg-stone-700'
            }`}
          >
            <ShieldAlert className="w-3 h-3 text-rose-300" />
            <span>الإدارة</span>
          </button>

          <button
            type="button"
            onClick={() => {
              if (window.confirm('هل تود إعادة تعيين جميع البيانات وحذف المدخلات للبدء بحالة أولية فارغة؟')) {
                resetAllData();
              }
            }}
            title="إعادة ضبط البيانات إلى الحالة الفارغة"
            className="px-2 py-0.5 rounded-md text-[11px] font-medium bg-rose-950/60 text-rose-300 hover:bg-rose-900 transition-colors flex items-center gap-1 cursor-pointer mr-1"
          >
            <RotateCcw className="w-3 h-3" />
            <span className="hidden md:inline">تصفير</span>
          </button>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Logo & Brand */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setCurrentRole('public')}
            className="flex items-center gap-3 group text-right cursor-pointer"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-800 to-emerald-600 text-white flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform">
              <TreeDeciduous className="w-5 h-5 text-emerald-200" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-black text-lg text-stone-900 tracking-tight">معايشة القرآن</span>
                <span className="text-[10px] uppercase font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded-sm">Mo'ayasha</span>
              </div>
              <p className="text-[11px] text-stone-500 font-medium">رحلة ابنك ليعيش مع القرآن</p>
            </div>
          </button>
        </div>

        {/* Desktop Controls */}
        <div className="hidden lg:flex items-center gap-4">
          {/* Role Switcher Pill - Always available for quick testing and navigation */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowRoleMenu(!showRoleMenu)}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl border border-stone-200 bg-white hover:bg-stone-50 text-xs font-semibold text-stone-800 transition-colors cursor-pointer"
            >
              {(() => {
                const conf = roleLabels[currentRole] || roleLabels.parent;
                const Icon = conf.icon;
                return (
                  <>
                    <span className={`p-1 rounded-md ${conf.color}`}>
                      <Icon className="w-3.5 h-3.5" />
                    </span>
                    <span>{conf.title}</span>
                    <ChevronDown className="w-3.5 h-3.5 text-stone-400" />
                  </>
                );
              })()}
            </button>

            {showRoleMenu && (
              <div className="absolute left-0 mt-2 w-56 rounded-2xl bg-white shadow-xl border border-stone-200 py-1.5 z-50 animate-fade-in">
                <div className="px-3 py-1.5 text-[11px] font-bold text-stone-400 border-b border-stone-100">
                  اختر البوابة أو الدور:
                </div>
                {(['public', 'parent', 'student', 'teacher', 'supervisor', 'admin'] as (UserRole | 'public')[]).map((r) => {
                  const conf = roleLabels[r];
                  const Icon = conf.icon;
                  return (
                    <button
                      key={r}
                      type="button"
                      onClick={() => handleRoleChange(r)}
                      className={`w-full px-3 py-2 text-right text-xs font-medium flex items-center justify-between hover:bg-stone-50 cursor-pointer ${
                        currentRole === r ? 'bg-emerald-50 text-emerald-800 font-bold' : 'text-stone-700'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span className={`p-1 rounded-md ${conf.color}`}>
                          <Icon className="w-3.5 h-3.5" />
                        </span>
                        <span>{conf.title}</span>
                      </div>
                      {currentRole === r && <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Child Switcher (If in Parent or Student role and parent is logged in) */}
          {(currentRole === 'parent' || currentRole === 'student') && (
            <div className="relative">
              {parentChildren.length > 0 ? (
                <div>
                  <button
                    type="button"
                    onClick={() => setShowChildMenu(!showChildMenu)}
                    className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl border border-emerald-200 bg-emerald-50 text-emerald-900 text-xs font-semibold hover:bg-emerald-100 transition-colors cursor-pointer"
                  >
                    <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                    <span>الابن الحالي: {activeStudent?.fullName || parentChildren[0].fullName}</span>
                    <ChevronDown className="w-3.5 h-3.5 text-emerald-600" />
                  </button>

                  {showChildMenu && (
                    <div className="absolute left-0 mt-2 w-52 rounded-2xl bg-white shadow-xl border border-stone-200 py-1.5 z-50">
                      <div className="px-3 py-1.5 text-[11px] font-bold text-stone-400 border-b border-stone-100 flex items-center justify-between">
                        <span>أبنائي المسجلون:</span>
                        {onOpenAddChild && (
                          <button
                            type="button"
                            onClick={() => {
                              setShowChildMenu(false);
                              onOpenAddChild();
                            }}
                            className="text-emerald-700 hover:underline flex items-center gap-0.5 text-[10px]"
                          >
                            <Plus className="w-3 h-3" />
                            <span>إضافة</span>
                          </button>
                        )}
                      </div>
                      {parentChildren.map((ch) => (
                        <button
                          key={ch.id}
                          type="button"
                          onClick={() => {
                            setActiveStudentId(ch.id);
                            setShowChildMenu(false);
                          }}
                          className={`w-full px-3 py-2 text-right text-xs flex items-center justify-between hover:bg-stone-50 cursor-pointer ${
                            activeStudent?.id === ch.id ? 'bg-emerald-50 text-emerald-800 font-bold' : 'text-stone-700'
                          }`}
                        >
                          <div>
                            <p className="font-semibold">{ch.fullName}</p>
                            <p className="text-[10px] text-stone-400">{ch.age} سنوات</p>
                          </div>
                          {activeStudent?.id === ch.id && <span className="text-emerald-700 text-xs">✓</span>}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                onOpenAddChild && (
                  <button
                    type="button"
                    onClick={onOpenAddChild}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-100 text-emerald-800 text-xs font-semibold hover:bg-emerald-200 transition-colors cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>إضافة أول طفل</span>
                  </button>
                )
              )}
            </div>
          )}

          {/* Notifications Dropdown - only visible after parent login */}
          {Boolean(activeParent && currentRole === 'parent') && (
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowNotifMenu(!showNotifMenu)}
                className="relative p-2 rounded-xl text-stone-500 hover:text-stone-800 hover:bg-stone-100 transition-colors cursor-pointer"
                title="الإشعارات"
              >
                <Bell className="w-5 h-5" />
                {notifications.filter((n) => !n.read).length > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 rounded-full bg-rose-500 ring-2 ring-white"></span>
                )}
              </button>

              {showNotifMenu && (
                <div className="absolute left-0 mt-2 w-80 rounded-2xl bg-white shadow-xl border border-stone-200 p-2 z-50">
                  <div className="px-3 py-2 border-b border-stone-100 flex items-center justify-between">
                    <span className="text-xs font-bold text-stone-800">الإشعارات</span>
                    <span className="text-[10px] text-stone-400">{notifications.length} إشعار</span>
                  </div>

                  <div className="max-h-64 overflow-y-auto py-2">
                    {notifications.length === 0 ? (
                      <div className="p-4 text-center">
                        <p className="text-xs text-stone-400">لا توجد إشعارات جديدة</p>
                      </div>
                    ) : (
                      notifications.map((n) => (
                        <div
                          key={n.id}
                          onClick={() => markNotificationRead(n.id)}
                          className={`p-2.5 rounded-xl text-right transition-colors cursor-pointer ${
                            n.read ? 'bg-transparent text-stone-600' : 'bg-emerald-50/70 text-stone-900 font-medium'
                          }`}
                        >
                          <p className="text-xs font-bold mb-0.5">{n.title}</p>
                          <p className="text-[11px] text-stone-500 leading-snug">{n.message}</p>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Header Action Buttons */}
          {currentRole !== 'public' && (
            <button
              type="button"
              onClick={() => handleRoleChange('public')}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border-2 border-emerald-600/70 bg-emerald-50 hover:bg-emerald-100 text-emerald-900 text-xs font-bold transition-all cursor-pointer shadow-xs hover:scale-102"
              title="العودة إلى الواجهة الرئيسية للمنصة"
            >
              <Home className="w-4 h-4 text-emerald-700" />
              <span>الواجهة الرئيسية</span>
            </button>
          )}

          {activeParent ? (
            <div className="flex items-center gap-2 pr-2 border-r border-stone-200">
              <button
                type="button"
                onClick={() => setCurrentRole('parent')}
                className="text-right hover:opacity-80 transition-opacity cursor-pointer"
              >
                <p className="text-xs font-bold text-stone-900">{activeParent.fullName}</p>
                <p className="text-[10px] text-emerald-700 font-semibold">بوابة ولي الأمر ←</p>
              </button>
              <button
                type="button"
                onClick={logoutParent}
                className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl border border-rose-200 bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold transition-colors cursor-pointer"
                title="تسجيل الخروج من الحساب"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>خروج</span>
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleOpenLogin}
                className="px-4 py-2 rounded-xl text-stone-700 hover:text-emerald-800 hover:bg-stone-100 text-xs font-bold transition-colors cursor-pointer"
              >
                تسجيل الدخول
              </button>
              <button
                type="button"
                onClick={handleOpenRegister}
                className="px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold shadow-xs transition-all cursor-pointer whitespace-nowrap"
              >
                ابدأ رحلة ابنك
              </button>
            </div>
          )}
        </div>

        {/* Mobile Hamburger & Quick Actions */}
        <div className="flex lg:hidden items-center gap-2">
          {currentRole !== 'public' ? (
            <button
              type="button"
              onClick={() => handleRoleChange('public')}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-emerald-300 bg-emerald-50 hover:bg-emerald-100 text-emerald-900 text-xs font-bold transition-colors cursor-pointer shadow-2xs"
              title="العودة للواجهة الرئيسية"
            >
              <Home className="w-3.5 h-3.5 text-emerald-700" />
              <span>الرئيسية</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={handleOpenRegister}
              className="px-3 py-1.5 rounded-xl bg-emerald-700 text-white text-xs font-bold cursor-pointer"
            >
              ابدأ الآن
            </button>
          )}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-xl border border-stone-200 text-stone-700 cursor-pointer"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-stone-200 bg-white p-4 space-y-3">
          {currentRole !== 'public' && (
            <button
              type="button"
              onClick={() => {
                setCurrentRole('public');
                setMobileMenuOpen(false);
              }}
              className="w-full py-2.5 px-3 rounded-xl bg-emerald-50 border border-emerald-200 hover:bg-emerald-100 text-emerald-900 text-xs font-bold flex items-center justify-center gap-2 cursor-pointer shadow-2xs transition-colors"
            >
              <Home className="w-4 h-4 text-emerald-700" />
              <span>العودة إلى الواجهة الرئيسية</span>
            </button>
          )}

          {currentRole === 'public' ? (
            <div className="space-y-1 pb-2">
              <a
                href="#about-program"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-xl text-xs font-bold text-stone-700 hover:bg-stone-50"
              >
                عن البرنامج ومحتوياته
              </a>
              <a
                href="#journey"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-xl text-xs font-bold text-stone-700 hover:bg-stone-50"
              >
                المنهجية الخماسية
              </a>
              <a
                href="#ages"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-xl text-xs font-bold text-stone-700 hover:bg-stone-50"
              >
                الفئات العمرية (6 - 15 سنة)
              </a>
              <a
                href="#pricing"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-xl text-xs font-bold text-stone-700 hover:bg-stone-50"
              >
                خطط الاشتراك وحاسبة الأخوة
              </a>
              <a
                href="#faq"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-xl text-xs font-bold text-stone-700 hover:bg-stone-50"
              >
                الأسئلة الشائعة
              </a>
            </div>
          ) : (
            <>
              <div className="text-xs font-bold text-stone-400 mb-1">التبديل بين بوابات المنصة:</div>
              <div className="grid grid-cols-2 gap-2">
                {(['public', 'parent', 'student', 'teacher', 'supervisor', 'admin'] as (UserRole | 'public')[]).map((r) => {
                  const conf = roleLabels[r];
                  const Icon = conf.icon;
                  return (
                    <button
                      key={r}
                      type="button"
                      onClick={() => handleRoleChange(r)}
                      className={`p-2 rounded-xl border text-right text-xs font-bold flex items-center gap-2 ${
                        currentRole === r
                          ? 'border-emerald-600 bg-emerald-50 text-emerald-800'
                          : 'border-stone-200 bg-stone-50 text-stone-700'
                      }`}
                    >
                      <Icon className="w-4 h-4 text-emerald-700" />
                      <span>{conf.title}</span>
                    </button>
                  );
                })}
              </div>
            </>
          )}

          <div className="pt-3 border-t border-stone-100 flex items-center justify-between">
            {activeParent ? (
              <>
                <div className="text-right">
                  <span className="text-xs font-bold text-stone-800 block">{activeParent.fullName}</span>
                  <span className="text-[10px] text-stone-400">حساب ولي الأمر</span>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    logoutParent();
                  }}
                  className="px-3 py-1.5 rounded-xl border border-rose-200 bg-rose-50 text-rose-700 text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>تسجيل خروج</span>
                </button>
              </>
            ) : (
              <>
                <button
                  type="button"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    handleOpenLogin();
                  }}
                  className="text-xs font-bold text-stone-700 hover:text-emerald-700 cursor-pointer"
                >
                  تسجيل الدخول
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    handleOpenRegister();
                  }}
                  className="text-xs font-bold text-emerald-700 hover:underline cursor-pointer"
                >
                  إنشاء حساب جديد
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
