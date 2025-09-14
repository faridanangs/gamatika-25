'use client';
import { useSession } from 'next-auth/react';

export default function TestSession() {
  const { data: session, status } = useSession();
  console.log('Session data:', session, 'Status:', status);

  return <pre>{JSON.stringify(session, null, 2)}</pre>;
}
