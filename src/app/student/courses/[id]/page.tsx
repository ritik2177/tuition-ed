"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter, notFound } from "next/navigation";
import {
  CircularProgress,
  Alert,
  Box,
  Button,
  Paper,
  Typography,
  Chip,
  Divider,
} from "@mui/material";
import {
  ArrowLeft,
  Calendar,
  Clock,
  BookOpen,
  Video,
  IndianRupee,
  PlusCircle,
  Info,
} from "lucide-react";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";

interface ICourse {
  _id: string;
  title: string;
  description: string;
  grade: string;
  classTime?: string;
  classDays?: string[];
  noOfClasses: number;
  perClassPrice: number;
  joinLink?: string;
  paymentStatus?: "pending" | "completed" | "failed";
  studentId?: string;
  teacherName?: string;
  teacherId?: string;
  createdAt: string;
  updatedAt: string;
}

const statusColors = {
  pending: "bg-yellow-100 text-yellow-700 border-yellow-400",
  completed: "bg-green-100 text-green-700 border-green-400",
  failed: "bg-red-100 text-red-700 border-red-400",
};

export default function CourseDetailPage() {
  const params = useParams();
  const router = useRouter();
  const courseId = Array.isArray(params.id) ? params.id[0] : (params.id as string);

  const [course, setCourse] = useState<ICourse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!courseId) return;

    const fetchCourseDetails = async () => {
      setLoading(true);
      try {
        const response = await fetch(`/api/student-courses/${courseId}`);
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Failed to fetch course details.");
        }
        const data: ICourse = await response.json();
        if (!data) notFound();
        setCourse(data);
      } catch (err: any) {
        setError(err.message || "An unknown error occurred");
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
    return notFound();
  }

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6 lg:p-8">
      <Button
        startIcon={<ArrowLeft size={16} />}
        onClick={() => router.back()}
        sx={{ mb: 3, textTransform: "none", color: "text.secondary" }}
      >
        Back to Courses
      </Button>

      {/* === CLASS MANAGEMENT BAR === */}
      <Box mb={6}>
        <Paper
          elevation={0}
          variant="outlined"
          sx={{
            p: 2.5,
            borderRadius: 4,
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            alignItems: "center",
            justifyContent: "space-between",
            gap: 2,
          }}
        >
          <Typography variant="h6" fontWeight="medium">
            Manage Your Enrollment
          </Typography>
          <Box display="flex" alignItems="center" gap={3}>
            <Typography variant="body1">
              <span className="font-semibold">{course.noOfClasses}</span> Classes 
            </Typography>
            <Button variant="contained" startIcon={<PlusCircle size={18} />}>
              Add Classes
            </Button>
          </Box>
        </Paper>
      </Box>


      {/* === MAIN COURSE DETAILS SECTION === */}
      <Box sx={{ display: "flex", flexDirection: { xs: "column", md: "row" }, gap: 4 }}>
        {/* Left Section */}
        <Box flex={1}>
          <Paper elevation={0} variant="outlined" sx={{ p: 4, borderRadius: 4 }}>
            <Chip
              label={course.paymentStatus?.toUpperCase() || "PENDING"}
              size="small"
              className={`${statusColors[course.paymentStatus || "pending"]} mb-4`}
            />
            <Typography variant="h3" component="h1" fontWeight="bold" gutterBottom>
              {course.title}
            </Typography>
            <Typography variant="h6" color="text.secondary" gutterBottom>
              {course.grade} Grade
            </Typography>

            <Divider sx={{ my: 3 }} />

            <Typography variant="h5" fontWeight="semibold" gutterBottom>
              Description
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ whiteSpace: "pre-line" }}>
              {course.description}
            </Typography>
          </Paper>
        </Box>

        {/* Right Section */}
        <Box
          flexBasis={{ xs: "100%", md: "35%" }}
          sx={{ position: { md: "sticky" }, top: "6rem", alignSelf: 'flex-start' }}
        >
          <Paper elevation={0} variant="outlined" sx={{ p: 3, borderRadius: 4 }}>
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              Course Details
            </Typography>

            <Box display="flex" flexDirection="column" gap={2} mt={2}>
              <Box display="flex" alignItems="center" gap={1.5}>
                <BookOpen size={18} className="text-gray-500" />
                <Typography variant="body2">{course.noOfClasses} Classes</Typography>
              </Box>

              <Box display="flex" alignItems="center" gap={1.5}>
                <IndianRupee size={18} className="text-gray-500" />
                <Typography variant="body2">
                  ₹{course.perClassPrice.toFixed(2)} per class
                </Typography>
              </Box>

              {course.teacherName && (
                <Box display="flex" alignItems="center" gap={1.5}>
                  <Typography variant="body2" fontWeight="medium">Teacher:</Typography>
                  <Typography variant="body2">{course.teacherName}</Typography>
                </Box>
              )}

              {course.classDays && (
                <Box display="flex" alignItems="center" gap={1.5}>
                  <Calendar size={18} className="text-gray-500" />
                  <Typography variant="body2">{course.classDays?.join(", ")}</Typography>
                </Box>
              )}

              {course.classTime && (
                <Box display="flex" alignItems="center" gap={1.5}>
                  <Clock size={18} className="text-gray-500" />
                  <Typography variant="body2">{course.classTime}</Typography>
                </Box>
              )}
            </Box>

            <Box mt={4} display="flex" flexDirection="column" gap={2}>
              <Button
                {...(course.joinLink ? { href: course.joinLink, target: "_blank" } : {})}
                rel="noopener noreferrer"
                variant="contained"
                color="primary"
                size="large"
                disabled={!course.joinLink}
                startIcon={<Video />}
              >
                Join Class
              </Button>

              <Button
                variant="outlined"
                color="secondary"
                size="large"
                onClick={() => router.push("/student/classroom")}
              >
                Visit Class Room
              </Button>
            </Box>
          </Paper>
        </Box>
      </Box>

      {/* === PROGRESS SECTION === */}
      <Box mt={8}>
        <Typography variant="h5" fontWeight="bold" gutterBottom>
          Today's Progress <Info size={16} className="inline ml-1 text-gray-500" />
        </Typography>

        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            gap: 3,
            alignItems: "stretch", // Use stretch to make children fill the height
          }}
        >
          {/* Left: Two progress circles */}
          <Paper
            elevation={0}
            variant="outlined"
            sx={{
              flex: 1,
              p: 3,
              borderRadius: 4,
              display: "flex",
              justifyContent: "space-around",
              alignItems: "center",
              height: '100%', // Make it fill the container height
            }}
          >
            {/* Circle 1 */}
            <Box textAlign="center">
              <CircularProgress
                variant="determinate"
                value={0}
                size={120}
                thickness={4}
                sx={{ color: "#b3e0ff" }}
              />
              <Typography
                variant="h6"
                fontWeight="bold"
                sx={{ position: "relative", top: "-70px" }}
              >
                0
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: -6 }}>
                Mins Video Watched
              </Typography>
            </Box>

            <Divider orientation="vertical" flexItem />

            {/* Circle 2 */}
            <Box textAlign="center">
              <CircularProgress
                variant="determinate"
                value={0}
                size={120}
                thickness={4}
                sx={{ color: "#c6f6d5" }}
              />
              <Typography
                variant="h6"
                fontWeight="bold"
                sx={{ position: "relative", top: "-70px" }}
              >
                0
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: -6 }}>
                Questions Attempted
              </Typography>
            </Box>
          </Paper>

          {/* Right: Monthly Progress calendar */}
          <Paper
            elevation={0}
            variant="outlined"
            sx={{
              flexBasis: { xs: "100%", md: "40%" },
              p: 3,
              borderRadius: 4,
              textAlign: "center",
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center'
            }}
          >
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              Monthly Progress <Info size={14} className="inline ml-1 text-gray-500" />
            </Typography>
            <DayPicker
              mode="single"
              styles={{
                root: {
                  width: '100%',
                  maxWidth: '280px', // Constrain calendar width
                },
              }}
              month={new Date(2025, 9)} // October 2025
              selected={new Date(2025, 9, 15)}
              modifiers={{
                completed: [new Date(2025, 9, 2), new Date(2025, 9, 3), new Date(2025, 9, 15)],
              }}
              modifiersStyles={{
                completed: { color: "green" },
              }}
            />
          </Paper>
        </Box>
      </Box>
    </div>
  );
}
