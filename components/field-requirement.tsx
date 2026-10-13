/** Keep the visible requirement alongside the native form constraint. */
export default function FieldRequirement({ required = true }: { required?: boolean }) {
  return <span className="field-requirement">{required ? <><span aria-hidden="true">*</span> Required</> : "Optional"}</span>;
}
