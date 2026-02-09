import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="bg-background grid h-screen items-center pb-8 lg:grid-cols-2 lg:pb-0">
      {/* Left Column: Text Content */}
      <div className="text-center">
        {/* 404 Error Code */}
        <p className="text-muted-foreground text-base font-semibold">404</p>
        
        {/* Main Heading */}
        <h1 className="mt-4 text-3xl font-bold tracking-tight md:text-5xl lg:text-7xl">
          Page not found
        </h1>
        
        {/* Description */}
        <p className="text-muted-foreground mt-6 text-base leading-7">
          Sorry, we couldn't find the page you're looking for.
        </p>
        
        {/* Action Buttons */}
        <div className="mt-10 flex items-center justify-center gap-x-2">
          {/* Primary Button: Navigate to Dashboard */}
          <Button size="lg" asChild>
            <Link href="/dashboard">Go back home</Link>
          </Button>
          
          {/* Secondary Button: Contact Support */}
          <Button size="lg" variant="ghost">
            Contact support <ArrowRight className="ms-2 h-4 w-4" />
          </Button>
        </div>
      </div>
      
      {/* Right Column: Illustration (Hidden on Mobile) */}
      <div className="hidden lg:block">
        {/* 404 Illustration Image */}
        {/* Using Next.js Image component for optimization */}
        {/* priority={false} prevents preloading to avoid unnecessary resource loading */}
        <Image
          src="/404.svg"
          width={300}
          height={400}
          className="w-full h-auto object-contain lg:max-w-2xl"
          alt="not found image"
          priority={false}  // Don't preload this image - only loads when 404 page is visited
        />
      </div>
    </div>
  );
}