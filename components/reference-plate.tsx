import Image from "next/image";

const plates = {
  calendar: { src: "/archive/universal-sundial.jpg", keyword: "MERIDIAN", title: "Clocks: a universal sundial, with a compass. Engraving.", alt: "Antique engraving of a globe mounted above curved sundials and a compass", id: "cpyrw6ej" },
  texts: { src: "/archive/sign-alphabet.jpg", keyword: "SIGNUM", title: "Hands showing the sign language alphabet. Line engraving.", alt: "An antique engraved chart of hand signs representing letters", id: "awq9wceu" },
};

export default function ReferencePlate({ kind }: { kind: keyof typeof plates }) {
  const plate = plates[kind];
  const credit = `${plate.title} Wellcome Collection. Public Domain Mark.`;
  return <figure className="guide-plate reference-plate">
    <Image src={plate.src} alt={plate.alt} fill sizes="(max-width: 700px) 180px, 250px" />
    <span className="guide-plate-keyword mono">{plate.keyword}</span>
    <figcaption><a href={`https://wellcomecollection.org/works/${plate.id}`} title={credit} aria-label={credit}>WELLCOME</a></figcaption>
  </figure>;
}
