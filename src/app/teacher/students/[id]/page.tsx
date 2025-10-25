"use client"

import { useEffect, useState, FormEvent } from 'react';
import { useParams } from 'next/navigation';
import { Typography, Card, CardContent, CircularProgress, Alert, Button, TextField } from '@mui/material';
import { toast } from 'sonner';

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

  // State for the completion form
  const [topic, setTopic] = useState('');
  const [duration, setDuration] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showCompletionForm, setShowCompletionForm] = useState(false);

  const fetchCourseDetails = async () => {
    if (courseId) {
      try {
        setLoading(true);
        const response = await fetch(`/api/teachers-student/${courseId}`);
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to fetch course details');
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
      toast.error('Please enter the topic that was taught.');
      return;
    }
    setIsSubmitting(true);
    try {
      const body = {
        courseId,
        topic,
        duration: duration ? Number(duration) : undefined,
      };

      const response = await fetch('/api/classCompleted', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.message || 'Failed to mark class as complete');
      }

      toast.success('Class marked as complete!');
      // Refresh data and reset form
      await fetchCourseDetails();
      setTopic('');
      setDuration('');
      setShowCompletionForm(false);
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) return <div className="flex justify-center items-center h-screen"><CircularProgress /></div>;
  if (error) return <div className="p-4"><Alert severity="error">{error}</Alert></div>;
  if (!data) return <div className="p-4"><Alert severity="info">No course found.</Alert></div>;

  const { course, completedClasses } = data;

  return (
    <div className="p-4 md:p-8">
      <Typography variant="h4" gutterBottom>Course: {course.title}</Typography>
      <Typography variant="h6" color="text.secondary" gutterBottom>Grade: {course.grade}</Typography>

      <Card className="mb-6">
        <CardContent>
          <Typography variant="h6">Student Details</Typography>
          <Typography><strong>Name:</strong> {course.studentId.fullName}</Typography>
          <Typography><strong>Email:</strong> {course.studentId.email}</Typography>
          <Typography><strong>Mobile:</strong> {course.studentId.mobile || 'N/A'}</Typography>
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardContent>
          <Typography variant="h6">Course Status</Typography>
          <Typography className="mb-4">Remaining Classes: {course.noOfClasses}</Typography>
          
          {showCompletionForm ? (
            <form onSubmit={handleMarkComplete} className="space-y-4 mt-4">
              <Typography variant="subtitle1">Complete a Class</Typography>
              <TextField label="Topic Taught" value={topic} onChange={(e) => setTopic(e.target.value)} fullWidth required />
              <TextField label="Duration (in minutes)" type="number" value={duration} onChange={(e) => setDuration(e.target.value)} fullWidth />
              <div className="flex gap-2">
                <Button type="submit" variant="contained" color="primary" disabled={isSubmitting || course.noOfClasses <= 0}>
                  {isSubmitting ? 'Submitting...' : 'Submit Completion'}
                </Button>
                <Button variant="text" onClick={() => setShowCompletionForm(false)}>Cancel</Button>
              </div>
            </form>
          ) : (
            <Button variant="outlined" onClick={() => setShowCompletionForm(true)} disabled={course.noOfClasses <= 0}>
              {course.noOfClasses > 0 ? 'Mark Class as Complete' : 'No Classes Left'}
            </Button>
          )}
        </CardContent>
      </Card>

      <Typography variant="h5" gutterBottom className="mt-8">Completed Class History</Typography>
      <div className="space-y-4">
        {completedClasses.length > 0 ? (
          completedClasses.map((c) => (
            <Card key={c._id} variant="outlined">
              <CardContent>
                <Typography variant="h6">{c.topic}</Typography>
                <Typography color="text.secondary">Date: {new Date(c.completedAt).toLocaleDateString()}</Typography>
                {c.duration && <Typography color="text.secondary">Duration: {c.duration} minutes</Typography>}
              </CardContent>
            </Card>
          ))
        ) : (
          <Alert severity="info">No classes have been marked as complete for this course yet.</Alert>
        )}
      </div>
    </div>
  );
}
