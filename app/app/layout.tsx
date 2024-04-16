import GoogleAnalytics from '@/components/analytics/GoogleAnalytics';
import { Sidebar } from '@/components/ui/Sidebar';
import { Toaster } from '@/components/ui/sonner';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <GoogleAnalytics />
      <div className="bg-background min-h-screen w-full">
        <Toaster />
        <div className="grid lg:grid-cols-6 min-h-screen w-full">
          <Sidebar />
          <div className="col-span-4 lg:col-span-5 lg:border-l">
            <div className="h-full px-4 py-6 lg:px-8">{children}</div>
          </div>
        </div>
      </div>
    </>
  );
}
