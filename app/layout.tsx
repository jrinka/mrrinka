import type { Metadata } from "next";
import "./globals.css";
export const metadata: Metadata = {
  title: { default: "Mr Rinka | English", template: "%s | Mr Rinka" },
  description:
    "Resources, texts, and interactive practice for IB English A and English 10.",
};
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head><script dangerouslySetInnerHTML={{__html:`try{var t=localStorage.getItem('mrrinka-theme');document.documentElement.dataset.theme=t==='dark'?'dark':'light';}catch{}`}} /></head>
      <body>{children}</body>
    </html>
  );
}
