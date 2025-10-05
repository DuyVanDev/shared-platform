import { fetchSnippetById } from "@/services/snippetService";
import SnippetView from "./SnippetView";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  try {
    const { id } = await params; // ✅ phải await trước
    const snippet = await fetchSnippetById(id);

    console.log("Fetched Snippet:", snippet);

    if (!snippet) {
      console.log("Fetched Snippet clien:", snippet);

      return {
        title: "Snippet not found | SnippetHub",
        description: "The requested code snippet could not be found.",
      };
    }

    const keywords = [
      snippet.programmingLanguage,
      ...(snippet.topics || []),
      "code snippet",
      "developer",
    ];

    return {
      title: `${snippet.title} | SnippetHub`,
      description:
        snippet.description ||
        `A ${snippet.programmingLanguage} snippet about ${snippet.topics.join(
          ", "
        )}.`,
      keywords,

      // 🔗 Canonical URL
      alternates: {
        canonical: `https://snippethub.dev/snippets/${params.id}`,
      },

      // 🧠 Open Graph metadata (Facebook, LinkedIn, etc.)
      openGraph: {
        title: snippet.title,
        description:
          snippet.description ||
          `Code snippet in ${
            snippet.programmingLanguage
          } covering ${snippet.topics.join(", ")}.`,
        type: "article",
        url: `https://snippethub.dev/snippets/${params.id}`,
        images: [
          {
            url: "https://snippethub.dev/og-default.png",
            width: 1200,
            height: 630,
            alt: snippet.title,
          },
        ],
      },

      // 🐦 Twitter Card
      twitter: {
        card: "summary_large_image",
        title: snippet.title,
        description:
          snippet.description ||
          `A ${snippet.programmingLanguage} snippet from SnippetHub.`,
        images: ["https://snippethub.dev/og-default.png"],
      },
    };
  } catch (error) {
    console.log("Error generating metadata:", error);
    return {
      title: "Snippet | SnippetHub",
      description:
        "Explore and share developer code snippets with estimated time complexity.",
    };
  }
}

export default function Page() {
  return <SnippetView />;
}
