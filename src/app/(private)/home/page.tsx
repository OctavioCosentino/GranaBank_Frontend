"use client";

import React, { useState, useEffect } from "react";
import { HomeHeader } from "@/components/home-header";
import { CardCarousel, type CardData } from "@/components/card-carousel";
import { TransactionCard, type TransactionType } from "@/components/transaction";
import { AddCardModal } from "@/components/add-card-modal";
import { tokenManager } from "@/lib/token-manager";

interface TransactionItem {
  type: TransactionType;
  title: string;
  subtitle: string;
  amount: string;
}

// Tarjetas iniciales para el estado local
const initialCards: CardData[] = [
  {
    id: "card-1",
    balance: "978.85",
    currency: "USD",
    last4: "1234",
    cardholderName: "Soy Granate",
    expiryDate: "02/30",
    brand: "mastercard",
  },
  {
    id: "card-2",
    balance: "1.450.00",
    currency: "USD",
    last4: "8821",
    cardholderName: "Soy Granate",
    expiryDate: "11/28",
    brand: "visa",
  },
];

// Datos de ejemplo limitados a máximo 6 para hidratar luego con el backend
const sampleTransactions: TransactionItem[] = [
  {
    type: "SUS",
    title: "Adobe",
    subtitle: "Pago de suscripción",
    amount: "$125",
  },
  {
    type: "CASH_IN",
    title: "Ronaldo",
    subtitle: "Pago recibido",
    amount: "$95",
  },
  {
    type: "SUS",
    title: "Figma",
    subtitle: "Pago de suscripción",
    amount: "$125",
  },
  {
    type: "CASH_OUT",
    title: "Juan Perez",
    subtitle: "Pago enviado",
    amount: "$95",
  },
  {
    type: "SUS",
    title: "Spotify",
    subtitle: "Pago de suscripción",
    amount: "$12",
  },
  {
    type: "CASH_IN",
    title: "Lucas Gomez",
    subtitle: "Transferencia recibida",
    amount: "$50",
  },
];

// Página principal del usuario (primera pestaña: /home)
export default function HomePage() {
  const [userName, setUserName] = useState("Granate");
  const [cards, setCards] = useState<CardData[]>(initialCards);
  const [isAddCardOpen, setIsAddCardOpen] = useState(false);

  useEffect(() => {
    const profile = tokenManager.getProfile();
    if (profile?.name) {
      const firstName = profile.name.split(" ")[0];
      const timer = setTimeout(() => {
        setUserName(firstName);
      }, 0);
      return () => clearTimeout(timer);
    }
  }, []);

  // Máximo 6 movimientos
  const displayTransactions = sampleTransactions.slice(0, 6);

  const handleAddCard = (newCard: CardData) => {
    setCards((prev) => [...prev, newCard]);
  };

  return (
    <main className="h-[calc(100dvh-72px)] overflow-hidden p-5 pb-1 flex flex-col items-center">
      <div className="w-full max-w-[390px] flex flex-col h-full overflow-hidden">
        {/* Encabezado fijo */}
        <div className="shrink-0">
          <HomeHeader userName={userName} />
        </div>

        {/* Carrusel fijo con modal de nueva tarjeta */}
        <div className="shrink-0 mb-4">
          <CardCarousel
            cards={cards}
            onAddCard={() => setIsAddCardOpen(true)}
          />
        </div>

        {/* Título de sección fijo */}
        <h2 className="shrink-0 text-[20px] font-semibold text-[#1A202C] mb-3">
          Últimos movimientos
        </h2>

        {/* Listado con scroll independiente exclusivo para esta sección */}
        <div className="flex-1 overflow-y-auto min-h-0 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden pb-2 pr-0.5">
          <div className="flex flex-col">
            {displayTransactions.map((tx, idx) => (
              <TransactionCard
                key={idx}
                type={tx.type}
                title={tx.title}
                subtitle={tx.subtitle}
                amount={tx.amount}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Modal para vincular nueva tarjeta */}
      <AddCardModal
        isOpen={isAddCardOpen}
        onClose={() => setIsAddCardOpen(false)}
        onAddCard={handleAddCard}
      />
    </main>
  );
}
