import type { Metadata } from 'next';
import './globals.css';
import AuthGate from '@/components/AuthGate';

export const metadata: Metadata = {
  title: 'Puzzle App',
  description: 'A private little jigsaw puzzle game.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <AuthGate>{children}</AuthGate>
      </body>
    </html>
  );
}
