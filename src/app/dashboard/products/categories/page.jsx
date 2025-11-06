"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { useTranslation } from "react-i18next"
import { Plus, Loader2 } from "lucide-react"

import MenuTab from "@/components/shared/menuTab"
import { DataTable } from "@/components/shared/DataTable"
import { Button } from "@/components/ui/button"
import { getCategories } from "@/lib/actions"
import { getCategoriesColumns } from "@/lib/columns"
import { toastError } from "@/lib/toast"

const PRODUCTS_MENU = [
  {
    title: "Товары",
    description: "Просмотр, добавление и удаления товаров.",
    link: "/dashboard/products",
  },
  {
    title: "Категории",
    description: "Категории товаров",
    link: "/dashboard/products/categories",
  },
]

export default function CategoriesPage() {
  const { t, i18n } = useTranslation()
  const columns = useMemo(() => getCategoriesColumns(t, i18n.language), [t, i18n.language])

  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
  })

  useEffect(() => {
    const loadCategories = async () => {
      setLoading(true)
      try {
        const params = {
          page: pagination.page,
          limit: pagination.limit,
        }
        const response = await getCategories(params)
        const data = response.data || response.categories || []

        setCategories(Array.isArray(data) ? data : [])
        setPagination((prev) => ({
          ...prev,
          total:
            response.total ??
            response.meta?.total ??
            (Array.isArray(data) ? data.length : prev.total),
        }))
      } catch (error) {
        console.error("Error loading categories:", error)
        toastError({
          title: "Не удалось загрузить категории",
          description: error.message,
        })
      } finally {
        setLoading(false)
      }
    }

    loadCategories()
  }, [pagination.page, pagination.limit])

  const handlePageChange = (page, limit) => {
    setPagination((prev) => ({ ...prev, page, limit }))
  }

  const handleLimitChange = (limit) => {
    setPagination((prev) => ({ ...prev, page: 1, limit }))
  }

  return (
    <div className="w-11/12 mx-auto py-6 space-y-6">
      <div className="space-y-4">
        <h1 className="text-3xl font-bold">Категории</h1>
        <MenuTab menu={PRODUCTS_MENU.map((item) => ({ title: item.title, desc: item.description, link: item.link }))} />
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold">Список категорий</h2>
          <Link href="/dashboard/products/categories/add">
            <Button variant="ghost" className="border-2 h-12 px-5 w-auto">
              <Plus className="h-4 w-4 mr-2" />
              Добавить категорию
            </Button>
          </Link>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <DataTable
            columns={columns}
            allData={categories}
            defaultItemsPerPage={pagination.limit}
            totalData={pagination.total}
            serverSide={true}
            onPageChange={handlePageChange}
            onLimitChange={handleLimitChange}
          />
        )}
      </div>
    </div>
  )
}
