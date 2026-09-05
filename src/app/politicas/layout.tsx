'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const policyLinks = [
  { href: '/politicas/privacidad', label: 'Política de Privacidad' },
  { href: '/politicas/terminos', label: 'Términos y Condiciones' },
  { href: '/politicas/devoluciones', label: 'Política de Devoluciones' },
  { href: '/politicas/envio', label: 'Política de Envío' },
  { href: '/politicas/garantia', label: 'Política de Garantía' },
];

export default function PoliticasLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <aside className="lg:w-64 shrink-0">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-8">
              <h2 className="text-lg font-bold mb-4" style={{ color: '#C85A00' }}>
                Políticas
              </h2>
              <nav className="space-y-2">
                {policyLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`block px-3 py-2 rounded-md text-sm transition-colors ${
                      pathname === link.href
                        ? 'text-white font-semibold'
                        : 'text-gray-700 hover:bg-orange-50'
                    }`}
                    style={
                      pathname === link.href
                        ? { backgroundColor: '#C85A00' }
                        : undefined
                    }
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1 min-w-0">{children}</main>
        </div>
      </div>
    </div>
  );
}
