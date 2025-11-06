"use client"

import { useMemo } from "react"
import { ChevronLeft, ChevronRight, Globe } from "lucide-react"

import { useFormLanguage } from "@/components/forms/FormLanguageContext"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { LANGUAGE_FLAGS } from "@/lib/multilingual"
import { cn } from "@/lib/utils"

export default function FormLanguageToolbar({ className }) {
  const formLanguage = useFormLanguage()

  if (!formLanguage) {
    return null
  }

  const { activeLanguage, setActiveLanguage, languages, activeIndex } = formLanguage
  const total = languages.length

  const prevLanguage = useMemo(() => {
    if (total === 0) return activeLanguage
    const nextIndex = (activeIndex - 1 + total) % total
    return languages[nextIndex].code
  }, [activeIndex, languages, total, activeLanguage])

  const nextLanguage = useMemo(() => {
    if (total === 0) return activeLanguage
    const nextIndex = (activeIndex + 1) % total
    return languages[nextIndex].code
  }, [activeIndex, languages, total, activeLanguage])

  const activeLabel = languages.find((lang) => lang.code === activeLanguage)?.label || ""

  return (
    <div
      className={cn(
        "rounded-3xl border border-blue-100 bg-blue-50 px-6 py-4 shadow-sm",
        className,
      )}
    >
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-500 text-white shadow">
            <Globe className="h-5 w-5" />
          </div>
          <div className="space-y-1">
            <p className="text-sm font-semibold text-blue-900">Forma tili</p>
            <p className="text-xs text-blue-700">
              Hozir tahrirlash:{" "}
              <span className="font-medium text-blue-900">{activeLabel || activeLanguage}</span>
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1">
            {languages.map((lang, index) => (
              <span
                key={lang.code}
                className={cn(
                  "h-2 w-2 rounded-full transition",
                  index === activeIndex ? "bg-blue-600" : "bg-blue-200",
                )}
              />
            ))}
          </div>

          <div className="flex items-center gap-2 rounded-2xl border border-blue-100 bg-white px-2 py-1.5 shadow-sm">
            <Button
              type="button"
              size="icon"
              variant="ghost"
              className="h-8 w-8 rounded-full text-blue-600 hover:bg-blue-50"
              onClick={() => setActiveLanguage(prevLanguage)}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>

            <Select value={activeLanguage} onValueChange={setActiveLanguage}>
              <SelectTrigger className="h-9 min-w-[140px] border-none bg-transparent px-2 text-sm font-medium text-blue-900 focus:ring-0">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {languages.map((lang) => (
                  <SelectItem key={lang.code} value={lang.code}>
                    <div className="flex items-center gap-2">
                      <span>{LANGUAGE_FLAGS[lang.code] || "🌐"}</span>
                      <span>{lang.label}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Button
              type="button"
              size="icon"
              variant="ghost"
              className="h-8 w-8 rounded-full text-blue-600 hover:bg-blue-50"
              onClick={() => setActiveLanguage(nextLanguage)}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
