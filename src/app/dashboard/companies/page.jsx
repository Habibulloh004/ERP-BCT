"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { Loader2, Plus } from "lucide-react"
import { useTranslation } from "react-i18next"

import { DataTable } from "@/components/shared/DataTable"
import MenuTab from "@/components/shared/menuTab"
import { Button } from "@/components/ui/button"
import { getCompaniesColumns } from "@/lib/columns"
import { getCompanies } from "@/lib/actions"
import { toastError } from "@/lib/toast"

export default function CompaniesPage() {
  const { t } = useTranslation()
  const columns = useMemo(() => getCompaniesColumns(t), [t])

  const [companies, setCompanies] = useState([])
  const [loading, setLoading] = useState(true)
  const menu = useMemo(
    () => [
      { title: "Клиенты", desc: "Список клиентов компании", link: "/dashboard/clients" },
      { title: "Компании", desc: "Все корпоративные клиенты", link: "/dashboard/companies" },
      { title: "Контрагенты", desc: "Партнёры и поставщики", link: "/dashboard/counterparties" },
    ],
    [],
  )

  useEffect(() => {
    const loadCompanies = async () => {
      setLoading(true)
      try {
        const response = await getCompanies({ limit: 200 })
        const data = response?.data || response?.companies || response?.items || []
        setCompanies(Array.isArray(data) ? data : [])
      } catch (error) {
        console.error("Failed to load companies:", error)
        toastError({
          title: "Не удалось загрузить компании",
          description: error?.message,
        })
      } finally {
        setLoading(false)
      }
    }

    loadCompanies()
  }, [])

  return (
    <div className="w-11/12 mx-auto py-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Компании</h1>
        <Link href="/dashboard/companies/add">
          <Button variant="ghost" className="border-2 h-12 px-5 w-auto">
            <Plus className="h-4 w-4 mr-2" /> Добавить компанию
          </Button>
        </Link>
      </div>

      <MenuTab menu={menu} />

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : (
        <DataTable columns={columns} allData={companies} defaultItemsPerPage={10} serverSide={false} />
      )}
    </div>
  )
}
