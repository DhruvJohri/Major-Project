import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  LayoutDashboard,
  BookOpen,
  Users,
  DoorOpen,
  Calendar,
  Bell,
  FileText,
  QrCode,
  ClipboardCheck,
  GraduationCap,
  X,
} from 'lucide-react';

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

const adminLinks = [
  { to: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/admin/courses', label: 'Courses', icon: BookOpen },
  { to: '/admin/faculty', label: 'Faculty', icon: Users },
  { to: '/admin/rooms', label: 'Rooms', icon: DoorOpen },
  { to: '/admin/timetable', label: 'Timetable', icon: Calendar },
  { to: '/admin/notifications', label: 'Notifications', icon: Bell },
];

const teacherLinks = [
  { to: '/teacher', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/teacher/timetable', label: 'My Timetable', icon: Calendar },
  { to: '/teacher/students', label: 'Students', icon: Users },
  { to: '/teacher/materials', label: 'Study Materials', icon: FileText },
  { to: '/teacher/attendance', label: 'Attendance', icon: QrCode },
];

const studentLinks = [
  { to: '/student', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/student/timetable', label: 'My Timetable', icon: Calendar },
  { to: '/student/materials', label: 'Study Materials', icon: FileText },
  { to: '/student/attendance', label: 'Check-in', icon: ClipboardCheck },
];

export function Sidebar({ isOpen = true, onClose }: SidebarProps) {
  const { user } = useAuth();
  const location = useLocation();

  if (!user) return null;

  const links = {
    Admin: adminLinks,
    Teacher: teacherLinks,
    Student: studentLinks,
  }[user.role];

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed left-0 top-16 z-50 h-[calc(100vh-4rem)] w-64 border-r bg-card transition-transform duration-300 lg:translate-x-0',
          isOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div className="flex h-full flex-col">
          {/* Mobile close button */}
          <div className="flex items-center justify-between border-b p-4 lg:hidden">
            <div className="flex items-center gap-2">
              <GraduationCap className="h-5 w-5 text-primary" />
              <span className="font-semibold">EduSchedule</span>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Role badge */}
          <div className="border-b p-4">
            <div className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
              {user.role} Portal
            </div>
          </div>

          {/* Navigation links */}
          <ScrollArea className="flex-1 p-4">
            <nav className="flex flex-col gap-1">
              {links.map((link) => {
                const Icon = link.icon;
                const isActive = location.pathname === link.to;
                
                return (
                  <Link
                    key={link.to}
                    to={link.to}
                    onClick={onClose}
                    className={cn(
                      'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                      isActive
                        ? 'bg-primary text-primary-foreground'
                        : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                    )}
                  >
                    <Icon className="h-5 w-5" />
                    {link.label}
                  </Link>
                );
              })}
            </nav>
          </ScrollArea>

          {/* Footer */}
          <div className="border-t p-4">
            <div className="rounded-lg bg-muted p-3">
              <p className="text-xs text-muted-foreground">
                Logged in as
              </p>
              <p className="truncate text-sm font-medium">{user.name}</p>
              <p className="text-xs text-muted-foreground">{user.department}</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
