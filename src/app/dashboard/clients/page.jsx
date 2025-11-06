"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { Loader2, Plus } from "lucide-react"
import { useTranslation } from "react-i18next"

import { DataTable } from "@/components/shared/DataTable"
import MenuTab from "@/components/shared/menuTab"
import { getClientsColumns } from "@/lib/columns"
import { getClients } from "@/lib/actions"
import { Button } from "@/components/ui/button"
import { toastError } from "@/lib/toast"

export default function ClientsPage() {
  const { t } = useTranslation()
  const columns = useMemo(() => getClientsColumns(t), [t])

  const [clients, setClients] = useState([])
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
    const loadClients = async () => {
      setLoading(true)
      try {
        const response = await getClients({ limit: 200 })
        const data = response?.data || response?.clients || response?.items || []
        setClients(Array.isArray(data) ? data : [])
      } catch (error) {
        console.error("Failed to load clients:", error)
        toastError({
          title: "Не удалось загрузить клиентов",
          description: error?.message,
        })
      } finally {
        setLoading(false)
      }
    }

    loadClients()
  }, [])

  return (
    <div className="w-11/12 mx-auto py-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Клиенты</h1>
        <Link href="/dashboard/clients/add">
          <Button variant="ghost" className="border-2 h-12 px-5 w-auto">
            <Plus className="h-4 w-4 mr-2" />
            Добавить клиента
          </Button>
        </Link>
      </div>

      <MenuTab menu={menu} />

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : (
        <DataTable
          columns={columns}
          allData={clients}
          defaultItemsPerPage={10}
          serverSide={false}
        />
      )}
    </div>
  )
}
