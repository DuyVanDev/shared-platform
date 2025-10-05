import { ChevronLeft, ChevronRight } from "lucide-react";

export default function Pagination({
  page,
  totalPages,
  setPage,
}: {
  page: number;
  totalPages: number;
  setPage: (newPage: number) => void;
}) {
  return (
    <nav className="flex justify-center items-center gap-4 mt-10 select-none">
      {/* Prev */}
      <button
        onClick={() => setPage(page - 1)}
        disabled={page <= 1}
        className="flex items-center gap-2 px-4 py-2 rounded-full border border-gray-200 bg-white text-gray-600 font-semibold shadow-sm
          hover:bg-violet-50 hover:text-violet-700 transition-all
          disabled:opacity-40 disabled:cursor-not-allowed"
        aria-label="Previous page"
      >
        <ChevronLeft className="w-5 h-5" />
        {/* <span>Prev</span> */}
      </button>

      {/* Số trang */}
      <span className="px-5 py-2 rounded-full bg-violet-100 text-violet-700 font-bold shadow">
        {page} <span className="mx-1 text-gray-400">/</span> {totalPages || 1}
      </span>

      {/* Next */}
      <button
        onClick={() => setPage(page + 1)}
        disabled={page >= totalPages}
        className="flex items-center gap-2 px-4 py-2 rounded-full border border-gray-200 bg-white text-gray-600 font-semibold shadow-sm
          hover:bg-violet-50 hover:text-violet-700 transition-all
          disabled:opacity-40 disabled:cursor-not-allowed"
        aria-label="Next page"
      >
        {/* <span>Next</span> */}
        <ChevronRight className="w-5 h-5" />
      </button>
    </nav>
  );
}
