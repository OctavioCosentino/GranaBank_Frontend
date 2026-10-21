"use client";

import React, {
  forwardRef,
  useState,
  useRef,
  useEffect,
  useImperativeHandle,
} from "react";

export interface SearchBarProps extends Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "type"
> {
  onSearch?: (value: string) => void;
  containerClassName?: string;
  autoFocus?: boolean;
}

// Barra de búsqueda con icono reactivo y teclado limpio optimizado para móviles (Samsung y Apple)
export const SearchBar = forwardRef<HTMLInputElement, SearchBarProps>(
  (
    {
      placeholder = "Ingresa un nombre o servicio",
      value,
      onChange,
      onSearch,
      autoFocus = false,
      className = "",
      containerClassName = "",
      ...rest
    },
    ref,
  ) => {
    const [internalValue, setInternalValue] = useState("");
    const isControlled = value !== undefined;
    const currentValue = isControlled ? value : internalValue;

    const inputRef = useRef<HTMLInputElement>(null);
    useImperativeHandle(ref, () => inputRef.current as HTMLInputElement);

    // Enfoca automáticamente el input abriendo el teclado al entrar a la página
    useEffect(() => {
      if (autoFocus) {
        const timer = setTimeout(() => {
          inputRef.current?.focus();
        }, 50);
        return () => clearTimeout(timer);
      }
    }, [autoFocus]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (!isControlled) {
        setInternalValue(e.target.value);
      }
      onChange?.(e);
      onSearch?.(e.target.value);
    };

    return (
      <div
        className={`group relative flex items-center w-full h-[52px] px-4 rounded-[20px] bg-white border border-[#E2E8F0] shadow-sm transition-all focus-within:border-[#7A1D2D] focus-within:ring-1 focus-within:ring-inset focus-within:ring-[#7A1D2D] ${containerClassName}`}
      >
        <div className="flex items-center justify-center shrink-0 text-[#A0AEC0] group-focus-within:text-[#7A1D2D] transition-colors mr-3">
          <svg
            width="19"
            height="19"
            viewBox="0 0 19 19"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M8.89342 17.0368C13.3909 17.0368 17.0368 13.3909 17.0368 8.89342C17.0368 4.39593 13.3909 0.75 8.89342 0.75C4.39593 0.75 0.75 4.39593 0.75 8.89342C0.75 13.3909 4.39593 17.0368 8.89342 17.0368Z"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              stroke="currentColor"
            />
            <path
              d="M14.5573 14.9803L17.75 18.1646"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              stroke="currentColor"
            />
          </svg>
        </div>

        <input
          ref={inputRef}
          type="text"
          inputMode="search"
          enterKeyHint="search"
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="none"
          spellCheck={false}
          autoFocus={autoFocus}
          value={currentValue}
          onChange={handleChange}
          placeholder={placeholder}
          className={`w-full bg-transparent text-[15px] text-[#2D3748] placeholder-[#A0AEC0] outline-none font-normal ${className}`}
          {...rest}
        />
      </div>
    );
  },
);

SearchBar.displayName = "SearchBar";
