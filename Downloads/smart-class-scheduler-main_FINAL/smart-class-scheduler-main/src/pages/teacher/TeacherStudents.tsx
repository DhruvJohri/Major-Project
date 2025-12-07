import { useState, useEffect } from 'react';
import { PageHeader } from '@/components/common/PageHeader';
import { DataTable } from '@/components/common/DataTable';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { mockStudents } from '@/data/mockData';
import { Student } from '@/types';
import { Plus, Pencil, Trash2, Upload, Download } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const API_BASE = (import.meta.env.VITE_API_BASE as string) || 'http://localhost:5000';

export default function TeacherStudents() {
  const [students, setStudents] = useState<Student[]>(mockStudents);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    rollNumber: '',
    semester: 5,
    section: 'A',
    department: 'CSE',
  });

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/students`);
        if (res.ok) {
          const data = await res.json();
          setStudents(data.map((s: any) => ({ ...s, id: s._id || s.id })));
        }
      } catch (e) { console.warn('Failed to fetch students', e); }
    };
    fetchStudents();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingStudent) {
      setStudents(students.map(s => 
        s.id === editingStudent.id 
          ? { 
              ...s, 
              rollNumber: formData.rollNumber,
              semester: formData.semester,
              section: formData.section,
              department: formData.department,
              user: { ...s.user!, name: formData.name, email: formData.email },
            }
          : s
      ));
      toast({ title: 'Student Updated', description: `${formData.name} has been updated.` });
    } else {
      const newStudent: Student = {
        id: Date.now().toString(),
        userId: Date.now().toString(),
        rollNumber: formData.rollNumber,
        semester: formData.semester,
        section: formData.section,
        department: formData.department,
        attendancePercentage: 0,
        user: {
          id: Date.now().toString(),
          name: formData.name,
          email: formData.email,
          role: 'Student',
          department: formData.department,
          createdAt: new Date().toISOString(),
        },
      };
      setStudents([...students, newStudent]);
      toast({ title: 'Student Added', description: `${formData.name} has been added.` });
    }
    
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      rollNumber: '',
      semester: 5,
      section: 'A',
      department: 'CSE',
    });
    setEditingStudent(null);
    setIsDialogOpen(false);
  };

  const handleEdit = (student: Student) => {
    setEditingStudent(student);
    setFormData({
      name: student.user?.name || '',
      email: student.user?.email || '',
      rollNumber: student.rollNumber,
      semester: student.semester,
      section: student.section,
      department: student.department,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    setStudents(students.filter(s => s.id !== id));
    toast({ title: 'Student Removed', description: 'The student has been removed.' });
  };

  const getAttendanceColor = (percentage: number) => {
    if (percentage >= 75) return 'text-success';
    if (percentage >= 60) return 'text-warning';
    return 'text-destructive';
  };

  const columns = [
    { 
      key: 'rollNumber', 
      header: 'Roll Number',
      render: (student: Student) => (
        <span className="font-mono text-sm">{student.rollNumber}</span>
      ),
    },
    { 
      key: 'name', 
      header: 'Name',
      render: (student: Student) => student.user?.name || 'N/A',
    },
    { 
      key: 'email', 
      header: 'Email',
      render: (student: Student) => student.user?.email || 'N/A',
    },
    { 
      key: 'section', 
      header: 'Section',
      render: (student: Student) => (
        <Badge variant="outline">Sem {student.semester} - {student.section}</Badge>
      ),
    },
    { 
      key: 'attendance', 
      header: 'Attendance',
      render: (student: Student) => (
        <div className="flex items-center gap-2 min-w-[120px]">
          <Progress 
            value={student.attendancePercentage || 0} 
            className="h-2 flex-1"
          />
          <span className={`text-sm font-medium ${getAttendanceColor(student.attendancePercentage || 0)}`}>
            {student.attendancePercentage || 0}%
          </span>
        </div>
      ),
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (student: Student) => (
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={() => handleEdit(student)}>
            <Pencil className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" onClick={() => handleDelete(student.id)}>
            <Trash2 className="h-4 w-4 text-destructive" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="animate-fade-in">
      <PageHeader
        title="Student Management"
        description="Manage students in your classes"
        actions={
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Upload className="mr-2 h-4 w-4" />
              Import Excel
            </Button>
            <Button variant="outline" size="sm">
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={() => resetForm()}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Student
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>
                    {editingStudent ? 'Edit Student' : 'Add New Student'}
                  </DialogTitle>
                  <DialogDescription>
                    {editingStudent
                      ? 'Update the student details below.'
                      : 'Fill in the details to add a new student.'}
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="John Doe"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="rollNumber">Roll Number</Label>
                      <Input
                        id="rollNumber"
                        value={formData.rollNumber}
                        onChange={(e) => setFormData({ ...formData, rollNumber: e.target.value })}
                        placeholder="CSE2021001"
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="student@school.edu"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="department">Department</Label>
                      <Select
                        value={formData.department}
                        onValueChange={(v) => setFormData({ ...formData, department: v })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {['CSE', 'ECE', 'EEE', 'MECH', 'CIVIL', 'IT'].map((dept) => (
                            <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="semester">Semester</Label>
                      <Select
                        value={formData.semester.toString()}
                        onValueChange={(v) => setFormData({ ...formData, semester: parseInt(v) })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {[1, 2, 3, 4, 5, 6, 7, 8].map((sem) => (
                            <SelectItem key={sem} value={sem.toString()}>Sem {sem}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="section">Section</Label>
                      <Select
                        value={formData.section}
                        onValueChange={(v) => setFormData({ ...formData, section: v })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {['A', 'B', 'C', 'D'].map((sec) => (
                            <SelectItem key={sec} value={sec}>{sec}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button type="button" variant="outline" onClick={resetForm}>
                      Cancel
                    </Button>
                    <Button type="submit">
                      {editingStudent ? 'Update Student' : 'Add Student'}
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        }
      />

      <DataTable
        data={students}
        columns={columns}
        searchPlaceholder="Search students..."
      />
    </div>
  );
}
