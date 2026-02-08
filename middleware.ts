import { updateSession } from '@/lib/supabase/middleware';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  return await updateSession(request);
}

export const config = {
  matcher: [
    // Run on all routes except static files and api/webhooks
    '/((?!_next/static|_next/image|favicon.svg|og-image.png|api/webhooks).*)',
  ],
};
