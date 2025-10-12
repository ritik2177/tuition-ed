'use client';

import React from 'react';
import { useSession, signOut } from 'next-auth/react';

export default function TeacherDashboardPage() {
  const { data: session, status } = useSession();

  if (status === 'loading') {
    return <div>Loading...</div>;
  }

  if (status === 'unauthenticated') {
    return <div>Access Denied. Please log in.</div>;
  }

  return (
    <>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-3xl font-bold">
          Welcome, {session?.user?.fullName || 'Teacher'}!
        </h1>
        <button
          onClick={() => signOut({ callbackUrl: '/' })}
          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
        >
          Logout
        </button>
      </div>
      <p>This is your dashboard where you can manage your classes, profile, and settings.</p>
    </>
  );
}
