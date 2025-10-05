"use client";
import { useAuth } from "@/contexts/AuthContext";
import { useTranslations } from "use-intl";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";
import Input from "@/components/Input";
import { useGlobalToast } from "@/contexts/ToastContext";

export default function LoginPage() {
  const t = useTranslations("Login");
  const router = useRouter();
  const { addToast } = useGlobalToast();
  const [form, setForm] = useState({ email: "", password: "" });
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login } = useAuth();
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;
    setMessage("");

    if (!form.email.trim() || !form.password.trim()) {
      addToast("Vui lòng nhập đầy đủ tài khoản và mật khẩu.", "info");
      return;
    }

    setIsSubmitting(true);

    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    const data = await res.json();
    setIsSubmitting(false);

    if (!res.ok) {
      addToast(t("loginfailed"), "info");

      setMessage(data.error || "Login failed");
    } else {
      addToast(t("loginSuccessful"), "success");
      login(data.token, data.user);
      router.push("/dashboard");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow">
        <h1 className="mb-4 text-2xl font-bold text-center">{t("login")}</h1>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <Input
              placeholder="you@example.com"
              title="Email"
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
          </div>
          <div>
            <Input
              placeholder="••••••••"
              type="password"
              title={t("password")}
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
            />
          </div>
          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full rounded-lg bg-green-600 py-2 font-semibold text-white hover:bg-green-700 transition
              ${isSubmitting ? "opacity-60 cursor-not-allowed" : ""}`}
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
            ) : (
              t("login")
            )}
          </button>
        </form>
        {message && (
          <p className="mt-4 text-center text-sm text-red-600">{message}</p>
        )}
        <p className="mt-4 text-center text-sm text-gray-600">
          {t("noAccount")}{" "}
          <Link href="/register" className="text-green-600 hover:underline">
            {t("register")}
          </Link>
        </p>
      </div>
    </div>
  );
}
