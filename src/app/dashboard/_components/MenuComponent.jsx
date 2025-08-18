"use client"

import { useTranslation } from "react-i18next";
import MenuTab from "@/components/shared/menuTab";

export default function MenuComponent() {
  const { t } = useTranslation();

  const keys = ["newOrder", "deal", "clients", "products", "warehouse"];
  const menu = keys.map((k) => ({
    title: t(`homePage.menu.${k}.title`),
    desc: t(`homePage.menu.${k}.desc`),
  }));

  return (
    <div className="w-11/12 mx-auto pt-4 space-y-4">
      <h1 className="text-4xl">{t("homePage.page.homeTitle")}</h1>
      <div className="space-y-3 ml-5">
        <MenuTab menu={menu} />
      </div>
    </div>
  );
}
