
"use client"
import Link from 'next/link'
import React from 'react'
import { Button } from '../ui/button'

export default function MenuTab({ menu }) {
  return (
    <div className='space-y-3 ml-5'>
      {menu?.map((m, i) => {
        return (
          <Link key={i} href={m?.link ? m?.link : ""}>
            <Button size={"auto"} className={"mb-3 inline-flex px-5 rounded-xl min-w-[200px] mr-3 py-8 h-auto flex-col gap-2 text-start justify-start items-start"}>
              <h1 className='text-xl font-[300]'>{m?.title}</h1>
              <p className='text-[10px] text-[#999999]'>{m?.desc}</p>
            </Button>
          </Link>
        )
      })}
    </div>
  )
}
