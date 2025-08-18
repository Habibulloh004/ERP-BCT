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
import { BellRing, Settings, LogOut } from 'lucide-react'
import Link from 'next/link'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import Cookies from 'js-cookie'
import { useAuth } from '@/components/providers/AuthProvider'
import { useTranslation } from 'react-i18next'

export default function MenuDialog() {
  const { t } = useTranslation()
  const [open, setOpen] = React.useState(false)
  const [logoutOpen, setLogoutOpen] = React.useState(false)
  const { clearAuth } = useAuth()

  const handleLogoutClick = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setOpen(false)
    setTimeout(() => setLogoutOpen(true), 100)
  }

  const handleLogOut = () => {
    Cookies.remove("authData");
    clearAuth()

  }
  return (
    <>
      <DropdownMenu className="" open={open} onOpenChange={setOpen}>
        <DropdownMenuTrigger asChild>
          <Button onClick={(e) => e.stopPropagation()} className='cursor-pointer p-0 flex justify-center items-center gap-3 rounded-md h-12 w-12 bg-secondary hover:ring-ring hover:ring-2 hover:bg-secondary/70 transition-all duration-200 ease-linear text-white relative'>
            <Image src={"/headIcons/burger.svg"} alt={"menu"} width={30} height={30} />
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent className="min-w-[300px] h-[400px] rounded-none space-y-2 mt-3 pt-3">
          <DropdownMenuItem className="bg-[#F8F9FA]" asChild>
            <Link href='/dashboard/setting' className="h-12 w-full flex justify-start items-center gap-2">
              <Button className='w-10 h-10 flex justify-center items-center'>
                <Settings className='text-white w-10 h-10' size={32} />
              </Button>
              <h1 className='text-lg'>
                {t("header.menuDialog.setting")}
              </h1>
            </Link>
          </DropdownMenuItem>

          <DropdownMenuItem className="bg-[#F8F9FA]" asChild>
            <Link href='/dashboard/setting/profile' className="h-12 w-full flex justify-start items-center gap-2">
              <Button className='w-10 h-10 flex justify-center items-center'>
                <BellRing className='text-white w-12 h-12' size={32} />
              </Button>
              <h1 className='text-lg'>
                {t("header.menuDialog.settingP")}
              </h1>
            </Link>
          </DropdownMenuItem>

          {/* Fixed logout item - no longer nested dialogs */}
          <DropdownMenuItem
            className="bg-[#F8F9FA] cursor-pointer"
            onClick={handleLogoutClick}
          >
            <div className="h-12 w-full flex justify-start items-center gap-2">
              <Button className='w-10 h-10 flex justify-center items-center'>
                <LogOut className='text-white w-10 h-10' size={32} />
              </Button>
              <h1 className='text-lg'>
                {t("header.menuDialog.logout")}
              </h1>
            </div>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Separate AlertDialog - not nested */}
      <AlertDialog open={logoutOpen} onOpenChange={setLogoutOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t("header.menuDialog.youSure")}</AlertDialogTitle>
            <AlertDialogDescription>
              {t("header.menuDialog.youSureDesc")}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Отмена</AlertDialogCancel>
            <AlertDialogAction onClick={handleLogOut}>Выйти</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}