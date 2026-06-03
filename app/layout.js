import { Outfit, Space_Grotesk } from 'next/font/google';
import './globals.css';

const outfit = Outfit({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800'],
  variable: '--font-body',
});

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-heading',
});

export const metadata = {
  title: 'AirDosa | AI-Powered Instant Dosa Drone Delivery',
  description:
    'Get piping hot, crispy dosas delivered to your balcony in under 5 minutes. Real-time telemetry, gyroscopic sambar stabilizer, and AI batter fermentation control.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${outfit.variable} ${spaceGrotesk.variable}`}>
      <body>{children}</body>
    </html>
  );
}
