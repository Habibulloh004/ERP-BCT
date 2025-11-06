"use client"

import Image from "next/image"
import Link from "next/link"
import { useTranslation } from "react-i18next"
import { formatUSD } from "@/lib/utils/currency"

export default function CategoryProductsView({ category, products, querySuffix }) {
  const { t } = useTranslation()

  const categoryName =
    category.name || t("dealProducts.fallbackCategory")

  return (
    <div className="mx-auto flex w-11/12 max-w-5xl flex-col gap-8">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{categoryName}</h1>
          <p className="text-gray-500">
            {t("dealProducts.subtitle")}
          </p>
        </div>
        <Link
          href={`/dashboard/deals/add/products${querySuffix}`}
          className="text-sm font-medium text-gray-600 transition hover:text-gray-900"
        >
          ← {t("dealProducts.back")}
        </Link>
      </div>

      {products.length === 0 ? (
        <div className="rounded-xl border border-dashed border-gray-300 bg-white p-12 text-center text-gray-500">
          {t("dealProducts.empty")}
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4">
          {products.map((product) => {
            const name =
              product.name ||
              t("dealProducts.fallbackName", { index: product.index })
            const description = product.description
            const stockText = Number.isFinite(product.count) && product.count > 0
              ? t("dealProducts.inStock", { count: product.count })
              : t("dealProducts.stockUnknown")

            return (
              <Link
                key={product.id}
                href={`/dashboard/deals/add/products/${encodeURIComponent(category.id)}/${encodeURIComponent(product.id)}${querySuffix}`}
                className="p-4 flex h-full flex-col overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition hover:-translate-y-1 hover:border-gray-300 hover:shadow-md"
              >
                <div className="relative h-40 w-full bg-gray-100 rounded-2xl">
                  {product.image ? (
                    <Image
                      src={product.image}
                      alt={name}
                      fill
                      className="object-contain"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-sm text-gray-400">
                      {t("dealProducts.noImage")}
                    </div>
                  )}
                </div>
                <div className="flex flex-1 flex-col gap-2 px-6 py-5">
                  <h2 className="text-md line-clamp-2 font-semibold text-gray-900">{name}</h2>
                  <p className="text-sm text-gray-600 line-clamp-2">
                    {description || t("dealProducts.noDescription")}
                  </p>
                </div>
                <div className="mt-auto flex items-center justify-between text-sm text-gray-700">
                  <span className="font-semibold">{formatUSD(product.price)}</span>
                  <span className="text-xs text-gray-500">
                    {stockText}
                  </span>
                </div>
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}
