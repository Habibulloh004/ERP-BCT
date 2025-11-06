"use client"

import { useEffect, useState } from "react"
import { useParams, useSearchParams } from "next/navigation"
import { Loader2 } from "lucide-react"

import ClientForm from "@/components/forms/ClientForm"
import { getClientById } from "@/lib/actions"

export default function ClientEventPage() {
  const params = useParams()
  const searchParams = useSearchParams()
  const event = params.event
  const typeParam = searchParams?.get("type")

  const isAdd = event === "add"
  const pageType = isAdd ? "add" : typeParam === "edit" ? "edit" : "show"

  const clientId = !isAdd ? event : null
  const [clientData, setClientData] = useState(null)
  const [loading, setLoading] = useState(!isAdd)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!clientId) return

    const fetchClient = async () => {
      setLoading(true)
      try {
        const response = await getClientById(clientId)
        const data = response?.data || response
        setClientData(data)
      } catch (err) {
        console.error("Failed to fetch client:", err)
        setError(err?.message || "Не удалось загрузить клиента")
      } finally {
        setLoading(false)
      }
    }

    fetchClient()
  }, [clientId])

  if (!isAdd && loading) {
    return (
      <div className="mx-auto w-11/12 max-w-4xl py-6">
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </div>
    )
  }

  if (!isAdd && (error || !clientData)) {
    return (
      <div className="mx-auto w-11/12 max-w-4xl py-6 space-y-6">
        <h1 className="text-2xl font-bold text-gray-900">Клиент не найден</h1>
        <p className="text-muted-foreground">
          {error || `Клиент с ID ${clientId} не найден или был удалён.`}
        </p>
      </div>
    )
  }

  return <ClientForm type={pageType} data={clientData} clientId={clientId} />
}
