import { Webhooks } from '@polar-sh/nextjs';
import { createClient } from '@supabase/supabase-js';

// Supabase admin client (service role — bypasses RLS)
function getAdminSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

export const POST = Webhooks({
  webhookSecret: process.env.POLAR_WEBHOOK_SECRET!,

  onSubscriptionActive: async (payload) => {
    const email = payload.data.customer?.email;
    if (!email) return;

    const supabase = getAdminSupabase();
    const productId = payload.data.productId;

    // Determine plan from product ID
    const plan = productId === process.env.NEXT_PUBLIC_POLAR_PRODUCT_ID_TEAM ? 'team' : 'pro';

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
          polar_customer_id: payload.data.customerId,
          polar_subscription_id: payload.data.id,
          updated_at: new Date().toISOString(),
        })
        .eq('id', profiles[0].id);
    }
  },

  onSubscriptionRevoked: async (payload) => {
    const customerId = payload.data.customerId;
    if (!customerId) return;

    const supabase = getAdminSupabase();
    await supabase
      .from('profiles')
      .update({
        plan: 'free',
        updated_at: new Date().toISOString(),
      })
      .eq('polar_customer_id', customerId);
  },

  onSubscriptionCanceled: async (payload) => {
    const customerId = payload.data.customerId;
    if (!customerId) return;

    const supabase = getAdminSupabase();
    await supabase
      .from('profiles')
      .update({
        plan: 'free',
        updated_at: new Date().toISOString(),
      })
      .eq('polar_customer_id', customerId);
  },
});
