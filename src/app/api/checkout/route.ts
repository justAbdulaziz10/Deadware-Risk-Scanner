import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const products = searchParams.get('products');

  if (!products) {
    return NextResponse.json({ error: 'Missing products parameter' }, { status: 400 });
  }

  const accessToken = process.env.POLAR_ACCESS_TOKEN;
  if (!accessToken) {
    return NextResponse.json({ error: 'Polar not configured' }, { status: 500 });
  }

  const env = process.env.POLAR_ENVIRONMENT || 'sandbox';
  const baseUrl = env === 'production'
    ? 'https://api.polar.sh'
    : 'https://sandbox-api.polar.sh';

  const successUrl = (process.env.NEXT_PUBLIC_SITE_URL || '') + '/success';

  try {
    const res = await fetch(`${baseUrl}/v1/checkouts/custom/`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        product_id: products,
        success_url: successUrl,
      }),
    });

    if (!res.ok) {
      const text = await res.text();
      return NextResponse.json({ error: text }, { status: res.status });
    }

    const data = await res.json();
    return NextResponse.redirect(data.url);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create checkout' }, { status: 500 });
  }
}
