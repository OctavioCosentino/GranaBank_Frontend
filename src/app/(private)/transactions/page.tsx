"use client";

import React, { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { SearchBar } from "@/components/search-bar";
import { FilterBar, type FilterOption } from "@/components/filter-bar";
import { TransactionCard, type TransactionType } from "@/components/transaction";

type FilterId = "ALL" | "SUS" | "CASH_IN" | "CASH_OUT";

const filterOptions: FilterOption<FilterId>[] = [
  { id: "ALL", label: "Todos" },
  { id: "SUS", label: "Debito Aut." },
  { id: "CASH_IN", label: "Recibido" },
  { id: "CASH_OUT", label: "Enviado" },
];

interface TransactionItem {
  type: TransactionType;
  title: string;
  subtitle: string;
  amount: string;
}

// Datos de movimientos estáticos para maquetación antes de conectar paginación con el backend
const mockTransactions: TransactionItem[] = [
  {
    type: "SUS",
    title: "Adobe",
    subtitle: "Pago de suscripción",
    amount: "$125",
  },
  {
    type: "CASH_IN",
    title: "José Suárez",
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
    title: "Juan Rodríguez",
    subtitle: "Pago enviado",
    amount: "$95",
  },
  {
    type: "CASH_IN",
    title: "Julio César",
    subtitle: "Pago recibido",
    amount: "$95",
  },
  {
    type: "CASH_OUT",
    title: "Mariano Martinez",
    subtitle: "Pago enviado",
    amount: "$95",
  },
];

// Contenido interno que evalúa el parámetro de foco para la barra de búsqueda
function TransactionsContent() {
  const searchParams = useSearchParams();
  const shouldFocus = searchParams.get("focus") === "true";
  const [selectedFilter, setSelectedFilter] = useState<FilterId>("ALL");

  const displayedTransactions = mockTransactions.filter((item) =>
    selectedFilter === "ALL" ? true : item.type === selectedFilter
  );

  return (
    <main className="h-[calc(100dvh-72px)] p-5 pb-1 flex flex-col items-center">
      <div className="w-full max-w-[390px] flex flex-col h-full">
        {/* Título de la vista */}
        <div className="shrink-0 pt-2 mb-4">
          <h1 className="text-[24px] font-bold text-[#1A202C] tracking-tight">
            Movimientos
          </h1>
        </div>

        {/* Barra de búsqueda (solo se enfoca si se navegó desde la lupa de Home) */}
        <div className="shrink-0 mb-4 px-0.5">
          <SearchBar autoFocus={shouldFocus} />
        </div>

        {/* Pastillas de filtro */}
        <div className="shrink-0 mb-4">
          <FilterBar
            options={filterOptions}
            selectedId={selectedFilter}
            onSelect={setSelectedFilter}
          />
        </div>

        {/* Listado de movimientos con scroll vertical independiente */}
        <div className="flex-1 overflow-y-auto min-h-0 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden pb-4 pr-0.5">
          <div className="flex flex-col">
            {displayedTransactions.map((tx, idx) => (
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
    </main>
  );
}

// Vista de Movimientos envuelta en Suspense para manejar searchParams en Next.js App Router
export default function TransactionsPage() {
  return (
    <Suspense fallback={null}>
      <TransactionsContent />
    </Suspense>
  );
}
