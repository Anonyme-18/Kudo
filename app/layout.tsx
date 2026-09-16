import type { Metadata } from "next";
import { ThemePanel } from "@/components/ThemePanel";
import "@/styles.css";

export const metadata: Metadata = {
  title: "Kudo — La prise de notes pensée pour les étudiants africains",
  description:
    "Kudo transforme cours, PDF et audios en notes claires, même hors ligne.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="fr">
      <body suppressHydrationWarning>
        {children}
        <ThemePanel />
      </body>
    </html>
  );
}
