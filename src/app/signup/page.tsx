import type { Metadata } from 'next';
import SignupForm from './SignupForm';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  title: 'Sign Up | Deadware Risk Scanner',
};

export default function SignupPage() {
  return (
    <>
      <Navbar />
      <main className="pt-20 pb-12 min-h-screen flex items-center justify-center px-4">
        <SignupForm />
      </main>
      <Footer />
    </>
  );
}
