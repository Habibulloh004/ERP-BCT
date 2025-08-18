import { Button } from '@/components/ui/button'
import { BellRing } from 'lucide-react'
import React from 'react'
import { useTranslation } from 'react-i18next'

export default function NewOrder() {
  const { t } = useTranslation()
  return (
    <div className="h-12 w-full flex justify-start items-center gap-2">
      <Button className='bg-red-400 hover:bg-red-300 w-10 h-10 flex justify-center items-center'>
        <BellRing className='text-white w-12 h-12' size={32} />
      </Button>
      <div className='w-full'>
        <h1 className='text-xl'>
          {t("header.menuDialog.newOrder")}
        </h1>
        <p className='text-[12px]'>{t("header.menuDialog.newOrderSite")}</p>
      </div>
    </div>
  )
}
