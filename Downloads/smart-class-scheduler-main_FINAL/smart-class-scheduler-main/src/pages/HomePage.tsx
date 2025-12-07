import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Navbar } from '@/components/layout/Navbar';
import {
  GraduationCap,
  Calendar,
  Users,
  QrCode,
  FileText,
  BarChart3,
  ArrowRight,
  CheckCircle2,
} from 'lucide-react';

const features = [
  {
    icon: Calendar,
    title: 'Smart Timetable Generation',
    description: 'AI-powered genetic algorithm creates optimal schedules, avoiding clashes and balancing teacher workloads.',
  },
  {
    icon: QrCode,
    title: 'QR-Based Attendance',
    description: 'Teachers generate session QR codes, students scan to check in. Real-time tracking and reports.',
  },
  {
    icon: Users,
    title: 'Role-Based Access',
    description: 'Separate dashboards for Admin, Teachers, and Students with appropriate permissions.',
  },
  {
    icon: FileText,
    title: 'Study Materials Hub',
    description: 'Teachers upload course materials, students access organized resources for each course.',
  },
  {
    icon: BarChart3,
    title: 'Analytics & Reports',
    description: 'Track attendance, generate reports, and export data in Excel or PDF formats.',
  },
  {
    icon: GraduationCap,
    title: 'Complete Academic Suite',
    description: 'Manage courses, faculty, rooms, and students all in one integrated platform.',
  },
];

const demoCredentials = [
  { role: 'Admin', email: 'admin@school.edu', password: 'admin123' },
  { role: 'Teacher', email: 'teacher@school.edu', password: 'teacher123' },
  { role: 'Student', email: 'student@school.edu', password: 'student123' },
];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 gradient-hero opacity-5" />
        <div className="container relative px-4 py-24 md:py-32">
          <div className="mx-auto max-w-4xl text-center animate-slide-up">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border bg-card px-4 py-2 text-sm">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-success opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-success" />
              </span>
              AI-Powered Academic Management
            </div>
            <h1 className="mb-6 text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
              Smart Timetable &{' '}
              <span className="text-primary">Classroom Management</span>
            </h1>
            <p className="mb-8 text-lg text-muted-foreground md:text-xl">
              Streamline your institution with intelligent scheduling, QR attendance tracking,
              and comprehensive academic resource management.
            </p>
            <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
              <Button size="lg" asChild>
                <Link to="/login?mode=register">
                  Get Started Free
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <Link to="/login">Sign In</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="border-y bg-card py-24">
        <div className="container px-4">
          <div className="mx-auto mb-16 max-w-2xl text-center">
            <h2 className="mb-4 text-3xl font-bold tracking-tight">
              Everything You Need
            </h2>
            <p className="text-muted-foreground">
              A complete solution for managing academic schedules, attendance, and resources.
            </p>
          </div>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, index) => (
              <div
                key={feature.title}
                className="group rounded-xl border bg-background p-6 transition-all hover:border-primary/50 hover:shadow-lg animate-fade-in"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                  <feature.icon className="h-6 w-6" />
                </div>
                <h3 className="mb-2 text-lg font-semibold">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Demo Credentials Section */}
      <section className="py-24">
        <div className="container px-4">
          <div className="mx-auto max-w-3xl">
            <div className="rounded-2xl border bg-card p-8 md:p-12">
              <div className="mb-8 text-center">
                <h2 className="mb-2 text-2xl font-bold">Try Demo Accounts</h2>
                <p className="text-muted-foreground">
                  Explore different user roles with these demo credentials
                </p>
              </div>
              <div className="grid gap-4 md:grid-cols-3">
                {demoCredentials.map((cred) => (
                  <div
                    key={cred.role}
                    className="rounded-lg border bg-muted/50 p-4"
                  >
                    <div className="mb-3 inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
                      {cred.role}
                    </div>
                    <div className="space-y-1 text-sm">
                      <p>
                        <span className="text-muted-foreground">Email:</span>{' '}
                        <code className="rounded bg-background px-1">{cred.email}</code>
                      </p>
                      <p>
                        <span className="text-muted-foreground">Password:</span>{' '}
                        <code className="rounded bg-background px-1">{cred.password}</code>
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-8 text-center">
                <Button size="lg" asChild>
                  <Link to="/login">
                    Try Demo Now
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="border-t bg-card py-24">
        <div className="container px-4">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="mb-4 text-3xl font-bold tracking-tight">
              Ready to Transform Your Institution?
            </h2>
            <p className="mb-8 text-muted-foreground">
              Join thousands of educational institutions using EduSchedule for smarter management.
            </p>
            <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
              <Button size="lg" asChild>
                <Link to="/login?mode=register">
                  Start Free Trial
                </Link>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <Link to="/contact">Contact Sales</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-12">
        <div className="container px-4">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg gradient-primary">
                <GraduationCap className="h-4 w-4 text-primary-foreground" />
              </div>
              <span className="font-semibold">EduSchedule</span>
            </div>
            <p className="text-sm text-muted-foreground">
              © 2024 EduSchedule. Smart Timetable & Classroom Management.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
