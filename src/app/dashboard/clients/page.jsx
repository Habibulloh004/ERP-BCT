"use client"

import { DataTable } from '@/components/shared/DataTable'
import { clientsColumns } from '@/lib/columns'
import { clients } from '@/lib/data'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import React, { useState } from 'react'
import Link from 'next/link'

export default function ClientsPage() {
  return (
    <div className="w-11/12 mx-auto py-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Клиенты</h1>
        <Link href="/dashboard/clients/add">
          <Button variant={"ghost"} className={"border-2 h-12 px-5 w-auto"}>
            <Plus className="h-4 w-4 mr-2" />
            Добавить клиента
          </Button>
        </Link>
      </div>

      {/* DataTable o'zi hamma narsani boshqaradi */}
      <DataTable
        columns={clientsColumns}
        allData={clients}
        defaultItemsPerPage={10}
      />
    </div>
  )
}