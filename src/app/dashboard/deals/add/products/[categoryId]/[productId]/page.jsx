import Link from "next/link"
import { notFound } from "next/navigation"

import { ArrowLeft } from "lucide-react"

import ProductDetailsForm from "@/components/deals/ProductDetailsForm"
import { getCategoryById, getProductById } from "@/lib/actions"
import { getLocalizedValue } from "@/lib/multilingual"
import { getFileUrl } from "@/lib/utils/api-helpers"
import { Button } from "@/components/ui/button"

const normaliseProduct = (product) => {
  if (!product || typeof product !== "object") {
    return null
  }

  const id =
    product.id ??
    product._id ??
    product.uuid ??
    product.guid ??
    product.ID ??
    product.Id ??
    product.code ??
    product.value

  if (!id) return null

  const images = product.images ?? product.image ?? product.photos ?? product.files ?? []
  const firstImage = Array.isArray(images) && images.length > 0 ? images[0] : images

  return {
    id: String(id),
    name:
      getLocalizedValue(product.name) ||
      product.title ||
      product.label ||
      `Товар ${id}`,
    price: Number(product.price ?? product.cost ?? 0),
    guarantee:
      getLocalizedValue(product.guarantee) ??
      getLocalizedValue(product.warranty) ??
      product.guarantee ??
      product.warranty ??
      "",
    serialNumber: product.serial_number || product.serial || "",
    count: Number(product.count ?? product.quantity ?? 0),
    vat: Number(product.NDC ?? product.vat ?? 0),
    discount: Number(product.discount ?? 0),
    description: getLocalizedValue(product.description) || product.description || "",
    image: typeof firstImage === "string" ? getFileUrl(firstImage) : getFileUrl(firstImage?.url),
  }
}

const normaliseCategory = (category) => {
  if (!category || typeof category !== "object") {
    return { id: "", name: "Категория" }
  }
  const id =
    category.id ??
    category._id ??
    category.uuid ??
    category.guid ??
    category.ID ??
    category.Id ??
    category.code ??
    category.value ??
    ""
  return {
    id: String(id),
    name: getLocalizedValue(category.name) || category.title || "Категория",
  }
}

export default async function ProductDetailsPage({ params, searchParams }) {
  const { categoryId, productId } = await params
  const [categoryResponse, productResponse] = await Promise.all([
    getCategoryById(categoryId),
    getProductById(productId),
  ])

  if (!productResponse) {
    notFound()
  }

  const category = normaliseCategory(categoryResponse?.data || categoryResponse)
  const product = normaliseProduct(productResponse?.data || productResponse)

  if (!product) {
    notFound()
  }

  const query = new URLSearchParams(await searchParams)
  const fullQueryString = query.toString()
  const querySuffix = fullQueryString ? `?${fullQueryString}` : ""
  const baseQuery = new URLSearchParams(query)
  baseQuery.delete("returnTo")
  const baseSuffix = baseQuery.toString() ? `?${baseQuery.toString()}` : ""
  const returnTo =
    query.get("returnTo") || `/dashboard/deals/add${baseSuffix}`

  return (
    <div className="min-h-screen bg-[#f8f8f8] py-10">
      <div className="mx-auto flex w-11/12 max-w-5xl flex-col gap-10">
        <div className="flex items-center justify-between gap-4">
          <div className="space-y-1">
            <h1 className="text-3xl font-bold text-gray-900">Добавить товар</h1>
            <p className="text-gray-500">
              {category.name} / {product.name}
            </p>
          </div>
          <Button variant="ghost" asChild className="flex items-center gap-2 text-gray-600 hover:text-gray-900">
            <Link
              href={`/dashboard/deals/add/products/${encodeURIComponent(category.id || categoryId)}${querySuffix}`}
            >
              <ArrowLeft className="h-4 w-4" />
              Назад к товарам
            </Link>
          </Button>
        </div>

        <ProductDetailsForm product={product} returnTo={returnTo} />
      </div>
    </div>
  )
}
