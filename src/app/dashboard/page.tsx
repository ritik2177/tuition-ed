'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';

export default function DashboardRedirectPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'loading') return; // Wait until session is loaded

    if (status === 'unauthenticated') {
      router.replace('/'); // Not logged in, send to home
      return;
    }

    const userRole = session?.user?.role;

    if (userRole === 'admin') {
      router.replace('/admin/dashboard');
    } else if (userRole === 'teacher') {
      router.replace('/teacher/dashboard');
    } else if (userRole === 'student') {
      router.replace('/student/dashboard');
    } else {
      // Fallback for unknown roles or if role is not set
      router.replace('/');
    }
  }, [session, status, router]);

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}><CircularProgress /></Box>
  );
}

