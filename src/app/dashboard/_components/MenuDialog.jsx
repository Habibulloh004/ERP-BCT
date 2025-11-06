"use client"

import Image from 'next/image'
import React from 'react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
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
import { cn } from '@/lib/utils'

export default function MenuDialog({ navLinks, isActiveLink }) {
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
    Cookies.remove("accessToken");
    Cookies.remove("refreshToken");
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

        <DropdownMenuContent className="min-w-[300px] max-h-[500px] overflow-y-auto rounded-none space-y-2 mt-3 pt-3">
          
          {/* Navigation Links - faqat xl dan kichik ekranlarda */}
          <div className="xl:hidden">
            {navLinks?.map((nv, idx) => {
              if (nv.children) {
                const groupActive = nv.children.some((child) => isActiveLink(child.link))
                return (
                  <DropdownMenuSub key={idx}>
                    <DropdownMenuSubTrigger
                      className={cn(
                        "h-12 w-full flex justify-start items-center gap-3 transition-all duration-200 bg-[#F8F9FA]",
                        groupActive ? "bg-secondary/20 border-l-4 border-secondary" : ""
                      )}
                    >
                      <div className='w-10 h-10 flex justify-center items-center bg-secondary rounded-md'>
                        <Image src={nv?.icon} alt={nv?.name} width={24} height={24} />
                      </div>
                      <h1 className='text-lg font-medium'>{nv?.name}</h1>
                    </DropdownMenuSubTrigger>
                    <DropdownMenuSubContent className="min-w-[260px] space-y-1">
                      {nv.children.map((child, childIdx) => (
                        <DropdownMenuItem key={childIdx} asChild>
                          <Link
                            href={child.link}
                            className={cn(
                              "h-10 w-full flex items-center gap-3 rounded-md px-2 transition-colors",
                              isActiveLink(child.link)
                                ? "bg-secondary/20 text-secondary-foreground"
                                : "hover:bg-secondary/10"
                            )}
                          >
                            <div className='w-8 h-8 flex justify-center items-center bg-secondary/80 rounded-md'>
                              <Image src={child.icon} alt={child.name} width={20} height={20} />
                            </div>
                            <span className='text-sm font-medium'>{child.name}</span>
                          </Link>
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuSubContent>
                  </DropdownMenuSub>
                )
              }

              return (
                <DropdownMenuItem key={idx} asChild>
                  <Link 
                    href={nv?.link}
                    className={cn(
                      "h-12 w-full flex justify-start items-center gap-3 transition-all duration-200",
                      isActiveLink(nv?.link) 
                        ? "bg-secondary/20 border-l-4 border-secondary" 
                        : "bg-[#F8F9FA] hover:bg-secondary/10"
                    )}
                  >
                    <div className='w-10 h-10 flex justify-center items-center bg-secondary rounded-md'>
                      <Image src={nv?.icon} alt={nv?.name} width={24} height={24} />
                    </div>
                    <h1 className='text-lg font-medium'>{nv?.name}</h1>
                  </Link>
                </DropdownMenuItem>
              )
            })}
            <DropdownMenuSeparator className="my-2" />
          </div>

          {/* Settings */}
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

          {/* Profile Settings */}
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

          <DropdownMenuSeparator />

          {/* Logout */}
          <DropdownMenuItem
            className="bg-red-50 hover:bg-red-100 cursor-pointer"
            onClick={handleLogoutClick}
          >
            <div className="h-12 w-full flex justify-start items-center gap-2">
              <Button className='w-10 h-10 flex justify-center items-center bg-red-500 hover:bg-red-600'>
                <LogOut className='text-white w-10 h-10' size={32} />
              </Button>
              <h1 className='text-lg text-red-700 font-medium'>
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
