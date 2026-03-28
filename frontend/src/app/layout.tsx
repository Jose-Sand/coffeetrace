import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'CoffeeTrace - Trazabilidad de Café',
  description: 'Plataforma de trazabilidad blockchain para café de especialidad',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
