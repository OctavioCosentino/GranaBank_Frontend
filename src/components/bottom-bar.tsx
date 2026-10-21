"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { toast } from "sonner";
import { LogoutModal } from "@/components/logout-modal";

// Barra inferior de opciones para la navegación privada
export const BottomBar: React.FC = () => {
  const pathname = usePathname();
  const router = useRouter();
  const [isLogoutOpen, setIsLogoutOpen] = useState(false);

  // Define las pestañas con sus rutas y nombres de referencia
  const tabs = [
    { id: "home", href: "/home" },
    { id: "transactions", href: "/transactions" },
  ];

  // Confirma el cierre de sesión, dispara el toast y redirige al login
  const handleConfirmLogout = () => {
    setIsLogoutOpen(false);
    toast("Sesión cerrada correctamente", {
      description: "Esperamos verte pronto nuevamente.",
      duration: 4000,
      style: {
        background: "#E4D2D5",
        backgroundColor: "#E4D2D5",
        border: "1px solid #000000",
        color: "#1A202C",
      },
    });
    router.push("/");
  };

  return (
    <>
      <nav className="fixed bottom-0 left-0 right-0 z-40 bg-[#FFFFFF] rounded-t-[24px] shadow-[0_-4px_24px_rgba(0,0,0,0.06)] border-t border-[#F0F2F5]">
        <div className="max-w-[420px] mx-auto h-[72px] px-8 flex items-center justify-between">
          {/* Pestaña 1 (Inicio) */}
          <Link
            href={tabs[0].href}
            className={`flex items-center justify-center w-12 h-12 transition-colors cursor-pointer ${
              pathname === tabs[0].href
                ? "text-[#7A1D2D]"
                : "text-[#1A202C] hover:text-[#7A1D2D]"
            }`}
            aria-label="Inicio"
          >
            <svg
              width="27"
              height="29"
              viewBox="0 0 27 29"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M25.3299 8.01658C25.8347 8.42229 26.2433 8.93491 26.5261 9.51752C26.809 10.1001 26.9591 10.7382 26.9657 11.3859L26.9514 22.8282C26.9514 24.3206 26.3586 25.7518 25.3035 26.8072C24.2484 27.8626 22.8173 28.4557 21.3249 28.4561H18.8281C17.3242 28.4561 16.1031 27.2393 16.0959 25.7354V20.5696C16.0959 20.3778 16.0197 20.1938 15.8841 20.0582C15.7485 19.9226 15.5645 19.8464 15.3727 19.8464H11.6289C11.5328 19.8463 11.4377 19.8655 11.3491 19.9026C11.2605 19.9398 11.1802 19.9942 11.1129 20.0627C11.0455 20.1313 10.9925 20.2125 10.957 20.3018C10.9214 20.391 10.904 20.4864 10.9057 20.5825V22.5541C10.8953 22.845 10.7724 23.1205 10.563 23.3225C10.3535 23.5246 10.0739 23.6376 9.78282 23.6376C9.49178 23.6376 9.2121 23.5246 9.00266 23.3225C8.79322 23.1205 8.67036 22.845 8.65997 22.5541V20.5825C8.65997 19.7917 8.97412 19.0332 9.53333 18.474C10.0925 17.9148 10.851 17.6007 11.6418 17.6007H15.3856C16.1745 17.6037 16.9299 17.9192 17.4867 18.4781C18.0434 19.0369 18.356 19.7936 18.356 20.5825V25.7354C18.356 25.998 18.5669 26.209 18.8295 26.209H21.3866C22.2799 26.209 23.1367 25.8542 23.7685 25.2226C24.4004 24.5911 24.7555 23.7345 24.7559 22.8411V11.4117C24.7513 11.0992 24.6774 10.7916 24.5394 10.5112C24.4014 10.2307 24.2028 9.98448 23.958 9.79019L15.3354 2.91387C14.8082 2.47969 14.1465 2.24228 13.4635 2.24228C12.7805 2.24228 12.1188 2.47969 11.5916 2.91387L8.82211 4.98452C8.57519 5.14531 8.27579 5.20473 7.98617 5.15041C7.69656 5.0961 7.43903 4.93223 7.26715 4.69289C7.09527 4.45355 7.02227 4.15716 7.06333 3.86538C7.10439 3.57359 7.25635 3.30886 7.48761 3.12625L10.2183 1.1417C11.138 0.402785 12.2823 0 13.462 0C14.6418 0 15.7861 0.402785 16.7058 1.1417L25.3299 8.01658ZM5.6279 26.1975H11.3677V26.2219C11.6657 26.2219 11.9515 26.3403 12.1622 26.551C12.3729 26.7617 12.4913 27.0475 12.4913 27.3455C12.4913 27.6434 12.3729 27.9292 12.1622 28.1399C11.9515 28.3506 11.6657 28.469 11.3677 28.469H5.6279C4.13597 28.466 2.70604 27.8719 1.65122 26.8168C0.596399 25.7617 0.0026543 24.3316 0 22.8397V11.4117C0.00976914 10.7596 0.166285 10.1181 0.457929 9.53485C0.749572 8.95157 1.16885 8.44146 1.68464 8.04241L2.72068 7.26753C2.95736 7.15593 3.22556 7.13043 3.47903 7.19544C3.7325 7.26044 3.95533 7.41188 4.10908 7.62362C4.26282 7.83536 4.33784 8.09413 4.32119 8.35527C4.30454 8.61641 4.19727 8.86355 4.01788 9.05406L3.00767 9.8031C2.77118 9.99979 2.58057 10.2458 2.4492 10.5239C2.31782 10.8021 2.24886 11.1055 2.24714 11.4131V22.8296C2.25356 23.7232 2.61217 24.5782 3.24512 25.209C3.87808 25.8398 4.73429 26.1941 5.6279 26.1975Z"
                fillRule="evenodd"
                clipRule="evenodd"
                fill="currentColor"
              />
            </svg>
          </Link>

          {/* Pestaña 2 (Movimientos / Documentos) */}
          <Link
            href={tabs[1].href}
            className={`flex items-center justify-center w-12 h-12 transition-colors cursor-pointer ${
              pathname === tabs[1].href
                ? "text-[#7A1D2D]"
                : "text-[#1A202C] hover:text-[#7A1D2D]"
            }`}
            aria-label="Movimientos"
          >
            <svg
              width="27"
              height="31"
              viewBox="0 0 27 31"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M8.52574 23.6579H19.9161C20.5398 23.6579 21.0455 23.1452 21.0455 22.5127C21.0455 21.8803 20.5398 21.3676 19.9161 21.3676H8.51196C7.88822 21.3676 7.38257 21.8803 7.38257 22.5127C7.38257 23.1452 7.88822 23.6579 8.51196 23.6579H8.52574Z"
                fill="currentColor"
              />
              <path
                d="M8.52543 16.9683H19.9158C20.3516 17.0171 20.7765 16.8087 21.0095 16.4321C21.2425 16.0554 21.2425 15.5769 21.0095 15.2002C20.7765 14.8236 20.3516 14.6153 19.9158 14.664H8.51165C7.9323 14.7288 7.49377 15.2251 7.49377 15.8162C7.49377 16.4072 7.9323 16.9035 8.51165 16.9683H8.52543Z"
                fill="currentColor"
              />
              <path
                d="M8.52545 10.2788H12.864C13.4433 10.214 13.8819 9.71767 13.8819 9.12666C13.8819 8.53564 13.4433 8.03926 12.864 7.97449H8.52545C7.94609 8.03926 7.50757 8.53564 7.50757 9.12666C7.50757 9.71767 7.94609 10.214 8.52545 10.2788Z"
                fill="currentColor"
              />
              <path
                d="M19.1997 0H7.67468C2.87475 0 0 2.91882 0 7.82776V22.2229C0 27.1185 2.87475 30.0506 7.67468 30.0506C8.22185 29.9891 8.63601 29.5175 8.63601 28.9561C8.63601 28.3946 8.22185 27.923 7.67468 27.8615C4.00644 27.8615 2.14631 25.9643 2.14631 22.2229V7.82776C2.14631 4.08636 4.00644 2.18912 7.67468 2.18912H19.1997C22.868 2.18912 24.7151 4.08636 24.7151 7.82776V22.2229C24.7151 25.9643 22.868 27.8615 19.1997 27.8615H14.9461C14.399 27.923 13.9848 28.3946 13.9848 28.9561C13.9848 29.5175 14.399 29.9891 14.9461 30.0506H19.2127C24.0257 30.0506 26.8874 27.1185 26.8874 22.2229V7.82776C26.8744 2.93209 23.9996 0 19.1997 0Z"
                fill="currentColor"
              />
            </svg>
          </Link>

          {/* Pestaña 3 (Salir / Logout - abre modal) */}
          <button
            type="button"
            onClick={() => setIsLogoutOpen(true)}
            className="flex items-center justify-center w-12 h-12 text-[#1A202C] hover:text-[#7A1D2D] transition-colors cursor-pointer"
            aria-label="Cerrar sesión"
          >
            <svg
              width="27"
              height="31"
              viewBox="0 0 27 31"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M13.5 4.5H7.5C5.5 4.5 4 6 4 8V23C4 25 5.5 26.5 7.5 26.5H13.5"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M9 15.5H23"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M18 10.5L23 15.5L18 20.5"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>
      </nav>

      {/* Modal de confirmación */}
      <LogoutModal
        isOpen={isLogoutOpen}
        onClose={() => setIsLogoutOpen(false)}
        onConfirm={handleConfirmLogout}
      />
    </>
  );
};
