import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/context/AuthContext";
import { ProtectedRoute } from "@/components/routing/ProtectedRoute";
import { DashboardLayout } from "@/components/layout/DashboardLayout";

import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import ContactPage from "./pages/ContactPage";
import NotFound from "./pages/NotFound";

import AdminDashboard from "./pages/admin/AdminDashboard";
import CourseManagement from "./pages/admin/CourseManagement";
import FacultyManagement from "./pages/admin/FacultyManagement";
import RoomManagement from "./pages/admin/RoomManagement";
import TimetablePage from "./pages/admin/TimetablePage";
import NotificationsPage from "./pages/admin/NotificationsPage";

import TeacherDashboard from "./pages/teacher/TeacherDashboard";
import TeacherTimetable from "./pages/teacher/TeacherTimetable";
import TeacherStudents from "./pages/teacher/TeacherStudents";
import TeacherMaterials from "./pages/teacher/TeacherMaterials";
import TeacherAttendance from "./pages/teacher/TeacherAttendance";

import StudentDashboard from "./pages/student/StudentDashboard";
import StudentTimetable from "./pages/student/StudentTimetable";
import StudentMaterials from "./pages/student/StudentMaterials";
import StudentAttendance from "./pages/student/StudentAttendance";

const queryClient = new QueryClient();

const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/contact" element={<ContactPage />} />

              <Route
                path="/admin"
                element={
                  <ProtectedRoute allowedRoles={["Admin"]}>
                    <DashboardLayout />
                  </ProtectedRoute>
                }
              >
                <Route index element={<AdminDashboard />} />
                <Route path="courses" element={<CourseManagement />} />
                <Route path="faculty" element={<FacultyManagement />} />
                <Route path="rooms" element={<RoomManagement />} />
                <Route path="timetable" element={<TimetablePage />} />
                <Route path="notifications" element={<NotificationsPage />} />
              </Route>

              <Route
                path="/teacher"
                element={
                  <ProtectedRoute allowedRoles={["Teacher"]}>
                    <DashboardLayout />
                  </ProtectedRoute>
                }
              >
                <Route index element={<TeacherDashboard />} />
                <Route path="timetable" element={<TeacherTimetable />} />
                <Route path="students" element={<TeacherStudents />} />
                <Route path="materials" element={<TeacherMaterials />} />
                <Route path="attendance" element={<TeacherAttendance />} />
              </Route>

              <Route
                path="/student"
                element={
                  <ProtectedRoute allowedRoles={["Student"]}>
                    <DashboardLayout />
                  </ProtectedRoute>
                }
              >
                <Route index element={<StudentDashboard />} />
                <Route path="timetable" element={<StudentTimetable />} />
                <Route path="materials" element={<StudentMaterials />} />
                <Route path="attendance" element={<StudentAttendance />} />
              </Route>

              <Route
                path="/attendance/:sessionCode"
                element={
                  <ProtectedRoute allowedRoles={["Student"]}>
                    <DashboardLayout />
                  </ProtectedRoute>
                }
              >
                <Route index element={<StudentAttendance />} />
              </Route>

              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;
