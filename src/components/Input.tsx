import { Search } from "lucide-react";

interface InputProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  icon?: React.ReactNode;
  type?: string;
  className?: string;
  required?: boolean;
  title?: string;
}

export default function Input({
  value,
  onChange,
  placeholder = "Nhập nội dung...",
  icon = <Search className="h-5 w-5 text-gray-400" />,
  type = "text",
  className = "",
  required = false,
  title = "",
}: InputProps) {
  return (
    <div className={`relative w-full ${className}`}>
      {title && (
        <label className="block mb-1 text-sm font-semibold text-gray-700">
          {title}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      {/* Icon */}

      {/* Input chính */}
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`w-full rounded-2xl border border-gray-200 bg-gradient-to-r from-white to-gray-50 
          pl-4 pr-4 py-2.5 text-gray-800 placeholder-gray-400 text-sm
          shadow-sm hover:shadow-md 
          focus:border-green-500 focus:ring-2 focus:ring-green-100 focus:outline-none
          transition-all duration-200`}
      />
    </div>
  );
}
