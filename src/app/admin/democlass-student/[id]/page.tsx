"use client";

import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Mail, Phone, Hash, User as UserIcon, MapPin, BookOpen, Calendar, Tag, Clock } from "lucide-react";
import { Alert, CircularProgress } from "@mui/material";
import { Badge } from "@/components/ui/badge";

export type DemoClassDetails = {
  _id: string;
  studentId: {
    _id: string;
    fullName: string;
    email: string;
    mobile?: string;
  };
  fatherName?: string;
  city?: string;
  country?: string;
  topic: string;
  subject: string;
  date: string;
  status: "Booked" | "Attended" | "Cancelled";
};

export default function DemoClassDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const [booking, setBooking] = useState<DemoClassDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBookingDetails = async () => {
      try {
        const { id } = await params;
        const response = await fetch(`/api/demoClass/${id}`);
        if (!response.ok) {
          throw new Error("Failed to fetch demo class details");
        }
        const data = await response.json();
        setBooking(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBookingDetails();
  }, [params]);

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

  if (!booking) {
    return <Alert severity="warning">No booking data found.</Alert>;
  }

  const student = booking.studentId;

  return (
    <div className="w-full min-h-screen bg-background p-6">
      {/* Student Details Card */}
      <Card className="w-full shadow-lg border border-border mb-6">
        <CardHeader className="bg-muted/20 p-8 flex flex-col md:flex-row md:items-center gap-6">
          <Avatar className="h-24 w-24 border-2 border-primary">
            <AvatarImage
              src={`https://api.dicebear.com/7.x/initials/svg?seed=${student.fullName}`}
              alt={student.fullName}
            />
            <AvatarFallback className="text-3xl">
              {student.fullName.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div>
            <CardTitle className="text-4xl font-bold">{student.fullName}</CardTitle>
            <p className="text-sm text-muted-foreground flex items-center gap-2 mt-2">
              <Hash className="h-4 w-4" /> <span>{student._id}</span>
            </p>
            <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm">
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
        </CardHeader>
      </Card>

      {/* Demo Class Details Card */}
      <Card className="w-full shadow-lg border border-border">
        <CardHeader>
          <CardTitle className="text-2xl">Demo Class Booking Details</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-6 text-sm">
          <div className="flex items-center gap-3">
            <UserIcon className="h-5 w-5 text-primary" />
            <div>
              <p className="text-muted-foreground">Father's Name</p>
              <p className="font-semibold">{booking.fatherName || "Not provided"}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <MapPin className="h-5 w-5 text-primary" />
            <div>
              <p className="text-muted-foreground">Location</p>
              <p className="font-semibold">{`${booking.city || ""}${booking.city && booking.country ? ", " : ""}${booking.country || ""}` || "Not provided"}</p>
            </div>
          </div>
          <div />
          <div className="flex items-center gap-3">
            <BookOpen className="h-5 w-5 text-primary" />
            <div>
              <p className="text-muted-foreground">Topic</p>
              <p className="font-semibold">{booking.topic}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Tag className="h-5 w-5 text-primary" />
            <div>
              <p className="text-muted-foreground">Subject</p>
              <p className="font-semibold">{booking.subject}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Calendar className="h-5 w-5 text-primary" />
            <div>
              <p className="text-muted-foreground">Booking Date & Time</p>
              <p className="font-semibold">{new Date(booking.date).toLocaleString()}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Clock className="h-5 w-5 text-primary" />
            <div>
              <p className="text-muted-foreground">Status</p>
              <Badge>{booking.status}</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}