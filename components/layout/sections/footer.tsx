import Link from 'next/link';
import {
  DribbbleIcon,
  FacebookIcon,
  LinkedinIcon,
  Twitter,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import Logo from '@/components/layout/logo';

export const FooterSection = () => {
  return (
    <footer id="footer" className="container space-y-4 pb-4 lg:pb-8">
      <div className="bg-muted rounded-2xl border p-10">
        <div className="grid grid-cols-2 gap-x-12 gap-y-8 md:grid-cols-4 xl:grid-cols-6">
          <div className="col-span-full space-y-4 xl:col-span-2">
            <Logo />
            <p className="text-muted-foreground">Research, Re-engineered.</p>
          </div>

          <div className="flex flex-col gap-2">
            <h3 className="mb-2 text-lg font-bold">Product</h3>
            <div>
              <Link href="#" className="opacity-60 hover:opacity-100">
                Benefits
              </Link>
            </div>

            <div>
              <Link href="#" className="opacity-60 hover:opacity-100">
                Features
              </Link>
            </div>

            <div>
              <Link href="#" className="opacity-60 hover:opacity-100">
                Services
              </Link>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <h3 className="mb-2 text-lg font-bold">Help</h3>
            <div>
              <Link href="#" className="opacity-60 hover:opacity-100">
                FAQ
              </Link>
            </div>

            <div>
              <Link href="#" className="opacity-60 hover:opacity-100">
                Contact Us
              </Link>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <h3 className="mb-2 text-lg font-bold">Socials</h3>
            <div>
              <Link href="#" className="opacity-60 hover:opacity-100">
                Discord
              </Link>
            </div>

            <div>
              <Link href="#" className="opacity-60 hover:opacity-100">
                Facebook
              </Link>
            </div>

            <div>
              <Link href="#" className="opacity-60 hover:opacity-100">
                Instagram
              </Link>
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-col justify-center gap-4 sm:flex-row!">
        <div className="text-muted-foreground flex items-center justify-center gap-1 text-sm">
          <span>&copy; {new Date().getFullYear()}</span>
          <span>Deeprad. All rights reserved.</span>
          <span className="mx-4">Term Of Service | Privacy Policy</span>
        </div>
      </div>
    </footer>
  );
};
