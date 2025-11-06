"use client"

import { DataTable } from '@/components/shared/DataTable'
import { getProductsColumns } from '@/lib/columns'
import { getLocalizedValue } from '@/lib/multilingual'
import { Button } from '@/components/ui/button'
import { Plus, Loader2, Search } from 'lucide-react'
import React, { useMemo, useState, useEffect } from 'react'
import Link from 'next/link'
import { useTranslation } from 'react-i18next'
import MenuTab from '@/components/shared/menuTab'
import { getProducts, getCategories } from '@/lib/actions'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { extractArrayFromResponse, toSelectOption } from '@/lib/utils/api-helpers'
import { toastError } from "@/lib/toast"

export default function ProductsPage() {
  const { t, i18n } = useTranslation();
  const columns = useMemo(() => getProductsColumns(t, i18n.language), [t, i18n.language]);

  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [categories, setCategories] = useState([])
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
  })

  const productsMenu = [
    {
      title: "Товары",
      description: "Просмотр, добавление и удаления товаров.",
      link: "/dashboard/products"
    },
    {
      title: "Категории",
      description: "Категории товаров",
      link: "/dashboard/products/categories"
    }
  ];

  // Load categories on mount
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const response = await getCategories({ limit: 100 })
        const raw = extractArrayFromResponse(response, ["categories"])
        const normalized = raw
          .map((item, index) => toSelectOption(item, index, `Категория ${index + 1}`))
          .filter(Boolean)
        setCategories(normalized)
      } catch (error) {
        console.error('Error loading categories:', error)
        setCategories([])
      }
    }

    loadCategories()
  }, [])

  // Load products with filters
  useEffect(() => {
    const loadProducts = async () => {
      setLoading(true)
      try {
        const params = {
          page: pagination.page,
          limit: pagination.limit,
        }

        if (searchQuery) {
          params.search = searchQuery
        }

        if (selectedCategory && selectedCategory !== 'all') {
          params.category_id = selectedCategory
        }

        const response = await getProducts(params)
        const productItems = extractArrayFromResponse(response, ["products"])
        setProducts(Array.isArray(productItems) ? productItems : [])
        setPagination(prev => ({
          ...prev,
          total:
            response?.meta?.total ??
            response?.total ??
            (Array.isArray(productItems) ? productItems.length : prev.total),
        }))
      } catch (error) {
        console.error('Error loading products:', error)
        toastError({
          title: "Не удалось загрузить товары",
          description: error.message,
        })
      } finally {
        setLoading(false)
      }
    }

    loadProducts()
  }, [pagination.page, pagination.limit, searchQuery, selectedCategory])

  // Debounced search - reset to page 1 when search changes
  useEffect(() => {
    const timer = setTimeout(() => {
      setPagination(prev => ({ ...prev, page: 1 }))
    }, 500)

    return () => clearTimeout(timer)
  }, [searchQuery])

  // Handle page change from DataTable
  const handlePageChange = (page, limit) => {
    setPagination(prev => ({ ...prev, page, limit }))
  }

  // Handle limit change from DataTable
  const handleLimitChange = (limit) => {
    setPagination({ page: 1, limit, total: pagination.total })
  }

  return (
    <div className="w-11/12 mx-auto py-6 space-y-6">
      {/* Menu Section */}
      <div className="space-y-4">
        <h1 className="text-3xl font-bold">Товары</h1>
        <MenuTab menu={productsMenu.map(m => ({ title: m.title, desc: m.description, link: m.link }))} />
      </div>

      {/* Products Table Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold">Список товаров</h2>
          <Link href="/dashboard/products/add">
            <Button variant={"ghost"} className={"border-2 h-12 px-5 w-auto"}>
              <Plus className="h-4 w-4 mr-2" />
              Добавить товар
            </Button>
          </Link>
        </div>

        {/* Filters */}
        <div className="flex gap-4 items-center">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Поиск товаров..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Все категории" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Все категории</SelectItem>
              {categories.map((category) => {
                const localized =
                  getLocalizedValue(category.name, i18n.language) ||
                  (category.raw
                    ? getLocalizedValue(category.raw.name || category.raw.title, i18n.language)
                    : "")
                const label =
                  (typeof localized === "string" && localized.trim().length > 0 ? localized : undefined) ||
                  (typeof category.displayName === "string" && category.displayName.trim().length > 0
                    ? category.displayName
                    : category.id)
                return (
                  <SelectItem key={category.id} value={category.id}>
                    {label}
                  </SelectItem>
                )
              })}
            </SelectContent>
          </Select>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <DataTable
            columns={columns}
            allData={products}
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
