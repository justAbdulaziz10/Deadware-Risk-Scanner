import type { Metadata } from 'next';
import { Suspense } from 'react';
import SuccessClient from './SuccessClient';
import Navbar from '@/components/Navbar';
import { Shield } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Payment Successful | Deadware Risk Scanner',
  description: 'Your plan has been activated. Start scanning unlimited dependencies.',
  robots: { index: false, follow: false },
};

function SuccessLoading() {
  return (
    <>
      <Navbar />
      <main className="pt-20 pb-12 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Shield className="w-12 h-12 text-surface-600 mx-auto mb-4 animate-pulse" />
          <p className="text-surface-400">Processing your payment...</p>
        </div>
      </main>
    </>
  );
}

export default function SuccessPage() {
  return (
    <Suspense fallback={<SuccessLoading />}>
      <SuccessClient />
    </Suspense>
  );
}
