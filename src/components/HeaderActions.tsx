"use client"

import { Printer, FilePlus2, Calculator } from "lucide-react"

import { Button } from "@/components/ui/button"

type HeaderActionsProps = {
  onPrintContract?: () => void
  onAddDocument?: () => void
  onCalculateTax?: () => void
}

export default function HeaderActions({
  onPrintContract,
  onAddDocument,
  onCalculateTax,
}: HeaderActionsProps) {
  return (
    <div className="flex flex-wrap gap-3">
      <Button
        type="button"
        className="flex items-center gap-2 bg-black px-5 py-2 text-white hover:bg-black/80"
        onClick={onPrintContract}
      >
        <Printer className="h-4 w-4" />
        Print Contract
      </Button>
      <Button
        type="button"
        variant="outline"
        className="flex items-center gap-2 border border-gray-300 px-5 py-2 text-gray-900 hover:bg-muted"
        onClick={onAddDocument}
      >
        <FilePlus2 className="h-4 w-4" />
        Add Document
      </Button>
      <Button
        type="button"
        variant="outline"
        className="flex items-center gap-2 border border-gray-300 px-5 py-2 text-gray-900 hover:bg-muted"
        onClick={onCalculateTax}
      >
        <Calculator className="h-4 w-4" />
        Calculate Tax
      </Button>
    </div>
  )
}
