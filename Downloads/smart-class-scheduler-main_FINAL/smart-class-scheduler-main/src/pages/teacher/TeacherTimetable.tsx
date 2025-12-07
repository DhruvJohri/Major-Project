import { PageHeader } from '@/components/common/PageHeader';
import { TimetableGrid } from '@/components/common/TimetableGrid';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { mockTimetableSlots, mockDays, mockTimeslots } from '@/data/mockData';
import { useAuth } from '@/context/AuthContext';
import { Download, FileText, Printer } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

export default function TeacherTimetable() {
  const { user } = useAuth();

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
        description={`View your weekly teaching schedule, ${user?.name}`}
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
        slots={mockTimetableSlots}
        days={mockDays}
        timeslots={mockTimeslots}
      />

      {/* Summary */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Classes/Week
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{mockTimetableSlots.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Teaching Hours
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{mockTimetableSlots.length} hrs</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Unique Courses
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">
              {new Set(mockTimetableSlots.map(s => s.course.id)).size}
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
