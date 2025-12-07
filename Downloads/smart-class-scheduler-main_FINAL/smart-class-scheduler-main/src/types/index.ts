export type UserRole = 'Admin' | 'Teacher' | 'Student';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  department: string;
  createdAt: string;
}

export interface Teacher {
  id: string;
  userId: string;
  user?: User;
  employeeId: string;
  subjects: string[];
  maxLecturesPerDay: number;
  maxLecturesPerWeek: number;
  isActive: boolean;
  department: string;
}

export interface Student {
  id: string;
  userId: string;
  user?: User;
  rollNumber: string;
  semester: number;
  section: string;
  department: string;
  attendancePercentage?: number;
}

export interface Course {
  id: string;
  code: string;
  name: string;
  department: string;
  semester: number;
  weeklyHours: number;
  assignedTeacher?: Teacher;
  assignedTeacherId?: string;
}

export interface Room {
  id: string;
  name: string;
  type: 'Lecture' | 'Lab' | 'Seminar';
  capacity: number;
  department?: string;
  isAvailable: boolean;
}

export interface TimetableSlot {
  day: string;
  slotIndex: number;
  course: Course;
  teacher: Teacher;
  room: Room;
  time: string;
}

export interface Timetable {
  id: string;
  department: string;
  semester: number;
  section: string;
  days: string[];
  slotsPerDay: number;
  slots: TimetableSlot[];
  generatedAt: string;
}

export interface AttendanceSession {
  id: string;
  courseId: string;
  course?: Course;
  teacherId: string;
  teacher?: Teacher;
  department: string;
  semester: number;
  section: string;
  code: string;
  qrUrl: string;
  expiresAt: string;
  isClosed: boolean;
  attendees: {
    studentId: string;
    student?: Student;
    checkedInAt: string;
  }[];
  createdAt: string;
}

export interface StudyMaterial {
  id: string;
  title: string;
  description: string;
  filePath: string;
  fileOriginalName: string;
  courseId: string;
  course?: Course;
  teacherId: string;
  teacher?: Teacher;
  uploadedAt: string;
}

export interface Activity {
  id: string;
  userId: string;
  user?: User;
  action: string;
  details: string;
  timestamp: string;
}

export interface DashboardStats {
  totalCourses: number;
  totalTeachers: number;
  totalStudents: number;
  totalRooms: number;
  activeSessions: number;
  todayClasses: number;
}
