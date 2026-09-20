import InteriorShell from "./interior-shell";
export default function GlobalShell({children}:{children:React.ReactNode}) {
  return <InteriorShell>{children}</InteriorShell>;
}
