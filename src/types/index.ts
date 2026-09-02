export type UserRole = 'parent' | 'student' | 'teacher' | 'supervisor' | 'admin';

export type AgeGroupKey = '6-9' | '10-12' | '13-15' | string;

export interface AgeGroupConfig {
  id: string;
  name: string;
  minAge: number;
  maxAge: number;
  description: string;
  visualTheme: 'playful' | 'balanced' | 'mature';
  parentSupervisionLevel: 'high' | 'medium' | 'independent';
  active: boolean;
}

export interface ParentUser {
  id: string;
  fullName: string;
  phone: string;
  email: string;
  verified: boolean;
  parentalConsent: boolean;
  createdAt: string;
}

export interface StudentUser {
  id: string;
  parentId: string;
  fullName: string;
  birthDate?: string;
  age: number;
  ageGroupId: string;
  gender: 'male' | 'female';
  currentProgramId?: string;
  groupId?: string;
  assignedTeacherId?: string;
  assignedSupervisorId?: string;
  enrolledAt?: string;
  status: 'active' | 'pending_payment' | 'inactive';
}

export interface TeacherUser {
  id: string;
  fullName: string;
  phone: string;
  email: string;
  specialization: string;
  assignedGroups: string[];
  active: boolean;
  createdAt: string;
}

export interface SupervisorUser {
  id: string;
  fullName: string;
  phone: string;
  email: string;
  roleTitle: string; // e.g. "مشرف تربوي" or "كوتش"
  assignedGroups: string[];
  active: boolean;
  createdAt: string;
}

export interface QuranProgram {
  id: string;
  name: string;
  tagline: string;
  coachName: string;
  durationMonths: number;
  description: string;
  targetAgeGroupIds: string[];
  surahs: string[]; // e.g. ["سورة العلق", "سورة المزمل", "سورة المدثر"]
  monthlyTadabburSessions: number;
  monthlyMemorizationSessions: number;
  stages: string[]; // ["أتعلم", "أحفظ", "أفهم", "أتدبر", "أطبق", "أشارك أسرتي"]
  status: 'active' | 'upcoming' | 'archived';
  standardPriceMonthly: number;
  promotionalPriceMonthly: number;
  siblingPriceMonthly: number;
}

export interface SurahPlan {
  id: string;
  programId: string;
  monthNumber: number;
  surahName: string;
  totalVerses?: number;
  weeklyDivisions: WeeklySurahDivision[];
  tadabburObjectives?: string[];
  practicalApplications?: string[];
  notes?: string;
}

export interface WeeklySurahDivision {
  id: string;
  weekNumber: number;
  title: string;
  fromVerse?: number;
  toVerse?: number;
  memorizationGoal?: string;
  tadabburTheme?: string;
  familyActivityTitle?: string;
  stagesConfigured: boolean;
}

export interface StudentGroup {
  id: string;
  name: string;
  programId: string;
  ageGroupId: string;
  teacherId?: string;
  supervisorId?: string;
  capacity: number;
  scheduleText: string;
  startDate?: string;
  endDate?: string;
  status: 'active' | 'forming' | 'completed';
}

export type SessionType = 'tadabbur' | 'memorization_followup' | 'orientation' | 'celebration';

export interface ScheduledSession {
  id: string;
  title: string;
  sessionType: SessionType;
  programId: string;
  groupId: string;
  teacherId?: string;
  supervisorId?: string;
  date: string;
  time: string;
  durationMinutes: number;
  meetingLink: string;
  platform: 'zoom' | 'google_meet' | 'other';
  notes?: string;
  attendance: { [studentId: string]: 'present' | 'absent' | 'excused' };
  status: 'scheduled' | 'live' | 'completed' | 'cancelled';
}

export type TaskCategory = 'memorization' | 'revision' | 'tadabbur' | 'application' | 'family_activity' | 'challenge' | 'live_session';
export type TaskStatus = 'not_started' | 'in_progress' | 'completed' | 'needs_followup';

export interface StudentTask {
  id: string;
  studentId: string;
  programId: string;
  weekNumber: number;
  title: string;
  category: TaskCategory;
  description?: string;
  dueDate?: string;
  status: TaskStatus;
  completedAt?: string;
  points: number;
  teacherFeedback?: string;
  supervisorFeedback?: string;
  parentConfirmed?: boolean;
  audioSubmissionId?: string;
}

export interface AudioSubmission {
  id: string;
  studentId: string;
  taskId?: string;
  surahName: string;
  versesRange: string;
  audioUrl?: string;
  audioDurationSeconds?: number;
  submittedAt: string;
  status: 'pending_review' | 'reviewed' | 'needs_redo';
  score?: number; // out of 100
  tajweedRating?: 'excellent' | 'good' | 'needs_practice';
  teacherFeedback?: string;
  reviewedByTeacherId?: string;
  reviewedAt?: string;
  assignedNextTask?: string;
}

export interface FamilyActivity {
  id: string;
  studentId: string;
  weekNumber: number;
  title: string;
  instructions: string;
  dueDate?: string;
  completed: boolean;
  completedAt?: string;
  parentConfirmation: boolean;
  parentNotes?: string;
  supervisorFeedback?: string;
}

export interface BadgeItem {
  id: string;
  title: string;
  description: string;
  iconType: 'seed' | 'tree' | 'star' | 'book' | 'heart' | 'medal';
  requiredPoints: number;
  earnedAt?: string;
}

export interface StudentReport {
  id: string;
  studentId: string;
  periodTitle: string; // e.g. "تقرير شهر 1 - سورة العلق"
  createdAt: string;
  supervisorId: string;
  attendanceRate: number;
  memorizationScore: number;
  tadabburScore: number;
  familyParticipationScore: number;
  generalNotes: string;
  recommendations: string;
  published: boolean;
}

export interface PricingConfig {
  regularMonthlyEGP: number;
  promotionalMonthlyEGP: number;
  siblingMonthlyEGP: number;
  promoCapacity: number;
  promoSubscribersCount: number;
  currency: string;
  coupons: CouponCode[];
}

export interface CouponCode {
  code: string;
  discountPercent: number;
  active: boolean;
}

export interface PaymentRecord {
  id: string;
  parentId: string;
  studentIds: string[];
  programId: string;
  amount: number;
  currency: string;
  planType: 'monthly' | 'full_program';
  paymentMethod: 'fawry' | 'vodafone_cash' | 'credit_card';
  status: 'successful' | 'pending' | 'failed';
  invoiceNumber: string;
  paidAt: string;
  discountApplied?: string;
  receiptDetails: {
    payerName: string;
    phone: string;
    studentNames: string[];
    breakdown: { item: string; amount: number }[];
  };
}

export interface AppNotification {
  id: string;
  recipientId: string;
  role: UserRole;
  title: string;
  message: string;
  type: 'session' | 'task' | 'feedback' | 'report' | 'payment' | 'system';
  createdAt: string;
  read: boolean;
  link?: string;
}

export interface AssessmentCriterion {
  id: string;
  category: 'memorization' | 'tajweed' | 'tadabbur' | 'behavior' | 'attendance';
  title: string;
  maxScore: number;
  description: string;
  active: boolean;
}
