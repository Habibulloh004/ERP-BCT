"use client"

import LanguageSwitcher from '@/components/shared/LanguageSwitcher'
import { cn } from '@/lib/utils'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React from 'react'
import { useTranslation } from 'react-i18next'
import NotificationDialog from './NotificationDialog'
import MenuDialog from './MenuDialog'

export default function DashboardHeader() {
  const { t } = useTranslation()
  const pathname = usePathname();

  const navLinks = [
    {
      name: t("header.dashboard.li1"),
      icon: "/headIcons/home.svg",
      link: "/dashboard"
    },
    {
      name: t("header.dashboard.li2"),
      icon: "/headIcons/user.svg",
      link: "/dashboard/clients"
    },
    {
      name: t("header.dashboard.li3"),
      icon: "/headIcons/product.svg",
      link: "/dashboard/products"
    },
    {
      name: t("header.dashboard.li4"),
      icon: "/headIcons/store.svg",
      link: "/dashboard/werehouses"
    },
    {
      name: t("header.dashboard.li5"),
      icon: "/headIcons/deal.svg",
      link: "/dashboard/deals"
    },
  ]

  // Active link tekshirish funksiyasi
  const isActiveLink = (link) => {
    if (link === "/dashboard") {
      return pathname === "/dashboard";
    } else {
      return pathname === link || pathname.startsWith(link + "/");
    }
  }

  return (
    <header className='fixed w-full h-20 bg-primary flex justify-between items-center gap-5 px-4 z-[999]'>
      <div className='flex gap-10'>
        <Image className='w-auto h-12' width={100} height={100} src="/logo.png" alt="logo" loading='eager' />
        
        {/* Navigation - faqat xl+ da ko'rsatish */}
        <nav className='hidden xl:flex justify-between items-center gap-5'>
          {navLinks?.map((nv, idx) => (
            <Link
              key={idx}
              href={nv?.link}
              className={cn(
                "px-3 py-2 rounded-md transition-all ease-linear duration-300 flex justify-center items-center gap-2 text-white",
                isActiveLink(nv?.link)
                  ? "bg-secondary"
                  : "hover:bg-secondary/60 hover:ring-ring hover:ring-2"
              )}
            >
              <Image src={nv?.icon} alt={nv?.name} width={30} height={30} />
              <h1 className='truncate w-24'>{nv?.name}</h1>
            </Link>
          ))}
        </nav>
      </div>
      
      <div className='flex gap-2'>
        <Link href="/dashboard/deals/add" className='px-3 h-12 w-full flex justify-center items-center gap-3 rounded-md bg-secondary hover:ring-ring hover:ring-2 hover:bg-secondary/70 transition-all duration-200 ease-linear text-white'>
          <Image src={"/headIcons/createDeal.svg"} alt={"new"} width={30} height={30} />
          <h1 className='hidden lg:block'>{t("header.dashboard.add-deal")}</h1>
        </Link>
        <NotificationDialog />
        <MenuDialog navLinks={navLinks} isActiveLink={isActiveLink} />
        <LanguageSwitcher />
      </div>
    </header>
  )
}