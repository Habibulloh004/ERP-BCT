"use client"

import { useMemo, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { toastError, toastSuccess } from "@/lib/toast"
import { ArrowLeft, Edit, Save, Trash2 } from "lucide-react"

import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
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
import { createCompany, updateCompany, deleteCompany } from "@/lib/actions"
import { useDealStore } from "@/store/dealStore"

const CompanySchema = z.object({
  name: z.string().min(2, "Название обязательно"),
  email: z.string().email("Некорректный email"),
  inn: z.string().min(5, "ИНН обязателен"),
  phone: z.string().min(7, "Некорректный телефон"),
  address: z.string().optional(),
  comment: z.string().optional(),
})

export default function CompanyForm({ type, data = null, companyId = null }) {
  const router = useRouter()
  const loadReferenceData = useDealStore((state) => state.loadReferenceData)
  const [isLoading, setIsLoading] = useState(false)

  const isReadonly = type === "show"
  const isEdit = type === "edit"
  const isAdd = type === "add"

  const defaultValues = useMemo(
    () => ({
      name: data?.name || "",
      email: data?.email || "",
      inn: data?.inn || data?.ctir || "",
      phone: data?.phone || "",
      address: data?.address || "",
      comment: data?.comment || "",
    }),
    [data],
  )

  const form = useForm({
    resolver: zodResolver(CompanySchema),
    defaultValues,
    mode: "onSubmit",
  })

  const handleSubmit = async (values) => {
    if (isReadonly) return
    setIsLoading(true)
    try {
      if (isEdit && companyId) {
        await updateCompany(companyId, values)
        toastSuccess({ title: "Компания обновлена" })
      } else {
        await createCompany(values)
        toastSuccess({ title: "Компания создана" })
      }
      await loadReferenceData(true)
      router.push("/dashboard/companies")
    } catch (error) {
      console.error("Company save error:", error)
      toastError({
        title: "Не удалось сохранить компанию",
        description: error?.message,
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!companyId) return
    setIsLoading(true)
    try {
      await deleteCompany(companyId)
      toastSuccess({ title: "Компания удалена" })
      await loadReferenceData(true)
      router.push("/dashboard/companies")
    } catch (error) {
      console.error("Company delete error:", error)
      toastError({
        title: "Не удалось удалить компанию",
        description: error?.message,
      })
    } finally {
      setIsLoading(false)
    }
  }

  const pageTitle = isAdd ? "Новая компания" : isEdit ? "Редактирование компании" : "Информация о компании"

  return (
    <div className="mx-auto w-11/12 max-w-4xl py-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold">{pageTitle}</h1>
            {companyId && !isAdd && (
              <p className="text-sm text-muted-foreground">ID компании: {companyId}</p>
            )}
          </div>
        </div>

        {isReadonly && companyId && (
          <div className="flex gap-2">
            <Link href={`/dashboard/companies/${companyId}?type=edit`}>
              <Button variant="outline" className="gap-2">
                <Edit className="h-4 w-4" /> Редактировать
              </Button>
            </Link>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" className="gap-2">
                  <Trash2 className="h-4 w-4" /> Удалить
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Удалить компанию?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Это действие нельзя отменить. Компания будет удалена безвозвратно.
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

      <Card className="bg-white shadow-sm">
        <CardHeader>
          <CardTitle>Основная информация</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Название компании</FormLabel>
                    <FormControl>
                      <Input placeholder="Введите название" disabled={isReadonly} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="info@example.com" disabled={isReadonly} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="inn"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>ИНН</FormLabel>
                    <FormControl>
                      <Input placeholder="Введите ИНН" disabled={isReadonly} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Телефон</FormLabel>
                    <FormControl>
                      <Input placeholder="+998" disabled={isReadonly} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem className="md:col-span-2">
                    <FormLabel>Адрес</FormLabel>
                    <FormControl>
                      <Input placeholder="Введите адрес" disabled={isReadonly} {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="comment"
                render={({ field }) => (
                  <FormItem className="md:col-span-2">
                    <FormLabel>Комментарий</FormLabel>
                    <FormControl>
                      <Textarea rows={4} placeholder="Дополнительная информация" disabled={isReadonly} {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />

              {data && !isAdd && (
                <div className="md:col-span-2 grid grid-cols-1 gap-3 rounded-lg border border-dashed border-gray-300 p-4 text-sm text-muted-foreground sm:grid-cols-2">
                  <div>
                    <span className="font-medium text-gray-900">Заказов:</span> {data.order_count ?? 0}
                  </div>
                  <div>
                    <span className="font-medium text-gray-900">Общая сумма:</span> {(data.total_amount ?? 0).toLocaleString()} сум
                  </div>
                  <div>
                    <span className="font-medium text-gray-900">Создано:</span> {data.created_at ? new Date(data.created_at).toLocaleString() : "—"}
                  </div>
                  <div>
                    <span className="font-medium text-gray-900">Обновлено:</span> {data.updated_at ? new Date(data.updated_at).toLocaleString() : "—"}
                  </div>
                </div>
              )}

              {!isReadonly && (
                <div className="md:col-span-2 flex justify-end gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => router.push("/dashboard/companies")}
                    disabled={isLoading}
                  >
                    Отмена
                  </Button>
                  <Button type="submit" className="gap-2" disabled={isLoading}>
                    <Save className="h-4 w-4" />
                    {isEdit ? "Сохранить" : "Добавить"}
                  </Button>
                </div>
              )}
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}
