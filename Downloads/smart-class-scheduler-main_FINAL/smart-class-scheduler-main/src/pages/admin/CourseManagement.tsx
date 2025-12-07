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
import { mockCourses, mockTeachers } from '@/data/mockData';
import { Course as CourseType, Teacher as TeacherType } from '@/types';
const API_BASE = (import.meta.env.VITE_API_BASE as string) || 'http://localhost:5000';
import { Course } from '@/types';
import { Plus, Pencil, Trash2, Upload, Download } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

export default function CourseManagement() {
  const [courses, setCourses] = useState<CourseType[]>(mockCourses as CourseType[]);
  const [teachers, setTeachers] = useState<TeacherType[]>(mockTeachers as TeacherType[]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
    useEffect(()=>{
      const fetchData = async ()=>{
        try{
          const [cRes, tRes] = await Promise.all([fetch(`${API_BASE}/api/courses`), fetch(`${API_BASE}/api/teachers`)]);
          if(cRes.ok){
            const cs = await cRes.json();
            const normalized = cs.map((it: any)=> ({ ...it, id: it._id || it.id }));
            setCourses(normalized);
          }
          if(tRes.ok){
            const ts = await tRes.json();
            const normalizedT = ts.map((it: any)=> ({ ...it, id: it._id || it.id }));
            setTeachers(normalizedT as TeacherType[]);
          }
        }catch(e){ console.warn('Failed to fetch courses/teachers', e); }
      };
      fetchData();
    },[]);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [formData, setFormData] = useState({
    code: '',
    name: '',
    department: 'CSE',
    semester: 1,
    weeklyHours: 3,
    assignedTeacherId: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    (async ()=>{
      try{
        if(editingCourse){
          const res = await fetch(`${API_BASE}/api/courses/${editingCourse.id}`, {
            method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(formData)
          });
          const updated = await res.json();
          const normalized = { ...updated, id: updated._id || updated.id };
          setCourses(courses.map(c=> c.id === editingCourse.id ? normalized : c));
          toast({ title: 'Course Updated', description: `${formData.name} has been updated.` });
        } else {
          const res = await fetch(`${API_BASE}/api/courses`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(formData) });
          const created = await res.json();
          const normalized = { ...created, id: created._id || created.id };
          setCourses([...courses, normalized]);
          toast({ title: 'Course Added', description: `${formData.name} has been added.` });
        }
      }catch(e){
        console.error(e);
        toast({ title: 'Error', description: 'Failed to save course', variant: 'destructive' });
      }finally{ resetForm(); }
    })();
  };

  const resetForm = () => {
    setFormData({
      code: '',
      name: '',
      department: 'CSE',
      semester: 1,
      weeklyHours: 3,
      assignedTeacherId: '',
    });
    setEditingCourse(null);
    setIsDialogOpen(false);
  };

  const handleEdit = (course: Course) => {
    setEditingCourse(course);
    setFormData({
      code: course.code,
      name: course.name,
      department: course.department,
      semester: course.semester,
      weeklyHours: course.weeklyHours,
      assignedTeacherId: course.assignedTeacher?.id || '',
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    (async ()=>{
      try{
        const res = await fetch(`${API_BASE}/api/courses/${id}`, { method: 'DELETE' });
        if(res.ok){
          setCourses(courses.filter(c => c.id !== id));
          toast({ title: 'Course Deleted', description: 'The course has been removed.' });
        } else throw new Error('Delete failed');
      }catch(e){
        console.error(e);
        toast({ title: 'Delete Failed', description: 'Unable to delete course', variant: 'destructive' });
      }
    })();
  };

  const columns = [
    { key: 'code', header: 'Code' },
    { key: 'name', header: 'Course Name' },
    { 
      key: 'department', 
      header: 'Department',
      render: (course: Course) => (
        <Badge variant="outline">{course.department}</Badge>
      ),
    },
    { 
      key: 'semester', 
      header: 'Semester',
      render: (course: Course) => `Sem ${course.semester}`,
    },
    { 
      key: 'weeklyHours', 
      header: 'Hours/Week',
      render: (course: Course) => `${course.weeklyHours} hrs`,
    },
    { 
      key: 'assignedTeacher', 
      header: 'Assigned Teacher',
      render: (course: Course) => course.assignedTeacher?.user?.name || 'Not Assigned',
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (course: Course) => (
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={() => handleEdit(course)}>
            <Pencil className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" onClick={() => handleDelete(course.id)}>
            <Trash2 className="h-4 w-4 text-destructive" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="animate-fade-in">
      <PageHeader
        title="Course Management"
        description="Manage all courses offered in your institution"
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
                  Add Course
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>
                    {editingCourse ? 'Edit Course' : 'Add New Course'}
                  </DialogTitle>
                  <DialogDescription>
                    {editingCourse
                      ? 'Update the course details below.'
                      : 'Fill in the details to add a new course.'}
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="code">Course Code</Label>
                      <Input
                        id="code"
                        value={formData.code}
                        onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                        placeholder="CS301"
                        required
                      />
                    </div>
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
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="name">Course Name</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Data Structures & Algorithms"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
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
                            <SelectItem key={sem} value={sem.toString()}>Semester {sem}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="weeklyHours">Weekly Hours</Label>
                      <Input
                        id="weeklyHours"
                        type="number"
                        min={1}
                        max={10}
                        value={formData.weeklyHours}
                        onChange={(e) => setFormData({ ...formData, weeklyHours: parseInt(e.target.value) })}
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="teacher">Assigned Teacher</Label>
                    <Select
                      value={formData.assignedTeacherId}
                      onValueChange={(v) => setFormData({ ...formData, assignedTeacherId: v })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select a teacher" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">Not Assigned</SelectItem>
                        {teachers.map((teacher) => (
                          <SelectItem key={(teacher as any)._id || (teacher as any).id} value={(teacher as any)._id || (teacher as any).id}>
                            {(teacher as any).user?.name || (teacher as any).name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <DialogFooter>
                    <Button type="button" variant="outline" onClick={resetForm}>
                      Cancel
                    </Button>
                    <Button type="submit">
                      {editingCourse ? 'Update Course' : 'Add Course'}
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        }
      />

      <DataTable
        data={courses}
        columns={columns}
        searchPlaceholder="Search courses..."
      />
    </div>
  );
}
