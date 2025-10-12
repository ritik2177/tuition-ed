"use client";

import React from 'react';
import Link from 'next/link';

export default function TeacherLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen">
      <aside className="w-64 bg-gray-900 text-white hidden md:block shadow-lg border-r border-gray-700">
        <div className="p-4 flex items-center justify-center">
          <Link href="/teacher" className="flex items-center">
            <span className="text-lg font-semibold">Teacher Dashboard</span>
          </Link>
        </div>
        <nav className="p-4">
          <Link href="/teacher/dashboard" className="block py-2 px-4 hover:bg-gray-700 rounded">Dashboard</Link>
          <Link href="/teacher/my-classes" className="block py-2 px-4 hover:bg-gray-700 rounded">My Classes</Link>
          <Link href="/teacher/profile" className="block py-2 px-4 hover:bg-gray-700 rounded">Profile</Link>
          <Link href="/teacher/settings" className="block py-2 px-4 hover:bg-gray-700 rounded">Settings</Link>
        </nav>
      </aside>

      <main className="flex-1 p-6 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white overflow-y-auto">
        {children}
      </main>
    </div>
  );
}

