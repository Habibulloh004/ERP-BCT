"use client"

import React, { useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"

import CustomFormField, { FormFieldType } from "@/components/shared/customFormField"
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Form } from "@/components/ui/form"
import { ArrowLeft, Save, X, Edit, Trash2 } from 'lucide-react'
import { toast } from 'sonner'
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
import { DataTable } from '../shared/DataTable'
import { getSerialColumns } from '@/lib/columns'
import { serialData } from '@/lib/data'
import { toastError, toastLoading, toastSuccess } from '@/lib/toast'
import { useTranslation } from 'react-i18next'

// Validation schema

export default function ClientForm({ type, data = null, clientId = null }) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const { t } = useTranslation();

  const ClientValidation = z.object({
  name: z.string().min(2, "Имя обязательно для заполнения").trim(),
  phone: z.string().min(9, "Некорректный номер телефона").trim(),
  email: z.string().email("Некорректный email адрес").trim(),
  orders: z.number().min(0, "Количество заказов не может быть отрицательным"),
})


  const columns = useMemo(() => getSerialColumns(t), [t]);

  // Form setup
  const form = useForm({
    resolver: zodResolver(ClientValidation),
    defaultValues: {
      name: data?.name || "",
      phone: data?.phone || "",
      email: data?.email || "",
      orders: data?.orders || 0,
    },
    mode: "onSubmit",
  })

  // Determine if fields should be readonly
  const isReadonly = type === 'show'
  const isEdit = type === 'edit'
  const isAdd = type === 'add'

  // Page titles
  const getPageTitle = () => {
    switch (type) {
      case 'add': return 'Новый клиент'
      case 'edit': return 'Азиз'
      case 'show': return 'Азиз'
      default: return 'Клиент'
    }
  }

  // Submit handler

  const onSubmit = async (values) => {
    const id = toastLoading({
      title: "Сохранение...",
      description: "Пожалуйста, подождите"
    });

    if (isReadonly) return

    setIsLoading(true)
    try {
      console.log(`${type} клиента:`, values)

      if (isAdd) {
        // API call for add
        // const response = await fetch('/api/clients', {
        //   method: 'POST',
        //   headers: { 'Content-Type': 'application/json' },
        //   body: JSON.stringify(values)
        // })
        await new Promise((r) => setTimeout(r, 1500));
        toast.dismiss(id);
        toastSuccess({
          title: "Успех!",
          description: "Новая запись успешно добавлена!"
        });
      } else if (isEdit) {
        // API call for edit
        // const response = await fetch(`/api/clients/${clientId}`, {
        //   method: 'PUT',
        //   headers: { 'Content-Type': 'application/json' },
        //   body: JSON.stringify(values)
        // })
        toast.dismiss(id);
        toastError({
          title: "Ошибка",
          description: "Не удалось сохранить изменения"
        });
      }
      await new Promise(resolve => setTimeout(resolve, 1000))

      router.push('/dashboard/clients')
    } catch (error) {
      console.error('Ошибка:', error)
      toast.error(`Произошла ошибка при ${isAdd ? 'добавлении' : 'обновлении'} клиента`)
    } finally {
      setIsLoading(false)
    }
  }

  // Delete handler
  const handleDelete = async () => {
    setIsDeleting(true)
    try {
      console.log('Удаление клиента:', clientId)

      // API call for delete
      // const response = await fetch(`/api/clients/${clientId}`, {
      //   method: 'DELETE'
      // })

      await new Promise(resolve => setTimeout(resolve, 1000))
      toast.success('Клиент успешно удален!')
      router.push('/dashboard/clients')
    } catch (error) {
      console.error('Ошибка:', error)
      toast.error('Произошла ошибка при удалении клиента')
    } finally {
      setIsDeleting(false)
    }
  }

  // Navigation handlers
  const handleEdit = () => {
    router.push(`/dashboard/clients/${clientId}?type=edit`)
  }

  const handleCancel = () => {
    router.push('/dashboard/clients')
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="icon"
            onClick={() => router.back()}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-2xl font-bold">{getPageTitle()}</h1>
        </div>

        {/* Action buttons for show mode */}
        {isReadonly && (
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={handleEdit}
            >
              <Edit className="h-4 w-4 mr-2" />
              Редактировать
            </Button>

            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive">
                  <Trash2 className="h-4 w-4 mr-2" />
                  Удалить
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Подтвердить удаление?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Вы действительно хотите удалить клиента "{data?.name}"?
                    Это действие нельзя будет отменить.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Отмена</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleDelete}
                    disabled={isDeleting}
                    className="bg-red-500 hover:bg-red-600"
                  >
                    {isDeleting ? 'Удаление...' : 'Да, удалить'}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        )}
      </div>

      {/* Form Card */}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="flex flex-col bg-white p-4 rounded-md gap-4">
            {/* Имя */}
            <CustomFormField
              fieldType={FormFieldType.INPUT}
              control={form.control}
              name="name"
              label="Имя Фамилия"
              placeholder="Введите имя и фамилию"
              disabled={isReadonly}
              required={true}
              inputClass={`h-11 text-black rounded-md border ${isReadonly ? 'bg-gray-50' : ''}`}
            />

            {/* Телефон */}
            <CustomFormField
              fieldType={FormFieldType.PHONE_INPUT}
              control={form.control}
              name="phone"
              label="Номер телефона"
              placeholder="+998 99 999-99-99"
              disabled={isReadonly}
              required={true}
              inputClass={`text-black rounded-md border ${isReadonly ? 'bg-gray-50' : ''}`}
            />

            {/* Email */}
            <CustomFormField
              fieldType={FormFieldType.INPUT}
              control={form.control}
              name="email"
              label="Email"
              placeholder="example@gmail.com"
              disabled={isReadonly}
              required={true}
              inputClass={`h-11 text-black rounded-md border ${isReadonly ? 'bg-gray-50' : ''}`}
            />
          </div>

          {/* Status info for show mode */}
          {isReadonly && data && (
            <div className="border-t pt-6 mt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">История покупок</h3>
              <DataTable columns={columns} allData={serialData} />
            </div>
          )}

          {/* Buttons - only show for add/edit modes */}
          {!isReadonly && (
            <div className="flex justify-end gap-3 pt-6">
              <Button
                type="button"
                variant="outline"
                onClick={handleCancel}
                disabled={isLoading}
              >
                <X className="h-4 w-4 mr-2" />
                Отмена
              </Button>
              <Button
                type="submit"
                disabled={isLoading}
              >
                <Save className="h-4 w-4 mr-2" />
                {isLoading
                  ? 'Сохранение...'
                  : isAdd
                    ? 'Сохранить'
                    : 'Сохранить изменения'
                }
              </Button>
            </div>
          )}
        </form>
      </Form>
    </div>
  )
}