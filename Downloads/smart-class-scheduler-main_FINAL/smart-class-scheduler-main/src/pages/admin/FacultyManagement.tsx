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
import { Switch } from '@/components/ui/switch';
import { mockTeachers } from '@/data/mockData';
import { Teacher } from '@/types';
const API_BASE = (import.meta.env.VITE_API_BASE as string) || 'http://localhost:5000';
import { Plus, Pencil, Trash2, Upload, Download } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

export default function FacultyManagement() {
  const [teachers, setTeachers] = useState<Teacher[]>(mockTeachers);
  useEffect(()=>{
    const fetchTeachers = async ()=>{
      try{
        const res = await fetch(`${API_BASE}/api/teachers`);
        if(res.ok){
          const ts = await res.json();
          const normalized = ts.map((t:any)=> ({ ...t, id: t._id || t.id, user: t.user || null }));
          setTeachers(normalized);
        }
      }catch(e){ console.warn('Failed to fetch teachers', e); }
    };
    fetchTeachers();
  },[]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingTeacher, setEditingTeacher] = useState<Teacher | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    employeeId: '',
    department: 'CSE',
    subjects: '',
    maxLecturesPerDay: 4,
    maxLecturesPerWeek: 20,
    isActive: true,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const subjectsArray = formData.subjects.split(',').map(s => s.trim()).filter(Boolean);
    
    (async ()=>{
      try{
        if(editingTeacher){
          const res = await fetch(`${API_BASE}/api/teachers/${editingTeacher.id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ employeeId: formData.employeeId, subjects: subjectsArray, maxLecturesPerDay: formData.maxLecturesPerDay, maxLecturesPerWeek: formData.maxLecturesPerWeek, isActive: formData.isActive, department: formData.department }) });
          const updated = await res.json();
          const normalized = { ...updated, id: updated._id || updated.id };
          setTeachers(teachers.map(t=> t.id === editingTeacher.id ? { ...t, ...normalized, user: { ...t.user!, name: formData.name, email: formData.email } } : t));
          toast({ title: 'Teacher Updated', description: `${formData.name} has been updated.` });
        } else {
          const res = await fetch(`${API_BASE}/api/teachers`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ userId: null, employeeId: formData.employeeId, subjects: subjectsArray, maxLecturesPerDay: formData.maxLecturesPerDay, maxLecturesPerWeek: formData.maxLecturesPerWeek, isActive: formData.isActive, department: formData.department }) });
          const created = await res.json();
          const normalized = { ...created, id: created._id || created.id, user: { id: Date.now().toString(), name: formData.name, email: formData.email, role: 'Teacher', department: formData.department, createdAt: new Date().toISOString() } };
          setTeachers([...teachers, normalized]);
          toast({ title: 'Teacher Added', description: `${formData.name} has been added.` });
        }
      }catch(e){ console.error(e); toast({ title: 'Error', description: 'Failed to save teacher', variant: 'destructive' }); }
      finally{ resetForm(); }
    })();
    
    
  };

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      employeeId: '',
      department: 'CSE',
      subjects: '',
      maxLecturesPerDay: 4,
      maxLecturesPerWeek: 20,
      isActive: true,
    });
    setEditingTeacher(null);
    setIsDialogOpen(false);
  };

  const handleEdit = (teacher: Teacher) => {
    setEditingTeacher(teacher);
    setFormData({
      name: teacher.user?.name || '',
      email: teacher.user?.email || '',
      employeeId: teacher.employeeId,
      department: teacher.department,
      subjects: teacher.subjects.join(', '),
      maxLecturesPerDay: teacher.maxLecturesPerDay,
      maxLecturesPerWeek: teacher.maxLecturesPerWeek,
      isActive: teacher.isActive,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    (async ()=>{
      try{
        const res = await fetch(`${API_BASE}/api/teachers/${id}`, { method: 'DELETE' });
        if(res.ok){ setTeachers(teachers.filter(t => t.id !== id)); toast({ title: 'Teacher Removed', description: 'The teacher has been removed.' }); }
        else throw new Error('Delete failed');
      }catch(e){ console.error(e); toast({ title: 'Delete Failed', description: 'Unable to remove teacher', variant: 'destructive' }); }
    })();
  };

  const columns = [
    { 
      key: 'employeeId', 
      header: 'Employee ID',
      render: (teacher: Teacher) => (
        <span className="font-mono text-sm">{teacher.employeeId}</span>
      ),
    },
    { 
      key: 'name', 
      header: 'Name',
      render: (teacher: Teacher) => teacher.user?.name || 'N/A',
    },
    { 
      key: 'email', 
      header: 'Email',
      render: (teacher: Teacher) => teacher.user?.email || 'N/A',
    },
    { 
      key: 'department', 
      header: 'Department',
      render: (teacher: Teacher) => (
        <Badge variant="outline">{teacher.department}</Badge>
      ),
    },
    { 
      key: 'subjects', 
      header: 'Subjects',
      render: (teacher: Teacher) => (
        <div className="flex flex-wrap gap-1 max-w-[200px]">
          {teacher.subjects.slice(0, 2).map((subject) => (
            <Badge key={subject} variant="secondary" className="text-xs">
              {subject}
            </Badge>
          ))}
          {teacher.subjects.length > 2 && (
            <Badge variant="secondary" className="text-xs">
              +{teacher.subjects.length - 2}
            </Badge>
          )}
        </div>
      ),
    },
    { 
      key: 'isActive', 
      header: 'Status',
      render: (teacher: Teacher) => (
        <Badge variant={teacher.isActive ? 'default' : 'secondary'}>
          {teacher.isActive ? 'Active' : 'Inactive'}
        </Badge>
      ),
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (teacher: Teacher) => (
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={() => handleEdit(teacher)}>
            <Pencil className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" onClick={() => handleDelete(teacher.id)}>
            <Trash2 className="h-4 w-4 text-destructive" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="animate-fade-in">
      <PageHeader
        title="Faculty Management"
        description="Manage teachers and their assignments"
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
                  Add Teacher
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-lg">
                <DialogHeader>
                  <DialogTitle>
                    {editingTeacher ? 'Edit Teacher' : 'Add New Teacher'}
                  </DialogTitle>
                  <DialogDescription>
                    {editingTeacher
                      ? 'Update the teacher details below.'
                      : 'Fill in the details to add a new teacher.'}
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
                        placeholder="Dr. John Smith"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="employeeId">Employee ID</Label>
                      <Input
                        id="employeeId"
                        value={formData.employeeId}
                        onChange={(e) => setFormData({ ...formData, employeeId: e.target.value })}
                        placeholder="EMP001"
                        required
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="teacher@school.edu"
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
                    <Label htmlFor="subjects">Subjects (comma-separated)</Label>
                    <Input
                      id="subjects"
                      value={formData.subjects}
                      onChange={(e) => setFormData({ ...formData, subjects: e.target.value })}
                      placeholder="Data Structures, Algorithms, Python"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="maxPerDay">Max Lectures/Day</Label>
                      <Input
                        id="maxPerDay"
                        type="number"
                        min={1}
                        max={8}
                        value={formData.maxLecturesPerDay}
                        onChange={(e) => setFormData({ ...formData, maxLecturesPerDay: parseInt(e.target.value) })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="maxPerWeek">Max Lectures/Week</Label>
                      <Input
                        id="maxPerWeek"
                        type="number"
                        min={1}
                        max={40}
                        value={formData.maxLecturesPerWeek}
                        onChange={(e) => setFormData({ ...formData, maxLecturesPerWeek: parseInt(e.target.value) })}
                      />
                    </div>
                  </div>
                  <div className="flex items-center justify-between rounded-lg border p-3">
                    <div>
                      <Label htmlFor="isActive">Active Status</Label>
                      <p className="text-xs text-muted-foreground">
                        Teacher can be assigned to classes
                      </p>
                    </div>
                    <Switch
                      id="isActive"
                      checked={formData.isActive}
                      onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
                    />
                  </div>
                  <DialogFooter>
                    <Button type="button" variant="outline" onClick={resetForm}>
                      Cancel
                    </Button>
                    <Button type="submit">
                      {editingTeacher ? 'Update Teacher' : 'Add Teacher'}
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        }
      />

      <DataTable
        data={teachers}
        columns={columns}
        searchPlaceholder="Search faculty..."
      />
    </div>
  );
}
