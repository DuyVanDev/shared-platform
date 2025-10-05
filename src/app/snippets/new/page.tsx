"use client";

import { useState, FormEvent } from "react";
import { useRouter, useParams } from "next/navigation";
import { languages, allTags, snippets } from "@/lib/static-data";
import { X } from "lucide-react";
import Input from "@/components/Input";
import Select from "@/components/Select";
import { useTranslations } from "use-intl";
import { useGlobalToast } from "@/contexts/ToastContext";
import { createSnippet, updateSnippet } from "@/services/snippetService";
interface CreateSnippetProps {
  initial?: any; // dữ liệu snippet truyền vào (tùy chọn)
  edit?: boolean; // true nếu là sửa
  setIsOpen?: any; // true nếu là sửa
  onUpdate?: (snippet: any) => void; // callback khi cập nhật thành công
}
export default function CreateSnippet({
  initial,
  edit,
  setIsOpen,
  onUpdate,
}: CreateSnippetProps) {
  const t = useTranslations("CreateSnippet");
  const { addToast } = useGlobalToast();
  const router = useRouter();
  const params = useParams();

  // nếu không có props thì fallback sang lấy từ params (dùng trong route gốc)
  const id = params?.id as string | undefined;
  const isEdit = edit || !!id;
  const existingSnippet =
    initial || (isEdit ? snippets.find((s) => s.id === id) : null);

  // State
  const [title, setTitle] = useState(existingSnippet?.title || "");
  const [description, setDescription] = useState(
    existingSnippet?.description || ""
  );
  const [code, setCode] = useState(existingSnippet?.code || "");
  const [language, setLanguage] = useState(
    existingSnippet?.programmingLanguage || ""
  );
  const [selectedTags, setSelectedTags] = useState<string[]>(
    existingSnippet?.topics || []
  );
  const [isPublic, setIsPublic] = useState(
    typeof existingSnippet?.isPublic === "boolean"
      ? existingSnippet.isPublic
      : true
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Submit
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    if (!title.trim()) {
      addToast(t("pleaseentertitle"), "info");
      return;
    }
    if (!language) {
      addToast(t("pleaseselectlanguage"), "info");
      return;
    }
    if (!code.trim()) {
      addToast(t("pleaseentercode"), "info");
      return;
    }

    setIsSubmitting(true);

    const body = {
      title,
      code,
      language,
      topics: selectedTags.map((t) => t.trim()).filter(Boolean),
      description,
      isPublic,
    };

    try {
      const data = isEdit
        ? await updateSnippet(existingSnippet?._id!, body)
        : await createSnippet(body);

      addToast("Cập nhật thành công.", "success");

      if (edit && onUpdate) onUpdate(data);
      ClearForm();
      setIsOpen && setIsOpen(false);
    } catch (err) {
      console.error(err);
      addToast("Có lỗi xảy ra khi lưu snippet.", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const ClearForm = () => {
    setTitle("");
    setDescription("");
    setCode("");
    setLanguage("");
    setSelectedTags([]);
  };
  // Toggle tag
  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  return (
    <div className="max-w-3xl mx-auto py-10 px-4">
      <div className="bg-white shadow rounded-2xl p-6 border border-gray-300">
        <h1 className="text-2xl font-semibold mb-6">
          {isEdit ? t("editSnippet") : t("createSnippet")}
        </h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <div>
            <Input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter a descriptive title"
              title={t("title")}
            />
          </div>

          {/* Description */}
          <div>
            <label
              htmlFor="description"
              className="block text-sm font-semibold mb-2"
            >
              {t("description")}
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe what this snippet does"
              rows={3}
              className="w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none"
            ></textarea>
          </div>

          <div>
            <Select
              title={t("language")}
              required
              value={language}
              onChange={(e) => setLanguage(e)}
              options={languages}
            />
          </div>

          {/* Code */}
          <div>
            <label htmlFor="code" className="block text-sm font-semibold mb-2">
              {t("code")} <span className="text-red-500 ml-1">*</span>
            </label>
            <textarea
              id="code"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="Paste your code here"
              rows={10}
              className="w-full font-mono text-sm rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none"
            ></textarea>
          </div>

          {/* Tags */}
          <div>
            <label className="block text-sm font-semibold mb-2">
              {t("tags")}
            </label>
            <div className="flex flex-wrap gap-2">
              {allTags.map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => toggleTag(tag)}
                  className={`flex items-center px-3 py-1 text-sm rounded-full border transition font-medium ${
                    selectedTags.includes(tag)
                      ? "bg-violet-600 text-white violet-green-600"
                      : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
                  }`}
                >
                  {tag}
                  {selectedTags.includes(tag) && <X className="ml-1 h-4 w-4" />}
                </button>
              ))}
            </div>
          </div>

          {/* Toggle isPublic */}
          <div className="flex items-center gap-3">
            <label className="text-sm font-semibold">{t("public")}</label>
            <button
              type="button"
              className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors duration-200 cursor-pointer ${
                isPublic ? "bg-green-500" : "bg-gray-300"
              }`}
              onClick={() => setIsPublic((v) => !v)}
              aria-pressed={isPublic}
            >
              <span
                className={`bg-white w-5 h-5 rounded-full shadow transform transition-transform duration-200 ${
                  isPublic ? "translate-x-6" : ""
                }`}
              />
            </button>
            <span className="text-xs text-gray-500">
              {isPublic ? t("everyonecansee") : t("onlyyou")}
            </span>
          </div>

          {/* Buttons */}
          <div className="flex gap-3 text-sm">
            <button
              type="submit"
              disabled={isSubmitting}
              className={`flex-1 bg-violet-600 text-white rounded-md py-2 font-medium transition cursor-pointer
                hover:bg-green-700 ${
                  isSubmitting ? "opacity-60 cursor-not-allowed" : ""
                }`}
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center gap-2">
                  <svg
                    className="animate-spin h-5 w-5 text-white"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                      fill="none"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 01-8 8z"
                    />
                  </svg>
                  {t("Processing")}
                </span>
              ) : isEdit ? (
                t("update")
              ) : (
                t("create")
              )}
            </button>
            <button
              type="button"
              disabled={isSubmitting}
              onClick={() =>
                !isEdit ? router.back() : setIsOpen && setIsOpen(false)
              }
              className={`flex-1 border border-gray-300 text-gray-700 rounded-md py-2 font-medium hover:bg-gray-100 transition cursor-pointer
                ${isSubmitting ? "opacity-60 cursor-not-allowed" : ""}`}
            >
              {t("cancel")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
