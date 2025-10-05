"use client";
import { useTranslations } from "use-intl";
import Link from "next/link";
import { useState } from "react";
import { useGlobalToast } from "@/contexts/ToastContext";
import Input from "@/components/Input";

function validateEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export default function RegisterPage() {
  const t = useTranslations("Register");
  const { addToast } = useGlobalToast();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirm: "",
  });
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");

    // Validate các trường
    if (!form.name.trim()) {
      addToast(t("pleaseEnterUsername"), "info");
      return;
    }
    if (!form.email.trim()) {
      addToast(t("pleaseEnterEmail"), "info");
      return;
    }
    if (!validateEmail(form.email)) {
      addToast(t("pleaseEnterValidEmail"), "info");
      return;
    }
    if (!form.password) {
      addToast(t("pleaseEnterPassword"), "info");
      return;
    }
    if (form.password.length < 6) {
      addToast(t("passwordlengthvalidate"), "info");
      return;
    }
    if (form.password !== form.confirm) {
      addToast(t("passwordsDoNotMatch"), "info");
      return;
    }

    setIsSubmitting(true);

    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: form.name,
        email: form.email,
        password: form.password,
      }),
    });

    const data = await res.json();

    console.log(data);
    setIsSubmitting(false);

    if (!res.ok) {
      addToast(data?.error, "error");
    } else {
      addToast(t("registrationSuccessful"), "success");
      ClearForm();
    }
  };

  const ClearForm = () => {
    setForm({
      name: "",
      email: "",
      password: "",
      confirm: "",
    });
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow">
        <h1 className="mb-4 text-2xl font-bold text-center">{t("register")}</h1>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <Input
              required
              title={t("username")}
              type="text"
              placeholder={t("username")}
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
          </div>
          <div>
            <Input
              required
              title={"Email"}
              type="email"
              placeholder="you@example.com"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
          </div>
          <div>
            <Input
              required
              title={t("password")}
              type="password"
              placeholder={t("password")}
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
            />
          </div>
          <div>
            <Input
              required
              title={t("confirmPassword")}
              type="password"
              placeholder={t("confirmPassword")}
              value={form.confirm}
              onChange={(e) => setForm({ ...form, confirm: e.target.value })}
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
              t("register")
            )}
          </button>
        </form>
        {message && (
          <p className="mt-4 text-center text-sm text-red-600">{message}</p>
        )}
        <p className="mt-4 text-center text-sm text-gray-600">
          {t("alreadyHaveAccount")}{" "}
          <Link href="/login" className="text-green-600 hover:underline">
            {t("login")}
          </Link>
        </p>
      </div>
    </div>
  );
}
