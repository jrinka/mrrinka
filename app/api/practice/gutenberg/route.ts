import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const id = request.nextUrl.searchParams.get("id");
  if (!id || !/^\d+$/.test(id)) {
    return Response.json({ error: "Invalid book id" }, { status: 400 });
  }

  const urls = [
    `https://www.gutenberg.org/ebooks/${id}.txt.utf-8`,
    `https://www.gutenberg.org/files/${id}/${id}-0.txt`,
  ];

  for (const url of urls) {
    try {
      const response = await fetch(url, {
        signal: AbortSignal.timeout(8000),
        headers: { "User-Agent": "MrRinkaPassagePractice/1.0 (educational use)" },
      });
      if (!response.ok) continue;
      const text = await response.text();
      if (text.length < 500) continue;
      return new Response(text, {
        headers: {
          "Content-Type": "text/plain; charset=utf-8",
          "Cache-Control": "public, s-maxage=86400, stale-while-revalidate=604800",
        },
      });
    } catch {
      // Try the next Gutenberg URL.
    }
  }

  return Response.json({ error: "Could not fetch book" }, { status: 404 });
}

