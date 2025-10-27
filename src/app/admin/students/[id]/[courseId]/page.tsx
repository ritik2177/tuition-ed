"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Typography,
  Card,
  CardContent,
  CircularProgress,
  Alert,
  Button,
  Divider,
  Box,
  CardHeader,
  Paper,
  Chip,
} from "@mui/material";
import {
  User,
  Mail,
  Phone,
  ArrowLeft,
  MessageSquare,
  BookOpen,
  GraduationCap,
  Hash,
  IndianRupee,
  Calendar,
  Clock,
} from "lucide-react";
import { Edit } from "lucide-react";
import Link from "next/link";
import CourseMessageModal from "@/components/CourseMessageModal";
import { CourseDetails } from "@/types/admin";
import AdminCourseEditModal from "@/components/AdminCourseEditModal";

export default function AdminCourseDetailPage() {
  const params = useParams();
  const router = useRouter();
  const courseId = params.courseId as string;

  const [course, setCourse] = useState<CourseDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isMessageModalOpen, setIsMessageModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false); // New state for edit modal

  useEffect(() => {
    if (!courseId) return;

    const fetchCourseDetails = async () => {
      setLoading(true);
      try {
        const response = await fetch(`/api/course/${courseId}`);
        const data = await response.json();

        if (!response.ok || !data.success) {
          throw new Error(data.message || "Failed to fetch course details.");
        }
        setCourse(data.course);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCourseDetails();
  }, [courseId]);

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "80vh" }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return <Alert severity="error" sx={{ m: 4 }}>{error}</Alert>;
  }

  if (!course) {
    return <Alert severity="info" sx={{ m: 4 }}>No course details found.</Alert>;
  }

  const handleUpdateSuccess = (updatedCourse: CourseDetails) => {
    setCourse(updatedCourse); // Update the course state on the page
  };

  return (
    <Box sx={{ maxWidth: "1200px", mx: "auto", p: 3 }}>
      <Button
        component={Link}
        href="/admin/students"
        startIcon={<ArrowLeft size={16} />}
        sx={{ mb: 3, color: 'text.secondary' }}
      >
        Back to Students
      </Button>

      {/* Header */}
      <Paper
        elevation={0}
        sx={{
          p: { xs: 2, md: 3 },
          mb: 4,
          borderRadius: 3,
          background: (theme) => `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
          color: "primary.contrastText",
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          justifyContent: "space-between",
          alignItems: { xs: "flex-start", sm: "center" },
          gap: 2,
        }}
      >
        <Box>
          <Typography variant="h4" component="h1" fontWeight={700}>
            {course.title}
          </Typography>
          <Typography variant="h6" component="p" sx={{ opacity: 0.8 }}>
            Grade: {course.grade}
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            variant="contained"
            color="info"
            startIcon={<MessageSquare />}
            onClick={() => setIsMessageModalOpen(true)}
          >
            View Messages
          </Button>
          <Button
            variant="contained"
            color="secondary"
            startIcon={<Edit />}
            onClick={() => setIsEditModalOpen(true)} // Open the edit modal
          >
            Edit Course
          </Button>
        </Box>
      </Paper>

      {/* Main Content */}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        {/* Top row of cards */}
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 3 }}>
          {/* Course Details */}
          <Box sx={{ flex: 1, width: '100%' }}>
            <Card variant="outlined" sx={{ borderRadius: 3, height: '100%' }}>
              <CardHeader title="Course Details" />
              <Divider />
              <CardContent sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
                <InfoItem icon={<BookOpen size={20} />} label="Title" value={course.title} />
                <InfoItem icon={<GraduationCap size={20} />} label="Grade" value={course.grade} />
                <InfoItem icon={<Hash size={20} />} label="Remaining Classes" value={course.noOfClasses.toString()} />
                <InfoItem icon={<IndianRupee size={20} />} label="Price/Class" value={`₹${course.perClassPrice.toFixed(2)}`} />
                {course.classTime && <InfoItem icon={<Clock size={20} />} label="Time" value={course.classTime} />}
                {course.classDays && <InfoItem icon={<Calendar size={20} />} label="Days" value={course.classDays.join(', ')} />}
              </CardContent>
            </Card>
          </Box>

          {/* Student Details */}
          <Box sx={{ flex: 1, width: '100%' }}>
            <Card variant="outlined" sx={{ borderRadius: 3, height: '100%' }}>
              <CardHeader title="Student Information" />
              <Divider />
              <CardContent sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
                <InfoItem icon={<User size={20} />} label="Name" value={course.studentId.fullName} />
                <InfoItem icon={<Mail size={20} />} label="Email" value={course.studentId.email} />
                <InfoItem icon={<Phone size={20} />} label="Mobile" value={course.studentId.mobile || "N/A"} />
              </CardContent>
            </Card>
          </Box>

          {/* Teacher Details */}
          <Box sx={{ flex: 1, width: '100%' }}>
            <Card variant="outlined" sx={{ borderRadius: 3, height: '100%' }}>
              <CardHeader title="Teacher Information" />
              <Divider />
              <CardContent sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
                <InfoItem icon={<User size={20} />} label="Name" value={course.teacherId.fullName} />
                <InfoItem icon={<Mail size={20} />} label="Email" value={course.teacherId.email} />
                <InfoItem icon={<Phone size={20} />} label="Mobile" value={course.teacherId.mobile || "N/A"} />
              </CardContent>
            </Card>
          </Box>
        </Box>

        {/* Bottom row for description */}
        {/* Description */}
        <Box>
          <Card variant="outlined" sx={{ borderRadius: 3 }}>
            <CardHeader title="Course Description" />
            <Divider />
            <CardContent>
              <Typography variant="body1" color="text.secondary" sx={{ whiteSpace: 'pre-line' }}>
                {course.description}
              </Typography>
            </CardContent>
          </Card>
        </Box>
      </Box>

      {/* Message Modal */}
      <CourseMessageModal
        courseId={course._id}
        open={isMessageModalOpen}
        onClose={() => setIsMessageModalOpen(false)}
      />

      {/* Admin Course Edit Modal */}
      {course && (
        <AdminCourseEditModal
          open={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          course={course}
          onUpdateSuccess={handleUpdateSuccess}
        />
      )}
    </Box>
  );
}

/**
 * A helper component to display an item with an icon, label, and value.
 */
const InfoItem = ({ icon, label, value }: { icon: React.ReactNode, label: string, value: string }) => (
  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
    <Box sx={{ color: 'text.secondary' }}>{icon}</Box>
    <Box>
      <Typography variant="caption" color="text.secondary" display="block">
        {label}
      </Typography>
      <Typography variant="body1" fontWeight="500">
        {value}
      </Typography>
    </Box>
  </Box>
);