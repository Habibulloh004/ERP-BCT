"use client"

import Image from 'next/image'
import React from 'react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from '@/components/ui/button'
import NewOrder from './NewOrder'
import { useTranslation } from 'react-i18next'

export default function NotificationDialog() {
  const { t } = useTranslation()
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button href="/dashboard/create-deal" className='p-0 flex justify-center items-center gap-3 rounded-md h-12 w-12 bg-secondary hover:ring-ring hover:ring-2 hover:bg-secondary/70 transition-all duration-200 ease-linear text-white relative'>
          <Image src={"/headIcons/notif.svg"} alt={"new"} width={30} height={30} />
          <div className='-top-1 -right-1 absolute p-2 w-7 h-7 flex justify-center items-center bg-red-400 text-[8px] rounded-full'>
            new
          </div>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className={"min-w-[300px] h-[400px] mt-3 rounded-none"}>
        <DropdownMenuLabel className={"text-center"}>{t("header.menuDialog.notif")}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem className={"bg-[#F8F9FA]"}>
          <NewOrder />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}