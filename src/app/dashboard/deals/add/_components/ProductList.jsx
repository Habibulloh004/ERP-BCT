import { Button } from "@/components/ui/button"
import React, { useState } from "react"
import Image from "next/image"
import Link from "next/link"


export default function ProductList() {
  const [products, setProducts] = useState([
    { id: 1, name: "PM86", price: 1500000, qty: 1, image: "/photo.webp" },
    { id: 2, name: "PM86", price: 3000000, qty: 2, image: "/photo.webp" },
  ])

  const increaseQty = (id) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, qty: p.qty + 1 } : p))
    )
  }

  const decreaseQty = (id) => {
    setProducts((prev) =>
      prev.map((p) =>
        p.id === id && p.qty > 1 ? { ...p, qty: p.qty - 1 } : p
      )
    )
  }

  const removeProduct = (id) => {
    setProducts((prev) => prev.filter((p) => p.id !== id))
  }

  return (
    <div className="col-span-2">
      <div className="w-auto  bg-white p-5 rounded-md flex flex-col gap-4">
        <h1 className="text-xl font-medium">Товары</h1>

        <div className="flex flex-col gap-3">
          {products.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between bg-gray-50 rounded-md p-3"
            >
              {/* left side */}
              <div className="w-full flex flex-col gap-2">
                <div className="flex justify-between items-center gap-2">
                  <span className="font-semibold">{item.name}</span>
                  <span className="font-medium text-gray-700">
                    {item.price.toLocaleString()} сум
                  </span>
                </div>
                <div className="flex items-center gap-2 bg-[#1E1E2D] text-white px-4 py-2 rounded-md">
                  <button
                    onClick={() => decreaseQty(item.id)}
                    className="w-full px-2 text-lg"
                  >
                    –
                  </button>
                  <span className="text-center w-full text-lg">{item.qty}</span>
                  <button
                    onClick={() => increaseQty(item.id)}
                    className="w-full px-2 text-lg"
                  >
                    +
                  </button>
                </div>
                <button
                  onClick={() => removeProduct(item.id)}
                  className="text-xs text-gray-500 hover:text-red-500"
                >
                  Убрать
                </button>
              </div>

              {/* right side */}
              <div className="w-1/2 flex justify-center items-center gap-3">
                <Image
                  src={item.image}
                  alt={item.name}
                  width={100}
                  height={100}
                  className="rounded-md"
                />
              </div>
            </div>
          ))}
        </div>

        <Link href="/dashboard/deals/add/category" className="flex justify-center items-center pt-3">
          <Button className="bg-[#1E1E2D] h-11 text-white px-8 py-3 rounded-md">
            Добавить товар
          </Button>
        </Link>
      </div>
    </div>
  )
}
