"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { toastError, toastSuccess, toastWarning } from "@/lib/toast"
import { ArrowLeft, Edit, Save, Trash2 } from "lucide-react"

import MultilingualInput from "@/components/shared/MultilingualInput"
import AddImages from "@/components/shared/AddImages"
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
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
import { createCategory, updateCategory, deleteCategory } from "@/lib/actions"
import { parseMultilingual, stringifyMultilingual, hasMultilingualContent } from "@/lib/multilingual"
import { buildImageUrls } from "@/lib/utils/api-helpers"

const CategoryValidation = z.object({
  title: z
    .string({ required_error: "Название обязательно для заполнения" })
    .refine(
      (value) => hasMultilingualContent(parseMultilingual(value)),
      "Укажите название хотя бы на одном языке",
    ),
  description: z
    .string()
    .max(2000, "Описание слишком длинное")
    .optional()
    .or(z.literal("")),
})

export default function CategoryForm({ type, data = null, categoryId = null }) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const isReadonly = type === "show"
  const isEdit = type === "edit"
  const isAdd = type === "add"

  const [images, setImages] = useState(() => {
    const source = data?.images || data?.imageUrl || data?.image || data?.preview
    return source ? buildImageUrls(source) : []
  })

  const defaultValues = useMemo(
    () => ({
      title: data?.title || data?.name || "",
      description: data?.description || "",
    }),
    [data],
  )

  const form = useForm({
    resolver: zodResolver(CategoryValidation),
    defaultValues,
    mode: "onSubmit",
  })

  useEffect(() => {
    form.reset(defaultValues)
  }, [defaultValues, form])

  useEffect(() => {
    const source = data?.images || data?.imageUrl || data?.image || data?.preview
    setImages(source ? buildImageUrls(source) : [])
  }, [data])

  const onSubmit = async (values) => {
    if (isReadonly) return

    setIsLoading(true)
    try {
      const titleMultilingual = parseMultilingual(values.title)
      const descriptionMultilingual = parseMultilingual(values.description)

      const primaryImage = images[0]?.path || images[0]?.url || undefined

      if (!primaryImage) {
        toastWarning({ title: "Добавьте изображение категории перед сохранением." })
        setIsLoading(false)
        return
      }

      const payload = {
        title: stringifyMultilingual(titleMultilingual),
        name: stringifyMultilingual(titleMultilingual),
        description: hasMultilingualContent(descriptionMultilingual)
          ? stringifyMultilingual(descriptionMultilingual)
          : "",
        imageUrl: primaryImage,
        image: primaryImage,
      }

      if (isEdit && categoryId) {
        await updateCategory(categoryId, payload)
        toastSuccess({ title: "Категория успешно обновлена!" })
      } else {
        await createCategory(payload)
        toastSuccess({ title: "Категория успешно создана!" })
      }

      router.push("/dashboard/products/categories")
    } catch (error) {
      console.error("Error saving category:", error)
      toastError({
        title: "Не удалось сохранить категорию",
        description: error.message,
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!categoryId) return

    setIsLoading(true)
    try {
      await deleteCategory(categoryId)
      toastSuccess({ title: "Категория удалена" })
      router.push("/dashboard/products/categories")
    } catch (error) {
      console.error("Error deleting category:", error)
      toastError({
        title: "Не удалось удалить категорию",
        description: error.message,
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="mx-auto w-11/12 max-w-4xl py-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/dashboard/products/categories">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold">
              {isAdd && "Добавить категорию"}
              {isEdit && "Редактировать категорию"}
              {isReadonly && "Информация о категории"}
            </h1>
            {categoryId && (
              <p className="text-muted-foreground">ID категории: {categoryId}</p>
            )}
          </div>
        </div>

        {isReadonly && categoryId && (
          <div className="flex gap-2">
            <Link href={`/dashboard/products/categories/${categoryId}?type=edit`}>
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
                  <AlertDialogTitle>Удалить категорию?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Это действие нельзя отменить. Категория будет удалена безвозвратно.
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
        <form onSubmit={form.handleSubmit(onSubmit)} className="grid grid-cols-1 lg:grid-cols-[65%_35%] gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Основная информация</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Название</FormLabel>
                    <FormControl>
                      <MultilingualInput
                        value={parseMultilingual(field.value)}
                        onChange={(updated) => field.onChange(stringifyMultilingual(updated))}
                        placeholder="Введите название категории"
                        disabled={isReadonly || isLoading}
                        className="h-11 rounded-md border text-primary"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Описание</FormLabel>
                    <FormControl>
                      <MultilingualInput
                        type="textarea"
                        value={parseMultilingual(field.value)}
                        onChange={(updated) => field.onChange(stringifyMultilingual(updated))}
                        placeholder="Краткое описание категории"
                        disabled={isReadonly || isLoading}
                        className="rounded-md border"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

            </CardContent>
          </Card>

          <div className="space-y-4">
            <AddImages
              images={images}
              setImages={setImages}
              maxImages={1}
              title="Изображение категории"
              allowMultiple={false}
              infoText="Можно загрузить только одно изображение категории."
              sticky={!isReadonly}
              disabled={isReadonly || isLoading}
            />

            {(data?.createdAt || data?.created_at || data?.updatedAt || data?.updated_at) && (
              <Card>
                <CardHeader>
                  <CardTitle>Метаданные</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm text-muted-foreground">
                  {(data?.createdAt || data?.created_at) && (
                    <p>Создано: {new Date(data.createdAt || data.created_at).toLocaleString()}</p>
                  )}
                  {(data?.updatedAt || data?.updated_at) && (
                    <p>Обновлено: {new Date(data.updatedAt || data.updated_at).toLocaleString()}</p>
                  )}
                </CardContent>
              </Card>
            )}

            {!isReadonly && (
              <Button type="submit" className="w-full gap-2" disabled={isLoading}>
                <Save className="h-4 w-4" />
                {isEdit ? "Сохранить изменения" : "Создать категорию"}
              </Button>
            )}

            {isEdit && categoryId && (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button type="button" variant="destructive" className="w-full gap-2" disabled={isLoading}>
                    <Trash2 className="h-4 w-4" />
                    Удалить категорию
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Удалить категорию?</AlertDialogTitle>
                    <AlertDialogDescription>
                      Это действие нельзя отменить. Категория будет удалена безвозвратно.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Отмена</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDelete}>Удалить</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}
          </div>
        </form>
      </Form>
    </div>
  )
}
