import { PageHeader } from '@/components/common/PageHeader';
import { TimetableGrid } from '@/components/common/TimetableGrid';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { mockTimetableSlots, mockDays, mockTimeslots, mockCourses } from '@/data/mockData';
import { useAuth } from '@/context/AuthContext';
import { Download, FileText, Printer, BookOpen } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import { useEffect, useState } from 'react';

const API_BASE = (import.meta.env.VITE_API_BASE as string) || 'http://localhost:5000';

export default function StudentTimetable() {
  const { user } = useAuth();
  const [slots, setSlots] = useState(mockTimetableSlots);

  useEffect(() => {
    const fetchTT = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/timetables`);
        if (!res.ok) return;
        const tt = await res.json();
        if (!tt || !tt.slots) return;
        setSlots(tt.slots);
      } catch (e) { console.warn('Failed to fetch timetable', e); }
    };
    fetchTT();
  }, []);

  const handleExport = (format: string) => {
    toast({
      title: `Exporting ${format}`,
      description: 'Your timetable is being exported...',
    });
  };

  return (
    <div className="animate-fade-in space-y-6">
      <PageHeader
        title="My Timetable"
        description={`View your class schedule, ${user?.name}`}
        actions={
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => handleExport('PDF')}>
              <FileText className="mr-2 h-4 w-4" />
              Export PDF
            </Button>
            <Button variant="outline" size="sm" onClick={() => handleExport('Excel')}>
              <Download className="mr-2 h-4 w-4" />
              Export Excel
            </Button>
            <Button variant="outline" size="sm" onClick={() => window.print()}>
              <Printer className="mr-2 h-4 w-4" />
              Print
            </Button>
          </div>
        }
      />

      <TimetableGrid
        slots={slots}
        days={mockDays}
        timeslots={mockTimeslots}
      />

      {/* Course List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-primary" />
            My Courses
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {mockCourses.map((course) => (
              <div
                key={course.id}
                className="flex items-start gap-3 rounded-lg border p-4 transition-colors hover:bg-muted/50"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <BookOpen className="h-5 w-5 text-primary" />
                </div>
                <div className="space-y-1">
                  <h4 className="font-medium">{course.name}</h4>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">{course.code}</Badge>
                    <span className="text-xs text-muted-foreground">
                      {course.weeklyHours} hrs/week
                    </span>
                  </div>
                  {course.assignedTeacher && (
                    <p className="text-sm text-muted-foreground">
                      {course.assignedTeacher.user?.name}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
