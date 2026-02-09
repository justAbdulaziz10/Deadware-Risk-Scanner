import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const next = searchParams.get('next') ?? '/scanner';

  if (code) {
    const supabase = await createClient();
    if (!supabase) {
      return NextResponse.redirect(`${origin}/login?error=auth`);
    }
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error && data.session) {
      // Ensure profile exists
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        await supabase.from('profiles').upsert({
          id: user.id,
          email: user.email,
        }, { onConflict: 'id' });
      }

      // If GitHub OAuth, pass provider_token so client can save it
      const providerToken = data.session.provider_token;
      if (providerToken) {
        const url = new URL(`${origin}${next}`);
        url.searchParams.set('provider_token', providerToken);
        return NextResponse.redirect(url.toString());
      }

      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  return NextResponse.redirect(`${origin}/login?error=auth`);
}
