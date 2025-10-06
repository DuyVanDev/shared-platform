"use client";

import { useParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import {
  ArrowLeft,
  Copy,
  Check,
  Share2,
  Edit,
  Trash2,
  User,
} from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { useGlobalToast } from "@/contexts/ToastContext";
import { useTranslations } from "use-intl";
import { fetchSnippetById } from "@/services/snippetService";

export default function SnippetView() {
  const t = useTranslations("Snippet");

  const router = useRouter();
  const { user } = useAuth();
  const { addToast } = useGlobalToast();

  const params = useParams();
  const id = params?.id as string;

  const [copied, setCopied] = useState(false);
  const [snippet, setSnippet] = useState<any>(null);
  const [author, setAuthor] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    const loadSnippet = async () => {
      setLoading(true);
      try {
        const data = await fetchSnippetById(id);
        setSnippet(data);
        setAuthor(data.authorId);
      } catch {
        setSnippet(null);
        setAuthor(null);
      } finally {
        setLoading(false);
      }
    };

    loadSnippet();
  }, [id]);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(snippet.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = async () => {
    await navigator.clipboard.writeText(window.location.href);
    addToast(t("SnippetURLcopiedtoclipboard"), "success");
  };

  const handleDelete = async () => {
    addToast("Snippet deleted successfully!", "success");
    router.push("/explore");
  };

  if (loading) {
    return (
      <div className="container mx-auto py-10 text-center text-gray-500">
        <span className="animate-pulse">{t("loading")}</span>
      </div>
    );
  }

  if (!snippet || !author) {
    return (
      <div className="container mx-auto py-10 text-center text-gray-500">
        {t("noSnippetsFound")}
      </div>
    );
  }

  const isOwner = user?.id == snippet.authorId._id;
  const createdDate = new Date(snippet.createdAt).toLocaleDateString();

  return (
    <div className="max-w-4xl mx-auto py-10 px-4">
      <button
        onClick={() => router.back()}
        className="flex items-center text-sm text-gray-600 hover:text-green-600 mb-6 cursor-pointer"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        {t("back")}
      </button>

      <div className="space-y-8">
        {/* --- Header Card --- */}
        <div className="bg-white shadow-xl rounded-2xl p-8 border border-gray-100">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {snippet.title}
              </h1>
              <p className="text-gray-500 mb-3">{snippet.description}</p>
              <div className="flex flex-wrap gap-2 mt-2">
                <span className="px-2 py-1 text-xs rounded bg-green-100 text-green-700 font-semibold">
                  {snippet.programmingLanguage}
                </span>
                {snippet.topics.map((tag: string) => (
                  <span
                    key={tag}
                    className="px-2 py-1 text-xs rounded border text-gray-600"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex gap-2">
              {isOwner && (
                <>
                  <button
                    onClick={() => router.push(`/edit/${snippet._id}`)}
                    className="p-2 border rounded-md hover:bg-yellow-50 transition"
                    title="Sửa"
                  >
                    <Edit className="h-4 w-4 text-yellow-600" />
                  </button>
                  <button
                    onClick={handleDelete}
                    className="p-2 border rounded-md hover:bg-red-50 transition"
                    title="Xóa"
                  >
                    <Trash2 className="h-4 w-4 text-red-600" />
                  </button>
                </>
              )}
              <button
                onClick={handleShare}
                className="p-2 border rounded-md hover:bg-green-50 transition cursor-pointer"
                title={t("share")}
              >
                <Share2 className="h-4 w-4 text-green-600" />
              </button>
            </div>
          </div>

          {/* Info */}
          <div className="mt-6 flex flex-wrap items-center gap-4 text-sm text-gray-500">
            <Link
              href={`/profile/${author.username}`}
              className="flex items-center gap-2 hover:underline text-gray-700"
            >
              <User className="h-4 w-4" />
              <span className="font-medium">{author.name}</span>
            </Link>
            <span>•</span>
            <span>
              {t("createdate")}: {createdDate}
            </span>
            {!snippet.isPublic && (
              <>
                <span>•</span>
                <span className="text-red-500 font-semibold">
                  {t("private")}
                </span>
              </>
            )}
          </div>
        </div>

        {/* --- Code Block --- */}
        <div className="bg-gray-900 shadow-lg rounded-2xl border overflow-hidden">
          <div className="flex items-center justify-between border-b border-gray-800 px-6 py-3">
            <h2 className="text-lg font-semibold text-white">Code</h2>
            <button
              onClick={handleCopy}
              className="cursor-pointer flex items-center gap-2 px-3 py-1.5 text-sm border rounded-md bg-gray-800 text-gray-100 hover:bg-green-700 transition"
            >
              {copied ? (
                <>
                  <Check className="h-4 w-4 text-green-300" />
                  {t("copied")}
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4" />
                  {t("copy")}
                </>
              )}
            </button>
          </div>

          <pre className="overflow-x-auto p-6 text-gray-100 text-sm font-mono rounded-b-2xl bg-gray-900">
            <code>{snippet.code}</code>
          </pre>
        </div>
      </div>
    </div>
  );
}
