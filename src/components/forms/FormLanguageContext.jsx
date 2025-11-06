"use client"

import { createContext, useContext, useMemo, useState } from "react"

import { LANGUAGES } from "@/lib/multilingual"

export const FormLanguageContext = createContext(null)
FormLanguageContext.displayName = "FormLanguageContext"

export function FormLanguageProvider({ initialLanguage, children }) {
  const defaultLanguage =
    LANGUAGES.find((lang) => lang.code === initialLanguage)?.code ?? LANGUAGES[0].code

  const [activeLanguage, setActiveLanguage] = useState(defaultLanguage)

  const value = useMemo(
    () => ({
      activeLanguage,
      setActiveLanguage,
      languages: LANGUAGES,
      activeIndex: LANGUAGES.findIndex((lang) => lang.code === activeLanguage),
    }),
    [activeLanguage],
  )

  return (
    <FormLanguageContext.Provider value={value}>{children}</FormLanguageContext.Provider>
  )
}

export function useFormLanguage() {
  return useContext(FormLanguageContext)
}
