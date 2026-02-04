import NextAuth from 'next-auth';
import { authOptions } from '@/lib/auth';

const handler = (NextAuth as typeof import('next-auth/next').default)(authOptions);

export { handler as GET, handler as POST };
