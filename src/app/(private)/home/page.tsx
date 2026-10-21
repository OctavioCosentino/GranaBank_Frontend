"use client";

import React, { useState, useEffect, useMemo } from "react";
import { HomeHeader } from "@/components/home-header";
import { CardCarousel, type CardData } from "@/components/card-carousel";
import { TransactionCard, TransactionSkeleton } from "@/components/transaction";
import { EmptyState } from "@/components/feedback/empty-state";
import { AddCardModal } from "@/components/add-card-modal";
import { tokenManager } from "@/lib/token-manager";
import { useCardsQuery } from "@/hooks/use-cards";
import { useRecentTransactionsQuery } from "@/hooks/use-transactions";
import {
  formatTransactionAmount,
  extractTransactions,
} from "@/types/transaction";

// Genera un balance pseudo-aleatorio consistente según el ID de la tarjeta
function generateRandomBalance(id: string): string {
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    hash = (hash << 5) - hash + id.charCodeAt(i);
  }
  const amount = (Math.abs(hash) % 4500) + 350;
  return amount.toLocaleString("es-AR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

// Página principal del usuario (primera pestaña: /home)
export default function HomePage() {
  const [userName, setUserName] = useState("Granate");
  const [isAddCardOpen, setIsAddCardOpen] = useState(false);

  const { data: backendCards = [], isLoading: isLoadingCards } =
    useCardsQuery();
  const { data: recentData, isLoading: isLoadingTransactions } =
    useRecentTransactionsQuery(6);

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

  // Transforma las tarjetas del backend o muestra tarjeta mock apagada si no hay ninguna
  const displayCards: CardData[] = useMemo(() => {
    if (backendCards.length === 0) {
      return [
        {
          id: "empty-muted-card",
          balance: "0,00",
          currency: "USD",
          last4: "••••",
          cardholderName: "SIN TARJETAS ACTIVAS",
          expiryDate: "--/--",
          brand: "mastercard",
          isMuted: true,
        },
      ];
    }

    return backendCards.map((card) => ({
      id: card.id,
      balance: generateRandomBalance(card.id),
      currency: "USD",
      last4: card.last_four,
      cardholderName: card.cardholder,
      expiryDate: card.expiration_date,
      brand: card.last_four.startsWith("4") ? "visa" : "mastercard",
      isMuted: false,
    }));
  }, [backendCards]);

  // Primeros 6 movimientos ordenados cronológicamente desde el más reciente
  const recentTransactions = useMemo(() => {
    if (!recentData) return [];
    const list = extractTransactions(recentData);
    return [...list]
      .sort((a, b) => {
        const timeA = a.created_at ? new Date(a.created_at).getTime() : 0;
        const timeB = b.created_at ? new Date(b.created_at).getTime() : 0;
        return timeB - timeA;
      })
      .slice(0, 6);
  }, [recentData]);

  return (
    <main className="h-[calc(100dvh-72px)] overflow-hidden p-5 pb-1 flex flex-col items-center">
      <div className="w-full max-w-[390px] flex flex-col h-full overflow-hidden">
        {/* Encabezado fijo */}
        <div className="shrink-0">
          <HomeHeader userName={userName} />
        </div>

        {/* Carrusel con tarjetas reales o estado apagado */}
        <div className="shrink-0 mb-4">
          <CardCarousel
            cards={displayCards}
            isLoading={isLoadingCards}
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
            {isLoadingTransactions ? (
              <>
                <TransactionSkeleton />
                <TransactionSkeleton />
                <TransactionSkeleton />
                <TransactionSkeleton />
              </>
            ) : recentTransactions.length === 0 ? (
              <EmptyState type="no-transactions" />
            ) : (
              recentTransactions.map((tx) => (
                <TransactionCard
                  key={tx.id}
                  type={tx.type}
                  title={tx.title}
                  subtitle={tx.subtitle}
                  amount={formatTransactionAmount(tx.amount, tx.type)}
                />
              ))
            )}
          </div>
        </div>
      </div>

      {/* Modal para vincular nueva tarjeta conectada al backend */}
      <AddCardModal
        isOpen={isAddCardOpen}
        onClose={() => setIsAddCardOpen(false)}
      />
    </main>
  );
}
