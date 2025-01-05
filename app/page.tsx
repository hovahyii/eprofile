// Updated page.tsx
"use client";

import { useState } from 'react';
import Builder from '@/components/builder';

export default function Home() {
  return (
    <main className="container mx-auto p-4">
      <Builder />
    </main>
  );
}
