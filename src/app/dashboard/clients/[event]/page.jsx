import React from 'react'
import { clients } from '@/lib/data' // Yoki real API dan olish
import ClientForm from '@/components/forms/ClientForm'

// Server component - "use client" yo'q
export default async function ClientEvent({ params, searchParams }) {
  const event = params.event
  const type = searchParams?.type
  
  // Server da ma'lumotlarni olish
  const getClientData = async (clientId) => {
    try {
      // Real API call:
      // const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/clients/${clientId}`, {
      //   cache: 'no-store' // yoki revalidate qo'shish
      // })
      // const client = await response.json()
      // return client
      
      // Temporary: mock data dan olish
      const client = clients.find(c => c.id === parseInt(clientId))
      return client || null
    } catch (error) {
      console.error('Ошибка получения данных клиента:', error)
      return null
    }
  }

  // Sahifa turini aniqlash
  const getPageType = () => {
    if (event === 'add') {
      return 'add'
    } else if (type === 'edit') {
      return 'edit'
    } else if (type === 'show') {
      return 'show'
    } else {
      // Default holatda show deb hisoblaymiz
      return 'show'
    }
  }

  const pageType = getPageType()
  const clientId = event !== 'add' ? event : null
  
  // Agar edit yoki show bo'lsa, client ma'lumotlarini olish
  let clientData = null
  if (clientId && (pageType === 'edit' || pageType === 'show')) {
    clientData = await getClientData(clientId)
    
    // Agar client topilmasa
    if (!clientData) {
      return (
        <div className='mx-auto w-11/12 max-w-4xl py-6'>
          <div className="text-center py-12">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Клиент не найден</h1>
            <p className="text-gray-600 mb-6">Клиент с ID {clientId} не найден в базе данных.</p>
            <a 
              href="/dashboard/clients" 
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Вернуться к списку клиентов
            </a>
          </div>
        </div>
      )
    }
  }

  return (
    <div className='mx-auto w-11/12 max-w-4xl py-6'>
      <ClientForm 
        type={pageType}
        data={clientData}
        clientId={clientId}
      />
    </div>
  )
}