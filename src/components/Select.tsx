import { ChevronDown } from "lucide-react";
import React, { useRef, useEffect } from "react";

interface SelectProps {
  options: string[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  title?: string;
  required?: boolean;
}

export default function Select({
  options,
  value,
  onChange,
  placeholder = "Chọn...",
  className = "",
  title,
  required = false,
}: SelectProps) {
  const [open, setOpen] = React.useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  return (
    <div ref={ref} className={`relative min-w-[200px] ${className}`}>
      {title && (
        <label className="block mb-1 text-sm font-semibold text-gray-700">
          {title}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      {/* Nút chính */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className={`w-full flex items-center justify-between rounded-2xl border border-gray-200 
          bg-gradient-to-r from-white to-gray-50 
          px-4 py-2.5 text-gray-700 text-sm font-medium 
          shadow-sm hover:shadow-md transition-all duration-200 
          focus:border-green-500 focus:ring-2 focus:ring-green-100 focus:outline-none`}
      >
        <span className={`${value ? "text-gray-800" : "text-gray-400"}`}>
          {value || placeholder}
        </span>
        <ChevronDown
          className={`h-4 w-4 text-gray-400 transform transition-transform duration-200 ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* Danh sách lựa chọn */}
      {open && (
        <div
          className="absolute left-0 right-0 mt-2 z-20 overflow-hidden rounded-xl 
          border border-gray-100 bg-white shadow-xl animate-slideDown"
        >
          {options.map((opt) => (
            <button
              key={opt}
              onClick={() => {
                onChange(opt);
                setOpen(false);
              }}
              className={`block w-full text-left px-4 py-2.5 text-sm transition-all duration-150
                ${
                  value === opt
                    ? "bg-green-50 text-green-600 font-semibold"
                    : "text-gray-700 hover:bg-gray-50"
                }`}
            >
              {opt}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
