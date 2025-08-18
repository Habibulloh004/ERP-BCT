"use client"

import Image from 'next/image'
import React from 'react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from '@/components/ui/button'
import { BellRing, Settings } from 'lucide-react'
import Link from 'next/link'
import LogoutDialog from './LogoutDialog'

export default function NotificationDialog() {
  const [open, setOpen] = React.useState(false)

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button href="/dashboard/create-deal" className='cursor-pointer p-0 flex justify-center items-center gap-3 rounded-md h-12 w-12 bg-secondary hover:ring-ring hover:ring-2 hover:bg-secondary/70 transition-all duration-200 ease-linear text-white relative'>
          <Image src={"/headIcons/burger.svg"} alt={"new"} width={30} height={30} />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="min-w-[300px] h-[400px] mt-3 rounded-none space-y-2">
        <DropdownMenuItem className="bg-[#F8F9FA]">
          <Link href='/dashboard/setting' className="h-10 w-full flex justify-start items-center gap-2">
            <Button className='w-10 h-10 flex justify-center items-center'>
              <Settings className='text-white w-10 h-10' size={32} />
            </Button>
            <h1 className='text-lg'>
              Настройки
            </h1>
          </Link>
        </DropdownMenuItem>

        <DropdownMenuItem className="bg-[#F8F9FA]">
          <Link href='/dashboard/setting/profile' className="h-10 w-full flex justify-start items-center gap-2">
            <Button className='w-10 h-10 flex justify-center items-center'>
              <BellRing className='text-white w-12 h-12' size={32} />
            </Button>
            <h1 className='text-lg'>
              Настройки профиля
            </h1>
          </Link>
        </DropdownMenuItem>

        <DropdownMenuItem className="bg-[#F8F9FA]">
          <div>
            <LogoutDialog />
          </div>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
