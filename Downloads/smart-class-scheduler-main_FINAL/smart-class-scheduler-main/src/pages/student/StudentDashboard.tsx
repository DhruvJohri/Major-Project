import { PageHeader } from '@/components/common/PageHeader';
import { StatsCard } from '@/components/common/StatsCard';
import { TimetableGrid } from '@/components/common/TimetableGrid';
import { useAuth } from '@/context/AuthContext';
import { mockTimetableSlots, mockDays, mockTimeslots, mockCourses, mockStudyMaterials } from '@/data/mockData';
import {
  BookOpen,
  Calendar,
  FileText,
  QrCode,
  Clock,
  CheckCircle2,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';

const API_BASE = (import.meta.env.VITE_API_BASE as string) || 'http://localhost:5000';

export default function StudentDashboard() {
  const { user } = useAuth();
  const [counts, setCounts] = useState({ courses: mockCourses.length, todayClasses: 0, materials: mockStudyMaterials.length, attendance: 85 });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [cRes, mRes, ttRes] = await Promise.all([
          fetch(`${API_BASE}/api/courses`),
          fetch(`${API_BASE}/api/materials`),
          fetch(`${API_BASE}/api/timetables`),
        ]);
        const courses = cRes.ok ? await cRes.json() : [];
        const materials = mRes.ok ? await mRes.json() : [];
        const tt = ttRes.ok ? await ttRes.json() : null;
        setCounts({ courses: courses.length, todayClasses: 0, materials: materials.length, attendance: 85 });
      } catch (e) { console.warn('Failed to fetch dashboard stats', e); }
    };
    fetchStats();
  }, []);

  // Filter today's classes
  const today = new Date().toLocaleDateString('en-US', { weekday: 'long' });
  const todayClasses = mockTimetableSlots.filter(slot => slot.day === today);
  const attendancePercentage = counts.attendance;

  const stats = [
    {
      title: 'My Courses',
      value: counts.courses,
      icon: BookOpen,
      description: 'Enrolled courses this semester',
      iconClassName: 'bg-primary/10 text-primary',
    },
    {
      title: 'Today\'s Classes',
      value: todayClasses.length || counts.todayClasses,
      icon: Calendar,
      description: `Scheduled for ${today}`,
      iconClassName: 'bg-accent/10 text-accent',
    },
    {
      title: 'Attendance',
      value: `${attendancePercentage}%`,
      icon: CheckCircle2,
      description: attendancePercentage >= 75 ? 'Good standing' : 'Needs improvement',
      iconClassName: attendancePercentage >= 75 ? 'bg-success/10 text-success' : 'bg-warning/10 text-warning',
    },
    {
      title: 'Study Materials',
      value: counts.materials,
      icon: FileText,
      description: 'Available resources',
      iconClassName: 'bg-chart-2/10 text-chart-2',
    },
  ];

  return (
    <div className="animate-fade-in space-y-6">
      <PageHeader
        title={`Welcome, ${user?.name || 'Student'}`}
        description="Here's your academic overview for today"
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
              <Link to="/student/timetable">View Full Timetable</Link>
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
                          {slot.time} • {slot.room.name} • {slot.teacher.user?.name}
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

        {/* Quick Actions & Attendance */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button className="w-full justify-start" variant="outline" asChild>
                <Link to="/student/attendance">
                  <QrCode className="mr-2 h-4 w-4" />
                  Scan QR for Attendance
                </Link>
              </Button>
              <Button className="w-full justify-start" variant="outline" asChild>
                <Link to="/student/materials">
                  <FileText className="mr-2 h-4 w-4" />
                  View Study Materials
                </Link>
              </Button>
              <Button className="w-full justify-start" variant="outline" asChild>
                <Link to="/student/timetable">
                  <Calendar className="mr-2 h-4 w-4" />
                  View Timetable
                </Link>
              </Button>
            </CardContent>
          </Card>

          {/* Attendance Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Attendance Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span>Overall Attendance</span>
                  <span className="font-medium">{attendancePercentage}%</span>
                </div>
                <Progress value={attendancePercentage} className="h-2" />
              </div>
              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="rounded-lg bg-success/10 p-2">
                  <p className="text-lg font-bold text-success">42</p>
                  <p className="text-xs text-muted-foreground">Present</p>
                </div>
                <div className="rounded-lg bg-destructive/10 p-2">
                  <p className="text-lg font-bold text-destructive">8</p>
                  <p className="text-xs text-muted-foreground">Absent</p>
                </div>
                <div className="rounded-lg bg-muted p-2">
                  <p className="text-lg font-bold">50</p>
                  <p className="text-xs text-muted-foreground">Total</p>
                </div>
              </div>
              {attendancePercentage < 75 && (
                <div className="rounded-lg bg-warning/10 p-3 text-sm text-warning">
                  ⚠️ Your attendance is below 75%. Please attend classes regularly.
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Weekly Timetable Preview */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Your Weekly Timetable</CardTitle>
          <Button variant="outline" size="sm" asChild>
            <Link to="/student/timetable">View Details</Link>
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
