"use client"

import { useMemo } from "react"

import { useTranslation } from "react-i18next"

import { useDealStore, type DealProduct } from "@/store/dealStore"

import { formatUSD } from "@/lib/utils/currency"

const calculateTotals = (product: DealProduct) => {
  const subtotal = product.price * product.quantity
  const vatAmount = subtotal * (product.vat / 100)
  const discountAmount = subtotal * (product.discount / 100)
  const total = subtotal + vatAmount - discountAmount

  return {
    subtotal,
    vatAmount,
    discountAmount,
    total,
  }
}

export default function DealTable() {
  const { t } = useTranslation()
  const products = useDealStore((state) => state.dealProducts)

  const summary = useMemo(() => {
    return products.reduce(
      (acc, item) => {
        const { subtotal, vatAmount, discountAmount } = calculateTotals(item)
        acc.quantity += item.quantity
        acc.subtotal += subtotal
        acc.vat += vatAmount
        acc.discount += discountAmount
        return acc
      },
      { quantity: 0, subtotal: 0, vat: 0, discount: 0 },
    )
  }, [products])

  return (
    <div className="overflow-hidden rounded-lg bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                {t("dealTable.headers.serial")}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                {t("dealTable.headers.name")}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                {t("dealTable.headers.quantity")}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                {t("dealTable.headers.price")}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                {t("dealTable.headers.vat")}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                {t("dealTable.headers.discount")}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                {t("dealTable.headers.total")}
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {products.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-6 py-12 text-center text-sm text-gray-500">
                  {t("dealTable.empty")}
                </td>
              </tr>
            ) : (
              products.map((product) => {
                const { total } = calculateTotals(product)
                return (
                  <tr key={product.uid}>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900">
                      {product.serialNumber}
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">
                      {product.name}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                      {product.quantity}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                      {formatUSD(product.price)}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                      {t("dealTable.values.percent", { value: product.vat })}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                      {t("dealTable.values.percent", { value: product.discount })}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm font-semibold text-gray-900">
                      {formatUSD(total)}
                    </td>
                  </tr>
                )
              })
            )}
          </tbody>
        </table>
      </div>

      {products.length > 0 && (
        <div className="grid gap-2 border-t border-gray-100 bg-gray-50 px-6 py-4 text-sm text-gray-700 md:grid-cols-4">
          <div className="font-medium">
            {t("dealTable.summary.items", { count: summary.quantity })}
          </div>
          <div>{t("dealTable.summary.subtotal", { amount: formatUSD(summary.subtotal) })}</div>
          <div>{t("dealTable.summary.vat", { amount: formatUSD(summary.vat) })}</div>
          <div>{t("dealTable.summary.discount", { amount: formatUSD(summary.discount) })}</div>
        </div>
      )}
    </div>
  )
}
