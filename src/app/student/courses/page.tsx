"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { CircularProgress, Alert, Box } from "@mui/material";

interface ICourse {
  _id: string;
  title: string;
  description: string;
  grade: string;
  classTime: string;
  classDays: string[];
  noOfClasses: number;
  perClassPrice: number;
  studentId: string;
  teacherId: string;
  teacherName?: string;
  paymentStatus?: string;
  classroomLink?: string;
  joinLink?: string;
}

export default function MyCoursesPage() {
  const [courses, setCourses] = useState<ICourse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        // Replace this endpoint with your API route that fetches courses dynamically
        const response = await fetch("/api/student-courses");

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Failed to fetch courses.");
        }

        const data: ICourse[] = await response.json();
        setCourses(data);
      } catch (err: any) {
        setError(err.message || "An unknown error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  if (loading)
    return (
      <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
        <CircularProgress />
      </Box>
    );

  if (error) return <Alert severity="error">{error}</Alert>;

  return (
    <div className="container mx-auto px-4">
      <h1 className="text-4xl font-bold text-center mb-10 text-gwhite">
        Your Enrolled Courses
      </h1>

      <div className="flex w-full gap-4">
        <div className="w-7/12">
          {courses.length > 0 ? (
            <div className="flex flex-col gap-8">
              {courses.map((course) => (
                <Link
                  key={course._id}
                  href={`/student/courses/${course._id}`}
                  className="w-full bg-card rounded-2xl shadow-lg hover:shadow-primary/20 hover:shadow-2xl transition-all duration-300 border border-border flex flex-col md:flex-row overflow-hidden"
                >
                  <div className="flex flex-col justify-between p-8 flex-1">
                    <div>
                      <div className="flex justify-between items-start mb-3">
                        <h2 className="text-3xl font-semibold text-card-foreground">
                          {course.title}
                        </h2>
                        <span
                          className={`px-4 py-1 text-sm font-medium rounded-full ${
                            course.paymentStatus === "completed"
                              ? "bg-green-600/20 text-green-400"
                              : "bg-red-600/20 text-red-400"
                          }`}
                        >
                          {course.paymentStatus || "pending"}
                        </span>
                      </div>

                      <p className="text-muted-foreground mb-4">{course.grade} Grade</p>
                    </div>

                    <div className="mt-6">
                      <div className="grid grid-cols-2 gap-x-8 gap-y-2 text-sm">
                        <p>
                          <span className="font-semibold text-foreground">Teacher:</span>{" "}
                          {course.teacherName || "Not Assigned"}
                        </p>
                        <p>
                          <span className="font-semibold text-foreground">
                            Class Time:
                          </span>{" "}
                          {course.classTime || "N/A"}
                        </p>
                        <p>
                          <span className="font-semibold text-foreground">
                            Class Days:
                          </span>{" "}
                          {course.classDays?.join(", ") || "N/A"}
                        </p>
                        <p>
                          <span className="font-semibold text-foreground">
                            Total Classes:
                          </span>{" "}
                          {course.noOfClasses}
                        </p>
                      </div>
                    </div>

                    <div className="mt-6 border-t border-border pt-4">
                      <p className="text-muted-foreground text-sm line-clamp-2">
                        {course.description}
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <Alert severity="info">You are not enrolled in any courses yet.</Alert>
          )}
        </div>

        {/* Sidebar */}
        <div className="w-4/12 bg-white rounded-2xl p-8 shadow-lg self-start sticky top-24 min-h-screen">
          <h3 className="text-2xl font-bold text-gray-800 mb-6">Your Progress</h3>
          <div className="bg-indigo-50 p-6 rounded-xl mb-6 text-center">
            <img
              src="/courses.jpg"
              alt="Student Illustration"
              className="w-32 mx-auto mb-4"
            />
            <h4 className="font-semibold text-xl text-indigo-800">Keep up the great work!</h4>
            <p className="text-sm text-indigo-600 mt-1">Here's a summary of your learning journey.</p>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-gray-100 p-4 rounded-lg text-center">
              <p className="text-3xl font-bold text-indigo-600">{courses.length}</p>
              <p className="text-sm text-gray-600 mt-1">Total Courses</p>
            </div>
            <div className="bg-gray-100 p-4 rounded-lg text-center">
              <p className="text-3xl font-bold text-green-600">
                {courses.filter(c => c.paymentStatus === 'completed').length}
              </p>
              <p className="text-sm text-gray-600 mt-1">Completed</p>
            </div>
          </div>

          <div>
            <a
              href="/get-a-free-tail"
              className="block w-full text-center py-3 rounded-lg font-semibold transition-all duration-300 bg-purple-600 text-white hover:bg-purple-700"
            >
              Book a Free Demo
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
