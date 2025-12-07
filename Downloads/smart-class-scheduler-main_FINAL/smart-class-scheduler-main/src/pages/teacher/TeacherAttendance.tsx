import { useState, useEffect } from 'react';
import { PageHeader } from '@/components/common/PageHeader';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { mockAttendanceSessions, mockCourses, mockStudents } from '@/data/mockData';
import { AttendanceSession, Course } from '@/types';
import { QrCode, Plus, Users, Clock, X, Check } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { formatDistanceToNow } from 'date-fns';
import QRCode from 'react-qr-code';

const API_BASE = (import.meta.env.VITE_API_BASE as string) || 'http://localhost:5000';

export default function TeacherAttendance() {
  const [sessions, setSessions] = useState<AttendanceSession[]>(mockAttendanceSessions);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedSession, setSelectedSession] = useState<AttendanceSession | null>(null);
  const [courses, setCourses] = useState<Course[]>(mockCourses);
  const [formData, setFormData] = useState({
    courseId: '',
    duration: '30',
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [cRes, sRes] = await Promise.all([
          fetch(`${API_BASE}/api/courses`),
          fetch(`${API_BASE}/api/attendance/sessions`),
        ]);
        if (cRes.ok) { setCourses(await cRes.json()); }
        if (sRes.ok) { setSessions(await sRes.json()); }
      } catch (e) { console.warn('Failed to fetch attendance data', e); }
    };
    fetchData();
  }, []);

  const handleCreateSession = (e: React.FormEvent) => {
    e.preventDefault();
    
    const course = courses.find(c => c.id === formData.courseId);
    const sessionCode = `ATT-${course?.code}-${Date.now().toString(36).toUpperCase()}`;
    
    const newSession: AttendanceSession = {
      id: Date.now().toString(),
      courseId: formData.courseId,
      course,
      teacherId: '1',
      department: 'CSE',
      semester: 5,
      section: 'A',
      code: sessionCode,
      qrUrl: `${window.location.origin}/attendance/${sessionCode}`,
      expiresAt: new Date(Date.now() + parseInt(formData.duration) * 60 * 1000).toISOString(),
      isClosed: false,
      attendees: [],
      createdAt: new Date().toISOString(),
    };
    
    setSessions([newSession, ...sessions]);
    setSelectedSession(newSession);
    setIsDialogOpen(false);
    toast({ title: 'Session Created', description: 'QR code is ready for students to scan.' });
  };

  const handleCloseSession = (sessionId: string) => {
    setSessions(sessions.map(s => 
      s.id === sessionId ? { ...s, isClosed: true } : s
    ));
    toast({ title: 'Session Closed', description: 'The attendance session has been closed.' });
  };

  const activeSessions = sessions.filter(s => !s.isClosed);
  const closedSessions = sessions.filter(s => s.isClosed);

  return (
    <div className="animate-fade-in space-y-6">
      <PageHeader
        title="Attendance Management"
        description="Create QR-based attendance sessions for your classes"
        actions={
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                New Session
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create Attendance Session</DialogTitle>
                <DialogDescription>
                  Generate a QR code for students to mark attendance
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleCreateSession} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="course">Course</Label>
                  <Select
                    value={formData.courseId}
                    onValueChange={(v) => setFormData({ ...formData, courseId: v })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a course" />
                    </SelectTrigger>
                    <SelectContent>
                      {mockCourses.map((course) => (
                        <SelectItem key={course.id} value={course.id}>
                          {course.code} - {course.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="duration">Session Duration</Label>
                  <Select
                    value={formData.duration}
                    onValueChange={(v) => setFormData({ ...formData, duration: v })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="15">15 minutes</SelectItem>
                      <SelectItem value="30">30 minutes</SelectItem>
                      <SelectItem value="45">45 minutes</SelectItem>
                      <SelectItem value="60">1 hour</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" disabled={!formData.courseId}>
                    <QrCode className="mr-2 h-4 w-4" />
                    Generate QR
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        }
      />

      <div className="grid gap-6 lg:grid-cols-2">
        {/* QR Code Display */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <QrCode className="h-5 w-5 text-primary" />
              Active QR Code
            </CardTitle>
          </CardHeader>
          <CardContent>
            {selectedSession && !selectedSession.isClosed ? (
              <div className="flex flex-col items-center space-y-4">
                <div className="rounded-xl border bg-white p-4">
                  <QRCode value={selectedSession.qrUrl} size={200} />
                </div>
                <div className="text-center space-y-1">
                  <p className="font-semibold">{selectedSession.course?.name}</p>
                  <p className="text-sm text-muted-foreground">
                    Code: <code className="rounded bg-muted px-1">{selectedSession.code}</code>
                  </p>
                  <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    Expires {formatDistanceToNow(new Date(selectedSession.expiresAt), { addSuffix: true })}
                  </div>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Users className="h-4 w-4 text-success" />
                  <span>{selectedSession.attendees.length} students checked in</span>
                </div>
                <Button 
                  variant="destructive" 
                  onClick={() => handleCloseSession(selectedSession.id)}
                >
                  <X className="mr-2 h-4 w-4" />
                  Close Session
                </Button>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <QrCode className="h-16 w-16 text-muted-foreground/50 mb-4" />
                <p className="text-muted-foreground">
                  No active session. Create one to display QR code.
                </p>
                <Button className="mt-4" onClick={() => setIsDialogOpen(true)}>
                  <Plus className="mr-2 h-4 w-4" />
                  Create Session
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Sessions List */}
        <div className="space-y-4">
          {/* Active Sessions */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Active Sessions</CardTitle>
            </CardHeader>
            <CardContent>
              {activeSessions.length > 0 ? (
                <div className="space-y-3">
                  {activeSessions.map((session) => (
                    <div
                      key={session.id}
                      className={`flex items-center justify-between rounded-lg border p-3 cursor-pointer transition-colors ${
                        selectedSession?.id === session.id ? 'border-primary bg-primary/5' : 'hover:bg-muted/50'
                      }`}
                      onClick={() => setSelectedSession(session)}
                    >
                      <div>
                        <p className="font-medium">{session.course?.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {session.attendees.length} check-ins
                        </p>
                      </div>
                      <Badge className="bg-success/10 text-success">Active</Badge>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground text-center py-4">
                  No active sessions
                </p>
              )}
            </CardContent>
          </Card>

          {/* Recent Sessions */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Recent Sessions</CardTitle>
            </CardHeader>
            <CardContent>
              {closedSessions.length > 0 ? (
                <div className="space-y-3">
                  {closedSessions.slice(0, 5).map((session) => (
                    <div
                      key={session.id}
                      className="flex items-center justify-between rounded-lg border p-3"
                    >
                      <div>
                        <p className="font-medium">{session.course?.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {session.attendees.length} attended • {formatDistanceToNow(new Date(session.createdAt), { addSuffix: true })}
                        </p>
                      </div>
                      <Badge variant="secondary">Closed</Badge>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground text-center py-4">
                  No previous sessions
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
