"use client";

import React, { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Mail, Phone, Hash, PlusCircle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import CreateCourseForm from "@/components/admin/CreateCourseForm";
import { Alert, CircularProgress } from "@mui/material";
import { ICourse } from "@/models/Course";
import { Badge } from "@/components/ui/badge";

export type StudentFromAPI = {
  _id: string;
  name: string;
  email: string;
  mobile?: string;
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

  return (
    <div className="w-full min-h-screen bg-background p-6">
      <Card className="w-full shadow-lg border border-border">
        {/* Header */}
        <CardHeader className="bg-muted/20 p-8 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="flex items-center gap-6">
            <Avatar className="h-24 w-24 border-2 border-primary">
              <AvatarImage
                src={`https://api.dicebear.com/7.x/initials/svg?seed=${student.name}`}
                alt={student.name}
              />
              <AvatarFallback className="text-3xl">
                {student.name.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-4xl font-bold">{student.name}</CardTitle>
              <p className="text-sm text-muted-foreground flex items-center gap-2 mt-2">
                <Hash className="h-4 w-4" /> <span>{student._id}</span>
              </p>
              <div className="mt-2 flex flex-wrap items-center gap-3 text-sm">
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  {student.email}
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  {student.mobile || "Not provided"}
                </div>
              </div>
            </div>
          </div>

          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="w-fit">
                <PlusCircle className="mr-2 h-5 w-5" /> Create Course
              </Button>
            </DialogTrigger>
            <DialogContent className="backdrop-blur-3xl">
              <DialogHeader>
                <DialogTitle>Create a new course for {student.name}</DialogTitle>
              </DialogHeader>
              <CreateCourseForm
                studentId={student._id}
                onCourseCreated={() => setIsDialogOpen(false)}
              />
            </DialogContent>
          </Dialog>
        </CardHeader>

        {/* Content */}
        <CardContent className="p-8">
          <h3 className="text-2xl font-semibold mb-4">Enrolled Courses</h3>
          <Separator className="mb-6" />

          {courses.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {courses.map((course) => (
                <Card key={course._id.toString()} className="bg-muted/40">
                  <CardHeader className="flex-row items-start justify-between p-4">
                    <div>
                      <CardTitle className="text-lg font-semibold">
                        {course.title}
                      </CardTitle>
                      <CardDescription className="text-xs">
                        {course.grade} Grade
                      </CardDescription>
                    </div>
                    <Badge
                      variant={
                        course.paymentStatus === "completed"
                          ? "default"
                          : "destructive"
                      }
                    >
                      {course.paymentStatus}
                    </Badge>
                  </CardHeader>
                  <CardContent className="p-4 pt-0 text-sm space-y-1">
                    <p>Total Classes: {course.noOfClasses}</p>
                    <p>Price: ${course.perClassPrice}/class</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">
              This student is not enrolled in any courses yet.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
