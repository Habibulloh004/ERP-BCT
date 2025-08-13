"use client"

import LanguageSwitcher from '@/components/shared/LanguageSwitcher'
import React from 'react'
import { useTranslation } from 'react-i18next'

export default function HomePage() {
  const [t] = useTranslation("common")
  return (
    <div className='flex'>
    {t("header.dashboard.title")}
    </div>
  )
}
