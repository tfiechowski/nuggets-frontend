'use client';

import { Sidebar } from '@/components/ui/Sidebar';
import { Toaster } from '@/components/ui/sonner';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-background min-h-screen">
      <Toaster />
      <div className="grid lg:grid-cols-5 min-h-screen">
        <Sidebar />
        <div className="col-span-3 lg:col-span-4 lg:border-l">
          <div className="h-full px-4 py-6 lg:px-8">{children}</div>
        </div>
      </div>
    </div>
  );
}
