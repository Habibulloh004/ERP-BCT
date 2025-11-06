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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ChevronDown } from 'lucide-react'

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
      name: t("header.dashboard.liGroup"),
      icon: "/headIcons/user.svg",
      children: [
        {
          name: t("header.dashboard.li2"),
          icon: "/headIcons/user.svg",
          link: "/dashboard/clients",
        },
        {
          name: t("header.dashboard.li6"),
          icon: "/headIcons/company.svg",
          link: "/dashboard/companies",
        },
        {
          name: t("header.dashboard.li7"),
          icon: "/headIcons/counterparty.svg",
          link: "/dashboard/counterparties",
        },
      ],
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
        <nav className='hidden xl:flex justify-between items-center gap-2'>
          {navLinks?.map((nv, idx) => {
            if (nv.children) {
              const groupActive = nv.children.some((child) => isActiveLink(child.link))
              return (
                <DropdownMenu key={idx}>
                  <DropdownMenuTrigger asChild>
                    <button
                      className={cn(
                        "px-2 py-2 rounded-md transition-all ease-linear duration-300 flex justify-center items-center gap-2 text-white",
                        groupActive
                          ? "bg-secondary"
                          : "hover:bg-secondary/60 hover:ring-ring hover:ring-2"
                      )}
                    >
                      <Image src={nv.icon} alt={nv.name} width={30} height={30} />
                      <h1 className='text-sm truncate w-20 text-left'>{nv.name}</h1>
                      <ChevronDown className='h-4 w-4' />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start" className="z-999 min-w-[200px]">
                    {nv.children.map((child, childIdx) => (
                      <DropdownMenuItem key={childIdx} asChild>
                        <Link
                          href={child.link}
                          className={cn(
                            "flex items-center gap-2 w-full rounded-md px-2 py-2 text-sm",
                            isActiveLink(child.link)
                              ? "bg-secondary/20 text-secondary-foreground"
                              : "text-foreground hover:bg-secondary/10"
                          )}
                        >
                          <Image src={child.icon} alt={child.name} width={20} height={20} />
                          <span>{child.name}</span>
                        </Link>
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              )
            }

            return (
              <Link
                key={idx}
                href={nv?.link}
                className={cn(
                  "px-2 py-2 rounded-md transition-all ease-linear duration-300 flex justify-center items-center gap-2 text-white",
                  isActiveLink(nv?.link)
                    ? "bg-secondary"
                    : "hover:bg-secondary/60 hover:ring-ring hover:ring-2"
                )}
              >
                <Image src={nv?.icon} alt={nv?.name} width={30} height={30} />
                <h1 className='text-sm truncate w-20'>{nv?.name}</h1>
              </Link>
            )
          })}
        </nav>
      </div>

      <div className='flex gap-2'>
        <NotificationDialog />
        <MenuDialog navLinks={navLinks} isActiveLink={isActiveLink} />
        <LanguageSwitcher />
      </div>
    </header>
  )
}
