"use client";

import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
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
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import IconButton from "@mui/material/IconButton";
import {
  ArrowLeft,
  Calendar as CalendarIcon,
  Clock,
  BookOpen,
  Video,
  IndianRupee,
  PlusCircle,
  Info,
  Plus,
  Minus,
} from "lucide-react";
import Calendar from "@/components/lightswind/calendar";
import { toast } from "sonner";
import { type RazorpayOptions } from "@/types/global";

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
  completedClasses?: CompletedClass[];
}

interface CompletedClass {
  _id: string;
  topic: string;
  duration?: number;
  completedAt: string;
}

interface ApiResponse {
  course: ICourse;
  completedClasses: CompletedClass[];
}

const statusColors = {
  pending: "bg-yellow-100 text-yellow-700 border-yellow-400",
  completed: "bg-green-100 text-green-700 border-green-400",
  failed: "bg-red-100 text-red-700 border-red-400",
};

export default function CourseDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { data: session } = useSession();
  const courseId = Array.isArray(params.id) ? params.id[0] : (params.id as string);

  const [course, setCourse] = useState<ICourse | null>(null);
  const [completedClasses, setCompletedClasses] = useState<CompletedClass[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [classesToAdd, setClassesToAdd] = useState(1);
  const [calendarMonth, setCalendarMonth] = useState<Date>(new Date());

  useEffect(() => {
    if (!courseId) return;

    const fetchCourseDetails = async () => {
      // Load Razorpay script
      if (!document.getElementById("razorpay-script")) {
        const script = document.createElement("script");
        script.id = "razorpay-script";
        script.src = "https://checkout.razorpay.com/v1/checkout.js";
        script.async = true;
        document.body.appendChild(script);
      }

      setLoading(true);
      try {
        const response = await fetch(`/api/student-courses/${courseId}`);
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Failed to fetch course details.");
        }
        const data: ApiResponse = await response.json();
        if (data.course) {
          setCourse(data.course);
          setCompletedClasses(data.completedClasses || []);
          const completedDays = (data.completedClasses || []).map(c => new Date(c.completedAt));
          if (completedDays.length > 0) {
            setCalendarMonth(completedDays[0]);
          }
        } else {
          notFound();
        }
      } catch (err: any) {
        setError(err.message || "An unknown error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchCourseDetails();
  }, [courseId, notFound]);

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

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setClassesToAdd(1); // Reset on close
  };

  const handleIncrease = () => setClassesToAdd((prev) => prev + 1);
  const handleDecrease = () => setClassesToAdd((prev) => Math.max(1, prev - 1));

  const handleProcessPayment = async () => {
    if (!session?.user) {
      toast.error("You must be logged in to make a payment.");
      return;
    }
    if (!course) {
      toast.error("Course details not found.");
      return;
    }

    setIsProcessing(true);

    try {
      // 1. Create a Razorpay order
      const res = await fetch("/api/razorpay/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: totalPrice, courseId: course._id, classesToAdd }),
      });
      const order = await res.json();

      if (!res.ok) {
        throw new Error(order.message || "Failed to create payment order.");
      }

      // 2. Open Razorpay checkout
      const options: RazorpayOptions = {
        key: process.env.NEXT_PUBLIC_RP_KEY_ID ?? "",
        amount: order.amount,
        currency: order.currency,
        name: "Tuition ED",
        description: `Payment for ${classesToAdd} extra classes for ${course.title}`,
        order_id: order.id,
        handler: async function (response) {
          // 3. Verify payment and update database
          const updateRes = await fetch("/api/student-courses/update-classes", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_signature: response.razorpay_signature,
              courseId: course._id,
              classesAdded: classesToAdd,
            }),
          });

          if (updateRes.ok) {
            toast.success("Payment successful! Your course has been updated.");
            router.refresh(); // Refresh the page to show updated class count
            handleCloseModal();
            setIsProcessing(false);
          } else {
            const errorData = await updateRes.json();
            toast.error(errorData.message || "Failed to update course after payment.");
          }
        },
        prefill: {
          name: session.user.name ?? "",
          email: session.user.email ?? "",
          contact: (session.user as any).mobile || "",
        },
        theme: { color: "#4f46e5" }, // Indigo color
      };

      if (typeof window.Razorpay !== "function") {
        toast.error("Razorpay SDK not loaded. Please try again in a moment.");
        setIsProcessing(false);
        return;
      }

      const rzp = new window.Razorpay(options);
      rzp.open();

    } catch (error: any) {
      toast.error(error.message || "An unexpected error occurred.");
      setIsProcessing(false);
    }
  };

  const totalPrice = course ? classesToAdd * course.perClassPrice : 0;
  const completedDays = completedClasses.map(c => new Date(c.completedAt));
  const completedClassesCount = completedClasses.length;
  const totalClasses = course.noOfClasses;
  const remainingClasses = totalClasses - completedClassesCount;
  const completionPercentage = totalClasses > 0 ? (completedClassesCount / totalClasses) * 100 : 0;

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
            <Button
              variant="contained"
              startIcon={<PlusCircle size={18} />}
              onClick={handleOpenModal}
            >
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
                  <CalendarIcon size={18} className="text-gray-500" />
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
          Classes Status <Info size={16} className="inline ml-1 text-gray-500" />
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
                value={completionPercentage}
                size={120}
                thickness={4}
                sx={{ color: "#22c55e" }} // Green for completed
              />
              <Typography
                variant="h6"
                fontWeight="bold"
                sx={{ position: "relative", top: "-70px" }}
              >
                {completedClassesCount}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: -6 }}>
                Classes Completed
              </Typography>
            </Box>

            <Divider orientation="vertical" flexItem />

            {/* Circle 2 */}
            <Box textAlign="center">
              <CircularProgress
                variant="determinate"
                value={completionPercentage}
                size={120}
                thickness={4}
                sx={{ color: "#f59e0b" }} // Amber for remaining
              />
              <Typography
                variant="h6"
                fontWeight="bold"
                sx={{ position: "relative", top: "-70px" }}
              >
                {remainingClasses}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: -6 }}>
                Remaining Classes
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
            <Calendar
              mode="multiple"
              month={calendarMonth}
              onMonthChange={setCalendarMonth}
              modifiers={{ completed: completedDays }}
              modifiersStyles={{
                completed: { color: "white", backgroundColor: '#22c55e', borderRadius: '50%' },
              }}
            />
          </Paper>
        </Box>
      </Box>

      
      {/* === COMPLETED CLASSES SECTION === */}
      <Box mt={8}>
        <Typography variant="h5" fontWeight="bold" gutterBottom>
          Completed Class History
        </Typography>
        <div className="space-y-4">
          {completedClasses.length > 0 ? (
            completedClasses.map((c) => (
              <Paper key={c._id} variant="outlined" sx={{ p: 2, borderRadius: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="body1" fontWeight="medium">{c.topic}</Typography>
                <Box textAlign="right">
                  <Typography variant="body2" color="text.secondary">
                    {new Date(c.completedAt).toLocaleDateString()}
                  </Typography>
                  {c.duration && <Typography variant="caption" color="text.secondary">{c.duration} mins</Typography>}
                </Box>
              </Paper>
            ))
          ) : (
            <Alert severity="info">No classes have been marked as complete for this course yet.</Alert>
          )}
        </div>
      </Box>



      {/* === ADD CLASSES MODAL === */}
      <Dialog open={isModalOpen} onClose={handleCloseModal} PaperProps={{ sx: { borderRadius: 4 } }}>
        <DialogTitle fontWeight="bold">Add More Classes</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ mb: 3 }}>
            Select how many classes you want to add for "{course.title}".
          </DialogContentText>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 2,
              my: 2,
            }}
          >
            <IconButton onClick={handleDecrease} aria-label="decrease classes">
              <Minus />
            </IconButton>
            <Typography variant="h4" component="span" sx={{ minWidth: "60px", textAlign: "center" }}>
              {classesToAdd}
            </Typography>
            <IconButton onClick={handleIncrease} aria-label="increase classes">
              <Plus />
            </IconButton>
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: '0 24px 20px' }}>
          <Button onClick={handleCloseModal} color="secondary">
            Cancel
          </Button>
          <Button
            onClick={handleProcessPayment}
            variant="contained"
            disabled={isProcessing}
          >
            {isProcessing ? <CircularProgress size={24} color="inherit" /> : `Process (₹${totalPrice.toFixed(2)})`}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
