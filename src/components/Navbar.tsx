"use client";

import Link from 'next/link';
import { Youtube, LayoutDashboard, PlusCircle } from 'lucide-react';

export default function Navbar() {
  return (
    <nav className="fixed top-0 w-full z-50 glass border-b px-6 py-4 flex justify-between items-center">
      <Link href="/" className="flex items-center gap-2 text-primary font-bold text-xl tracking-tight">
        <Youtube className="w-8 h-8" />
        <span>YouTube <span className="text-foreground">Summariser</span></span>
      </Link>
      
      <div className="flex gap-6 items-center">
        <Link href="/" className="flex items-center gap-1.5 text-sm font-medium hover:text-primary transition-colors">
          <PlusCircle className="w-4 h-4" />
          New Summary
        </Link>
        <Link href="/dashboard" className="flex items-center gap-1.5 text-sm font-medium hover:text-primary transition-colors">
          <LayoutDashboard className="w-4 h-4" />
          Dashboard
        </Link>
      </div>
    </nav>
  );
}
