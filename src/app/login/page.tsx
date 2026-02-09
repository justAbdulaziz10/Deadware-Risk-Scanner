import type { Metadata } from 'next';
import LoginForm from './LoginForm';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  title: 'Log In | Deadware Risk Scanner',
};

export default function LoginPage() {
  return (
    <>
      <Navbar />
      <main className="pt-20 pb-12 min-h-screen flex items-center justify-center px-4">
        <LoginForm />
      </main>
      <Footer />
    </>
  );
}
