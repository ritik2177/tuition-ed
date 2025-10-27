"use client";

import { useEffect, useState, FormEvent, use } from "react";
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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  IconButton
} from "@mui/material";
import { toast } from "sonner";
import CourseMessageModal from "@/components/CourseMessageModal";
import Link from "next/link";
import {
  User,
  Mail,
  Phone,
  Calendar,
  Clock,
  PlusCircle,
  X,
  ArrowLeft,
  MessageSquare,
} from "lucide-react";

interface Student {
  _id: string;
  fullName: string;
  email: string;
  mobile: string;
}

interface CourseDetails {
  _id: string;
  title: string;
  description: string;
  grade: string;
  noOfClasses: number;
  studentId: Student;
}

interface CompletedClass {
  _id: string;
  topic: string;
  duration?: number;
  completedAt: string;
}

interface ApiResponse {
  course: CourseDetails;
  completedClasses: CompletedClass[];
}

export default function CourseDetailsPage() {
  const { id: courseId } = useParams();

  const [data, setData] = useState<ApiResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Dialog state
  const [topic, setTopic] = useState("");
  const [duration, setDuration] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isMessageModalOpen, setIsMessageModalOpen] = useState(false);

  // Fetch data
  const fetchCourseDetails = async () => {
    if (courseId) {
      try {
        setLoading(true);
        const response = await fetch(`/api/teachers-student/${courseId}`);
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Failed to fetch course details");
        }
        const responseData: ApiResponse = await response.json();
        setData(responseData);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    fetchCourseDetails();
  }, [courseId]);

  const handleMarkComplete = async (e: FormEvent) => {
    e.preventDefault();
    if (!topic) {
      toast.error("Please enter the topic that was taught.");
      return;
    }

    setIsSubmitting(true);
    try {
      const body = {
        courseId,
        topic,
        duration: duration ? Number(duration) : undefined,
      };

      const response = await fetch("/api/classCompleted", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const result = await response.json();
      if (!response.ok)
        throw new Error(result.message || "Failed to mark class as complete");

      toast.success("Class marked as complete!");
      await fetchCourseDetails();
      setTopic("");
      setDuration("");
      setIsDialogOpen(false);
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Loading state
  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "70vh",
        }}
      >
        <CircularProgress size={60} />
      </Box>
    );
  }

  // Error state
  if (error) {
    return (
      <Box sx={{ p: 3, display: "flex", justifyContent: "center" }}>
        <Alert severity="error" sx={{ width: "100%", maxWidth: "md" }}>
          {error}
        </Alert>
      </Box>
    );
  }

  if (!data) {
    return (
      <Box sx={{ p: 3, display: "flex", justifyContent: "center" }}>
        <Alert severity="info" sx={{ width: "100%", maxWidth: "md" }}>
          No course data found.
        </Alert>
      </Box>
    );
  }

  const { course, completedClasses } = data;

  return (
    <Box sx={{ maxWidth: "1200px", mx: "auto" }}>
      <Button
        component={Link}
        href="/teacher/students"
        startIcon={<ArrowLeft size={16} />}
        sx={{
          mb: 3,
          color: 'text.secondary'
        }}
      >
        Back to Students
      </Button>
      {/* Header */}
      <Box
        sx={{
          p: { xs: 2, md: 4 },
          mb: 4,
          borderRadius: 3,
          background: (theme) =>
            `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
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
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2 }}>
          <Button
            variant="contained"
            color="info"
            startIcon={<MessageSquare />}
            onClick={() => setIsMessageModalOpen(true)}
          >
            Message Student
          </Button>
        <Button
          variant="contained"
          color="secondary"
          startIcon={<PlusCircle />}
          onClick={() => setIsDialogOpen(true)}
          disabled={course.noOfClasses <= 0}
          sx={{
            bgcolor: "secondary.main",
            "&:hover": { bgcolor: "secondary.dark" },
            color: "secondary.contrastText",
            px: 3,
            py: 1.5,
            borderRadius: 2,
          }}
        >
          {course.noOfClasses > 0 ? "Mark Class" : "No Classes Left"}
        </Button>
        </Box>
      </Box>

      {/* Layout Grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        {/* Left Column */}
        <div className="md:col-span-5 lg:col-span-4">
           <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 3,
              position: { md: "sticky" },
              top: "6rem",
            }}
          >
            <Card variant="outlined" sx={{ borderRadius: 3 }}>
              <CardHeader title="Student Information" />
              <Divider />
              <CardContent sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                  <User size={20} />
                  <Typography>{course.studentId.fullName}</Typography>
                </Box>
                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                  <Mail size={20} />
                  <Typography>{course.studentId.email}</Typography>
                </Box>
                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                  <Phone size={20} />
                  <Typography>{course.studentId.mobile || "N/A"}</Typography>
                </Box>
              </CardContent>
            </Card>

            <Card variant="outlined" sx={{ borderRadius: 3 }}>
              <CardHeader title="Course Progress" />
              <Divider />
              <CardContent sx={{ textAlign: "center" }}>
                <Typography
                  variant="h2"
                  component="p"
                  fontWeight={700}
                  color="primary"
                >
                  {course.noOfClasses}
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Remaining Classes
                </Typography>
              </CardContent>
            </Card>
          </Box>
        </div>

        {/* Right Column */}
        <div className="md:col-span-7 lg:col-span-8">
          <Card variant="outlined" sx={{ borderRadius: 3 }}>
            <CardHeader title="Completed Class History" />
            <Divider />
            <CardContent>
              {completedClasses.length > 0 ? (
                <Box
                  sx={{
                    position: "relative",
                    pl: 2,
                    "::before": {
                      content: '""',
                      position: "absolute",
                      top: 0,
                      bottom: 0,
                      left: "20px",
                      width: "2px",
                      bgcolor: "divider",
                    },
                  }}
                >
                  {completedClasses.map((c, index) => (
                    <Box
                      key={c._id}
                      sx={{
                        display: "flex",
                        gap: 2,
                        mb:
                          index === completedClasses.length - 1 ? 0 : 3,
                        position: "relative",
                      }}
                    >
                      <Box
                        sx={{
                          position: "absolute",
                          top: "5px",
                          left: "-8px",
                          width: "18px",
                          height: "18px",
                          borderRadius: "50%",
                          bgcolor: "primary.main",
                          border: "3px solid",
                          borderColor: "background.paper",
                          zIndex: 1,
                        }}
                      />
                      <Box sx={{ pl: 3, flex: 1 }}>
                        <Typography variant="subtitle1" fontWeight={600}>
                          {c.topic}
                        </Typography>
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 2,
                            color: "text.secondary",
                            mt: 0.5,
                          }}
                        >
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 0.5,
                            }}
                          >
                            <Calendar size={14} />
                            <Typography variant="caption">
                              {new Date(c.completedAt).toLocaleDateString()}
                            </Typography>
                          </Box>
                          {c.duration && (
                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: 0.5,
                              }}
                            >
                              <Clock size={14} />
                              <Typography variant="caption">
                                {c.duration} minutes
                              </Typography>
                            </Box>
                          )}
                        </Box>
                      </Box>
                    </Box>
                  ))}
                </Box>
              ) : (
                <Alert
                  severity="info"
                  variant="outlined"
                  sx={{ mt: 2 }}
                >
                  No classes have been marked as complete yet.
                </Alert>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Dialog */}
      <Dialog
        open={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle
          sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}
        >
          Complete a Class
          <IconButton onClick={() => setIsDialogOpen(false)}>
            <X size={20} />
          </IconButton>
        </DialogTitle>
        <form onSubmit={handleMarkComplete}>
          <DialogContent>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 3, pt: 1 }}>
              <TextField
                label="Topic Taught"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                fullWidth
                required
                autoFocus
              />
              <TextField
                label="Duration (in minutes)"
                type="number"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                fullWidth
              />
            </Box>
          </DialogContent>
          <DialogActions sx={{ p: 3, pt: 2 }}>
            <Button variant="outlined" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={isSubmitting || course.noOfClasses <= 0}
            >
              {isSubmitting ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                "Submit Completion"
              )}
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* Message Modal */}
      {data && (
        <CourseMessageModal
          courseId={course._id}
          open={isMessageModalOpen}
          onClose={() => setIsMessageModalOpen(false)}
        />
      )}
    </Box>
  );
}
