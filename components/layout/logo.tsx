import { SunDimIcon } from 'lucide-react';
import Link from 'next/link';
import React from 'react';
import Image from 'next/image';

export default function Logo() {
  return (
    <Link href="/" className="flex font-bold items-center">
      <span className="flex items-center justify-center size-7 lg:size-8 mr-2">
        <Image
          src="/logo.svg"
          alt="Logo"
          width={32}
          height={37}
          className="w-[26px] h-auto lg:w-8"
        />      
      </span>
      <h5 className="text-lg lg:text-xl text-secondary-foreground dark:text-secondary">
        Scholia
      </h5>
    </Link>
  );
}
