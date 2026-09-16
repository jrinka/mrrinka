import { randomUUID } from "node:crypto";
import {
  authorizedSession,
  githubFetch,
  repoPath,
  contentBranch,
  sameOrigin,
} from "@/lib/auth";
export async function POST(request: Request) {
  try {
    if (!sameOrigin(request))
      return Response.json(
        { error: "Invalid request origin." },
        { status: 403 },
      );
    const auth = await authorizedSession();
    if (!auth)
      return Response.json({ error: "Please sign in again." }, { status: 401 });
    if (Number(request.headers.get("content-length")) > 2600000)
      return Response.json(
        { error: "Files must be 2 MB or smaller." },
        { status: 413 },
      );
    const data = await request.formData();
    const file = data.get("file");
    if (!(file instanceof File) || file.size > 2000000 || !file.size)
      return Response.json(
        { error: "Choose a file up to 2 MB." },
        { status: 400 },
      );
    const bytes = Buffer.from(await file.arrayBuffer());
    const ext = file.name.split(".").pop()?.toLowerCase();
    const valid =
      (ext === "pdf" && bytes.subarray(0, 5).toString() === "%PDF-") ||
      (ext === "png" &&
        bytes.subarray(0, 8).toString("hex") === "89504e470d0a1a0a") ||
      (["jpg", "jpeg"].includes(ext || "") &&
        bytes.subarray(0, 3).toString("hex") === "ffd8ff") ||
      (ext === "webp" &&
        bytes.subarray(0, 4).toString() === "RIFF" &&
        bytes.subarray(8, 12).toString() === "WEBP") ||
      (ext === "txt" && !bytes.includes(0));
    if (!valid)
      return Response.json(
        { error: "Upload a PDF, PNG, JPG, WebP, or plain text file." },
        { status: 400 },
      );
    const name = `${randomUUID()}.${ext}`;
    const response = await githubFetch(
      `${repoPath()}/contents/public/uploads/${name}`,
      auth.token,
      {
        method: "PUT",
        body: JSON.stringify({
          message: `Add teaching material: ${file.name.replace(/[\r\n]/g, " ").slice(0, 100)}`,
          content: bytes.toString("base64"),
          branch: contentBranch(),
        }),
      },
    );
    if (!response.ok)
      return Response.json(
        { error: "Upload failed. Try again." },
        { status: 502 },
      );
    return Response.json({ url: `/uploads/${name}`, name: file.name });
  } catch {
    return Response.json(
      { error: "Upload failed. Try again." },
      { status: 502 },
    );
  }
}
