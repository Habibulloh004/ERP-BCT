"use client"

import React from 'react'
import { useScreenSize } from '@/hooks/useScreenSize'
import { Monitor, Smartphone } from 'lucide-react'

export default function ScreenSizeGate({ children }) {
  const { isDesktop, width } = useScreenSize()

  // Server rendering uchun initial state
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  // Server side rendering da hech narsa ko'rsatmaslik
  if (!mounted) {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Loading state yoki bo'sh */}
      </div>
    )
  }

  // Agar ekran kichik bo'lsa, warning ko'rsatish
  if (!isDesktop) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
          {/* Icon */}
          <div className="flex justify-center items-center space-x-2 mb-6">
            <Monitor className="h-12 w-12 text-blue-600" />
            <div className="text-3xl text-gray-400">/</div>
            <Smartphone className="h-10 w-10 text-gray-400" />
          </div>

          {/* Title */}
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Сайт для больших экранов
          </h1>

          {/* Description */}
          <p className="text-gray-600 mb-6 leading-relaxed">
            Этот сайт предназначен для использования на устройствах 
            с шириной экрана от <span className="font-semibold text-blue-600">1000px</span> и выше.
          </p>

          {/* Current screen info */}
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-sm text-red-700">
              <span className="font-medium">Текущая ширина экрана:</span> {width}px
            </p>
            <p className="text-xs text-red-600 mt-1">
              Минимально требуется: 1000px
            </p>
          </div>

          {/* Instructions */}
          <div className="space-y-3 text-sm text-gray-500">
            <div className="flex items-center justify-center space-x-2">
              <Monitor className="h-4 w-4" />
              <span>Используйте компьютер или ноутбук</span>
            </div>
            <div className="flex items-center justify-center space-x-2">
              <span className="text-lg">⚡</span>
              <span>Увеличьте размер окна браузера</span>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <p className="text-xs text-gray-400">
              Спасибо за понимание
            </p>
          </div>
        </div>
      </div>
    )
  }

  // Agar ekran katta bo'lsa, normal content ko'rsatish
  return (
    <div className="min-w-[1000px]">
      {children}
    </div>
  )
}