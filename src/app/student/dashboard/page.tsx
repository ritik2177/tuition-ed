"use client";

import React, { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { Typography, CircularProgress, Box, Alert } from '@mui/material';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, BookCheck, Hourglass, PlusCircle } from 'lucide-react';
import Link from 'next/link';

// Define the type for the demo class data we expect from the API
interface DemoClass {
  _id: string;
  teacherName: string;
  subject: string;
  date: string; // Dates will be strings in JSON
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
}

export default function StudentDashboardPage() {
  const { data: session, status } = useSession();
  const [demoClasses, setDemoClasses] = useState<DemoClass[]>([]);
  const [isLoadingClasses, setIsLoadingClasses] = useState(true);

  useEffect(() => {
    if (status === "authenticated") {
      fetch('/api/students/demo-classes')
        .then(res => res.json())
        .then(data => {
          setDemoClasses(data);
          setIsLoadingClasses(false);
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
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Demos Booked</CardTitle>
            <BookCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{demoClasses.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Confirmed Demos</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{demoClasses.filter(d => d.status === 'confirmed').length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Demos</CardTitle>
            <Hourglass className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{demoClasses.filter(d => d.status === 'pending').length}</div>
          </CardContent>
        </Card>
      </div>
      
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
                <Card key={demo._id} className="flex flex-col">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-lg">{demo.subject}</CardTitle>
                      <Badge variant={demo.status === 'confirmed' ? 'default' : 'secondary'}>
                        {demo.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">with {demo.teacherName || 'TBD'}</p>
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
