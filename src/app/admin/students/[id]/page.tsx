"use client";

import React, { useEffect, useState } from "react";
import {
  Box,
  Paper,
  Typography,
  CircularProgress,
  Alert,
  Button,
  Divider,
  Avatar,
  Chip,
} from "@mui/material";
import {
  Mail,
  Phone,
  PlusCircle,
  Cake,
  User,
  MapPin,
  GraduationCap,
  Globe,
  ArrowRight,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import CreateCourseForm from "@/components/admin/CreateCourseForm";
import { ICourse } from "@/models/Course";
import Link from "next/link";

export type StudentFromAPI = {
  _id: string;
  name: string;
  email: string;
  mobile?: string;
  dateOfBirth?: string;
  address?: {
    street?: string;
    city?: string;
    state?: string;
    country?: string;
  };
  grade?: string;
  fatherName?: string;
  country?: string;
};

export default function StudentDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const [student, setStudent] = useState<StudentFromAPI | null>(null);
  const [courses, setCourses] = useState<ICourse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const { id } = await params;
      try {
        // Fetch student details and their courses in parallel for efficiency
        const [studentRes, coursesRes] = await Promise.all([
          fetch(`/api/students/${id}`),
          fetch(`/api/students/${id}/my-courses`),
        ]);

        if (!studentRes.ok) throw new Error("Failed to fetch student details");
        if (!coursesRes.ok) throw new Error("Failed to fetch courses");

        setStudent(await studentRes.json());
        setCourses(await coursesRes.json());
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [params, isDialogOpen]); // Re-fetch when a new course is created

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[70vh]">
        <CircularProgress />
      </div>
    );
  }

  if (error) {
    return <Alert severity="error">{error}</Alert>;
  }

  if (!student) {
    return <Alert severity="warning">No student data found.</Alert>;
  }

  const InfoItem = ({ icon, label, value }: { icon: React.ReactNode; label: string; value?: string | null }) => (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, py: 1 }}>
      <Box sx={{ color: 'text.secondary' }}>{icon}</Box>
      <Box>
        <Typography variant="body2" color="text.secondary">{label}</Typography>
        <Typography variant="body1" fontWeight="medium">{value || 'N/A'}</Typography>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ p: { xs: 1, sm: 2, md: 3 } }}>
      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 4 }}>
        {/* Left Column - Student Details */}
        <Box sx={{ flex: '1 1 400px', minWidth: 300 }}>
          <Paper
            elevation={0}
            className="border-2 border-blue-500"
            sx={{ p: 3, borderRadius: 4, bgcolor: '#1f2937', height: '100%' }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, mb: 3 }}>
              <Avatar
                src={`https://api.dicebear.com/7.x/initials/svg?seed=${student.name}`}
                sx={{ width: 80, height: 80, fontSize: '2.5rem' }}
              >
                {student.name.charAt(0).toUpperCase()}
              </Avatar>
              <Box>
                <Typography variant="h4" fontWeight="bold">{student.name}</Typography>
                <Typography variant="body1" color="text.secondary">{student.email}</Typography>
              </Box>
            </Box>
            <Divider sx={{ my: 2 }} />
            <InfoItem icon={<Phone size={20} />} label="Mobile" value={student.mobile} />
            <InfoItem icon={<User size={20} />} label="Father's Name" value={student.fatherName} />
            <InfoItem icon={<Cake size={20} />} label="Date of Birth" value={student.dateOfBirth ? new Date(student.dateOfBirth).toLocaleDateString() : 'N/A'} />
            <InfoItem icon={<GraduationCap size={20} />} label="Grade" value={student.grade} />
            <InfoItem icon={<Globe size={20} />} label="Country" value={student.country} />
            <InfoItem icon={<MapPin size={20} />} label="Address" value={`${student.address?.street || ''} ${student.address?.city || ''} ${student.address?.state || ''}`.trim() || 'N/A'} />
          </Paper>
        </Box>

        {/* Right Column - Courses */}
        <Box sx={{ flex: '2 1 600px' }}>
          <Paper
            elevation={0}
            className="border-2 border-blue-500"
            sx={{ p: 3, borderRadius: 4, bgcolor: '#1f2937' }}
          >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h5" fontWeight="bold">Enrolled Courses</Typography>
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="contained" startIcon={<PlusCircle />}>
                    Create Course
                  </Button>
                </DialogTrigger>
                <DialogContent className="backdrop-blur-3xl sm:max-w-3xl bg-gray-800 text-white border-blue-500">
                  <DialogHeader>
                    <DialogTitle>Create a new course for {student.name}</DialogTitle>
                  </DialogHeader>
                  <CreateCourseForm
                    studentId={student._id}
                    onCourseCreated={() => setIsDialogOpen(false)}
                  />
                </DialogContent>
              </Dialog>
            </Box>
            <Divider sx={{ mb: 3 }} />
            {courses.length > 0 ? (
              <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 3 }}>
                {courses.map((course) => (
                  <Paper
                    key={course._id.toString()}
                    elevation={0}
                    sx={{ p: 2.5, borderRadius: 3, bgcolor: '#374151', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}
                  >
                    <Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <Typography variant="h6" fontWeight="bold">{course.title}</Typography>
                        <Chip
                          label={course.noOfClasses > 0 ? "Running" : "Pending"}
                          size="small"
                          color={course.noOfClasses > 0 ? 'success' : 'warning'}
                        />
                      </Box>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        {course.grade} Grade
                      </Typography>
                      <Divider sx={{ my: 1.5 }} />
                      <Typography variant="body2">
                        <span className="font-semibold">Classes Left:</span> {course.noOfClasses}
                      </Typography>
                      <Typography variant="body2">
                        <span className="font-semibold">Price:</span> ₹{course.perClassPrice}/class
                      </Typography>
                    </Box>
                    <Button
                      component={Link}
                      href={`/admin/students/${student._id}/${course._id}`}
                      variant="outlined"
                      color="secondary"
                      endIcon={<ArrowRight size={16} />}
                      sx={{ mt: 2, width: '100%' }}
                    >
                      View Details
                    </Button>
                  </Paper>
                ))}
              </Box>
            ) : (
              <Alert severity="info" sx={{ bgcolor: 'transparent', border: '1px solid', borderColor: 'info.main' }}>
                This student is not enrolled in any courses yet.
              </Alert>
            )}
          </Paper>
        </Box>
      </Box>
    </Box>
  );
}
