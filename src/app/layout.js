import { Poppins } from "next/font/google";
import "./globals.css";
import "@/lib/i18n";
import LanguageProvider from "@/providers/LanguageProvider";
import NextTopLoader from "nextjs-toploader";
import ScreenSizeGate from "@/components/shared/ScreenSizeGate";

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
          <NextTopLoader
            color="#495058"              // rang
            initialPosition={0.08}    // boshlang‘ich progress
            crawlSpeed={200}
            height={3}                // chiziq balandligi (px)
            crawl                     // sekin “yurish” effekti
            showSpinner={false}       // spinnerni o‘chirib qo‘yish
            easing="ease"
            speed={200}
            shadow="0 0 10px #29D, 0 0 5px #29D" // ixtiyoriy soyalar
          />
          <ScreenSizeGate>
            {children}
          </ScreenSizeGate>
        </LanguageProvider>
      </body>
    </html>
  );
}
