"use client"

import React, { useState, useEffect, useMemo } from 'react'
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import CustomFormField, { FormFieldType } from "@/components/shared/customFormField"
import MultilingualInput from "@/components/shared/MultilingualInput"
import { Button } from '@/components/ui/button'
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form"
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useRouter } from 'next/navigation'
import { SelectItem } from '@/components/ui/select'
import AddImages from '@/components/shared/AddImages'
import { ArrowLeft, Save, Edit, Trash2 } from 'lucide-react'
import Link from 'next/link'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { createProduct, updateProduct, deleteProduct, getCategories, getTopCategories } from '@/lib/actions'
import { buildImageUrls, extractArrayFromResponse, toSelectOption, ensureOption } from '@/lib/utils/api-helpers'
import { toastError, toastSuccess, toastWarning } from "@/lib/toast"
import { parseMultilingual, stringifyMultilingual, hasMultilingualContent, getLocalizedValue } from "@/lib/multilingual"
import { useTranslation } from "react-i18next"
import { FormLanguageProvider } from "@/components/forms/FormLanguageContext"
import FormLanguageToolbar from "@/components/forms/FormLanguageToolbar"
import ProductDescriptionEditor from "@/components/forms/ProductDescriptionEditor"
import { parseDescriptionState, serializeDescriptionState } from "@/lib/utils/product-description"

export default function ProductForm({ type, data = null, productId = null }) {
  const router = useRouter()
  const { i18n } = useTranslation()
  const [isLoading, setIsLoading] = useState(false)
  const [categories, setCategories] = useState([])
  const [loadingCategories, setLoadingCategories] = useState(true)
  const [topCategories, setTopCategories] = useState([])
  const [loadingTopCategories, setLoadingTopCategories] = useState(true)
  const initialImageSource =
    data?.images ??
    data?.image ??
    data?.imageUrl ??
    data?.photos ??
    data?.files ??
    null
  const [images, setImages] = useState(
    initialImageSource ? buildImageUrls(initialImageSource) : []
  )

  const isReadonly = type === 'show'
  const isEdit = type === 'edit'
  const isAdd = type === 'add'

  useEffect(() => {
    const nextSource =
      data?.images ??
      data?.image ??
      data?.imageUrl ??
      data?.photos ??
      data?.files ??
      null
    setImages(nextSource ? buildImageUrls(nextSource) : [])
  }, [data])

  // Load categories on mount or when product data changes
  useEffect(() => {
    let isMounted = true

    const loadCategories = async () => {
      setLoadingCategories(true)
      try {
        const response = await getCategories({ limit: 100 })
        const raw = extractArrayFromResponse(response, ["categories"])
        const normalized = raw
          .map((item, index) => toSelectOption(item, index, `Категория ${index + 1}`))
          .filter(Boolean)

        let merged = normalized

        merged = ensureOption(
          merged,
          data?.category,
          data?.category_name ||
            data?.categoryTitle ||
            (typeof data?.category === "string" ? data.category : undefined) ||
            "Выбранная категория",
        )

        merged = ensureOption(
          merged,
          data?.category_id || data?.categoryId
            ? {
                id: data?.category_id ?? data?.categoryId,
                name:
                  data?.category_name ||
                  data?.categoryTitle ||
                  data?.category_label ||
                  data?.categoryLabel ||
                  (typeof data?.category === "string" ? data.category : undefined),
              }
            : null,
          data?.category_name ||
            data?.categoryTitle ||
            data?.category_label ||
            data?.categoryLabel ||
            "Выбранная категория",
        )

        if (isMounted) {
          setCategories(merged.filter(Boolean))
        }
      } catch (error) {
        console.error('Error loading categories:', error)
        if (isMounted) {
          setCategories([])
        }
        toastError({ title: 'Не удалось загрузить категории' })
      } finally {
        if (isMounted) {
          setLoadingCategories(false)
        }
      }
    }

    loadCategories()

    return () => {
      isMounted = false
    }
  }, [data])

  useEffect(() => {
    let isMounted = true

    const loadTopCategories = async () => {
      setLoadingTopCategories(true)
      try {
        const response = await getTopCategories({ limit: 100 })
        const raw = extractArrayFromResponse(response, ["top_categories"])
        const normalized = raw
          .map((item, index) => toSelectOption(item, index, `Топ категория ${index + 1}`))
          .filter(Boolean)

        let merged = normalized

        merged = ensureOption(
          merged,
          data?.top_category,
          data?.top_category_name ||
            data?.topCategoryName ||
            (typeof data?.top_category === "string" ? data.top_category : undefined) ||
            "Выбранная топ-категория",
        )

        merged = ensureOption(
          merged,
          data?.top_category_id || data?.topCategoryId
            ? {
                id: data?.top_category_id ?? data?.topCategoryId,
                name:
                  data?.top_category_name ||
                  data?.topCategoryName ||
                  data?.top_category_label ||
                  data?.topCategoryLabel ||
                  (typeof data?.top_category === "string" ? data.top_category : undefined),
              }
            : null,
          data?.top_category_name ||
            data?.topCategoryName ||
            data?.top_category_label ||
            data?.topCategoryLabel ||
            "Выбранная топ-категория",
        )

        if (isMounted) {
          setTopCategories(merged.filter(Boolean))
        }
      } catch (error) {
        console.error('Error loading top categories:', error)
        if (isMounted) {
          setTopCategories([])
        }
      } finally {
        if (isMounted) {
          setLoadingTopCategories(false)
        }
      }
    }

    loadTopCategories()

    return () => {
      isMounted = false
    }
  }, [data])

  const toNumberOptional = (value) => {
    if (value === null || value === undefined || value === "") return undefined
    if (typeof value === "number") return value
    if (typeof value === "string") {
      const parsed = Number(value)
      return Number.isNaN(parsed) ? value : parsed
    }
    return value
  }

  const ProductValidation = z.object({
    name: z
      .string()
      .refine(
        (value) => hasMultilingualContent(parseMultilingual(value)),
        "Название обязательно для заполнения",
      ),
    ads_title: z.string().optional(),
    category_id: z.string().min(1, "Категория обязательна для заполнения"),
    top_category_id: z.string().optional(),
    warranty: z.string().optional(),
    price: z.preprocess(toNumberOptional, z.number({ invalid_type_error: "Укажите цену" }).min(0, "Цена не может быть отрицательной")),
    description: z.string().optional(),
    params: z.string().optional(),
    serial_number: z.string().optional(),
    shtrix_number: z.string().optional(),
    discount: z.preprocess(toNumberOptional, z.number().optional()),
    count: z.preprocess(toNumberOptional, z.number({ invalid_type_error: "Укажите количество" }).min(0, "Количество не может быть отрицательным")),
    ndc: z.preprocess(toNumberOptional, z.number().optional()),
    tax: z.preprocess(toNumberOptional, z.number({ invalid_type_error: "Укажите налог" }).min(0, "Налог не может быть отрицательным")),
  })

  const initialDescription = useMemo(
    () => serializeDescriptionState(parseDescriptionState(data?.description)),
    [data],
  )

  const form = useForm({
    resolver: zodResolver(ProductValidation),
    defaultValues: {
      name: data?.name || "",
      ads_title: data?.ads_title || data?.adsTitle || "",
      category_id: data?.category_id?.toString() || data?.category?.id?.toString() || "",
      top_category_id: data?.top_category_id?.toString() || data?.top_category?.id?.toString() || "",
      warranty: data?.warranty || data?.guarantee || "",
      price: data?.price !== undefined && data?.price !== null ? String(data?.price) : "0",
      description: initialDescription,
      params: data?.params || "",
      serial_number: data?.serial_number || "",
      shtrix_number: data?.shtrix_number || data?.barcode || "",
      discount: data?.discount !== undefined && data?.discount !== null ? String(data?.discount) : "",
      count: data?.count !== undefined && data?.count !== null ? String(data?.count) : "0",
      ndc: data?.NDC !== undefined && data?.NDC !== null ? String(data?.NDC) : "",
      tax: data?.tax !== undefined && data?.tax !== null ? String(data?.tax) : "0",
    },
    mode: "onSubmit",
  })

  const onSubmit = async (values) => {
    setIsLoading(true)

    try {
      // Validate that at least one image is uploaded
      if (images.length === 0) {
        toastWarning({ title: "Загрузите хотя бы одно изображение" })
        setIsLoading(false)
        return
      }

      // Prepare product data
      const nameMultilingual = parseMultilingual(values.name)
      const adsTitleMultilingual = parseMultilingual(values.ads_title || "")
      const warrantyMultilingual = parseMultilingual(values.warranty || "")
      const paramsMultilingual = parseMultilingual(values.params || "")
      const priceValue = typeof values.price === "number" ? values.price : Number(values.price || 0)

      const productData = {
        name: stringifyMultilingual(nameMultilingual),
        ads_title: hasMultilingualContent(adsTitleMultilingual)
          ? stringifyMultilingual(adsTitleMultilingual)
          : "",
        category_id: values.category_id,
        top_category_id: values.top_category_id || undefined,
        warranty: hasMultilingualContent(warrantyMultilingual)
          ? stringifyMultilingual(warrantyMultilingual)
          : "",
        guarantee: hasMultilingualContent(warrantyMultilingual)
          ? stringifyMultilingual(warrantyMultilingual)
          : "",
        price: priceValue,
        description: serializeDescriptionState(parseDescriptionState(values.description)),
        params: hasMultilingualContent(paramsMultilingual)
          ? stringifyMultilingual(paramsMultilingual)
          : "",
        serial_number: values.serial_number?.trim() || "",
        shtrix_number: values.shtrix_number?.trim() || "",
        discount:
          values.discount === undefined || values.discount === null
            ? null
            : Number(values.discount),
        count: Number(values.count ?? 0),
        NDC:
          values.ndc === undefined || values.ndc === null
            ? null
            : Number(values.ndc),
        tax: Number(values.tax ?? 0),
        images: images.map((img) => img.path || img.url || img.preview),
      }

      let result
      if (isEdit) {
        result = await updateProduct(productId, productData)
        toastSuccess({ title: "Товар успешно обновлен!" })
      } else {
        result = await createProduct(productData)
        toastSuccess({ title: "Товар успешно добавлен!" })
      }

      router.push('/dashboard/products')
    } catch (error) {
      console.error("Error saving product:", error)
      toastError({
        title: "Ошибка при сохранении товара",
        description: error.message,
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async () => {
    setIsLoading(true)
    try {
      await deleteProduct(productId)
      toastSuccess({ title: "Товар успешно удален!" })
      router.push('/dashboard/products')
    } catch (error) {
      console.error("Error deleting product:", error)
      toastError({
        title: "Ошибка при удалении товара",
        description: error.message,
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <FormLanguageProvider initialLanguage={i18n.language}>
      <div className='mx-auto w-11/12 py-6'>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Link href="/dashboard/products">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold">
              {isAdd && "Добавить товар"}
              {isEdit && "Редактировать товар"}
              {isReadonly && "Информация о товаре"}
            </h1>
            <p className="text-muted-foreground">
              {isAdd && "Заполните информацию о новом товаре"}
              {isEdit && "Обновите информацию о товаре"}
              {isReadonly && `ID товара: ${productId}`}
            </p>
          </div>
        </div>

        {/* Show mode actions */}
        {isReadonly && (
          <div className="flex gap-2">
            <Link href={`/dashboard/products/${productId}?type=edit`}>
              <Button variant="outline" className="gap-2">
                <Edit className="h-4 w-4" />
                Редактировать
              </Button>
            </Link>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" className="gap-2">
                  <Trash2 className="h-4 w-4" />
                  Удалить
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Вы уверены?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Это действие нельзя отменить. Товар будет удален безвозвратно.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Отмена</AlertDialogCancel>
                  <AlertDialogAction onClick={handleDelete}>Удалить</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        )}
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormLanguageToolbar className="mb-6" />

          {/* Main Grid Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-[70%_30%] gap-6">

            {/* LEFT SECTION - Form Fields */}
            <div className="space-y-6">
              {/* Basic Information Card */}
              <Card>
              <CardHeader>
                <CardTitle>Основная информация</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Название товара</FormLabel>
                        <FormControl>
                          <MultilingualInput
                            value={parseMultilingual(field.value)}
                            onChange={(updated) => field.onChange(stringifyMultilingual(updated))}
                            placeholder="Введите название товара"
                            disabled={isReadonly}
                            className="h-11 rounded-2xl border border-slate-200 bg-white px-4 text-primary"
                            hideLanguageSwitcher
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="ads_title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Рекламный заголовок</FormLabel>
                        <FormControl>
                          <MultilingualInput
                            value={parseMultilingual(field.value)}
                            onChange={(updated) => field.onChange(stringifyMultilingual(updated))}
                            placeholder="Введите рекламный заголовок"
                            disabled={isReadonly}
                            className="h-11 rounded-2xl border border-slate-200 bg-white px-4 text-primary"
                            hideLanguageSwitcher
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="text-primary grid grid-cols-1 md:grid-cols-2 gap-4">
                    <CustomFormField
                      fieldType={FormFieldType.SELECT}
                      control={form.control}
                      name="category_id"
                      label="Категория"
                      placeholder={loadingCategories ? "Загрузка..." : "Выберите категорию"}
                      required
                      disabled={isReadonly || loadingCategories}
                    >
                      {categories.map((category) => {
                        const localized =
                          getLocalizedValue(category.name, i18n.language) ||
                          (category.raw
                            ? getLocalizedValue(
                                category.raw.name || category.raw.title,
                                i18n.language,
                              )
                            : "")
                        const label =
                          (typeof localized === "string" && localized.trim().length > 0
                            ? localized
                            : undefined) ||
                          (typeof category.displayName === "string" && category.displayName.trim().length > 0
                            ? category.displayName
                            : category.id)
                        return (
                          <SelectItem key={category.id} value={category.id}>
                            {label}
                          </SelectItem>
                        )
                      })}
                    </CustomFormField>

                    <CustomFormField
                      fieldType={FormFieldType.SELECT}
                      control={form.control}
                      name="top_category_id"
                      label="Топ категория"
                      placeholder={loadingTopCategories ? "Загрузка..." : "Выберите топ-категорию"}
                      disabled={isReadonly || loadingTopCategories}
                    >
                      {topCategories.map((topCategory) => {
                        const localized =
                          getLocalizedValue(topCategory.name, i18n.language) ||
                          (topCategory.raw
                            ? getLocalizedValue(
                                topCategory.raw.name || topCategory.raw.title,
                                i18n.language,
                              )
                            : "")
                        const label =
                          (typeof localized === "string" && localized.trim().length > 0
                            ? localized
                            : undefined) ||
                          (typeof topCategory.displayName === "string" &&
                          topCategory.displayName.trim().length > 0
                            ? topCategory.displayName
                            : topCategory.id)
                        return (
                          <SelectItem key={topCategory.id} value={topCategory.id}>
                            {label}
                          </SelectItem>
                        )
                      })}
                    </CustomFormField>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="warranty"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Гарантия</FormLabel>
                          <FormControl>
                          <MultilingualInput
                            value={parseMultilingual(field.value)}
                            onChange={(updated) => field.onChange(stringifyMultilingual(updated))}
                            placeholder="Введите информацию о гарантии"
                            disabled={isReadonly}
                            className="h-11 rounded-2xl border border-slate-200 bg-white px-4 text-primary"
                            hideLanguageSwitcher
                          />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <CustomFormField
                      fieldType={FormFieldType.NUMBER}
                      control={form.control}
                      name="price"
                      label="Стоимость (USD)"
                      placeholder="0.00"
                      required
                      disabled={isReadonly}
                      inputClass="h-11 rounded-md border text-primary"
                      step="0.01"
                      inputMode="decimal"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <CustomFormField
                      fieldType={FormFieldType.INPUT}
                      control={form.control}
                      name="serial_number"
                      label="Серийный номер"
                      placeholder="Введите серийный номер"
                      disabled={isReadonly}
                      inputClass="h-11 rounded-md border text-primary"
                    />
                    <CustomFormField
                      fieldType={FormFieldType.INPUT}
                      control={form.control}
                      name="shtrix_number"
                      label="Штрих-код"
                      placeholder="Введите штрих-код"
                      disabled={isReadonly}
                      inputClass="h-11 rounded-md border text-primary"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <CustomFormField
                      fieldType={FormFieldType.NUMBER}
                      control={form.control}
                      name="discount"
                      label="Скидка"
                      placeholder="0"
                      disabled={isReadonly}
                      inputClass="h-11 rounded-md border text-primary"
                    />
                    <CustomFormField
                      fieldType={FormFieldType.NUMBER}
                      control={form.control}
                      name="count"
                      label="Количество на складе"
                      placeholder="0"
                      disabled={isReadonly}
                      inputClass="h-11 rounded-md border text-primary"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <CustomFormField
                      fieldType={FormFieldType.NUMBER}
                      control={form.control}
                      name="ndc"
                      label="НДС"
                      placeholder="0"
                      disabled={isReadonly}
                      inputClass="h-11 rounded-md border text-primary"
                    />
                    <CustomFormField
                      fieldType={FormFieldType.NUMBER}
                      control={form.control}
                      name="tax"
                      label="Сборы/налог"
                      placeholder="0"
                      disabled={isReadonly}
                      inputClass="h-11 rounded-md border text-primary"
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Description Card */}
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <ProductDescriptionEditor
                    value={field.value}
                    onChange={field.onChange}
                    disabled={isReadonly}
                  />
                )}
              />

              <Card>
                <CardHeader>
                  <CardTitle>Технические характеристики</CardTitle>
                </CardHeader>
                <CardContent>
                  <FormField
                    control={form.control}
                    name="params"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <MultilingualInput
                            type="textarea"
                            value={parseMultilingual(field.value)}
                            onChange={(updated) => field.onChange(stringifyMultilingual(updated))}
                            placeholder={
                              "Введите технические характеристики товара...\\nПример:\\n- Процессор: Intel Core i7\\n- Память: 16GB RAM\\n- Диск: 512GB SSD"
                            }
                            disabled={isReadonly}
                            className="min-h-[160px] rounded-2xl border border-slate-200 bg-white px-4 py-3 font-mono text-sm"
                            hideLanguageSwitcher
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
            </div>

            {/* RIGHT SECTION - Images Upload */}
            <div>
              {isReadonly ? (
                <Card className="h-fit sticky top-24">
                  <CardHeader>
                    <CardTitle className="text-lg">Изображения товара</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {images.length > 0 ? (
                      <div className="grid grid-cols-2 gap-3">
                        {images.map((image) => (
                          <div
                            key={image.id}
                            className="relative aspect-square rounded-lg overflow-hidden border-2 border-gray-200"
                          >
                            <img
                              src={image.preview}
                              alt={image.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-muted-foreground text-center py-8">
                        Нет изображений
                      </p>
                    )}
                  </CardContent>
                </Card>
              ) : (
                <AddImages
                  images={images}
                  setImages={setImages}
                  maxImages={10}
                  title="Изображения товара"
                  infoText="Первое изображение будет использоваться как основное. Максимум 10 файлов."
                />
              )}
            </div>
          </div>

          {/* Action Buttons */}
          {!isReadonly && (
            <div className="flex justify-end gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push('/dashboard/products')}
                disabled={isLoading}
              >
                Отмена
              </Button>
              <Button type="submit" disabled={isLoading} className="min-w-[120px]">
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <span className="animate-spin">⏳</span>
                    Сохранение...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <Save className="h-4 w-4" />
                    {isEdit ? "Обновить" : "Сохранить"}
                  </span>
                )}
              </Button>
            </div>
          )}
        </form>
      </Form>
    </div>
  </FormLanguageProvider>
  )
}
