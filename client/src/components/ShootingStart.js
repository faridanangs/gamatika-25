'use client';
import React from 'react';
import { ShootingStars } from './ui/shooting-start';
import { StarsBackground } from './ui/stars-background';
import { GlobeDemo } from './Globe';
export function ShootingStarsAndStarsBackgroundDemo() {
  return (
    <div className="h-auto rounded-md bg-neutral-900 flex flex-col items-center justify-center absolute top-0 w-full">
      <GlobeDemo />
      <ShootingStars />
      <StarsBackground />
    </div>
  );
}
