"use client";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { ArrowUpRight, Plus, Save, Upload, X } from "lucide-react";
import Markdown from "./markdown";
import {
  courseIds,
  sectionNames,
  sections,
  type Course,
  type CourseItem,
  type CourseId,
} from "@/lib/schema";
const labels = ["IB Lang & Lit", "IB Literature", "English 10"];
type Props = { login?: string; previewCourses?: Course[] };
export default function Editor({ login, previewCourses }: Props) {
  const preview = Boolean(previewCourses);
  const [courseId, setCourseId] = useState<CourseId>(courseIds[0]);
  const [course, setCourse] = useState<Course | null>(
    previewCourses?.[0] || null,
  );
  const [sha, setSha] = useState("");
  const [selected, setSelected] = useState("settings");
  const [dirty, setDirty] = useState(false);
  const [busy, setBusy] = useState(false);
  const [loading, setLoading] = useState(!preview);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [showPreview, setShowPreview] = useState(false);
  const [commitUrl, setCommitUrl] = useState("");
  const uploadRef = useRef<HTMLInputElement>(null);
  const editRevision = useRef(0);
  const load = useCallback(
    async (id: CourseId) => {
      setLoading(true);
      setError("");
      setMessage("");
      setCommitUrl("");
      setCourse(null);
      try {
        if (previewCourses) {
          setCourse(structuredClone(previewCourses.find((c) => c.id === id)!));
        } else {
          const response = await fetch(`/api/admin/content/${id}`);
          const data = await response.json();
          if (!response.ok) throw new Error(data.error);
          setCourse(data.course);
          setSha(data.sha);
        }
        setDirty(false);
        setSelected("settings");
      } catch (e) {
        setError(
          e instanceof Error ? e.message : "Could not load this course.",
        );
      } finally {
        setLoading(false);
      }
    },
    [previewCourses],
  );
  useEffect(() => {
    if (!previewCourses) void load(courseIds[0]);
  }, [load, previewCourses]);
  useEffect(() => {
    function warn(e: BeforeUnloadEvent) {
      if (dirty) e.preventDefault();
    }
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [dirty]);
  function change(next: Course) {
    editRevision.current++;
    setCourse(next);
    setDirty(true);
    setMessage("");
  }
  function updateItem(patch: Partial<CourseItem>) {
    if (course)
      change({
        ...course,
        items: course.items.map((i) =>
          i.id === selected ? { ...i, ...patch } : i,
        ),
      });
  }
  const item = course?.items.find((i) => i.id === selected);
  async function switchCourse(id: CourseId) {
    if (id === courseId) return;
    if (
      dirty &&
      !window.confirm(
        "Discard unsaved changes to this course? Export them first if you want to keep a copy.",
      )
    )
      return;
    setCourseId(id);
    await load(id);
  }
  function addItem() {
    if (!course) return;
    const id = crypto.randomUUID();
    change({
      ...course,
      items: [
        ...course.items,
        {
          id,
          title: "Untitled page",
          section: "units",
          summary: "",
          body: "",
          published: false,
          image: "",
          imageAlt: "",
          imageCredit: "",
          imageSource: "",
          links: [],
          relatedIds: [],
          practiceKind: "none",
        },
      ],
    });
    setSelected(id);
  }
  function exportCourse() {
    if (!course) return;
    const url = URL.createObjectURL(
      new Blob([JSON.stringify(course, null, 2) + "\n"], {
        type: "application/json",
      }),
    );
    const a = document.createElement("a");
    a.href = url;
    a.download = `${course.id}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }
  async function save() {
    if (!course || preview) return;
    setBusy(true);
    setError("");
    setMessage("");
    const revision = editRevision.current;
    try {
      const response = await fetch(`/api/admin/content/${courseId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ course, sha }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error);
      setSha(data.sha);
      if (revision === editRevision.current) setDirty(false);
      setCommitUrl(data.commitUrl);
      setMessage(
        "Saved to GitHub. Published pages will update after the site deployment completes; drafts stay out of the public pages.",
      );
    } catch (e) {
      setError(e instanceof Error ? e.message : "Save failed.");
    } finally {
      setBusy(false);
    }
  }
  async function upload(file: File) {
    if (!item || preview) return;
    const targetId = item.id;
    setBusy(true);
    setError("");
    try {
      if (!file.size || file.size > 50_000_000) throw new Error("Choose a file up to 50 MB.");
      const response = await fetch("/api/admin/upload", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "start", name: file.name, size: file.size }),
      });
      const upload = await response.json();
      if (!response.ok) throw new Error(upload.error);
      const transfer = await fetch(upload.uploadUrl, {
        method: "PUT", headers: { "Content-Type": upload.type }, body: file,
      });
      if (!transfer.ok) throw new Error("File transfer failed. Please try again.");
      const confirmation = await fetch("/api/admin/upload", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "complete", ticket: upload.ticket }),
      });
      const data = await confirmation.json();
      if (!confirmation.ok) throw new Error(data.error);
      setCourse((current) =>
        current
          ? {
              ...current,
              items: current.items.map((i) =>
                i.id === targetId
                  ? {
                      ...i,
                      links: [
                        ...i.links,
                        {
                          id: crypto.randomUUID(),
                          title: file.name,
                          url: data.url,
                          description: "",
                        },
                      ],
                    }
                  : i,
              ),
            }
          : current,
      );
      editRevision.current++;
      setDirty(true);
      setMessage(
        "File uploaded. Save this course to attach its link. Uploaded files are immediately public, including files attached to draft pages.",
      );
    } catch (e) {
      setError(e instanceof Error ? e.message : "Upload failed.");
    } finally {
      setBusy(false);
      if (uploadRef.current) uploadRef.current.value = "";
    }
  }
  return (
    <div className="admin-site">
      <header className="admin-header">
        <Link
          href="/"
          className="wordmark"
          onClick={(e) => {
            if (dirty && !window.confirm("Leave with unsaved changes?"))
              e.preventDefault();
          }}
        >
          mr rinka<span>_</span>
        </Link>
        <span className="mono">TEACHER EDITOR</span>
        <div className="admin-account">
          {login && <span>{login}</span>}
          {!preview && <Link href="/admin/feedback" onClick={event => { if (dirty && !window.confirm("Leave with unsaved changes?")) event.preventDefault(); }}>Feedback summary</Link>}
          {!preview && (
            <form
              action="/api/auth/logout"
              method="post"
              onSubmit={(e) => {
                if (dirty && !window.confirm("Sign out with unsaved changes?"))
                  e.preventDefault();
              }}
            >
              <button className="text-button">Sign out</button>
            </form>
          )}
          <a href={`/courses/${courseId}`} target="_blank" rel="noreferrer">
            View site <ArrowUpRight size={15} />
          </a>
        </div>
      </header>
      {preview && (
        <div className="preview-notice">
          Editor preview — changes here are not published. You can try the
          controls and export a copy.
        </div>
      )}
      <div className="admin-grid">
        <aside className="editor-sidebar">
          <label className="field">
            <span>Course</span>
            <select
              value={courseId}
              disabled={busy || loading}
              onChange={(e) => void switchCourse(e.target.value as CourseId)}
            >
              {courseIds.map((id, i) => (
                <option key={id} value={id}>
                  {labels[i]}
                </option>
              ))}
            </select>
          </label>
          <button
            className={`editor-nav ${selected === "settings" ? "active" : ""}`}
            onClick={() => setSelected("settings")}
          >
            Course overview
          </button>
          {sections.map((section) => (
            <div className="editor-group" key={section}>
              <div className="mono">{sectionNames[section]}</div>
              {course?.items
                .filter((i) => i.section === section)
                .map((i) => (
                  <button
                    className={`editor-nav ${selected === i.id ? "active" : ""}`}
                    key={i.id}
                    onClick={() => {
                      setSelected(i.id);
                      setShowPreview(false);
                    }}
                  >
                    {i.title}
                    {!i.published && <span className="draft-tag">Draft</span>}
                  </button>
                ))}
            </div>
          ))}
          <button
            className="button secondary"
            disabled={!course || busy}
            onClick={addItem}
          >
            <Plus size={17} /> Add page
          </button>
        </aside>
        <main className="editor-main">
          <div className="editor-toolbar">
            <span className="mono">
              {dirty ? "UNSAVED CHANGES" : "UP TO DATE"}
            </span>
            <div className="actions">
              <button
                className="button secondary"
                disabled={!course}
                onClick={exportCourse}
              >
                Export copy
              </button>
              <button
                className="button"
                disabled={!dirty || busy || preview}
                onClick={save}
              >
                <Save size={16} />
                {busy ? "Working…" : "Save changes"}
              </button>
            </div>
          </div>
          {loading && <p role="status">Loading your course…</p>}
          {error && (
            <div className="error" role="alert">
              {error}{" "}
              <button
                className="text-button"
                onClick={() => {
                  if (
                    !dirty ||
                    window.confirm("Discard unsaved changes and reload?")
                  )
                    void load(courseId);
                }}
              >
                Reload course
              </button>
            </div>
          )}
          {message && (
            <div className="notice" role="status">
              {message}
              {commitUrl && (
                <>
                  {" "}
                  <a href={commitUrl} target="_blank" rel="noreferrer">
                    View saved version
                  </a>
                </>
              )}
            </div>
          )}
          {course && (
            <fieldset className="editor-fields" disabled={busy}>
              {selected === "settings" ? (
                <>
                  <span className="mono">COURSE SETTINGS</span>
                  <h1>Course overview</h1>
                  <label className="field">
                    <span>Course title</span>
                    <input
                      value={course.title}
                      maxLength={140}
                      onChange={(e) =>
                        change({ ...course, title: e.target.value })
                      }
                    />
                  </label>
                  <label className="field">
                    <span>Short title</span>
                    <input
                      value={course.shortTitle}
                      maxLength={60}
                      onChange={(e) =>
                        change({ ...course, shortTitle: e.target.value })
                      }
                    />
                  </label>
                  <label className="field">
                    <span>Course label</span>
                    <input
                      value={course.eyebrow}
                      maxLength={80}
                      onChange={(e) =>
                        change({ ...course, eyebrow: e.target.value })
                      }
                    />
                  </label>
                  <label className="field">
                    <span>Introduction</span>
                    <textarea
                      rows={3}
                      maxLength={600}
                      value={course.description}
                      onChange={(e) =>
                        change({ ...course, description: e.target.value })
                      }
                    />
                  </label>
                  <label className="field">
                    <span>Class note</span>
                    <span className="hint">
                      Optional announcement shown on the course overview.
                    </span>
                    <textarea
                      rows={3}
                      maxLength={1000}
                      value={course.announcement}
                      onChange={(e) =>
                        change({ ...course, announcement: e.target.value })
                      }
                    />
                  </label>
                  <label className="field">
                    <span>Featured page</span>
                    <select
                      value={course.featuredId}
                      onChange={(e) =>
                        change({ ...course, featuredId: e.target.value })
                      }
                    >
                      <option value="">No featured page</option>
                      {course.items.map((i) => (
                        <option key={i.id} value={i.id}>
                          {i.title}
                          {!i.published ? " (draft)" : ""}
                        </option>
                      ))}
                    </select>
                  </label>
                </>
              ) : item?.sharedFrom ? (
                <>
                  <h1>{item.title}</h1>
                  <p>This page uses shared material. Edit the source once to update every course that uses it.</p>
                  <button type="button" className="button" onClick={async () => {
                    if (dirty && !window.confirm("Discard unsaved changes before opening the shared source?")) return;
                    const source = item.sharedFrom!;
                    setCourseId(source.courseId);
                    await load(source.courseId);
                    setSelected(source.itemId);
                  }}>Edit shared source</button>
                </>
              ) : item ? (
                <>
                  <div className="section-heading">
                    <span className="mono">EDIT PAGE</span>
                    <label className="toggle">
                      <input
                        type="checkbox"
                        checked={item.published}
                        onChange={(e) =>
                          updateItem({ published: e.target.checked })
                        }
                      />
                      Published
                    </label>
                  </div>
                  <h1>{item.title || "Untitled page"}</h1>
                  <p className="muted">
                    Uncheck Published to hide this page from the site. This
                    repository is public, so saved draft text is still visible
                    in GitHub. Changes take effect when you save.
                  </p>
                  <label className="field">
                    <span>Title</span>
                    <input
                      value={item.title}
                      maxLength={140}
                      onChange={(e) => updateItem({ title: e.target.value })}
                    />
                  </label>
                  <label className="field">
                    <span>Section</span>
                    <select
                      value={item.section}
                      onChange={(e) =>
                        updateItem({
                          section: e.target.value as CourseItem["section"],
                        })
                      }
                    >
                      {sections.map((s) => (
                        <option key={s} value={s}>
                          {sectionNames[s]}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label className="field">
                    <span>Summary</span>
                    <textarea
                      rows={2}
                      maxLength={500}
                      value={item.summary}
                      onChange={(e) => updateItem({ summary: e.target.value })}
                    />
                  </label>
                  <div className="section-heading">
                    <h2>Page content</h2>
                    <button
                      type="button"
                      className="text-button"
                      onClick={() => setShowPreview(!showPreview)}
                    >
                      {showPreview ? "Write" : "Preview formatting"}
                    </button>
                  </div>
                  {showPreview ? (
                    <div className="markdown-preview">
                      <Markdown>
                        {item.body || "Your page content will appear here."}
                      </Markdown>
                    </div>
                  ) : (
                    <label className="field">
                      <span className="hint">
                        Use ## for headings, - for lists, **bold**, and [link
                        text](https://…).
                      </span>
                      <textarea
                        className="body-editor"
                        rows={15}
                        maxLength={50000}
                        value={item.body}
                        onChange={(e) => updateItem({ body: e.target.value })}
                      />
                    </label>
                  )}
                  <details className="editor-details">
                    <summary>Banner image</summary>
                    <p className="muted">
                      Use a built-in archival image or a photo from your Unsplash
                      collection. Always include alt text and a source credit.
                    </p>
                    <label className="field">
                      <span>Image URL</span>
                      <input
                        type="url"
                        value={item.image}
                        onChange={(e) => updateItem({ image: e.target.value })}
                      />
                    </label>
                    <label className="field">
                      <span>Describe the image</span>
                      <input
                        value={item.imageAlt}
                        onChange={(e) =>
                          updateItem({ imageAlt: e.target.value })
                        }
                      />
                    </label>
                    <label className="field">
                      <span>Photographer</span>
                      <input
                        value={item.imageCredit}
                        onChange={(e) =>
                          updateItem({ imageCredit: e.target.value })
                        }
                      />
                    </label>
                    <label className="field">
                      <span>Unsplash photo page</span>
                      <input
                        type="url"
                        value={item.imageSource}
                        onChange={(e) =>
                          updateItem({ imageSource: e.target.value })
                        }
                      />
                    </label>
                  </details>
                  <section className="editor-details">
                    <h2>Materials & links</h2>
                    <p className="muted">
                      Link to a reading, shared document, or an external
                      practice tool. Uploaded files become public; don’t upload
                      private material.
                    </p>
                    {item.links.map((l, i) => (
                      <div className="link-editor" key={l.id}>
                        <label className="field">
                          <span>Link title</span>
                          <input
                            value={l.title}
                            onChange={(e) =>
                              updateItem({
                                links: item.links.map((x, n) =>
                                  n === i ? { ...x, title: e.target.value } : x,
                                ),
                              })
                            }
                          />
                        </label>
                        <label className="field">
                          <span>URL</span>
                          <input
                            value={l.url}
                            onChange={(e) =>
                              updateItem({
                                links: item.links.map((x, n) =>
                                  n === i ? { ...x, url: e.target.value } : x,
                                ),
                              })
                            }
                          />
                        </label>
                        <label className="field">
                          <span>Description</span>
                          <input
                            value={l.description}
                            onChange={(e) =>
                              updateItem({
                                links: item.links.map((x, n) =>
                                  n === i
                                    ? { ...x, description: e.target.value }
                                    : x,
                                ),
                              })
                            }
                          />
                        </label>
                        <button
                          className="text-button"
                          onClick={() =>
                            updateItem({
                              links: item.links.filter((x) => x.id !== l.id),
                            })
                          }
                        >
                          <X size={14} /> Remove link
                        </button>
                      </div>
                    ))}
                    <div className="actions">
                      <button
                        className="button secondary"
                        onClick={() =>
                          updateItem({
                            links: [
                              ...item.links,
                              {
                                id: crypto.randomUUID(),
                                title: "",
                                url: "",
                                description: "",
                              },
                            ],
                          })
                        }
                      >
                        <Plus size={16} />
                        Add link
                      </button>
                      <button
                        className="button secondary"
                        disabled={preview}
                        onClick={() => uploadRef.current?.click()}
                      >
                        <Upload size={16} />
                        Upload file
                      </button>
                      <input
                        hidden
                        ref={uploadRef}
                        type="file"
                        accept=".pdf,.png,.jpg,.jpeg,.webp,.txt"
                        onChange={(e) => {
                          const f = e.target.files?.[0];
                          if (f) void upload(f);
                        }}
                      />
                    </div>
                    <small className="hint">
                      PDF, images, or plain text · Up to 50 MB. Use a
                      shared-document link for larger files.
                    </small>
                  </section>
                  <label className="field">
                    <span>Built-in practice activity</span>
                    <select
                      value={item.practiceKind}
                      onChange={(e) =>
                        updateItem({
                          practiceKind: e.target
                            .value as CourseItem["practiceKind"],
                        })
                      }
                    >
                      <option value="none">None</option>
                      <option value="close-reading">Close reading lab</option>
                      <option value="paragraph">Paragraph workshop</option>
                    </select>
                  </label>
                  <div className="field">
                    <span>Related pages</span>
                    {course.items
                      .filter((i) => i.id !== item.id)
                      .map((i) => (
                        <label className="toggle" key={i.id}>
                          <input
                            type="checkbox"
                            checked={item.relatedIds.includes(i.id)}
                            onChange={(e) =>
                              updateItem({
                                relatedIds: e.target.checked
                                  ? [...item.relatedIds, i.id]
                                  : item.relatedIds.filter((id) => id !== i.id),
                              })
                            }
                          />
                          {i.title}
                          {!i.published ? " (draft)" : ""}
                        </label>
                      ))}
                  </div>
                </>
              ) : null}
            </fieldset>
          )}
        </main>
      </div>
    </div>
  );
}
