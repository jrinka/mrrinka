import Image from "next/image";
import type { CourseId, Section } from "@/lib/schema";

type Plate = {
  src: string;
  alt: string;
  title: string;
  source: string;
  collection: string;
  position?: string;
};

const plates: Record<CourseId, Record<"hero" | Section, Plate>> = {
  "language-literature": {
    hero: {
      src: "/archive/babel-language-confounded.jpg",
      alt: "Engraving of the builders of Babel arguing as their language is confounded",
      title: "The builders of Babel",
      source: "https://wellcomecollection.org/works/fgv7e65c",
      collection: "Wellcome Collection",
      position: "50% 28%",
    },
    units: {
      src: "/archive/alchemy-emblem-philosophers-stone.jpg",
      alt: "An alchemical emblem showing a symbolic path to the philosopher's stone",
      title: "The path to the philosopher's stone",
      source: "https://wellcomecollection.org/works/duu28x8s",
      collection: "Wellcome Collection",
    },
    assessment: {
      src: "/archive/man-sharpening-quill.jpg",
      alt: "Engraving of a seated man sharpening a quill pen",
      title: "A man sharpening a quill",
      source: "https://wellcomecollection.org/works/zp84mkcr",
      collection: "Wellcome Collection",
    },
    resources: {
      src: "/archive/telegraph-network-components.jpg",
      alt: "A technical print of components from an electromechanical telegraph network",
      title: "Electromechanical telegraph network",
      source: "https://wellcomecollection.org/works/jek2c46g",
      collection: "Wellcome Collection",
    },
    practice: {
      src: "/archive/magic-lantern-pedlar.jpg",
      alt: "A nineteenth-century print of a pedlar carrying a magic lantern",
      title: "The magic lantern pedlar",
      source: "https://wellcomecollection.org/works/vmg934fp",
      collection: "Wellcome Collection",
    },
  },
  literature: {
    hero: {
      src: "/archive/woman-reading-snow.jpg",
      alt: "Wood engraving of a woman reading against a wall as snow falls",
      title: "Woman reading in the snow",
      source: "https://wellcomecollection.org/works/gzttkz2a",
      collection: "Wellcome Collection",
      position: "50% 32%",
    },
    units: {
      src: "/archive/don-quixote-dore.jpg",
      alt: "Gustave Doré illustration of Don Quixote and Sancho Panza at a feast",
      title: "Don Quixote and Sancho Panza",
      source: "https://www.metmuseum.org/art/collection/search/436207",
      collection: "The Metropolitan Museum of Art",
    },
    assessment: {
      src: "/archive/melencolia-durer.jpg",
      alt: "Albrecht Dürer's engraving Melencolia I",
      title: "Melencolia I",
      source: "https://www.metmuseum.org/art/collection/search/336228",
      collection: "The Metropolitan Museum of Art",
    },
    resources: {
      src: "/archive/radcliffe-library-scholars.jpg",
      alt: "Engraving of scholars reading inside Oxford's Radcliffe Library",
      title: "Scholars in the Radcliffe Library",
      source: "https://wellcomecollection.org/works/zznsjvvx",
      collection: "Wellcome Collection",
    },
    practice: {
      src: "/archive/alchemist-reading.jpg",
      alt: "Engraving of an alchemist reading while assistants work at a crucible",
      title: "An alchemist reading",
      source: "https://wellcomecollection.org/works/f9hn6nyq",
      collection: "Wellcome Collection",
    },
  },
  "english-10": {
    hero: {
      src: "/archive/printing-workshop-stradanus.jpg",
      alt: "Wood engraving of printers setting type, inking, proofing, and operating a press",
      title: "The printing workshop",
      source: "https://wellcomecollection.org/works/czcn5src",
      collection: "Wellcome Collection",
      position: "50% 48%",
    },
    units: {
      src: "/archive/ptolemy-euclid-armillary-sphere.jpg",
      alt: "Engraving of Ptolemy and Euclid studying an armillary sphere",
      title: "Ptolemy and Euclid",
      source: "https://wellcomecollection.org/works/qpb3mqsx",
      collection: "Wellcome Collection",
    },
    assessment: {
      src: "/archive/man-sharpening-quill.jpg",
      alt: "Engraving of a seated man sharpening a quill pen",
      title: "A man sharpening a quill",
      source: "https://wellcomecollection.org/works/zp84mkcr",
      collection: "Wellcome Collection",
    },
    resources: {
      src: "/archive/alchemist-reading.jpg",
      alt: "Engraving of an alchemist reading while assistants work at a crucible",
      title: "An alchemist reading",
      source: "https://wellcomecollection.org/works/f9hn6nyq",
      collection: "Wellcome Collection",
    },
    practice: {
      src: "/archive/telegraph-network-components.jpg",
      alt: "A technical print of components from an electromechanical telegraph network",
      title: "Electromechanical telegraph network",
      source: "https://wellcomecollection.org/works/jek2c46g",
      collection: "Wellcome Collection",
    },
  },
};

function Credit({ plate }: { plate: Plate }) {
  return (
    <figcaption>
      {plate.title} · Public domain ·{" "}
      <a href={plate.source} rel="noopener noreferrer">
        {plate.collection}
      </a>
    </figcaption>
  );
}

function ScanMarks({ plate }: { plate: Plate }) {
  const openAccess = plate.collection.includes("Metropolitan");
  return (
    <div className="scan-marks" aria-hidden="true">
      <span>ARCHIVE / {openAccess ? "CC0" : "PDM"}</span>
      <i />
      <b>{openAccess ? "OA" : "PD"}</b>
    </div>
  );
}

export function ArchiveHero({ courseId }: { courseId: CourseId }) {
  const plate = plates[courseId].hero;
  return (
    <figure className="archive-hero">
      <div className="archive-image">
        <Image
          src={plate.src}
          alt={plate.alt}
          fill
          sizes="(max-width: 600px) 100vw, (max-width: 1100px) 65vw, 40vw"
          priority
          style={{ objectPosition: plate.position }}
        />
        <ScanMarks plate={plate} />
        <span aria-hidden="true">PLATE / 01</span>
      </div>
      <Credit plate={plate} />
    </figure>
  );
}

export function ArchiveCardArt({
  courseId,
  section,
}: {
  courseId: CourseId;
  section: Section;
}) {
  const plate = plates[courseId][section];
  return (
    <figure className="archive-card-art">
      <div>
        <Image
          src={plate.src}
          alt={plate.alt}
          fill
          sizes="(max-width: 800px) 100vw, 30vw"
        />
        <ScanMarks plate={plate} />
      </div>
      <Credit plate={plate} />
    </figure>
  );
}
