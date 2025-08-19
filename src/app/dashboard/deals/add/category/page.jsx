"use client"

import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import { useRouter } from 'next/navigation'
import React from 'react'
import CategoryList from '../_components/CategoryList'

export default function CategoryPage() {
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
        <h1 className="text-3xl font-bold">{"Категории"}</h1>
      </div>
      <CategoryList/>
    </div>
  )
}
