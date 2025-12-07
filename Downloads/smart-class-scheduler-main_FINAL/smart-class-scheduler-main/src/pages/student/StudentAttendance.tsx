import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { PageHeader } from '@/components/common/PageHeader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useAuth } from '@/context/AuthContext';
import { mockCourses } from '@/data/mockData';
import { QrCode, CheckCircle2, Clock, Scan, AlertCircle } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const API_BASE = (import.meta.env.VITE_API_BASE as string) || 'http://localhost:5000';

export default function StudentAttendance() {
  const { sessionCode } = useParams();
  const { user } = useAuth();
  const [manualCode, setManualCode] = useState(sessionCode || '');
  const [isChecking, setIsChecking] = useState(false);
  const [checkInStatus, setCheckInStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [courses, setCourses] = useState(mockCourses);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/courses`);
        if (res.ok) { setCourses(await res.json()); }
      } catch (e) { console.warn('Failed to fetch courses', e); }
    };
    fetchCourses();
  }, []);

  const handleCheckIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualCode.trim()) return;

    setIsChecking(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Simulate success (in real app, would verify with backend)
    if (manualCode.startsWith('ATT-')) {
      setCheckInStatus('success');
      toast({
        title: 'Check-in Successful!',
        description: 'Your attendance has been recorded.',
      });
    } else {
      setCheckInStatus('error');
      toast({
        title: 'Invalid Code',
        description: 'The session code is invalid or expired.',
        variant: 'destructive',
      });
    }
    
    setIsChecking(false);
  };

  // Mock attendance data
  const attendanceData = mockCourses.map((course) => ({
    course,
    attended: Math.floor(Math.random() * 10) + 8,
    total: 15,
  }));

  const overallAttendance = Math.round(
    (attendanceData.reduce((acc, d) => acc + d.attended, 0) /
      attendanceData.reduce((acc, d) => acc + d.total, 0)) *
      100
  );

  return (
    <div className="animate-fade-in space-y-6">
      <PageHeader
        title="Attendance"
        description="Check in to classes and view your attendance record"
      />

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Check-in Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <QrCode className="h-5 w-5 text-primary" />
              Quick Check-in
            </CardTitle>
            <CardDescription>
              Enter the session code displayed by your teacher
            </CardDescription>
          </CardHeader>
          <CardContent>
            {checkInStatus === 'success' ? (
              <div className="flex flex-col items-center py-8 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-success/10 mb-4">
                  <CheckCircle2 className="h-8 w-8 text-success" />
                </div>
                <h3 className="text-lg font-semibold">Checked In!</h3>
                <p className="text-muted-foreground mt-1">
                  Your attendance has been recorded for this session.
                </p>
                <Button
                  className="mt-4"
                  variant="outline"
                  onClick={() => {
                    setCheckInStatus('idle');
                    setManualCode('');
                  }}
                >
                  Check in to Another Session
                </Button>
              </div>
            ) : checkInStatus === 'error' ? (
              <div className="flex flex-col items-center py-8 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10 mb-4">
                  <AlertCircle className="h-8 w-8 text-destructive" />
                </div>
                <h3 className="text-lg font-semibold">Check-in Failed</h3>
                <p className="text-muted-foreground mt-1">
                  The session code is invalid or has expired.
                </p>
                <Button
                  className="mt-4"
                  variant="outline"
                  onClick={() => {
                    setCheckInStatus('idle');
                    setManualCode('');
                  }}
                >
                  Try Again
                </Button>
              </div>
            ) : (
              <form onSubmit={handleCheckIn} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="sessionCode">Session Code</Label>
                  <Input
                    id="sessionCode"
                    value={manualCode}
                    onChange={(e) => setManualCode(e.target.value.toUpperCase())}
                    placeholder="ATT-CS301-ABC123"
                    className="font-mono uppercase"
                    required
                  />
                  <p className="text-xs text-muted-foreground">
                    Enter the code shown on your teacher's screen
                  </p>
                </div>
                <Button type="submit" className="w-full" disabled={isChecking}>
                  {isChecking ? (
                    <>
                      <Clock className="mr-2 h-4 w-4 animate-spin" />
                      Verifying...
                    </>
                  ) : (
                    <>
                      <Scan className="mr-2 h-4 w-4" />
                      Check In
                    </>
                  )}
                </Button>
              </form>
            )}
          </CardContent>
        </Card>

        {/* Overall Attendance */}
        <Card>
          <CardHeader>
            <CardTitle>Overall Attendance</CardTitle>
            <CardDescription>
              Your attendance percentage across all courses
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center py-4">
              <div className="relative flex h-32 w-32 items-center justify-center">
                <svg className="h-full w-full -rotate-90" viewBox="0 0 100 100">
                  <circle
                    className="text-muted stroke-current"
                    strokeWidth="8"
                    fill="transparent"
                    r="42"
                    cx="50"
                    cy="50"
                  />
                  <circle
                    className={`${
                      overallAttendance >= 75 ? 'text-success' : 'text-warning'
                    } stroke-current transition-all duration-500`}
                    strokeWidth="8"
                    strokeLinecap="round"
                    fill="transparent"
                    r="42"
                    cx="50"
                    cy="50"
                    strokeDasharray={`${overallAttendance * 2.64} 264`}
                  />
                </svg>
                <span className="absolute text-3xl font-bold">{overallAttendance}%</span>
              </div>
              <div className="mt-4 text-center">
                <Badge
                  variant={overallAttendance >= 75 ? 'default' : 'destructive'}
                  className={overallAttendance >= 75 ? 'bg-success' : ''}
                >
                  {overallAttendance >= 75 ? 'Good Standing' : 'Below Requirement'}
                </Badge>
                <p className="mt-2 text-sm text-muted-foreground">
                  Minimum required: 75%
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Course-wise Attendance */}
      <Card>
        <CardHeader>
          <CardTitle>Course-wise Attendance</CardTitle>
          <CardDescription>
            Detailed attendance breakdown by course
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {attendanceData.map(({ course, attended, total }) => {
              const percentage = Math.round((attended / total) * 100);
              return (
                <div key={course.id} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">{course.code}</Badge>
                      <span className="font-medium">{course.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground">
                        {attended}/{total} classes
                      </span>
                      <span
                        className={`font-medium ${
                          percentage >= 75 ? 'text-success' : 'text-warning'
                        }`}
                      >
                        {percentage}%
                      </span>
                    </div>
                  </div>
                  <Progress
                    value={percentage}
                    className={`h-2 ${percentage < 75 ? '[&>div]:bg-warning' : ''}`}
                  />
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
