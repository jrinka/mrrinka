# Interaction conventions

Use these conventions when adding or revising an interface. Preserve teacher-authored course content, learning tasks, and existing storage behavior.

## Instructional language

Favor instructional language over decorative phrasing across student-facing headings, directions, explanations, interface labels, and feedback. Clarity and economy come first. Name the actual task, concept, or action so students can understand what to do without decoding a slogan or metaphor.

- Make task headings specific: use a concrete verb and its object, such as “Compare the line breaks,” “Select evidence,” or “Check your response.” For reference sections, name the contents directly, such as “Reading scaffolds.” Do not force every heading into an imperative.
- Replace vague labels such as “move,” “direction,” or “tools” with the particular action or resource meant in that context. Choose wording from the section's actual purpose; the same generic heading may need different replacements on different pages.
- State the relationship students need to understand. For example, “Use the frame to connect evidence, interpretation, and explanation” identifies what the scaffold does. Keep the reasoning and subject precision when simplifying language.
- Remove sentences that only announce a benefit, introduce the instruction, or add encouragement without useful information. If the next sentence already tells students what to do, start there. A deletion can be better than a replacement.
- Avoid catchy slogans, unnecessary introductions, and polished-sounding phrases that add no instructional value. Do not replace one flourish with another or turn a clear instruction into a rhythmic slogan.
- Preserve established names and conventions, including Refinery, Critical Lenses, and The magic sentence; explain the action clearly around them. Preserve source quotations and figurative language used as material for analysis.
- During future additions and revisions, check whether each heading names the task or contents and each sentence helps students understand or act. Preserve teacher-authored content unless its revision is authorized.

### Examples for future wording

| Vague or decorative wording | Preferred wording or action |
| --- | --- |
| Learn the move, choose your own direction | Use the examples to develop your own inquiry |
| A detail is the beginning | Explain how the detail creates meaning |
| Where the line leaves you | Compare the line breaks |
| The decision waits | Compare the position of the main clause |
| Field tools | Name the actual task: Check your analysis, Plan your comparison, Reading scaffolds, or Keep an inquiry log |
| Your next move | What to try next |
| Build confidence with the vocabulary of analysis. | Delete when the following sentence already explains the flashcard task. |

## Meaning before appearance

| Cue | Meaning | Shared implementation |
| --- | --- | --- |
| Pencil + text | Student interaction or student-authored notes | `StudentInputLabel`, `InteractivePracticeLabel`, notes shortcut |
| Sparkles + AI | AI guidance is available | `AiGuidanceBadge`; sparkle on the explicit feedback action |
| `* Required` | This field must be completed for the current action | `FieldRequirement` together with the native `required` attribute |
| Optional | A field may be left empty for the current action | `FieldRequirement required={false}` |
| Download | Creates a file on the student's device | `ExportFormatSelect` and existing download functions |
| Saved | Actual browser persistence or teacher server saving | Storage status or teacher editor, never a substitute for a download action |

Keep text beside symbols. Do not use the AI sparkle to mean generic practice. A pencil does not imply that a field is mandatory.

## Controls and navigation

- Preserve the graphite, citron, and paper palette. Shared primary and secondary buttons retain their visual roles.
- Give hover and keyboard focus equivalent feedback. Keyboard focus also has a visible outline.
- Choices use a quiet highlight on hover; selected choices keep their fill and a persistent rule. Preserve `aria-pressed`, `aria-selected`, or `aria-current` as appropriate.
- Disabled controls remain visibly disabled and do not adopt active hover styling. Explain prerequisites near actions that require input.
- Disclosures use native `details`/`summary`, a pointer, and underline feedback. Keep meaningful summary text and the built-in open/closed marker.
- Do not add button styling to ordinary reading panels. Keep links visibly identifiable without requiring hover.
- Respect reduced motion. Preserve useful laptop layouts; allow controls and fields to wrap on smaller screens.

## Refineries

All four refineries share this orientation:

1. Bring your thinking: add texts, evidence, and a draft or question.
2. Get feedback: deliberately request AI guidance.
3. Revise and keep a copy: make your own changes, then download the record.

This is an orientation, not a locked wizard. Analysis and Comparison retain evidence/draft feedback. Global Issue and Line of Inquiry retain exploratory conversation and a separate working idea. Changing modes preserves both fields. Required and optional labels follow the selected mode. Refining a working idea keeps the action label “Get feedback on this idea” after the first turn.

Use “Get feedback on this draft/paragraph/idea” and “Get feedback on this revision” where applicable. “Send reply” remains appropriate for an ongoing exploratory conversation. “Feedback about this tool/page” is the separate site-quality voting control.

## Downloads and storage

Use “Download format” and “Download [contents]”. Keep the existing Word, PDF, and Markdown choices and defaults. File generation errors must name an available fallback format.

Storage differences are intentional and must be stated honestly:

- Page-only workspaces: download before navigating away or reloading.
- Close Analysis: session storage in the current tab, including source switching and reload when storage is available; download before closing the tab.
- IO plans/rehearsal notes and online reading grids: local storage on this browser/device; a download is still the durable copy.
- Teacher “Save changes”: authenticated server publication. Do not change this label to Download.

A download does not submit work to a teacher.

## Intentional exceptions

- Brain Break retains its own larger classroom controls and game-state colors. Correctness, board state, and selection are different meanings; do not recolor them with blanket button rules.
- Authored practice reveals a possible reading after student writing; AI tools request feedback. Preserve that distinction.
- Worked-example reading modes and source navigation retain their existing layout, focus behavior, and print handling.
- Standalone worksheets remain usable offline and do not gain server storage.

## Verification for future changes

Visit every affected route and inspect its relevant states, not only the initial screen. Check light/dark contrast, keyboard focus, selected and disabled controls, phone overflow, and the desktop working area. For forms, verify draft retention, mode switching, loading, error, revision, download, and reset behavior. Simulated responses can validate interface behavior but do not establish live AI quality or provider availability.
