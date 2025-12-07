import { PageHeader } from '@/components/common/PageHeader';
import { StatsCard } from '@/components/common/StatsCard';
import { TimetableGrid } from '@/components/common/TimetableGrid';
import { useAuth } from '@/context/AuthContext';
import { mockTimetableSlots, mockDays, mockTimeslots, mockStudents, mockCourses, mockAttendanceSessions } from '@/data/mockData';
import {
  BookOpen,
  Users,
  Calendar,
  QrCode,
  Clock,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';

const API_BASE = (import.meta.env.VITE_API_BASE as string) || 'http://localhost:5000';

export default function TeacherDashboard() {
  const { user } = useAuth();
  const [counts, setCounts] = useState({ courses: 3, students: mockStudents.length, todayClasses: 0, sessions: mockAttendanceSessions.filter(s => !s.isClosed).length });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [cRes, sRes, aRes] = await Promise.all([fetch(`${API_BASE}/api/courses`), fetch(`${API_BASE}/api/students`), fetch(`${API_BASE}/api/attendance/sessions`)]);
        const courses = cRes.ok ? await cRes.json() : [];
        const students = sRes.ok ? await sRes.json() : [];
        const sessions = aRes.ok ? await aRes.json() : [];
        setCounts({ courses: courses.length, students: students.length, todayClasses: 0, sessions: sessions.filter((s:any) => !s.isClosed).length });
      } catch (e) { console.warn('Failed to fetch dashboard stats', e); }
    };
    fetchStats();
  }, []);

  // Filter today's classes
  const today = new Date().toLocaleDateString('en-US', { weekday: 'long' });
  const todayClasses = mockTimetableSlots.filter(slot => slot.day === today);

  const stats = [
    {
      title: 'My Courses',
      value: counts.courses,
      icon: BookOpen,
      description: 'Courses assigned to you',
      iconClassName: 'bg-primary/10 text-primary',
    },
    {
      title: 'My Students',
      value: counts.students,
      icon: Users,
      description: 'Students in your classes',
      iconClassName: 'bg-accent/10 text-accent',
    },
    {
      title: 'Today\'s Classes',
      value: todayClasses.length || counts.todayClasses,
      icon: Calendar,
      description: `Classes scheduled for ${today}`,
      iconClassName: 'bg-success/10 text-success',
    },
    {
      title: 'Active Sessions',
      value: counts.sessions,
      icon: QrCode,
      description: 'Attendance sessions open',
      iconClassName: 'bg-warning/10 text-warning',
    },
  ];

  return (
    <div className="animate-fade-in space-y-6">
      <PageHeader
        title={`Welcome, ${user?.name || 'Teacher'}`}
        description="Here's your teaching overview for today"
      />

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <div key={stat.title} style={{ animationDelay: `${index * 100}ms` }}>
            <StatsCard {...stat} />
          </div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Today's Schedule */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-primary" />
              Today's Schedule
            </CardTitle>
            <Button variant="outline" size="sm" asChild>
              <Link to="/teacher/timetable">View Full Timetable</Link>
            </Button>
          </CardHeader>
          <CardContent>
            {todayClasses.length > 0 ? (
              <div className="space-y-3">
                {todayClasses.map((slot, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between rounded-lg border p-4 transition-colors hover:bg-muted/50"
                  >
                    <div className="flex items-center gap-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                        <span className="text-lg font-bold text-primary">{slot.slotIndex + 1}</span>
                      </div>
                      <div>
                        <h4 className="font-medium">{slot.course.name}</h4>
                        <p className="text-sm text-muted-foreground">
                          {slot.time} • {slot.room.name}
                        </p>
                      </div>
                    </div>
                    <Badge variant="secondary">{slot.course.code}</Badge>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <Calendar className="h-12 w-12 text-muted-foreground/50 mb-4" />
                <p className="text-muted-foreground">No classes scheduled for today</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button className="w-full justify-start" variant="outline" asChild>
              <Link to="/teacher/attendance">
                <QrCode className="mr-2 h-4 w-4" />
                Start Attendance Session
              </Link>
            </Button>
            <Button className="w-full justify-start" variant="outline" asChild>
              <Link to="/teacher/materials">
                <BookOpen className="mr-2 h-4 w-4" />
                Upload Study Material
              </Link>
            </Button>
            <Button className="w-full justify-start" variant="outline" asChild>
              <Link to="/teacher/students">
                <Users className="mr-2 h-4 w-4" />
                Manage Students
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Weekly Timetable Preview */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Your Weekly Timetable</CardTitle>
          <Button variant="outline" size="sm" asChild>
            <Link to="/teacher/timetable">View Details</Link>
          </Button>
        </CardHeader>
        <CardContent>
          <TimetableGrid
            slots={mockTimetableSlots}
            days={mockDays}
            timeslots={mockTimeslots}
          />
        </CardContent>
      </Card>
    </div>
  );
}
