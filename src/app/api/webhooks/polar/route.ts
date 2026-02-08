import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { createHmac, timingSafeEqual } from 'crypto';

function getAdminSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

function verifyWebhookSignature(body: string, signature: string, secret: string): boolean {
  try {
    const hmac = createHmac('sha256', secret);
    hmac.update(body);
    const digest = hmac.digest('hex');
    return timingSafeEqual(Buffer.from(digest), Buffer.from(signature));
  } catch {
    return false;
  }
}

async function updatePlan(email: string, plan: string, customerId: string, subscriptionId: string) {
  const supabase = getAdminSupabase();
  const { data: profiles } = await supabase
    .from('profiles')
    .select('id')
    .eq('email', email)
    .limit(1);

  if (profiles && profiles.length > 0) {
    await supabase
      .from('profiles')
      .update({
        plan,
        polar_customer_id: customerId,
        polar_subscription_id: subscriptionId,
        updated_at: new Date().toISOString(),
      })
      .eq('id', profiles[0].id);
  }
}

async function downgradePlan(customerId: string) {
  const supabase = getAdminSupabase();
  await supabase
    .from('profiles')
    .update({
      plan: 'free',
      updated_at: new Date().toISOString(),
    })
    .eq('polar_customer_id', customerId);
}

export async function POST(request: NextRequest) {
  const webhookSecret = process.env.POLAR_WEBHOOK_SECRET;
  if (!webhookSecret) {
    return NextResponse.json({ error: 'Webhook not configured' }, { status: 500 });
  }

  const body = await request.text();
  const signature = request.headers.get('webhook-signature') || request.headers.get('x-polar-signature') || '';

  if (!verifyWebhookSignature(body, signature, webhookSecret)) {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
  }

  const payload = JSON.parse(body);
  const event = payload.type || payload.event;

  try {
    if (event === 'subscription.active' || event === 'subscription.updated') {
      const email = payload.data?.customer?.email;
      if (!email) return NextResponse.json({ received: true });

      const productId = payload.data?.productId || payload.data?.product_id;
      const plan = productId === process.env.NEXT_PUBLIC_POLAR_PRODUCT_ID_TEAM ? 'team' : 'pro';
      const customerId = payload.data?.customerId || payload.data?.customer_id || '';
      const subscriptionId = payload.data?.id || '';

      await updatePlan(email, plan, customerId, subscriptionId);
    }

    if (event === 'subscription.revoked' || event === 'subscription.canceled') {
      const customerId = payload.data?.customerId || payload.data?.customer_id;
      if (customerId) {
        await downgradePlan(customerId);
      }
    }

    return NextResponse.json({ received: true });
  } catch {
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 });
  }
}
