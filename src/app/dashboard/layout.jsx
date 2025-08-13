import React from 'react'
import DashboardHeader from './_components/DashboardHeader'

export default function DashboardLayout({ children }) {
  return (
    <>
      <DashboardHeader />
      <div className='pt-20'>
        {children}
      </div>
    </>
  )
}
