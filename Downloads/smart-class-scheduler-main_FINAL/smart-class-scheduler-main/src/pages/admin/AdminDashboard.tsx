import { PageHeader } from '@/components/common/PageHeader';
import { StatsCard } from '@/components/common/StatsCard';
import { mockCourses, mockTeachers, mockStudents, mockRooms, mockActivities } from '@/data/mockData';
import { useEffect, useState } from 'react';

const API_BASE = (import.meta.env.VITE_API_BASE as string) || 'http://localhost:5000';
import {
  BookOpen,
  Users,
  DoorOpen,
  GraduationCap,
  Calendar,
  Activity,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatDistanceToNow } from 'date-fns';

export default function AdminDashboard() {
  const [counts, setCounts] = useState({ courses: mockCourses.length, teachers: mockTeachers.length, students: mockStudents.length, rooms: mockRooms.length });

  useEffect(()=>{
    const fetchCounts = async ()=>{
      try{
        const [cRes, tRes, sRes, rRes] = await Promise.all([
          fetch(`${API_BASE}/api/courses`),
          fetch(`${API_BASE}/api/teachers`),
          fetch(`${API_BASE}/api/students`),
          fetch(`${API_BASE}/api/rooms`),
        ]);
        const [courses, teachers, students, rooms] = await Promise.all([cRes.ok?cRes.json():Promise.resolve(mockCourses), tRes.ok?tRes.json():Promise.resolve(mockTeachers), sRes.ok?sRes.json():Promise.resolve(mockStudents), rRes.ok?rRes.json():Promise.resolve(mockRooms)]);
        setCounts({ courses: courses.length, teachers: teachers.length, students: students.length, rooms: rooms.length });
      }catch(e){ console.warn('Failed to fetch admin counts', e); }
    };
    fetchCounts();
  },[]);

  const stats = [
    {
      title: 'Total Courses',
      value: counts.courses,
      icon: BookOpen,
      description: 'Active courses this semester',
      iconClassName: 'bg-primary/10 text-primary',
    },
    {
      title: 'Faculty Members',
      value: counts.teachers,
      icon: Users,
      description: 'Active teaching staff',
      iconClassName: 'bg-accent/10 text-accent',
    },
    {
      title: 'Enrolled Students',
      value: counts.students,
      icon: GraduationCap,
      description: 'Total enrolled students',
      iconClassName: 'bg-success/10 text-success',
    },
    {
      title: 'Available Rooms',
      value: counts.rooms,
      icon: DoorOpen,
      description: 'Lecture halls & labs',
      iconClassName: 'bg-warning/10 text-warning',
    },
  ];

  return (
    <div className="animate-fade-in">
      <PageHeader
        title="Admin Dashboard"
        description="Overview of your institution's academic management"
      />

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
        {stats.map((stat, index) => (
          <div key={stat.title} style={{ animationDelay: `${index * 100}ms` }}>
            <StatsCard {...stat} />
          </div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-primary" />
              Quick Actions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3 sm:grid-cols-2">
              {[
                { label: 'Generate Timetable', href: '/admin/timetable', color: 'bg-primary' },
                { label: 'Add New Course', href: '/admin/courses', color: 'bg-accent' },
                { label: 'Manage Faculty', href: '/admin/faculty', color: 'bg-success' },
                { label: 'Room Management', href: '/admin/rooms', color: 'bg-warning' },
              ].map((action) => (
                <a
                  key={action.label}
                  href={action.href}
                  className="flex items-center gap-3 rounded-lg border p-4 transition-all hover:bg-muted hover:border-primary/50"
                >
                  <div className={`h-2 w-2 rounded-full ${action.color}`} />
                  <span className="text-sm font-medium">{action.label}</span>
                </a>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-primary" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockActivities.slice(0, 5).map((activity) => (
                <div
                  key={activity.id}
                  className="flex items-start gap-4 rounded-lg p-3 transition-colors hover:bg-muted"
                >
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                    <Activity className="h-4 w-4 text-primary" />
                  </div>
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium">{activity.action}</p>
                    <p className="text-xs text-muted-foreground">
                      {activity.details}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {formatDistanceToNow(new Date(activity.timestamp), { addSuffix: true })}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
