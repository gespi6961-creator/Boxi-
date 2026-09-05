'use client';

import { MessageCircle } from 'lucide-react';

const WHATSAPP_NUMBER = '526651423910';

export default function WhatsAppButton() {
  const mensaje = encodeURIComponent('Hola, me interesa información de sus productos. ¿Podrían darme más detalles?');
  const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${mensaje}`;

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 bg-[#25D366] text-white w-14 h-14 rounded-full flex items-center justify-center shadow-lg hover:bg-[#1da851] transition-all hover:scale-110"
      aria-label="Contactar por WhatsApp"
    >
      <MessageCircle className="w-7 h-7" />
    </a>
  );
}
