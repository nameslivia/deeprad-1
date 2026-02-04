import { Navbar } from '@/components/layout/navbar';

export default function HomeLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="from-muted to-primary/5 min-h-screen bg-gradient-to-tl">
      <Navbar />
      {children}
    </div>
  );
}