"use client";

import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Mail, Phone, Hash } from "lucide-react";
import { Typography, CircularProgress, Alert, Box } from "@mui/material";

// Define the Teacher type, matching the data from your API
export type TeacherFromAPI = {
  _id: string; // MongoDB's default ID field
  name: string;
  email: string;
  mobile?: string; // Make optional if it might not exist
};

export default function TeacherDetailPage({
  params,
}: {
  params: Promise<{ id: string }>; 
}) {
  const { id } = React.use(params); // Unwrap the params Promise
  const [teacher, setTeacher] = useState<TeacherFromAPI | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    const fetchTeacherDetails = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/teachers/${id}`);
        if (!response.ok) {
          throw new Error("Failed to fetch teacher details");
        }
        const data = await response.json();
        setTeacher(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTeacherDetails();
  }, [id]);

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "50vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return <Alert severity="error">{error}</Alert>;
  }

  if (!teacher) {
    return <Alert severity="warning">No teacher data found.</Alert>;
  }

  return (
    <Card className="w-full max-w-2xl mx-auto overflow-hidden shadow-lg">
      <CardHeader className="bg-muted/30 p-6">
        <div className="flex items-center gap-6">
          <Avatar className="h-20 w-20 border-2 border-primary">
            {/* Using a service to generate avatars from initials */}
            <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${teacher.name}`} alt={teacher.name} />
            <AvatarFallback className="text-2xl">{teacher.name.charAt(0).toUpperCase()}</AvatarFallback>
          </Avatar>
          <div>
            <CardTitle className="text-3xl font-bold">{teacher.name}</CardTitle>
            <Typography variant="body2" color="text.secondary" className="flex items-center gap-2 mt-1">
              <Hash className="h-4 w-4" /> {teacher._id}
            </Typography>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        <div className="space-y-1">
          <h3 className="text-lg font-semibold">Contact Information</h3>
          <Separator />
        </div>
        <div className="grid gap-4 text-sm">
          <div className="flex items-center gap-4">
            <Mail className="h-5 w-5 text-muted-foreground" />
            <div className="flex-1">
              <p className="text-xs text-muted-foreground">Email</p>
              <p className="font-medium">{teacher.email}</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Phone className="h-5 w-5 text-muted-foreground" />
            <div className="flex-1">
              <p className="text-xs text-muted-foreground">Mobile Number</p>
              <p className="font-medium">{teacher.mobile || 'Not provided'}</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
