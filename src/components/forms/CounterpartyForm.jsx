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
import { createCounterparty, updateCounterparty, deleteCounterparty } from "@/lib/actions"
import { useDealStore } from "@/store/dealStore"
import { splitFullName } from "@/lib/utils/text"

const CounterpartySchema = z.object({
  first_name: z.string().min(2, "Имя обязательно"),
  last_name: z.string().min(2, "Фамилия обязательна"),
  email: z.string().email("Некорректный email"),
  phone: z.string().min(9, "Некорректный номер телефона"),
  company: z.string().min(1, "Название компании обязательно"),
  company_phone: z.string().optional(),
  address: z.string().optional(),
  comment: z.string().optional(),
})

export default function CounterpartyForm({ type, data = null, counterpartyId = null }) {
  const router = useRouter()
  const loadReferenceData = useDealStore((state) => state.loadReferenceData)
  const [isLoading, setIsLoading] = useState(false)

  const isReadonly = type === "show"
  const isEdit = type === "edit"
  const isAdd = type === "add"

  const defaultValues = useMemo(() => {
    const fallbackSource =
      (typeof data?.name === "string" && data.name) ||
      (typeof data?.full_name === "string" && data.full_name) ||
      (typeof data?.fullName === "string" && data.fullName) ||
      ""
    const derived = splitFullName(fallbackSource)

    return {
      first_name:
        data?.first_name ||
        data?.firstname ||
        data?.firstName ||
        derived.first,
      last_name:
        data?.last_name ||
        data?.lastname ||
        data?.lastName ||
        derived.last,
      email: data?.email || "",
      phone: data?.phone || "",
      company: data?.company || "",
      company_phone: data?.company_phone || data?.phone_company || "",
      address: data?.address || "",
      comment: data?.comment || "",
    }
  }, [data])

  const form = useForm({
    resolver: zodResolver(CounterpartySchema),
    defaultValues,
    mode: "onSubmit",
  })

  const pageTitle = isAdd ? "Новый контрагент" : isEdit ? "Редактирование контрагента" : "Информация о контрагенте"

  const handleSubmit = async (values) => {
    if (isReadonly) return
    setIsLoading(true)
    try {
      if (isEdit && counterpartyId) {
        await updateCounterparty(counterpartyId, values)
        toastSuccess({ title: "Контрагент обновлён" })
      } else {
        await createCounterparty(values)
        toastSuccess({ title: "Контрагент создан" })
      }
      await loadReferenceData(true)
      router.push("/dashboard/counterparties")
    } catch (error) {
      console.error("Counterparty save error:", error)
      toastError({
        title: "Не удалось сохранить контрагента",
        description: error?.message,
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!counterpartyId) return
    setIsLoading(true)
    try {
      await deleteCounterparty(counterpartyId)
      toastSuccess({ title: "Контрагент удалён" })
      await loadReferenceData(true)
      router.push("/dashboard/counterparties")
    } catch (error) {
      console.error("Counterparty delete error:", error)
      toastError({
        title: "Не удалось удалить контрагента",
        description: error?.message,
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="mx-auto w-11/12 max-w-4xl py-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold">{pageTitle}</h1>
            {counterpartyId && !isAdd && (
              <p className="text-sm text-muted-foreground">ID контрагента: {counterpartyId}</p>
            )}
          </div>
        </div>

        {isReadonly && counterpartyId && (
          <div className="flex gap-2">
            <Link href={`/dashboard/counterparties/${counterpartyId}?type=edit`}>
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
                  <AlertDialogTitle>Удалить контрагента?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Это действие нельзя отменить. Контрагент будет удалён безвозвратно.
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
          <CardTitle>Контактные данные</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <FormField
                control={form.control}
                name="first_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Имя</FormLabel>
                    <FormControl>
                      <Input placeholder="Введите имя" disabled={isReadonly} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="last_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Фамилия</FormLabel>
                    <FormControl>
                      <Input placeholder="Введите фамилию" disabled={isReadonly} {...field} />
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
                      <Input placeholder="name@example.com" disabled={isReadonly} {...field} />
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
                name="company"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Компания</FormLabel>
                    <FormControl>
                      <Input placeholder="Введите название компании" disabled={isReadonly} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="company_phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Телефон компании</FormLabel>
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

              {!isReadonly && (
                <div className="md:col-span-2 flex justify-end gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => router.push("/dashboard/counterparties")}
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
