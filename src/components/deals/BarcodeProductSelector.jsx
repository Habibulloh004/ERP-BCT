"use client"

import { useEffect, useMemo, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useActionState } from "react"

import { searchProductsByBarcode } from "@/app/dashboard/deals/add/barcode/actions"
import ProductDetailsForm from "@/components/deals/ProductDetailsForm"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

const initialState = { items: [], error: null }

export default function BarcodeProductSelector({ returnTo: explicitReturnTo }) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [state, formAction, pending] = useActionState(searchProductsByBarcode, initialState)
  const [selectedProductId, setSelectedProductId] = useState("")

  const selectedProduct = useMemo(() => {
    if (!state.items || state.items.length === 0) return null
    const fallback = state.items[0]
    return state.items.find((item) => item.id === selectedProductId) || fallback
  }, [state.items, selectedProductId])

  useEffect(() => {
    if (state.items && state.items.length > 0) {
      setSelectedProductId(state.items[0].id)
    } else {
      setSelectedProductId("")
    }
  }, [state.items])

  const returnTo = explicitReturnTo || searchParams.get("returnTo") || "/dashboard/deals/add"

  return (
    <div className="min-h-screen bg-[#f8f8f8] py-10">
      <div className="mx-auto flex w-11/12 max-w-5xl flex-col gap-10">
        <div className="flex items-center justify-between gap-4">
          <div className="space-y-1">
            <h1 className="text-3xl font-bold text-gray-900">Товар по штрих коду</h1>
            <p className="text-gray-500">
              Введите штрих код, чтобы найти товар и добавить его в сделку.
            </p>
          </div>
          <Button
            variant="ghost"
            onClick={() => router.push(returnTo)}
            className="text-gray-600 hover:text-gray-900"
          >
            &larr; Назад
          </Button>
        </div>

        <form
          action={formAction}
          className="flex flex-col gap-4 rounded-2xl bg-white p-6 shadow-sm md:flex-row md:items-center md:gap-6"
        >
          <div className="flex-1 space-y-2">
            <label className="block text-sm font-medium text-gray-700">Штрих код</label>
            <Input
              name="barcode"
              placeholder="Введите или отсканируйте штрих код"
              className="h-12"
              autoFocus
            />
          </div>
          <Button
            type="submit"
            className="h-12 w-full bg-black px-6 text-white hover:bg-black/80 md:w-auto"
            disabled={pending}
          >
            {pending ? "Поиск..." : "Найти"}
          </Button>
        </form>

        {state.error && (
          <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-600">
            {state.error}
          </div>
        )}

        {state.items && state.items.length > 0 && selectedProduct && (
          <div className="flex flex-col gap-8">
            {state.items.length > 1 && (
              <div className="rounded-2xl bg-white p-6 shadow-sm">
                <h2 className="text-lg font-semibold text-gray-900">Найденные товары</h2>
                <div className="mt-4 flex flex-wrap gap-3">
                  {state.items.map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      className={`rounded-full border px-4 py-2 text-sm transition ${
                        selectedProductId === item.id
                          ? "border-black bg-black text-white"
                          : "border-gray-300 text-gray-700 hover:border-gray-400"
                      }`}
                      onClick={() => setSelectedProductId(item.id)}
                    >
                      {item.name}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <ProductDetailsForm
              product={selectedProduct}
              mode="barcode"
              onAdded={() => router.push(returnTo)}
              onCancel={() => router.push(returnTo)}
              returnTo={returnTo}
            />
          </div>
        )}
      </div>
    </div>
  )
}
