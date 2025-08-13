import { Poppins } from "next/font/google";
import "./globals.css";
import "@/lib/i18n";
import LanguageProvider from "@/providers/LanguageProvider";

const poppins = Poppins({
  subsets: ["latin"],
  variable: "--font-poppins",
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"], // barcha qalinliklar
});

export const metadata = {
  title: "BCT ERP — Бизнес Контрол ва Трекинг",
  description: "Ягона тизимда савдо, омбор, молия ва ишлаб чиқаришни бошқариш.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${poppins.variable} antialiased font-poppins`}>
        <LanguageProvider>
          {children}
        </LanguageProvider>
      </body>
    </html>
  );
}
