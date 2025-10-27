"use client";

import React, { useEffect, useState } from 'react';
import { useSession } from "next-auth/react";
import { Typography, CircularProgress, Box, Alert } from "@mui/material";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, BookCheck, Hourglass, PlusCircle, BookOpen, Users } from 'lucide-react';
import Link from 'next/link';

// Define the type for the demo class data we expect from the API
interface DemoClass {
  _id: string;
  teacherName: string;
  subject: string;
  date: string; // Dates will be strings in JSON
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
}

// Define the type for the assigned course data
interface AssignedCourse {
  _id: string;
  title: string;
  teacherName: string;
  classTime: string;
  classDays: string;
  joinLink: string;
  classroomLink?: string;
  paymentStatus: 'completed' | 'pending';
}

export default function StudentDashboardPage() {
  const { data: session, status } = useSession();
  const [demoClasses, setDemoClasses] = useState<DemoClass[]>([]);
  const [assignedCourses, setAssignedCourses] = useState<AssignedCourse[]>([]);
  const [isLoadingClasses, setIsLoadingClasses] = useState(true);
  const [isLoadingCourses, setIsLoadingCourses] = useState(true);

  useEffect(() => {
    if (status === "authenticated") {
      fetch('/api/demoClass')
        .then(res => res.json())
        .then(data => {
          setDemoClasses(data || []);
          setIsLoadingClasses(false);
        });

      fetch('/api/student-courses')
        .then(res => res.json())
        .then(data => {
          setAssignedCourses(data || []);
          setIsLoadingCourses(false);
        });
    }
  }, [status]);

  if (status === "loading") {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (status === "unauthenticated") {
    return <Alert severity="error">Access Denied. Please log in to view your dashboard.</Alert>;
  }

  return (
    <div className='w-full space-y-8'>
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <Typography variant="h4" component="h1" gutterBottom>
            Welcome, {session?.user?.fullName || 'Student'}!
          </Typography>
          <p className="text-muted-foreground">Here's a summary of your activities.</p>
        </div>
        <Link href="/get-a-free-tail">
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" />
            Book a New Demo
          </Button>
        </Link>
      </div>

      {/* Stat Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="hover:border-primary/50 transition-colors">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Courses</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{assignedCourses.length}</div>
          </CardContent>
        </Card>
        <Card className="hover:border-primary/50 transition-colors">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Demos Booked</CardTitle>
            <BookCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{demoClasses.length}</div>
          </CardContent>
        </Card>
        <Card className="hover:border-primary/50 transition-colors">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Confirmed Demos</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{demoClasses.filter(d => d.status === 'confirmed').length}</div>
          </CardContent>
        </Card>
        <Card className="hover:border-primary/50 transition-colors">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Demos</CardTitle>
            <Hourglass className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{demoClasses.filter(d => d.status === 'pending').length}</div>
          </CardContent>
        </Card>
      </div>

      {/* Assigned Courses Section */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>My Courses</CardTitle>
          <Link href="/student/courses">
            <Button variant="outline" size="sm">View All Courses</Button>
          </Link>
        </CardHeader>
        <CardContent>
          {isLoadingCourses ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
              <CircularProgress size={24} />
            </Box>
          ) : assignedCourses.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {assignedCourses.slice(0, 3).map((course) => (
                <Card key={course._id} className="flex flex-col bg-card hover:bg-muted/40 transition-colors group">
                  <CardHeader className="pb-4">
                    <CardTitle className="text-lg font-semibold group-hover:text-primary transition-colors">{course.title}</CardTitle>
                    <p className="text-sm text-muted-foreground pt-1">
                      <span className="font-medium">Teacher:</span> {course.teacherName || 'TBD'}
                    </p>
                  </CardHeader>
                  <CardContent className="space-y-3 text-sm">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">{course.classDays || 'Not set'}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">{course.classTime || 'Not set'}</span>
                    </div>
                  </CardContent>
                  <div className="p-6 pt-4 mt-auto flex flex-col sm:flex-row gap-2">
                    <Link href={`/student/courses/${course._id}`} className="w-full">
                      <Button className="w-full" variant="outline">
                        View Dashboard
                      </Button>
                    </Link>
                    {/* <Button asChild variant="secondary" className="w-full" disabled={!course.classroomLink}>
                      <a href={course.classroomLink || '#'} target="_blank" rel="noopener noreferrer">
                        Visit Classroom
                      </a>
                    </Button> */}
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <Alert severity="info">You are not enrolled in any courses yet.</Alert>
          )}
        </CardContent>
      </Card>
      
      {/* Demo Classes Section */}
      <Card>
        <CardHeader>
          <CardTitle>My Demo Classes</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoadingClasses ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
              <CircularProgress size={24} />
            </Box>
          ) : demoClasses.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {demoClasses.map((demo) => (
                <Card key={demo._id} className="flex flex-col bg-gray-50/50 hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-lg">{demo.subject}</CardTitle>
                      <Badge variant={demo.status === 'confirmed' ? 'default' : 'secondary'}>
                        {demo.status}
                      </Badge>
                    </div>
                      <p className="text-sm text-muted-foreground">
                        <span className="font-medium">Teacher:</span> {demo.teacherName || 'TBD'}
                      </p>
                  </CardHeader>
                  <CardContent className="space-y-2 text-sm mt-auto">
                    <div className="flex items-center gap-2"><Calendar className="h-4 w-4 text-muted-foreground" /><span>{new Date(demo.date).toLocaleDateString()}</span></div>
                    <div className="flex items-center gap-2"><Clock className="h-4 w-4 text-muted-foreground" /><span>{new Date(demo.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span></div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Alert severity="info">You have no demo classes booked. Use the button above to book one!</Alert>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
