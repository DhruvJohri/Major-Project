import { useState, useEffect } from 'react';
import { PageHeader } from '@/components/common/PageHeader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
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
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { mockStudyMaterials, mockCourses } from '@/data/mockData';
import { StudyMaterial, Course } from '@/types';
import { Plus, FileText, Download, Trash2, Upload, Eye } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { formatDistanceToNow } from 'date-fns';

const API_BASE = (import.meta.env.VITE_API_BASE as string) || 'http://localhost:5000';

export default function TeacherMaterials() {
  const [materials, setMaterials] = useState<StudyMaterial[]>(mockStudyMaterials);
  const [courses, setCourses] = useState<Course[]>(mockCourses);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    courseId: '',
    file: null as File | null,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [cRes, mRes] = await Promise.all([
          fetch(`${API_BASE}/api/courses`),
          fetch(`${API_BASE}/api/materials`),
        ]);
        if (cRes.ok) { setCourses(await cRes.json()); }
        if (mRes.ok) { setMaterials(await mRes.json()); }
      } catch (e) { console.warn('Failed to fetch materials data', e); }
    };
    fetchData();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const course = courses.find(c => c.id === formData.courseId);
    
    const newMaterial: StudyMaterial = {
      id: Date.now().toString(),
      title: formData.title,
      description: formData.description,
      filePath: `/uploads/${formData.file?.name || 'document.pdf'}`,
      fileOriginalName: formData.file?.name || 'document.pdf',
      courseId: formData.courseId,
      course,
      teacherId: '1',
      uploadedAt: new Date().toISOString(),
    };
    
    setMaterials([newMaterial, ...materials]);
    toast({ title: 'Material Uploaded', description: `${formData.title} has been uploaded.` });
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      courseId: '',
      file: null,
    });
    setIsDialogOpen(false);
  };

  const handleDelete = (id: string) => {
    setMaterials(materials.filter(m => m.id !== id));
    toast({ title: 'Material Deleted', description: 'The study material has been removed.' });
  };

  const getFileIcon = (fileName: string) => {
    const ext = fileName.split('.').pop()?.toLowerCase();
    switch (ext) {
      case 'pdf': return '📄';
      case 'doc':
      case 'docx': return '📝';
      case 'ppt':
      case 'pptx': return '📊';
      case 'xls':
      case 'xlsx': return '📈';
      default: return '📁';
    }
  };

  return (
    <div className="animate-fade-in space-y-6">
      <PageHeader
        title="Study Materials"
        description="Upload and manage study materials for your courses"
        actions={
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => resetForm()}>
                <Plus className="mr-2 h-4 w-4" />
                Upload Material
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Upload Study Material</DialogTitle>
                <DialogDescription>
                  Add a new study material for your students
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="Week 1 Lecture Notes"
                    required
                  />
                </div>
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
                      {courses.map((course) => (
                        <SelectItem key={course.id} value={course.id}>
                          {course.code} - {course.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Brief description of the material..."
                    rows={3}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="file">File</Label>
                  <div className="flex items-center gap-2">
                    <Input
                      id="file"
                      type="file"
                      onChange={(e) => setFormData({ ...formData, file: e.target.files?.[0] || null })}
                      accept=".pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx"
                      className="cursor-pointer"
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Supported: PDF, DOC, DOCX, PPT, PPTX, XLS, XLSX
                  </p>
                </div>
                <DialogFooter>
                  <Button type="button" variant="outline" onClick={resetForm}>
                    Cancel
                  </Button>
                  <Button type="submit">
                    <Upload className="mr-2 h-4 w-4" />
                    Upload
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        }
      />

      {/* Materials Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {materials.map((material) => (
          <Card key={material.id} className="transition-all hover:shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  <span className="text-3xl">{getFileIcon(material.fileOriginalName)}</span>
                  <div className="space-y-1">
                    <h3 className="font-semibold line-clamp-1">{material.title}</h3>
                    <Badge variant="secondary" className="text-xs">
                      {material.course?.code}
                    </Badge>
                  </div>
                </div>
              </div>
              <p className="mt-3 text-sm text-muted-foreground line-clamp-2">
                {material.description}
              </p>
              <div className="mt-4 flex items-center justify-between">
                <span className="text-xs text-muted-foreground">
                  {formatDistanceToNow(new Date(material.uploadedAt), { addSuffix: true })}
                </span>
                <div className="flex gap-1">
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <Download className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-8 w-8"
                    onClick={() => handleDelete(material.id)}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {materials.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <FileText className="h-16 w-16 text-muted-foreground/50 mb-4" />
          <h3 className="text-lg font-semibold">No Materials Yet</h3>
          <p className="text-muted-foreground mt-1">
            Upload your first study material to get started
          </p>
          <Button className="mt-4" onClick={() => setIsDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Upload Material
          </Button>
        </div>
      )}
    </div>
  );
}
