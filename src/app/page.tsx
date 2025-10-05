import { Code2, Zap, Tag } from "lucide-react";
import { getTranslations } from "next-intl/server";
import Link from "next/link";

export default async function Home() {
  const t = await getTranslations();

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-24 md:py-32">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="mb-6 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl md:text-6xl">
            {t("Home.Bắt đầu")}
          </h1>
          <p className="mb-8 text-lg text-gray-600 md:text-xl">
            {/* {t.home.subtitle} */}
          </p>
          <Link
            href="/explore"
            className="inline-block rounded-lg bg-green-600 px-6 py-3 text-lg font-medium text-white shadow hover:bg-green-700 transition"
          >
            {/* {t.home.cta} */}
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 pb-24">
        <div className="grid gap-6 md:grid-cols-3">
          {/* Feature 1 */}
          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm hover:shadow-md transition">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-green-100">
              <Code2 className="h-6 w-6 text-green-600" />
            </div>
            <h3 className="mb-2 text-xl font-semibold text-gray-900">
              {/* {t.home.features.share} */}
            </h3>
            {/* <p className="text-gray-600">{t.home.features.shareDesc}</p> */}
          </div>

          {/* Feature 2 */}
          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm hover:shadow-md transition">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-yellow-100">
              <Zap className="h-6 w-6 text-yellow-500" />
            </div>
            <h3 className="mb-2 text-xl font-semibold text-gray-900">
              {/* {t.home.features.analyze} */}
            </h3>
            {/* <p className="text-gray-600">{t.home.features.analyzeDesc}</p> */}
          </div>

          {/* Feature 3 */}
          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm hover:shadow-md transition">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-green-100">
              <Tag className="h-6 w-6 text-green-600" />
            </div>
            <h3 className="mb-2 text-xl font-semibold text-gray-900">
              {/* {t.home.features.organize} */}
            </h3>
            {/* <p className="text-gray-600">{t.home.features.organizeDesc}</p> */}
          </div>
        </div>
      </section>
    </div>
  );
}
