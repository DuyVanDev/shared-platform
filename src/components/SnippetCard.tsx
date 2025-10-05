"use client";

import Link from "next/link";
import { Clock } from "lucide-react";
import { Snippet, users } from "@/lib/static-data";
import { useTranslations } from "use-intl";
import { useAuth } from "@/contexts/AuthContext";
import CreateSnippet from "@/app/snippets/new/page";
import Modal from "./Modal";
import { useState } from "react";
import { deleteSnippet } from "@/services/snippetService";
import { useGlobalToast } from "@/contexts/ToastContext";

interface SnippetCardProps {
  snippet: Snippet;
  onDelete?: (id: string) => void;
  onUpdate?: (snippet: Snippet) => void;
}

export function SnippetCard({ snippet, onDelete, onUpdate }: SnippetCardProps) {
  const { addToast, confirmToast } = useGlobalToast();
  const { user } = useAuth();
  const t = useTranslations("Snippet");
  const isOwner = user?.id && snippet?.authorId?._id === user?.id;
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative h-full rounded-xl border border-gray-200 bg-white p-4 transition-all hover:shadow-md hover:border-green-500/50">
      <Link
        key={snippet._id}
        href={`/snippets/${snippet._id}`}
        className="block"
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-2 mb-3">
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-gray-900 text-lg truncate">
              {snippet.title}
            </h3>
            <p className="text-gray-600 text-sm mt-1 line-clamp-2">
              {snippet.description || "No description"}
            </p>
          </div>
          <span className="ml-2 inline-flex items-center rounded-md bg-gray-100 px-2 py-1 text-xs font-medium text-gray-700">
            {snippet.programmingLanguage}
          </span>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-1 mb-3">
          {snippet?.topics.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center rounded-md border border-gray-300 px-2 py-0.5 text-xs text-gray-600"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between text-xs text-gray-500">
          <span>{snippet?.authorId.name}</span>
          <div className="flex items-center gap-1">
            <Clock className="h-3 w-3 text-gray-400" />
            <span>{new Date(snippet?.createdAt).toLocaleDateString()}</span>
          </div>
        </div>
      </Link>
      {isOwner && (
        <div className="mt-3 flex gap-2">
          <button
            className="px-3 py-1 rounded cursor-pointer bg-yellow-100 text-yellow-700 text-xs font-semibold hover:bg-yellow-200 transition"
            onClick={(e) => {
              e.stopPropagation();
              setIsOpen(true);
            }}
          >
            {t("update")}
          </button>
          <button
            className="px-3 py-1 cursor-pointer rounded bg-red-100 text-red-700 text-xs font-semibold hover:bg-red-200 transition"
            onClick={async (e) => {
              e.stopPropagation();
              confirmToast(
                "Bạn có chắc muốn xóa dữ liệu này không?",
                async () => {
                  try {
                    await deleteSnippet(snippet._id);
                    addToast("Đã xóa thành công!", "success");
                    onDelete?.(snippet._id); // Gọi hàm cha để cập nhật danh sách
                  } catch (err: any) {
                    console.error(err);
                    addToast(err.message || "Xóa thất bại!", "error");
                  }
                }
              );
            }}
          >
            {t("delete")}
          </button>
        </div>
      )}
      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title={t("editSnippet")}
      >
        <CreateSnippet
          initial={snippet}
          edit={true}
          setIsOpen={setIsOpen}
          onUpdate={onUpdate}
        />
      </Modal>
    </div>
  );
}
