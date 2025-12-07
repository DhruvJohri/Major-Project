import { useState, useEffect } from 'react';
import { PageHeader } from '@/components/common/PageHeader';
import { TimetableGrid } from '@/components/common/TimetableGrid';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { mockTimetableSlots, mockDays, mockTimeslots, mockCourses } from '@/data/mockData';
import { Course, Teacher, Room, TimetableSlot } from '@/types';
import { Wand2, Download, FileText, Loader2, CheckCircle2 } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const API_BASE = (import.meta.env.VITE_API_BASE as string) || 'http://localhost:5000';

export default function TimetablePage() {
  const [department, setDepartment] = useState('CSE');
  const [semester, setSemester] = useState('5');
  const [section, setSection] = useState('A');
  const [slots, setSlots] = useState<TimetableSlot[]>(mockTimetableSlots);
  const [courses, setCourses] = useState<Course[]>([]);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationProgress, setGenerationProgress] = useState(0);
  const [generationStatus, setGenerationStatus] = useState<'idle' | 'running' | 'success' | 'error'>('idle');

  const simulateGeneticAlgorithm = async () => {
    setIsGenerating(true);
    setGenerationStatus('running');
    setGenerationProgress(10);

    try {
      const body = {
        department,
        semester: Number(semester),
        section,
        days: mockDays,
        slotsPerDay: mockTimeslots.length,
        timeslots: mockTimeslots,
        courses,
        teachers,
        rooms,
      };

      const resp = await fetch(`${API_BASE}/api/timetables/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      setGenerationProgress(60);

      if (!resp.ok) throw new Error('Generation API failed');

      const data = await resp.json();
      setSlots(data.slots || []);

      setGenerationProgress(100);
      setGenerationStatus('success');

      toast({
        title: 'Timetable Generated',
        description: `Successfully generated timetable for ${department} Semester ${semester} Section ${section}`,
      });

    } catch (err) {
      console.error(err);
      setGenerationStatus('error');
      toast({
        title: 'Generation Failed',
        description: 'Could not generate timetable',
        variant: 'destructive',
      });
    } finally {
      setIsGenerating(false);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [cRes, tRes, rRes] = await Promise.all([
          fetch(`${API_BASE}/api/courses`),
          fetch(`${API_BASE}/api/teachers`),
          fetch(`${API_BASE}/api/rooms`),
        ]);

        if (cRes.ok) setCourses(await cRes.json());
        if (tRes.ok) setTeachers(await tRes.json());
        if (rRes.ok) setRooms(await rRes.json());
      } catch (e) {
        console.warn('Failed to fetch catalogue data', e);
      }
    };

    fetchData();
  }, []);

  const handleExportPDF = () => {
    toast({ title: 'Exporting PDF', description: 'Your timetable is being exported...' });
  };

  const handleExportExcel = () => {
    toast({ title: 'Exporting Excel', description: 'Your timetable is being exported...' });
  };

  return (
    <div className="animate-fade-in space-y-6">
      <PageHeader
        title="Timetable Generation"
        description="Generate and manage class timetables using AI-powered scheduling"
        actions={
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={handleExportPDF}>
              <FileText className="mr-2 h-4 w-4" />
              Export PDF
            </Button>
            <Button variant="outline" size="sm" onClick={handleExportExcel}>
              <Download className="mr-2 h-4 w-4" />
              Export Excel
            </Button>
          </div>
        }
      />

      <Card>
        <CardHeader>
          <CardTitle>Configuration</CardTitle>
          <CardDescription>Select the department and semester</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-4">
            <div>
              <Label>Department</Label>
              <Select value={department} onValueChange={setDepartment}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {['CSE', 'ECE', 'EEE', 'MECH', 'CIVIL', 'IT'].map(dept => (
                    <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Semester</Label>
              <Select value={semester} onValueChange={setSemester}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {[1,2,3,4,5,6,7,8].map(sem => (
                    <SelectItem key={sem} value={sem.toString()}>Semester {sem}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Section</Label>
              <Select value={section} onValueChange={setSection}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {['A','B','C','D'].map(sec => (
                    <SelectItem key={sec} value={sec}>Section {sec}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-end">
              <Button onClick={simulateGeneticAlgorithm} disabled={isGenerating} className="w-full">
                {isGenerating ? <Loader2 className="animate-spin mr-2 h-4 w-4" /> : <Wand2 className="mr-2 h-4 w-4" />}
                {isGenerating ? 'Generating...' : 'Generate Timetable'}
              </Button>
            </div>
          </div>

          {isGenerating && <Progress className="mt-4" value={generationProgress} />}

          {generationStatus === 'success' &&
            <div className="mt-4 flex items-center gap-2 text-success">
              <CheckCircle2 /> Timetable generated successfully!
            </div>
          }
        </CardContent>
      </Card>

      <TimetableGrid slots={slots} days={mockDays} timeslots={mockTimeslots} />
    </div>
  );
}
