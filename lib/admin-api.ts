import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function requireAdminApi() {
  const session = await getServerSession(authOptions as any);
  if (!session?.user?.isAdmin) {
    return null;
  }
  return session;
}
