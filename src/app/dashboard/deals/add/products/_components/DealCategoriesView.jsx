"use client"

import Image from "next/image"
import Link from "next/link"
import { useTranslation } from "react-i18next"

export default function DealCategoriesView({ categories, querySuffix }) {
  const { t } = useTranslation()

  return (
    <div className="mx-auto flex w-11/12 max-w-5xl flex-col gap-10">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold text-gray-900">{t("dealCategories.title")}</h1>
        <p className="text-gray-500">{t("dealCategories.subtitle")}</p>
      </div>

      {categories.length === 0 ? (
        <div className="rounded-xl border border-dashed border-gray-300 bg-white p-12 text-center text-gray-500">
          {t("dealCategories.empty")}
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4">
          {categories.map((category) => {
            const name =
              category.name ||
              t("dealCategories.fallbackName", { index: category.index })
            const description = category.description

            return (
              <Link
                key={category.id}
                href={`/dashboard/deals/add/products/${encodeURIComponent(category.id)}${querySuffix}`}
                className="group flex h-full flex-col overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition hover:-translate-y-1 hover:border-gray-300 hover:shadow-md"
              >
                <div className="relative h-40 w-full bg-gray-100">
                  {category.image ? (
                    <Image
                      src={category.image}
                      alt={name}
                      fill
                      className="object-contain"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-sm text-gray-400">
                      {t("dealCategories.noImage")}
                    </div>
                  )}
                </div>
                <div className="flex-1 px-6 py-5">
                  <h2 className="text-lg font-semibold text-gray-900 group-hover:text-gray-950">
                    {name}
                  </h2>
                  {description && (
                    <p className="mt-2 text-sm text-gray-500">{description}</p>
                  )}
                </div>
                <span className="px-6 pb-4 text-sm font-medium text-gray-600 group-hover:text-gray-900">
                  {t("dealCategories.select")} →
                </span>
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}
