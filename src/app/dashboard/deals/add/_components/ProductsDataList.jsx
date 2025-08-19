"use client"

import { Button } from '@/components/ui/button'
import { ArrowLeft, Plus, Minus } from 'lucide-react'
import Image from 'next/image'
import React, { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function ProductsDataList() {
  const router = useRouter()

  const [products, setProducts] = useState([
    { id: 1, name: "PM68", description: "PM68 — это мобильный компьютер с восьмиядерным процессором 2,0 ГГц и ....", image: "/photo.webp" },
    { id: 2, name: "PM86", description: "PM86 — это мобильный компьютер с восьмиядерным процессором 2,0 ГГц и ....", image: "/photo.webp" },
    { id: 3, name: "PM90", description: "PM90 — это мобильный компьютер с восьмиядерным процессором 2,0 ГГц и ....", image: "/photo.webp" },
    { id: 4, name: "PM95", description: "PM95 — это мобильный компьютер с восьмиядерным процессором 2,0 ГГц и ....", image: "/photo.webp" },
  ])

  // Cart state to track added products and their quantities
  const [cart, setCart] = useState({})

  // Add product to cart
  const addToCart = (productId) => {
    setCart(prev => ({
      ...prev,
      [productId]: 1
    }))
  }

  // Increase quantity
  const increaseQuantity = (productId) => {
    setCart(prev => ({
      ...prev,
      [productId]: (prev[productId] || 0) + 1
    }))
  }

  // Decrease quantity
  const decreaseQuantity = (productId) => {
    setCart(prev => {
      const newCart = { ...prev }
      if (newCart[productId] > 1) {
        newCart[productId] -= 1
      } else {
        delete newCart[productId]
      }
      return newCart
    })
  }

  return (
    <div className="mx-auto w-11/12 py-6 flex flex-col gap-6">
      {/* Header */}
      <div className="w-full flex items-center gap-4">
        <Button
          variant="outline"
          size="icon"
          onClick={() => router.back()}
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-3xl font-bold">{"PM86"}</h1>
      </div>

      {/* Products Grid */}
      <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-4'>
        {products?.map((product) => (
          <div key={product.id} className='overflow-hidden flex bg-white rounded-2xl p-4 shadow-sm border border-gray-100'>
            <div className='w-2/3 z-10'>
              <h2 className='text-lg font-bold text-gray-900 mb-2'>{product?.name}</h2>
              <p className='text-sm text-gray-600 mb-4 line-clamp-3'>{product?.description}</p>

              <div className='mt-auto'>
                {!cart[product.id] ? (
                  // Add Button
                  <Button
                    onClick={() => addToCart(product.id)}
                    className="h-11 w-full bg-gray-800  text-white rounded-xl font-medium text-sm"
                  >
                    Добавить
                  </Button>
                ) : (
                  // Quantity Controls
                  <div className="flex items-center justify-between bg-gray-800 rounded-xl h-11 px-3">
                    <button
                      onClick={() => decreaseQuantity(product.id)}
                      variant="ghost"
                      size="sm"
                      className="h-8 w-full p-0 text-white flex justify-center items-center rounded-lg"
                    >
                      <Minus className="h-4 w-4" />
                    </button>

                    <span className="w-5 text-center text-white font-semibold text-lg">
                      {cart[product.id]}
                    </span>

                    <button
                      onClick={() => increaseQuantity(product.id)}
                      variant="ghost"
                      size="sm"
                      className="h-8 w-full p-0 text-white flex justify-center items-center rounded-lg"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                )}
              </div>
            </div>
            <div className='relative w-1/3 flex justify-center mb-4'>
              <Image
                className='w-full h-40 object-contain opacity-0'
                src={product?.image}
                alt={product?.name}
                width={200}
                height={160}
              />
              <Image
                className='min-w-[200px] h-[200px] object-cover absolute -bottom-10 -right-20'
                src={product?.image}
                alt={product?.name}
                width={200}
                height={160}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}