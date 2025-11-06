"use client"

import { redirect } from "next/navigation"

export default function SettingIndexPage() {
  redirect("/dashboard/setting/profile")
  return null
}

