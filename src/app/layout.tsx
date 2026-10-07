import { AppProviders } from "@/contexts/providers";
import type { Metadata, Viewport } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "BJJHub",
    template: "%s · BJJHub",
  },
  description: "Sua academia em evolução. Da matrícula à faixa-preta.",
  applicationName: "BJJHub",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "BJJHub",
  },
};

export const viewport: Viewport = {
  themeColor: "#050609",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="pt-BR" className={`${outfit.variable} h-full antialiased`}>
      <body className="h-full bg-black text-ink">
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
