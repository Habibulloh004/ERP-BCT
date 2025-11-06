"use client"

import { useRouter } from "next/navigation"
import { useEffect, useMemo, useState } from "react"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { ArrowLeft, Plus, X } from "lucide-react"
import { useTranslation } from "react-i18next"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { createFunnel } from "@/lib/actions"
import { useDealStore } from "@/store/dealStore"
import { toastError, toastSuccess } from "@/lib/toast"

const preprocessNumber = (value) => {
  if (typeof value === "number") return value
  if (typeof value === "string" && value.trim() !== "") {
    const parsed = Number(value)
    return Number.isNaN(parsed) ? value : parsed
  }
  return value
}

export default function AddFunnelPage() {
  const { t } = useTranslation()
  const router = useRouter()
  const loadFunnels = useDealStore((state) => state.loadFunnels)
  const funnels = useDealStore((state) => state.funnels)
  const [submitting, setSubmitting] = useState(false)

  const schema = useMemo(
    () =>
      z.object({
        name: z.string().min(2, t("funnelAdd.validation.name")),
        color: z
          .string()
          .regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, t("funnelAdd.validation.color")),
        comment: z.string().optional(),
        order: z.preprocess(
          preprocessNumber,
          z
            .number({ invalid_type_error: t("funnelAdd.validation.order") })
            .min(0, t("funnelAdd.validation.orderMin")),
        ),
      }),
    [t],
  )

  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      color: "#5B6FDD",
      comment: "",
      order: 0,
    },
  })

  const nextOrder = useMemo(() => {
    if (!funnels || funnels.length === 0) return 1
    const maxOrder = funnels
      .map((funnel) => Number(funnel.order ?? 0))
      .reduce((acc, value) => (Number.isFinite(value) ? Math.max(acc, value) : acc), 0)
    return maxOrder + 1
  }, [funnels])

  useEffect(() => {
    loadFunnels()
  }, [loadFunnels])

  useEffect(() => {
    form.setValue("order", nextOrder)
  }, [form, nextOrder])

  const handleSubmit = async (values) => {
    setSubmitting(true)
    try {
      await createFunnel({
        name: values.name,
        color: values.color,
        comment: values.comment,
        order: Number(values.order),
      })
      toastSuccess({ title: t("funnelAdd.toasts.success") })
      await loadFunnels(true)
      router.push("/dashboard/deals/funnels")
    } catch (error) {
      console.error("Failed to create funnel:", error)
      toastError({
        title: t("funnelAdd.toasts.error.title"),
        description: error?.message || t("funnelAdd.toasts.error.description"),
      })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="mx-auto w-11/12 max-w-3xl py-6 space-y-6">
      <div className="flex items-center gap-4">
        <Button
          variant="outline"
          size="icon"
          onClick={() => router.back()}
          aria-label={t("funnelAdd.buttons.back")}
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-3xl font-bold">{t("funnelAdd.title")}</h1>
      </div>

      <Card className="bg-white shadow-sm">
        <CardHeader>
          <CardTitle>{t("funnelAdd.sectionTitle")}</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="grid gap-6 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem className="sm:col-span-2">
                    <FormLabel>{t("funnelAdd.fields.name")}</FormLabel>
                    <FormControl>
                      <Input placeholder={t("funnelAdd.placeholders.name")} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="color"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("funnelAdd.fields.color")}</FormLabel>
                    <div className="flex items-center gap-3">
                      <FormControl>
                        <Input placeholder={t("funnelAdd.placeholders.color")} {...field} />
                      </FormControl>
                      <input
                        type="color"
                        value={field.value}
                        onChange={(event) => field.onChange(event.target.value)}
                        className="h-10 w-12 cursor-pointer rounded border border-gray-200"
                        aria-label={t("funnelAdd.colorPicker")}
                      />
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="order"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("funnelAdd.fields.order")}</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min={0}
                        step={1}
                        placeholder={t("funnelAdd.placeholders.order")}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="comment"
                render={({ field }) => (
                  <FormItem className="sm:col-span-2">
                    <FormLabel>{t("funnelAdd.fields.comment")}</FormLabel>
                    <FormControl>
                      <Textarea placeholder={t("funnelAdd.placeholders.comment")} rows={4} {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />

              <div className="sm:col-span-2 flex flex-col gap-3 sm:flex-row sm:justify-end">
                <Button
                  type="submit"
                  className="gap-2"
                  disabled={submitting}
                >
                  <Plus className="h-4 w-4" />{" "}
                  {submitting ? t("funnelAdd.buttons.saving") : t("funnelAdd.buttons.submit")}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className="gap-2"
                  onClick={() => router.back()}
                  disabled={submitting}
                >
                  <X className="h-4 w-4" /> {t("funnelAdd.buttons.cancel")}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}
