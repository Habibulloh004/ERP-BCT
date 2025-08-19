"use client"

import DealForm from '@/components/forms/DealForm'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import React from 'react'
import ProductList from './_components/ProductList'

export default function AddDeal() {
  const router = useRouter()
  return (
    <div className="mx-auto w-11/12 py-6 flex flex-col gap-3">
      <div className="w-full flex items-center gap-4">
        <Button
          variant="outline"
          size="icon"
          onClick={() => router.back()}
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-3xl font-bold">{"Новая сделка"}</h1>
      </div>
      <div className='grid grid-cols-1 lg:grid-cols-5 gap-3'>
        <DealForm />
          <ProductList />
      </div>
    </div>

  )
}
