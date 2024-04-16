import GoogleAnalytics from '@/components/analytics/GoogleAnalytics';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <GoogleAnalytics />
      <div className="bg-background min-h-screen w-full">{children}</div>
    </>
  );
}
