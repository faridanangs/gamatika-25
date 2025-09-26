import { TestPageComp } from '@/components/Test';
import { authOptions } from '@/lib/auth';
import { getServerSession } from 'next-auth';

export default async function TestPage() {
  const session = await getServerSession(authOptions);

  return <TestPageComp session={session} />;
}
