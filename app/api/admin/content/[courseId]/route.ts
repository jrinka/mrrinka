import {
  authorizedSession,
  githubFetch,
  repoPath,
  contentBranch,
  sameOrigin,
} from "@/lib/auth";
import { isCourseId, courseSchema } from "@/lib/schema";
type Context = { params: Promise<{ courseId: string }> };
export async function GET(_request: Request, { params }: Context) {
  try {
    const auth = await authorizedSession();
    if (!auth)
      return Response.json({ error: "Please sign in again." }, { status: 401 });
    const { courseId } = await params;
    if (!isCourseId(courseId))
      return Response.json({ error: "Unknown course." }, { status: 404 });
    const response = await githubFetch(
      `${repoPath()}/contents/content/${courseId}.json?ref=${encodeURIComponent(contentBranch())}`,
      auth.token,
    );
    if (!response.ok)
      return Response.json(
        {
          error:
            "Could not read the course from GitHub. Check repository access.",
        },
        { status: 502 },
      );
    const file = await response.json();
    const course = courseSchema.parse(
      JSON.parse(Buffer.from(file.content, "base64").toString("utf8")),
    );
    return Response.json(
      { course, sha: file.sha },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch {
    return Response.json(
      { error: "Could not load course content. Try again." },
      { status: 502 },
    );
  }
}
export async function PUT(request: Request, { params }: Context) {
  try {
    if (!sameOrigin(request))
      return Response.json(
        { error: "Invalid request origin." },
        { status: 403 },
      );
    const auth = await authorizedSession();
    if (!auth)
      return Response.json({ error: "Please sign in again." }, { status: 401 });
    const { courseId } = await params;
    if (!isCourseId(courseId))
      return Response.json({ error: "Unknown course." }, { status: 404 });
    const text = await request.text();
    if (Buffer.byteLength(text) > 1000000)
      return Response.json(
        { error: "This course is too large to save in one request." },
        { status: 413 },
      );
    let payload;
    try {
      payload = JSON.parse(text);
    } catch {
      return Response.json({ error: "Invalid document." }, { status: 400 });
    }
    const result = courseSchema.safeParse(payload.course);
    if (
      !result.success ||
      result.data.id !== courseId ||
      !/^[a-f0-9]{40}$/.test(payload.sha || "")
    )
      return Response.json(
        {
          error: result.success
            ? "Invalid course or revision."
            : result.error.issues.map((i) => i.message).join(" "),
        },
        { status: 400 },
      );
    const response = await githubFetch(
      `${repoPath()}/contents/content/${courseId}.json`,
      auth.token,
      {
        method: "PUT",
        body: JSON.stringify({
          message: `Update ${result.data.shortTitle} content`,
          content: Buffer.from(
            JSON.stringify(result.data, null, 2) + "\n",
          ).toString("base64"),
          sha: payload.sha,
          branch: contentBranch(),
        }),
      },
    );
    if (response.status === 409 || response.status === 422)
      return Response.json(
        {
          error:
            "This course changed since you opened it. Export your changes, then reload the latest version before editing again.",
        },
        { status: 409 },
      );
    if (!response.ok)
      return Response.json(
        {
          error:
            "GitHub could not save the course. Your edits are still in this editor.",
        },
        { status: 502 },
      );
    const saved = await response.json();
    return Response.json({
      sha: saved.content.sha,
      commitUrl: saved.commit.html_url,
    });
  } catch {
    return Response.json(
      { error: "Could not save. Your edits are still here; please try again." },
      { status: 502 },
    );
  }
}
