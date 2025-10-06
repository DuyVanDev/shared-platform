"use client";
import { useEffect, useMemo, useState } from "react";
import { allTags, languages } from "@/lib/static-data";
import { SnippetCard } from "@/components/SnippetCard";
import Input from "@/components/Input";
import Select from "@/components/Select";
import { useTranslations } from "use-intl";
import Pagination from "@/components/Pagination";
import { fetchSnippets } from "@/services/snippetService";
interface Snippet {
  _id: string;
  title: string;
  programmingLanguage: string;
  topics: string[];
  description?: string;
  slug: string;
  createdAt: string;
  isPublic: boolean;
}
export default function DashboardPage() {
  const t = useTranslations("Snippet");

  const [snippets, setSnippets] = useState<Snippet[]>([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [language, setLanguage] = useState("");
  const [tag, setTag] = useState("");

  const limit = 9;

  useEffect(() => {
    const loadSnippets = async () => {
      setLoading(true);
      try {
        const data = await fetchSnippets({
          page,
          limit,
          q: query,
          language,
          tag,
        });
        setSnippets(data.snippets);
        setTotal(data.total);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadSnippets();
  }, [page, query, language, tag]);

  const totalPages = Math.ceil(total / limit);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState("all");
  const [selectedTag, setSelectedTag] = useState("all");

  const filteredSnippets = useMemo(() => {
    return snippets
      .filter((snippet) => snippet?.isPublic) // chỉ hiện công khai
      .filter((snippet) => {
        const matchesSearch =
          snippet.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          snippet?.description
            ?.toLowerCase()
            .includes(searchQuery.toLowerCase());
        const matchesLanguage =
          selectedLanguage === "all" ||
          snippet?.programmingLanguage === selectedLanguage;
        const matchesTag =
          selectedTag === "all" || snippet.topics.includes(selectedTag);

        return matchesSearch && matchesLanguage && matchesTag;
      });
  }, [searchQuery, selectedLanguage, selectedTag, snippets]);

  const handleDeleteSnippet = (id: string) => {
    setSnippets((prev) => prev.filter((s) => s._id !== id));
  };

  const handleUpdateSnippet = (updated: Snippet) => {
    setSnippets((prev) =>
      prev.map((s) => (s._id === updated._id ? updated : s))
    );
  };

  return (
    <div className="container mx-auto px-4 py-10">
      <h1 className="mb-10 text-4xl font-extrabold text-gray-900 tracking-tight">
        {t("allsnippets")}
      </h1>

      {/* Bộ lọc */}
      <div className="mb-10 rounded-xl bg-white/80 shadow p-6">
        <div className="flex flex-col md:flex-row md:items-center gap-4">
          {/* Ô tìm kiếm */}
          <div className="relative flex-1">
            <Input
              title={""}
              placeholder={t("searchPlaceholder")}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <Select
            options={languages}
            value={selectedLanguage}
            onChange={(e) => setSelectedLanguage(e)}
          />

          <Select
            options={allTags}
            value={selectedTag}
            onChange={(e) => setSelectedTag(e)}
          />
        </div>
      </div>

      {/* Kết quả */}
      {loading ? (
        <div className="grid gap-8 grid-cols-1 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="animate-pulse rounded-xl border border-gray-200 bg-white p-6 shadow-sm"
            >
              <div className="h-5 w-2/3 bg-gray-200 rounded mb-4"></div>
              <div className="h-4 w-1/2 bg-gray-200 rounded mb-3"></div>
              <div className="h-4 w-full bg-gray-100 rounded mb-3"></div>
              <div className="h-4 w-5/6 bg-gray-100 rounded"></div>
              <div className="mt-6 flex gap-2">
                <div className="h-6 w-16 bg-gray-200 rounded-full"></div>
                <div className="h-6 w-12 bg-gray-200 rounded-full"></div>
              </div>
            </div>
          ))}
        </div>
      ) : filteredSnippets?.length === 0 ? (
        <div className="py-16 text-center text-gray-500 text-lg">
          {t("noSnippetsFound")}
        </div>
      ) : (
        <>
          <div className="grid gap-8 grid-cols-1 lg:grid-cols-3">
            {filteredSnippets?.map((snippet) => (
              <SnippetCard
                key={snippet._id}
                snippet={snippet}
                onDelete={handleDeleteSnippet}
                onUpdate={handleUpdateSnippet}
              />
            ))}
          </div>
          <Pagination page={page} setPage={setPage} totalPages={totalPages} />
        </>
      )}
    </div>
  );
}
