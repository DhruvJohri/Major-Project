import { useState, useEffect } from 'react';
import { PageHeader } from '@/components/common/PageHeader';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { mockStudyMaterials, mockCourses } from '@/data/mockData';
import { StudyMaterial } from '@/types';
import { FileText, Download, Eye, Search, BookOpen } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

const API_BASE = (import.meta.env.VITE_API_BASE as string) || 'http://localhost:5000';

export default function StudentMaterials() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCourse, setSelectedCourse] = useState<string>('all');
  const [materials, setMaterials] = useState<StudyMaterial[]>(mockStudyMaterials);
  const [courses, setCourses] = useState(mockCourses);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [mRes, cRes] = await Promise.all([
          fetch(`${API_BASE}/api/materials`),
          fetch(`${API_BASE}/api/courses`),
        ]);
        if (mRes.ok) { setMaterials(await mRes.json()); }
        if (cRes.ok) { setCourses(await cRes.json()); }
      } catch (e) { console.warn('Failed to fetch materials/courses', e); }
    };
    fetchData();
  }, []);

  const filteredMaterials = materials.filter((material) => {
    const matchesSearch = material.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      material.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCourse = selectedCourse === 'all' || material.courseId === selectedCourse;
    return matchesSearch && matchesCourse;
  });

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
        description="Access course materials uploaded by your teachers"
      />

      {/* Filters */}
      <div className="flex flex-col gap-4 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search materials..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={selectedCourse} onValueChange={setSelectedCourse}>
          <SelectTrigger>
            <SelectValue placeholder="Filter by course" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Courses</SelectItem>
            {courses.map((course: any) => (
              <SelectItem key={course.id || course._id} value={course.id || course._id}>
                {course.code} - {course.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Materials Grid */}
      {filteredMaterials.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredMaterials.map((material) => (
            <Card key={material.id} className="transition-all hover:shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-start gap-3">
                  <span className="text-3xl">{getFileIcon(material.fileOriginalName)}</span>
                  <div className="flex-1 space-y-1">
                    <h3 className="font-semibold line-clamp-1">{material.title}</h3>
                    <Badge variant="secondary" className="text-xs">
                      {material.course?.code}
                    </Badge>
                  </div>
                </div>
                <p className="mt-3 text-sm text-muted-foreground line-clamp-2">
                  {material.description}
                </p>
                <div className="mt-4 flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground">
                      by {material.teacher?.user?.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {formatDistanceToNow(new Date(material.uploadedAt), { addSuffix: true })}
                    </p>
                  </div>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <FileText className="h-16 w-16 text-muted-foreground/50 mb-4" />
          <h3 className="text-lg font-semibold">No Materials Found</h3>
          <p className="text-muted-foreground mt-1">
            {searchQuery || selectedCourse !== 'all'
              ? 'Try adjusting your filters'
              : 'No study materials have been uploaded yet'}
          </p>
        </div>
      )}

      {/* Course Summary */}
      <Card>
        <CardContent className="p-6">
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-primary" />
            Materials by Course
          </h3>
          <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3">
            {mockCourses.map((course) => {
              const count = materials.filter(m => m.courseId === course.id).length;
              return (
                <button
                  key={course.id}
                  onClick={() => setSelectedCourse(course.id)}
                  className={`flex items-center justify-between rounded-lg border p-3 text-left transition-colors hover:bg-muted/50 ${
                    selectedCourse === course.id ? 'border-primary bg-primary/5' : ''
                  }`}
                >
                  <div>
                    <p className="font-medium">{course.code}</p>
                    <p className="text-sm text-muted-foreground truncate max-w-[150px]">
                      {course.name}
                    </p>
                  </div>
                  <Badge variant="secondary">{count}</Badge>
                </button>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
