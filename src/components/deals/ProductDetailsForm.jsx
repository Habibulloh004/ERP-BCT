"use client"

import { useMemo, useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Minus, Plus, ScanBarcode } from "lucide-react"
import { useTranslation } from "react-i18next"

import { useDealStore } from "@/store/dealStore"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { toastError, toastSuccess } from "@/lib/toast"
import { formatUSD } from "@/lib/utils/currency"

const clampQuantity = (value, min = 1, max = Number.POSITIVE_INFINITY) => {
  if (Number.isNaN(value)) return min
  return Math.min(Math.max(value, min), max)
}

export default function ProductDetailsForm({
  product,
  mode = "default",
  onAdded,
  onCancel,
  returnTo = "/dashboard/deals/add",
}) {
  const { t } = useTranslation()
  const router = useRouter()
  const addProductToDeal = useDealStore((state) => state.addProductToDeal)

  const [quantity, setQuantity] = useState(1)
  const [serialNumber, setSerialNumber] = useState(product.serialNumber || "")
  const [guarantee, setGuarantee] = useState(product.guarantee || "")
  const [comment, setComment] = useState("")
  const [isSubmitting, startTransition] = useTransition()

  const maxAvailable = useMemo(() => {
    if (!Number.isFinite(product.count)) return undefined
    return product.count
  }, [product.count])

  const handleAdd = () => {
    if (!product.id) {
      toastError({
        title: "Невозможно добавить товар",
        description: "Не удалось определить товар. Попробуйте снова.",
      })
      return
    }

    startTransition(() => {
      addProductToDeal({
        id: product.id,
        name: product.name,
        price: product.price,
        vat: product.vat ?? 0,
        discount: product.discount ?? 0,
        guarantee: guarantee || product.guarantee || "",
        quantity,
        serialNumber: serialNumber || product.serialNumber || "",
      })

      toastSuccess({
        title: "Товар добавлен в сделку",
        description: `${product.name} × ${quantity}`,
      })

      if (onAdded) {
        onAdded()
        return
      }

      if (returnTo) {
        router.push(returnTo)
        return
      }

      router.push("/dashboard/deals/add")
    })
  }

  const handleCancel = () => {
    if (onCancel) {
      onCancel()
      return
    }

    if (returnTo) {
      router.push(returnTo)
      return
    }

    router.back()
  }

  const quantityLabel = maxAvailable
    ? t("dealProduct.inStock", { count: maxAvailable })
    : t("dealProduct.stockUnknown")

  return (
    <section className="w-full rounded-3xl border border-slate-200 bg-white p-6 shadow-sm lg:p-8">
      <div className="grid gap-8 lg:grid-cols-[1.6fr_1fr] lg:items-start">
        <div className="space-y-6">
          <div className="space-y-4">
            <label className="block text-sm font-medium text-gray-700">{t("dealProduct.fields.product")}</label>
            <Input value={product.name} readOnly className="h-12 cursor-not-allowed bg-gray-100" />
          </div>

          <div className="space-y-4">
            <label className="block text-sm font-medium text-gray-700">{t("dealProduct.fields.serialNumber")}</label>
            <Input
              value={serialNumber}
              onChange={(event) => setSerialNumber(event.target.value)}
              placeholder={t("dealProduct.placeholders.serialNumber")}
              className="h-12"
            />
          </div>

          <div className="space-y-4">
            <label className="block text-sm font-medium text-gray-700">{t("dealProduct.fields.guarantee")}</label>
            <Input
              value={guarantee}
              onChange={(event) => setGuarantee(event.target.value)}
              placeholder={t("dealProduct.placeholders.guarantee")}
              className="h-12"
            />
          </div>

          {mode === "barcode" && (
            <div className="space-y-4">
              <label className="block text-sm font-medium text-gray-700">{t("dealProduct.fields.comment")}</label>
              <Textarea
                value={comment}
                onChange={(event) => setComment(event.target.value)}
                placeholder={t("dealProduct.placeholders.comment")}
                rows={3}
              />
            </div>
          )}

          <div className="space-y-3">
            <label className="block text-sm font-medium text-gray-700">{t("dealProduct.fields.quantity")}</label>
            <p className="text-xs text-gray-500">{quantityLabel}</p>
            <div className="flex items-center gap-3">
              <button
                type="button"
                className="flex h-12 w-12 items-center justify-center rounded-lg border border-gray-300 text-xl text-gray-700 transition hover:bg-gray-100"
                onClick={() =>
                  setQuantity((prev) => clampQuantity(prev - 1, 1, maxAvailable ?? Number.POSITIVE_INFINITY))
                }
              >
                <Minus className="h-5 w-5" />
              </button>
              <div className="min-w-14 rounded-lg border border-gray-200 bg-[#2E2F3B] px-4 py-2 text-center text-lg font-semibold text-white">
                {quantity}
              </div>
              <button
                type="button"
              className="flex h-12 w-12 items-center justify-center rounded-lg border border-gray-300 text-xl text-gray-700 transition hover:bg-gray-100"
              onClick={() =>
                setQuantity((prev) =>
                  clampQuantity(prev + 1, 1, maxAvailable ?? Number.POSITIVE_INFINITY),
                )
              }
            >
              <Plus className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div className="flex flex-col gap-3 pt-4">
          <Button
            className="h-12 w-full bg-black text-white hover:bg-black/80"
            onClick={handleAdd}
            disabled={isSubmitting || !serialNumber || !guarantee}
          >
            {t("dealProduct.actions.add")}
          </Button>
          <Button
            variant="outline"
            className="h-12 w-full border border-black text-black hover:bg-gray-100"
            onClick={handleCancel}
            disabled={isSubmitting}
          >
            {t("dealProduct.actions.cancel")}
          </Button>
        </div>
        </div>

        <div className="flex flex-col items-center gap-6 rounded-2xl border border-gray-200 bg-gray-50 p-6">
          <div className="relative h-48 w-full overflow-hidden rounded-xl bg-gray-100">
            {product.image ? (
              <Image src={product.image} alt={product.name} fill className="object-cover" />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-sm text-gray-400">
                {t("dealProduct.noImage")}
              </div>
            )}
          </div>
          <div className="w-full text-center">
            <h2 className="text-lg font-semibold text-gray-900">{product.name}</h2>
            <p className="mt-2 text-sm text-gray-500">{formatUSD(product.price)}</p>
            <p className="mt-1 text-xs text-gray-400">
              {Number.isFinite(product.count)
                ? t("dealProduct.stockCount", { count: product.count })
                : t("dealProduct.stockUnknown")}
            </p>
          </div>

          {mode === "barcode" && (
            <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-gray-300 p-6 text-center text-gray-700">
              <div className="flex h-16 w-16 items-center justify-center rounded-full border border-gray-300">
                <ScanBarcode className="h-8 w-8" />
              </div>
              <p className="text-sm font-medium">{t("dealProduct.scanHint")}</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
