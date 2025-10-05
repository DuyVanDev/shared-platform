import { fetchSnippetById } from "@/services/snippetService";
import SnippetView from "./SnippetView";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  try {
    const { id } = await params;
    const snippet = await fetchSnippetById(id);

    if (!snippet) {
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

      openGraph: {
        title: snippet.title,
        description:
          snippet.description ||
          `Code snippet in ${
            snippet.programmingLanguage
          } covering ${snippet.topics.join(", ")}.`,
        type: "article",
        images: [
          {
            url: "https://shared-platform-qpqf.vercel.app//og-default.png",
            width: 1200,
            height: 630,
            alt: snippet.title,
          },
        ],
      },
      twitter: {
        card: "summary_large_image",
        title: snippet.title,
        description:
          snippet.description ||
          `A ${snippet.programmingLanguage} snippet from SnippetHub.`,
        images: ["https://shared-platform-qpqf.vercel.app//og-default.png"],
      },
    };
  } catch {
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
