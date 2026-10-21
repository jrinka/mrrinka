export default function AiModelInfo({provider}:{provider:{name:string;disclosure:string}}) {
  return <aside className="passage-privacy" aria-label="About the AI model"><strong>AI model:</strong> {provider.disclosure}. AI feedback can be mistaken; check it against your texts and make your own decisions.</aside>;
}
