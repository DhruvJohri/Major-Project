import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { GraduationCap, Loader2, ArrowLeft } from 'lucide-react';
import { UserRole } from '@/types';

export default function LoginPage() {
  const [searchParams] = useSearchParams();
  const [isRegister, setIsRegister] = useState(searchParams.get('mode') === 'register');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState<UserRole>('Student');
  const [department, setDepartment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { login, register, isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated && user) {
      const dashboardPath = {
        Admin: '/admin',
        Teacher: '/teacher',
        Student: '/student',
      }[user.role];
      navigate(dashboardPath, { replace: true });
    }
  }, [isAuthenticated, user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    let success = false;
    if (isRegister) {
      success = await register(name, email, password, role, department);
    } else {
      success = await login(email, password, role);
    }

    if (success) {
      const dashboardPath = {
        Admin: '/admin',
        Teacher: '/teacher',
        Student: '/student',
      }[role];
      navigate(dashboardPath);
    }

    setIsSubmitting(false);
  };

  const departments = ['CSE', 'ECE', 'EEE', 'MECH', 'CIVIL', 'IT'];

  return (
    <div className="min-h-screen flex">
      {/* Left side - Form */}
      <div className="flex-1 flex flex-col justify-center px-4 py-12 sm:px-6 lg:px-20 xl:px-24">
        <div className="mx-auto w-full max-w-sm">
          <div className="mb-8">
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Home
            </Link>
          </div>

          <div className="mb-8">
            <Link to="/" className="flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl gradient-primary">
                <GraduationCap className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold">EduSchedule</span>
            </Link>
            <h2 className="mt-6 text-2xl font-bold tracking-tight">
              {isRegister ? 'Create your account' : 'Sign in to your account'}
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              {isRegister ? (
                <>
                  Already have an account?{' '}
                  <button
                    onClick={() => setIsRegister(false)}
                    className="font-medium text-primary hover:underline"
                  >
                    Sign in
                  </button>
                </>
              ) : (
                <>
                  Don't have an account?{' '}
                  <button
                    onClick={() => setIsRegister(true)}
                    className="font-medium text-primary hover:underline"
                  >
                    Register
                  </button>
                </>
              )}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {isRegister && (
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@school.edu"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="role">Role</Label>
              <Select value={role} onValueChange={(v) => setRole(v as UserRole)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select your role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Admin">Admin</SelectItem>
                  <SelectItem value="Teacher">Teacher</SelectItem>
                  <SelectItem value="Student">Student</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {isRegister && (
              <div className="space-y-2">
                <Label htmlFor="department">Department</Label>
                <Select value={department} onValueChange={setDepartment}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select department" />
                  </SelectTrigger>
                  <SelectContent>
                    {departments.map((dept) => (
                      <SelectItem key={dept} value={dept}>
                        {dept}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {isRegister ? 'Creating Account...' : 'Signing in...'}
                </>
              ) : isRegister ? (
                'Create Account'
              ) : (
                'Sign In'
              )}
            </Button>
          </form>

          {!isRegister && (
            <div className="mt-6 rounded-lg border bg-muted/50 p-4">
              <p className="mb-2 text-sm font-medium">Demo Credentials</p>
              <div className="space-y-1 text-xs text-muted-foreground">
                <p>Admin: admin@school.edu / admin123</p>
                <p>Teacher: teacher@school.edu / teacher123</p>
                <p>Student: student@school.edu / student123</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Right side - Decorative */}
      <div className="hidden lg:block lg:flex-1 relative">
        <div className="absolute inset-0 gradient-hero" />
        <div className="absolute inset-0 flex items-center justify-center p-12">
          <div className="max-w-md text-primary-foreground">
            <GraduationCap className="h-16 w-16 mb-8 opacity-80" />
            <h3 className="text-3xl font-bold mb-4">
              Smart Academic Management
            </h3>
            <p className="text-lg opacity-80">
              Streamline timetables, track attendance, and manage resources with
              our AI-powered platform designed for modern educational institutions.
            </p>
            <div className="mt-8 space-y-3">
              {[
                'Genetic Algorithm Scheduling',
                'QR Code Attendance',
                'Role-Based Access Control',
                'Excel Import/Export',
              ].map((feature) => (
                <div key={feature} className="flex items-center gap-2 opacity-80">
                  <div className="h-1.5 w-1.5 rounded-full bg-primary-foreground" />
                  <span>{feature}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
