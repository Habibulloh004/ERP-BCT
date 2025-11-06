"use client"

import { useEffect, useMemo, useState } from "react"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import Cookies from "js-cookie"
import { useTranslation } from "react-i18next"

import { useAuth } from "@/components/providers/AuthProvider"
import { adminService } from "@/lib/api-services"
import { toast } from "sonner"
import { toastError, toastLoading, toastSuccess } from "@/lib/toast"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

const cookieOptions = {
  expires: 7,
  sameSite: "lax",
  path: "/",
}

const secureOption = typeof window !== "undefined" && window.location.protocol === "https:"

export default function AdminProfilePage() {
  const { t } = useTranslation()
  const { tokens, isAuthenticated, refreshFromCookies } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const [initialValues, setInitialValues] = useState({ name: "" })

  const ProfileSchema = useMemo(() => z.object({
    name: z.string().min(3, t("adminProfile.errors.name")),
    password: z.string().min(6, t("adminProfile.errors.password")),
    confirmPassword: z.string().min(6, t("adminProfile.errors.password")),
  }).refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: t("adminProfile.errors.passwordMatch"),
  }), [t])

  const form = useForm({
    resolver: zodResolver(ProfileSchema),
    defaultValues: {
      name: "",
      password: "",
      confirmPassword: "",
    },
  })

  useEffect(() => {
    const loadProfile = async () => {
      if (!tokens.accessToken) return
      try {
        setIsLoading(true)
        const profile = await adminService.profile(tokens.accessToken)
        setInitialValues({ name: profile?.name || "" })
        form.reset({ name: profile?.name || "", password: "", confirmPassword: "" })
      } catch (error) {
        console.error("Failed to fetch admin profile:", error)
        toastError({
          title: t("adminProfile.loadErrorTitle"),
          description: error.message || t("adminProfile.loadErrorDescription"),
        })
      } finally {
        setIsLoading(false)
      }
    }

    if (isAuthenticated) {
      loadProfile()
    }
  }, [isAuthenticated, tokens.accessToken, form, t])

  const handleSubmit = async (values) => {
    if (!tokens.accessToken) {
      toastError({
        title: t("adminProfile.authRequiredTitle"),
        description: t("adminProfile.authRequiredDescription"),
      })
      return
    }

    const loadingId = toastLoading({
      title: t("adminProfile.updatingTitle"),
      description: t("adminProfile.updatingDescription"),
    })

    try {
      const result = await adminService.update(
        { name: values.name.trim(), password: values.password },
        tokens.accessToken,
      )

      Cookies.set("authData", JSON.stringify(result.admin), {
        ...cookieOptions,
        secure: secureOption,
      })
      Cookies.set("accessToken", result.token, {
        ...cookieOptions,
        secure: secureOption,
      })

      refreshFromCookies()
      toastSuccess({
        title: t("adminProfile.successTitle"),
        description: t("adminProfile.successDescription"),
      })
      form.reset({ name: result.admin.name, password: "", confirmPassword: "" })
      setInitialValues({ name: result.admin.name })
    } catch (error) {
      console.error("Failed to update admin credentials:", error)
      toastError({
        title: t("adminProfile.errorTitle"),
        description: error.message || t("adminProfile.errorDescription"),
      })
    } finally {
      toast.dismiss(loadingId)
    }
  }

  if (!isAuthenticated) {
    return (
      <div className="mx-auto w-11/12 max-w-3xl py-10">
        <Card>
          <CardHeader>
            <CardTitle>{t("adminProfile.loginRequiredTitle")}</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            {t("adminProfile.loginRequiredDescription")}
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="mx-auto w-11/12 max-w-3xl py-10">
      <Card>
        <CardHeader>
          <CardTitle>{t("adminProfile.title")}</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("adminProfile.fields.login")}</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder={t("adminProfile.placeholders.login")} disabled={isLoading} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid gap-4 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("adminProfile.fields.password")}</FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          {...field}
                          placeholder={t("adminProfile.placeholders.password")}
                          disabled={isLoading}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("adminProfile.fields.confirmPassword")}</FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          {...field}
                          placeholder={t("adminProfile.placeholders.confirmPassword")}
                          disabled={isLoading}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="flex justify-end gap-3">
                <Button
                  type="button"
                  variant="outline"
                  disabled={isLoading}
                  onClick={() => form.reset({ ...initialValues, password: "", confirmPassword: "" })}
                >
                  {t("adminProfile.actions.reset")}
                </Button>
                <Button type="submit" disabled={isLoading}>
                  {t("adminProfile.actions.save")}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}
