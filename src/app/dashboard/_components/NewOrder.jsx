import { Button } from '@/components/ui/button'
import { BellRing } from 'lucide-react'
import React from 'react'

export default function NewOrder() {
  return (
    <div className="h-12 w-full flex justify-start items-center gap-2">
      <Button className='bg-red-400 hover:bg-red-300 w-12 h-12 flex justify-center items-center'>
        <BellRing className='text-white w-12 h-12' size={32}/>
      </Button>
      <div className='w-full'>
        <h1 className='text-xl'>
          Новый заказ!
        </h1>
        <p className='text-[12px]'>Новый заказ с сайта!</p>
      </div>
    </div>
  )
}
