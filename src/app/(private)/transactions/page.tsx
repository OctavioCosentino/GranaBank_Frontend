"use client";

import React, { useState, useEffect, useMemo, useRef, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { AlertCircle } from "lucide-react";
import { SearchBar } from "@/components/search-bar";
import { FilterBar, type FilterOption } from "@/components/filter-bar";
import {
  TransactionCard,
  TransactionSkeleton,
} from "@/components/transaction";
import { EmptyState } from "@/components/feedback/empty-state";
import { useInfiniteTransactionsQuery } from "@/hooks/use-transactions";
import {
  formatTransactionAmount,
  extractTransactions,
} from "@/types/transaction";

type FilterId = "ALL" | "SUS" | "CASH_IN" | "CASH_OUT";

const filterOptions: FilterOption<FilterId>[] = [
  { id: "ALL", label: "Todos" },
  { id: "SUS", label: "Debito Aut." },
  { id: "CASH_IN", label: "Recibido" },
  { id: "CASH_OUT", label: "Enviado" },
];

// Contenido interno que gestiona búsqueda, filtros y scroll infinito con TanStack Query
function TransactionsContent() {
  const searchParams = useSearchParams();
  const shouldFocus = searchParams.get("focus") === "true";

  const [selectedFilter, setSelectedFilter] = useState<FilterId>("ALL");
  const [searchInput, setSearchInput] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  const observerTargetRef = useRef<HTMLDivElement>(null);

  // Debounce de 300ms para evitar llamadas excesivas al escribir en el buscador
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchInput.trim());
    }, 300);
    return () => clearTimeout(timer);
  }, [searchInput]);

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
    error,
    refetch,
  } = useInfiniteTransactionsQuery({
    search: debouncedSearch,
    type: selectedFilter,
  });

  // Aplana de forma resiliente las páginas de transacciones devueltas por el backend
  const transactions = useMemo(() => {
    if (!data?.pages) return [];
    return data.pages.flatMap((page) => extractTransactions(page));
  }, [data]);

  // Observer para disparar la carga de la siguiente página al llegar al fondo del scroll
  useEffect(() => {
    const target = observerTargetRef.current;
    if (!target) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(target);
    return () => observer.disconnect();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const handleSelectFilter = (id: FilterId) => {
    setSelectedFilter(id);
  };

  const handleResetFilters = () => {
    setSelectedFilter("ALL");
    setSearchInput("");
  };

  const isFiltered = selectedFilter !== "ALL" || debouncedSearch.length > 0;

  return (
    <main className="h-[calc(100dvh-72px)] p-5 pb-1 flex flex-col items-center">
      <div className="w-full max-w-[390px] flex flex-col h-full">
        {/* Título de la vista */}
        <div className="shrink-0 pt-2 mb-4">
          <h1 className="text-[24px] font-bold text-[#1A202C] tracking-tight">
            Movimientos
          </h1>
        </div>

        {/* Barra de búsqueda (se enfoca si se navegó desde la lupa de Home) */}
        <div className="shrink-0 mb-4 px-0.5">
          <SearchBar
            autoFocus={shouldFocus}
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
          />
        </div>

        {/* Pastillas de filtro */}
        <div className="shrink-0 mb-4">
          <FilterBar
            options={filterOptions}
            selectedId={selectedFilter}
            onSelect={handleSelectFilter}
          />
        </div>

        {/* Listado de movimientos con scroll vertical independiente */}
        <div className="flex-1 overflow-y-auto min-h-0 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden pb-4 pr-0.5">
          <div className="flex flex-col">
            {isLoading ? (
              <>
                <TransactionSkeleton />
                <TransactionSkeleton />
                <TransactionSkeleton />
                <TransactionSkeleton />
              </>
            ) : isError ? (
              <div className="flex flex-col items-center justify-center p-6 text-center my-auto">
                <div className="w-14 h-14 rounded-full bg-[#E4D2D5]/50 flex items-center justify-center text-[#7A1D2D] mb-3">
                  <AlertCircle className="w-7 h-7 stroke-[2]" />
                </div>
                <span className="text-[16px] font-semibold text-[#1A202C]">
                  No se pudieron cargar los movimientos
                </span>
                <p className="text-[13px] text-[#718096] max-w-[260px] mt-1 mb-4">
                  {error?.message || "Ocurrió un error en el servidor al consultar las transacciones."}
                </p>
                <button
                  type="button"
                  onClick={() => refetch()}
                  className="h-10 px-5 rounded-[14px] bg-[#7A1D2D] text-white text-[14px] font-medium hover:bg-[#661624] active:scale-95 transition-all cursor-pointer shadow-xs"
                >
                  Reintentar
                </button>
              </div>
            ) : transactions.length === 0 ? (
              <EmptyState
                type={isFiltered ? "no-results" : "no-transactions"}
                actionLabel={isFiltered ? "Restablecer filtros" : undefined}
                onAction={isFiltered ? handleResetFilters : undefined}
              />
            ) : (
              <>
                {transactions.map((tx) => (
                  <TransactionCard
                    key={tx.id}
                    type={tx.type}
                    title={tx.title}
                    subtitle={tx.subtitle}
                    amount={formatTransactionAmount(tx.amount, tx.type)}
                  />
                ))}

                {/* Skeletons de apoyo mientras se carga la siguiente página */}
                {isFetchingNextPage && (
                  <>
                    <TransactionSkeleton />
                    <TransactionSkeleton />
                  </>
                )}

                {/* Elemento centinela para detectar el fondo con IntersectionObserver */}
                <div ref={observerTargetRef} className="h-4 w-full" />
              </>
            )}
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
