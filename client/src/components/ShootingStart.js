'use client';
import React from 'react';
import { ShootingStars } from './ui/shooting-start';
import { StarsBackground } from './ui/stars-background';
import { Globe } from './Globe';
export function ShootingStarsAndStarsBackground() {
  return (
    <div className="h-auto rounded-md bg-neutral-900 flex flex-col items-center justify-center absolute top-0 w-full">
      <Globe />
      <ShootingStars />
      <StarsBackground />
    </div>
  );
}
