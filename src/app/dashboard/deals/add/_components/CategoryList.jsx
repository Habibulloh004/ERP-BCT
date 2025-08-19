"use client"
import Image from 'next/image'
import Link from 'next/link'
import React, { useState } from 'react'

export default function CategoryList() {
  const [categories, setCategories] = useState([
    { id: 1, name: "PM86", price: 1500000, qty: 1, image: "/photo.webp" },
    { id: 2, name: "PM86", price: 3000000, qty: 2, image: "/photo.webp" },
  ])
  return (
    <div className='grid grid-cols-4 lg:grid-cols-5 gap-3'>
      {categories?.map((ct, idx) => (
        <Link key={idx} href={`/dashboard/deals/add/category/${ct?.id}`} className='rounded-2xl'>
          <div className='bg-white flex flex-col justify-center items-center gap-2 py-4'>
            <Image className='h-[150px] w-full object-contain' src={ct?.image} alt='img' width={100} height={100} />
            <h1>{ct?.name}</h1>
          </div>
        </Link>
      ))}
    </div>
  )
}
